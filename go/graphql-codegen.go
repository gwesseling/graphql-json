package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"strings"
)

type Values struct {
	Description *string `json:"description"`
	Value       any     `json:"value"`
}

type List struct {
	Type     string `json:"type"`
	Required bool   `json:"required"`
}

type Arg struct {
	Type              string  `json:"type"`
	Description       *string `json:"description"`
	Required          bool    `json:"required"`
	List              *List   `json:"list"`
	DeprecationReason *string `json:"deprecationReason"`
	DefaultValue      *any    `json:"defaultValue"`
}

type Field struct {
	Type              string          `json:"type"`
	Description       *string         `json:"description"`
	Required          bool            `json:"required"`
	List              *List           `json:"list"`
	Args              *map[string]Arg `json:"args"`
	DeprecationReason *string         `json:"deprecationReason"`
	DefaultValue      *any            `json:"defaultValue"`
}

type GraphQLType struct {
	Description *string `json:"description"`
	Type        string  `json:"type"`

	// interfaces
	Interfaces *[]string `json:"interfaces"`

	// types
	Types *[]string `json:"types"`

	// enums
	Values *map[string]Values `json:"values"`

	// fields
	Fields *map[string]Field `json:"fields"`
}

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

/**
 * TODO:
 * - Cleanup code (split into multiple files)
 * - Better error handling
 */
func main() {
	var args = os.Args[1:]

	// TODO: improve error throwing
	if len(args) == 0 {
		fmt.Println("Invalid args. Expecting a path to an input file")
		os.Exit(1)
	}

	// Try to open json file
	file, err := os.Open(args[0])

	// Something went wrong while opening the json file
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	// Close json file
	defer file.Close()

	// Read the file content as bytes
	bytes, _ := io.ReadAll(file)

	var schema map[string]GraphQLType

	// Parse json files
	json.Unmarshal(bytes, &schema)

	// TODO: move to different file
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

	// TODO: make this configurable
	// Create file
	outputFile, err := os.Create("schema.js")

	if err != nil {
		fmt.Println("Something went wrong while creating the output file")
	}

	// Close file
	defer outputFile.Close()

	buffer := bufio.NewWriter(outputFile)

	// Define imports
	buffer.WriteString("import { ")
	for key := range imports {
		buffer.WriteString(key + ", ")
	}
	buffer.WriteString(` } from "graphql";` + "\n\n")

	// Define graphql types
	for _, key := range order {
		var lines = output[key]
		buffer.WriteString(strings.Join(lines, "") + "\n\n")
	}

	buffer.Flush()
}

// TODO: Move to own file
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
		// TODO: improve error throwing
		if value.Values == nil {
			fmt.Println("Enum type should have values")
			os.Exit(1)
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
		// TODO: improve error throwing
		if value.Types == nil {
			fmt.Println("Union type should have types")
			os.Exit(1)
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
