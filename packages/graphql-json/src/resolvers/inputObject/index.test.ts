import {context, graphqlInputObject} from "_MOCKS/graphqlTypes";
import {inputObjectConfig} from "_MOCKS/config";
import composeGraphQLObjectInputType from "./index";

describe("ComposeGraphQLObjectInputType", () => {
    test("Should resolve to a GraphQL input object", () => {
        const result = composeGraphQLObjectInputType(context, "graphqlInputObjectType", inputObjectConfig);
        expect(result.toConfig()).toMatchObject(graphqlInputObject);
    });
});
