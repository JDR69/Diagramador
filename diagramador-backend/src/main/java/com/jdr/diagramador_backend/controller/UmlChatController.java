package com.jdr.diagramador_backend.controller;


import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.jdr.diagramador_backend.dto.UmlChatRequest;
import java.util.Map;

@RestController
@RequestMapping("/api/uml-chat")
public class UmlChatController {

    @PostMapping
    public ResponseEntity<Map<String, Object>> chat(@RequestBody UmlChatRequest request) {
        String prompt = request.getPrompt() != null ? request.getPrompt() : "";
        String response;
        Map<String, Object> diagram = null;
        if (prompt.toLowerCase().contains("dos diagramas de clase")) {
            response = "¡Listo! Se agregaron dos clases y una relación de asociación (respuesta simulada desde backend).";
            // Ejemplo de instrucciones estructuradas para el frontend
            diagram = Map.of(
                "nodes", java.util.List.of(
                    Map.of("id", "1", "label", "Persona", "attributes", java.util.List.of("nombre", "edad")),
                    Map.of("id", "2", "label", "Estudiante", "attributes", java.util.List.of("matricula"))
                ),
                "edges", java.util.List.of(
                    Map.of("id", "e1", "source", "2", "target", "1", "type", "herencia")
                )
            );
        } else {
            response = "No entendí tu petición, pero puedo ayudarte con diagramas de clase (respuesta backend).";
        }
        Map<String, Object> result = new java.util.HashMap<>();
        result.put("response", response);
        if (diagram != null) result.put("diagram", diagram);
        return ResponseEntity.ok(result);
    }
}
