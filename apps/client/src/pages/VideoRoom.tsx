// import React, { useEffect, useRef, useState } from "react";
// import Peer from "peerjs";
// import io from "socket.io-client";
// import {
//   MessageCircle,
//   Mic,
//   MicOff,
//   Video,
//   VideoOff,
//   X,
//   Users,
//   Share2,
// } from "lucide-react";
// import ChatRoom from "../components/ChatRoom";
// import WhiteBoard from "../components/WhiteBoard";
// import { motion, AnimatePresence } from "framer-motion";
// // import Excalidraww from "../components/Excalidraww";

// interface RoomProps {
//   roomCode: string;
//   userId: string;
//   initialMuted?: boolean;
//   initialVideoOff?: boolean;
// }

// const VideoRoom: React.FC<RoomProps> = ({
//   roomCode,
//   userId,
//   initialMuted = false,
//   initialVideoOff = false,
// }) => {
//   const localVideoRef = useRef<HTMLVideoElement>(null);
//   const remoteVideosRef = useRef<HTMLDivElement>(null);
//   const peerRef = useRef<Peer | null>(null);
//   const socketRef = useRef<ReturnType<typeof io> | null>(null);
//   const localStreamRef = useRef<MediaStream | null>(null);
//   const myPeerIdRef = useRef<string>(""); // Use ref instead of state for immediate access
//   const addedPeerIdsRef = useRef<Set<string>>(new Set()); // Track added peer IDs
//   const peerConnectionsRef = useRef<Record<string, boolean>>({}); // Track active peer connections
//   const [myPeerId, setMyPeerId] = useState<string>(""); // Keep state for re-renders if needed
//   const [showChatModal, setShowChatModal] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [isMuted, setIsMuted] = useState(initialMuted);
//   const [isVideoOff, setIsVideoOff] = useState(initialVideoOff);

//   useEffect(() => {
//     console.log("useEffect started");
//     if (!roomCode) {
//       console.error("No room code provided");
//       setError("No room code provided. Please join a valid room.");
//       return;
//     }

//     // Reset tracking collections
//     addedPeerIdsRef.current = new Set();
//     peerConnectionsRef.current = {};

//     const socket = io("http://localhost:5000", {
//       reconnection: false,
//       forceNew: true,
//     });
//     socketRef.current = socket;

//     socket.on("connect", () => {
//       console.log(
//         "Socket.IO connected:",
//         socket.id,
//         "Transport:",
//         socket.io.engine.transport.name
//       );
//     });
//     socket.on("connect_error", (error) => {
//       console.error("Socket.IO connect error:", error.message);
//     });
//     socket.on("disconnect", (reason) => {
//       console.log("Socket.IO disconnected:", reason);
//     });

//     const peer = new Peer(undefined as unknown as string, {
//       host: "localhost",
//       port: 5000,
//       path: "/peerjs",
//     });
//     peerRef.current = peer;

//     peer.on("open", (id) => {
//       console.log("My peer ID is:", id);
//       myPeerIdRef.current = id; // Store in ref for immediate access
//       setMyPeerId(id); // Also store in state for UI updates if needed
//       socket.emit("join-room", roomCode, id);
//       console.log("Emitted join-room:", roomCode, id);
//     });
//     peer.on("error", (err) => console.error("PeerJS error:", err));

//     navigator.mediaDevices
//       .getUserMedia({ video: !initialVideoOff, audio: !initialMuted })
//       .then((stream) => {
//         localStreamRef.current = stream;

//         stream.getAudioTracks().forEach((track) => {
//           track.enabled = !initialMuted;
//         });
//         stream.getVideoTracks().forEach((track) => {
//           track.enabled = !initialVideoOff;
//         });

//         if (localVideoRef.current) localVideoRef.current.srcObject = stream;

//         peer.on("call", (call) => {
//           console.log("Received call from:", call.peer);
//           // If we already have a connection to this peer, don't add another stream
//           if (peerConnectionsRef.current[call.peer]) {
//             console.log("Already have connection to this peer, ignoring call");
//             call.answer(stream); // Still answer but don't add the stream again
//           } else {
//             peerConnectionsRef.current[call.peer] = true;
//             console.log("Answering call and adding remote stream");
//             call.answer(stream);
//             call.on("stream", (remoteStream) => {
//               console.log("Got stream from call");
//               addRemoteStream(remoteStream, call.peer, true);
//             });
//           }
//         });

//         socket.on("user-connected", (peerId) => {
//           console.log("User connected event:", peerId);
//           if (peerId !== "chat-only" && peerId !== myPeerIdRef.current) {
//             if (!peerConnectionsRef.current[peerId]) {
//               console.log("Initiating new connection to user:", peerId);
//               connectToNewUser(peerId, stream);
//             } else {
//               console.log("Already connected to this user:", peerId);
//             }
//           } else {
//             console.log("Skipping connection to self or chat-only");
//           }
//         });

