package main

import (
	"fmt"
	"log"
)

var typeMap = map[string]string{
	// Scalar types
	"string":  "GraphQLString",
	"int":     "GraphQLInt",
	"float":   "GraphQLFloat",
	"id":      "GraphQLID",
	"boolean": "GraphQLBoolean",
	// Definitions
	"interface": "GraphQLInterfaceType",
	"object":    "GraphQLObjectType",
	"enum":      "GraphQLEnumType",
	"union":     "GraphQLUnionType",
	"input":     "GraphQLInputObjectType",
}

var noop = struct{}{}

var order []string
var imports = make(map[string]struct{})
var output = make(map[string][]string)

// Schema contains a list
var hasList = false

// Schema contains a required item
var hasRequired = false

func composeSchema(schema map[string]GraphQLType) ([]string, map[string]struct{}, map[string][]string) {
	for key, value := range schema {
		if !hasKey(key) {
			store(key, composeGraphqlType(schema, key, value))
		}
	}

	if hasRequired {
		imports["GraphQLNonNull"] = noop
	}

	if hasList {
		imports["GraphQLList"] = noop
	}

	return order, imports, output
}

func composeGraphqlType(schema map[string]GraphQLType, key string, value GraphQLType) []string {
	var result []string

	var graphqlType = typeMap[value.Type]

	// Default to GraphQLObjectType for query and mutation
	if key == "query" || key == "mutation" {
		graphqlType = typeMap["object"]
	}

	imports[graphqlType] = noop

	result = append(result, "export const "+key+" = new "+graphqlType+"({", `name: "`+key+`",`)

	if value.Description != nil {
		result = append(result, `description: "`+*value.Description+`",`)
	}

	// Enums
	if graphqlType == typeMap["enum"] {
		if value.Values == nil {
			log.Fatal("Enum type should have values")
		}

		result = append(result, "values: {")

		for enumKey, enumValue := range *value.Values {
			result = append(result, enumKey+":"+" {")

			if enumValue.Description != nil {
				result = append(result, `description: "`+*enumValue.Description+`",`)
			}

			result = append(result, `value: `+fmt.Sprintf("%#v", enumValue.Value)+``)
			result = append(result, "},")
		}

		result = append(result, "},", "});")
	}

	if graphqlType == typeMap["union"] {
		if value.Types == nil {
			log.Fatal("Union type should have types")
		}

		result = append(result, "types: [")

		for _, typeName := range *value.Types {
			result = append(result, typeName+",")

			if !hasKey(typeName) {
				store(typeName, composeGraphqlType(schema, typeName, schema[typeName]))
			}
		}

		result = append(result, "]", "});")
	}

	if graphqlType == typeMap["object"] || graphqlType == typeMap["input"] || graphqlType == typeMap["interface"] {
		if value.Interfaces != nil {
			result = append(result, "interfaces: [")

			for _, interfaceName := range *value.Interfaces {
				result = append(result, interfaceName+",")

				if !hasKey(interfaceName) {
					store(interfaceName, composeGraphqlType(schema, interfaceName, schema[interfaceName]))
				}
			}

			result = append(result, "],")
		}

		if value.Fields != nil {
			result = append(result, "fields: () => ({")

			for fieldKey, fieldValue := range *value.Fields {
				var fieldType = composeListableType(schema, fieldValue.Type, fieldValue.Required, fieldValue.List)

				result = append(result, fieldKey+": {", "type: "+fieldType+",")

				if fieldValue.Description != nil {
					result = append(result, `description: "`+*fieldValue.Description+`",`)
				}

				if fieldValue.DeprecationReason != nil {
					result = append(result, `deprecationReason: "`+*fieldValue.DeprecationReason+`",`)
				}

				if fieldValue.DefaultValue != nil {
					result = append(result, `defaultValue: `+fmt.Sprintf("%#v", *fieldValue.DefaultValue)+`,`)
				}

				if fieldValue.Args != nil {
					result = append(result, "args: {")

					for argKey, argValue := range *fieldValue.Args {
						var argType = composeListableType(schema, argValue.Type, argValue.Required, argValue.List)

						result = append(result, argKey+": {", "type: "+argType+",")

						if argValue.Description != nil {
							result = append(result, `description: "`+*argValue.Description+`",`)
						}

						if argValue.DeprecationReason != nil {
							result = append(result, `deprecationReason: "`+*argValue.DeprecationReason+`",`)
						}

						if argValue.DefaultValue != nil {
							result = append(result, `defaultValue: `+fmt.Sprintf("%#v", *argValue.DefaultValue)+`,`)
						}

						result = append(result, "},")
					}
					result = append(result, "},")
				}
				result = append(result, "},")
			}
			result = append(result, "}),")
		}
		result = append(result, "});")
	}

	return result
}

func composeType(schema map[string]GraphQLType, key string) string {
	resolvedType, isGraphqlType := typeMap[key]

	if isGraphqlType {
		imports[resolvedType] = noop
		return resolvedType
	}

	if !hasKey(key) {
		store(key, composeGraphqlType(schema, key, schema[key]))
	}

	return key
}

func composeListableType(schema map[string]GraphQLType, subtype string, isRequired bool, list *List) string {
	if list != nil {
		hasList = true

		var listType = composeType(schema, list.Type)
		return composeList(listType, list.Required)
	}

	var graphqlType = composeType(schema, subtype)

	if isRequired {
		hasRequired = true
		graphqlType = "new GraphQLNonNull(" + graphqlType + ")"
	}

	return graphqlType
}

func composeList(graphqlType string, required bool) string {
	var output = graphqlType

	if required {
		output = "new GraphQLNonNull(" + output + ")"
	}

	return "new GraphQLList(" + output + ")"
}

func store(key string, value []string) {
	order = append(order, key)
	output[key] = value
}

func hasKey(key string) bool {
	_, ok := output[key]
	return ok
}
