package br.com.gerenciadortarefas.repositorys;

import org.springframework.data.mongodb.repository.MongoRepository;
import br.com.gerenciadortarefas.entidades.Categoria;

public interface CategoriaRepository extends MongoRepository<Categoria, String> {}
