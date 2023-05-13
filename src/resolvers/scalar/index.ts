import {GraphQLScalarType} from "graphql";
import type {Context} from "../../types";
import type {GraphqlScalarConfig} from "../../types/input";

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
