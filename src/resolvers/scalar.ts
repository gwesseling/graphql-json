import {GraphQLScalarType} from "graphql";
import {Context} from "../types";
import {GraphqlScalarConfig} from "..//types/input";

/**
 * Create a GraphQL Scalar Type
 */
export default function createGraphQLUnionType(
    _context: Context,
    name: string,
    config: GraphqlScalarConfig<unknown, unknown>,
) {
    return new GraphQLScalarType({
        name,
        ...config,
    });
}
