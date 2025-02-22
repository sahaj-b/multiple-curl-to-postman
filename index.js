const yargs = require("yargs"),
  fs = require("fs"),
  { convertToCollection } = require("./src/convert");
const { validate } = require("curl-to-postmanv2");

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

function replaceAndValidateCurlCommand(command, replace = true) {
  command = command.trim();
  // Replace --data-raw with -d and remove -L argument
  if (replace) {
    command = command.replace(/--data-raw/g, "-d").replace(/\s+-L(\s|$)/g, " ");
  }
  if (!validate(command)) {
    console.error("Error: Invalid curl command:", command);
    process.exit(1);
  }
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
  if (!args) return command;

  const invalidArgs = args
    .map((arg) => arg.trim())
    .filter((arg) => !allowedArgs.includes(arg));

  if (invalidArgs.length > 0) {
    console.error("Error: Unsupported curl arguments:", invalidArgs.join(", "));
    console.error("Only these arguments are supported by curl-to-postman:");
    console.error(allowedArgs.join(", "));
    process.exit(1);
  }

  return command;
}

function parseShFile(content) {
  const requests = [];
  const lines = content.split("\n");
  let name = "";
  let command = "";

  lines.forEach((line) => {
    line = line.trim();
    if (line.startsWith("#")) {
      if (command) {
        command = replaceAndValidateCurlCommand(command);
        requests.push({
          name: name,
          command: command,
        });
        command = "";
      }
      name = line.substring(1).trim();
    } else {
      if (name && line) {
        command += line + "\n";
      }
    }
  });
  if (command) {
    command = replaceAndValidateCurlCommand(command);
    requests.push({
      name: name,
      command: command,
    });
  }

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
    // do not replace for --curl argument
    command = replaceAndValidateCurlCommand(command, (replace = false));
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
