import {
    GraphQLArgumentConfig,
    GraphQLFieldConfig,
    GraphQLInputType,
    GraphQLObjectType,
    GraphQLOutputType,
} from "graphql";
import {GraphqlArgumentConfig, GraphqlFieldConfig, GraphqlObjectConfig} from "../types/input";
import {Context} from "../index";
import {composeGraphqlType} from "../libs/utils";

type FieldContext = {[key: string]: GraphQLFieldConfig<unknown, unknown>};
type FieldEntry = [name: string, fieldconfig: GraphqlFieldConfig<unknown, unknown>];

type ArgumentContext = {[key: string]: GraphQLArgumentConfig};
type ArgumentEntry = [name: string, fieldconfig: GraphqlArgumentConfig];

/**
 * Create a GraphQL Object Type
 */
export default function createGraphqlObjectType(
    context: Context,
    name: string,
    {fields, ...config}: GraphqlObjectConfig<unknown, unknown>,
) {
    /**
     * Get a GraphQL fielld
     */
    function getField(fieldContext: FieldContext, [name, fieldconfig]: FieldEntry) {
        fieldContext[name] = createGraphqlFieldType(context, graphqlObjectType, fieldconfig);
        return fieldContext;
    }

    // We need to do it like this to support recursion of object types
    const graphqlObjectType = new GraphQLObjectType({
        name,
        ...config,
        fields: () => Object.entries(fields).reduce(getField, {}),
    });

    return graphqlObjectType;
}

/**
 * Create GraphQL field object
 */
function createGraphqlFieldType(
    context: Context,
    parent: GraphQLObjectType<unknown, unknown>,
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
    parent: GraphQLObjectType<unknown, unknown>,
    {type, required, item, ...arg}: GraphqlArgumentConfig,
) {
    const argumentObjectType = composeGraphqlType(context, parent, {type, required, item}) as GraphQLInputType;

    return {...arg, type: argumentObjectType};
}