//         socket.on("user-disconnected", (peerId) => {
//           console.log("User disconnected event:", peerId);
//           if (peerId !== "chat-only") {
//             removeRemoteStream(peerId);
//             // Also clean up our connection tracking
//             if (peerConnectionsRef.current[peerId]) {
//               delete peerConnectionsRef.current[peerId];
//               console.log("Removed peer connection tracking for:", peerId);
//             }
//           }
//         });
//       })
//       .catch((error) => {
//         console.error("Error accessing media devices:", error);
//         setError(
//           "Failed to access camera/microphone. Please check permissions."
//         );
//       });

//     return () => {
//       console.log("useEffect cleanup");
//       if (localStreamRef.current) {
//         localStreamRef.current.getTracks().forEach((track) => track.stop());
//       }
//       if (peerRef.current) peerRef.current.destroy();
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//         socketRef.current.off();
//       }
//       // Clear the set of added peer IDs
//       addedPeerIdsRef.current.clear();
//       peerConnectionsRef.current = {};
//     };
//   }, [roomCode, initialMuted, initialVideoOff]);

//   const connectToNewUser = (peerId: string, stream: MediaStream) => {
//     // Don't connect to yourself
//     if (peerId === myPeerIdRef.current) {
//       console.log("Avoiding self-connection");
//       return;
//     }

//     // Avoid duplicate connections
//     if (peerConnectionsRef.current[peerId]) {
//       console.log("Already connected to peer, skipping:", peerId);
//       return;
//     }

//     if (peerRef.current) {
//       console.log("Calling peer:", peerId);
//       peerConnectionsRef.current[peerId] = true;
//       const call = peerRef.current.call(peerId, stream);
//       call.on("stream", (remoteStream) => {
//         console.log("Received stream from outgoing call to:", peerId);
//         addRemoteStream(remoteStream, peerId, false);
//       });
//     }
//   };

//   // Add a direction parameter to track if this is from an incoming or outgoing call
//   const addRemoteStream = (
//     stream: MediaStream,
//     peerId?: string,
//     isIncoming: boolean = true
//   ) => {
//     console.log(
//       `Adding remote stream from: ${peerId} (${isIncoming ? "incoming" : "outgoing"}) My peer ID: ${myPeerIdRef.current}`
//     );

//     // Skip if this is the user's own stream
//     // Use only myPeerIdRef.current as the single source of truth
//     if (peerId && peerId === myPeerIdRef.current) {
//       console.log("Ignoring own stream in remote videos");
//       return;
//     }

//     // If we've already added this peer's stream, don't add again
//     if (peerId && addedPeerIdsRef.current.has(peerId)) {
//       console.log("Already added this peer's stream, skipping:", peerId);
//       return;
//     }

//     // Add peer ID to our set of tracked peers
//     if (peerId) {
//       addedPeerIdsRef.current.add(peerId);
//       console.log("Added peer to tracking set:", peerId);
//       console.log("Current tracked peers:", [...addedPeerIdsRef.current]);
//     }

//     // First clean any existing elements for this peer (just in case)
//     if (peerId) {
//       clearPeerElements(peerId);
//     }

//     const video = document.createElement("video");
//     video.srcObject = stream;
//     video.autoplay = true;
//     video.className =
//       "min-w-[160px] h-[165px] bg-gray-900 rounded-lg object-cover border border-gray-800";
//     if (peerId) (video as any).peerId = peerId;

//     // Add some UI indication this is a remote user
//     const wrapper = document.createElement("div");
//     wrapper.className =
//       "min-w-[220px] h-[165px] bg-[#1A1A1A] rounded-lg relative overflow-hidden border border-gray-800 shadow-lg";
//     if (peerId) (wrapper as any).peerId = peerId; // Also tag the wrapper with peerId
//     wrapper.appendChild(video);

//     // Add label for remote user
//     const label = document.createElement("div");
//     label.className =
//       "absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/80 to-transparent";
//     label.innerHTML = `<span class="text-sm text-white font-medium">Remote User (${peerId?.substring(
//       0,
//       6
//     )})</span>`;
//     wrapper.appendChild(label);

//     remoteVideosRef.current?.appendChild(wrapper);
//   };

//   // Helper function to clear any existing elements for a peer
//   const clearPeerElements = (peerId: string) => {
//     if (!remoteVideosRef.current) return;

//     const elementsToRemove = [];
//     const children = remoteVideosRef.current.children;

//     for (let i = 0; i < children.length; i++) {
//       const child = children[i] as any;
//       if (child.peerId === peerId) {
//         elementsToRemove.push(child);
//       }
//     }

//     // Remove outside the loop to avoid issues with live collection
//     elementsToRemove.forEach((el) => el.remove());

