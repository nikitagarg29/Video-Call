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
const peer = new Peer();

//Variables to store the data that is to be displayed to the users
let myVideoStream;
let currentUserId;
let pendingMsg = 0;
let peers = {};

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

      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
        console.log(peers);
      });

      call.on("close", () => {
        video.remove();
      });

    });

    // Connecting a new user
    socket.on("user-connected", (userId) => {
      setTimeout(() => {
        connectToNewUser(userId, stream);
      },
        1000)
    });

    //Disconnect a user
    socket.on("user-disconnected", (userId) => {
      if (peers[userId]) peers[userId].close();
    });

    //Chat box configuration
    document.addEventListener("keydown", (e) => {
      if (e.which === 13 && chatInputBox.value != "") {
        socket.emit("message", {
          msg: chatInputBox.value,
          user: currentUserId,
        });
        chatInputBox.value = "";
      }
    });
    
    //Sending a new message
    document.getElementById("sendMsg").addEventListener("click", (e) => {
      if (chatInputBox.value != "") {
        socket.emit("message", {
          msg: chatInputBox.value,
          user: currentUserId,
        });
        chatInputBox.value = "";
      }
    });
    
    //Resetting the count of pending messages
    chatInputBox.addEventListener("focus", () => {
      document.getElementById("chat_Btn").classList.remove("has_new");
      pendingMsg = 0;
      document.getElementById("chat_Btn").children[1].innerHTML = `Chat`;
    });

    //Rendering the messages
    socket.on("createMessage", (message) => {
      console.log(message);
      let li = document.createElement("li");
      if (message.user != currentUserId) {
        li.classList.add("otherUser");
        li.innerHTML = `<div><b>User (<small>${message.user}</small>): </b>${message.msg}</div>`;
      }
      else {
        li.innerHTML = `<div><b>Me: </b>${message.msg}</div>`;
      }

      all_messages.append(li);
      main_chat_window.scrollTop = main_chat_window.scrollHeight;
      if (message.user != currentUserId) {
        pendingMsg++;
        playChatSound();
        document.getElementById("chat_Btn").classList.add("has_new");
        document.getElementById("chat_Btn")
          .children[1].innerHTML = `Chat (${pendingMsg})`;
      }
    });
  });

peer.on("call", function (call) {
  getUserMedia(
    { video: true, audio: true },
    function (stream) {
      call.answer(stream); // Answer the call with audio and video streaming.
      var video = document.createElement("video");
      call.on("stream", function (remoteStream) {
        addVideoStream(video, remoteStream);
      });
    },
    function (err) {
      console.log("Failed to get local stream", err);
    }
  );
});

peer.on("open", (id) => {
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
  var video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    console.log(userVideoStream);
    addVideoStream(video, userVideoStream, userId);
  });
  call.on("close", () => {
    video.remove();
  });
  peers[userId] = call;
};

//Pause-Resume the user video
const playStop = () => {
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  } else {
    setStopVideo();
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
};

const addVideoStream = (videoEl, stream, uId = "") => {
  videoEl.srcObject = stream;
  videoEl.id = uId;
  videoEl.addEventListener("loadedmetadata", () => {
    videoEl.play();
  });

  videoGrid.append(videoEl);
  let totalUsers = document.getElementsByTagName("video").length;
  if (totalUsers > 1) {
    for (let index = 0; index < totalUsers; index++) {
      document.getElementsByTagName("video")[index].style.width =
        100 / totalUsers + "%";
    }
  }
};

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

const setPlayVideo = () => {
  const html = `<i class="unmute fa fa-pause-circle"></i>
  <span class="unmute">Resume Video</span>`;
  document.getElementById("playPauseVideo").innerHTML = html;
};

const setStopVideo = () => {
  const html = `<i class=" fa fa-video-camera"></i>
  <span class="">Pause Video</span>`;
  document.getElementById("playPauseVideo").innerHTML = html;
};

const setUnmuteButton = () => {
  const html = `<i class="unmute fa fa-microphone-slash"></i>
  <span class="unmute">Unmute</span>`;
  document.getElementById("muteButton").innerHTML = html;
};

const setMuteButton = () => {
  const html = `<i class="fa fa-microphone"></i>
  <span>Mute</span>`;
  document.getElementById("muteButton").innerHTML = html;
};

const ShowChat = (e) => {
  e.classList.toggle("active");
  document.body.classList.toggle("ShowChat");
};

const playChatSound = () => {
  const chatAudio = document.getElementById("chatAudio");
  chatAudio.play();
};

const speakText = (msgTxt) => {
  var msg = new SpeechSynthesisUtterance();
  msg.text = msgTxt;
  window.speechSynthesis.speak(msg);
};

const showInvitePopup = () => {
  document.body.classList.add("showInvite");
  document.getElementById("roomLink").value = window.location.href;
};


const hideInvitePopup = () => {
  document.body.classList.remove("showInvite");
};

const copyToClipboard = () => {
  var copyText = document.getElementById("roomLink");
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");
  alert("Copied: " + copyText.value);
  hideInvitePopup();
};