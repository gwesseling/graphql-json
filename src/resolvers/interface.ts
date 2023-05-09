import {GraphqlInterfaceConfig} from "../types/input";
import {Context} from "../types";
import {GraphQLInterfaceType} from "graphql";
import {getGraphqlFields, getGraphqlInterfaces} from "../libs/utils";

/**
 * Create a GraphQL Interface Type
 */
export default function createGraphQLInterfaceType(
    context: Context,
    name: string,
    {fields, interfaces, ...config}: GraphqlInterfaceConfig<unknown, unknown>,
) {
    return new GraphQLInterfaceType({
        name,
        ...config,
        interfaces: getGraphqlInterfaces(context, interfaces),
        fields: getGraphqlFields(context, undefined, fields),
    });
}
