/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import './App.css';

function DrumMachine() {
  const drumPads = [
    { id: 'drum-pad-Q', sound: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3', key: 'Q' },
    { id: 'drum-pad-W', sound: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3', key: 'W' },
    { id: 'drum-pad-E', sound: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3', key: 'E' },
    { id: 'drum-pad-A', sound: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3', key: 'A' },
    { id: 'drum-pad-S', sound: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3', key: 'S' },
    { id: 'drum-pad-D', sound: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3', key: 'D' },
    { id: 'drum-pad-Z', sound: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3', key: 'Z' },
    { id: 'drum-pad-X', sound: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3', key: 'X' },
    { id: 'drum-pad-C', sound: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3', key: 'C' },
  ];

  const [displayText, setDisplayText] = React.useState('');
  const audioRefs = useRef({});
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [voiceVolume, setVoiceVolume] = useState(1);

  const handleVoiceCommand = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript.trim().toUpperCase();
    const pad = drumPads.find((p) => p.key === transcript);
    if (pad) {
      const audio = audioRefs.current[pad.key];
      if (audio) {
        audio.currentTime = 0;
        try {
          audio.volume = voiceVolume;
          audio.play();
          setDisplayText(pad.key);
        } catch (err) {
          console.error('Error playing audio:', err);
        }
      }
    }
  };

  useEffect(() => {
    const initializeVoiceRecognition = () => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.addEventListener('result', handleVoiceCommand);
        setRecognition(recognition);
      } else {
        console.error('Speech Recognition API is not available.');
      }
    };

    initializeVoiceRecognition();

    const handleKeyDown = (event) => {
      const key = event.key.toUpperCase();
      const pad = drumPads.find((p) => p.key === key);
      if (pad) {
        const audio = audioRefs.current[pad.key];
        if (audio) {
          audio.currentTime = 0;
          try {
            audio.play();
            setDisplayText(pad.key);
          } catch (err) {
            console.error('Error playing audio:', err);
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [drumPads]);

  const handleClick = (sound, key) => {
    const audio = audioRefs.current[key];
    if (audio) {
      audio.currentTime = 0;
      try {
        audio.play();
        setDisplayText(key);
      } catch (err) {
        console.error('Error playing audio:', err);
      }
    }
  };

  const toggleVoiceControl = () => {
    if (!isListening && recognition) {
      recognition.start();
      setIsListening(true);
    } else if (isListening && recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const handleVolumeChange = (event) => {
    setVoiceVolume(event.target.value);
  };

  return (
    <div id="drum-machine">
      <h1 id="title">Drum Machine</h1>
      <div id="display">{displayText}</div>
      {drumPads.map((pad) => (
        <button
          type="button"
          key={pad.id}
          className="drum-pad"
          id={pad.id}
          onClick={() => handleClick(pad.sound, pad.key)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              handleClick(pad.sound, pad.key);
            }
          }}
          tabIndex={0}
        >
          <audio
            className="clip"
            id={pad.key}
            ref={(ref) => {
              audioRefs.current[pad.key] = ref;
            }}
            src={pad.sound}
          >
            <track kind="captions" />
          </audio>
          {pad.key}
        </button>
      ))}
      <div className="voice-control-container">
        <button type="button" className="voice-control-btn" onClick={toggleVoiceControl}>
          {isListening ? 'Stop Voice Control' : 'Start Voice Control'}
        </button>
        <div className="volume-container">
          <label>
            Volume:
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={voiceVolume}
              onChange={handleVolumeChange}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
export default DrumMachine;
