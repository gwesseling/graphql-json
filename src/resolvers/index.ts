import createGraphQLEnumType from "./enum";
import createGraphQLObjectType from "./object";
import createGraphQLObjectInputType from "./inputObject";
import createGraphQLUnionType from "./union";
import createGraphQLInterfaceType from "./interface";

const resolvers = {
    GraphQLEnumType: createGraphQLEnumType,
    GraphQLObjectType: createGraphQLObjectType,
    GraphQLInputObjectType: createGraphQLObjectInputType,
    GraphQLUnionType: createGraphQLUnionType,
    GraphQLInterfaceType: createGraphQLInterfaceType,
};

export default resolvers;
