const express = require('express');
const {ApolloServer} = require('apollo-server-express');
const db = require('./config/connections');
const { typeDefs, resolvers} = require("./schemas"); 
const { default: mongoose } = require('mongoose');
const path = require('path');

mongoose.set('debug', true);

const PORT  = process.env.PORT || 3001;

const app = express();

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "../client/build")));

    app.get('*', (req,res) => {
        res.sendFile(path.join(__dirname, '../client/build/index.html'));
    });
}

db.once('open', async() => {
    await server.start();
    server.applyMiddleware({app});
    app.listen(PORT, () =>{
        console.log(`Listening on port ${PORT}`);

    });
});