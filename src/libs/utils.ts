import {GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLType} from "graphql";
import {Context} from "../types";
import {GraphqlOutputType} from "../types/input";

/**
 * Compose GraphQL type based on context, parent and given type
 */
export function composeGraphqlType(
    context: Context,
    parent: GraphQLObjectType<unknown, unknown> | undefined,
    {type, required, item},
) {
    let graphqlType: GraphQLType = getGraphqltype(context, parent, type);

    if (graphqlType.name === "GraphQLList") {
        if (!item) throw new Error("Items is required when type is List");

        let itemsType: GraphQLType = getGraphqltype(context, parent, item.type);

        if (item.required) itemsType = new GraphQLNonNull(itemsType);

        graphqlType = new GraphQLList(itemsType);
    }

    if (required) return new GraphQLNonNull(graphqlType);

    return graphqlType;
}

/**
 * Get a GraphQL type based on a string (context/parent) or use an GraphQL type directly
 */
function getGraphqltype(
    context: Context,
    parent: GraphQLObjectType<unknown, unknown> | undefined,
    type: GraphqlOutputType,
) {
    // Check if type is one of the previous created types
    if (typeof type === "string" && context[type]) return context[type];

    // Check if type is the parent type (recursion)
    if (typeof type === "string" && parent?.name === type) return parent;

    // Throw an error if we can't find the type based on the string
    if (typeof type === "string") throw new Error(`Could not find type with the name '${type}'`);

    return type;
}
