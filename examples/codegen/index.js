const {codegen} = require("@gwesseling/graphql-codegen");

codegen({
    inputFile: "input.json",
    outputFile: "schema.ts",
})
    .then((result) => console.log(result))
    .catch((err) => console.log(err));
