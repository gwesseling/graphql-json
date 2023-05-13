/* eslint-disable require-jsdoc */
import {
    GraphQLEnumType,
    GraphQLFloat,
    GraphQLInputObjectType,
    GraphQLInterfaceType,
    GraphQLList,
    GraphQLScalarType,
    GraphQLString,
    GraphQLUnionType,
    Kind,
    ValueNode,
} from "graphql";

const nonNullableListOfNonNullableString = {
    type: GraphQLList,
    item: {
        type: GraphQLString,
        required: true,
    },
    required: true,
};

const listOfNonNullableObject = {
    type: GraphQLList,
    item: {
        type: "graphqlObjectType",
        required: true,
    },
};

const listOfContextObject = {
    type: GraphQLList,
    item: {
        type: "graphqlObject",
    },
};

const listWithoutItem = {
    type: GraphQLList,
    required: true,
};

const nonNullableType = {
    type: GraphQLFloat,
    required: true,
};

const nullableType = {
    type: GraphQLFloat,
};

const argumentConfig = {
    description: "this is an argument",
    type: GraphQLFloat,
    defaultValue: 0,
    required: true,
    deprecationReason: "value has been replaced",
};

const fieldConfig = {
    description: "this is a field",
    type: GraphQLList,
    item: {
        type: GraphQLString,
        required: true,
    },
    required: true,
    deprecationReason: "value has been replaced",
};

const fieldWithArgConfig = {...fieldConfig, args: {arg: argumentConfig}};

const enumConfig = {
    description: "this is an enum",
    type: GraphQLEnumType,
    values: {
        value: {
            description: "this is a enum value",
            value: "enumValue",
            deprecationReason: "this field has been replaced",
        },
    },
};

const fieldMapConfig = {field: fieldWithArgConfig};

const interfaceConfig = {
    description: "this is an interface",
    type: GraphQLInterfaceType,
    fields: fieldMapConfig,
};

const objectConfig = {
    description: "this is an object",
    type: GraphQLInterfaceType,
    interfaces: ["graphqlInterface"],
    fields: fieldMapConfig,
};

const scalarConfig = {
    description: "this is a custom scalar type",
    type: GraphQLScalarType,
    specifiedByURL: "test",
    serialize(value: unknown) {
        if (value instanceof Date) return value.getTime();
        throw Error("GraphQL Date Scalar serializer expected a `Date` object");
    },
    parseValue(value: unknown) {
        if (typeof value === "number") return new Date(value);
        throw new Error("GraphQL Date Scalar parser expected a `number`");
    },
    parseLiteral(ast: ValueNode) {
        if (ast.kind === Kind.INT) return new Date(parseInt(ast.value, 10));
        return null;
    },
};

const inputObjectConfig = {
    description: "this is an input object type",
    type: GraphQLInputObjectType,
    fields: {field: fieldConfig},
};

const graphqlUnionConfig = {
    description: "this is an union type",
    type: GraphQLUnionType,
    types: ["graphqlObject"],
};

export {
    graphqlUnionConfig,
    inputObjectConfig,
    objectConfig,
    fieldMapConfig,
    fieldWithArgConfig,
    interfaceConfig,
    enumConfig,
    fieldConfig,
    argumentConfig,
    nonNullableType,
    nullableType,
    listOfNonNullableObject,
    nonNullableListOfNonNullableString,
    listOfContextObject,
    listWithoutItem,
    scalarConfig,
};
