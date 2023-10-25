const audioUrl = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/858/outfoxing.mp3";
const audioElement = new Audio(audioUrl);
    audioElement.crossOrigin = "anonymous"; // cross-origin - if file is stored on remote server

    const audioContext = new AudioContext();

    const audioSource = audioContext.createMediaElementSource(audioElement);

    const volumeNodeL = new GainNode(audioContext);
    const volumeNodeR = new GainNode(audioContext);

    volumeNodeL.gain.value = 2;
    volumeNodeR.gain.value = 2;

    const channelsCount = 2; // or read from: 'audioSource.channelCount'

    const splitterNode = new ChannelSplitterNode(audioContext, { numberOfOutputs: channelsCount });
    const mergerNode = new ChannelMergerNode(audioContext, { numberOfInputs: channelsCount });

    audioSource.connect(splitterNode);

    splitterNode.connect(volumeNodeL, 0); // connect OUTPUT channel 0
    splitterNode.connect(volumeNodeR, 1); // connect OUTPUT channel 1

    volumeNodeL.connect(mergerNode, 0, 0); // connect INPUT channel 0
    volumeNodeR.connect(mergerNode, 0, 1); // connect INPUT channel 1

    mergerNode.connect(audioContext.destination);

    let isPlaying;
    function playPause() {
      // check if context is in suspended state (autoplay policy)
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      isPlaying = !isPlaying;
      if (isPlaying) {
        audioElement.play();
      } else {
        audioElement.pause();
      }
    }

    function setBalance(val) {
      volumeNodeL.gain.value = 1 - val;
      volumeNodeR.gain.value = 1 + val;
    }