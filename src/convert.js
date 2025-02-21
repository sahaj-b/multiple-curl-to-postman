const curlToPostman = require('curl-to-postmanv2'),
  Collection = require('postman-collection').Collection;

function cleanCurlCommand(command) {
  // Remove -L argument if it exists
  return command.replace(/\s+-L\s+/, ' ').trim();
}

module.exports = {
  convertToCollection: async function (requests, collectionName, cb) {
    if (!requests || !requests.length) {
      console.log('No requests supplied!');
      process.exit(1);
    }

    let collection = new Collection({
      info: {
        name: collectionName || 'API Collection'
      }
    });
    
    Promise.all(requests.map((request) => {
      const curlCommand = cleanCurlCommand(
        typeof request === 'string' 
          ? request 
          : request.command
      );
      
      const requestName = typeof request === 'string' 
        ? 'curl' 
        : request.name;

      return new Promise((resolve, reject) => {
        curlToPostman.convert({ type: 'string', data: curlCommand }, (err, result) => {
          if (err) {
            return reject(err);
          }
          
          if (result.output[0]) {
            collection.items.add({
              name: requestName,
              request: result.output[0].data
            });
          }
          
          return resolve();
        });
      });
    }))
      .then(() => cb(null, collection))
      .catch(cb);
  }
};



