import {GraphQLInt, GraphQLInterfaceType, GraphQLObjectType, GraphQLString} from "graphql";

const graphqlArg = {
    description: "this is a field argument",
    type: GraphQLInt,
    defaultValue: 99,
};

const graphqlfield = {
    description: "this is an interface field",
    type: GraphQLString,
    args: {
        argument: graphqlArg,
    },
};

// TODO: fill in every property
const graphqlInterface = new GraphQLInterfaceType({
    name: "graphqlInterfaceType",
    description: "this is an interface",
    fields: {
        field: graphqlfield,
    },
});

const graphqlObject = new GraphQLObjectType({
    name: "graphqlObjectType",
    description: "this is an object",
    fields: {
        field: graphqlfield,
    },
});

export {graphqlInterface, graphqlObject, graphqlfield, graphqlArg};
