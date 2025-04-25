import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import io from "socket.io-client";
import { MessageCircle, Mic, MicOff, Video, VideoOff, X, Users, Share2 } from "lucide-react";
import ChatRoom from "../components/ChatRoom";
import { motion, AnimatePresence } from "framer-motion";

interface RoomProps {
  roomCode: string;
  userId: string;
  initialMuted?: boolean;
  initialVideoOff?: boolean;
}

const VideoRoom: React.FC<RoomProps> = ({
  roomCode,
  userId,
  initialMuted = false,
  initialVideoOff = false,
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideosRef = useRef<HTMLDivElement>(null);
  const peerRef = useRef<Peer | null>(null);
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [isVideoOff, setIsVideoOff] = useState(initialVideoOff);

  useEffect(() => {
    console.log("useEffect started");
    if (!roomCode) {
      console.error("No room code provided");
      setError("No room code provided. Please join a valid room.");
      return;
    }

    const socket = io("http://localhost:5000", {
      reconnection: false,
      forceNew: true,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log(
        "Socket.IO connected:",
        socket.id,
        "Transport:",
        socket.io.engine.transport.name
      );
    });
    socket.on("connect_error", (error) => {
      console.error("Socket.IO connect error:", error.message);
    });
    socket.on("disconnect", (reason) => {
      console.log("Socket.IO disconnected:", reason);
    });

    const peer = new Peer(undefined as unknown as string, {
      host: "localhost",
      port: 5000,
      path: "/peerjs",
    });
    peerRef.current = peer;

    peer.on("open", (id) => {
      console.log("My peer ID is:", id);
      socket.emit("join-room", roomCode, id);
      console.log("Emitted join-room:", roomCode, id);
    });
    peer.on("error", (err) => console.error("PeerJS error:", err));

    navigator.mediaDevices
      .getUserMedia({ video: !initialVideoOff, audio: !initialMuted })
      .then((stream) => {
        localStreamRef.current = stream;

        stream.getAudioTracks().forEach((track) => {
          track.enabled = !initialMuted;
        });
        stream.getVideoTracks().forEach((track) => {
          track.enabled = !initialVideoOff;
        });

        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

        peer.on("call", (call) => {
          call.answer(stream);
          call.on("stream", (remoteStream) =>
            addRemoteStream(remoteStream, call.peer)
          );
        });

        socket.on("user-connected", (peerId) => {
          console.log("User connected event:", peerId);
          if (peerId !== "chat-only") {
            connectToNewUser(peerId, stream);
          }
        });

        socket.on("user-disconnected", (peerId) => {
          console.log("User disconnected event:", peerId);
          if (peerId !== "chat-only") {
            removeRemoteStream(peerId);
          }
        });
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
        setError(
          "Failed to access camera/microphone. Please check permissions."
        );
      });

    return () => {
      console.log("useEffect cleanup");
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (peerRef.current) peerRef.current.destroy();
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off();
      }
    };
  }, [roomCode, initialMuted, initialVideoOff]);

  const connectToNewUser = (peerId: string, stream: MediaStream) => {
    if (peerRef.current) {
      const call = peerRef.current.call(peerId, stream);
      call.on("stream", (remoteStream) =>
        addRemoteStream(remoteStream, peerId)
      );
    }
  };

  const addRemoteStream = (stream: MediaStream, peerId?: string) => {
    const video = document.createElement("video");
    video.srcObject = stream;
    video.autoplay = true;
    video.className =
      "min-w-[160px] h-[120px] bg-gray-900 rounded-md object-cover border border-gray-800";
    if (peerId) (video as any).peerId = peerId;
    remoteVideosRef.current?.appendChild(video);
  };

  const removeRemoteStream = (peerId: string) => {
    const videos = remoteVideosRef.current?.querySelectorAll("video");
    videos?.forEach((video) => {
      if ((video as any).peerId === peerId) video.remove();
    });
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = isVideoOff;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const toggleChatModal = () => setShowChatModal(!showChatModal);

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
      <header className="flex justify-between items-center px-6 py-4 bg-[#171717] border-b border-gray-800 z-20 shadow-md">
        <motion.h2 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-2xl font-medium"
        >
          Room:{" "}
          <span className="text-emerald-500 font-semibold">{roomCode || "No Room Code"}</span>
        </motion.h2>
        
        <motion.div 
          className="flex items-center space-x-3"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
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
            className={buttonClass(false)}
            aria-label="Share room"
          >
            <Share2 size={20} />
          </motion.button>
        </motion.div>
      </header>
      
      <AnimatePresence>
        <motion.main 
          className={`flex-1 p-6 flex flex-col items-center justify-center overflow-hidden bg-[#171717] transition-all duration-300 ease-in-out ${
            showChatModal ? 'mr-[320px]' : 'mr-0'
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
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-5xl h-full bg-[#1A1A1A] rounded-lg flex items-center justify-center border border-gray-800 shadow-lg overflow-hidden"
            >
              <div className="text-center p-6">
                <h1 className="text-3xl font-bold text-white">
                  <span className="block mb-2">Whiteboard</span>
                  <span className="text-emerald-400">Coming Soon</span>
                </h1>
              </div>
            </motion.div>
          )}
        </motion.main>
      </AnimatePresence>
      
      <footer className={`p-4 bg-[#171717] border-t border-gray-800 z-20 transition-all duration-300 ease-in-out ${
        showChatModal ? 'mr-[320px]' : 'mr-0'
      }`}>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-medium text-white flex items-center">
            <Users size={20} className="mr-2 text-emerald-500" />
            Participants
          </h3>
        </div>
        
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
              className={`w-full h-full object-cover ${isVideoOff ? "hidden" : ""}`}
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
                  You {isMuted && <MicOff size={14} className="ml-1 text-red-500" />}
                </span>
                <div className="flex space-x-1">
                  <span className="px-1.5 py-0.5 text-xs bg-emerald-500/20 text-emerald-400 rounded-sm">
                    Host
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
          
          <div 
            ref={remoteVideosRef} 
            className="flex space-x-4 overflow-x-auto"
          >
          </div>
        </div>
      </footer>
      
      <motion.div 
        className="fixed top-0 right-0 h-full w-[320px] bg-[#1A1A1A] border-l border-gray-800 shadow-xl z-30"
        initial={{ x: "100%" }}
        animate={{ 
          x: showChatModal ? 0 : "100%",
          transition: { 
            type: "spring", 
            stiffness: 300, 
            damping: 30
          }
        }}
      >
        {showChatModal && (
          <ChatRoom
            roomCode={roomCode}
            userId={userId}
            onClose={() => setShowChatModal(false)}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export default VideoRoom;
