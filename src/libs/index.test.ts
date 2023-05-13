/* eslint-disable max-lines-per-function */
import {GraphQLFloat, GraphQLList, GraphQLNonNull, GraphQLString} from "graphql";
import {
    listOfContextObject,
    listOfNonNullableObject,
    listWithoutItem,
    nonNullableType,
    nonNullableListOfNonNullableString,
    nullableType,
    argumentConfig,
    fieldConfig,
    fieldMapConfig,
} from "../mocks/config";
import {
    context,
    graphqlArg,
    graphqlfield,
    graphqlFieldMap,
    graphqlfieldWithArg,
    graphqlInterface,
    graphqlObject,
} from "../mocks/graphqlTypes";
import {
    composeGraphQLType,
    composeGraphQLArgumentType,
    composeGraphQLFieldType,
    composeGraphQLFields,
    composeGraphQLInterfaces,
    getGraphQLtype,
} from "./index";

describe("ComposeGraphQLInterfaces", () => {
    test("Should return undefined when not given a list with GraphQLInterfaceType or strings", () => {
        const result = composeGraphQLInterfaces(context, undefined);
        expect(result).toBeUndefined();
    });

    test("Should return empty array when given an empty list with GraphQLInterfaceType or strings", () => {
        const result = composeGraphQLInterfaces(context, []);
        expect(result).toEqual([]);
    });

    test("Should return GraphQLInterfaceType when it exist in context", () => {
        const result = composeGraphQLInterfaces(context, ["graphqlInterface"]);
        const actual = result?.map((o) => o.toConfig());
        expect(actual).toMatchObject([graphqlInterface]);
    });

    test("Should return GraphQLInterfaceType when it is provided", () => {
        const result = composeGraphQLInterfaces(context, [context.graphqlInterface]);
        const actual = result?.map((o) => o.toConfig());
        expect(actual).toMatchObject([graphqlInterface]);
    });

    test("Should return GraphQLInterfaceType when either a string or an interface is provided", () => {
        const result = composeGraphQLInterfaces(context, ["graphqlInterface", context.graphqlInterface]);
        const actual = result?.map((o) => o.toConfig());
        expect(actual).toMatchObject([graphqlInterface, graphqlInterface]);
    });

    test("Should throw when it cannot find a GraphQLInterfaceType", () => {
        // eslint-disable-next-line require-jsdoc
        const result = () => composeGraphQLInterfaces(context, ["graphqlObject"]);
        expect(result).toThrow("Only GraphQLInterfaceTypes can be added to a Object or interface type (graphqlObject)");
    });
});

describe("ComposeGraphQLFields", () => {
    test("Should resolve to a GraphQL field map", () => {
        const result = composeGraphQLFields(context, undefined, fieldMapConfig);
        expect(result).toMatchObject(graphqlFieldMap);
    });
});

describe("ComposeGraphQLFieldType", () => {
    test("Should resolve to a GraphQL field type", () => {
        const result = composeGraphQLFieldType(context, undefined, fieldConfig);
        expect(result).toMatchObject(graphqlfield);
    });

    test("Should resolve to a GraphQL field type with args", () => {
        const result = composeGraphQLFieldType(context, undefined, {...fieldConfig, args: {arg: argumentConfig}});
        expect(result).toMatchObject(graphqlfieldWithArg);
    });
});

describe("ComposeGraphQLArgumentType", () => {
    test("Should resolve to a GraphQL argument type", () => {
        const result = composeGraphQLArgumentType(context, undefined, argumentConfig);
        expect(result).toMatchObject(graphqlArg);
    });
});

describe("ComposeGraphQLType", () => {
    test("Should resolve to a non-nullable list of non-nullable strings", () => {
        const result = composeGraphQLType(context, context.graphqlObject, nonNullableListOfNonNullableString);
        const expected = new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString)));
        expect(result).toMatchObject(expected);
    });

    test("Should resolve to a list of non-nullable objects", () => {
        const result = composeGraphQLType(context, context.graphqlObject, listOfNonNullableObject);
        const expected = new GraphQLList(new GraphQLNonNull(context.graphqlObject));
        expect(result).toMatchObject(expected);
    });

    test("Should resolve to a list of objects from context", () => {
        const result = composeGraphQLType(context, undefined, listOfContextObject);
        const expected = new GraphQLList(context.graphqlObject);
        expect(result).toMatchObject(expected);
    });

    test("Should throw an error when item in not defined and type is GraphQLList", () => {
        // eslint-disable-next-line require-jsdoc
        const result = () => composeGraphQLType(context, undefined, listWithoutItem);
        expect(result).toThrow("Item is required when type is GraphQLList");
    });

    test("Should resolve to a non-nullable type", () => {
        const result = composeGraphQLType(context, undefined, nonNullableType);
        const expected = new GraphQLNonNull(GraphQLFloat);
        expect(result).toMatchObject(expected);
    });

    test("Should resolve to input type", () => {
        const result = composeGraphQLType(context, undefined, nullableType);
        expect(result).toMatchObject(GraphQLFloat);
    });
});

describe("GetGraphQLtype", () => {
    test("Should return type when type is not a string", () => {
        const result = getGraphQLtype(context, context.graphqlObject, context.graphqlInterface);
        expect(result.toConfig()).toMatchObject(graphqlInterface);
    });

    test("Should return from context when type is equal to context value", () => {
        const result = getGraphQLtype(context, context.graphqlObject, "graphqlInterface");
        expect(result.toConfig()).toMatchObject(graphqlInterface);
    });

    test("Should return parent when parent name is equal to type", () => {
        const result = getGraphQLtype(context, context.graphqlObject, "graphqlObjectType");
        expect(result.toConfig()).toMatchObject(graphqlObject);
    });

    test("Should throw when it cannot find a type", () => {
        // eslint-disable-next-line require-jsdoc
        const result = () => getGraphQLtype(context, context.graphqlObject, "test");
        expect(result).toThrow("Could not find type 'test'");
    });
});
