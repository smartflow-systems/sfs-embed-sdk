/**
 * SFS Embed SDK - Video Call Widget
 * WebRTC-powered video calls with screen sharing and recording
 * Styled with SFS Family Theme (Gold on Dark Marble)
 */

import { useState, useRef, useEffect } from 'react';

export interface VideoCallConfig {
  callId: string;
  workspaceId: string;
  signalingUrl?: string;
  enableScreenShare?: boolean;
  enableRecording?: boolean;
  enableBackgroundBlur?: boolean;
  maxDuration?: number; // minutes
}

interface VideoCallWidgetProps {
  config: VideoCallConfig;
  apiKey?: string;
  onClose?: () => void;
}

export function VideoCallWidget({ config, apiKey, onClose }: VideoCallWidgetProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const durationInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      endCall();
    };
  }, []);

  const startCall = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      localStream.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Create peer connection
      peerConnection.current = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
      });

      // Add local stream to peer connection
      stream.getTracks().forEach((track) => {
        peerConnection.current!.addTrack(track, stream);
      });

      // Handle remote stream
      peerConnection.current.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      setIsCallActive(true);
      startDurationTimer();

      // Emit call started event
      window.postMessage(
        {
          type: 'sfs_video_call_started',
          callId: config.callId,
          timestamp: new Date().toISOString(),
        },
        '*'
      );
    } catch (err) {
      console.error('Failed to start call:', err);
      setError('Could not access camera/microphone. Please check permissions.');
    }
  };

  const endCall = () => {
    // Stop all tracks
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
    }

    // Close peer connection
    if (peerConnection.current) {
      peerConnection.current.close();
    }

    // Stop recording
    if (isRecording) {
      stopRecording();
    }

    // Clear duration timer
    if (durationInterval.current) {
      clearInterval(durationInterval.current);
    }

    setIsCallActive(false);
    setIsConnected(false);

    // Emit call ended event
    window.postMessage(
      {
        type: 'sfs_video_call_ended',
        callId: config.callId,
        duration: callDuration,
        timestamp: new Date().toISOString(),
      },
      '*'
    );
  };

  const toggleMute = () => {
    if (localStream.current) {
      const audioTrack = localStream.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream.current) {
      const videoTrack = localStream.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      // Stop screen share
      if (localStream.current) {
        const videoTrack = localStream.current.getVideoTracks()[0];
        videoTrack.stop();

        // Get camera back
        const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
        const newVideoTrack = newStream.getVideoTracks()[0];

        // Replace track
        const sender = peerConnection.current!
          .getSenders()
          .find((s) => s.track?.kind === 'video');
        if (sender) {
          sender.replaceTrack(newVideoTrack);
        }

        localStream.current.removeTrack(videoTrack);
        localStream.current.addTrack(newVideoTrack);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream.current;
        }
      }
      setIsScreenSharing(false);
    } else {
      // Start screen share
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: { cursor: 'always' },
          audio: false,
        });

        const screenTrack = screenStream.getVideoTracks()[0];

        // Replace video track
        const sender = peerConnection.current!
          .getSenders()
          .find((s) => s.track?.kind === 'video');
        if (sender) {
          sender.replaceTrack(screenTrack);
        }

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }

        screenTrack.onended = () => {
          toggleScreenShare(); // Auto-stop when user stops sharing
        };

        setIsScreenSharing(true);
      } catch (err) {
        console.error('Screen share error:', err);
      }
    }
  };

  const startRecording = () => {
    if (localStream.current) {
      const options = { mimeType: 'video/webm;codecs=vp9' };
      mediaRecorder.current = new MediaRecorder(localStream.current, options);

      const chunks: Blob[] = [];
      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);

        // Download recording
        const a = document.createElement('a');
        a.href = url;
        a.download = `call-${config.callId}-${Date.now()}.webm`;
        a.click();
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const startDurationTimer = () => {
    durationInterval.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass-card-strong" style={{ maxWidth: '900px', width: '100%' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gold">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-gold pulse-gold" />
          <h3 className="text-xl font-semibold text-beige">Video Call</h3>
          {isCallActive && (
            <span className="badge-gold">
              {formatDuration(callDuration)}
            </span>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-muted hover:text-beige transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Video Area */}
      <div className="relative bg-marble" style={{ aspectRatio: '16/9' }}>
        {/* Remote Video (Full Screen) */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Local Video (Picture-in-Picture) */}
        <div className="absolute bottom-4 right-4 w-48 h-36 rounded-lg overflow-hidden border-2 border-gold shadow-gold">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover mirror"
          />
          {isVideoOff && (
            <div className="absolute inset-0 bg-brown flex items-center justify-center">
              <svg className="w-12 h-12 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          )}
        </div>

        {/* Status Indicators */}
        {isScreenSharing && (
          <div className="absolute top-4 left-4 badge-gold">
            📺 Sharing Screen
          </div>
        )}
        {isRecording && (
          <div className="absolute top-4 right-4 badge-gold animate-pulse">
            🔴 Recording
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-6 border-t border-subtle">
        {!isCallActive ? (
          <div className="text-center">
            {error && (
              <div className="mb-4 p-3 bg-error/20 border border-error rounded-lg text-error-foreground text-sm">
                {error}
              </div>
            )}
            <button onClick={startCall} className="btn-gold px-8 py-3">
              <svg className="w-5 h-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Start Video Call
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3">
            {/* Mute */}
            <button
              onClick={toggleMute}
              className={`p-4 rounded-full transition-all ${
                isMuted ? 'bg-error hover:bg-error/80' : 'bg-card hover:bg-gold/20 border border-gold'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
            </button>

            {/* Video */}
            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full transition-all ${
                isVideoOff ? 'bg-error hover:bg-error/80' : 'bg-card hover:bg-gold/20 border border-gold'
              }`}
              title={isVideoOff ? 'Turn On Video' : 'Turn Off Video'}
            >
              {isVideoOff ? (
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>

            {/* Screen Share */}
            {config.enableScreenShare && (
              <button
                onClick={toggleScreenShare}
                className={`p-4 rounded-full transition-all ${
                  isScreenSharing ? 'bg-gold hover:bg-gold-light' : 'bg-card hover:bg-gold/20 border border-gold'
                }`}
                title={isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
              >
                <svg className={`w-6 h-6 ${isScreenSharing ? 'text-black' : 'text-gold'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
            )}

            {/* Recording */}
            {config.enableRecording && (
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-4 rounded-full transition-all ${
                  isRecording ? 'bg-error hover:bg-error/80' : 'bg-card hover:bg-gold/20 border border-gold'
                }`}
                title={isRecording ? 'Stop Recording' : 'Start Recording'}
              >
                <svg className={`w-6 h-6 ${isRecording ? 'text-white' : 'text-gold'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            )}

            {/* End Call */}
            <button
              onClick={endCall}
              className="p-4 rounded-full bg-error hover:bg-error/80 transition-all ml-4"
              title="End Call"
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <style>{`
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>
    </div>
  );
}
