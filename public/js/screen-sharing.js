
const shareBtn = document.getElementById('shareBtn');
const stop = document.getElementById('stop-share');
const screenPreview = document.getElementById("screen-preview");
screenPreview.style.display="none"

shareScreen = () =>{  
  if(screenPreview.style.display=="none"){
    startShare();   
    socket.emit('share-screen'); 
  }else{
    stopShare();
  }
};

startShare = (err) =>{
  var constraints = {video: {cursor: "always"},  audio: false  };
  navigator.mediaDevices.getDisplayMedia(constraints)
  .then(function(stream) {
    
    screenPreview.srcObject = stream;
    screenPreview.onloadedmetadata = function(e) {
      screenPreview.play();
    };
    document.querySelector('.share-btn ').innerHTML = `<img src="img/stop-share.svg" alt="Stop-share" /> <span >Stop Share</span> `;
    document.querySelector('.share-btn ').classList.add("active-btn");
    screenPreview.style.display="block"

    // somebody clicked on "Stop sharing"
    stream.getVideoTracks()[0].onended = function () {
      screenPreview.style.display="none"
      document.querySelector('.share-btn ').innerHTML = `<img src="img/start-share.svg" alt="start-share" /> <span>start Share</span> `;
      document.querySelector('.share-btn ').classList.remove("active-btn")
    };
  })
  .catch(function(err) { console.log(err.name + ": " + err.message); }); // always check for errors at the end.
}


stopShare = err =>{
  const stream = screenPreview.srcObject;
  const tracks = stream.getTracks();
  tracks.forEach(function(track) {
    track.stop();
  }); 
  screenPreview.srcObject = null;
  screenPreview.style.display="none"
  document.querySelector('.share-btn ').innerHTML = `<img src="img/start-share.svg" alt="start-share" /> <span>start Share</span> `;
  document.querySelector('.share-btn ').classList.remove("active-btn")
  
}



socket.on('screenShare', (userId) =>{
  const date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const format = hours >= 12 ? "PM" : "AM";
  hours %= 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  
  let ul = document.getElementById("messages");
  let li = document.createElement("li");
  li.className = "system-message";
  li.innerHTML = `<span>${hours}:${minutes}${format}</span><span>${userId.substr(0,6)} has  has share screen</span>`;
  ul.appendChild(li);

  document.getElementById('shareBtn').style.display="none"
  console.log(userId.substr(0,6)+" share screen");

  // screenPreview.srcObject = stream;
  //   screenPreview.onloadedmetadata = function(e) {
  //     screenPreview.play();
  //   };
  //   screenPreview.style.display="block";
})
