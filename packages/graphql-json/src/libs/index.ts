import {
    GraphQLEnumType,
    GraphQLID,
    GraphQLInputObjectType,
    GraphQLInputType,
    GraphQLInterfaceType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLOutputType,
    GraphQLScalarType,
    GraphQLType,
    GraphQLUnionType,
    GraphQLInt,
    GraphQLFloat,
    GraphQLString,
    GraphQLBoolean,
} from "graphql";
import type {ObjMap} from "../types/utils";
import type {
    ArgumentContext,
    ArgumentEntry,
    Context,
    ContextValue,
    FieldContext,
    FieldEntry,
    GraphqlCompositeTypeInput,
} from "../types";
import type {GraphqlArgumentConfig, GraphqlFieldConfig, GraphqlInputType, GraphqlOutputType} from "../types/input";

const typeResolver = {
    enum: GraphQLEnumType,
    object: GraphQLObjectType,
    input: GraphQLInputObjectType,
    union: GraphQLUnionType,
    interface: GraphQLInterfaceType,
    scalar: GraphQLScalarType,
    id: GraphQLID,
    int: GraphQLInt,
    float: GraphQLFloat,
    string: GraphQLString,
    boolean: GraphQLBoolean,
};

/**
 * Get GraphQL interface type from context
 */
export function composeGraphQLInterfaces(context: Context, interfaces?: ReadonlyArray<GraphQLInterfaceType | string>) {
    return interfaces?.map((inter) => {
        let graphqlInterface: ContextValue | string = inter;

        // Resolve GraphQL interface from context
        if (typeof graphqlInterface === "string") graphqlInterface = context[graphqlInterface];

        // Throw error if the final GraphQl interface is not an GraphQLInterfaceType
        if (!(graphqlInterface instanceof GraphQLInterfaceType))
            throw new Error(`Only GraphQLInterfaceTypes can be added to a Object or interface type (${inter})`);

        return graphqlInterface;
    });
}

/**
 * Get GraphQL fields
 */
export function composeGraphQLFields(
    context: Context,
    parent: GraphQLObjectType<unknown, unknown> | GraphQLInterfaceType | undefined,
    fields: ObjMap<GraphqlFieldConfig<unknown, unknown, unknown>>,
) {
    return Object.entries(fields).reduce((fieldContext: FieldContext, [name, fieldconfig]: FieldEntry) => {
        fieldContext[name] = composeGraphQLFieldType(context, parent, fieldconfig);
        return fieldContext;
    }, {});
}

/**
 * Create GraphQL field object
 */
export function composeGraphQLFieldType(
    context: Context,
    parent: GraphQLObjectType<unknown, unknown> | GraphQLInterfaceType | undefined,
    {type, required, list, args = {}, ...field}: GraphqlFieldConfig<unknown, unknown>,
) {
    /**
     * Get a GraphQL argument
     */
    function getArgument(argsContext: ArgumentContext, [name, argConfig]: ArgumentEntry) {
        argsContext[name] = composeGraphQLArgumentType(context, parent, argConfig);
        return argsContext;
    }

    const argsObjectMap = Object.entries(args).reduce(getArgument, {});
    const fieldObjectType = composeGraphQLType(context, parent, {type, required, list}) as GraphQLOutputType;

    return {...field, type: fieldObjectType, args: argsObjectMap};
}

/**
 * Create graphql argument object
 */
export function composeGraphQLArgumentType(
    context: Context,
    parent: GraphQLObjectType<unknown, unknown> | GraphQLInterfaceType | undefined,
    {type, required, list, ...arg}: GraphqlArgumentConfig,
) {
    const argumentObjectType = composeGraphQLType(context, parent, {type, required, list}) as GraphQLInputType;

    return {...arg, type: argumentObjectType};
}

/**
 * Compose GraphQL type based on context, parent and given type
 */
export function composeGraphQLType(
    context: Context,
    parent: GraphQLObjectType<unknown, unknown> | GraphQLInterfaceType | undefined,
    {type, required, list}: GraphqlCompositeTypeInput,
) {
    let graphqlType: GraphQLType | undefined;

    if (list) {
        let itemsType: GraphQLType = getGraphQLtype(context, parent, list.type);

        if (list.required) itemsType = new GraphQLNonNull(itemsType);

        graphqlType = new GraphQLList(itemsType);
    }

    if (type) graphqlType = getGraphQLtype(context, parent, type);

    if (!graphqlType) throw new Error("Type and list property cannot both be undefined");

    if (required) return new GraphQLNonNull(graphqlType);

    return graphqlType;
}

/**
 * Get a GraphQL type based on a string (context/parent) or use an GraphQL type directly
 */
export function getGraphQLtype(
    context: Context,
    parent: GraphQLObjectType<unknown, unknown> | GraphQLInterfaceType | undefined,
    type: GraphqlInputType | GraphqlOutputType,
) {
    // Check if type is the parent type (recursion)
    if (typeof type === "string" && parent?.name === type) return parent;

    // Check if type is one of the previous created types
    if (typeof type === "string" && context[type]) return context[type];

    // Resolve type based on string
    if (typeof type === "string" && typeResolver[type]) return typeResolver[type];

    // Throw an error if we can't find the type based on the string
    if (typeof type === "string") throw new Error(`Could not find type '${type}'`);

    return type;
}
