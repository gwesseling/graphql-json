import {
    GraphQLArgumentConfig,
    GraphQLFieldConfig,
    GraphQLInputType,
    GraphQLInterfaceType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLOutputType,
    GraphQLType,
} from "graphql";
import {ObjMap} from "../types/utils";
import {Context, ContextValue} from "../types";
import {GraphqlArgumentConfig, GraphqlFieldConfig, GraphqlOutputType} from "../types/input";

type FieldContext = {[key: string]: GraphQLFieldConfig<unknown, unknown>};
type FieldEntry = [name: string, fieldconfig: GraphqlFieldConfig<unknown, unknown>];

type ArgumentContext = {[key: string]: GraphQLArgumentConfig};
type ArgumentEntry = [name: string, fieldconfig: GraphqlArgumentConfig];

/**
 * Get GraphQL interface type from context
 */
export function getGraphqlInterfaces(context: Context, interfaces?: ReadonlyArray<GraphQLInterfaceType | string>) {
    return interfaces?.map((inter) => {
        let graphqlInterface: ContextValue | string = inter;

        // Resolve GraphQL interface from context
        if (typeof graphqlInterface === "string") graphqlInterface = context[graphqlInterface];

        // Throw error if the final GraphQl interface is not an GraphQLInterfaceType
        if (!(graphqlInterface instanceof GraphQLInterfaceType))
            throw new Error(`Only GraphQLInterfaceTypes can be added to a Object or an interface type (${inter})`);

        return graphqlInterface;
    });
}

/**
 * Get GraphQL fields
 */
export function getGraphqlFields(
    context: Context,
    parent: GraphQLObjectType<unknown, unknown> | GraphQLInterfaceType | undefined,
    fields: ObjMap<GraphqlFieldConfig<unknown, unknown, unknown>>,
) {
    return Object.entries(fields).reduce((fieldContext: FieldContext, [name, fieldconfig]: FieldEntry) => {
        fieldContext[name] = createGraphqlFieldType(context, parent, fieldconfig);
        return fieldContext;
    }, {});
}

/**
 * Create GraphQL field object
 */
export function createGraphqlFieldType(
    context: Context,
    parent: GraphQLObjectType<unknown, unknown> | GraphQLInterfaceType | undefined,
    {type, required, item, args = {}, ...field}: GraphqlFieldConfig<unknown, unknown>,
) {
    /**
     * Get a GraphQL argument
     */
    function getArgument(argsContext: ArgumentContext, [name, argConfig]: ArgumentEntry) {
        argsContext[name] = createGraphqlArgumentType(context, parent, argConfig);
        return argsContext;
    }

    const argsObjectMap = Object.entries(args).reduce(getArgument, {});
    const fieldObjectType = composeGraphqlType(context, parent, {type, required, item}) as GraphQLOutputType;

    return {...field, type: fieldObjectType, args: argsObjectMap};
}

/**
 * Create graphql argument object
 */
function createGraphqlArgumentType(
    context: Context,
    parent: GraphQLObjectType<unknown, unknown> | GraphQLInterfaceType | undefined,
    {type, required, item, ...arg}: GraphqlArgumentConfig,
) {
    const argumentObjectType = composeGraphqlType(context, parent, {type, required, item}) as GraphQLInputType;

    return {...arg, type: argumentObjectType};
}

/**
 * Compose GraphQL type based on context, parent and given type
 */
export function composeGraphqlType(
    context: Context,
    parent: GraphQLObjectType<unknown, unknown> | GraphQLInterfaceType | undefined,
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
    parent: GraphQLObjectType<unknown, unknown> | GraphQLInterfaceType | undefined,
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
