package main

import (
	"bufio"
	"encoding/json"
	"flag"
	"io"
	"log"
	"os"
	"strings"
)

func main() {
	log.SetPrefix("[GraphQL-Codegen]: ")
	log.SetFlags(0)

	var inputFilePath = flag.String("inputFile", "schema.json", "Path to the input json file")
	var outputFilePath = flag.String("outputFile", "schema.js", "Path for the out schema file")
	flag.Parse()

	// Try to open json file
	file, err := os.Open(*inputFilePath)

	// Something went wrong while opening the json file
	if err != nil {
		log.Fatal(err)
	}

	// Close json file
	defer file.Close()

	// Read the file content as bytes
	bytes, _ := io.ReadAll(file)

	var schema map[string]GraphQLType

	// Parse json files
	json.Unmarshal(bytes, &schema)

	var order, imports, output = composeSchema(schema)

	// Create file
	outputFile, err := os.Create(*outputFilePath)

	if err != nil {
		log.Fatal(err)
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
