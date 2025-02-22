# postman get
curl -X GET \
  'http://postman-echo.get?foo=bar&batman=joker' \
  -H 'Postman-Token: 1a88e7fd-5b67-434c-aaf8-90ed9bfc3d46' \
  -H 'cache-control: no-cache' \
  -H 'content: application/json'

# postman post
curl -X POST \
  http://postman-echo.com/post \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: e6a3a3d7-4a55-4dd8-a080-6ad7e425a9b0' \
  -H 'cache-control: no-cache' \
  -d '{
        "a": 1,
        "b": 2
  }'

# github get
curl 'https://api.github.com/users/sahaj-b'

# login
curl 'http://localhost:3000/api/users/login' -X POST -H Content-Type: application/json -d '{
  "email": "test@test.com",
  "password": "testtest"
}'

# logout
curl 'http://localhost:3000/api/users/logout' '-X' 'POST'

# change-settings
curl 'http://localhost:3000/api/users/me' -X 'PATCH' -H 'Content-Type: application/json' -d '{
  "password": "password12",
  "newPassword":"password123",
  "receivingPaused": false,
  "name": "testname"
}'

# register-with-email
curl 'http://localhost:3000/api/users/register-with-email' -X 'POST' -H 'Content-Type: application/json' -d '{ "email": "test@test.com", "password": "password123" }'
