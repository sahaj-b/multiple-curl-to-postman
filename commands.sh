# login
curl -L 'http://localhost:3000/api/users/login' '-X' 'POST' '-H' 'Content-Type: application/json' '--data-raw' '{   "email": "tes@tes.com",   "password": "testtest" }'

# logout
curl -L 'http://localhost:3000/api/users/logout' '-X' 'POST'

# register-anonymous
curl -L 'http://localhost:3000/api/users/register-anonymous' '-X' 'POST'

# register-with-email
curl -L 'http://localhost:3000/api/users/register-with-email' '-X' 'POST' '-H' 'Content-Type: application/json' '--data-raw' '{   "email": "@test.com",   "password": "password123" }'

# register-existing-with-email
curl -L 'http://localhost:3000/api/users/register-existing-with-email' '-X' 'POST' '-H' 'Content-Type: application/json' '--data-raw' '{   "email": "test1@test.com",   "password": "password123" }'

# refresh-token
curl -L 'http://localhost:3000/api/users/refresh-token' '-X' 'POST'

# info
curl -L 'http://localhost:3000/api/api/users/me' '-X' 'GET'

# change-settings
curl -L 'http://localhost:3000/api/users/me' '-X' 'PATCH' '-H' 'Content-Type: application/json' '--data-raw' '{   "password": "password12",   "newPassword":"password123",   "receivingPaused": false,   "name": "testname" }'

# send-message
curl -L 'http://localhost:3000/api/messages/send' '-X' 'GET' '-H' 'Content-Type: application/json' '--data-raw' '{   "recipientId": "",   "message": "Hello 1234 testing" }'

# get-messages
curl -L 'http://localhost:3000/api/messages/get' '-X' 'GET'
