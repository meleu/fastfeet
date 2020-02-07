# Configuração do Ambiente de Desenvolvimento

- [Ferramentas](#ferramentas)
- [ExpressJS](#expressjs)
- [nodemon + sucrase](#nodemon--sucrase)
    - [debugar via VSCode](#debugar-via-vscode)
- [ESLint + Prettier + EditorConfig](#eslint--prettier--editorconfig)
    - [EditorConfig](#editorconfig)
- [docker](#docker)
- [PostgreSQL](#postgresql)
    - [Postbird](#postbird)
- [Sequelize](#sequelize)
- [bcrypt + JWT + Yup](#bcrypt--jwt--yup)


## Ferramentas

Instalar:

- node através de nvm
- DevDocs.io para documentação
- insomnia.res para testar REST API
- Visual Studio Code
    - vim keybindings plugin (não consigo codar sem vim keybindings...)
    - https://github.com/meleu/vscode-preferences


## ExpressJS

```
yarn add express
```

Estrutura de arquivos/diretórios:
```
src/
├── app
│   ├── controllers
│   ├── middlewares
│   └── models
├── config
├── database
│   └── migrations
├── app.js
├── routes.js
└── server.js
```

## nodemon + sucrase

nodemon: reinicia a aplicação a cada mudança no código

sucrase: permite que usemos `import ... from ...` no lugar de `require()`


Instalar como dependência de desenvolvimento (opção `-D`):
```
yarn add nodemon sucrase -D
```

Adicionar ao `package.json`:
```json
  "scripts": {
    "dev": "nodemon src/server.js",
    "dev:debug": "nodemon --inspect"
  }
```

Criar o arquivo `.nodemon.json`:
```json
{
  "execMap": {
    "js": "node --require sucrase/register"
  }
}
```

### debugar via VSCode

1. No VSCode, vai na seção de "Debug and Run" (atalho: `Ctrl+Shift+D`)
2. Inicie um novo `launch.json`.
3. Remova a linha com a propriedade `program`.
4. Altere as propriedades do `configurations` que estão listadas abaixo:

```js
{
  "configurations": [
    {
      "request": "attach",
      // remover "program"
      "restart": true,
      "protocol": "inspector"
    }
  ]
}
```


## ESLint + Prettier + EditorConfig

Ir na seção de plugins do VSCode e instalar ESLint.

Em seguida vai no terminal:

```
yarn add eslint prettier eslint-config-prettier eslint-plugin-prettier -D
yarn eslint --init
```

Durante o init selecionar:

1. check syntax, find problems and enforce code style
2. JavaScript modules (import/export) (graças ao sucrase)
3. Sobre framework: None of these (nem React nem Vue.js)
4. Desmarcar `Browser` e marcar `Node` (usando espaço)
5. Use a popular style guide
6. Airbnb
7. aceitar instalação (vai instalar via `npm`)

Remover o `package-lock.json` e executar simplesmente `yarn` para que seja feito o mapeamento das dependências no `yarn.lock`.

O arquivo `.eslintrc.js` será criado, vamos fazer algumas alterações nele:
```js
  // ...
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  // ...
  rules: {
    "prettier/prettier": "error",
    "class-methods-use-this": "off",
    "no-param-reassign": "off",
    "camelcase": "off",
    "no-unused-vars": ["error", { "argsIgnorePattern": "next" }],
  }
```

Criar o arquivo `.prettierrc`:
```json
{
  "singleQuote": true,
  "trailingComma": "es5"
}
```

Aplicar eslint em todos arquivos `.js`:
```
yarn eslint --fix src --ext .js
```

Ir nas configurações do vscode: `Ctrl+Shift+P` e digite `settings json`. E adicionar isso ao `settings.json`:
```json
  "[javascript]": {
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true,
    },
  },
  "[javascriptreact]": {
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true,
    },
  },
```

### EditorConfig

EditorConfig é útil quando trabalhamos em projetos onde os outros desenvolvedores utilizam editores diferentes do nosso (VSCode).

Ir na seção de plugins do VSCode e instalar EditorConfig.

Criar arquivo `.editorconfig`:
```
root = true

[*]
indent_style = space
indent_size = 2
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
```


## docker

Instalar docker seguindo as instruções em https://docs.docker.com/install/ e não esquecer de seguir as instruções de Post-install.

comandos básicos do docker:

```
docker ps                   # lista containers ativos
docker ps -a                # lista containers disponíveis na sua máquina
docker start containerName  # inicia o containerName
docker stop containerName   # para a execução do containerName
docker logs containerName   # mostra os logs do containerName
docker run                  # executa um processo em um novo container
```

## PostgreSQL

Container para o PostgreSQL: [https://hub.docker.com/_/postgres](https://hub.docker.com/_/postgres)

Instalando:
```
docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
```

**Observação**: na opção `-p` o primeiro número é a porta da sua máquina "real", e o número depois do `:` é a porta do container.

### Postbird

Uma GUI bem bacaninha para interagir com o PostgreSQL: https://www.electronjs.org/apps/postbird

Uma vez conectado ao PostgreSQL através do Postbird, criar uma database (template deixa em branco e encoding UTF8).


## Sequelize

Instalando Sequelize a as dependências para trabalhar com o dialeto do PostgreSQL:

```
yarn add sequelize pg pg-hstore
yarn add sequelize-cli -D
```

Criar o arquivo `.sequelizerc`:

```js
const { resolve } = require('path');

module.exports = {
  config: resolve(__dirname, 'src', 'config', 'database.js'),
  'models-path': resolve(__dirname, 'src', 'app', 'models'),
  'migrations-path': resolve(__dirname, 'src', 'database', 'migrations'),
  'seeders-path': resolve(__dirname, 'src', 'database', 'seeds'),
};
```

Criar o arquivo `src/config/database.js`:
```js
module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker', // <-- definido via POSTGRES_PASSWORD lá no docker run
  database: 'DBName', // <-- definido na criação do BD com o Postbird
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
```

## bcrypt + JWT +Yup

Ferramentas usadas para lidar autenticação.

```
yarn add bcryptjs jsonwebtoken yup
```
