const {codegen} = require("@gwesseling/graphql-codegen");

codegen(["input.json"])
    .then((result) => console.log(result))
    .catch((err) => console.log(err));
