# GraphQL JSON Schema

## Usage

## Schema

### Base type
All other top object types extend this type and posses the properties down below.
| Property          | Description | Type        | Required |
|-------------------|-------------|-------------|----------|
| description       |             | String      | No       |
| type              |             | GraphqlType | Yes      |
| extensions        |             |             | No       |
| astNode           |             |             | No       |
| extensionASTNodes |             |             | No       |

### Enum type
| Property | Description                                         | Type        | Required |
|----------|-----------------------------------------------------|-------------|----------|
| values   | An object map with enum values (same as in GraphQL) | Object      | Yes      |

### Object type
| Property   | Description                                    | Type        | Required |
|------------|------------------------------------------------|------------ |----------|
| interfaces |                                                |             | No       |
| fields     | An object map with field                       | Field       | Yes      |
| isTypeOf   |                                                |             | No       |

#### Field type
| Property   | Description                                    | Type             | Required          |
|------------|------------------------------------------------|------------------|-------------------|
| type       |                                                | GraphqlFieldType | Yes               |
| item       |                                                | Object           | When type is List |
| required   |                                                | Boolean          | No (default false)|

## Example
```javascript
{
    enum: {
        type: GraphqlType.Enum,
        values: {
            value: {value: 1},
            value2: {value: "2"},
            value3: {value: true}
        },
    },
    object: {
        type: GraphqlType.Object,
        fields: {
            field: {
                type: GraphqlFieldType.List,
                item: {
                    type: "enum",
                    required: true,
                },
            },
            field1: {
                type: GraphqlFieldType.Float,
                required: true,
            },
        }
    },
}
```