import {GraphQLEnumType, GraphQLInputObjectType, GraphQLObjectType, GraphQLUnionType} from "graphql";
import type {GraphqlEnumConfig, GraphqlInputObjectConfig, GraphqlObjectConfig, GraphqlUnionConfig} from "./input";

type InputConfigType =
    | GraphqlObjectConfig<unknown, unknown>
    | GraphqlEnumConfig
    | GraphqlInputObjectConfig
    | GraphqlUnionConfig<unknown, unknown>;
export type InputConfig = {[name: string]: InputConfigType};

export type ContextValue =
    | GraphQLEnumType
    | GraphQLObjectType<unknown, unknown>
    | GraphQLInputObjectType
    | GraphQLUnionType;
export type Context = {
    [name: string]: ContextValue;
};
