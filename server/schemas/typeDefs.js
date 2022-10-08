const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID
        username: String
        email: String
        movieCount: Int
        savedMovies: [Movie]
    }

    type Movie {
        authors: [String]
        description: String!
        movieId: String!
        image: String
        link: String
        title: String!
    }

    type Auth {
        token: ID
        user: User
    }

    input MovieInput {
        # authors: [String]
        description: String!
        movieId: String!
        image: String
        # link: String
        # title: String!
    }

    type Query {
        user(username: String, _id: ID): User
        me: User
    }

    type Mutation {
        addUser(username: String!, email: String!, password: String!): Auth
        login(username: String, email: String, password: String!): Auth
        saveMovie(input: String!): User
        removeMovie(input: MovieInput): User
    }
`

module.exports = typeDefs;