//Creating a new express app
//express is a module of node js (http://expressjs.com/) 
const express = require("express");
const app = express();

//Creating a server using socket.io module
const server = require("http").Server(app);
const io = require("socket.io")(server);

//uuid package of node js for creating random ids (https://www.npmjs.com/package/uuid)
const { v4: uuidv4 } = require("uuid");

//Server component of peerjs library
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, { debug: true, });

//Storing the userIds on server side also
//This is done in order to make disconnection efficient.
const userS = [], userI = [];

app.set("view engine", "ejs");

//Using the files from public directory
app.use(express.static("public"));

//PeerServer for establishing peer to peer connection
app.use("/peerjs", peerServer);

//For parsing the urls
app.use(express.urlencoded());
app.use(express.json());

//landing page
app.get("/", (req, rsp) => {
    rsp.render("index");
});

//Generate a random roomId if user starts a new meeting
app.post('/newmeet', function(req, res) {
    res.redirect(`/${uuidv4()}`);
});

//Redirect to the id entered by user in case of joining existing meeting
app.post('/joinmeet', function(req, res) {
    res.redirect(`/${req.body.roomid}`);
});

//leading to a meeting
app.get("/:room", (req, rsp) => {
    rsp.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {

    socket.on("join-room", (roomId, userId) => {

        //When a new user joins, store both socket id and peer id
        console.log("new user", userId);
        userS.push(socket.id);
        userI.push(userId);
        //join the given roomId, in case of new meeting the roomId was generated randomly above.
        socket.join(roomId);
        socket.broadcast.to(roomId).emit("user-connected", userId);

        socket.on('removeUser', (sUser, rUser)=>{
            //Disconnection of host
	    	var i = userS.indexOf(rUser);
	    	if(sUser == userI[0]){
	    	  console.log("Removed"+rUser);
	    	  socket.broadcast.to(roomId).emit('remove-User', rUser);
	    	}
	    });

        socket.on('obect', (sUser, object) =>{
            //video grid object
            if(sUser == userI[0]){
                socket.broadcast.to(roomId).emit('grid_obj', object);
            }
        });

        //Messaging to a particular meeting room
        socket.on("message", (message) => {
            io.to(roomId).emit("createMessage", message);
        });

        //Disconnecting user
        socket.on("disconnect", () => {
            console.log("user left");
            var x = userS.indexOf(socket.id);
            userS.splice(x, 1);
            socket.broadcast.to(roomId).emit("user-disconnected", userI[x], userI);
            userI.splice(x, 1);
        });

        socket.on('seruI', () =>{
	    	socket.emit('all_users_inRoom', userI);
		    console.log(userI);
	    });  

    });
});

//declaring the port for webapp
server.listen(process.env.PORT || 3030);