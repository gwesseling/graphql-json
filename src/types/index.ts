import {
    GraphQLEnumType,
    GraphQLInputObjectType,
    GraphQLInterfaceType,
    GraphQLObjectType,
    GraphQLScalarType,
    GraphQLUnionType,
} from "graphql";
import type {
    GraphqlEnumConfig,
    GraphqlInputObjectConfig,
    GraphqlObjectConfig,
    GraphqlUnionConfig,
    GraphqlInterfaceConfig,
    GraphqlScalarConfig,
} from "./input";

type InputConfigType =
    | GraphqlObjectConfig<unknown, unknown>
    | GraphqlEnumConfig
    | GraphqlInputObjectConfig
    | GraphqlUnionConfig<unknown, unknown>
    | GraphqlInterfaceConfig<unknown, unknown>
    | GraphqlScalarConfig<unknown, unknown>;

export type InputConfig = {[name: string]: InputConfigType};

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
