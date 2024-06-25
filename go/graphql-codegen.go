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
 * - Replace Contains with Map
 * - Field and args are basically the same
 * - Cleanup code (split into multiple files)
 */
func main() {
	var args = os.Args[1:]

	if len(args) == 0 {
		fmt.Println("Invalid args. Expecting a path to an input file")
		os.Exit(1)
	}

	// Try to open json file
	jsonFile, err := os.Open(args[0])

	// Something went wrong while opening the json file
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	// Close json file
	defer jsonFile.Close()

	// Read the file content as bytes
	byteValue, _ := io.ReadAll(jsonFile)

	var keys map[string]GraphQLType

	// Parse json files
	json.Unmarshal(byteValue, &keys)

	for key, value := range keys {
		if !hasKey(key) {
			store(key, generateType(keys, key, value))
		}
	}

	if hasRequired {
		imports["GraphQLNonNull"] = noop
	}

	if hasList {
		imports["GraphQLList"] = noop
	}

	// Create file
	f, err := os.Create("schema.js")

	if err != nil {
		fmt.Println("Something went wrong while creating the output file")
	}

	// Close file
	defer f.Close()

	buffer := bufio.NewWriter(f)

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

func store(key string, value []string) {
	order = append(order, key)
	output[key] = value
}

func hasKey(key string) bool {
	_, ok := output[key]
	return ok
}

func hasImport(key string) bool {
	_, ok := imports[key]
	return ok
}

func generateType(schema map[string]GraphQLType, key string, value GraphQLType) []string {
	var graphqlType = value.Type
	var item []string

	if key == "query" || key == "mutation" {
		graphqlType = "GraphQLObjectType"
	}

	if val, ok := typeMap[value.Type]; ok {
		graphqlType = val
		imports[graphqlType] = noop
	}

	item = append(item, "export const "+key+" = new "+graphqlType+"({", `name: "`+key+`",`)

	if value.Description != nil {
		item = append(item, `description: "`+*value.Description+`",`)
	}

	// Enums
	if graphqlType == "GraphQLEnumType" {
		if value.Values == nil {
			fmt.Println("Enum type should have values")
			os.Exit(1)
		}

		item = append(item, "values: {")

		for enumKey, enumValue := range *value.Values {
			item = append(item, enumKey+":"+" {")

			if enumValue.Description != nil {
				item = append(item, `description: "`+*enumValue.Description+`",`)
			}

			item = append(item, `value: `+fmt.Sprintf("%#v", enumValue.Value)+``)
			item = append(item, "},")
		}

		item = append(item, "},", "});", "")
	}

	if graphqlType == "GraphQLUnionType" {
		if value.Types != nil {
			for _, typeName := range *value.Types {
				if !hasKey(typeName) {
					store(typeName, generateType(schema, typeName, schema[typeName]))
				}
			}

			item = append(item, "types: ["+strings.Join(*value.Types, ",")+"]", "});", "")
		}
	}

	if graphqlType == "GraphQLObjectType" || graphqlType == "GraphQLInputObjectType" || graphqlType == "GraphQLInterfaceType" {
		if value.Interfaces != nil {
			for _, interfaceName := range *value.Interfaces {
				if !hasKey(interfaceName) {
					store(interfaceName, generateType(schema, interfaceName, schema[interfaceName]))
				}
			}

			item = append(item, "interfaces: ["+strings.Join(*value.Interfaces, ",")+"],")
		}

		if value.Fields != nil {
			item = append(item, "fields: () => ({")

			for fieldKey, fieldValue := range *value.Fields {
				var fieldType = fieldValue.Type

				if fieldValue.List != nil {
					var listType = fieldValue.List.Type
					hasList = true

					if val, ok := typeMap[fieldValue.List.Type]; ok {
						listType = val
						imports[listType] = noop
					} else {
						if !hasKey(listType) {
							store(listType, generateType(schema, listType, schema[listType]))
						}
					}

					fieldType = composeList(listType, fieldValue.List.Required)
				} else if val, ok := typeMap[fieldValue.Type]; ok {
					fieldType = val
					imports[fieldType] = noop
				} else {
					if !hasKey(fieldType) {
						store(fieldType, generateType(schema, fieldType, schema[fieldType]))
					}
				}

				if fieldValue.Required {
					fieldType = "new GraphQLNonNull(" + fieldType + ")"
					hasRequired = true
				}

				item = append(item, fieldKey+": {", "type: "+fieldType+",")

				if fieldValue.Description != nil {
					item = append(item, `description: "`+*fieldValue.Description+`",`)
				}

				if fieldValue.DeprecationReason != nil {
					item = append(item, `deprecationReason: "`+*fieldValue.DeprecationReason+`",`)
				}

				if fieldValue.DefaultValue != nil {
					item = append(item, `defaultValue: `+fmt.Sprintf("%#v", *fieldValue.DefaultValue)+`,`)
				}

				if fieldValue.Args != nil {
					item = append(item, "args: {")

					for argKey, argValue := range *fieldValue.Args {
						var argType = argValue.Type

						if argValue.List != nil {
							var listType = typeMap[argValue.List.Type]
							hasList = true

							if len(listType) == 0 {
								listType = argValue.List.Type

								if !hasKey(listType) {
									store(listType, generateType(schema, listType, schema[listType]))
								}
							} else if !hasImport(listType) {
								imports[listType] = noop
							}
							argType = composeList(listType, argValue.List.Required)
						} else if val, ok := typeMap[argValue.Type]; ok {
							argType = val
							imports[argType] = noop
						} else {
							if !hasKey(argType) {
								store(argType, generateType(schema, argType, schema[argType]))
							}
						}

						if argValue.Required {
							argType = "new GraphQLNonNull(" + argType + ")"
							hasRequired = true
						}

						item = append(item, argKey+": {", "type: "+argType+",")

						if argValue.Description != nil {
							item = append(item, `description: "`+*argValue.Description+`",`)
						}

						if argValue.DeprecationReason != nil {
							item = append(item, `deprecationReason: "`+*argValue.DeprecationReason+`",`)
						}

						if argValue.DefaultValue != nil {
							item = append(item, `defaultValue: `+fmt.Sprintf("%#v", *argValue.DefaultValue)+`,`)
						}

						item = append(item, "},")
					}
					item = append(item, "},")
				}
				item = append(item, "},")
			}
			item = append(item, "}),")
		}
		item = append(item, "});")
	}

	return item
}

func composeList(graphqlType string, required bool) string {
	var output = graphqlType

	if required {
		output = "new GraphQLNonNull(" + output + ")"
	}

	return "new GraphQLList(" + output + ")"
}
