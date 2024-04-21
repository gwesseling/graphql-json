#!/bin/bash

cd go
go build -ldflags="-s -w" -trimpath codegen.go

mv codegen.exe graphql-codegen-${GOOS}-${GOARCH}.exe

