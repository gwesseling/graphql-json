import createGraphQLEnumType from "./enum";
import createGraphqlObjectType from "./object";
import createGraphqlObjectInputType from "./inputObject";

const resolvers = {
    GraphQLEnumType: createGraphQLEnumType,
    GraphQLObjectType: createGraphqlObjectType,
    GraphQLInputObjectType: createGraphqlObjectInputType,
};

export default resolvers;
