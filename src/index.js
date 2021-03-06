const {
  ApolloServer,
  gql
} = require('apollo-server');

const books = [{
    title: "Harry Potter",
    author: "J.K. Rowling",
  },
  {
    title: "Twilight Zone",
    author: "Lenny Davis"
  }
];

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql `

  # This "Book" type can be used in other type declarations.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    books: [Book],
    hello: String!
  }

  type User {
    id: ID!
    username: String!
  }

  type Error {
    field: String!
    message: String!
  }

  type RegisterResponse {
    errors: [Error]
    user: User
  }

  input UserInfo {
    username: String!
    password: String!
    age: Int
  }

  type Mutation {
    register(username: String!, password: String!, age: Int): RegisterResponse!
    login(userInfo: UserInfo!): RegisterResponse!
  }
`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books,
    hello: () => 'hello world!'
  },
  Mutation: {
    register: () => ({
      errors: [
        {
        field: 'username',
        message: '...'
      }
    ],
      user: {
        id: 1,
        username: "bob"
      }
    })
  }
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({
  typeDefs,
  resolvers
});

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({
  url
}) => {
  console.log(`🚀  Server ready at ${url}`);
});