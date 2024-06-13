import {ApolloServer} from "@apollo/server";
import {startStandaloneServer} from "@apollo/server/standalone";
import {GraphQLSchema} from "graphql";
import {mutation, query} from "../schema";

const server = new ApolloServer({
    schema: new GraphQLSchema({
        query: query,
        mutation: mutation,
    }),
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
