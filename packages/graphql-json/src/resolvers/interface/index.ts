import {GraphQLInterfaceType} from "graphql";
import type {GraphqlInterfaceConfig} from "../../types/input";
import type {Context} from "../../types/index";
import {composeGraphQLFields, composeGraphQLInterfaces} from "../../libs/index";

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
