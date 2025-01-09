import React, { useState, useEffect } from "react";
import PitchFinder from "pitchfinder";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Slider,
} from "@mui/material";

const TunerViewWithPitchJs = () => {
  const [note, setNote] = useState(null);
  const [detectedFrequency, setDetectedFrequency] = useState(null);
  const [isTuning, setIsTuning] = useState(false);
  const [tuningOffset, setTuningOffset] = useState(0);

  useEffect(() => {
    let audioContext;
    let analyserNode;
    let mediaStream;
    let intervalId;

    const startTuning = async () => {
      try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const sourceNode = audioContext.createMediaStreamSource(mediaStream);

        analyserNode = audioContext.createAnalyser();
        sourceNode.connect(analyserNode);

        analyserNode.fftSize = 2048; // Higher FFT size for precision
        const bufferLength = analyserNode.fftSize;
        const buffer = new Float32Array(bufferLength);

        const detectPitch = PitchFinder.AMDF({ sampleRate: audioContext.sampleRate });

        intervalId = setInterval(() => {
          analyserNode.getFloatTimeDomainData(buffer);
          const frequency = detectPitch(buffer);
          if (frequency) {
            setDetectedFrequency(frequency);
            const { note, offset } = getClosestNoteAndOffset(frequency);
            setNote(note);
            setTuningOffset(offset);
          }
        }, 100);
      } catch (err) {
        console.error("Error accessing microphone:", err);
      }
    };

    const stopTuning = () => {
      if (intervalId) clearInterval(intervalId);
      if (mediaStream) mediaStream.getTracks().forEach(track => track.stop());
      if (audioContext) audioContext.close();
    };

    if (isTuning) {
      startTuning();
    }

    return () => {
      stopTuning();
    };
  }, [isTuning]);

  const getClosestNoteAndOffset = (frequency) => {
    const notes = [
      { note: "E", frequency: 82.41 },
      { note: "A", frequency: 110.00 },
      { note: "D", frequency: 146.83 },
      { note: "G", frequency: 196.00 },
      { note: "B", frequency: 246.94 },
      { note: "E", frequency: 329.63 },
    ];

    const closest = notes.reduce((prev, curr) =>
      Math.abs(curr.frequency - frequency) < Math.abs(prev.frequency - frequency) ? curr : prev
    );

    const offset = frequency - closest.frequency;
    return { note: closest.note, offset };
  };

  return (
    <Box
      sx={{
        textAlign: "center",
        padding: 4,
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Guitar Tuner
      </Typography>
      <Box
        sx={{
          position: "relative",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, #ffffff, #e3e3e3)",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 4,
        }}
      >
        <Typography variant="h1" color="primary" sx={{ fontSize: 64 }}>
          {note || "--"}
        </Typography>
        {isTuning && (
          <Box
            sx={{
              position: "absolute",
              width: "90%",
              height: "90%",
              borderRadius: "50%",
              border: "10px solid",
              borderColor: `rgba(${Math.min(255, 255 - Math.abs(tuningOffset * 10))}, ${Math.min(
                255,
                Math.abs(tuningOffset * 10)
              )}, ${Math.max(0, 255 - Math.abs(tuningOffset * 20))}, 1)`,
              transform: `rotate(${tuningOffset * 3}deg)`,
              transition: "border-color 0.1s, transform 0.1s",
            }}
          />
        )}
      </Box>
      <Typography variant="h6">
        Detected Frequency: {detectedFrequency ? detectedFrequency.toFixed(2) + " Hz" : "--"}
      </Typography>
      <Box sx={{ width: "80%", marginY: 3 }}>
        <Slider
          value={tuningOffset}
          min={-50}
          max={50}
          disabled
          marks={[
            { value: -50, label: "Flat" },
            { value: 0, label: "In Tune" },
            { value: 50, label: "Sharp" },
          ]}
          sx={{
            "& .MuiSlider-thumb": { display: "none" },
            "& .MuiSlider-track": {
              backgroundColor: tuningOffset === 0 ? "green" : "red",
            },
          }}
        />
      </Box>
      <Button
        variant="contained"
        onClick={() => setIsTuning(!isTuning)}
        sx={{ marginTop: 3 }}
      >
        {isTuning ? "Stop Tuning" : "Start Tuning"}
      </Button>
    </Box>
  );
}

export default TunerViewWithPitchJs;