//     if (elementsToRemove.length > 0) {
//       console.log(
//         `Cleared ${elementsToRemove.length} existing elements for peer: ${peerId}`
//       );
//     }
//   };

//   const removeRemoteStream = (peerId: string) => {
//     // Remove the peer ID from our tracking set
//     if (addedPeerIdsRef.current.has(peerId)) {
//       addedPeerIdsRef.current.delete(peerId);
//       console.log("Removed peer from tracking set:", peerId);
//       console.log("Remaining tracked peers:", [...addedPeerIdsRef.current]);
//     }

//     // Clean up all elements for this peer
//     clearPeerElements(peerId);
//   };

//   const toggleMute = () => {
//     if (localStreamRef.current) {
//       const audioTracks = localStreamRef.current.getAudioTracks();
//       // Update track enabled status based on what the new state will be (not muted = enabled)
//       const newMutedState = !isMuted;
//       audioTracks.forEach((track) => {
//         track.enabled = !newMutedState;
//       });
//       setIsMuted(newMutedState);
//     }
//   };

//   const toggleVideo = () => {
//     if (localStreamRef.current) {
//       const videoTracks = localStreamRef.current.getVideoTracks();
//       // Update track enabled status based on what the new state will be (not videoOff = enabled)
//       const newVideoOffState = !isVideoOff;
//       videoTracks.forEach((track) => {
//         track.enabled = !newVideoOffState;
//       });
//       setIsVideoOff(newVideoOffState);
//     }
//   };

//   const toggleChatModal = () => setShowChatModal(!showChatModal);

//   const buttonClass = (isActive: boolean) => `
//     flex items-center justify-center rounded-md w-10 h-10 transition-all
//     ${
//       isActive
//         ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/40"
//         : "bg-[#1F1F1F] text-gray-300 border-[#2C2C2C] hover:bg-[#2C2C2C]"
//     }
//     border shadow-sm hover:shadow-md active:scale-95 duration-150
//   `;

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="flex flex-col h-screen bg-[#171717] text-white font-sans relative overflow-hidden"
//     >
     

//       <AnimatePresence>
//         <motion.main
//           className={`flex-1 p-6 flex flex-col items-center justify-center overflow-hidden bg-[#171717] transition-all duration-300 ease-in-out ${
//             showChatModal ? "mr-[320px]" : "mr-0"
//           }`}
//           layout
//         >
//           {error ? (
//             <motion.div
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="text-red-400 p-6 rounded-lg bg-red-500/10 border border-red-500/30 shadow-lg"
//             >
//               <h3 className="text-xl font-medium mb-2">Error</h3>
//               <p>{error}</p>
//             </motion.div>
//           ) : (
//             <div className="w-full h-full">
//               <WhiteBoard roomCode={roomCode} userId={userId} />
//             </div>
//           )}
//         </motion.main>
//       </AnimatePresence>

//       <footer
//         className={`p-4 bg-[#171717] border-t border-gray-800 z-20 transition-all duration-300 ease-in-out ${
//           showChatModal ? "mr-[320px]" : "mr-0"
//         }`}
//       >
     

//         <div className="flex space-x-4 overflow-x-auto py-2">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="min-w-[220px] h-[165px] bg-[#1A1A1A] rounded-lg relative overflow-hidden border border-gray-800 shadow-lg"
//           >
//             <video
//               ref={localVideoRef}
//               autoPlay
//               muted
//               className={`w-full h-full object-cover ${
//                 isVideoOff ? "hidden" : ""
//               }`}
//             />
//             {isVideoOff && (
//               <div className="w-full h-full flex flex-col items-center justify-center bg-[#1F1F1F]">
//                 <VideoOff size={40} className="text-gray-500 mb-2" />
//                 <span className="text-sm text-gray-400">Camera Off</span>
//               </div>
//             )}
//             <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/80 to-transparent">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-emerald-400 font-medium flex items-center">
//                   You{" "}
//                   {isMuted && (
//                     <MicOff size={14} className="ml-1 text-red-500" />
//                   )}
//                 </span>
//                 <div className="flex space-x-1">
//                   {/* <span className="px-1.5 py-0.5 text-xs bg-emerald-500/20 text-emerald-400 rounded-sm">
//                     Host
//                   </span> */}
//                 </div>
//               </div>
//             </div>
//           </motion.div>

//           <div
//             ref={remoteVideosRef}
//             className="flex space-x-4 overflow-x-auto"
//           ></div>
//         </div>
//       </footer>
      
//       {/* Control buttons positioned at the very bottom center */}
//       <motion.div
//         className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-3 z-40"
//         initial={{ y: 20, opacity: 0 }} // Changed initial animation slightly for better effect from bottom
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
//       >
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={toggleMute}
//           className={buttonClass(isMuted)}
//           aria-label={isMuted ? "Unmute" : "Mute"}
//         >
//           {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
//         </motion.button>

