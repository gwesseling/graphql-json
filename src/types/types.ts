import {
    EnumTypeDefinitionNode,
    EnumTypeExtensionNode,
    FieldDefinitionNode,
    GraphQLArgumentExtensions,
    GraphQLEnumType,
    GraphQLEnumTypeExtensions,
    GraphQLEnumValueConfigMap,
    GraphQLFieldConfig,
    GraphQLFieldExtensions,
    GraphQLFieldResolver,
    GraphQLInputFieldConfig,
    GraphQLInputObjectType,
    GraphQLInputObjectTypeExtensions,
    GraphQLInterfaceType,
    GraphQLIsTypeOfFn,
    GraphQLList,
    GraphQLObjectType,
    GraphQLObjectTypeExtensions,
    GraphQLScalarType,
    GraphQLUnionType,
    InputObjectTypeDefinitionNode,
    InputObjectTypeExtensionNode,
    InputValueDefinitionNode,
    ObjectTypeDefinitionNode,
    ObjectTypeExtensionNode,
} from "graphql";
import {Maybe, ObjMap} from "./utils";

export type GraphqlOutputType =
    | typeof GraphQLEnumType
    | typeof GraphQLObjectType
    | typeof GraphQLScalarType
    | typeof GraphQLUnionType
    | typeof GraphQLInputObjectType
    | typeof GraphQLInterfaceType;

export type GraphqlSubOutputType =
    | typeof GraphQLList
    | GraphQLEnumType
    | GraphQLUnionType
    | GraphQLInputObjectType
    | GraphQLInterfaceType
    | GraphQLScalarType<unknown, unknown>
    | GraphQLObjectType<unknown, unknown>
    | string;

// Base GraphQL type config
interface GraphqlBaseTypeConfig<Extensions, AstNode> {
    description?: Maybe<string>;
    extensions?: Maybe<Readonly<Extensions>>;
    astNode?: Maybe<AstNode>;
}

// GraphQL primary type config
interface GraphqlPrimitiveTypeConfig<Extensions, AstNode, ExtensionASTNodes>
    extends GraphqlBaseTypeConfig<Extensions, AstNode> {
    type: GraphqlOutputType;
    extensionASTNodes?: Maybe<ReadonlyArray<ExtensionASTNodes>>;
}

// GraphQLEnumType
export interface GraphqlEnumTypeConfig
    extends GraphqlPrimitiveTypeConfig<GraphQLEnumTypeExtensions, EnumTypeDefinitionNode, EnumTypeExtensionNode> {
    values: GraphQLEnumValueConfigMap;
}

// GraphQLObjectType
export interface GraphqlObjectConfig<TSource, TContext>
    extends GraphqlPrimitiveTypeConfig<
        GraphQLObjectTypeExtensions<TSource, TContext>,
        ObjectTypeDefinitionNode,
        ObjectTypeExtensionNode
    > {
    // TODO: exchange types
    interfaces?: ReadonlyArray<GraphQLInterfaceType>;
    fields: ObjMap<GraphQLFieldConfig<TSource, TContext>>;
    isTypeOf?: Maybe<GraphQLIsTypeOfFn<TSource, TContext>>;
}

// GraphQLObjectFieldType
export interface GraphqlFieldConfig<TSource, TContext, TArgs = unknown>
    extends GraphqlBaseTypeConfig<GraphQLFieldExtensions<TSource, TContext, TArgs>, FieldDefinitionNode> {
    // TODO: check typing (GraphQLOutputType)
    type: GraphqlSubOutputType | typeof GraphQLList;
    item?: GraphqlItemConfig<GraphqlSubOutputType>;
    required?: boolean;
    args: ObjMap<GraphqlArgumentConfig>;
    resolve?: GraphQLFieldResolver<TSource, TContext, TArgs>;
    subscribe?: GraphQLFieldResolver<TSource, TContext, TArgs>;
    deprecationReason?: Maybe<string>;
}

// GraphQLObjectFieldArgumentsType
export interface GraphqlArgumentConfig
    extends GraphqlBaseTypeConfig<GraphQLArgumentExtensions, InputValueDefinitionNode> {
    // TODO: check typing (GraphQLInputType)
    type: GraphqlSubOutputType | typeof GraphQLList;
    item?: GraphqlItemConfig<GraphqlSubOutputType>;
    required?: boolean;
    defaultValue?: unknown;
    deprecationReason?: Maybe<string>;
}

// GraphQLInputObjectType
export interface GraphQLInputObjectConfig
    extends GraphqlPrimitiveTypeConfig<
        GraphQLInputObjectTypeExtensions,
        InputObjectTypeDefinitionNode,
        InputObjectTypeExtensionNode
    > {
    // TODO: exchange types
    fields: ReadonlyArray<GraphQLInputFieldConfig>;
}

export interface GraphqlItemConfig<T> {
    type: T;
    required?: boolean;
}
