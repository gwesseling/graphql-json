export enum GraphqlType {
    Enum = "GraphQLEnumType",
    Object = "GraphQLObjectType",
}

// Rename this since we also use this enum for args
export enum GraphqlFieldType {
    Scalar = "GraphQLScalarType",
    Interface = "GraphQLInterfaceType",
    Union = "GraphQLUnionType",
    Int = "GraphQLInt",
    String = "GraphQLString",
    Boolean = "GraphQLBoolean",
    ID = "GraphQLID",
    Float = "GraphQLFloat",
    List = "GraphQLList",
}
