package main

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
