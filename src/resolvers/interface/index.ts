import {GraphQLInterfaceType} from "graphql";
import type {GraphqlInterfaceConfig} from "../../types/input";
import type {Context} from "../../types";
import {composeGraphQLFields, composeGraphQLInterfaces} from "../../libs";

/**
 * Create a GraphQL Interface Type
 */
export default function composeGraphQLInterfaceType(
    context: Context,
    name: string,
    {fields, interfaces, ...config}: GraphqlInterfaceConfig<unknown, unknown>,
) {
    return new GraphQLInterfaceType({
        name,
        ...config,
        interfaces: composeGraphQLInterfaces(context, interfaces),
        fields: composeGraphQLFields(context, undefined, fields),
    });
}
