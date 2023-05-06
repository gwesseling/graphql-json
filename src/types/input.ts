import {
    GraphQLEnumTypeExtensions,
    EnumTypeDefinitionNode,
    EnumTypeExtensionNode,
    GraphQLObjectTypeExtensions,
    ObjectTypeDefinitionNode,
    ObjectTypeExtensionNode,
    ThunkReadonlyArray,
    GraphQLInterfaceType,
    GraphQLEnumValueConfigMap,
    GraphQLIsTypeOfFn,
    GraphQLFieldResolver,
    GraphQLObjectType,
    GraphQLEnumType,
    GraphQLList,
    GraphQLScalarType,
    GraphQLUnionType,
    GraphQLInputObjectType,
} from "graphql";
import type {Maybe, ObjMap} from "./utils";

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

interface GraphqlConfig<E, D> {
    description?: Maybe<string>;
    extensions?: Maybe<Readonly<E>>;
    astNode?: Maybe<D>;
}

interface GraphqlBaseConfig<E, D, N> extends GraphqlConfig<E, D> {
    type: GraphqlOutputType;
    extensionASTNodes?: Maybe<ReadonlyArray<N>>;
}

export interface SubObjectConfig<TSource, TContext> extends GraphqlConfig<TSource, TContext> {
    type: GraphqlSubOutputType | typeof GraphQLList;
    item?: GraphqlItemConfig;
    required?: boolean;
}

export interface GraphqlEnumConfig
    extends GraphqlBaseConfig<GraphQLEnumTypeExtensions, EnumTypeDefinitionNode, EnumTypeExtensionNode> {
    values: GraphQLEnumValueConfigMap;
}

export interface GraphqlObjectConfig<TSource, TContext>
    extends GraphqlBaseConfig<
        GraphQLObjectTypeExtensions<TSource, TContext>,
        ObjectTypeDefinitionNode,
        ObjectTypeExtensionNode
    > {
    interfaces?: ThunkReadonlyArray<GraphQLInterfaceType>;
    fields: ObjMap<GraphqlFieldConfig<TSource, TContext>>;
    isTypeOf?: Maybe<GraphQLIsTypeOfFn<TSource, TContext>>;
}

export interface GraphqlFieldConfig<TSource, TContext, TArgs = unknown> extends SubObjectConfig<TSource, TContext> {
    args?: ObjMap<GraphqlArgsConfig<TSource, TContext>>;
    resolve?: GraphQLFieldResolver<TSource, TContext, TArgs>;
    subscribe?: GraphQLFieldResolver<TSource, TContext, TArgs>;
    deprecationReason?: Maybe<string>;
}

export interface GraphqlArgsConfig<TSource, TContext> extends SubObjectConfig<TSource, TContext> {
    defaultValue?: unknown;
    deprecationReason?: Maybe<string>;
}

export interface GraphqlItemConfig {
    type: GraphqlSubOutputType;
    required?: boolean;
}
