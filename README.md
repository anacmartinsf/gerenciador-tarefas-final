# Gerenciador de Tarefas — Fases 1 e 2

Projeto acadêmico para a disciplina **Integrar Interfaces Web e Serviços Web**, do curso de Análise e Desenvolvimento de Sistemas.

O sistema permite organizar tarefas por categoria. O backend é uma API REST em Java/Spring Boot e o frontend é uma aplicação Angular que consome essa API. A persistência foi adaptada para MongoDB, conforme a orientação da entrega final.

## Integrante

- Nome completo: Ana Carolina Martins Ferreira — Matrícula: 2525050041

## Tecnologias

- Java 17 e Spring Boot
- Spring Web, Spring Data MongoDB e Bean Validation
- MongoDB local ou MongoDB Atlas
- Angular 20, TypeScript, Router, Forms e HttpClient
- Maven e npm

## Estrutura

```text
gerenciador-tarefas/
├── backend/
│   ├── pom.xml
│   └── src/main/java/br/com/gerenciadortarefas/
│       ├── entidades/
│       ├── repositorys/
│       ├── services/
│       ├── controllers/
│       └── excecoes/
├── frontend/
│   ├── package.json
│   └── src/app/
│       ├── models/
│       ├── services/
│       └── pages/
└── README.md
```

## O que a aplicação faz

- Lista, cadastra, edita, consulta por ID e exclui tarefas.
- Lista, cadastra, edita, consulta por ID e exclui categorias.
- Permite associar uma tarefa a uma categoria existente.
- Impede excluir uma categoria que ainda esteja sendo utilizada por tarefas.
- Valida os campos principais e apresenta mensagens de erro no frontend.

## Requisitos para executar

Instale:

1. JDK 17 ou superior.
2. Maven 3.9 ou superior.
3. Node.js compatível com Angular 20 (Node 20.19+ ou 22.12+ recomendado) e npm.
4. MongoDB Community Server local ou uma instância MongoDB Atlas.

## 1. Iniciar o MongoDB

### Opção rápida com Docker

Se o Docker Desktop estiver instalado e iniciado, abra um terminal na pasta raiz do projeto e execute:

```bash
docker compose up -d mongodb
```

Isso inicia um MongoDB local na porta `27017`. Para parar o serviço, execute `docker compose down` (os dados ficam no volume local).

### MongoDB local

Inicie o serviço MongoDB instalado no computador. A configuração padrão do backend usa:

```text
mongodb://localhost:27017/gerenciador_tarefas
```

O banco e as coleções serão criados pelo MongoDB quando a aplicação gravar os primeiros documentos.

### MongoDB Atlas

Crie um cluster e um usuário de banco, permita o acesso de rede necessário e copie a URI de conexão. Não coloque usuário e senha diretamente no código nem publique a URI em um repositório.

Defina a variável de ambiente `MONGODB_URI` antes de iniciar o backend. Exemplo no PowerShell (substitua pelo endereço real, sem compartilhar a credencial):

```powershell
$env:MONGODB_URI="mongodb+srv://USUARIO:SENHA@SEU-CLUSTER/gerenciador_tarefas?retryWrites=true&w=majority"
```

## 2. Iniciar o backend

Abra um terminal na pasta `backend` (a pasta que contém `pom.xml`) e execute:

```bash
mvn spring-boot:run
```

A API ficará disponível em `http://localhost:8080`. Para compilar e executar os testes disponíveis:

```bash
mvn clean test
```

O frontend espera que a API esteja nesse endereço. O CORS está configurado para desenvolvimento em `http://localhost:4200`.

## 3. Iniciar o frontend

Em outro terminal, entre na pasta `frontend` e execute:

```bash
npm install
npm start
```

Abra `http://localhost:4200`. Para conferir a compilação de produção:

```bash
npm run build
```

Mantenha MongoDB e backend ativos enquanto utilizar o frontend. Se o navegador apresentar erro de conexão, confira primeiro se a API iniciou sem erros e se o MongoDB está acessível.

## Endpoints REST

### Tarefas

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/tarefas` | Lista todas as tarefas |
| GET | `/api/tarefas/{id}` | Busca uma tarefa por ID |
| POST | `/api/tarefas` | Cria uma tarefa |
| PUT | `/api/tarefas/{id}` | Atualiza uma tarefa |
| DELETE | `/api/tarefas/{id}` | Exclui uma tarefa |

### Categorias

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/categorias` | Lista todas as categorias |
| GET | `/api/categorias/{id}` | Busca uma categoria por ID |
| POST | `/api/categorias` | Cria uma categoria |
| PUT | `/api/categorias/{id}` | Atualiza uma categoria |
| DELETE | `/api/categorias/{id}` | Exclui uma categoria, se não tiver tarefas associadas |

## Exemplos de JSON

Categoria:

```json
{
  "nome": "Faculdade",
  "descricao": "Atividades e trabalhos acadêmicos"
}
```

Tarefa (use o ID real retornado ao criar uma categoria; `categoriaId` pode ser `null`):

```json
{
  "titulo": "Entregar atividade de Angular",
  "descricao": "Finalizar o formulário e testar a API",
  "status": "PENDENTE",
  "dataVencimento": "2026-10-20",
  "categoriaId": "COLE_AQUI_O_ID_DA_CATEGORIA"
}
```

Os status aceitos são `PENDENTE`, `EM_ANDAMENTO` e `CONCLUIDA`. Os IDs são strings geradas pelo MongoDB.

## Como funciona o relacionamento no MongoDB

A coleção `categorias` guarda os documentos de categoria. A coleção `tarefas` guarda as tarefas e o campo `categoriaId` com o ID da categoria relacionada. O backend verifica se a categoria informada existe antes de salvar a tarefa. Essa abordagem usa uma referência por ID, em vez de relacionamentos JPA, que são próprios de bancos relacionais.

