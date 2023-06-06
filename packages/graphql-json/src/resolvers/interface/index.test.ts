import {context, graphqlInterface} from "../../mocks/graphqlTypes";
import {interfaceConfig} from "../../mocks/config";
import composeGraphQLInterfaceType from "./index";

// TODO: test object specific stuff to get 100% test coverage
describe("ComposeGraphQLInterfaceType", () => {
    test("Should resolve to a GraphQL interface", () => {
        const result = composeGraphQLInterfaceType(context, "graphqlInterfaceType", interfaceConfig);
        expect(result.toConfig()).toMatchObject(graphqlInterface);
    });
});
