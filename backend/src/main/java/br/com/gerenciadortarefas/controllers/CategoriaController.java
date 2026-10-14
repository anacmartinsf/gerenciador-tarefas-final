package br.com.gerenciadortarefas.controllers;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import br.com.gerenciadortarefas.entidades.Categoria;
import br.com.gerenciadortarefas.services.CategoriaService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = {"http://localhost:4200"})
public class CategoriaController {
    private final CategoriaService service;
    public CategoriaController(CategoriaService service) { this.service = service; }
    @GetMapping public List<Categoria> listarTodas() { return service.listarTodas(); }
    @GetMapping("/{id}") public Categoria buscarPorId(@PathVariable String id) { return service.buscarPorId(id); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED) public Categoria cadastrar(@Valid @RequestBody Categoria categoria) { return service.cadastrar(categoria); }
    @PutMapping("/{id}") public Categoria atualizar(@PathVariable String id, @Valid @RequestBody Categoria categoria) { return service.atualizar(id, categoria); }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void excluir(@PathVariable String id) { service.excluir(id); }
}
