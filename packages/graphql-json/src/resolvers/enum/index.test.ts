import {context, graphqlEnum} from "../../mocks/graphqlTypes";
import {enumConfig} from "../../mocks/config";
import composeGraphQLEnumType from "./index";

describe("ComposeGraphQLEnumType", () => {
    test("Should resolve to a GraphQL enum", () => {
        const result = composeGraphQLEnumType(context, "graphqlEnumType", enumConfig);
        expect(result.toConfig()).toMatchObject(graphqlEnum);
    });
});
