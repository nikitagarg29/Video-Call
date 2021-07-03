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

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/peerjs", peerServer);

app.get("/", (req, rsp) => {
    rsp.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, rsp) => {
    rsp.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {

    socket.on("join-room", (roomId, userId) => {
        console.log("new user", userId);
        socket.join(roomId);
        socket.broadcast.to(roomId).emit("user-connected", userId);

        socket.on("message", (message) => {
            io.to(roomId).emit("createMessage", message);
        });

        socket.on("disconnect", function () {
            console.log("user left");
            socket.broadcast.to(roomId).emit("user-disconnected", userId);
        });
    });
});


server.listen(process.env.PORT || 3030);