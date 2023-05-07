import {GraphQLEnumType} from "graphql";
import {Context} from "../types";
import {GraphqlEnumConfig} from "../types/input";

/**
 * Create a GraphQL Enum Type
 */
export default function createGraphQLEnumType(_context: Context, name: string, config: GraphqlEnumConfig) {
    return new GraphQLEnumType({name, ...config});
}
