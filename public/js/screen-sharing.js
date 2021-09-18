
// const shareBtn = document.getElementById('shareBtn');
// const stop = document.getElementById('stop-share');
// const videoElem = document.getElementById("screen-sharing");
// videoElem.style.display="none"

// shareBtn.addEventListener("click", function(e) {  
  // if(videoElem.style.display=="none"){
    // startShare();   
  // }else{
  //   stopShare();
  // }
// });

// function startShare(err){
//   // var constraints = {video: {cursor: "never"},  audio: false  };
//   navigator.mediaDevices.getDisplayMedia(window, 'screen')
//   .then(function(stream) {
//     myScreenStream = stream;
//     socket.emit('screen-share', stream);
    

    // videoElem.onloadedmetadata = function(e) {
    //   videoElem.play();
    // };
    // document.querySelector('.share-btn ').innerHTML = `<img src="img/stop-share.svg" alt="Stop-share" /> <span >Stop Share</span> `;
    // document.querySelector('.share-btn ').classList.add("active-btn");
    // videoElem.style.display="block"

    // somebody clicked on "Stop sharing"
    // stream.getVideoTracks()[0].onended = function () {
    //   videoElem.style.display="none"
    //   document.querySelector('.share-btn ').innerHTML = `<img src="img/start-share.svg" alt="start-share" /> <span>start Share</span> `;
    //   document.querySelector('.share-btn ').classList.remove("active-btn")
    // };
//   })
//   .catch(function(err) { console.log(err.name + ": " + err.message); }); // always check for errors at the end.
// }


// async function stopShare(err){
//   const stream = videoElem.srcObject;
//   const tracks = stream.getTracks();
//   tracks.forEach(function(track) {
//     track.stop();
//   }); 
//   videoElem.srcObject = null;
//   videoElem.style.display="none"
//   document.querySelector('.share-btn ').innerHTML = `<img src="img/start-share.svg" alt="start-share" /> <span>start Share</span> `;
//   document.querySelector('.share-btn ').classList.remove("active-btn")
// }


// socket.on('screenShare', (stream, userId) => { 
//   const video = document.createElement('video');
//   video.id = 'screen-sharing' ;
//   // video.srcObject = stream;
//   let screenStream=stream;
//   addVideoStream(video, screenStream);
//   console.log(userId+" share screen");
// })