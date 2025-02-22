# Convert multiple cURL requests to a Postman collection

If you have multiple cURL requests that you want to import to Postman at once, this script will help you achieve that.

This script makes use of [**cURL to Postman** module](https://github.com/postmanlabs/curl-to-postman) and [**Collection SDK** module](https://github.com/postmanlabs/postman-collection/) to achieve this.

This is a fork of [bhargavkaranam/multiple-curl-to-postman](https://github.com/bhargavkaranam/multiple-curl-to-postman)
## This fork adds:
  - Support for converting bash file with multiple cURL commands to a postman collection (see [this section](#convert-from-bash-file))
  - Validation for cURL commands
  - `--save` and `--collection-name` flags

## Installation
```bash
git clone https://github.com/sahaj-b/multiple-curl-to-postman.git
cd multiple-curl-to-postman
npm install
```

## Usage

### Convert from standalone cURL commands using `--curl`
``` bash
node index.js --curl "curl -X GET \
  'http://postman-echo.get?foo=bar&batman=joker' \
  -H 'Postman-Token: 1a88e7fd-5b67-434c-aaf8-90ed9bfc3d46' \
  -H 'cache-control: no-cache' \
  -H 'content: application/json'" \
  --curl "curl -X POST \
  http://postman-echo.com/post \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: e6a3a3d7-4a55-4dd8-a080-6ad7e425a9b0' \
  -H 'cache-control: no-cache' \
  -d '{
        \"a\": 1,
        \"b\": 2
  }'"
```

### Convert from bash file
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

**Check [commands.sh](commands.sh) file for examples**

> [!IMPORTANT]
> The script automatically removes `-L` flag and replaces `--data-raw` with `-d` flag from the cURL commands in bash file


> [!NOTE]
> This fork doesn't save to file by default, it just outputs the collection to console
>
> Use `--save FILE` flag to save the collection to a file
> 
> Use `--collection-name NAME` flag to set the collection name
