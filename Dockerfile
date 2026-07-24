# Un seul service : Spring sert le front prérendu (même origine que /api, donc pas de CORS).
FROM node:24-slim AS front
WORKDIR /front
COPY front/package.json front/package-lock.json ./
RUN npm ci
COPY front/ ./
RUN npm run build

FROM maven:3-eclipse-temurin-25 AS back
WORKDIR /back
COPY back/pom.xml ./
COPY back/src ./src
COPY --from=front /front/dist/howaichatwork/browser ./src/main/resources/static
RUN mvn -q -DskipTests package

FROM eclipse-temurin:25-jre
COPY --from=back /back/target/back-0.0.1-SNAPSHOT.jar /app.jar
# Render impose le port via PORT ; la clé arrive par OPENROUTER_API_KEY.
CMD ["sh", "-c", "exec java -XX:MaxRAMPercentage=70 -Dserver.port=${PORT:-8080} -jar /app.jar"]
