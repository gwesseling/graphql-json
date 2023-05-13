import {context, graphqlScalar} from "../../mocks/graphqlTypes";
import {scalarConfig} from "../../mocks/config";
import composeGraphQLScalarType from "./index";

describe("ComposeGraphQLUnionType", () => {
    test("Should resolve to a GraphQL scalar type", () => {
        const result = composeGraphQLScalarType(context, "graphqlScalarType", scalarConfig);
        expect(result.toConfig()).toMatchObject(graphqlScalar);
    });
});
