# Anotações feitas durante o desenvolvimento

## Etapa 1/4

Especificações: https://github.com/Rocketseat/bootcamp-gostack-desafio-02

### Ferramentas

- [Configuração do Ambiente de Desenvolvimento](01-configuracao-do-ambiente.md)


### 1. Autenticação

- Criar os arquivos `app.js`, `server.js` e `routes.js` em [src/](../src/);

- Criar o migration de `create-users`: `yarn sequelize migration:create --name=create-users`

- Editar o arquivo de migration gerado.

- Criar o Model: [src/app/models/User.js](../src/app/models/User.js).

- Criar o [src/database/index.js](../src/database/index.js).

- Criar o [src/config/auth.js](../src/config/auth.js).

- Criar UserController e SessionController em [src/app/controllers](../src/app/controllers/).

- Executar o migration: `yarn sequelize db:migrate`

- Criar o seed: `yarn sequelize seed:generate --name admin-user`

- Editar o arquivo gerado em [src/database/seeds/](../src/database/seeds/).


### 2. Gestão de destinatários

- Criar migration de `create-recipients`: `yarn sequelize migration:create --name=create-recipients`

- Editar o arquivo de migration gerado. Adicionar nome, rua, número, complemento, cidade, estado e CEP.

- Criar o model Recipient

- Criar o RecipientController

- cadastro só pode ser feito por administradores autenticados


## Etapa 2/4

Especificações: https://github.com/Rocketseat/bootcamp-gostack-desafio-03

### Gestão de entregadores

Já existe uma tabela `users` no banco de dados, portanto usarei a mesma para cadastrar entregadores. A diferenciação se dará pelo campo `role`, onde `0` significa administrador e `1` significa entregador. Estas definições de estão declaradas em [src/app/etc/Roles.js](../src/app/etc/Roles.js).

#### Adicionando avatar ao User

Seguir as anotações de aula: [uploading files](/meleu/gostack-bootcamp-notes/blob/master/05-API-improvements.md#uploading-files)

#### Criar rotas para o CRUD de entregadores

- Adicionar as rotas em [src/routes.js](../src/routes.js).

- Criar [src/app/controllers/DeliverymanController.js](../src/app/controllers/DeliverymanController.js).

- LEMBRETE: Apenas admins podem cadastrar/atualizar/remover entregadores.


### Gestão de encomendas

- Criar um migration para encomendas: `yarn sequelize migration:create --name=create-deliveries`
    - Editar o arquivo criado em [src/database/migrations/](../src/database/migrations/) para adicionar os seguintes campos à tabela:
        - id (id da entrega)
        - recipient_id (referência ao destinatário);
        - deliveryman_id (referência ao entregador);
        - signature_id (referência à uma assinatura do destinatário, que será uma imagem);
        - product (nome do produto a ser entregue);
        - canceled_at (data de cancelamento, se cancelada);
        - start_date (data de retirada do produto);
        - end_date (data final da entrega);
        - created_at / updated_at
    - `yarn sequelize db:migrate`

- Regras de Negócio para adicionar ao [src/app/controllers/DeliveryController.js](../src/app/controllers/DeliveryController.js):
    - `start_date` tem que ser entre 8h e 18h;
    - `end_date` deve ser cadastrada quando o entregador finalizar a entrega.
    - `recipient_id` e `deliveryman_id` devem ser cadastrados no momento que for cadastrada a encomenda.
    - Quando uma encomenda é **cadastrada** para um entregador, enviar um email para ele com o nome do produto e uma mensagem informado que já está disponível para retirada.

### Funcionalidades do entregador

1. Visualizar encomendas:
    - `GET {baseUrl}/deliveries` entregas pendentes (não entregues nem canceladas).
    - `GET {baseUrl}/deliveries?status=???` - já entregues
2. Alterar status de encomendas:
    - Máximo de 5 retiradas "em aberto".
    - `PUT {baseUrl}/deliveries/:deliveryId?start=???` - definir data de retirada.
    - `PUT {baseUrl}/deliveries/:deliveryId?end=???` - definir data da entrega.
        - ao entregar, permitir envio de uma imagem que irá preencher o `signature_id` na tabela `deliveries`.
3. Cadastrar problemas nas entregas:
    - Criar uma tabela: `yarn sequelize migration:create --name=create-delivery_problems`
        - delivery_id (referência da encomenda);
        - description (descrição do problema que o entregador teve);
        - created_at / updated_at
    - Rota para entregador cadastrar problemas na entrega: `POST {baseUrl}/delivery/2/problems`
    - Rota para listar problemas de uma encomenda: `GET {baseUrl}/delivery/2/problems`
    - Rota para listar todas as entregas com problema (admins only?)
    - Rota para cancelar entrega baseado no ID do problema: `DELETE {baseUrl}/problem/1/cancel-delivery`
        - Ao cancelar, entregador recebe email.

