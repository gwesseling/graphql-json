import {GraphQLObjectType, GraphQLEnumType, GraphQLInterfaceType, GraphQLUnionType} from "graphql";

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

export const brand = new GraphQLEnumType({
    name: "brand",
    description: "This is the brand of the car",
    values: {
        tesla: {
            description: "Tesla",
            value: "Tesla",
        },
        lightyear: {
            description: "Lightyear",
            value: "Lightyear",
        },
        volkwagen: {
            description: "Volkwagen",
            value: "Volkwagen",
        },
        porsche: {
            description: "Porsche",
            value: "Porsche",
        },
    },
});

export const carInput = new GraphQLObjectType({
    name: "carInput",
    description: "This is the input for the create car mutation",
    fields: () => ({
        price: {
            type: GraphQLFloat,
        },
        tags: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))),
        },
        description: {
            type: GraphQLString,
        },
        brand: {
            type: new GraphQLNonNull(brand),
        },
    }),
});

export const car = new GraphQLInterfaceType({
    name: "car",
    description: "This is the car itself",
    fields: () => ({
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
        id: {
            type: new GraphQLNonNull(GraphQLID),
        },
        description: {
            type: GraphQLString,
        },
    }),
});

export const electricCar = new GraphQLObjectType({
    name: "electricCar",
    description: "Electric engine car",
    Interfaces: [car],
    fields: () => ({
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
        id: {
            type: new GraphQLNonNull(GraphQLID),
        },
        description: {
            type: GraphQLString,
        },
        brand: {
            type: new GraphQLNonNull(brand),
        },
    }),
});

export const combustionCar = new GraphQLObjectType({
    name: "combustionCar",
    description: "Combustion engine car",
    Interfaces: [car],
    fields: () => ({
        fuel: {
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
        tags: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))),
        },
        createdAt: {
            type: new GraphQLNonNull(GraphQLString),
        },
    }),
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
        getCars: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(carTypes))),
            description: "Get all cars",
        },
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
    }),
});
