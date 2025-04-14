import { useState } from 'react';
import axios from 'axios';
import { useAuth } from "@clerk/clerk-react";

interface TaskInfoProps {
  taskId: string;   
  title?: string;
  description?: string;
  onTaskDeleted?: () => void;
  darkMode?: boolean;
}

function TaskInfo({ taskId, title, description, onTaskDeleted, darkMode = false }: TaskInfoProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { getToken } = useAuth();

  // Function to handle task deletion
  const handleDeleteTask = async () => {
    if (!taskId || isDeleting) return;
    
    try {
      setIsDeleting(true);
      const token = await getToken();
      
      await axios.delete(`http://localhost:5000/api/tasks/delete/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Call the callback to inform parent component
      if (onTaskDeleted) {
        onTaskDeleted();
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
      if (axios.isAxiosError(error)) {
        console.error("Error details:", error.response?.data);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`p-6 h-full ${darkMode ? 'bg-[#2C2C2C] text-white' : 'bg-white text-[#212121]'} rounded-lg`}>
      {/* Header - Title */}
      <div className="border-b pb-4 mb-6">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {title || 'Task Details'}
        </h2>
        {description && (
          <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {description}
          </p>
        )}
      </div>
      
      {/* Middle area - Left empty for future content */}
      <div className="min-h-[400px]">
        {/* This area is intentionally left blank for future content */}
      </div>
      
      {/* Footer with Delete button */}
      <div className="pt-4 mt-auto border-t flex justify-end">
        <button
          onClick={handleDeleteTask}
          disabled={isDeleting}
          className={`px-5 py-2 rounded-md
            ${darkMode 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-red-500 hover:bg-red-600'} 
            text-white font-medium transition-colors ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isDeleting ? 'Deleting...' : 'Delete Task'}
        </button>
      </div>
    </div>
  );
}

export default TaskInfo;