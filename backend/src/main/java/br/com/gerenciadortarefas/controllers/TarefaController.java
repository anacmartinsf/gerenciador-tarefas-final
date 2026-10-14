package br.com.gerenciadortarefas.controllers;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import br.com.gerenciadortarefas.entidades.Tarefa;
import br.com.gerenciadortarefas.services.TarefaService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tarefas")
@CrossOrigin(origins = {"http://localhost:4200"})
public class TarefaController {
    private final TarefaService service;
    public TarefaController(TarefaService service) { this.service = service; }
    @GetMapping public List<Tarefa> listarTodas() { return service.listarTodas(); }
    @GetMapping("/{id}") public Tarefa buscarPorId(@PathVariable String id) { return service.buscarPorId(id); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED) public Tarefa cadastrar(@Valid @RequestBody Tarefa tarefa) { return service.cadastrar(tarefa); }
    @PutMapping("/{id}") public Tarefa atualizar(@PathVariable String id, @Valid @RequestBody Tarefa tarefa) { return service.atualizar(id, tarefa); }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void excluir(@PathVariable String id) { service.excluir(id); }
}
