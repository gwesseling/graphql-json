/* eslint-disable max-lines-per-function */
import {GraphQLFloat, GraphQLList, GraphQLNonNull, GraphQLString} from "graphql";
import {graphqlInterface, graphqlObject} from "../../mocks/graphqlTypes";
import {composeGraphqlType, getGraphqlInterfaces, getGraphqltype} from "./index";

const CONTEXT = {
    graphqlInterface: graphqlInterface,
    graphqlObject: graphqlObject,
};

describe("Get GraphQL interface", () => {
    test("Should return undefined when not given a list with GraphQLInterfaceType or strings", () => {
        const result = getGraphqlInterfaces(CONTEXT, undefined);
        expect(result).toBeUndefined();
    });

    test("Should return empty array when given an empty list with GraphQLInterfaceType or strings", () => {
        const result = getGraphqlInterfaces(CONTEXT, []);
        expect(result).toEqual([]);
    });

    test("Should return GraphQLInterfaceType when it exist in context", () => {
        const result = getGraphqlInterfaces(CONTEXT, ["graphqlInterface"]);
        expect(result).toEqual([graphqlInterface]);
    });

    test("Should return GraphQLInterfaceType when it is provided", () => {
        const result = getGraphqlInterfaces(CONTEXT, [graphqlInterface]);
        expect(result).toEqual([graphqlInterface]);
    });

    test("Should return GraphQLInterfaceType when either a string or an interface is provided", () => {
        const result = getGraphqlInterfaces(CONTEXT, ["graphqlInterface", graphqlInterface]);
        expect(result).toEqual([graphqlInterface, graphqlInterface]);
    });

    test("Should throw when it cannot find a GraphQLInterfaceType", () => {
        // eslint-disable-next-line require-jsdoc
        const result = () => getGraphqlInterfaces(CONTEXT, ["graphqlObject"]);
        expect(result).toThrow("Only GraphQLInterfaceTypes can be added to a Object or interface type (graphqlObject)");
    });
});

describe("Compose a GraphQL type", () => {
    test("Should resolve to a non-nullable list of non-nullable strings", () => {
        const result = composeGraphqlType(CONTEXT, graphqlObject, {
            type: GraphQLList,
            item: {
                type: GraphQLString,
                required: true,
            },
            required: true,
        });
        const expected = new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString)));
        expect(result).toEqual(expected);
    });

    test("Should resolve to a list of non-nullable objects", () => {
        const result = composeGraphqlType(CONTEXT, graphqlObject, {
            type: GraphQLList,
            item: {
                type: "graphqlObjectType",
                required: true,
            },
        });
        const expected = new GraphQLList(new GraphQLNonNull(graphqlObject));
        expect(result).toEqual(expected);
    });

    test("Should resolve to a list of objects from context", () => {
        const result = composeGraphqlType(CONTEXT, undefined, {
            type: GraphQLList,
            item: {
                type: "graphqlObject",
            },
        });
        const expected = new GraphQLList(graphqlObject);
        expect(result).toEqual(expected);
    });

    test("Should throw an error when item in not defined and type is GraphQLList", () => {
        // eslint-disable-next-line require-jsdoc
        const result = () =>
            composeGraphqlType(CONTEXT, undefined, {
                type: GraphQLList,
                required: true,
            });
        expect(result).toThrow("Item is required when type is GraphQLList");
    });

    test("Should resolve to a non-nullable type", () => {
        const result = composeGraphqlType(CONTEXT, undefined, {
            type: GraphQLFloat,
            required: true,
        });
        const expected = new GraphQLNonNull(GraphQLFloat);
        expect(result).toEqual(expected);
    });

    test("Should resolve to input type", () => {
        const result = composeGraphqlType(CONTEXT, undefined, {
            type: GraphQLFloat,
        });
        expect(result).toEqual(GraphQLFloat);
    });
});

describe("Get GraphQL type", () => {
    test("Should return type when type is not a string", () => {
        const result = getGraphqltype(CONTEXT, graphqlObject, graphqlInterface);
        expect(result).toEqual(graphqlInterface);
    });

    test("Should return from context when type is equal to context value", () => {
        const result = getGraphqltype(CONTEXT, graphqlObject, "graphqlInterface");
        expect(result).toEqual(graphqlInterface);
    });

    test("Should return parent when parent name is equal to type", () => {
        const result = getGraphqltype(CONTEXT, graphqlObject, "graphqlObjectType");
        expect(result).toEqual(graphqlObject);
    });

    test("Should throw when it cannot find a type", () => {
        // eslint-disable-next-line require-jsdoc
        const result = () => getGraphqltype(CONTEXT, graphqlObject, "test");
        expect(result).toThrow("Could not find type 'test'");
    });
});
