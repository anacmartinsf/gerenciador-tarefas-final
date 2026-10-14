package br.com.gerenciadortarefas.excecoes;

import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class TratadorDeErros {
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> tratarStatus(ResponseStatusException ex) {
        Map<String, String> corpo = new LinkedHashMap<>();
        corpo.put("erro", ex.getReason() == null ? "Não foi possível concluir a operação." : ex.getReason());
        return ResponseEntity.status(ex.getStatusCode()).body(corpo);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> tratarValidacao(MethodArgumentNotValidException ex) {
        Map<String, String> corpo = new LinkedHashMap<>();
        String mensagem = ex.getBindingResult().getFieldErrors().isEmpty() ? "Dados inválidos." : ex.getBindingResult().getFieldErrors().get(0).getDefaultMessage();
        corpo.put("erro", mensagem);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(corpo);
    }
}
