package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"strings"
)

/**
 * TODO:
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

	var order, imports, output = composeSchema(schema)

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
