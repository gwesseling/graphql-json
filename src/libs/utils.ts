import {GraphQLInputType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLOutputType} from "graphql";
import {Context} from "../index";
import {GraphqlOutputType} from "../types/input";

/**
 * Compose GraphQL type based on context, parent and given type
 */
export function composeGraphqlType(
    context: Context,
    parent: GraphQLObjectType<unknown, unknown> | undefined,
    {type, required, item},
) {
    let graphqlType: GraphQLOutputType | GraphQLInputType = getGraphqltype(context, parent, type);

    if (typeof graphqlType === typeof GraphQLList) {
        if (!item) throw new Error("Items is required when type is List");

        let itemsType: GraphQLOutputType | GraphQLInputType = getGraphqltype(context, parent, item.type);

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
