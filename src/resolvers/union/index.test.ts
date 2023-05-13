import {context, graphqlObject, graphqlUnion} from "../../mocks/graphqlTypes";
import {graphqlUnionConfig} from "../../mocks/config";
import createGraphQLUnionType from "./index";

describe("ComposeGraphQLUnionType", () => {
    test("Should resolve to a GraphQL union type", () => {
        const result = createGraphQLUnionType(context, "graphqlUnionType", graphqlUnionConfig);
        const actual = result.toConfig();
        const types = actual.types.map((t) => t.toConfig());

        expect(actual).toMatchObject(graphqlUnion);
        expect(types).toMatchObject([graphqlObject]);
    });

    test("Should throw an error when type is not GraphQLObjectType", () => {
        // eslint-disable-next-line require-jsdoc
        const result = () =>
            createGraphQLUnionType(context, "graphqlUnionType", {...graphqlUnionConfig, types: ["graphqlEnum"]});

        expect(result).toThrow("Only GraphQLObjectTypes can be added to an union type (graphqlEnum)");
    });
});
