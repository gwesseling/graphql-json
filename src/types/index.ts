import {
    GraphQLEnumType,
    GraphQLInputObjectType,
    GraphQLInterfaceType,
    GraphQLObjectType,
    GraphQLUnionType,
} from "graphql";
import type {
    GraphqlEnumConfig,
    GraphqlInputObjectConfig,
    GraphqlObjectConfig,
    GraphqlUnionConfig,
    GraphqlInterfaceConfig,
} from "./input";

type InputConfigType =
    | GraphqlObjectConfig<unknown, unknown>
    | GraphqlEnumConfig
    | GraphqlInputObjectConfig
    | GraphqlUnionConfig<unknown, unknown>
    | GraphqlInterfaceConfig<unknown, unknown>;

export type InputConfig = {[name: string]: InputConfigType};

export type ContextValue =
    | GraphQLEnumType
    | GraphQLObjectType<unknown, unknown>
    | GraphQLInputObjectType
    | GraphQLUnionType
    | GraphQLInterfaceType;

export type Context = {
    [name: string]: ContextValue;
};
