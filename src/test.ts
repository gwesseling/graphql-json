/* eslint-disable max-lines */
// Remove apollo server
import {ApolloServer} from "@apollo/server";
import {startStandaloneServer} from "@apollo/server/standalone";
import {
    GraphQLEnumType,
    GraphQLFloat,
    GraphQLID,
    GraphQLInputObjectType,
    GraphQLInterfaceType,
    GraphQLList,
    GraphQLObjectType,
    GraphQLScalarType,
    GraphQLString,
    GraphQLUnionType,
    Kind,
    ValueNode,
} from "graphql";

import createSchema from "./index";

// TODO: might want to force type on query / mutations
const schemaInput = {
    date: {
        description: "Date custom scalar type",
        type: GraphQLScalarType,
        /**
         * Convert date to json
         */
        serialize(value: unknown) {
            if (value instanceof Date) return value.getTime();
            throw Error("GraphQL Date Scalar serializer expected a `Date` object");
        },
        /**
         * Convert integer to Date
         */
        parseValue(value: unknown) {
            if (typeof value === "number") return new Date(value);
            throw new Error("GraphQL Date Scalar parser expected a `number`");
        },
        /**
         * Convert hard-coded AST string to integer and then to Date
         */
        parseLiteral(ast: ValueNode) {
            if (ast.kind === Kind.INT) return new Date(parseInt(ast.value, 10));
            return null;
        },
    },
    brand: {
        description: "This is the brand of the car",
        type: GraphQLEnumType,
        values: {
            tesla: {description: "Tesla", value: "Tesla"},
            lightyear: {description: "Lightyear", value: "Lightyear"},
            volkwagen: {description: "Volkwagen", value: "Volkwagen"},
            porsche: {description: "Porsche", value: "Porsche"},
        },
    },
    carInput: {
        description: "This is the input for the create car mutation",
        type: GraphQLInputObjectType,
        fields: {
            description: {
                type: GraphQLString,
            },
            brand: {
                type: "brand",
                required: true,
            },
            price: {
                type: GraphQLFloat,
                defaultValue: 0,
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
    car: {
        description: "This is the car itself",
        type: GraphQLInterfaceType,
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
            createdAt: {
                type: "date",
                required: true,
            },
        },
    },
    electricCar: {
        description: "Electric engine car",
        type: GraphQLObjectType,
        interfaces: ["car"],
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
            createdAt: {
                type: "date",
                required: true,
            },
            charge: {
                type: GraphQLFloat,
                required: true,
            },
        },
    },
    combustionCar: {
        description: "Combustion engine car",
        type: GraphQLObjectType,
        interfaces: ["car"],
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
            createdAt: {
                type: "date",
                required: true,
            },
            fuel: {
                type: GraphQLString,
                required: true,
            },
        },
    },
    carTypes: {
        description: "Any car",
        type: GraphQLUnionType,
        types: ["electricCar", "combustionCar"],
    },
    query: {
        description: "Queries",
        type: GraphQLObjectType,
        fields: {
            getCars: {
                description: "Get all cars",
                type: GraphQLList,
                item: {
                    type: "carTypes",
                    required: true,
                },
                required: true,
            },
            getElectricCars: {
                description: "Get all electric engine cars",
                type: GraphQLList,
                item: {
                    type: "electricCar",
                    required: true,
                },
                required: true,
            },
            getCombustionCars: {
                description: "Get all combustion engine cars",
                type: GraphQLList,
                item: {
                    type: "combustionCar",
                    required: true,
                },
                required: true,
            },
            getCar: {
                description: "Get a car",
                type: "carTypes",
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
                type: "carTypes",
                args: {
                    car: {
                        type: "carInput",
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
