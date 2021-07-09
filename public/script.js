//Declaration of components
const socket = io("/");
const chatInputBox = document.getElementById("chat_message");
const all_messages = document.getElementById("all_messages");
const leave_meeting = document.getElementById("leave-meeting");
const main_chat_window = document.getElementById("main_chat_window");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

/* Declaring peer (Reference: peerjs module of node js)
   peerjs library: https://peerjs.com/ */
const peer = new Peer({
    config: {
        /*Using the freely available stun and turn servers
          Free turn servers are not reliable, they tend to change urls often
          Hence, trying out many free servers, but still cannot assure that they'll work. */
        iceServers: [
            {
                url: 'stun:stun.l.google.com:19302'
            },
            {
                url: 'turn:numb.viagenie.ca',
                credential: 'muazkh',
                username: 'webrtc@live.com'
            },
            {
                url: 'turn:turn.bistri.com:80',
                credential: "homeo",
                username: "homeo"
            },
            {
                url: 'turn:turn.anyfirewall.com:443?transport=tcp',
                credential: "webrtc",
                username: "webrtc"
            },
            {
                url: "turn:13.250.13.83:3478?transport=udp",
                credential: "YzYNCouZM1mhqhmseWk6",
                username: "YzYNCouZM1mhqhmseWk6",
            }
        ]
    }
});

//Variables to store the data that is to be displayed to the users
let myVideoStream;
let currentUserId;
let pendingMsg = 0;
let peers = {};
let currentPeer = [];
let users = [];

//Asking for user name from the user
let YourName = prompt("Enter your name...");

/* Using the getUserMedia() API for accessing the camera and microphone
   A part of webrtc package (peerjs is a wrapper around webrtc)
  Used the multiple methods for browser compatibility. */
var getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;

navigator.mediaDevices
    .getUserMedia({
        video: true,
        audio: true,
    })
    //Streaming the video
    .then((stream) => {
        myVideoStream = stream;
        addVideoStream(myVideo, stream, "me");

        peer.on("call", (call) => {
            call.answer(stream);
            const video = document.createElement("video");

            //adding the video stream during call
            call.on("stream", (userVideoStream) => {
                addVideoStream(video, userVideoStream);
                console.log(peers);
            });

            let gride;
            peers[call.peer] = call;

            //Removing the video on closure of call
            call.on("close", () => {
                video.remove();
            });

        });

        // Connecting a new user
        //Set timeout function used to avoid any possible race condition
        socket.on("user-connected", (userId) => {
            setTimeout(() => {
                connectToNewUser(userId, stream);
            },
                1000);
        });

        //Disconnect a user
        socket.on("user-disconnected", (userId) => {
            if (peers[userId]) peers[userId].close();
            
            //Increasing the size of remaining videos after disconnecting a user
            let totalUsers = document.getElementsByTagName("video").length;
            if (totalUsers > 0) {
                for (let index = 0; index < totalUsers; index++) {
                    document.getElementsByTagName("video")[index].style.width =
                        100 / totalUsers + "%";
                }
            }
        });

    });

peer.on("open", async id => {
    currentUserId = id;
    socket.emit("join-room", ROOM_ID, id);
});

socket.on("disconnect", function () {
    socket.emit("leave-room", ROOM_ID, currentUserId);
});

//Function to connect new user which was called from socket.connect
const connectToNewUser = (userId, streams) => {
    var call = peer.call(userId, streams);
    console.log(call);
    //creating a new video element for new user
    var video = document.createElement("video");
    call.on("stream", (userVideoStream) => {
        console.log(userVideoStream);
        addVideoStream(video, userVideoStream, userId);
    });
    call.on("close", () => {
        video.remove();
        //Resizing the remaining videos to fill the major part of screen
        let totalUsers = document.getElementsByTagName("video").length;
        if (totalUsers > 0) {
            for (let index = 0; index < totalUsers; index++) {
                document.getElementsByTagName("video")[index].style.width =
                    100 / totalUsers + "%";
            }
        }
    });
    peers[userId] = call;
    currentPeer.push(call.peerConnection);
};

//Pause-Resume the user video
const playStop = () => {
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    //Pause the video
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo();
    }
    //Resume the video streaming 
    else {
        setStopVideo();
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
};

const addVideoStream = (videoEl, stream, uId = "") => {
    videoEl.srcObject = stream;
    videoEl.controls = true;
    videoEl.id = uId;
    videoEl.addEventListener("loadedmetadata", () => {
        videoEl.play();
    });
    
    //Adding this video to the screen video grid
    videoGrid.append(videoEl);

    //Shrinking the size of videos to accomodate this new video element
    let totalUsers = document.getElementsByTagName("video").length;
    if (totalUsers > 1) {
        for (let index = 0; index < totalUsers; index++) {
            document.getElementsByTagName("video")[index].style.width =
                100 / totalUsers + "%";
        }
    }
};

//Mute/Unmute the user audio 
const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    } else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
};

//Setting the video icon to paused video
const setPlayVideo = () => {
    const html = `<i class="unmute fa fa-pause-circle"></i>
  <span class="unmute">Resume Video</span>`;
    document.getElementById("playPauseVideo").innerHTML = html;
};

