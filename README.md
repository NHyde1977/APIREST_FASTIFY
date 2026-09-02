## Evolução do projeto — Aula 01/09/2026

Nesta etapa, a API foi aprimorada com recursos de validação, organização de rotas, tratamento de erros e gerenciamento do ciclo de vida da aplicação.

### Validação com JSON Schema

Foi criada a camada:

`src/schemas/alunoSchemas.js`

Os schemas são utilizados pelo Fastify para validar os dados antes que a requisição chegue ao Controller.

Foram implementadas validações para:

- `id` como número inteiro e maior ou igual a 1;
- `nome` como string entre 2 e 100 caracteres;
- `curso` como string entre 2 e 100 caracteres;
- obrigatoriedade dos campos `nome` e `curso`;
- rejeição de propriedades adicionais não previstas no schema.

Com isso, requisições inválidas são rejeitadas automaticamente pelo Fastify com status HTTP `400`.

### Organização das rotas com prefixos

As rotas de alunos passaram a utilizar o sistema de plugins e prefixos do Fastify.

O plugin é registrado em `app.js` com:

`/api/alunos`

Dessa forma, os endpoints disponíveis são:

| Método | Endpoint | Operação |
|---|---|---|
| GET | `/api/alunos` | Lista todos os alunos |
| GET | `/api/alunos/:id` | Busca um aluno pelo ID |
| POST | `/api/alunos` | Cadastra um aluno |
| PUT | `/api/alunos/:id` | Atualiza um aluno |
| DELETE | `/api/alunos/:id` | Remove um aluno |

Internamente, o arquivo de rotas pode trabalhar apenas com `/` e `/:id`, deixando a definição do prefixo centralizada no registro do plugin.

### Tratamento global de erros

Foi configurado um tratador global utilizando:

`app.setErrorHandler()`

Erros de validação são identificados e retornam status `400`, enquanto erros internos não tratados retornam status `500`.

O logger integrado do Fastify também é utilizado para registrar os erros da aplicação.

### Verificação da conexão com o banco

Antes de iniciar o servidor HTTP, a aplicação solicita uma conexão ao pool do MySQL.

Caso a conexão seja estabelecida, ela é liberada e o servidor é iniciado.

Caso haja falha na conexão com o banco de dados, a aplicação registra o erro e encerra o processo, evitando iniciar a API sem acesso ao banco.

### Encerramento do pool de conexões

Foi adicionado o hook `onClose` do Fastify para encerrar corretamente o pool de conexões do MySQL quando a aplicação for finalizada.

O encerramento utiliza:

`pool.end()`

Isso evita que conexões com o banco permaneçam abertas desnecessariamente.

### Tratamento de SIGINT e SIGTERM

A aplicação também passou a tratar os sinais:

- `SIGINT`
- `SIGTERM`

Ao receber um desses sinais, é executado `app.close()`.

O fechamento da aplicação dispara o hook `onClose`, que encerra também o pool de conexões com o MySQL.

O fluxo de encerramento passa a ser:

`SIGINT/SIGTERM → app.close() → onClose → pool.end()`

### Fluxo atual da aplicação

O fluxo de uma requisição válida é:

`Cliente → Fastify → JSON Schema → Route → Controller → Repository → MySQL`

Caso a validação do JSON Schema falhe:

`Cliente → Fastify → JSON Schema → HTTP 400`

Nesse caso, a requisição é interrompida antes de chegar ao Controller.

## Tecnologias utilizadas

- Node.js
- Fastify
- MySQL
- mysql2
- JavaScript
- ES Modules
- JSON Schema
- Docker
- Bruno