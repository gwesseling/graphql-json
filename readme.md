# GraphQL JSON Schema
(explain)
## Usage
(explain)
## Schema
(explain)
### Base type

| Property | Description | Type | Required | Not allowed |
|----------|-------------|------|----------|-------------|
| description | description of your type | `string` | No | - |
| type | The related GraphQL type | [GraphQLType](https://graphql.org/graphql-js/type/) | Yes | `GraphQLNonNull` or `GraphQLList` |

### Enum type

| Property | Description                                         | Type   | Required |
| -------- | --------------------------------------------------- | ------ | -------- |
| values   | An object map with enum values (same as in GraphQL) | `Object` | Yes    |

### Object type

| Property   | Description              | Type  | Required |
| ---------- | ------------------------ | ----- | -------- |
| interfaces | Interfaces to implement |  `Array` (`string` or `GraphQLInterface`) | No |
| fields     | An object map with field | [Field](#field-type) | Yes |
| isTypeOf   | A fucntion that helps resolve the GraphQL type of the object | `(value: any, info?: GraphQLResolveInfo) => boolean` | No |

#### Field type

| Property | Description | Type             | Required           | Not allowed |
| -------- | ----------- | ---------------- | ------------------ |-------------|
| type     | Type of the field | [GraphQLType](https://graphql.org/graphql-js/type/) or `string` | Yes | `GraphQLNonNull` |
| item     | List item type | [Item](#field-item-type) | When type is List  | - |
| required | Whenever the field is non-nullable | `boolean` | No (default false) | - |
| args | Object map of arguments | [Arguments](#field-argument) | no | - |
| resolve | Resolves field data | `(source: TSource, args: TArgs, context: TContext, info: GraphQLResolveInfo) => TResult;` | No | - |
| subscribe | Subscribe to field | `(source: TSource, args: TArgs, context: TContext, info: GraphQLResolveInfo) => TResult;` | No | - |
| deprecationReason | Reason why field is deprecated | `string` | No |  - |

#### Field item type

| Property | Description | Type             | Required           | Not allowed |
| -------- | ----------- | ---------------- | ------------------ |-------------|
| type     | Type of the field | [GraphQLType](https://graphql.org/graphql-js/type/) or `string` | Yes | `GraphQLNonNull` or `GraphQLList`|
| required | Whenever the field is non-nullable | `boolean` | No | - |

### Field argument

| Property | Description | Type             | Required           | Not allowed |
| -------- | ----------- | ---------------- | ------------------ |-------------|
| type     | Type of the argument | [GraphQLType](https://graphql.org/graphql-js/type/) or `string` | Yes | `GraphQLNonNull`, `GraphQLObjectType`, `GraphQLInterfaceType` or `GraphQLUnionType`
| item     | List item type | [Item](#field-argument-item-type) | When type is List  | - |
| deprecationReason | Reason why argument is deprecated | `string` | No | - |

### Field argument item type

| Property | Description | Type             | Required           | Not allowed |
| -------- | ----------- | ---------------- | ------------------ |-------------|
| type     | Type of the field | [GraphQLType](https://graphql.org/graphql-js/type/) or `string` | Yes | `GraphQLNonNull`, `GraphQLObjectType`, `GraphQLInterfaceType`, `GraphQLUnionType` or `GraphQLList`|
| required | Whenever the field is non-nullable | `boolean` | No | - |

### Input Object type

| Property   | Description              | Type  | Required |
| ---------- | ------------------------ | ----- | -------- |

### Union type
| Property   | Description              | Type  | Required |
| ---------- | ------------------------ | ----- | -------- |
| types | Types to combine as an Union type | `GraphQLObjectType` or `string` | Yes |
| resolveType | A fucntion that helps resolve the GraphQL type of the object | `(value: TSource, context: TContext, info: GraphQLResolveInfo, abstractType: GraphQLAbstractType, ) => PromiseOrValue<string / undefined>` | No |

### Interface type
| Property   | Description              | Type  | Required |
| ---------- | ------------------------ | ----- | -------- |
| interfaces | | | No |
| fields | | | Yes |
| resolveType | A fucntion that helps resolve the GraphQL type of the object | | No |

### Scalar type
| Property   | Description              | Type  | Required |
| ---------- | ------------------------ | ----- | -------- |
| specifiedByURL | | `string` | No |
| serialize |
| parseValue | 
| parseLiteral |

## Example
(Explain)
### JSON schema
```javascript
{
    // Scalar type
    date: {
        description: "Date custom scalar type",
        type: GraphQLScalarType,
        /**
         * Convert date to json
         */
        serialize(value: unknown) {
            if (value instanceof Date) return value.getTime();
            throw Error("GraphQL Date Scalar serializer expected a `Date` object");
        },
        /**
         * Convert integer to Date
         */
        parseValue(value: unknown) {
            if (typeof value === "number") return new Date(value);
            throw new Error("GraphQL Date Scalar parser expected a `number`");
        },
        /**
         * Convert hard-coded AST string to integer and then to Date
         */
        parseLiteral(ast: ValueNode) {
            if (ast.kind === Kind.INT) return new Date(parseInt(ast.value, 10));
            return null;
        },
    },
    // Enum type
    brand: {
        description: "This is the brand of the car",
        type: GraphQLEnumType,
        values: {
            tesla: {description: "Tesla", value: "Tesla"},
            lightyear: {description: "Lightyear", value: "Lightyear"},
            volkwagen: {description: "Volkwagen", value: "Volkwagen"},
            porsche: {description: "Porsche", value: "Porsche"},
        },
    },
    // Input object type
    carInput: {
        description: "This is the input for the create car mutation",
        type: GraphQLInputObjectType,
        fields: {
            description: {
                type: GraphQLString,
            },
            brand: {
                type: "brand",
                required: true,
            },
            price: {
                type: GraphQLFloat,
                defaultValue: 0,
            },
            tags: {
                type: GraphQLList,
                item: {
                    type: GraphQLString,
                    required: true,
                },
                required: true,
            },
        },
    },
    // Interface type
    car: {
        description: "This is the car itself",
        type: GraphQLInterfaceType,
        fields: {
            id: {
                type: GraphQLID,
                required: true,
            },
            description: {
                type: GraphQLString,
            },
            brand: {
                type: "brand",
                required: true,
            },
            price: {
                type: GraphQLFloat,
                required: true,
            },
            tags: {
                type: GraphQLList,
                item: {
                    type: GraphQLString,
                    required: true,
                },
                required: true,
            },
            createdAt: {
                type: "date",
                required: true,
            },
        },
    },
    // Object type with interface
    electricCar: {
        description: "Electric engine car",
        type: GraphQLObjectType,
        interfaces: ["car"],
        fields: {
            id: {
                type: GraphQLID,
                required: true,
            },
            description: {
                type: GraphQLString,
            },
            brand: {
                type: "brand",
                required: true,
            },
            price: {
                type: GraphQLFloat,
                required: true,
            },
            tags: {
                type: GraphQLList,
                item: {
                    type: GraphQLString,
                    required: true,
                },
                required: true,
            },
            createdAt: {
                type: "date",
                required: true,
            },
            charge: {
                type: GraphQLFloat,
                required: true,
            },
        },
    },
    // Object type with interface
    combustionCar: {
        description: "Combustion engine car",
        type: GraphQLObjectType,
        interfaces: ["car"],
        fields: {
            id: {
                type: GraphQLID,
                required: true,
            },
            description: {
                type: GraphQLString,
            },
            brand: {
                type: "brand",
                required: true,
            },
            price: {
                type: GraphQLFloat,
                required: true,
            },
            tags: {
                type: GraphQLList,
                item: {
                    type: GraphQLString,
                    required: true,
                },
                required: true,
            },
            createdAt: {
                type: "date",
                required: true,
            },
            fuel: {
                type: GraphQLString,
                required: true,
            },
        },
    },
    // Union type
    carTypes: {
        description: "Any car",
        type: GraphQLUnionType,
        types: ["electricCar", "combustionCar"],
    },
    // Object type (queries)
    query: {
        description: "Queries",
        type: GraphQLObjectType,
        fields: {
            getCars: {
                description: "Get all cars",
                type: GraphQLList,
                item: {
                    type: "carTypes",
                    required: true,
                },
                required: true,
            },
            getElectricCars: {
                description: "Get all electric engine cars",
                type: GraphQLList,
                item: {
                    type: "electricCar",
                    required: true,
                },
                required: true,
            },
            getCombustionCars: {
                description: "Get all combustion engine cars",
                type: GraphQLList,
                item: {
                    type: "combustionCar",
                    required: true,
                },
                required: true,
            },
            getCar: {
                description: "Get a car",
                type: "carTypes",
                args: {
                    id: {
                        type: GraphQLID,
                        required: true,
                    },
                },
            },
        },
    },
    // Object type (mutations)
    mutation: {
        description: "Mutations",
        type: GraphQLObjectType,
        fields: {
            createCar: {
                description: "Create a car",
                type: "carTypes",
                args: {
                    car: {
                        type: "carInput",
                    },
                },
            },
        },
    },
}
```

### GraphQL schema
```
schema {
  query: query
  mutation: mutation
}

"""Queries"""
type query {
  """Get all cars"""
  getCars: [carTypes!]!

  """Get all electric engine cars"""
  getElectricCars: [electricCar!]!

  """Get all combustion engine cars"""
  getCombustionCars: [combustionCar!]!

  """Get a car"""
  getCar(id: ID!): carTypes
}

"""Any car"""
union carTypes = electricCar | combustionCar

"""Electric engine car"""
type electricCar implements car {
  id: ID!
  description: String
  brand: brand!
  price: Float!
  tags: [String!]!
  createdAt: date!
  charge: Float!
}

"""This is the car itself"""
interface car {
  id: ID!
  description: String
  brand: brand!
  price: Float!
  tags: [String!]!
  createdAt: date!
}

"""This is the brand of the car"""
enum brand {
  """Tesla"""
  tesla

  """Lightyear"""
  lightyear

  """Volkwagen"""
  volkwagen

  """Porsche"""
  porsche
}

"""Date custom scalar type"""
scalar date

"""Combustion engine car"""
type combustionCar implements car {
  id: ID!
  description: String
  brand: brand!
  price: Float!
  tags: [String!]!
  createdAt: date!
  fuel: String!
}

"""Mutations"""
type mutation {
  """Create a car"""
  createCar(car: carInput): carTypes
}

"""This is the input for the create car mutation"""
input carInput {
  description: String
  brand: brand!
  price: Float = 0
  tags: [String!]!
}
```