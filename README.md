# Collab With Team
## Connect with your team using this easy to use video conferencing tool.

**This app is build using the Agile Methodology.**   
### Design phase:
- Decided the tech stack
- Worked on the requirements
- Build a plan of what is to be made  
- Explored various APIs/ SDKs that can be used.

### Iteration 1
* Mandatory functionality: A peer to peer connection established between 2 people.
* Ability to mute/ unmute.
* Ability to play/ pause your video.   
* Multiple users can connect. (Tested for 5 users)
* Ability to play any user's video on full screen mode.

### Iteration 2
- Made changes as per feedback of Iteration 1.
- Raise hand feature
- Host (the first user) can share his/her full screen, a tab or a window to all others.  
- Worked on UI.   

### Iteration 3
* Made changes as per feedback of Iteration 2.
* Implemented a chat box to be used during the meeting.
* Record the meeting
* Whiteboard (under development), currently it leads to an external website.  
## Tech stack used
### Node js
#### Node js is a JavaScript runtime based on Chrome V8 JavaScript engine.
#### API reference: https://nodejs.org/
- A large community, lot of tutorials and a good descriptive documentation is present for nodejs which makes it easier to use and debug when stuck.
- Robustness: Using nodejs allows for full stack JavaScript development (both server and client side).
- Nodejs Package Manager: npm has a large collection of modules that can be used in a nodejs app.

### Socket io
#### Reference: https://socket.io/
- Socket.IO enables real-time, bidirectional and event-based communication.
- It works on every platform with focus on reliability and speed.

### Express
#### Reference: http://expressjs.com/
- Allows to set up middlewares to respond to HTTP Requests.
- Defines a routing table which is used to perform different actions based on HTTP Method and URL.
- Allows to render HTML Pages based on passing arguments to templates.
### Peerjs
#### PeerJS is a wrapper around the browser's WebRTC which provides a complete and easy to use peer-to-peer connection API. 
#### API reference: https://peerjs.com/docs.html#api
#### WebRTC API reference: https://webrtc.org/
**Pros:**
- Can be integrated as module using the npm.
- No keys of any sort needed for establishing a peer to peer connection.
- Since it is a low level API, features and functionalities can be customized easily.
- It can be included in the webpage as the JavaScript client.
- Every peer is assigned a random unique id when it's created by the API.
- Free of cost   
**Cons:**
* Since it establishes a connection peer to peer, it is comparatively slow.
* The peerjs github repo is not very active, hence you need to figure out the bugs and solve them on your own.
* Turn servers are paid, hence cross netwrok connections are difficult to establish.

### Other SDKs/APIs that were explored and can be used:

### Jitsi
#### Jitsi is a complete easy to use application that offers both high level and low level API to the developer.
**Pros:**
- Using the high level API is very easy.
- It offers almost all the features that one would wish to have like screen share, chat, recording etc.
- Free of cost   
**Cons:**
* High level API cannot be customized easily.
* Documentation available is not descriptive.
* To use the low level API calls, you need to dive and understand the large code base available on github.
* The code is not well documented, hence difficult to follow.
* Almost no tutorials available.

### Agora
#### Agora has easy-to-embed SDKs to build engaging, interactive apps.
**Pros:**
- Complete set of features.
- Very good documentation
- Doubt support also available
- Easy to customize and integrate within your app    
**Cons:**
* Paid
* Hosting can be tricky as you need to the secret keys which change regularly.

### Vonage
#### It is an API for video calling.
**Pros:**
- Easy to integrate in app.
- Good documentation with tutorials.
- Built on top of webRTC.
- Lots of tools available to be added in the app.   
**Cons:**
* Paid.
* No doubt support.

### Landing page template: Switch
**by Free Software Foundation, Inc. <http://fsf.org/>**   
That page was customized to suit this webApp.

