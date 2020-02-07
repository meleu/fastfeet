# Anotações feitas durante o desenvolvimento

## Etapa 1/4

- [Configuração do Ambiente de Desenvolvimento](01-configuracao-do-ambiente.md)

- Criar os arquivos `app.js`, `server.js` e `routes.js` em [src/](../src/);

- Criar o Model: [src/app/models/User.js](../src/app/models/User.js).

- Criar o migration de `create-users`: `yarn sequelize migration:create --name=create-users`

- Editar o arquivo de migration gerado.

- Criar o [src/database/index.js](../src/database/index.js).

- Criar o [src/config/auth.js](../src/config/auth.js).

- Criar UserController e SessionController em [src/app/controllers](../src/app/controllers/).

- Executar o migration: `yarn sequelize db:migrate`

- Criar o seed: `yarn sequelize seed:generate --name admin-user`

- Editar o arquivo gerado em [src/database/seeds/](../src/database/seeds/).
