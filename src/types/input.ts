import type {
    EnumTypeDefinitionNode,
    EnumTypeExtensionNode,
    FieldDefinitionNode,
    GraphQLArgumentExtensions,
    GraphQLEnumType,
    GraphQLEnumTypeExtensions,
    GraphQLEnumValueConfigMap,
    GraphQLFieldExtensions,
    GraphQLFieldResolver,
    GraphQLInputFieldExtensions,
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
import type {Maybe, ObjMap} from "./utils";

export type GraphqlType =
    | typeof GraphQLEnumType
    | typeof GraphQLObjectType
    | typeof GraphQLScalarType
    | typeof GraphQLUnionType
    | typeof GraphQLInputObjectType
    | typeof GraphQLInterfaceType;

export type GraphqlOutputType =
    | GraphQLScalarType
    | GraphQLObjectType
    | GraphQLInterfaceType
    | GraphQLUnionType
    | GraphQLEnumType
    | string;

export type GraphQLInputType = GraphQLScalarType | GraphQLEnumType | GraphQLInputObjectType | string;

// Base GraphQL type config
interface GraphqlBaseTypeConfig<Extensions, AstNode> {
    description?: Maybe<string>;
    extensions?: Maybe<Readonly<Extensions>>;
    astNode?: Maybe<AstNode>;
}

// GraphQL primary type config
interface GraphqlPrimitiveTypeConfig<Extensions, AstNode, ExtensionASTNodes>
    extends GraphqlBaseTypeConfig<Extensions, AstNode> {
    type: GraphqlType;
    extensionASTNodes?: Maybe<ReadonlyArray<ExtensionASTNodes>>;
}

// Graphql Composite (sub) type config
interface GraphqlCompositeTypeConfig<Type, Extensions, AstNode> extends GraphqlBaseTypeConfig<Extensions, AstNode> {
    type: Type | typeof GraphQLList;
    item?: GraphqlItemConfig<Type>;
    required?: boolean;
}

export interface GraphqlItemConfig<T> {
    type: T;
    required?: boolean;
}

// GraphQLEnumType
export interface GraphqlEnumConfig
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
    fields: ObjMap<GraphqlFieldConfig<TSource, TContext>>;
    isTypeOf?: Maybe<GraphQLIsTypeOfFn<TSource, TContext>>;
}

// GraphQLObjectFieldType
export interface GraphqlFieldConfig<TSource, TContext, TArgs = unknown>
    extends GraphqlCompositeTypeConfig<
        GraphqlOutputType,
        GraphQLFieldExtensions<TSource, TContext, TArgs>,
        FieldDefinitionNode
    > {
    args?: ObjMap<GraphqlArgumentConfig>;
    resolve?: GraphQLFieldResolver<TSource, TContext, TArgs>;
    subscribe?: GraphQLFieldResolver<TSource, TContext, TArgs>;
    deprecationReason?: Maybe<string>;
}

// GraphQLObjectFieldArgumentsType
export interface GraphqlArgumentConfig
    extends GraphqlCompositeTypeConfig<GraphQLInputType, GraphQLArgumentExtensions, InputValueDefinitionNode> {
    // TODO: check typing (GraphQLInputType)
    defaultValue?: unknown;
    deprecationReason?: Maybe<string>;
}

// GraphQLInputObjectType
export interface GraphqlInputObjectConfig
    extends GraphqlPrimitiveTypeConfig<
        GraphQLInputObjectTypeExtensions,
        InputObjectTypeDefinitionNode,
        InputObjectTypeExtensionNode
    > {
    fields: ReadonlyArray<GraphqlInputFieldConfig>;
}

export interface GraphqlInputFieldConfig
    extends GraphqlCompositeTypeConfig<GraphQLInputType, GraphQLInputFieldExtensions, InputValueDefinitionNode> {
    defaultValue?: unknown;
    deprecationReason?: Maybe<string>;
}
