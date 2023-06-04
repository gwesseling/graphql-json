import {context, graphqlInterface} from "_MOCKS/graphqlTypes";
import {interfaceConfig} from "_MOCKS/config";
import composeGraphQLInterfaceType from "./index";

// TODO: test object specific stuff to get 100% test coverage
describe("ComposeGraphQLInterfaceType", () => {
    test("Should resolve to a GraphQL interface", () => {
        const result = composeGraphQLInterfaceType(context, "graphqlInterfaceType", interfaceConfig);
        expect(result.toConfig()).toMatchObject(graphqlInterface);
    });
});
