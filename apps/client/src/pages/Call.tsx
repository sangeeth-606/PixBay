import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import VideoRoom from "./VideoRoom";

interface CallState {
  roomCode: string;
  userId: string;
  isMuted: boolean;
  isVideoOff: boolean;
}

interface RoomProps {
  roomCode: string;
  userId: string;
  initialMuted: boolean;
  initialVideoOff: boolean;
  darkMode: boolean; // Add this property
}

const Call: React.FC = () => {
  const location = useLocation();
  const state = location.state as CallState | undefined;

  // If there's no state, redirect to home
  if (!state || !state.roomCode || !state.userId) {
    return <Navigate to="/" replace />;
  }

  return (
    <VideoRoom
      roomCode={state.roomCode}
      userId={state.userId}
      initialMuted={state.isMuted}
      initialVideoOff={state.isVideoOff}
      darkMode={true}
    />
  );
};

export default Call;
