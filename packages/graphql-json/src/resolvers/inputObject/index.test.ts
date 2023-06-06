import {context, graphqlInputObject} from "../../mocks/graphqlTypes";
import {inputObjectConfig} from "../../mocks/config";
import composeGraphQLObjectInputType from "./index";

describe("ComposeGraphQLObjectInputType", () => {
    test("Should resolve to a GraphQL input object", () => {
        const result = composeGraphQLObjectInputType(context, "graphqlInputObjectType", inputObjectConfig);
        expect(result.toConfig()).toMatchObject(graphqlInputObject);
    });
});
