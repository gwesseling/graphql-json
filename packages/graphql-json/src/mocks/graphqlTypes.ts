/* eslint-disable require-jsdoc */
import {
    GraphQLEnumType,
    GraphQLFloat,
    GraphQLInputObjectType,
    GraphQLInterfaceType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLScalarType,
    GraphQLString,
    GraphQLUnionType,
} from "graphql";

const graphqlArg = {
    description: "this is an argument",
    type: new GraphQLNonNull(GraphQLFloat),
    defaultValue: 0,
    deprecationReason: "value has been replaced",
};

const graphqlfield = {
    description: "this is a field",
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))),
    deprecationReason: "value has been replaced",
    args: {},
};

const graphqlfieldWithArg = {
    ...graphqlfield,
    args: {
        arg: graphqlArg,
    },
};

const graphqlFieldMap = {field: graphqlfieldWithArg};

// TODO: fill in every property
const graphqlInterface = {
    name: "graphqlInterfaceType",
    description: "this is an interface",
    fields: graphqlFieldMap,
};

const graphqlObject = {
    name: "graphqlObjectType",
    description: "this is an object",
    fields: graphqlFieldMap,
};

const graphqlEnum = {
    name: "graphqlEnumType",
    description: "this is an enum",
    values: {
        value: {
            description: "this is a enum value",
            value: "enumValue",
            deprecationReason: "this field has been replaced",
        },
    },
};

const graphqlScalar = {
    name: "graphqlScalarType",
    description: "this is a custom scalar type",
    specifiedByURL: "test",
};

const graphqlInputObject = {
    name: "graphqlInputObjectType",
    description: "this is an input object type",
    fields: {
        field: {
            description: "this is a field",
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))),
            deprecationReason: "value has been replaced",
        },
    },
};

const graphqlUnion = {
    name: "graphqlUnionType",
    description: "this is an union type",
};

const context = {
    graphqlInterface: new GraphQLInterfaceType(graphqlInterface),
    graphqlObject: new GraphQLObjectType(graphqlObject),
    graphqlEnum: new GraphQLEnumType(graphqlEnum),
    graphqlScalar: new GraphQLScalarType(graphqlScalar),
    graphqlInputObject: new GraphQLInputObjectType(graphqlInputObject),
    graphqlUnion: new GraphQLUnionType({...graphqlUnion, types: [new GraphQLObjectType(graphqlObject)]}),
};

export {
    context,
    graphqlUnion,
    graphqlInputObject,
    graphqlFieldMap,
    graphqlfieldWithArg,
    graphqlEnum,
    graphqlInterface,
    graphqlObject,
    graphqlfield,
    graphqlArg,
    graphqlScalar,
};
