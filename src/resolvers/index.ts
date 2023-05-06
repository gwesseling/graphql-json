import createGraphQLEnumType from "./enum";
import createGraphqlObjectType from "./object";

export const GRAPHQL_OBJECT_RESOLVER = {
    ["GraphQLEnumType"]: createGraphQLEnumType,
    ["GraphQLObjectType"]: createGraphqlObjectType,
};
