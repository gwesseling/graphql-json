import { GraphQLEnumType, GraphQLObjectType } from "graphql";
import {GRAPHQL_OBJECT_RESOLVERS } from "./libs/resolvers";
import type { GraphqlEnumConfig, GraphqlObjectConfig } from "./types/input";

type InputConfigType = GraphqlObjectConfig<any, any> | GraphqlEnumConfig;
type InputConfig = {[name: string]: InputConfigType}

export type Context = {[name: string]: GraphQLEnumType | GraphQLObjectType<any, any>};

/**
 * Create a schema from a JSON or a JavaScript object
 */
export default function createSchema(schema: InputConfig) {
    return Object.entries(schema).reduce<Context>((context, [name, {type, ...input}]) => {
        const graphqlTypeResolver = GRAPHQL_OBJECT_RESOLVERS[type];

        // @ts-ignore
        context[name] = graphqlTypeResolver(context, name, input);
        return context;
    }, {});
}