const { gql } = require('apollo-server-express');

const typeDefs = gql`
  User type {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int!
    savedBooks: [Book]

  }

  type Book {
    _id: ID!
    bookId: String!
    authors:[]
    description: String!
    title: String!
    image: String!
    link: String!
  }

  type Auth {
    token: ID!
    user: User
  }
Query Type{
  me: User
}
  Mutation type {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(
        input: savedBook!
        ): User
    removeBook(bookId: ID!): User
  }
`;

module.exports = typeDefs;
