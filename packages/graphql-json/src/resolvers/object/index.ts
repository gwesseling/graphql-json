import {GraphQLObjectType} from "graphql";
import {composeGraphQLFields, composeGraphQLInterfaces} from "../../libs/index";
import type {GraphqlObjectConfig} from "../../types/input";
import type {Context} from "../../types/index";

/**
 * Create a GraphQL Object Type
 */
export default function composeGraphQLObjectType(
    context: Context,
    name: string,
    {fields, interfaces, ...config}: GraphqlObjectConfig<unknown, unknown>,
) {
    // We need to do it like this to support recursion of object types
    const graphqlObjectType = new GraphQLObjectType({
        name,
        ...config,
        interfaces: composeGraphQLInterfaces(context, interfaces),
        fields: () => composeGraphQLFields(context, graphqlObjectType, fields),
    });

    return graphqlObjectType;
}
