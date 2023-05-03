import {GraphQLEnumType, GraphQLObjectType, GraphQLSchema} from "graphql";
import {GRAPHQL_OBJECT_RESOLVERS} from "./libs/resolvers";
import type {GraphqlEnumConfig, GraphqlObjectConfig} from "./types/input";

type InputConfigType = GraphqlObjectConfig<any, any> | GraphqlEnumConfig;
type InputConfig = {[name: string]: InputConfigType};

export type Context = {[name: string]: GraphQLEnumType | GraphQLObjectType<any, any>};

/**
 * Create a schema from a JSON or a JavaScript object
 */
export default function createSchema(schema: InputConfig) {
    const schemaTypes = Object.entries(schema).reduce<Context>((context, [name, {type, ...input}]) => {
        const graphqlTypeResolver = GRAPHQL_OBJECT_RESOLVERS[type];

        // @ts-ignore
        context[name] = graphqlTypeResolver(context, name, input);

        return context;
    }, {});

    const queries = schemaTypes["query"] as GraphQLObjectType<any, any> | undefined;
    const mutations = schemaTypes["mutation"] as GraphQLObjectType<any, any> | undefined;

    // Think about if we just want to return the values (query, mutations, etc) or also manage the schema itself
    return new GraphQLSchema({query: queries, mutation: mutations});
}
