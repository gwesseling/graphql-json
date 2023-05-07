import {GraphQLObjectType, GraphQLUnionType} from "graphql";
import {Context, ContextValue} from "../types";
import {GraphqlUnionConfig} from "../types/input";

/**
 * Create a GraphQL Union Type
 */
export default function createGraphQLUnionType(
    context: Context,
    name: string,
    {types, ...config}: GraphqlUnionConfig<unknown, unknown>,
) {
    const graphqlTypes = getTypes(context, types);

    return new GraphQLUnionType({
        name,
        types: graphqlTypes,
        ...config,
    });
}

/**
 * Get GraphQL types from context
 */
function getTypes(context: Context, types: ReadonlyArray<GraphQLObjectType | string>) {
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
