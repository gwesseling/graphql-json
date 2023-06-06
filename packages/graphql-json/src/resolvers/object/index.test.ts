import {context, graphqlObject} from "_MOCKS/graphqlTypes";
import {objectConfig} from "_MOCKS/config";
import composeGraphQLObjectType from "./index";

describe("ComposeGraphQLObjectType", () => {
    test("Should resolve to a GraphQL Object", () => {
        const result = composeGraphQLObjectType(context, "graphqlObjectType", objectConfig);
        expect(result.toConfig()).toMatchObject(graphqlObject);
    });
});
