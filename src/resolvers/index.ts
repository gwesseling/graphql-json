import createGraphQLEnumType from "./enum";
import createGraphqlObjectType from "./object";
import createGraphqlObjectInputType from "./inputObject";
import createGraphQLUnionType from "./union";

const resolvers = {
    GraphQLEnumType: createGraphQLEnumType,
    GraphQLObjectType: createGraphqlObjectType,
    GraphQLInputObjectType: createGraphqlObjectInputType,
    GraphQLUnionType: createGraphQLUnionType,
};

export default resolvers;
