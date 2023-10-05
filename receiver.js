'use strict';

const startButton = document.getElementById('startButton');
const hangupButton = document.getElementById('hangupButton');
const callButton = document.getElementById('callButton');
hangupButton.disabled = true;

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const peer_id = document.getElementById("peer-id-label");
const statusTxt = document.getElementById("status");

const myVideo = document.createElement('video');
const peers = {};

var peer = null; // Own peer object
let localStream = null;
var conn = null;
function initialize() {
    // Create own peer object with connection to shared PeerJS server
    peer = new Peer(null, {
        debug: 2
    });
    //open
    peer.on('open', function () {
        peer_id.innerHTML = peer.id;

        // if (peer.id === null) {
        //     console.log('Received null id from peer open');
        //     peer.id = lastPeerId;
        // } else {
        //     lastPeerId = peer.id;
        // }
    });

    //peer connect
    peer.on('connection', function (c) {
        if (conn && conn.open) {
            c.on('open', function () {
                c.send("Already connected to another client");
                setTimeout(function () { c.close(); }, 500);
            });
            return;
        }

        // conn = c;
        // console.log("Connected to: " + conn.peer);
        statusTxt.innerHTML = "Connected";

    });
    //disconnected
    peer.on('disconnected', function () {
        statusTxt.innerHTML = "Connection lost. Please reconnect";
        console.log('Connection lost. Please reconnect');

        // // Workaround for peer.reconnect deleting previous id
        // peer.id = lastPeerId;
        // peer._lastServerId = lastPeerId;
        // peer.reconnect();
    });
    //close
    peer.on('close', function () {
        conn = null;
        statusTxt.innerHTML = "Connection destroyed. Please refresh";
        console.log('Connection destroyed');
    });
    //error
    peer.on('error', function (err) {
        alert("An error ocurred with peer: " + err);
        console.error(err);
    });
    //call
    peer.on('call', function (call) {

        // conn.send(msg);
        // console.log("Sent: " + msg);
        // var acceptsCall = confirm("Videocall incoming, do you want to accept it ?");

        // if (acceptsCall) {
        // // Answer the call with your own video/audio stream
        // call.answer(window.localStream);

        // // Receive data
        // call.on('stream', function (stream) {
        //     // Store a global reference of the other user stream
        //     window.peer_stream = stream;
        //     // Display the stream of the other user in the peer-camera video element !
        //     onReceiveStream(stream, remoteVideo);
        // });

        // // Handle when the call finishes
        // call.on('close', function () {
        //     alert("The videocall has finished");
        // });

        // use call.close() to finish a call
        // } else {
        //     console.log("Call denied !");
        // }
    });

}
initialize();

//startbutton click
startButton.onclick = async () => {
    localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    localVideo.srcObject = localStream;
    startButton.disabled = true;
    hangupButton.disabled = false;

};
//hangup click
hangupButton.onclick = async () => {
    hangup();
};
//hangup click
callButton.onclick = async () => {
    const call = peer.call(remoteVideo, localStream);
    const personNVideo = document.createElement('video');
    // 6. AfterpersonN accept the call, myPeer will add personN's stream on myPeer's screen
    call.on('stream', (localStream) => {
        addVideoStream(personNVideo, localStream);
    });

    call.on('close', () => personNVideo.remove());
    var personN = 1
    peers[personN] = call;
}


async function hangup() {
    //peer 제거
    // if (pc) {
    //   pc.close();
    //   pc = null;
    // }
    localStream.getTracks().forEach(track => track.stop());
    localStream = null;
    startButton.disabled = false;
    hangupButton.disabled = true;
};

function onReceiveStream(stream, element_id) {
    // Retrieve the video element according to the desired
    var video = document.getElementById(element_id);
    // Set the given stream as the video source
    video.srcObject = stream;

    // Store a global reference of the stream
    window.peer_stream = stream;
}

function addVideoStream(video, stream, yourVideo = false) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => video.play());

    if (yourVideo) yourVideoGrid.append(video);
    else otherVideoGrid.append(video);
}