import { 
    GraphQLEnumType, 
    GraphQLScalarType,
    GraphQLInterfaceType,
    GraphQLUnionType,
    GraphQLInt,
    GraphQLString,
    GraphQLBoolean,
    GraphQLID,
    GraphQLFloat,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
} from "graphql";
import {GraphqlEnumConfig, GraphqlObjectConfig, GraphqlFieldConfig, SubObjectConfig, GraphqlArgsConfig} from "../types/input";
import { GraphqlType, GraphqlFieldType } from "../types/enums";
import { Context } from "../index";

export const GRAPHQL_OBJECT_RESOLVERS = {
    [GraphqlType.Enum]: createGraphQLEnumType,
    [GraphqlType.Object]: createGraphqlObjectType,
}

export const GRAPHQL_FIELD_TYPE = {
    [GraphqlFieldType.Scalar]: GraphQLScalarType,
    [GraphqlFieldType.Interface]: GraphQLInterfaceType,
    [GraphqlFieldType.Union]: GraphQLUnionType,
    [GraphqlFieldType.Int]: GraphQLInt,
    [GraphqlFieldType.String]: GraphQLString,
    [GraphqlFieldType.Boolean]: GraphQLBoolean,
    [GraphqlFieldType.ID]: GraphQLID,
    [GraphqlFieldType.Float]: GraphQLFloat,
    [GraphqlFieldType.List]: GraphQLList,
}

/**
 * Create a GraphQL Enum Type
 */
function createGraphQLEnumType(_context: Context, name: string, config: GraphqlEnumConfig) {
    return new GraphQLEnumType({name, ...config});
}

/**
 * Create a GraphQL Object Type
 */
function createGraphqlObjectType(context: Context, name: string, {fields, ...config}: GraphqlObjectConfig<any, any>) {
    // We need to do it like this to support recursion of object types
    const graphqlObjectType = new GraphQLObjectType({name, ...config, 
        fields: () => Object.entries(fields).reduce((fieldContext, [name, fieldconfig]) => {
            fieldContext[name] = createGraphqlFieldType(context, graphqlObjectType, fieldconfig);
            return fieldContext;
        }, {})
    });

    return graphqlObjectType;
}

/**
 * Create graphql field object
 */
function createGraphqlFieldType(context: Context, parent: GraphQLObjectType<any, any>, {type, required, item, args = {}, ...field}: GraphqlFieldConfig<any, any>) {
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
function createGraphqlArgumentType(context: Context, parent: GraphQLObjectType<any, any>, {type, required, item, ...arg}: GraphqlArgsConfig<any, any>) {
    const argumentObjectType = createGraphqlType(context, parent, {type, required, item});

    return {...arg, type: argumentObjectType}
}

/**
 * Get Graphql object type
 */
function createGraphqlType(context: Context, parent: GraphQLObjectType<any, any>, {type, required, item}: SubObjectConfig<any, any>) {
    let graphqlType = GRAPHQL_FIELD_TYPE[type] || context[type] || parent;

    if (type === GraphqlFieldType.List) {
        if (!item) throw new Error("Items is required when type is List");
    
        let itemsType = GRAPHQL_FIELD_TYPE[item.type] || context[item.type] || parent;

        if (item.required) itemsType = new GraphQLNonNull(itemsType);
        
        graphqlType = new GraphQLList(itemsType);
    }

    if (required) return new GraphQLNonNull(graphqlType);

    return graphqlType;
}