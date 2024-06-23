package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"slices"
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

var imports []string
var order []string
var output = make(map[string][]string)

// Schema contains a list
var hasList = false

// Schema contains a required item
var hasRequired = false

/**
 * TODO:
 * - Skip recursive type call
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
		store(key, generateType(keys, key, value))
	}

	if hasRequired {
		imports = append(imports, "GraphQLNonNull")
	}

	if hasList {
		imports = append(imports, "GraphQLList")
	}

	// Create file
	f, err := os.Create("schema.js")

	if err != nil {
		fmt.Println("Something went wrong while creating the output file")
	}

	// Close file
	defer f.Close()

	buffer := bufio.NewWriter(f)
	buffer.WriteString("import { " + strings.Join(imports, ", ") + `} from "graphql";` + "\n\n")

	for _, key := range order {
		var lines = output[key]
		buffer.WriteString(strings.Join(lines, "") + "\n\n")
	}

	buffer.Flush()
}

func store(key string, value []string) {
	if !slices.Contains(order, key) {
		order = append(order, key)
		output[key] = value
	}
}

func generateType(keys map[string]GraphQLType, key string, value GraphQLType) []string {
	var graphqlType = typeMap[value.Type]
	var item []string

	if slices.Contains(order, key) {
		return item
	}

	if key == "query" || key == "mutation" {
		graphqlType = "GraphQLObjectType"
	}

	if len(graphqlType) == 0 {
		graphqlType = value.Type
	} else if !slices.Contains(imports, graphqlType) {
		imports = append(imports, graphqlType)
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
				store(typeName, generateType(keys, typeName, keys[typeName]))
			}

			item = append(item, "types: ["+strings.Join(*value.Types, ",")+"]", "});", "")
		}
	}

	if graphqlType == "GraphQLObjectType" || graphqlType == "GraphQLInputObjectType" || graphqlType == "GraphQLInterfaceType" {
		if value.Interfaces != nil {
			for _, interfaceName := range *value.Interfaces {
				store(interfaceName, generateType(keys, interfaceName, keys[interfaceName]))
			}

			item = append(item, "interfaces: ["+strings.Join(*value.Interfaces, ",")+"],")
		}

		if value.Fields != nil {
			item = append(item, "fields: () => ({")

			for fieldKey, fieldValue := range *value.Fields {
				var fieldType = typeMap[fieldValue.Type]

				if fieldValue.List != nil {
					var listType = typeMap[fieldValue.List.Type]
					hasList = true

					// TODO: simplify as function
					if len(listType) == 0 {
						listType = fieldValue.List.Type
						store(graphqlType, generateType(keys, listType, keys[listType]))
					} else if !slices.Contains(imports, listType) {
						imports = append(imports, listType)
					}

					fieldType = composeList(listType, fieldValue.List.Required)
				} else {
					if len(fieldType) == 0 {
						fieldType = fieldValue.Type
						store(graphqlType, generateType(keys, fieldType, keys[fieldType]))
					} else if !slices.Contains(imports, fieldType) {
						imports = append(imports, fieldType)
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
						var argType = typeMap[argValue.Type]

						if argValue.List != nil {
							var listType = typeMap[argValue.List.Type]
							hasList = true

							if len(listType) == 0 {
								listType = argValue.List.Type
								store(graphqlType, generateType(keys, listType, keys[listType]))
							} else if !slices.Contains(imports, listType) {
								imports = append(imports, listType)
							}

							argType = composeList(listType, argValue.List.Required)
						} else {
							if len(argType) == 0 {
								argType = argValue.Type
								store(graphqlType, generateType(keys, argType, keys[argType]))
							} else if !slices.Contains(imports, argType) {
								imports = append(imports, argType)
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
