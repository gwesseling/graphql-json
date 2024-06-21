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

/**
 * TODO:
 * - Fix blocked scope issue
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

	var output []string
	var imports []string

	for key, value := range keys {
		var graphqlType = typeMap[value.Type]

		if key == "query" || key == "mutation" {
			graphqlType = "GraphQLObjectType"
		}

		if len(graphqlType) != 0 && !slices.Contains(imports, graphqlType) {
			imports = append(imports, graphqlType)
		}

		if len(graphqlType) == 0 {
			graphqlType = value.Type
		}

		output = append(output, "export const "+key+" = new "+graphqlType+"({", `name: "`+key+`",`)

		if value.Description != nil {
			output = append(output, `description: "`+*value.Description+`",`)
		}

		// Enums
		if graphqlType == "GraphQLEnumType" {
			if value.Values == nil {
				continue
			}

			output = append(output, "values: {")

			for enumKey, enumValue := range *value.Values {
				output = append(output, enumKey+":"+" {")

				if enumValue.Description != nil {
					output = append(output, `description: "`+*enumValue.Description+`",`)
				}

				output = append(output, `value: `+fmt.Sprintf("%#v", enumValue.Value)+``)

				output = append(output, "},")
			}

			output = append(output, "},", "});", "")
			continue
		}

		if graphqlType == "GraphQLUnionType" {
			if value.Types != nil {
				output = append(output, "types: ["+strings.Join(*value.Types, ", ")+"]", "});", "")
			}
		}

		if graphqlType == "GraphQLObjectType" || graphqlType == "GraphQLInputObjectType" || graphqlType == "GraphQLInterfaceType" {

			if value.Interfaces != nil {
				output = append(output, "interfaces: ["+strings.Join(*value.Interfaces, ", ")+"],")
			}

			if value.Fields != nil {
				output = append(output, "fields: () => ({")

				for fieldKey, fieldValue := range *value.Fields {
					var fieldType = fieldValue.Type

					if len(typeMap[fieldValue.Type]) != 0 {
						fieldType = typeMap[fieldValue.Type]

						if !slices.Contains(imports, fieldType) {
							imports = append(imports, fieldType)
						}
					}

					if fieldValue.List != nil {
						var listType = fieldValue.List.Type

						if len(typeMap[fieldValue.List.Type]) != 0 {
							listType = typeMap[fieldValue.List.Type]

							if !slices.Contains(imports, listType) {
								imports = append(imports, listType)
							}
						}

						if !slices.Contains(imports, "GraphQLList") {
							imports = append(imports, "GraphQLList")
						}

						fieldType = composeList(listType, fieldValue.List.Required)
					}

					if fieldValue.Required {
						if !slices.Contains(imports, "GraphQLNonNull") {
							imports = append(imports, "GraphQLNonNull")
						}

						fieldType = "new GraphQLNonNull(" + fieldType + ")"
					}

					output = append(output, fieldKey+": {", "type: "+fieldType+",")

					if fieldValue.Description != nil {
						output = append(output, `description: "`+*fieldValue.Description+`",`)
					}

					if fieldValue.DeprecationReason != nil {
						output = append(output, `deprecationReason: "`+*fieldValue.DeprecationReason+`",`)
					}

					if fieldValue.DefaultValue != nil {
						output = append(output, `defaultValue: `+fmt.Sprintf("%#v", *fieldValue.DefaultValue)+`,`)
					}

					if fieldValue.Args != nil {
						output = append(output, "args: {")

						for argKey, argValue := range *fieldValue.Args {
							var argType = argValue.Type

							if len(typeMap[argValue.Type]) != 0 {
								argType = typeMap[argValue.Type]

								if !slices.Contains(imports, argType) {
									imports = append(imports, argType)
								}
							}

							if argValue.List != nil {
								var listType = argValue.List.Type

								if len(typeMap[argValue.List.Type]) != 0 {
									listType = typeMap[argValue.List.Type]

									if !slices.Contains(imports, listType) {
										imports = append(imports, listType)
									}
								}

								if !slices.Contains(imports, "GraphQLList") {
									imports = append(imports, "GraphQLList")
								}

								argType = composeList(listType, argValue.List.Required)
							}

							if argValue.Required {
								if !slices.Contains(imports, "GraphQLNonNull") {
									imports = append(imports, "GraphQLNonNull")
								}

								argType = "new GraphQLNonNull(" + argType + ")"
							}

							output = append(output, argKey+": {", "type: "+argType+",")

							if argValue.Description != nil {
								output = append(output, `description: "`+*argValue.Description+`",`)
							}

							if argValue.DeprecationReason != nil {
								output = append(output, `deprecationReason: "`+*argValue.DeprecationReason+`",`)
							}

							if argValue.DefaultValue != nil {
								output = append(output, `defaultValue: `+fmt.Sprintf("%#v", *argValue.DefaultValue)+`,`)
							}

							output = append(output, "},")
						}

						output = append(output, "},")
					}

					output = append(output, "},")
				}

				output = append(output, "}),")
			}

			output = append(output, "});", "")
		}
	}

	// Create file
	f, err := os.Create("schema.js")

	if err != nil {
		fmt.Println("Something went wrong while creating the output file")
	}

	// Close file
	defer f.Close()

	buffer := bufio.NewWriter(f)

	buffer.WriteString("import { " + strings.Join(imports, ", ") + `} from "graphql";` + "\n")
	buffer.WriteString("\n")

	for _, line := range output {
		buffer.WriteString(line + "\n")
	}

	buffer.Flush()
}

func composeList(graphqlType string, required bool) string {
	var output = graphqlType

	if required {
		output = "new GraphQLNonNull(" + output + ")"
	}

	return "new GraphQLList(" + output + ")"
}
