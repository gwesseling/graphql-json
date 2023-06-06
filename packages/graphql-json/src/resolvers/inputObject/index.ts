import {GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputType} from "graphql";
import type {GraphqlInputFieldConfig, GraphqlInputObjectConfig} from "../../types/input";
import type {Context} from "../../types/index";
import {composeGraphQLType} from "../../libs/index";

type FieldContext = {[key: string]: GraphQLInputFieldConfig};
type FieldEntry = [name: string, fieldconfig: GraphqlInputFieldConfig];

/**
 * Create a GraphQL Object Input Type
 */
export default function composeGraphQLObjectInputType(
    context: Context,
    name: string,
    {fields, ...config}: GraphqlInputObjectConfig,
) {
    /**
     * Get a GraphQL fielld
     */
    function getField(fieldContext: FieldContext, [name, fieldconfig]: FieldEntry) {
        fieldContext[name] = createGraphQLFieldType(context, fieldconfig);
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
function createGraphQLFieldType(context: Context, {type, required, list, ...field}: GraphqlInputFieldConfig) {
    const fieldObjectType = composeGraphQLType(context, undefined, {type, required, list}) as GraphQLInputType;
    return {...field, type: fieldObjectType};
}
