const { ApolloServer, gql } = require('apollo-server');
const mongoose = require('mongoose');

require('dotenv').config({ path: 'variables.env' });
const fs = require('fs');
const typeDefs = gql`${fs.readFileSync(__dirname.concat('/typeDefs.gql'), 'utf8')}`;
const resolvers = require('./resolvers')

// const User = require('./models/User');
// const Pin = require('./models/Pin');


const { findOrCreateUser } = require('./controllers/userController');

mongoose
    .connect(
        process.env.MONGO_URI, 
        { 
            useUnifiedTopology: true,
            useCreateIndex: true,
            useNewUrlParser: true 
        }
    )
    .then(() => console.log('DB CONNECTED'))
    .catch(err => console.error(err));


const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        // intercept the request before loading the page

        // debugger;
        let authToken = null
        let currentUser = null
        try {
          authToken = req.headers.authorization

          if(authToken) {
              // find or create user
              currentUser = await findOrCreateUser(authToken)
          }
        } catch (error) {
            console.error(`Unable to authenticate user with token ${ authToken }`);
        }

        return { currentUser }
    }
    // context: {
    //     User,
    //     Pin
    // }
});

server.listen().then(({url}) => {
    console.log(`Server listening on ${url}`)
});

