import {context, graphqlScalar} from "_MOCKS/graphqlTypes";
import {scalarConfig} from "_MOCKS/config";
import composeGraphQLScalarType from "./index";

describe("ComposeGraphQLUnionType", () => {
    test("Should resolve to a GraphQL scalar type", () => {
        const result = composeGraphQLScalarType(context, "graphqlScalarType", scalarConfig);
        expect(result.toConfig()).toMatchObject(graphqlScalar);
    });
});
