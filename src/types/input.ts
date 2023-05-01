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
    GraphQLFieldResolver
} from "graphql";
import { GraphqlFieldType, GraphqlType } from "./enums";
import type {Maybe, ObjMap} from "./utils";

interface GraphqlConfig<E,D> {
    description?: Maybe<string>;
    extensions?: Maybe<Readonly<E>>;
    astNode?: Maybe<D>;
}

interface GraphqlBaseConfig<E, D, N> extends GraphqlConfig<E,D> {
    type: GraphqlType;
    extensionASTNodes?: Maybe<ReadonlyArray<N>>;
}

export interface GraphqlEnumConfig extends GraphqlBaseConfig<GraphQLEnumTypeExtensions, EnumTypeDefinitionNode, EnumTypeExtensionNode> {
    values: GraphQLEnumValueConfigMap;
};

export interface GraphqlObjectConfig<TSource, TContext> extends GraphqlBaseConfig<GraphQLObjectTypeExtensions<TSource, TContext>, ObjectTypeDefinitionNode, ObjectTypeExtensionNode> {
    interfaces?: ThunkReadonlyArray<GraphQLInterfaceType>;
    fields: ObjMap<GraphqlFieldConfig<TSource, TContext>>;
    isTypeOf?: Maybe<GraphQLIsTypeOfFn<TSource, TContext>>;
};

export interface GraphqlFieldConfig<TSource, TContext, TArgs = any> extends GraphqlConfig<TSource, TContext> {
    args?: ObjMap<GraphqlArgsConfig<TSource, TContext>>;
    type: GraphqlFieldType | string;
    item?: GraphqlItemConfig;
    required?: boolean;
    resolve?: GraphQLFieldResolver<TSource, TContext, TArgs>;
    subscribe?: GraphQLFieldResolver<TSource, TContext, TArgs>;
    deprecationReason?: Maybe<string>;
}

interface GraphqlArgsConfig<TSource, TContext> extends GraphqlConfig<TSource, TContext> {
    type: GraphqlFieldType | string;
    defaultValue?: unknown;
    deprecationReason?: Maybe<string>;
}

interface GraphqlItemConfig {
    type: GraphqlFieldType | string;
    required?: boolean;
}