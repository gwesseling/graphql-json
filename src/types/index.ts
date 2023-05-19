import {
    GraphQLArgumentConfig,
    GraphQLDirective,
    GraphQLEnumType,
    GraphQLFieldConfig,
    GraphQLInputObjectType,
    GraphQLInterfaceType,
    GraphQLNamedType,
    GraphQLObjectType,
    GraphQLScalarType,
    GraphQLSchemaExtensions,
    GraphQLUnionType,
    SchemaDefinitionNode,
    SchemaExtensionNode,
} from "graphql";
import type {
    GraphqlEnumConfig,
    GraphqlInputObjectConfig,
    GraphqlObjectConfig,
    GraphqlUnionConfig,
    GraphqlInterfaceConfig,
    GraphqlScalarConfig,
    GraphqlFieldConfig,
    GraphqlArgumentConfig,
    GraphqlInputType,
    GraphqlItemConfig,
    GraphqlOutputType,
} from "./input";
import {Maybe} from "./utils";

// TODO: we might be able to add Directive to this too
export type InputSchemaType =
    | GraphqlObjectConfig<unknown, unknown>
    | GraphqlEnumConfig
    | GraphqlInputObjectConfig
    | GraphqlUnionConfig<unknown, unknown>
    | GraphqlInterfaceConfig<unknown, unknown>
    | GraphqlScalarConfig<unknown, unknown>;

export type InputSchema = {[name: string]: InputSchemaType};

export type InputConfig = {
    description?: Maybe<string>;
    types?: Maybe<ReadonlyArray<GraphQLNamedType | string>>;
    directives?: Maybe<ReadonlyArray<GraphQLDirective>>;
    extensions?: Maybe<Readonly<GraphQLSchemaExtensions>>;
    astNode?: Maybe<SchemaDefinitionNode>;
    extensionASTNodes?: Maybe<ReadonlyArray<SchemaExtensionNode>>;
};

export type ContextValue =
    | GraphQLEnumType
    | GraphQLObjectType<unknown, unknown>
    | GraphQLInputObjectType
    | GraphQLUnionType
    | GraphQLInterfaceType
    | GraphQLScalarType;

export type Context = {
    [name: string]: ContextValue;
};

export type GraphqlResolverFunction = (context: Context, name: string, input: InputSchemaType) => ContextValue;

export type FieldContext = {[key: string]: GraphQLFieldConfig<unknown, unknown>};
export type FieldEntry = [name: string, fieldconfig: GraphqlFieldConfig<unknown, unknown>];

export type ArgumentContext = {[key: string]: GraphQLArgumentConfig};
export type ArgumentEntry = [name: string, fieldconfig: GraphqlArgumentConfig];

export type GraphqlCompositeTypeInput = {
    type?: GraphqlInputType | GraphqlOutputType;
    required?: boolean;
    list?: GraphqlItemConfig<GraphqlInputType | GraphqlOutputType>;
};
