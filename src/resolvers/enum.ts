import {GraphQLEnumType} from "graphql";
import {GraphqlEnumConfig} from "../types/input";
import {Context} from "../index";

/**
 * Create a GraphQL Enum Type
 */
export default function createGraphQLEnumType(_context: Context, name: string, config: GraphqlEnumConfig) {
    return new GraphQLEnumType({name, ...config});
}
