# Video-Call
## Node js
#### Node js is a JavaScript runtime based on Chrome V8 JavaScript engine.
#### API reference: https://nodejs.org/
- A large community, lot of tutorials and a good descriptive documentation is present for nodejs which makes it easier to use and debug when stuck.
- Robustness: Using nodejs allows for full stack JavaScript development (both server and client side).
- Nodejs Package Manager: npm has a large collection of modules that can be used in a nodejs app.

## Peerjs
#### PeerJS is a wrapper around the browser's WebRTC which provides a complete and easy to use peer-to-peer connection API. 
#### API reference: https://peerjs.com/docs.html#api
**Pros:**
- Can be integrated as module using the npm.
- No keys of any sort needed for establishing a peer to peer connection.
- Since it is a low level API, features and functionalities can be customized easily.
- It can be included in the webpage as the JavaScript client.
- Every peer is assigned a random unique id when it's created by the API.
- Free of cost   
**Cons:**
- Since it establishes a connection peer to peer, it is comparatively slow.
- The peerjs github repo is not very active, hence you need to figure out the bugs and solve them on your own.
- Turn servers are paid, hence cross netwrok connections are difficult to establish.

#### Other SDKs/APIs that were explored and can be used:

### Jitsi
#### Jitsi is a complete easy to use application that offers both high level and low level API to the developer.
**Pros:**
- Using the high level API is very easy.
- It offers almost all the features that one would wish to have like screen share, chat, recording etc.
- Free of cost   
**Cons:**
- High level API cannot be customized easily.
- Documentation available is not descriptive.
- To use the low level API calls, you need to dive and understand the large code base available on github.
- The code is not well documented, hence difficult to follow.
- Almost no tutorials available.

### Agora
#### Agora has easy-to-embed SDKs to build engaging, interactive apps.
**Pros:**
- Complete set of features.
- Very good documentation
- Doubt support also available
- Easy to customize and integrate within your app    
**Cons:**
- Paid
- Hosting can be tricky as you need to the secret keys which change regularly.

### Vonage
#### It is an API for video calling.
**Pros:**
- Easy to integrate in app.
- Good documentation with tutorials.
- Built on top of webRTC.
- Lots of tools available to be added in the app.   
**Cons:**
- Paid.
- No doubt support.

### Landing page template: Switch
**by Free Software Foundation, Inc. <http://fsf.org/>**   
That page was customized to suit this webApp.

