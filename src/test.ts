// Remove apollo server
import {ApolloServer} from "@apollo/server";
import {startStandaloneServer} from "@apollo/server/standalone";
import {
    GraphQLEnumType,
    GraphQLFloat,
    GraphQLID,
    // GraphQLInputObjectType,
    GraphQLList,
    GraphQLObjectType,
    GraphQLString,
} from "graphql";

import createSchema from "./index";

// TODO: might want to force type on query / mutations
const schemaInput = {
    // carInput: {
    //     description: "This is the input for the create car mutation",
    //     type: GraphQLInputObjectType,
    //     fields: {
    //         description: {
    //             type: GraphQLString,
    //         },
    //         brand: {
    //             type: "brand",
    //             required: true,
    //         },
    //         price: {
    //             type: GraphQLFloat,
    //             required: true,
    //             defaultValue: 0,
    //         },
    //         tags: {
    //             type: GraphQLList,
    //             item: {
    //                 type: GraphQLString,
    //                 required: true,
    //             },
    //             required: true,
    //         },
    //     },
    // },
    brand: {
        description: "This is the brand of the car",
        type: GraphQLEnumType,
        values: {
            tesla: {description: "Tesla", value: "Tesla"},
            nio: {description: "NIO", value: "NIO"},
            lightyear: {description: "Lightyear", value: "Lightyear"},
            polestar: {description: "Polestar", value: "Polestar"},
        },
    },
    car: {
        description: "This is the car itself",
        type: GraphQLObjectType,
        fields: {
            id: {
                type: GraphQLID,
                required: true,
            },
            description: {
                type: GraphQLString,
            },
            brand: {
                type: "brand",
                required: true,
            },
            price: {
                type: GraphQLFloat,
                required: true,
            },
            tags: {
                type: GraphQLList,
                item: {
                    type: GraphQLString,
                    required: true,
                },
                required: true,
            },
        },
    },
    query: {
        description: "Queries",
        type: GraphQLObjectType,
        fields: {
            getCars: {
                description: "Get all cars",
                type: GraphQLList,
                item: {
                    type: "car",
                    required: true,
                },
                required: true,
            },
            getCar: {
                description: "Get a car",
                type: "car",
                args: {
                    id: {
                        type: GraphQLID,
                        required: true,
                    },
                },
            },
        },
    },
    mutation: {
        description: "Mutations",
        type: GraphQLObjectType,
        fields: {
            createCar: {
                description: "Create a car",
                type: "car",
                args: {
                    car: {
                        type: GraphQLString,
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
