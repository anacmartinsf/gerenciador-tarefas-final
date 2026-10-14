package br.com.gerenciadortarefas.repositorys;

import org.springframework.data.mongodb.repository.MongoRepository;
import br.com.gerenciadortarefas.entidades.Tarefa;

public interface TarefaRepository extends MongoRepository<Tarefa, String> {
    boolean existsByCategoriaId(String categoriaId);
}
