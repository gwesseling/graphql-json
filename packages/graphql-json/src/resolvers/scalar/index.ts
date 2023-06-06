import {GraphQLScalarType} from "graphql";
import type {Context} from "_TYPES/index";
import type {GraphqlScalarConfig} from "_TYPES/input";

/**
 * Create a GraphQL Scalar Type
 */
export default function composeGraphQLUnionType(
    _context: Context,
    name: string,
    config: GraphqlScalarConfig<unknown, unknown>,
) {
    return new GraphQLScalarType({
        name,
        ...config,
    });
}
