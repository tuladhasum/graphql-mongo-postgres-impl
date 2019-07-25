require('dotenv').config();
console.log(process.env.PG_HOST);

const { ApolloServer, gql } = require("apollo-server");
const mongoose = require("mongoose");
const { ObjectID } = require("mongodb");
const knex = require("knex")({
  client: "pg",
  connection: {
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
  }
});

const mongoUrl = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`;

mongoose.connect(mongoUrl, { useNewUrlParser: true });

const User = mongoose.model("user", { name: String, bookIds: [Number] });

const typeDefs = gql`
  type Book {
    id: Int!
    title: String!
    author: User
  }
  type User {
    id: ID!
    name: String!
    books: [Book!]!
  }
  type Query {
    books: [Book]
    users: [User]
  }
  type Mutation {
    createUser(name: String!): User
    createBook(title: String!, author: String!): Book
  }
`;

const resolvers = {
  Mutation: {
    createUser: async (_, { name }) => {
      const user = new User({ name, bookIds: [] });
      await user.save();
      return user;
    },
    createBook: async (_, { title, author }) => {
      const [book] = await knex("book")
        .returning("*")
        .insert({ title });

      await User.updateOne(
        { _id: new ObjectID(author) },
        {
          $push: { bookIds: book.id }
        }
      );

      return book;
    }
  },
  Query: {
    books: () => knex("book").select("*"),
    users: () => User.find()
  },
  Book: {
    author: root => {
      return User.findOne({ bookIds: root.id });
    }
  },
  User: {
    books: root => {
      return knex("book")
        .whereIn("id", root.bookIds)
        .select("*");
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
  
});