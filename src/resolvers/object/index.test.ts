import {context, graphqlObject} from "../../mocks/graphqlTypes";
import {objectConfig} from "../../mocks/config";
import composeGraphQLObjectType from "./index";

describe("ComposeGraphQLObjectType", () => {
    test("Should resolve to a GraphQL Object", () => {
        const result = composeGraphQLObjectType(context, "graphqlObjectType", objectConfig);
        expect(result.toConfig()).toMatchObject(graphqlObject);
    });
});
