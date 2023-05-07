import {GraphQLEnumType, GraphQLObjectType, GraphQLSchema} from "graphql";
import resolvers from "./resolvers";
import type {GraphqlEnumConfig, GraphqlObjectConfig} from "./types/input";

// TODO: move these types
type InputConfigType = GraphqlObjectConfig<unknown, unknown> | GraphqlEnumConfig;
type InputConfig = {[name: string]: InputConfigType};

export type Context = {[name: string]: GraphQLEnumType | GraphQLObjectType<unknown, unknown>};

// TODO: move this function outside the index
/**
 * Create a schema from a JSON or a JavaScript object
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
