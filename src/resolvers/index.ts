import {GraphQLObjectType, GraphQLSchema} from "graphql";
import composeGraphQLEnumType from "./enum";
import composeGraphQLObjectType from "./object";
import composeGraphQLObjectInputType from "./inputObject";
import composeGraphQLUnionType from "./union";
import composeGraphQLInterfaceType from "./interface";
import composeGraphqlScalarType from "./scalar";
import type {Context, InputConfig} from "../types";

const resolvers = {
    GraphQLEnumType: composeGraphQLEnumType,
    GraphQLObjectType: composeGraphQLObjectType,
    GraphQLInputObjectType: composeGraphQLObjectInputType,
    GraphQLUnionType: composeGraphQLUnionType,
    GraphQLInterfaceType: composeGraphQLInterfaceType,
    GraphQLScalarType: composeGraphqlScalarType,
};

/**
 * Create a GraphQL schema
 */
export default function createSchema(schema: InputConfig) {
    const schemaTypes = Object.entries(schema).reduce<Context>((context, [name, {type, ...input}]) => {
        const graphqlTypeResolver = resolvers[type.name];

        if (!graphqlTypeResolver) throw new Error(`${type.name} is not supported`);

        // @ts-ignore
        context[name] = graphqlTypeResolver(context, name, input);
        return context;
    }, {});

    const queries = schemaTypes["query"] as GraphQLObjectType<unknown, unknown> | undefined;
    const mutations = schemaTypes["mutation"] as GraphQLObjectType<unknown, unknown> | undefined;

    // TODO: Think about if we just want to return the values (query, mutations, etc) or also manage the schema itself
    return new GraphQLSchema({query: queries, mutation: mutations});
}
