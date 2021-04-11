const app = require("express")();
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require("graphql");
const port = 3000
// Cria o Schema informando os campos e a ação que irá realizar a mutação no Schema
const schema = buildSchema(`
  type User {
    id: ID
    name: String
    repo: String
    age: Int
  }
  type Query {
    user(id: ID!): User
    users: [User]
  }
  type Mutation {
    createUser(name: String!, repo: String!, age: Int!): User
  }
`);

// adiciona os usuarios no cache
const providers = {
    users: []
  };

  let id = 0;

// retorna a lista de usuários, cria e filtra 
const resolvers = {
  user({ id }) {
    return providers.users.find(item => item.id === Number(id));
  },
  users() {
    return providers.users;
  },
  createUser({ name, repo, age }) {
    const user = {
      id: id++,
      name,
      repo,
      age
    };

//     adiciona o usuario no estado da aplicação
    providers.users.push(user);
//     retorna o usuário registrado
    return user;
  }
};
app.use(
    "/graphql",
    graphqlHTTP({
      schema,
      rootValue: resolvers,
      graphiql: true    
    })
  );
app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})
