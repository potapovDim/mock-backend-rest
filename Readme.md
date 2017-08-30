#Fork and improve
## Usage




<img src="./screen.png" width="550"/>

## Install
```sh
npm install -SD mock-backend-rest
```

```js

const {FakeServer} = require('mock-backend-rest');

FakeServer.port = 8085; //default port is 4000
FakeServer.get('/foo', './index.json'); //path to json file what will be response
FakeServer.post('/bar', {LOL: 'LOL'}); //
FakeServer.del('/foo', {LOL: 'LOL'});
FakeServer.put('/bar', {LOL: 'LOL'});

FakeServer.start();

console.log(FakeServer.getGetResult('/foo')) 
//output  { called: false, callCount: 0, method: 'GET' }

```

methods | args
--- | ---
**`get`** | path: `string` example: '/foo'; response: `object` example {LOL: 'LOL'} || `string` - path to json filre
**`post`** | path: `string` example: '/foo'; response: `object` example {LOL: 'LOL'} || `string` - path to json filre
**`del`** | path: `string` example: '/foo'; response: `object` example {LOL: 'LOL'}  || `string` - path to json filre
**`put`** | path: `string` example: '/foo'; response: `object` example {LOL: 'LOL'}  || `string` - path to json filre
**`start`** | any args
**`port`** | setter, any or number, default is 4000
**`getDelResult`** | path: `string` example '/foo', if server dont have action for this path return empty obj
**`getPutResult`** | path: `string` example '/foo', if server dont have action for this path return empty obj
**`getGetResult`** | path: `string` example '/foo', if server dont have action for this path return empty obj
**`getPostResult`** | path: `string` example '/foo', if server dont have action for this path return empty obj


don`t need any dependencies
