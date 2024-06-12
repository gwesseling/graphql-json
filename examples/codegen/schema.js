import {
    GraphQLObjectType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLID,
    GraphQLEnumType,
    GraphQLInputObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLFloat,
    GraphQLInterfaceType,
    GraphQLUnionType,
} from "graphql";

export const query = new GraphQLObjectType({
    name: "query",
    description: "Queries",
    fields: () => ({
        getSeries: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(serie))),
            description: "Get all series",
        },
        getMediaItem: {
            type: mediaType,
            description: "Get media item by id",
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                },
            },
        },
        getMediaItems: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(mediaType))),
            description: "Get all media items",
        },
        getMovies: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(movie))),
            description: "Get all movies",
        },
    }),
});

export const mutation = new GraphQLObjectType({
    name: "mutation",
    description: "Mutations",
    fields: () => ({
        createMediaItem: {
            type: mediaType,
            description: "Create a media item",
            args: {
                mediaItem: {
                    type: mediaItemInput,
                },
            },
        },
    }),
});

export const genre = new GraphQLEnumType({
    name: "genre",
    description: "The genre of the media item",
    values: {
        fantasy: {
            description: "Fantasy",
            value: "Fantasy",
        },
        action: {
            description: "Action",
            value: "Action",
        },
        comedy: {
            description: "Comedy",
            value: "Comedy",
        },
        horror: {
            description: "Horror",
            value: "Horror",
        },
    },
});

export const mediaItemInput = new GraphQLInputObjectType({
    name: "mediaItemInput",
    description: "Input for a media item",
    fields: () => ({
        title: {
            type: new GraphQLNonNull(GraphQLString),
        },
        description: {
            type: GraphQLString,
        },
        type: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        price: {
            type: new GraphQLNonNull(GraphQLFloat),
        },
        tags: {
            type: new GraphQLList(GraphQLString),
        },
    }),
});

export const media = new GraphQLInterfaceType({
    name: "media",
    description: "A media item",
    fields: () => ({
        price: {
            type: new GraphQLNonNull(GraphQLFloat),
        },
        tags: {
            type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
        },
        id: {
            type: new GraphQLNonNull(GraphQLID),
        },
        title: {
            type: new GraphQLNonNull(GraphQLString),
        },
        description: {
            type: GraphQLString,
        },
        type: {
            type: new GraphQLNonNull(GraphQLInt),
        },
    }),
});

export const movie = new GraphQLObjectType({
    name: "movie",
    description: "A movie",
    interfaces: [media],
    fields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLID),
        },
        title: {
            type: new GraphQLNonNull(GraphQLString),
        },
        description: {
            type: GraphQLString,
        },
        type: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        price: {
            type: new GraphQLNonNull(GraphQLFloat),
        },
        duration: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        tags: {
            type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
        },
    }),
});

export const serie = new GraphQLObjectType({
    name: "serie",
    description: "A serie",
    interfaces: [media],
    fields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLID),
        },
        title: {
            type: new GraphQLNonNull(GraphQLString),
        },
        description: {
            type: GraphQLString,
        },
        type: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        price: {
            type: new GraphQLNonNull(GraphQLFloat),
        },
        seasons: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        tags: {
            type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
        },
    }),
});

export const mediaType = new GraphQLUnionType({
    name: "mediaType",
    description: "Media item type",
    types: [movie, serie],
});
