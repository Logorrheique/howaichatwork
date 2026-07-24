package com.example.back;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import reactor.core.publisher.Flux;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@Service
public class OpenRouterService {

    private static final Logger log = LoggerFactory.getLogger(OpenRouterService.class);
    private static final ObjectMapper MAPPER = new ObjectMapper();

    private final WebClient client;
    private final String model;

    public OpenRouterService(
            @Value("${openrouter.api-key}") String apiKey,
            @Value("${openrouter.model}") String model) {
        this.model = model;
        this.client = WebClient.builder()
                .baseUrl("https://openrouter.ai/api/v1/")
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .build();
    }

    public Flux<ServerSentEvent<String>> stream(List<com.example.back.ChatController.ChatMessage> messages) {
        // Le modèle et la limite de tokens sont fixés ici, jamais par le front
        Map<String, Object> body = Map.of(
                "model", model,
                "messages", messages,
                "stream", true,
                "max_tokens", 1024);

        return client.post()
                .uri("/chat/completions")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.TEXT_EVENT_STREAM)
                .bodyValue(body)
                .retrieve()
                // WebClient lit le flux SSE d'OpenRouter et nous donne le contenu de chaque
                // "data:"
                .bodyToFlux(String.class)
                // OpenRouter termine le flux avec "data: [DONE]"
                .takeWhile(data -> !"[DONE]".equals(data.trim()))
                .map(this::extractDelta)
                .filter(delta -> !delta.isEmpty())
                // On renvoie à Angular un événement "message" par morceau de texte
                .map(delta -> event("message", toJson(delta)))
                .concatWith(Flux.just(event("done", "{}")))
                // Si OpenRouter échoue en plein flux, on prévient Angular avec un événement
                // "error"
                .onErrorResume(e -> {
                    if (e instanceof WebClientResponseException ex) {
                        log.error("Erreur OpenRouter : {} - {}", ex.getStatusCode(), ex.getResponseBodyAsString());
                    } else {
                        log.error("Erreur OpenRouter : {}", e.getMessage());
                    }
                    return Flux.just(event("error", toJson("Erreur du service de chat")));
                });
    }

    // Extrait choices[0].delta.content d'un chunk JSON au format OpenAI
    private String extractDelta(String data) {
        try {
            JsonNode content = MAPPER.readTree(data)
                    .path("choices").path(0).path("delta").path("content");
            return content.isString() ? content.asString() : "";
        } catch (Exception e) {
            return "";
        }
    }

    private String toJson(String text) {
        try {
            return MAPPER.writeValueAsString(Map.of("delta", text));
        } catch (Exception e) {
            return "{}";
        }
    }

    private ServerSentEvent<String> event(String name, String data) {
        return ServerSentEvent.<String>builder().event(name).data(data).build();
    }
}