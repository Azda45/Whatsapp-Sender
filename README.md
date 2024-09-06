# Whatsapp Sender

## how to deploy

- Install Nodejs
  min Nodejs 18
- clone repository
  ```git clone https://github.com/Azda45/Whatsapp-Sender.git```
- Installing package
  ```npm i```
- Start server
  ```node index.js```
## feature
- Send using rest api
- custom command and response text or image
  #### text response
  ```{
        "commands": [
            "hi"
        ],
        "description": "Description for command list",
        "type": "text",
        "response": "This response.",
        "typingDelay": 2000,
        "sendDelay": 1000
    }```
  #### image response
  ```{
        "commands": [
            "hello"
        ],
        "description":"Description for command list",
        "type": "image",
        "media": "./path/to/image",
        "typingDelay": 2000,
        "sendDelay": 1000,
        "response": "text response when needed.",
    },```
