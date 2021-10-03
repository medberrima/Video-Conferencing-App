const screenPreview = document.getElementById("screen-preview");
function shareScreen(){
  console.log('salem')
  const constraints = {video: {cursor: "always"},  audio: false  };
  navigator.mediaDevices.getDisplayMedia(constraints)
  .then(function(stream) {
    screenPreview.srcObject = stream;
    screenPreview.onloadedmetadata = function(e) {
      screenPreview.play();
    };
    peer.on('call', call => {
      call.answer(stream)
      const video = document.createElement('video')
      call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
      })
    })

  })
  .catch(function(err) { 
    console.log(err.name + ": " + err.message); 
  }); 
}