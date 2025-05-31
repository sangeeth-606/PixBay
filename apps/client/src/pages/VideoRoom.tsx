import React, { useEffect, useRef, useState } from "react";
import Peer, { MediaConnection } from "peerjs";
import io from "socket.io-client";
import {
  MessageCircle,
  Mic,
  MicOff,
  Video,
  VideoOff,
  X,
  Users,
  Share2,
  PhoneOff,
} from "lucide-react";
import ChatRoom from "../components/ChatRoom";
import WhiteBoard from "../components/WhiteBoard";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getApiUrl } from "../utils/api";

// Update generateSafePeerId to include timestamp
const generateSafePeerId = (roomCode: string, userId: string): string => {
  const safeUserId = userId.replace(/[^a-zA-Z0-9]/g, '');
  const safeRoomCode = roomCode.replace(/[^a-zA-Z0-9]/g, '');
  const timestamp = Date.now().toString(36);
  return `${safeRoomCode}-${safeUserId}-${timestamp}`;
};

interface RoomProps {
  roomCode: string;
  userId: string;
  initialMuted?: boolean;
  initialVideoOff?: boolean;
  darkMode: boolean;
}

const VideoRoom: React.FC<RoomProps> = ({
  roomCode,
  userId,
  darkMode,
  initialMuted = false,
  initialVideoOff = false,
}) => {
  const navigate = useNavigate();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideosRef = useRef<HTMLDivElement>(null);
  const peerRef = useRef<Peer | null>(null);
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const myPeerIdRef = useRef<string>("");
  const addedPeerIdsRef = useRef<Set<string>>(new Set());
  const peerConnectionsRef = useRef<Record<string, boolean>>({});
  const peerCallsRef = useRef<Record<string, MediaConnection>>({});
  const [myPeerId, setMyPeerId] = useState<string>("");
  const [showChatModal, setShowChatModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [isVideoOff, setIsVideoOff] = useState(initialVideoOff);

  useEffect(() => {
    if (!roomCode || !userId) {
      setError("Missing room code or user ID");
      return;
    }

    const socket = io(getApiUrl(), {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket', 'polling'],
      upgrade: true,
      rememberUpgrade: true,
      timeout: 20000,
      query: { roomCode, userId },
      forceNew: true,
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      // Try to fallback to polling if WebSocket fails
      if (error.message?.includes('websocket')) {
        socket.io.opts.transports = ['polling'];
      }
    });

    socket.io.on("error", (error) => {
      console.error('Socket.IO error:', error);
    });

    socket.io.on("reconnect_attempt", (attempt) => {
      console.log(`Reconnection attempt ${attempt}`);
    });

    socketRef.current = socket;

    // Generate a safe peer ID with timestamp to ensure uniqueness
    const safePeerId = generateSafePeerId(roomCode, userId);
    console.log("Generated safe peer ID:", safePeerId);

    // Create peer with enhanced configuration
    const peer = new Peer(safePeerId, {
      host: new URL(getApiUrl()).hostname,
      port: import.meta.env.VITE_PRODUCTION === "true" ? 443 : 5000,
      path: "/peerjs",
      secure: import.meta.env.VITE_PRODUCTION === "true",
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:global.stun.twilio.com:3478" },
        ],
        sdpSemantics: "unified-plan",
        iceTransportPolicy: "all",
      },
      debug: 3,
      pingInterval: 5000,
    });

    // Improved peer error handling
    let peerConnectionAttempts = 0;
    const maxPeerConnectionAttempts = 3;

    const handlePeerError = (err: Error) => {
      console.error("PeerJS error:", err);
      if (peerConnectionAttempts < maxPeerConnectionAttempts && !peer.destroyed) {
        peerConnectionAttempts++;
        console.log(`Retrying peer connection, attempt ${peerConnectionAttempts}`);
        setTimeout(() => {
          if (peer.disconnected && !peer.destroyed) {
            peer.reconnect();
          }
        }, 2000);
      } else {
        console.error("Max peer connection attempts reached");
        setError("Failed to establish peer connection. Please refresh the page.");
      }
    };

    peer.on("error", handlePeerError);

    peer.on("open", (id) => {
      console.log("PeerJS connected with ID:", id);
      myPeerIdRef.current = id;
      setMyPeerId(id);
      peerConnectionAttempts = 0; // Reset attempts on successful connection
      socket.emit("join-room", roomCode, id);
    });

    peerRef.current = peer;

    const initializeMediaStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: !initialVideoOff,
          audio: !initialMuted,
        });

        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        peer.on("call", handleIncomingCall);

        socket.on("user-connected", (peerId) => {
          console.log("User connected event:", peerId);
          if (peerId !== myPeerIdRef.current) {
            let attempts = 0;
            const tryConnection = () => {
              if (attempts < 3) {
                try {
                  connectToNewUser(peerId, stream);
                } catch (err) {
                  console.error(`Connection attempt ${attempts + 1} failed:`, err);
                  attempts++;
                  setTimeout(tryConnection, 1000);
                }
              }
            };
            tryConnection();
          }
        });
      } catch (error) {
        console.error("Media access error:", error);
        setError("Failed to access camera/microphone. Please check permissions.");
      }
    };

    const handleIncomingCall = (call: MediaConnection) => {
      console.log("Receiving call from:", call.peer);

      peerCallsRef.current[call.peer] = call;

      if (localStreamRef.current) {
        call.answer(localStreamRef.current);
      }

      call.on("stream", (remoteStream: MediaStream) => {
        console.log("Got stream from:", call.peer);
        requestAnimationFrame(() => addRemoteStream(remoteStream, call.peer));
      });

      call.on("close", () => removeRemoteStream(call.peer));
    };

    initializeMediaStream();

    return () => {
      // Improved cleanup
      if (peerRef.current) {
        try {
          Object.values(peerCallsRef.current).forEach(call => {
            try {
              call.close();
            } catch (err) {
              console.error("Error closing call:", err);
            }
          });
          peerCallsRef.current = {};

          if (!peerRef.current.destroyed) {
            peerRef.current.destroy();
          }
        } catch (err) {
          console.error("Error during peer cleanup:", err);
        }
      }

      if (socketRef.current?.connected) {
        socketRef.current.disconnect();
      }

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [roomCode, userId, initialMuted, initialVideoOff]);

  const connectToNewUser = (peerId: string, stream: MediaStream) => {
    if (!peerRef.current || peerId === myPeerIdRef.current) return;

    console.log("Calling peer:", peerId);

    try {
      const call = peerRef.current.call(peerId, stream);
      peerCallsRef.current[peerId] = call;

      call.on("stream", (userVideoStream) => {
        console.log("Got stream from call to:", peerId);
        requestAnimationFrame(() => addRemoteStream(userVideoStream, peerId));
      });

      call.on("error", (err) => {
        console.error("Call error:", err);
        delete peerCallsRef.current[peerId];
        removeRemoteStream(peerId);
      });

      call.on("close", () => {
        delete peerCallsRef.current[peerId];
        removeRemoteStream(peerId);
      });
    } catch (err) {
      console.error("Error calling peer:", err);
    }
  };

  const addRemoteStream = (
    stream: MediaStream,
    peerId?: string,
    isIncoming: boolean = true
  ) => {
    console.log(
      `Adding remote stream from: ${peerId} (${isIncoming ? "incoming" : "outgoing"}) My peer ID: ${myPeerIdRef.current}`
    );

    if (peerId && peerId === myPeerIdRef.current) {
      console.log("Ignoring own stream in remote videos");
      return;
    }

    if (peerId && addedPeerIdsRef.current.has(peerId)) {
      console.log("Already added this peer's stream, skipping:", peerId);
      return;
    }

    if (peerId) {
      addedPeerIdsRef.current.add(peerId);
      console.log("Added peer to tracking set:", peerId);
      console.log("Current tracked peers:", [...addedPeerIdsRef.current]);
    }

    if (peerId) {
      clearPeerElements(peerId);
    }

    const video = document.createElement("video");
    video.srcObject = stream;
    video.autoplay = true;
    video.className =
      "min-w-[160px] h-[165px] bg-gray-900 rounded-lg object-cover border border-gray-800";
    if (peerId) (video as any).peerId = peerId;

    const wrapper = document.createElement("div");
    wrapper.className =
      "min-w-[220px] h-[165px] bg-[#1A1A1A] rounded-lg relative overflow-hidden border border-gray-800 shadow-lg";
    if (peerId) (wrapper as any).peerId = peerId;
    wrapper.appendChild(video);

    const label = document.createElement("div");
    label.className =
      "absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/80 to-transparent";
    label.innerHTML = `<span class="text-sm text-white font-medium">Remote User (${peerId?.substring(
      0,
      6
    )})</span>`;
    wrapper.appendChild(label);

    remoteVideosRef.current?.appendChild(wrapper);
  };

  const clearPeerElements = (peerId: string) => {
    if (!remoteVideosRef.current) return;

    const elementsToRemove = [];
    const children = remoteVideosRef.current.children;

    for (let i = 0; i < children.length; i++) {
      const child = children[i] as any;
      if (child.peerId === peerId) {
        elementsToRemove.push(child);
      }
    }

    elementsToRemove.forEach((el) => el.remove());

    if (elementsToRemove.length > 0) {
      console.log(
        `Cleared ${elementsToRemove.length} existing elements for peer: ${peerId}`
      );
    }
  };

  const removeRemoteStream = (peerId: string) => {
    if (addedPeerIdsRef.current.has(peerId)) {
      addedPeerIdsRef.current.delete(peerId);
      console.log("Removed peer from tracking set:", peerId);
      console.log("Remaining tracked peers:", [...addedPeerIdsRef.current]);
    }

    clearPeerElements(peerId);
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      const newMutedState = !isMuted;
      audioTracks.forEach((track) => {
        track.enabled = !newMutedState;
      });
      setIsMuted(newMutedState);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      const newVideoOffState = !isVideoOff;
      videoTracks.forEach((track) => {
        track.enabled = !newVideoOffState;
      });
      setIsVideoOff(newVideoOffState);
    }
  };

  const toggleChatModal = () => {
    setShowChatModal(!showChatModal);

    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 300);
  };

  const buttonClass = (isActive: boolean) => `
    flex items-center justify-center rounded-md w-10 h-10 transition-all
    ${isActive
      ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/40"
      : "bg-[#1F1F1F] text-gray-300 border-[#2C2C2C] hover:bg-[#2C2C2C]"
    }
    border shadow-sm hover:shadow-md active:scale-95 duration-150
  `;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-screen bg-[#171717] text-white font-sans relative overflow-hidden"
    >
      <AnimatePresence>
        <motion.main
          className={`flex-1 p-6 flex flex-col items-center justify-center overflow-hidden bg-[#171717] transition-all duration-300 ease-in-out ${showChatModal ? "mr-[320px]" : "mr-0"
            }`}
          layout
        >
          {error ? (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 p-6 rounded-lg bg-red-500/10 border border-red-500/30 shadow-lg"
            >
              <h3 className="text-xl font-medium mb-2">Error</h3>
              <p>{error}</p>
            </motion.div>
          ) : (
            <div className="w-full h-full">
              <WhiteBoard roomCode={roomCode} userId={userId} />
            </div>
          )}
        </motion.main>
      </AnimatePresence>

      <footer
        className={`p-4 bg-[#171717] border-t border-gray-800 z-20 transition-all duration-300 ease-in-out ${showChatModal ? "mr-[320px]" : "mr-0"
          }`}
      >
        <div className="flex space-x-4 overflow-x-auto py-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-w-[220px] h-[165px] bg-[#1A1A1A] rounded-lg relative overflow-hidden border border-gray-800 shadow-lg"
          >
            <video
              ref={localVideoRef}
              autoPlay
              muted
              className={`w-full h-full object-cover ${isVideoOff ? "hidden" : ""
                }`}
            />
            {isVideoOff && (
              <div className="w-full h-full flex flex-col items-center justify-center bg-[#1F1F1F]">
                <VideoOff size={40} className="text-gray-500 mb-2" />
                <span className="text-sm text-gray-400">Camera Off</span>
              </div>
            )}
            <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center justify-between">
                <span className="text-sm text-emerald-400 font-medium flex items-center">
                  You{" "}
                  {isMuted && (
                    <MicOff size={14} className="ml-1 text-red-500" />
                  )}
                </span>
                <div className="flex space-x-1"></div>
              </div>
            </div>
          </motion.div>

          <div
            ref={remoteVideosRef}
            className="flex space-x-4 overflow-x-auto"
          ></div>
        </div>
      </footer>

      <motion.div
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-3 z-40"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleMute}
          className={buttonClass(isMuted)}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleVideo}
          className={buttonClass(isVideoOff)}
          aria-label={isVideoOff ? "Turn on camera" : "Turn off camera"}
        >
          {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleChatModal}
          className={buttonClass(showChatModal)}
          aria-label="Toggle chat"
        >
          <MessageCircle size={20} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="flex items-center justify-center rounded-md w-10 h-10 bg-red-500/20 text-red-500 border border-red-500/40 hover:bg-red-500/30 transition-all"
          aria-label="End call"
        >
          <PhoneOff size={20} />
        </motion.button>
      </motion.div>

      <motion.div
        className={`fixed top-0 right-0 h-full w-[320px] bg-[#1A1A1A] border-l border-gray-800 shadow-xl z-30 ${darkMode ? "dark" : ""
          }`}
        initial={{ x: "100%" }}
        animate={{
          x: showChatModal ? 0 : "100%",
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
          },
        }}
      >
        {showChatModal && (
          <ChatRoom
            roomCode={roomCode}
            userId={userId}
            onClose={() => setShowChatModal(false)}
            darkMode={true}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export default VideoRoom;