//Setting the video icon to play mode
const setStopVideo = () => {
    const html = `<i class=" fa fa-video-camera"></i>
  <span class="">Pause Video</span>`;
    document.getElementById("playPauseVideo").innerHTML = html;
};

//Setting the mic icon to slashed icon 
const setUnmuteButton = () => {
    const html = `<i class="unmute fa fa-microphone-slash"></i>
  <span class="unmute">Unmute</span>`;
    document.getElementById("muteButton").innerHTML = html;
};

//Setting the mic icon to normal again
const setMuteButton = () => {
    const html = `<i class="fa fa-microphone"></i>
  <span>Mute</span>`;
    document.getElementById("muteButton").innerHTML = html;
};

//Chat box configuration
document.addEventListener("keydown", (e) => {
    if (e.which === 13 && chatInputBox.value != "") {
        socket.emit('message', chatInputBox.value, YourName);
        chatInputBox.value = "";
    }
});

//Sending a new message
document.getElementById("sendMsg").addEventListener("click", (e) => {
    if (chatInputBox.value != "") {
        socket.emit('message', chatInputBox.value, YourName);
        chatInputBox.value = "";
    }
});

//Rendering the messages
socket.on("createMessage", (message, name) => {
    console.log(message);
    let li = document.createElement("li");
    //Raise hand feature
    if (`${message}` == "&#9995;") {
        li.innerHTML = `<div class="hand"><b>${name}&ensp;</b><span id="symbolhand">${message}</span></div>`;
    }
    else {
        //Rendering other users messages
        if (name != YourName) {
            li.classList.add("otherUser");
            li.innerHTML = `<div class="singlemessage"><b><small>${name}:</small></b> <br>${message}<br></div>`;
        }
        //Rendering your messages
        else {
            li.innerHTML = `<div class="mymessage"><b><small>Me:</small></b> <br>${message}<br></div>`;
        }
    }
    all_messages.append(li);
    main_chat_window.scrollTop = main_chat_window.scrollHeight;
});

//Showing the invite popup
const showInvitePopup = () => {
    document.getElementById("invitePop").style.display = "block";
    document.getElementById("roomLink").value = window.location.href;
};

//Hiding the invite popup after showing it
const hideInvitePopup = () => {
    document.getElementById("invitePop").style.display = "none";
};

//Function to copy the invite link
const copyToClipboard = () => {
    var copyText = document.getElementById("roomLink");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
    alert("Copied: " + copyText.value);
    hideInvitePopup();
};

//Function to allow ScreenSharing to host
const screenShare = () => {
    navigator.mediaDevices.getDisplayMedia({
        video: {
            cursor: 'always'
        },
        audio: {
            echoCancellation: true,
            noiseSupprission: true
        }

    }).then(stream => {
        let videoTrack = stream.getVideoTracks()[0];
        videoTrack.onended = function () {
            stopScreenShare();
        }
        //streaming the host's shared screen to all others
        for (let x = 0; x < currentPeer.length; x++) {

            let sender = currentPeer[x].getSenders().find(function (s) {
                return s.track.kind == videoTrack.kind;
            })

            sender.replaceTrack(videoTrack);
        }

    })
}

//Restoring the video track after screen sharing is stopped
function stopScreenShare() {
    let videoTrack = myVideoStream.getVideoTracks()[0];
    for (let x = 0; x < currentPeer.length; x++) {
        let sender = currentPeer[x].getSenders().find(function (s) {
            return s.track.kind == videoTrack.kind;
        })
        sender.replaceTrack(videoTrack);
    }
}

//Raise hand function
const raisedHand = () => {
    const sym = "&#9995;";
    socket.emit('message', sym, YourName);
    unChangeHandLogo();
}

//Modifying the logo after the user raises hand
const unChangeHandLogo = () => {
    const html = `<i class="fa fa-hand-paper-o" aria-hidden="true" style="color:red;"></i>
                <span>Raised</span>`;
    document.querySelector('.raisedHand').innerHTML = html;
    changeHandLogo();
}

//Restoring the logo after a few seconds of raise hand
const changeHandLogo = () => {
    setInterval(function () {
        const html = `<i class="fa fa-hand-paper-o" aria-hidden="true" style="color:white;"></i>
                <span>Hand</span>`;
        document.querySelector('.raisedHand').innerHTML = html;
    }, 3000);
}

//Redirecting the user to home page on disconnect
const disconnectNow = () => {
    window.location = "/";
}

socket.on('remove-User', (userId) => {
    if (currentUserId == userId) {
        disconnectNow();
    }
});

//Generating a whiteboard link for the whole team
//The id of whiteboard is same as the room id
const whiteboard = () => {
    var urlParser = document.createElement('a');
    urlParser.href = window.location.href;
    var pathname = urlParser.pathname;
    //External site providing whiteboard
    var text = "https://www.witeboard.com" + pathname;
    var share = document.createElement('input');
    document.body.appendChild(share);
    share.value = text;
    share.select();
    //Copying the link
    document.execCommand('copy');
    document.body.removeChild(share);
    alert('Copied: ' + `${text}`);
    //Putting the link in chat box as announcement
    var msg = "This is the link for your team whiteboard: " + `${text}`;
    socket.emit('message', msg, YourName);

}

