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
    GraphQLInterfaceTypeExtensions,
    GraphQLIsTypeOfFn,
    GraphQLList,
    GraphQLObjectType,
    GraphQLObjectTypeExtensions,
    GraphQLScalarType,
    GraphQLTypeResolver,
    GraphQLUnionType,
    GraphQLUnionTypeExtensions,
    InputObjectTypeDefinitionNode,
    InputObjectTypeExtensionNode,
    InputValueDefinitionNode,
    InterfaceTypeDefinitionNode,
    InterfaceTypeExtensionNode,
    ObjectTypeDefinitionNode,
    ObjectTypeExtensionNode,
    UnionTypeDefinitionNode,
    UnionTypeExtensionNode,
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

export type GraphqlInputType = GraphQLScalarType | GraphQLEnumType | GraphQLInputObjectType | string;

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
    // Would be nice if we can do this in a better way (typeof GraphQLList)
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
    interfaces?: ReadonlyArray<GraphQLInterfaceType | string>;
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
    extends GraphqlCompositeTypeConfig<GraphqlInputType, GraphQLArgumentExtensions, InputValueDefinitionNode> {
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

// GraphQLInputField
export interface GraphqlInputFieldConfig
    extends GraphqlCompositeTypeConfig<GraphqlInputType, GraphQLInputFieldExtensions, InputValueDefinitionNode> {
    defaultValue?: unknown;
    deprecationReason?: Maybe<string>;
}

// GraphQLUnionType
export interface GraphqlUnionConfig<TSource, TContext>
    extends GraphqlPrimitiveTypeConfig<GraphQLUnionTypeExtensions, UnionTypeDefinitionNode, UnionTypeExtensionNode> {
    types: ReadonlyArray<GraphQLObjectType | string>;
    resolveType?: Maybe<GraphQLTypeResolver<TSource, TContext>>;
}

// GraphQLInterfaceType
export interface GraphqlInterfaceConfig<TSource, TContext>
    extends GraphqlPrimitiveTypeConfig<
        GraphQLInterfaceTypeExtensions,
        InterfaceTypeDefinitionNode,
        InterfaceTypeExtensionNode
    > {
    interfaces?: ReadonlyArray<GraphQLInterfaceType | string>;
    fields: ObjMap<GraphqlFieldConfig<TSource, TContext>>;
    resolveType?: Maybe<GraphQLTypeResolver<TSource, TContext>>;
}
