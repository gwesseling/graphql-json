import {GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLOutputType} from "graphql";
import {GraphqlArgumentConfig, GraphqlFieldConfig, GraphqlObjectConfig, GraphqlSubOutputType} from "../types/input";
import {Context} from "../index";

// TODO: improve this (especially the last two function, also try to make it sharable with GraphQLInputObjectType)
/**
 * Create a GraphQL Object Type
 */
export default function createGraphqlObjectType(
    context: Context,
    name: string,
    {fields, ...config}: GraphqlObjectConfig<unknown, unknown>,
) {
    // We need to do it like this to support recursion of object types
    const graphqlObjectType = new GraphQLObjectType({
        name,
        ...config,
        fields: () =>
            Object.entries(fields).reduce((fieldContext, [name, fieldconfig]) => {
                fieldContext[name] = createGraphqlFieldType(context, graphqlObjectType, fieldconfig);
                return fieldContext;
            }, {}),
    });

    return graphqlObjectType;
}

/**
 * Create graphql field object
 */
function createGraphqlFieldType(
    context: Context,
    parent: GraphQLObjectType<unknown, unknown>,
    {type, required, item, args = {}, ...field}: GraphqlFieldConfig<unknown, unknown>,
) {
    const argsObjectMap = Object.entries(args).reduce((argsContext, [name, argConfig]) => {
        argsContext[name] = createGraphqlArgumentType(context, parent, argConfig);
        return argsContext;
    }, {});

    const fieldObjectType = createGraphqlType(context, parent, {type, required, item});

    return {...field, type: fieldObjectType, args: argsObjectMap};
}

/**
 * Create graphql argument object
 */
function createGraphqlArgumentType(
    context: Context,
    parent: GraphQLObjectType<unknown, unknown>,
    {type, required, item, ...arg}: GraphqlArgumentConfig,
) {
    const argumentObjectType = createGraphqlType(context, parent, {type, required, item});

    return {...arg, type: argumentObjectType};
}

/**
 * Get Graphql object type
 */
function createGraphqlType(context: Context, parent: GraphQLObjectType<unknown, unknown>, {type, required, item}) {
    let graphqlType = getGraphqltype(context, parent, type);

    if (typeof graphqlType === typeof GraphQLList) {
        if (!item) throw new Error("Items is required when type is List");

        let itemsType = getGraphqltype(context, parent, item.type);

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
    parent: GraphQLObjectType<unknown, unknown>,
    type: GraphqlSubOutputType | typeof GraphQLList,
) {
    // Check if type is one of the previous created types
    if (typeof type === "string" && context[type]) return context[type];

    // Check if type is the parent type (recursion)
    if (typeof type === "string" && parent.name === type) return parent;

    // Throw an error if we can't find the type based on the string
    if (typeof type === "string") throw new Error(`Could not find type with the name '${type}'`);

    return type as GraphQLOutputType;
}
