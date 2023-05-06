import {GraphQLEnumType, GraphQLObjectType, GraphQLSchema} from "graphql";
import {GRAPHQL_OBJECT_RESOLVER} from "./libs/resolvers";
// import {GRAPHQL_OBJECT_RESOLVERS} from "./libs/resolvers";
import type {GraphqlEnumConfig, GraphqlObjectConfig} from "./types/input";

type InputConfigType = GraphqlObjectConfig<unknown, unknown> | GraphqlEnumConfig;
type InputConfig = {[name: string]: InputConfigType};

export type Context = {[name: string]: GraphQLEnumType | GraphQLObjectType<unknown, unknown>};

/**
 * Create a schema from a JSON or a JavaScript object
 */
export default function createSchema(schema: InputConfig) {
    const schemaTypes = Object.entries(schema).reduce<Context>((context, [name, {type, ...input}]) => {
        const graphqlTypeResolver = GRAPHQL_OBJECT_RESOLVER[type.name];

        // @ts-ignore
        context[name] = graphqlTypeResolver(context, name, input);

        return context;
    }, {});

    const queries = schemaTypes["query"] as GraphQLObjectType<unknown, unknown> | undefined;
    const mutations = schemaTypes["mutation"] as GraphQLObjectType<unknown, unknown> | undefined;

    // TODO: Think about if we just want to return the values (query, mutations, etc) or also manage the schema itself
    return new GraphQLSchema({query: queries, mutation: mutations});
}
