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
} from "graphql";
import {GraphqlFieldType, GraphqlType} from "./enums";
import type {Maybe, ObjMap} from "./utils";

interface GraphqlConfig<E, D> {
    description?: Maybe<string>;
    extensions?: Maybe<Readonly<E>>;
    astNode?: Maybe<D>;
}

interface GraphqlBaseConfig<E, D, N> extends GraphqlConfig<E, D> {
    // Another option would be to check if a input value has a "field" or "values" property (based on it we can assume if it is an enum or a object)
    type: GraphqlType;
    extensionASTNodes?: Maybe<ReadonlyArray<N>>;
}

export interface SubObjectConfig<TSource, TContext> extends GraphqlConfig<TSource, TContext> {
    // We might want to remove this, since people can create their own Scalars types
    type: GraphqlFieldType | string;
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

export interface GraphqlFieldConfig<TSource, TContext, TArgs = any> extends SubObjectConfig<TSource, TContext> {
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
    type: GraphqlFieldType | string;
    required?: boolean;
}
