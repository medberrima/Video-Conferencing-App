var constraints = { video: true, audio: true };
var chunks = [];
var localStream = null;
const recordBtn = document.getElementById('recordBtn');
recordBtn.addEventListener("click", () => {
  let idImgRecord = document.getElementById('RecordImg').alt;
  startRecord(idImgRecord) ;
});

startRecord = (e)=>{

  navigator.mediaDevices.getDisplayMedia(constraints)
  .then(function(stream) {
    localStream = stream;
    const recorder = new MediaRecorder(localStream);
    
    if (typeof MediaRecorder.isTypeSupported == "function") {
      if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
        var options = { mimeType: "video/webm;codecs=vp9" };
      } else if (MediaRecorder.isTypeSupported("video/webm;codecs=h264")) {
        var options = { mimeType: "video/webm;codecs=h264" };
      } else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8")) {
        var options = { mimeType: "video/webm;codecs=vp8" };
      }
      console.log("Using " + options.mimeType);
      mediaRecorder = new MediaRecorder(localStream, options);
    } else {
      console.log("isTypeSupported is not supported, using default codecs for browser");
      mediaRecorder = new MediaRecorder(localStream);
    }

    document.querySelector('.record-btn').innerHTML = `<img src="img/stop-recording.svg" alt="stop-recording" id="RecordImg"/> <span class='red'>Stop record</span> `;
    
    recorder.ondataavailable = e => chunks.push(e.data);
    
    
    recorder.onstop = e => {
      console.log("mediaRecorder.onstop, mediaRecorder.state = " + mediaRecorder.state);

      const blob = new Blob(chunks, {type: "video/webm" });
      chunks = [];

      const videoURL = URL.createObjectURL(blob);

      const videoWindow = window.open("", "_blank");
      videoWindow.document.write(`<video  style='width:100%; height:100%' src='${videoURL}' controls ></video>`);
      document.querySelector('.record-btn').innerHTML = `<img src="img/start-recording.svg" alt="start-recording" id="RecordImg"/> <span>Start record</span> `;
    };

    recorder.start(10);
  })
  .catch(function(e) { console.log(e.name + ": " + e.message); });
}



