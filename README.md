# Whatsapp Sender

## how to deploy

- Install [Nodejs](https://nodejs.org/en)
  min Nodejs 18.
- Download file in [realeases](https://github.com/Azda45/Whatsapp-Sender/releases)
- Installing package
  ```
  npm i
  ```
- Start server
  ```
  node index.js
  ```
## feature
- Send using rest api
  ```
  curl -X POST http://localhost:5000/api/send \
       -H "Content-Type: application/json" \
       -H "x-api-key: your_api_key_here" \
       -d '{"number": "countrycode-phone-number-without-plus-sign", "message": "Hi, this message is sent using the API"}'
  ```
- custom command and response text
  
  #### text response
  ```
  {
        "commands": [
            "hi"
        ],
        "description": "Description for command list",
        "type": "text",
        "response": "This response.",
        "typingDelay": 2000,
        "sendDelay": 1000
    }
  ```
- custom command and response image

  #### image response
  ```
  {
        "commands": [
            "hello"
        ],
        "description":"Description for command list",
        "type": "image",
        "media": "./path/to/image",
        "typingDelay": 2000,
        "sendDelay": 1000,
        "response": "text response when needed.",
    },
  ```
