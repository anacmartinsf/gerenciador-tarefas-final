package br.com.gerenciadortarefas.services;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import br.com.gerenciadortarefas.entidades.Categoria;
import br.com.gerenciadortarefas.entidades.Tarefa;
import br.com.gerenciadortarefas.repositorys.CategoriaRepository;
import br.com.gerenciadortarefas.repositorys.TarefaRepository;

@Service
public class TarefaService {
    private final TarefaRepository tarefaRepository;
    private final CategoriaRepository categoriaRepository;

    public TarefaService(TarefaRepository tarefaRepository, CategoriaRepository categoriaRepository) {
        this.tarefaRepository = tarefaRepository;
        this.categoriaRepository = categoriaRepository;
    }
    public List<Tarefa> listarTodas() { return tarefaRepository.findAll(); }
    public Tarefa buscarPorId(String id) {
        return tarefaRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada: " + id));
    }
    public Tarefa cadastrar(Tarefa tarefa) {
        tarefa.setId(null);
        validarCategoria(tarefa.getCategoriaId());
        return tarefaRepository.save(tarefa);
    }
    public Tarefa atualizar(String id, Tarefa dados) {
        Tarefa atual = buscarPorId(id);
        validarCategoria(dados.getCategoriaId());
        atual.setTitulo(dados.getTitulo());
        atual.setDescricao(dados.getDescricao());
        atual.setStatus(dados.getStatus());
        atual.setDataVencimento(dados.getDataVencimento());
        atual.setCategoriaId(dados.getCategoriaId());
        return tarefaRepository.save(atual);
    }
    public void excluir(String id) { tarefaRepository.delete(buscarPorId(id)); }
    private void validarCategoria(String categoriaId) {
        if (categoriaId != null && !categoriaId.isBlank() && !categoriaRepository.existsById(categoriaId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A categoria informada não existe.");
        }
    }
}
