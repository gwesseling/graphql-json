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
	Description string `json:"description"`
	Value string `json:"value"` 
}

type List struct {
	Type string `json:"type"`
	Required bool `json:"required"`
}

// TODO: default value
type Arg struct {
	Type string `json:"type"`
	Description *string `json:"description"`
	Required bool `json:"required"`
	List *List `json:"list"`
	DeprecationReason *string `json:"deprecationReason"`
}

type Field struct {
	Type string `json:"type"`
	Description *string `json:"description"`
	Required bool `json:"required"`
	List *List `json:"list"`
	Args *map[string] Arg `json:"args"`
	DeprecationReason *string `json:"deprecationReason"`
}

type GraphQLType struct {
	Description *string `json:"description"`
	Type string `json:"type"`

	// interfaces
	Interfaces *[]string `json:"interfaces"`

	// types
	Types *[]string `json:"types"`

	// enums
	Values *map[string] Values `json:"values"` 

	// fields
	Fields *map[string] Field `json:"fields"`
}

func getType(graphqlType string) string {
	switch graphqlType {
	case "enum":
		return "GraphQLEnumType"
	case "input":
		return "GraphQLInputObjectType"
	case "interface":
		return "GraphQLInterfaceType"
	case "object":
		return "GraphQLObjectType"
	case "union":
		return "GraphQLUnionType"
	case "ID":
		return "GraphQLID"
	case "string":
		return "GraphQLString"
	case "float":
		return "GraphQLFloat"
	default:
		return graphqlType
	}
}

func composeType(graphqlType string, required bool, list *List) string {
	var output = ""

	if (list != nil) {
		output = composeList(list.Type, list.Required)
	} else {
		output = getType(graphqlType)
	}

	if (required) {
		output = "new GraphQLNonNull(" + output + ")"
	}

	return output
}

func composeList(graphqlType string, required bool) string {
	var output = getType(graphqlType)

	if required {
		output = "new GraphQLNonNull(" + output + ")"
	}

	return "new GraphQLList(" + output + ")"
}

/**
 * TODO:
 * - Add missing imports (GraphQLList, GraphQLNonNull)
 * - Recursive types
 * - Cleanup code
*/
func main() {
	// Try to open json file
	jsonFile, err := os.Open("schema2.json")

	// Something went wrong while opening the json file
	if err != nil {
		fmt.Println(err)
	}

	// Close json file
	defer jsonFile.Close()

	// Read the file content as bytes
	byteValue, _ := io.ReadAll(jsonFile)

	var keys map[string] GraphQLType

	// Parse json files
	json.Unmarshal(byteValue, &keys)

	var output []string
	var imports [] string

	for key, value := range keys {
		var graphqlType = getType(value.Type)

		if key == "query" || key =="mutation" {
			graphqlType = "GraphQLObjectType"
		}	
		
		if !slices.Contains(imports, graphqlType) {
			imports = append(imports, graphqlType)
		}

		output = append(output, "const " + key + " = new " + graphqlType + "({", `name: "` + key + `",`)

		if (value.Description != nil) {
			output = append(output, `description: "` + *value.Description + `",`)
		}

		// Enums
		if value.Type == "enum" {
			if value.Values == nil {
				continue
			}

			output = append(output, "values: {")

			for enumKey, enumValue := range *value.Values {
				// TODO: add description
				output = append(output, enumKey + ":" + " " + enumValue.Value + ",")
			}

			output = append(output, "},", "});", "")
			continue;
		}

		if value.Type == "union" {
			if value.Types == nil {
				continue
			}

			output = append(output, "types: [" + strings.Join(*value.Types, ", ") + "]", "});", "")
			continue
		}

		if key == "query" || key =="mutation" || value.Type == "object" || value.Type == "input" || value.Type == "interface" {

			if value.Interfaces != nil {
				output = append(output, "Interfaces: [" + strings.Join(*value.Interfaces, ", ") + "],")
			}

			if value.Fields != nil {
				output = append(output, "fields: {")

				for fieldKey, fieldValue := range *value.Fields {
					fmt.Println(fieldKey, fieldValue.Type)

					output = append(output, fieldKey + ": {", "type: " + composeType(fieldValue.Type, fieldValue.Required, fieldValue.List) + ",")
					
					if fieldValue.Description != nil {
						output = append(output, `description: "` + *fieldValue.Description + `",`)
					}

					if fieldValue.DeprecationReason != nil {
						output = append(output, `deprecationReason: "` + *fieldValue.DeprecationReason + `",`)
					}

					if fieldValue.Args != nil {
						output = append(output, "args: {")

						for argKey, argValue := range *fieldValue.Args {
							fmt.Println(argKey, argValue.Type)

							output = append(output, argKey + ": {", "type: " + composeType(argValue.Type, argValue.Required, argValue.List) + ",")
							
							if argValue.Description != nil {
								output = append(output, `description: "` + *argValue.Description + `",`)
							}

							if argValue.DeprecationReason != nil {
								output = append(output, `deprecationReason: "` + *argValue.DeprecationReason + `",`)
							}

							output = append(output, "},")
						}

						output = append(output, "},")
					}

					output = append(output, "},");
				}
			}

			output = append(output, "},")

			output = append(output, "});", "")
			continue;
		}
	}

	// Create file
	f, err := os.Create("output.js");

	if err != nil {
		fmt.Println("Something went wrong while creating the output file")
	}

	// Close file
	defer f.Close();

	buffer := bufio.NewWriter(f)

	buffer.WriteString("import { " + strings.Join(imports, ", ") + `} from "graphql";` + "\n")
	buffer.WriteString("\n")

	for _, line := range output {
        buffer.WriteString(line + "\n")
    }

	buffer.Flush();
}