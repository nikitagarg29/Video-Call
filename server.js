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

const userS = [], userI = [];

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/peerjs", peerServer);
app.use(express.urlencoded());
app.use(express.json());

app.get("/", (req, rsp) => {
    rsp.render("index");
});

app.post('/newmeet', function(req, res) {
    res.redirect(`/${uuidv4()}`);
});

app.post('/joinmeet', function(req, res) {
    res.redirect(`/${req.body.roomid}`);
});

app.get("/:room", (req, rsp) => {
    rsp.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {

    socket.on("join-room", (roomId, userId) => {
        console.log("new user", userId);
        userS.push(socket.id);
        userI.push(userId);
        socket.join(roomId);
        socket.broadcast.to(roomId).emit("user-connected", userId);

        socket.on('removeUser', (sUser, rUser)=>{
	    	var i = userS.indexOf(rUser);
	    	if(sUser == userI[0]){
	    	  console.log("Removed"+rUser);
	    	  socket.broadcast.to(roomId).emit('remove-User', rUser);
	    	}
	    });

        socket.on('obect', (sUser, object) =>{
            if(sUser == userI[0]){
                socket.broadcast.to(roomId).emit('grid_obj', object);
            }
        });

        socket.on("message", (message) => {
            io.to(roomId).emit("createMessage", message);
        });

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


server.listen(process.env.PORT || 3030);