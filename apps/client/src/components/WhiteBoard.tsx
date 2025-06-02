import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import io, { Socket } from "socket.io-client";
import api from "../utils/api"; // Import the API utility functions
import {
  Pencil,
  Eraser,
  Undo,
  Redo,
} from "lucide-react";

interface WhiteBoardProps {
  roomCode: string;
  userId: string;
}

type DrawingAction = {
  type: "start" | "draw" | "clear";
  x?: number;
  y?: number;
  color?: string;
  brushSize?: number;
  tool?: string;
  pressure?: number;
};

type Point = { x: number; y: number; pressure?: number };
type SmoothingConfig = {
  factor: number;
  points: number;
  velocityWeight: number;
};

const SMOOTHING_CONFIG: SmoothingConfig = {
  factor: 0.35,
  points: 8,
  velocityWeight: 0.7,
};

// Fine-tuned constants for better real-time performance
const BATCH_INTERVAL = 16; // ~60fps for smooth real-time updates

const WhiteBoard: React.FC<WhiteBoardProps> = ({ roomCode, userId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#D3D3D3");
  const [brushSize, setBrushSize] = useState(5);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [tool, setTool] = useState("pen");
  const [prevActions, setPrevActions] = useState<DrawingAction[]>([]);
  const prevSmoothedPoint = useRef<{ x: number; y: number } | null>(null);
  const actionsRef = useRef<DrawingAction[]>([]);
  const batchRef = useRef<DrawingAction[]>([]);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const drawingPathRef = useRef<{ x: number; y: number }[]>([]);

  // Add real-time batch processing refs
  const batchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingBatchRef = useRef<DrawingAction[]>([]);

  // Add new state for stroke smoothing
  const smoothedPoints = useRef<Point[]>([]);
  const lastVelocity = useRef<number>(0);
  const lastTimestamp = useRef<number>(0);

  const smoothStroke = (points: Point[]): Point[] => {
    if (points.length < 2) return points;

    const smoothed: Point[] = [];
    const temp: Point[] = [];

    // Initialize control points
    temp.push({ x: points[0].x, y: points[0].y });
    for (let i = 1; i < points.length - 1; i++) {
      const p0 = points[i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];

      // Calculate control points for quadratic curve
      const xc = (p0.x + p1.x) / 2;
      const yc = (p0.y + p1.y) / 2;
      const xc_next = (p1.x + p2.x) / 2;
      const yc_next = (p1.y + p2.y) / 2;

      temp.push({ x: xc, y: yc }, { x: p1.x, y: p1.y }, { x: xc_next, y: yc_next });
    }
    temp.push({ x: points[points.length - 1].x, y: points[points.length - 1].y });

    // Apply smoothing factor
    for (let i = 0; i < temp.length - 2; i += 2) {
      const p0 = temp[i];
      const p1 = temp[i + 1];
      const p2 = temp[i + 2];

      for (let t = 0; t <= 1; t += 0.1) {
        const tt = t * t;
        const u = 1 - t;
        const uu = u * u;

        const x = uu * p0.x + 2 * u * t * p1.x + tt * p2.x;
        const y = uu * p0.y + 2 * u * t * p1.y + tt * p2.y;

        smoothed.push({ x, y });
      }
    }

    return smoothed;
  };

  const calculatePressure = (x: number, y: number): number => {
    const now = Date.now();
    const timeDelta = now - lastTimestamp.current;
    lastTimestamp.current = now;

    if (!lastPointRef.current) return 1;

    const dx = x - lastPointRef.current.x;
    const dy = y - lastPointRef.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const velocity = distance / (timeDelta || 1);

    // Smooth velocity transitions
    lastVelocity.current = lastVelocity.current * 0.7 + velocity * 0.3;

    // Convert velocity to pressure (inverse relationship)
    const pressure = Math.max(0.2, Math.min(1, 1 - lastVelocity.current * SMOOTHING_CONFIG.velocityWeight));

    return pressure;
  };

  // Initialize canvas and socket
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initialize canvas
    const initCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
      ctx.fillStyle = "#121212";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    initCanvas();

    // Initialize Socket.IO with better transport handling
    const newSocket = io(api.getApiUrl(), {
      path: '/socket.io',
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      query: { roomCode, userId },
      timeout: 20000
    });

    let isReconnecting = false;

    newSocket.on("connect", () => {
      console.log("Whiteboard connected:", newSocket.id);
      newSocket.emit("join-whiteboard", roomCode);

      // Request history again after reconnection
      if (isReconnecting) {
        console.log("Requesting whiteboard history after reconnection");
        newSocket.emit("get-whiteboard-history", roomCode);
        isReconnecting = false;
      }
    });

    newSocket.on("disconnect", () => {
      console.log("Whiteboard disconnected");
      isReconnecting = true;
    });

    newSocket.on("whiteboard-history", (history) => {
      console.log("Received whiteboard history:", history);
      if (Array.isArray(history) && history.length > 0) {
        setPrevActions(history);
        actionsRef.current = history;
        requestAnimationFrame(() => redrawCanvas(history));
      }
    });

    // Batch processing for actions
    const actionQueue: DrawingAction[] = [];
    let processingQueue = false;

    const processActionQueue = () => {
      if (actionQueue.length > 0 && !processingQueue) {
        processingQueue = true;
        const actions = [...actionQueue];
        actionQueue.length = 0;

        actions.forEach(action => {
          handleRemoteAction(action);
          actionsRef.current.push(action);
        });

        setPrevActions([...actionsRef.current]);
        processingQueue = false;
      }
    };

    // Process queue periodically
    const queueInterval = setInterval(processActionQueue, 16); // ~60fps

    newSocket.on("whiteboard-action", (action: DrawingAction) => {
      actionQueue.push(action);
    });

    setSocket(newSocket);

    // Cleanup
    return () => {
      clearInterval(queueInterval);
      if (newSocket.connected) {
        newSocket.disconnect();
      }
    };
  }, [roomCode, userId]);

  // Add a layout change detector
  useEffect(() => {
    const handleLayoutChange = () => {
      if (canvasRef.current) {
        const container = canvasRef.current.parentElement;
        if (container) {
          const prevWidth = canvasRef.current.width;
          const prevHeight = canvasRef.current.height;

          canvasRef.current.width = container.clientWidth;
          canvasRef.current.height = container.clientHeight;

          console.log(
            `Canvas resized from ${prevWidth}x${prevHeight} to ${canvasRef.current.width}x${canvasRef.current.height}`,
          );
          console.log(`Redrawing ${actionsRef.current.length} actions`);

          redrawCanvas(actionsRef.current);
        }
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      handleLayoutChange();
    });

    if (canvasContainerRef.current) {
      resizeObserver.observe(canvasContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const redrawCanvas = (actions = prevActions) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    console.log(`Redrawing canvas with ${actions.length} actions`);

    ctx.fillStyle = "#121212";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let currentPath: { x: number; y: number }[] = [];
    let currentColor = "#000000";
    let currentSize = 5;
    let currentTool = "pen";

    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];

      if (action.type === "clear") {
        currentPath = [];
        ctx.fillStyle = "#121212";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (action.type === "start") {
        currentPath = [{ x: action.x || 0, y: action.y || 0 }];
        currentColor = action.color || currentColor;
        currentSize = action.brushSize || currentSize;
        currentTool = action.tool || currentTool;

        ctx.beginPath();
        ctx.moveTo(action.x || 0, action.y || 0);
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = currentSize;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      } else if (action.type === "draw") {
        if (currentTool === "pen" || currentTool === "eraser") {
          currentPath.push({ x: action.x || 0, y: action.y || 0 });

          if (currentPath.length > 0) {
            ctx.beginPath();
            ctx.moveTo(currentPath[0].x, currentPath[0].y);

            for (let j = 1; j < currentPath.length; j++) {
              ctx.lineTo(currentPath[j].x, currentPath[j].y);
            }

            ctx.stroke();
          }
        }
      }
    }
  };

  const handleRemoteAction = (action: DrawingAction) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (action.type === "clear") {
      ctx.fillStyle = "#121212";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (action.type === "start") {
      ctx.beginPath();
      ctx.moveTo(action.x || 0, action.y || 0);
      ctx.strokeStyle = action.color || "#000000";
      ctx.lineWidth = action.brushSize || 5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    } else if (action.type === "draw") {
      ctx.strokeStyle = action.color || ctx.strokeStyle;
      ctx.lineWidth = action.brushSize || ctx.lineWidth;
      ctx.lineTo(action.x || 0, action.y || 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(action.x || 0, action.y || 0);
    }
  };

  const getMouseCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    return { x, y };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !socket) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getMouseCoordinates(e);
    prevSmoothedPoint.current = { x, y };

    const action: DrawingAction = {
      type: "start",
      x,
      y,
      color: tool === "eraser" ? "#121212" : color,
      brushSize,
      tool,
    };
    socket.emit("whiteboard-action", { roomCode, action });

    const newActions = [...actionsRef.current, action];
    setPrevActions(newActions);
    actionsRef.current = newActions;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = tool === "eraser" ? "#121212" : color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    setIsDrawing(true);

    // Reset drawing state
    drawingPathRef.current = [{ x, y }];
    lastPointRef.current = { x, y };
    batchRef.current = [];

    smoothedPoints.current = [];
    lastVelocity.current = 0;
    lastTimestamp.current = Date.now();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !socket) return;

    const { x, y } = getMouseCoordinates(e);
    const pressure = calculatePressure(x, y);

    smoothedPoints.current.push({ x, y, pressure });

    // Keep a rolling window of points for smoothing
    if (smoothedPoints.current.length > SMOOTHING_CONFIG.points) {
      smoothedPoints.current.shift();
    }

    const smoothed = smoothStroke(smoothedPoints.current);

    // Draw locally with immediate feedback
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Check if smoothed has points before drawing
    if (smoothed.length > 0) {
      ctx.beginPath();
      ctx.moveTo(smoothed[0].x, smoothed[0].y);

      for (let i = 1; i < smoothed.length; i++) {
        const point = smoothed[i];
        const prevPoint = smoothed[i - 1];

        // Use quadratic curves for smoother lines
        const xc = (prevPoint.x + point.x) / 2;
        const yc = (prevPoint.y + point.y) / 2;

        ctx.quadraticCurveTo(prevPoint.x, prevPoint.y, xc, yc);

        // Adjust line width based on pressure
        const width = brushSize * (point.pressure || 1);
        ctx.lineWidth = width;
        ctx.stroke();
      }
    }

    // Batch and send points to server
    pendingBatchRef.current.push({
      type: "draw",
      x,
      y,
      pressure,
      color: tool === "eraser" ? "#121212" : color,
      brushSize: brushSize * (pressure || 1),
      tool,
    });

    // Schedule batch send if not already scheduled
    if (!batchTimeoutRef.current) {
      batchTimeoutRef.current = setTimeout(sendPendingBatch, BATCH_INTERVAL);
    }

    lastPointRef.current = { x, y };
  };

  // New function to send pending batch
  const sendPendingBatch = () => {
    if (pendingBatchRef.current.length === 0 || !socket) return;

    socket.emit("whiteboard-batch", {
      roomCode,
      actions: pendingBatchRef.current,
    });

    // Add to history
    actionsRef.current = [...actionsRef.current, ...pendingBatchRef.current];
    pendingBatchRef.current = [];
  };

  const stopDrawing = () => {
    if (isDrawing) {
      // Send any remaining actions
      sendPendingBatch();
      if (batchTimeoutRef.current) {
        clearTimeout(batchTimeoutRef.current);
        batchTimeoutRef.current = null;
      }
    }
    setIsDrawing(false);
    lastPointRef.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !socket) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const action: DrawingAction = { type: "clear" };
    socket.emit("whiteboard-action", { roomCode, action });

    const newActions = [...actionsRef.current, action];
    setPrevActions(newActions);
    actionsRef.current = newActions;

    ctx.fillStyle = "#121212";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const undoLastAction = () => {
    if (actionsRef.current.length === 0) return;

    const newActions = [...actionsRef.current];
    newActions.pop();
    setPrevActions(newActions);
    actionsRef.current = newActions;
    redrawCanvas(newActions);

    if (socket) {
      socket.emit("whiteboard-undo", { roomCode });
    }
  };

  // Clean up batch timeout on unmount
  useEffect(() => {
    return () => {
      if (batchTimeoutRef.current) {
        clearTimeout(batchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full flex flex-col bg-[#171717]"
    >
      <div className="flex justify-between items-center p-2 bg-[#1F1F1F] border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setTool("pen")}
            className={`p-2 rounded-md ${tool === "pen" ? "bg-emerald-500/20 text-emerald-400" : "bg-[#2C2C2C] text-gray-300"} hover:bg-[#3C3C3C] transition`}
            title="Pen"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={() => setTool("eraser")}
            className={`p-2 rounded-md ${tool === "eraser" ? "bg-emerald-500/20 text-emerald-400" : "bg-[#2C2C2C] text-gray-300"} hover:bg-[#3C3C3C] transition`}
            title="Eraser"
          >
            <Eraser size={18} />
          </button>
          <div className="h-6 w-px bg-gray-700 mx-1"></div>
          <div className="flex items-center ml-2">
            <label htmlFor="color-picker" className="text-white mr-2 text-sm">
              Color:
            </label>
            <input
              type="color"
              id="color-picker"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-8 w-8 cursor-pointer rounded border border-gray-600"
              disabled={tool === "eraser"}
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="brush-size" className="text-white mr-2 text-sm">
              Size:
            </label>
            <input
              type="range"
              id="brush-size"
              min="1"
              max="30"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-24 accent-emerald-500"
            />
            <span className="text-white ml-2 w-6 text-sm">{brushSize}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={undoLastAction}
            className="p-2 rounded-md bg-[#2C2C2C] text-white hover:bg-[#3C3C3C] transition"
            title="Undo"
          >
            <Undo size={18} />
          </button>
          <button
            onClick={clearCanvas}
            className="p-2 rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
            title="Clear"
          >
            <Redo size={18} />
          </button>
        </div>
      </div>

      <div
        ref={canvasContainerRef}
        className="flex-1 relative bg-gray-800 overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="absolute top-0 left-0 w-full h-full cursor-crosshair bg-[#121212]"
        />
      </div>
    </motion.div>
  );
};

export default WhiteBoard;
