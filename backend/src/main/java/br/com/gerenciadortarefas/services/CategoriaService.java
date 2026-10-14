package br.com.gerenciadortarefas.services;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import br.com.gerenciadortarefas.entidades.Categoria;
import br.com.gerenciadortarefas.repositorys.CategoriaRepository;
import br.com.gerenciadortarefas.repositorys.TarefaRepository;

@Service
public class CategoriaService {
    private final CategoriaRepository categoriaRepository;
    private final TarefaRepository tarefaRepository;

    public CategoriaService(CategoriaRepository categoriaRepository, TarefaRepository tarefaRepository) {
        this.categoriaRepository = categoriaRepository;
        this.tarefaRepository = tarefaRepository;
    }
    public List<Categoria> listarTodas() { return categoriaRepository.findAll(); }
    public Categoria buscarPorId(String id) {
        return categoriaRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria não encontrada: " + id));
    }
    public Categoria cadastrar(Categoria categoria) { categoria.setId(null); return categoriaRepository.save(categoria); }
    public Categoria atualizar(String id, Categoria dados) {
        Categoria atual = buscarPorId(id);
        atual.setNome(dados.getNome());
        atual.setDescricao(dados.getDescricao());
        return categoriaRepository.save(atual);
    }
    public void excluir(String id) {
        Categoria categoria = buscarPorId(id);
        if (tarefaRepository.existsByCategoriaId(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Não é possível excluir uma categoria que possui tarefas associadas.");
        }
        categoriaRepository.delete(categoria);
    }
}
