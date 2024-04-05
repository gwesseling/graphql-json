import {
    GraphQLEnumType,
    GraphQLInputObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLFloat,
    GraphQLList,
    GraphQLInterfaceType,
    GraphQLID,
    GraphQLObjectType,
    GraphQLUnionType,
} from "graphql";

export const test = new GraphQLEnumType({
    name: "test",
    description: "This is a test",
    values: {
        t: {
            description: "t",
            value: 0,
        },
        e: {
            description: "e",
            value: 1,
        },
        s: {
            description: "s",
            value: 2,
        },
    },
});

export const carInput = new GraphQLInputObjectType({
    name: "carInput",
    description: "This is the input for the create car mutation",
    fields: () => ({
        description: {
            type: GraphQLString,
            defaultValue: "test",
        },
        brand: {
            type: new GraphQLNonNull(brand),
        },
        price: {
            type: GraphQLFloat,
            defaultValue: 0,
        },
        tags: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))),
        },
    }),
});

export const car = new GraphQLInterfaceType({
    name: "car",
    description: "This is the car itself",
    fields: () => ({
        tags: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))),
        },
        createdAt: {
            type: new GraphQLNonNull(GraphQLString),
        },
        id: {
            type: new GraphQLNonNull(GraphQLID),
        },
        description: {
            type: GraphQLString,
        },
        brand: {
            type: new GraphQLNonNull(brand),
        },
        price: {
            type: new GraphQLNonNull(GraphQLFloat),
        },
    }),
});

export const electricCar = new GraphQLObjectType({
    name: "electricCar",
    description: "Electric engine car",
    interfaces: [car],
    fields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLID),
        },
        description: {
            type: GraphQLString,
        },
        brand: {
            type: new GraphQLNonNull(brand),
        },
        price: {
            type: new GraphQLNonNull(GraphQLFloat),
        },
        tags: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))),
        },
        createdAt: {
            type: new GraphQLNonNull(GraphQLString),
        },
        charge: {
            type: new GraphQLNonNull(GraphQLFloat),
        },
    }),
});

export const combustionCar = new GraphQLObjectType({
    name: "combustionCar",
    description: "Combustion engine car",
    interfaces: [car],
    fields: () => ({
        description: {
            type: GraphQLString,
        },
        brand: {
            type: new GraphQLNonNull(brand),
        },
        price: {
            type: new GraphQLNonNull(GraphQLFloat),
        },
        tags: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))),
        },
        createdAt: {
            type: new GraphQLNonNull(GraphQLString),
        },
        fuel: {
            type: new GraphQLNonNull(GraphQLString),
        },
        id: {
            type: new GraphQLNonNull(GraphQLID),
        },
    }),
});

export const brand = new GraphQLEnumType({
    name: "brand",
    description: "This is the brand of the car",
    values: {
        volkwagen: {
            description: "Volkwagen",
            value: "Volkwagen",
        },
        porsche: {
            description: "Porsche",
            value: "Porsche",
        },
        tesla: {
            description: "Tesla",
            value: "Tesla",
        },
        lightyear: {
            description: "Lightyear",
            value: "Lightyear",
        },
    },
});

export const carTypes = new GraphQLUnionType({
    name: "carTypes",
    description: "Any car",
    types: [electricCar, combustionCar],
});

export const query = new GraphQLObjectType({
    name: "query",
    description: "Queries",
    fields: () => ({
        getElectricCars: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(electricCar))),
            description: "Get all electric engine cars",
        },
        getCombustionCars: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(combustionCar))),
            description: "Get all combustion engine cars",
        },
        getCar: {
            type: carTypes,
            description: "Get a car",
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                },
            },
        },
        getCars: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(carTypes))),
            description: "Get all cars",
        },
    }),
});

export const mutation = new GraphQLObjectType({
    name: "mutation",
    description: "Mutations",
    fields: () => ({
        createCar: {
            type: carTypes,
            description: "Create a car",
            args: {
                car: {
                    type: carInput,
                },
            },
        },
    }),
});
