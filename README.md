# This fork adds .sh file conversion feature and supports setting collection name
## Multiple cURL requests to a Postman collection converter

If you have multiple cURL requests that you want to import to Postman at once, this script will help you achieve that.

Makes use of [**cURL to Postman** module](https://github.com/postmanlabs/curl-to-postman) and [**Collection SDK** module](https://github.com/postmanlabs/postman-collection/) to achieve this.

## Usage
> [!NOTE]
> Use `--save FILE` flag to save the collection to a file
> 
> Use `--collection-name NAME` flag to set the collection name

### Convert from standalone cURL commands
``` bash
node index.js --curl "curl -X GET \
  'http://postman-echo.get?foo=bar&batman=joker' \
  -H 'Postman-Token: 1a88e7fd-5b67-434c-aaf8-90ed9bfc3d46' \
  -H 'cache-control: no-cache' \
  -H 'content: application/json'" --curl "curl -X POST \
  http://postman-echo.com/post \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: e6a3a3d7-4a55-4dd8-a080-6ad7e425a9b0' \
  -H 'cache-control: no-cache' \
  -d '{
        a: 1,
        b: 2
  }'"
```

### Convert from .sh file
```bash
node index.js --file path/to/file.sh
```
**Format for .sh file:**
```bash
# Request Name 1
curl_command_1

# Request Name 2
curl_command_2

#....
```

> [!IMPORTANT]
> curl commands **must be in one line**
> 
> The script automatically removes `-L` flag and replaces `--data-raw` with `-d` flag

Example file:
```bash
# login
curl 'http://localhost:3000/api/users/login' -X POST -H 'Content-Type: application/json' --data-raw '{   "email": "test@test.com",   "password": "testtest" }'

# logout
curl 'http://localhost:3000/api/users/logout' '-X' 'POST'

# get postman
curl -X POST http://postman-echo.com/post -H 'Content-Type: application/json' -H 'Postman-Token: e6a3a3d7-4a55-4dd8-a080-6ad7e425a9b0' -H 'cache-control: no-cache' -d '{ a: 1, b: 2 }'

