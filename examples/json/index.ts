/* eslint-disable @typescript-eslint/no-var-requires */
const {ApolloServer} = require("@apollo/server");
const {startStandaloneServer} = require("@apollo/server/standalone");
const createSchema = require("@gwesseling/graphql-json");
const schemaInput = require("./schema.json");

const server = new ApolloServer({
    schema: createSchema(schemaInput),
});

/**
 * Start test server
 */
async function startServer() {
    const {url} = await startStandaloneServer(server, {
        listen: {port: 4000},
    });

    console.log(url);
}

startServer();
