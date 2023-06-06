import {GraphQLInterfaceType} from "graphql";
import type {GraphqlInterfaceConfig} from "_TYPES/input";
import type {Context} from "_TYPES/index";
import {composeGraphQLFields, composeGraphQLInterfaces} from "_LIBS/index";

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
