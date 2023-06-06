import {GraphQLObjectType, GraphQLUnionType} from "graphql";
import type {Context, ContextValue} from "_TYPES/index";
import type {GraphqlUnionConfig} from "_TYPES/input";

/**
 * Create a GraphQL Union Type
 */
export default function composeGraphQLUnionType(
    context: Context,
    name: string,
    {types, ...config}: GraphqlUnionConfig<unknown, unknown>,
) {
    const graphqlTypes = composeTypes(context, types);

    return new GraphQLUnionType({
        name,
        types: graphqlTypes,
        ...config,
    });
}

/**
 * Get GraphQL types from context
 */
function composeTypes(context: Context, types: ReadonlyArray<GraphQLObjectType | string>) {
    return types.map((type) => {
        let graphqlType: ContextValue | string = type;

        // Resolve GraphQL type from context
        if (typeof graphqlType === "string") graphqlType = context[graphqlType];

        // Throw error if the final GraphQl type is not an GraphQLObjectType
        if (!(graphqlType instanceof GraphQLObjectType))
            throw new Error(`Only GraphQLObjectTypes can be added to an union type (${type})`);

        return graphqlType;
    });
}
