# fastfeet
App para transportadora - desenvolvido durante o GoStack bootcamp

## Clonar repositório

```
git clone https://github.com/meleu/fastfeet
```

## Instalando dependências

### Node e yarn

Instalar [Node](https://nodejs.org/) e [yarn](https://yarnpkg.com/).

**Nota**: recomendo instalar node via [Node Version Manager](https://github.com/nvm-sh/nvm).


### Bibliotecas

Uma vez clonado o repositório, entrar no diretório e instalar as dependências:

```
yarn install
```

### Docker

Instalar docker seguindo as instruções em https://docs.docker.com/install/ e não esquecer de seguir as instruções de Post-install.

### PostgreSQL

Instalar um container para o PostgreSQL:
```
docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
```

Iniciar o container:
```
docker start database
```

### Criar tabelas do banco de dados

Uma vez instaladas as dependências, rodar executar migrations/seeders:

```
yarn sequelize db:migrate
yarn sequelize db:seed:all
```

Isso vai criar um usuário com email `admin@fastfeet.com` e senha `asdfg!@#$%`.


## Rotas

### Sessões

Usada apenas para autenticação:

Método | URI | Parêmtros | Body | Descrição
-------|-----|-----------|------|-----------
POST | /sessions | - | `{ email, password }` | Cria um token de autenticação


### Usuários

Por enquanto apenas alteração dos dados está implementado.

Método | URI | Parêmtros | Body | Descrição
-------|-----|-----------|------|-----------
PUT | /users | - | `{ name, email[, password, confirmPassword, oldPasswowrd] }` | Altera dados do usuário (necessário enviar o token via cabeçalho no campo `Authorization:`)

### Destinatários

Por enquanto apenas adicionar e editar destinatários.

**Nota 1**: apenas usuários com devidamente autenticados e com permissão de administrador podem criar e alterar destinatários.

**Nota 2**: o token de autenticação deve ir no cabeçalho HTTP no campo `Authorization:`.

Método | URI | Parêmtros | Body | Descrição
-------|-----|-----------|------|-----------
POST | /recipients | - | `{ name, street, number[, complement], city, state, zip_code }` | cria um novo destinatário
PUT | /recipients/:id | id | `{ name, email[, password, confirmPassword, oldPasswowrd] }` | Altera dados do destinatário.
