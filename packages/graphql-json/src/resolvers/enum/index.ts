import {GraphQLEnumType} from "graphql";
import type {Context} from "_TYPES/index";
import type {GraphqlEnumConfig} from "_TYPES/input";

/**
 * Create a GraphQL Enum Type
 */
export default function composeGraphQLEnumType(_context: Context, name: string, config: GraphqlEnumConfig) {
    return new GraphQLEnumType({name, ...config});
}
