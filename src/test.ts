import createSchema from "./index";
import { GraphqlFieldType, GraphqlType } from "./types/enums";

const schema = {
    enum: {
        description: "This is an enum type with the name enum",
        type: GraphqlType.Enum,
        values: {
            value: {value: 1},
            value2: {value: "2"},
            value3: {value: true}
        },
    },
    object: {
        description: "This is an object type with the name object",
        type: GraphqlType.Object,
        fields: {
            field: {
                type: GraphqlFieldType.List,
                item: {
                    type: "enum",
                    required: true,
                },
                required: false,
            },
            field1: {
                type: GraphqlFieldType.Float,
                required: true,
            },
        }
    },
    query: {
        type: GraphqlType.Object,
        fields: {
            get: {
                type: "object",
                args: {
                    id: {
                        type: GraphqlFieldType.String,
                    }
                }
            }
        }
    },
}

const schemaInput = createSchema(schema);
console.log(schemaInput);