import {GraphQLEnumType} from "graphql";
import type {Context} from "../../types";
import type {GraphqlEnumConfig} from "../../types/input";

/**
 * Create a GraphQL Enum Type
 */
export default function composeGraphQLEnumType(_context: Context, name: string, config: GraphqlEnumConfig) {
    return new GraphQLEnumType({name, ...config});
}
