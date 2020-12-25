const path = require('path');
const { gql, ApolloServer } = require('apollo-server-express');
const express = require('express');

const app = express();
const WEB_APP_PORT = 8080;

// ! Serve the index.html so we can run graphQL on browser
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ! So backend has the schema, like PQL, PDSC
const schema = gql`
  type Query {
    # INFO Function Signature
    getUsers(id: Int, username: String, email: String, password: String): [User]
  }

  type Mutation {
    createUser(username: String, email: String, password: String): User
  }

  type User {
    id: Int!
    username: String!
    email: String!
    password: String!
  }
`;

const users = [
  {
    id:1,
    username:'The Javascript Ninja',
    email:'contact@thejavascriptninja.com',
    password:'its-a-secret'
  },
  {
    id:2,
    username:'The Javascript Ninjas Best Friend',
    email:'contact@thejavascriptninja.com',
    password:'its-a-secret'
  },
];

// ! Then Backend fetches the data and return to the client
// ! Then App.js runs { getUsers }
const resolvers = {
  Query: {
    /**
     * Implement the method of the same name in schema::Query::getUsers
     * @param {unknown} _
     * @param {{[key: keyof users[0]]: any}} args
     */
    getUsers(_, args) {
      const [filterKey] = Object.keys(args);
      return users.filter(u => u[filterKey] === args[filterKey]);
    }
  },
  Mutation: {
    createUser(_, args) {
      const newUser = { ...args, id: users.length + 1 };
      users.push(newUser);
      return newUser;
    }
  }
}

const gqlServer = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

gqlServer.applyMiddleware({ app });

app.listen(WEB_APP_PORT, () => {
  console.log(`Web App serving at http://localhost:${WEB_APP_PORT}`);
  console.log(`GraphIQL serving at http://localhost:${WEB_APP_PORT}/graphql`);
});