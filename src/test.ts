// Remove apollo server
import {ApolloServer} from "@apollo/server";
import {startStandaloneServer} from "@apollo/server/standalone";

import createSchema from "./index";
import {GraphqlFieldType, GraphqlType} from "./types/enums";

// TODO: create a decent example
const schemaInput = {
    enum: {
        description: "This is an enum type with the name enum",
        type: GraphqlType.Enum,
        values: {
            value: {value: 1},
            value2: {value: "2"},
            value3: {value: true},
        },
    },
    object: {
        description: "This is an object type with the name object",
        type: GraphqlType.Object,
        fields: {
            field: {
                type: GraphqlFieldType.List,
                item: {
                    type: "enum",
                    required: true,
                },
                required: false,
            },
            field1: {
                type: GraphqlFieldType.Float,
                required: true,
            },
        },
    },
    query: {
        type: GraphqlType.Object,
        fields: {
            get: {
                description: "get field",
                type: "object",
                args: {
                    id: {
                        type: GraphqlFieldType.String,
                    },
                },
            },
        },
    },
};

const schema = createSchema(schemaInput);

const server = new ApolloServer({
    schema: schema,
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
