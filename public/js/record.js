"use strict";

var constraints = { video: true, audio: true };
var downloadLink = document.getElementById("downloadLink");

var mediaRecorder;
var chunks = [];
var count = 0;
var localStream = null;
var soundMeter = null;
var micNumber = 0;
document.getElementById('stopRecord').style.display="none";

function startRecord() {
  if (!navigator.mediaDevices.getDisplayMedia) {
    alert("not supported on your browser, use the latest version of Chrome" );
  } else {
    if (window.MediaRecorder == undefined) {
      alert("MediaRecorder not supported on your browser, use the latest version of Firefox or Chrome"
      );
    } else {
      navigator.mediaDevices.getDisplayMedia(constraints).then(function(screenStream) {
          //check for microphone
          navigator.mediaDevices.enumerateDevices().then(function(devices) {
            devices.forEach(function(device) {
              if (device.kind == "audioinput")  micNumber++;
            });

            if (micNumber == 0) { getStreamSuccess(screenStream);} 
            else {
              navigator.mediaDevices.getUserMedia({audio: true}).then(function(micStream) {
                var composedStream = new MediaStream();

                //added the video stream from the screen
                screenStream.getVideoTracks().forEach(function(videoTrack) {
                  composedStream.addTrack(videoTrack);
                });

                //if system audio has been shared
                if (screenStream.getAudioTracks().length > 0) {
                  //merge the system audio with the mic audio
                  var context = new AudioContext();
                  var audioDestination = context.createMediaStreamDestination();

                  const systemSource = context.createMediaStreamSource(screenStream);
                  const systemGain = context.createGain();
                  systemGain.gain.value = 1.0;
                  systemSource.connect(systemGain).connect(audioDestination);
                  if (micStream && micStream.getAudioTracks().length > 0) {
                    const micSource = context.createMediaStreamSource(micStream);
                    const micGain = context.createGain();
                    micGain.gain.value = 1.0;
                    micSource.connect(micGain).connect(audioDestination);
                    console.log("added mic audio");
                  }
                  audioDestination.stream.getAudioTracks().forEach(function(audioTrack) {
                      composedStream.addTrack(audioTrack);
                    });
                } else {
                  //add just the mic audio
                  micStream.getAudioTracks().forEach(function(micTrack) {
                    composedStream.addTrack(micTrack);
                  });
                }
                  
                getStreamSuccess(composedStream);
                RecordScreen()
              })
              .catch(function(err) {
                console.log("navigator.getUserMedia error: " + err);
              });
            }
          })
          .catch(function(err) {
            console.log(err.name + ": " + err.message);
          });
          document.getElementById('stopRecord').style.display="block";
          document.getElementById('startRecord').style.display="none";
          // somebody clicked on "Stop sharing"
          screenStream.getVideoTracks()[0].onended = function () {
            mediaRecorder.stop();
          };
          
      })
      .catch(function(err) {
        console.log("navigator.getDisplayMedia error: " + err);
      });
    }
  }
}

function getStreamSuccess(stream) {
  localStream = stream;
  // videoElement.srcObject = localStream;
  // videoElement.play();
  // videoElement.muted = true;

  try {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    window.audioContext = new AudioContext();
  } catch (e) {
    console.log("Web Audio API not supported.");
  }

  soundMeter = window.soundMeter = new SoundMeter(window.audioContext);
  soundMeter.connectToSource(localStream, function(e) {
    if (e) {
      console.log(e);
      return;
    }
  });
}

function RecordScreen() {
    /* use the stream */
    console.log("Start recording...");
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

    mediaRecorder.ondataavailable = function(e) { chunks.push(e.data);  };
    mediaRecorder.onerror = function(e) { console.log("mediaRecorder.onerror: " + e); };

    mediaRecorder.onstart = function() { 
      console.log("mediaRecorder.onstart, mediaRecorder.state = " + mediaRecorder.state);
      localStream.getTracks().forEach(function(track) {
        if (track.kind == "audio") {
          console.log("onstart - Audio track.readyState=" + track.readyState + ", track.muted=" + track.muted);
        }
        if (track.kind == "video") {
          console.log("onstart - Video track.readyState=" + track.readyState + ", track.muted=" + track.muted);
        }
      });
    };

    console.log("mediaRecorder.onstop, mediaRecorder.state = " + mediaRecorder.state);
    mediaRecorder.onstop = function() {
      var blob = new Blob(chunks, { type: "video/webm" });
      chunks = [];

      var videoURL = URL.createObjectURL(blob);

      downloadLink.href = videoURL;
      const videoWindow = window.open("", "_blank");
      videoWindow.document.write(`<video  style='width:100%; height:100%' src='${videoURL}' controls ></video>`);
      videoWindow.document.close();
      
      var rand = Math.floor(Math.random() * 1000000);
      var name = "MIT_RECORD_" + rand + ".webm";
      
      downloadLink.setAttribute("download", name);
      downloadLink.setAttribute("name", name);

      document.getElementById('downloadBox').style.display="block";
      document.getElementById('stopRecord').style.display="none";
      document.getElementById('startRecord').style.display="block";
    };
    
    mediaRecorder.start(10);
}

function StopRecord() {
  mediaRecorder.stop()

  const tracks = localStream.getTracks();
  tracks.forEach(function(track) {
    track.stop();
  }); 
}


function SoundMeter(context) {
  this.context = context;
  this.instant = 0.0;
  this.slow = 0.0;
  this.clip = 0.0;
  this.script = context.createScriptProcessor(2048, 1, 1);
  var that = this;
  this.script.onaudioprocess = function(event) {
    var input = event.inputBuffer.getChannelData(0);
    var i;
    var sum = 0.0;
    var clipcount = 0;
    for (i = 0; i < input.length; ++i) {
      sum += input[i] * input[i];
      if (Math.abs(input[i]) > 0.99) {
        clipcount += 1;
      }
    }
    that.instant = Math.sqrt(sum / input.length);
    that.slow = 0.95 * that.slow + 0.05 * that.instant;
    that.clip = clipcount / input.length;
  };
}

SoundMeter.prototype.connectToSource = function(stream, callback) {
  console.log("SoundMeter connecting");
  try {
    this.mic = this.context.createMediaStreamSource(stream);
    this.mic.connect(this.script);
    // necessary to make sample run, but should not be.
    this.script.connect(this.context.destination);
    if (typeof callback !== "undefined") {
      callback(null);
    }
  } catch (e) {
    console.error(e);
    if (typeof callback !== "undefined") {
      callback(e);
    }
  }
};
SoundMeter.prototype.stop = function() {
  this.mic.disconnect();
  this.script.disconnect();
};

const removeBox = () => {
  document.getElementById("downloadBox").remove() ;
}