//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={toggleVideo}
//           className={buttonClass(isVideoOff)}
//           aria-label={isVideoOff ? "Turn on camera" : "Turn off camera"}
//         >
//           {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
//         </motion.button>

//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={toggleChatModal}
//           className={buttonClass(showChatModal)}
//           aria-label="Toggle chat"
//         >
//           <MessageCircle size={20} />
//         </motion.button>
//       </motion.div>

//       <motion.div
//         className="fixed top-0 right-0 h-full w-[320px] bg-[#1A1A1A] border-l border-gray-800 shadow-xl z-30"
//         initial={{ x: "100%" }}
//         animate={{
//           x: showChatModal ? 0 : "100%",
//           transition: {
//             type: "spring",
//             stiffness: 300,
//             damping: 30,
//           },
//         }}
//       >
//         {showChatModal && (
//           <ChatRoom
//             roomCode={roomCode}
//             userId={userId}
//             onClose={() => setShowChatModal(false)}
//           />
//         )}
//       </motion.div>
//     </motion.div>
//   );
// };

// export default VideoRoom;

import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
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
  const navigate = useNavigate();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideosRef = useRef<HTMLDivElement>(null);
  const peerRef = useRef<Peer | null>(null);
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const myPeerIdRef = useRef<string>("");
  const addedPeerIdsRef = useRef<Set<string>>(new Set());
  const peerConnectionsRef = useRef<Record<string, boolean>>({});
  const [myPeerId, setMyPeerId] = useState<string>("");
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

    addedPeerIdsRef.current = new Set();
    peerConnectionsRef.current = {};

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
      myPeerIdRef.current = id;
      setMyPeerId(id);
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
          console.log("Received call from:", call.peer);
          if (peerConnectionsRef.current[call.peer]) {
            console.log("Already have connection to this peer, ignoring call");
            call.answer(stream);
          } else {
            peerConnectionsRef.current[call.peer] = true;
            console.log("Answering call and adding remote stream");
            call.answer(stream);
            call.on("stream", (remoteStream) => {
              console.log("Got stream from call");
              addRemoteStream(remoteStream, call.peer, true);
            });
          }
        });

        socket.on("user-connected", (peerId) => {
          console.log("User connected event:", peerId);
          if (peerId !== "chat-only" && peerId !== myPeerIdRef.current) {
            if (!peerConnectionsRef.current[peerId]) {
              console.log("Initiating new connection to user:", peerId);
              connectToNewUser(peerId, stream);
            } else {
              console.log("Already connected to this user:", peerId);
            }
          } else {
            console.log("Skipping connection to self or chat-only");
          }
        });

        socket.on("user-disconnected", (peerId) => {
          console.log("User disconnected event:", peerId);
          if (peerId !== "chat-only") {
            removeRemoteStream(peerId);
            if (peerConnectionsRef.current[peerId]) {
              delete peerConnectionsRef.current[peerId];
              console.log("Removed peer connection tracking for:", peerId);
            }
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
      addedPeerIdsRef.current.clear();
      peerConnectionsRef.current = {};
    };
  }, [roomCode, initialMuted, initialVideoOff]);

  const connectToNewUser = (peerId: string, stream: MediaStream) => {
    if (peerId === myPeerIdRef.current) {
      console.log("Avoiding self-connection");
      return;
    }

    if (peerConnectionsRef.current[peerId]) {
      console.log("Already connected to peer, skipping:", peerId);
      return;
    }

    if (peerRef.current) {
      console.log("Calling peer:", peerId);
      peerConnectionsRef.current[peerId] = true;
      const call = peerRef.current.call(peerId, stream);
      call.on("stream", (remoteStream) => {
        console.log("Received stream from outgoing call to:", peerId);
        addRemoteStream(remoteStream, peerId, false);
      });
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

  const toggleChatModal = () => setShowChatModal(!showChatModal);

  const buttonClass = (isActive: boolean) => `
    flex items-center justify-center rounded-md w-10 h-10 transition-all
    ${
      isActive
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
          className={`flex-1 p-6 flex flex-col items-center justify-center overflow-hidden bg-[#171717] transition-all duration-300 ease-in-out ${
            showChatModal ? "mr-[320px]" : "mr-0"
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
        className={`p-4 bg-[#171717] border-t border-gray-800 z-20 transition-all duration-300 ease-in-out ${
          showChatModal ? "mr-[320px]" : "mr-0"
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
              className={`w-full h-full object-cover ${
                isVideoOff ? "hidden" : ""
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
        className="fixed top-0 right-0 h-full w-[320px] bg-[#1A1A1A] border-l border-gray-800 shadow-xl z-30"
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
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export default VideoRoom;