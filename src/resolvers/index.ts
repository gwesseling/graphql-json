import {GraphQLNamedType, GraphQLObjectType, GraphQLSchema} from "graphql";
import composeGraphQLEnumType from "./enum";
import composeGraphQLObjectType from "./object";
import composeGraphQLObjectInputType from "./inputObject";
import composeGraphQLUnionType from "./union";
import composeGraphQLInterfaceType from "./interface";
import composeGraphqlScalarType from "./scalar";
import type {Context, GraphqlResolverFunction, InputConfig, InputSchema} from "../types";
import type {Maybe} from "../types/utils";
import type {GraphqlType} from "../types/input";

const FORCED_TYPE = ["query", "mutation", "subscription"];

const classResolvers = {
    GraphQLEnumType: composeGraphQLEnumType,
    GraphQLObjectType: composeGraphQLObjectType,
    GraphQLInputObjectType: composeGraphQLObjectInputType,
    GraphQLUnionType: composeGraphQLUnionType,
    GraphQLInterfaceType: composeGraphQLInterfaceType,
    GraphQLScalarType: composeGraphqlScalarType,
};

const stringResolvers = {
    enum: composeGraphQLEnumType,
    object: composeGraphQLObjectType,
    input: composeGraphQLObjectInputType,
    union: composeGraphQLUnionType,
    interface: composeGraphQLInterfaceType,
    scalar: composeGraphqlScalarType,
};

/**
 * Get input type
 */
function getInputType(name: string, type?: GraphqlType) {
    // Force GraphQLObject type for Query, Mutation and Subscription
    if (FORCED_TYPE.includes(name)) return composeGraphQLObjectType;

    if (!type) throw new Error("Type is not defined");

    // Resolve based on string for full JSON support (ex: 'object')
    if (typeof type === "string" && stringResolvers[type]) return stringResolvers[type];
    // Resolve based on GraphQL type (ex: GraphQLObjectType)
    if (typeof type === "function" && classResolvers[type.name]) return classResolvers[type.name];

    throw new Error(`${type} is not supported`);
}

/**
 * Get types from context
 */
function getTypesField(context: Context, types?: Maybe<ReadonlyArray<GraphQLNamedType | string>>) {
    return types?.map((type) => {
        let resolvedType = type;

        if (typeof resolvedType === "string" && context[resolvedType]) resolvedType = context[resolvedType];

        // Throw error if we can't find a string type inside context
        if (typeof resolvedType === "string") throw new Error(`Could not resolve '${type}' from context`);

        return type as GraphQLNamedType;
    });
}

/**
 * Create a GraphQL schema
 */
export default function createSchema(schema: InputSchema, config?: InputConfig) {
    const schemaTypes = Object.entries(schema).reduce<Context>((context, [name, {type, ...input}]) => {
        const graphqlTypeResolver: GraphqlResolverFunction = getInputType(name, type);
        context[name] = graphqlTypeResolver(context, name, input);
        return context;
    }, {});

    const query = schemaTypes["query"] as GraphQLObjectType<unknown, unknown> | undefined;
    const mutation = schemaTypes["mutation"] as GraphQLObjectType<unknown, unknown> | undefined;
    const subscription = schemaTypes["subscription"] as GraphQLObjectType<unknown, unknown> | undefined;
    const types = getTypesField(schemaTypes, config?.types);

    return new GraphQLSchema({...config, query, mutation, subscription, types});
}
