import createGraphQLEnumType from "./enum";
import createGraphQLObjectType from "./object";
import createGraphQLObjectInputType from "./inputObject";
import createGraphQLUnionType from "./union";
import createGraphQLInterfaceType from "./interface";
import createGraphqlScalarType from "./scalar";

const resolvers = {
    GraphQLEnumType: createGraphQLEnumType,
    GraphQLObjectType: createGraphQLObjectType,
    GraphQLInputObjectType: createGraphQLObjectInputType,
    GraphQLUnionType: createGraphQLUnionType,
    GraphQLInterfaceType: createGraphQLInterfaceType,
    GraphQLScalarType: createGraphqlScalarType,
};

export default resolvers;
