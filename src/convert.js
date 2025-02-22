const curlToPostman = require("curl-to-postmanv2"),
  Collection = require("postman-collection").Collection;

module.exports = {
  convertToCollection: async function (requests, collectionName, cb) {
    if (!requests || !requests.length) {
      console.log("No requests supplied!");
      process.exit(1);
    }

    let collection = new Collection({
      info: {
        name: collectionName || "API Collection",
      },
    });

    Promise.all(
      requests.map((request) => {
        return new Promise((resolve, reject) => {
          curlToPostman.convert(
            { type: "string", data: request.command },
            (err, result) => {
              if (err) {
                return reject(err);
              }
              if (result.output[0] && result.output[0].data) {
                collection.items.add({
                  name: request.name,
                  request: result.output[0].data,
                });
              } else {
                return reject(new Error("Error converting command"));
              }

              return resolve();
            },
          );
        });
      }),
    )
      .then(() => cb(null, collection))
      .catch(cb);
  },
};
