const yargs = require("yargs"),
  fs = require("fs"),
  { convertToCollection } = require("./src/convert");

const argv = yargs
  .array("curl")
  .option("save", {
    describe: "Save the collection to a file",
    type: "string",
  })
  .option("file", {
    describe: "Input file containing curl commands",
    type: "string",
  })
  .option("collection-name", {
    describe: "Name of the Postman collection",
    type: "string",
    default: "API Collection",
  }).argv;

function validateCurlCommand(command) {
  const allowedArgs = [
    "-A",
    "--user-agent",
    "-d",
    "--data",
    "--data-binary",
    "-F",
    "--form",
    "-G",
    "--get",
    "-H",
    "--header",
    "-X",
    "--request",
  ];

  // Extract all arguments starting with - or --
  const args = command.match(/(?:\s|^)(-[-A-Za-z]+)/g);
  if (!args) return true;

  const invalidArgs = args
    .map((arg) => arg.trim())
    .filter((arg) => !allowedArgs.includes(arg));

  if (invalidArgs.length > 0) {
    console.error("Error: Unsupported curl arguments:", invalidArgs.join(", "));
    console.error("Only these arguments are supported by curl-to-postman:");
    console.error(allowedArgs.join(", "));
    process.exit(1);
  }

  return true;
}

function parseShFile(content) {
  const requests = [];
  const lines = content.split("\n");
  let name = "";

  lines.forEach((line) => {
    line = line.trim();
    if (line.startsWith("#")) {
      name = line.substring(1).trim();
    } else {
      if (name && line) {
        // Replace --data-raw with -d and remove -L argument
        const modifiedCommand = line
          .replace(/--data-raw/g, "-d")
          .replace(/\s+-L(\s|$)/g, " ");
        validateCurlCommand(modifiedCommand);
        requests.push({
          name: name,
          command: modifiedCommand,
        });
        name = "";
      }
    }
  });

  return requests;
}

let requests = [];

if (argv.file) {
  try {
    const content = fs.readFileSync(argv.file, "utf8");
    requests = parseShFile(content);
  } catch (err) {
    console.error("Error reading input file:", err);
    process.exit(1);
  }
} else if (argv.curl) {
  requests = argv.curl.map((command) => {
    // const command = command
    //   .replace(/--data-raw/g, "-d")
    //   .replace(/\s+-L(\s|$)/g, " ");
    validateCurlCommand(command);
    return {
      name: "curl",
      command: command,
    };
  });
}

convertToCollection(requests, argv["collection-name"], (err, collection) => {
  if (err) {
    console.log("Error occurred", err);
    process.exit(1);
  }

  let postmanCollection = collection.toJSON();
  console.log(JSON.stringify(postmanCollection, null, 4));

  if (argv.save) {
    fs.writeFile(
      argv.save,
      JSON.stringify(postmanCollection, null, 4),
      (err) => {
        if (err) {
          console.log("Error writing to file", err);
          process.exit(1);
        }
        console.log(`Collection saved to ${argv.save}`);
      },
    );
  }
});

