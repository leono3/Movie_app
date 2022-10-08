const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID
        username: String
        email: String
        savedMovies: [Movie]
    }

    type Movie {
        movieId: String
        title: String
    }

    type Auth {
        token: ID
        user: User
    }

    input MovieInput {
        movieId: String!
        title: String
    }

    type Query {
        user(username: String, _id: ID): User
        me: User
    }

    type Mutation {
        addUser(username: String!, email: String!, password: String!): Auth
        login(username: String, email: String, password: String!): Auth
        saveMovie(input: MovieInput): User
        removeMovie(input: MovieInput): User
    }
`

module.exports = typeDefs;