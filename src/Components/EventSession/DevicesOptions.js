import React, { useContext, useState, useEffect } from "react";
import { useAudio, useMediaDevices, useMountedState, usePrevious } from "react-use";
import testSound from "../../Sounds/testSound.mp3";
import { makeStyles, Box, Select, MenuItem, Button } from "@material-ui/core";
import MicIcon from "@material-ui/icons/Mic";
import VideocamIcon from "@material-ui/icons/Videocam";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import { getObjectFromId } from "../../Utils";
import TechnicalCheckContext from "../../Contexts/TechnicalCheckContext";
import JitsiContext from "../../Contexts/JitsiContext";

const useStyles = makeStyles((theme) => ({
  dropIcon: {
    marginRight: theme.spacing(2),
  }
}));

const BrowserDevicesDropdown = ({ id, inputs, handleChange, selectedInput, renderIconProp, showTestAudio=false }) => {
  const classes = useStyles();
 
  
  const [audio, state, controls, ref] = useAudio({ // eslint-disable-line no-unused-vars
    src: testSound,
    autoPlay: false,
  });

  if (!inputs || inputs.length < 1) {
    return (
      <>
        {audio}
      </>
    );
  }

  const onChange = (event) => {
    if (showTestAudio && ref.current && ref.current.setSinkId) {
      ref.current.setSinkId(event.target.value);
    }
    handleChange(event);
  }

  return (
    <Box
      marginTop={2}
      paddingLeft={2}
      paddingRight={2}
      width={"100%"}
      display="flex"
      flexDirection="column"
      alignItems="flex-end"
    >
      <Box 
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-around"
        width={"100%"}
      >
        
        {renderIconProp({ className: classes.dropIcon })}

        <Select
          fullWidth
          id={id}
          value={selectedInput ? selectedInput.deviceId : inputs[0].deviceId}
          onChange={onChange}
        >
          {
            inputs.map((input) => {
              return (
                <MenuItem key={input.deviceId} value={input.deviceId}>{input.label}</MenuItem>
              )
            })
          }
        </Select>
      </Box>
      {audio}
      {
        showTestAudio && (
        <>
          <Button
            color="primary"
            size="small"
            onClick={() => {
              controls.play()
            }}>
            Play test Sound
          </Button>
        </>
        )
      }

    </Box>
    
  )
}

const DevicesOptions = ({ showModal }) => {
  const mediaDevices = useMediaDevices();

  const audioInputs = mediaDevices.devices ? mediaDevices.devices.filter(device => device.kind === "audioinput") : [];
  const videoInputs = mediaDevices.devices ? mediaDevices.devices.filter(device => device.kind === "videoinput") : [];
  const audioOutputs = mediaDevices.devices ? mediaDevices.devices.filter(device => device.kind === "audiooutput") : [];

  const [calledTimes, setCalledTimes] = useState(0);

  const { jitsiApi } = useContext(JitsiContext);

  const isMounted = useMountedState();

  const previousShowModal = usePrevious(showModal);

  const {
    selectedAudioInput,
    setSelectedAudioInput,
    selectedVideoInput,
    setSelectedVideoInput,
    selectedAudioOutput,
    setSelectedAudioOutput,
  } = useContext(TechnicalCheckContext);

  const handleChangeAudioDevice = (event) => {
    const device = getObjectFromId(event.target.value, audioInputs);
    setSelectedAudioInput(device);
  }

  const handleChangeVideoDevice = (event) => {
    const device = getObjectFromId(event.target.value, videoInputs)
    setSelectedVideoInput(device);
  }

  const handleChangeAudioOutputDevice = (event) => {
    const device = getObjectFromId(event.target.value, audioOutputs)
    setSelectedAudioOutput(device);
  }

  // As jitsi does not have a device change listener, so this serves as a workaround
  // This ensures selected device is changed in our context  
  useEffect(() => {
    const setCorrectDevices = async () => {
      if (
        jitsiApi && 
        showModal &&
        isMounted  &&
        calledTimes < 1 &&
        audioInputs &&
        audioOutputs &&
        videoInputs
      ) {
        const devices = await jitsiApi.getCurrentDevices();
        
        const jitsiSelectedAudioInput = devices.audioInput;
        const jitsiSelectedVideoInput = devices.videoInput;
        const jitsiSelectedAudioOutput = devices.audioOutput;

        if (!selectedAudioInput || selectedAudioInput.label !== jitsiSelectedAudioInput.label) {
          const correctSelectedAudioInput = audioInputs.filter(input => input.label === jitsiSelectedAudioInput.label);
          setSelectedAudioInput(correctSelectedAudioInput[0]);
        }

        if (!selectedVideoInput || selectedVideoInput.label !== jitsiSelectedVideoInput.label) {
          const correctSelectedVideoInput = videoInputs.filter(input => input.label === jitsiSelectedVideoInput.label);
          setSelectedVideoInput(correctSelectedVideoInput[0]);
        }

        if (!selectedAudioOutput || selectedAudioOutput.label !== jitsiSelectedAudioOutput.label) {
          const correctSelectedAudioOutput = audioOutputs.filter(input => input.label === jitsiSelectedAudioOutput.label);
          setSelectedAudioOutput(correctSelectedAudioOutput[0]);
        }
        setCalledTimes(time => time + 1);
      }  
    }
    setCorrectDevices();
  }, [
    showModal,
    jitsiApi,
    selectedAudioInput,
    selectedVideoInput,
    selectedAudioOutput,
    audioInputs,
    setSelectedAudioInput,
    setSelectedVideoInput,
    setSelectedAudioOutput,
    videoInputs,
    audioOutputs,
    isMounted,
    calledTimes
  ]);


  useEffect(() => {
    if (previousShowModal && showModal !== previousShowModal) {
      setCalledTimes(0);
    }
  }, [showModal, previousShowModal])

  return (
    <>
      <BrowserDevicesDropdown
        id="audio-in-device-select"
        inputs={audioInputs}
        selectedInput={selectedAudioInput}
        handleChange={handleChangeAudioDevice}
        renderIconProp={({ ...props }) => <MicIcon {...props} />}
      />

      <BrowserDevicesDropdown
        id="video-device-select"
        inputs={videoInputs}
        selectedInput={selectedVideoInput}
        handleChange={handleChangeVideoDevice}
        renderIconProp={({ ...props }) => <VideocamIcon {...props} />}
      />
     
      <BrowserDevicesDropdown
        id="audio-out-device-select"
        inputs={audioOutputs}
        selectedInput={selectedAudioOutput}
        handleChange={handleChangeAudioOutputDevice}
        showTestAudio={true}
        renderIconProp={({ ...props }) => <VolumeUpIcon {...props} />}
      />
     
    </>
  )
}

export default DevicesOptions;
