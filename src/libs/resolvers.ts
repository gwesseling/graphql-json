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
import {GraphqlEnumConfig, GraphqlObjectConfig, GraphqlFieldConfig} from "../types/input";
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
        fields: () => Object.entries(fields).reduce((fieldContext, [name, config]) => {
            fieldContext[name] = createGraphqlFieldType(context, graphqlObjectType, config)
            return fieldContext;
        }, {})
    });

    return graphqlObjectType;
}

/**
 * Create a Graphql Object Field Type
 */
function createGraphqlFieldType(context: Context, parent: GraphQLObjectType<any, any>, {type, required, item, ...rest}: GraphqlFieldConfig<any, any>) {
    let graphqlType = GRAPHQL_FIELD_TYPE[type];

    if (type === GraphqlFieldType.List) {
        if (!item) throw new Error("Items is required when type is List");
        
        let itemsType = GRAPHQL_FIELD_TYPE[item.type] || context[item.type] || parent;

        if (item.required) itemsType = new GraphQLNonNull(itemsType);
        
        graphqlType = new GraphQLList(itemsType);
    }

    if (required) return new GraphQLNonNull(graphqlType);

    return {type: graphqlType, ...rest};
}