const fakeServer = require('../')
const fetch = require('node-fetch')
const path = require('path')

const model_obj = {
  "port": "8081",
  "api": [{
    "method": "GET",
    "path": "/test",
    "response": {
      "testOne": 1,
      "testTwo": 2,
      "testThree": 3,
      "testFour": 4,
    }
  }]
}

const model_array = {
  "port": "8082",
  "api": [{
    "method": "GET",
    "path": "/test",
    "response": [
      {
        "testOne": 1,
        "testTwo": 2,
        "testThree": 3,
        "testFour": 4,
      },
      {
        "testOne": 1,
        "testTwo": 2,
        "testThree": 3,
        "testFour": 4,
      },
      {
        "testOne": 1,
        "testTwo": 2,
        "testThree": 3,
        "testFour": 4,
      }
    ]
  }]
}

let server_obj = null
let server_array = null

setTimeout(() => {
  server_obj.stop()
  server_array.stop()
}, 2500)

callToServer()
async function callToServer() {

  server_obj = fakeServer(model_obj)
  server_array = fakeServer(model_array)

  const query_resp_obj = await fetch('http://localhost:8081/test?testOne=1&testTwo=2', {method: 'GET'}).then((res) => res.text())
  // {"testOne":1,"testTwo":2}
  console.log(query_resp_obj)

  const query_resp_array = await fetch('http://localhost:8082/test?testOne=1&testTwo=2', {method: 'GET'}).then((res) => res.text())
  console.log(query_resp_array)
}