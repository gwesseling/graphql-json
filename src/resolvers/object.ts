import {GraphQLObjectType} from "graphql";
import {GraphqlObjectConfig} from "../types/input";
import {Context} from "../types";
import {getGraphqlFields, getGraphqlInterfaces} from "../libs/utils";

/**
 * Create a GraphQL Object Type
 */
export default function createGraphQLObjectType(
    context: Context,
    name: string,
    {fields, interfaces, ...config}: GraphqlObjectConfig<unknown, unknown>,
) {
    // We need to do it like this to support recursion of object types
    const graphqlObjectType = new GraphQLObjectType({
        name,
        ...config,
        interfaces: getGraphqlInterfaces(context, interfaces),
        fields: () => getGraphqlFields(context, graphqlObjectType, fields),
    });

    return graphqlObjectType;
}
