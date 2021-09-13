// 'use strict';

// Polyfill in Firefox.
// See https://blog.mozilla.org/webrtc/getdisplaymedia-now-available-in-adapter-js/
// if (adapter.browserDetails.browser == 'firefox') {
//   adapter.browserShim.shimGetDisplayMedia(window, 'screen');
// }

// function handleSuccess(stream) {
//   startButton.disabled = true;
//   const video = document.querySelector('video');
//   video.srcObject = stream;

  // demonstrates how to detect that the user has stopped
  // sharing the screen via the browser UI.
//   stream.getVideoTracks()[0].addEventListener('ended', () => {
//     errorMsg('The user has ended sharing the screen');
//     startButton.disabled = false;
//   });
// }

// function handleError(error) {
//   errorMsg(`getDisplayMedia error: ${error.name}`, error);
// }

// function errorMsg(msg, error) {
//   const errorElement = document.querySelector('#errorMsg');
//   errorElement.innerHTML += `<p>${msg}</p>`;
//   if (typeof error !== 'undefined') {
//     console.error(error);
//   }
// }

// const startButton = document.getElementById('startButton');
// startButton.addEventListener('click', () => {
//   navigator.mediaDevices.getDisplayMedia({video: true})
//       .then(handleSuccess, handleError);
// });

// if ((navigator.mediaDevices && 'getDisplayMedia' in navigator.mediaDevices)) {
//   startButton.disabled = false;
// } else {
//   errorMsg('getDisplayMedia is not supported');
// }


const shareBtn = document.getElementById('shareBtn');
const stop = document.getElementById('stop-share');
const videoElem = document.getElementById("screen-sharing");
videoElem.style.display="none"



shareBtn.addEventListener("click", function(e) {  
  if(videoElem.style.display=="none"){
    startShare();   
  }else{
    stopShare();
  }
});

function startShare(err){
  var constraints = {video: {cursor: "never"},  audio: false  };
  navigator.mediaDevices.getDisplayMedia(constraints)
  .then(function(stream) {
    videoElem.srcObject = stream;
    // videoElem.onloadedmetadata = function(e) {
    //   videoElem.play();
    // };
    document.querySelector('.share-btn ').innerHTML = `<img src="img/stop-share.svg" alt="Stop-share" /> <span >Stop Share</span> `;
    document.querySelector('.share-btn ').classList.add("active-btn");
    videoElem.style.display="block"

    // somebody clicked on "Stop sharing"
    stream.getVideoTracks()[0].onended = function () {
      videoElem.style.display="none"
      document.querySelector('.share-btn ').innerHTML = `<img src="img/start-share.svg" alt="start-share" /> <span>start Share</span> `;
      document.querySelector('.share-btn ').classList.remove("active-btn")
    };
  })
  .catch(function(err) { console.log(err.name + ": " + err.message); }); // always check for errors at the end.
}


async function stopShare(err){
  const stream = videoElem.srcObject;
  const tracks = stream.getTracks();
  tracks.forEach(function(track) {
    track.stop();
  });
  videoElem.srcObject = null;
  videoElem.style.display="none"
  document.querySelector('.share-btn ').innerHTML = `<img src="img/start-share.svg" alt="start-share" /> <span>start Share</span> `;
  document.querySelector('.share-btn ').classList.remove("active-btn")
}