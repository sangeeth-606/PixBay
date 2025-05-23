import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import io, { Socket } from "socket.io-client";
import { Circle, Square, Type, Pen, Eraser, X, Minus, RotateCcw } from "lucide-react";

interface WhiteBoardProps {
  roomCode: string;
  userId: string;
}

type DrawingAction = {
  type: 'start' | 'draw' | 'clear';
  x?: number;
  y?: number;
  color?: string;
  brushSize?: number;
  tool?: string;
};

const SMOOTHING_FACTOR = 0.5; // Adjust between 0 and 1 for smoothness vs responsiveness

const WhiteBoard: React.FC<WhiteBoardProps> = ({ roomCode, userId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#D3D3D3");
  const [brushSize, setBrushSize] = useState(5);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [tool, setTool] = useState("pen");
  const [prevActions, setPrevActions] = useState<DrawingAction[]>([]);
  const prevSmoothedPoint = useRef<{ x: number, y: number } | null>(null);
  const actionsRef = useRef<DrawingAction[]>([]);

  // Initialize canvas and socket
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        redrawCanvas();
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    ctx.fillStyle = "#121212";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const newSocket = io("http://localhost:5000", { transports: ["polling"] });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Whiteboard connected:", newSocket.id);
      newSocket.emit("join-whiteboard", roomCode);
    });

    newSocket.on("whiteboard-history", (history) => {
      console.log("Received whiteboard history:", history);
      setPrevActions(history);
      actionsRef.current = history;
      redrawCanvas(history);
    });

    newSocket.on("whiteboard-action", (action: DrawingAction) => {
      console.log("Received whiteboard action:", action);
      handleRemoteAction(action);
      const newActions = [...actionsRef.current, action];
      setPrevActions(newActions);
      actionsRef.current = newActions;
    });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      newSocket.disconnect();
    };
  }, [roomCode]);

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
            `Canvas resized from ${prevWidth}x${prevHeight} to ${canvasRef.current.width}x${canvasRef.current.height}`
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

    let currentPath: { x: number, y: number }[] = [];
    let currentColor = "#000000";
    let currentSize = 5;
    let currentTool = "pen";

    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];

      if (action.type === 'clear') {
        currentPath = [];
        ctx.fillStyle = "#121212";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (action.type === 'start') {
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
      } else if (action.type === 'draw') {
        if (currentTool === 'pen' || currentTool === 'eraser') {
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

    if (action.type === 'clear') {
      ctx.fillStyle = "#121212";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (action.type === 'start') {
      ctx.beginPath();
      ctx.moveTo(action.x || 0, action.y || 0);
      ctx.strokeStyle = action.color || "#000000";
      ctx.lineWidth = action.brushSize || 5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    } else if (action.type === 'draw') {
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
      type: 'start',
      x,
      y,
      color: tool === 'eraser' ? '#121212' : color,
      brushSize,
      tool
    };
    socket.emit("whiteboard-action", { roomCode, action });

    const newActions = [...actionsRef.current, action];
    setPrevActions(newActions);
    actionsRef.current = newActions;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = tool === 'eraser' ? '#121212' : color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas || !socket) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x: rawX, y: rawY } = getMouseCoordinates(e);

    if (prevSmoothedPoint.current) {
      const prevX = prevSmoothedPoint.current.x;
      const prevY = prevSmoothedPoint.current.y;
      const smoothedX = SMOOTHING_FACTOR * rawX + (1 - SMOOTHING_FACTOR) * prevX;
      const smoothedY = SMOOTHING_FACTOR * rawY + (1 - SMOOTHING_FACTOR) * prevY;

      const action: DrawingAction = {
        type: 'draw',
        x: smoothedX,
        y: smoothedY
      };
      socket.emit("whiteboard-action", { roomCode, action });

      const newActions = [...actionsRef.current, action];
      setPrevActions(newActions);
      actionsRef.current = newActions;

      ctx.lineTo(smoothedX, smoothedY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(smoothedX, smoothedY);

      prevSmoothedPoint.current = { x: smoothedX, y: smoothedY };
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    prevSmoothedPoint.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !socket) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const action: DrawingAction = { type: 'clear' };
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
            className={`p-2 rounded-md ${tool === 'pen' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#2C2C2C] text-gray-300'} hover:bg-[#3C3C3C] transition`}
            title="Pen"
          >
            <Pen size={18} />
          </button>
          <button
            onClick={() => setTool("eraser")}
            className={`p-2 rounded-md ${tool === 'eraser' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#2C2C2C] text-gray-300'} hover:bg-[#3C3C3C] transition`}
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
              disabled={tool === 'eraser'}
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
            <RotateCcw size={18} />
          </button>
          <button
            onClick={clearCanvas}
            className="p-2 rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
            title="Clear"
          >
            <X size={18} />
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