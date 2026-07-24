package com.example.back;

import java.util.List;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api")
public class ChatController {

    // Contrat avec Angular : { "messages": [ { "role": "user", "content": "..." } ]
    // }
    public record ChatMessage(String role, String content) {
    }

    public record ChatRequest(List<ChatMessage> messages) {
    }

    private static final int MAX_MESSAGES = 20;
    private static final int MAX_CHARS = 4000;
    private static final Set<String> ALLOWED_ROLES = Set.of("user", "assistant");

    private final OpenRouterService openRouter;

    // Injection de dépendances : Spring fournit le service tout seul
    public ChatController(OpenRouterService openRouter) {
        this.openRouter = openRouter;
    }

    @PostMapping(value = "/chat", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<String>> chat(@RequestBody ChatRequest request) {
        validate(request);
        return openRouter.stream(request.messages());
    }

    // Le front n'est pas digne de confiance : on valide tout ici
    private void validate(ChatRequest request) {
        if (request == null || request.messages() == null || request.messages().isEmpty()
                || request.messages().size() > MAX_MESSAGES) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid messages");
        }
        for (ChatMessage m : request.messages()) {
            boolean valid = m != null
                    && ALLOWED_ROLES.contains(m.role())
                    && m.content() != null
                    && !m.content().isBlank()
                    && m.content().length() <= MAX_CHARS;
            if (!valid) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid message");
            }
        }
    }
}