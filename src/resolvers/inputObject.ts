import {GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputType} from "graphql";
import {GraphqlInputFieldConfig, GraphqlInputObjectConfig} from "../types/input";
import {Context} from "../types";
import {composeGraphqlType} from "../libs/utils";

type FieldContext = {[key: string]: GraphQLInputFieldConfig};
type FieldEntry = [name: string, fieldconfig: GraphqlInputFieldConfig];

/**
 * Create a GraphQL Object Input Type
 */
export default function createGraphQLObjectInputType(
    context: Context,
    name: string,
    {fields, ...config}: GraphqlInputObjectConfig,
) {
    /**
     * Get a GraphQL fielld
     */
    function getField(fieldContext: FieldContext, [name, fieldconfig]: FieldEntry) {
        fieldContext[name] = createGraphqlFieldType(context, fieldconfig);
        return fieldContext;
    }

    return new GraphQLInputObjectType({
        name,
        fields: Object.entries(fields).reduce(getField, {}),
        ...config,
    });
}

/**
 * Create GraphQL field object
 */
function createGraphqlFieldType(context: Context, {type, required, item, ...field}: GraphqlInputFieldConfig) {
    const fieldObjectType = composeGraphqlType(context, undefined, {type, required, item}) as GraphQLInputType;
    return {...field, type: fieldObjectType};
}
