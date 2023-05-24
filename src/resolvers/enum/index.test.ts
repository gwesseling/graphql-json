import {context, graphqlEnum} from "_MOCKS/graphqlTypes";
import {enumConfig} from "_MOCKS/config";
import composeGraphQLEnumType from "./index";

describe("ComposeGraphQLEnumType", () => {
    test("Should resolve to a GraphQL enum", () => {
        const result = composeGraphQLEnumType(context, "graphqlEnumType", enumConfig);
        expect(result.toConfig()).toMatchObject(graphqlEnum);
    });
});
