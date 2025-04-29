import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from "@clerk/clerk-react";
import { motion } from 'framer-motion'; // Import motion

interface TaskInfoProps {
  taskId: string;   
  title?: string;
  description?: string;
  onTaskDeleted?: () => void;
  onClose?: () => void;
  onDescriptionUpdated?: (newDescription: string) => void;
  darkMode?: boolean;
}

function TaskInfo({ taskId, title, description, onTaskDeleted, onClose, onDescriptionUpdated, darkMode = false }: TaskInfoProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [editedDescription, setEditedDescription] = useState(description || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const { getToken } = useAuth();

  useEffect(() => {
    setEditedDescription(description || '');
  }, [description]);

  const saveDescription = useCallback(
    async (text: string) => {
      if (!taskId || text === description) return;
      
      try {
        setIsSaving(true);
        setSaveStatus('saving');
        const token = await getToken();
        
        await axios.put(
          `http://localhost:5000/api/tasks/update/${taskId}`, 
          { description: text },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setSaveStatus('saved');
        
        // Notify parent component about the description update
        if (onDescriptionUpdated) {
          onDescriptionUpdated(text);
        }
        
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (error) {
        console.error("Failed to update task description:", error);
        setSaveStatus('error');
      } finally {
        setIsSaving(false);
      }
    },
    [taskId, description, getToken, onDescriptionUpdated]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (editedDescription !== description) {
        saveDescription(editedDescription);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [editedDescription, saveDescription, description]);

  const handleDeleteTask = async () => {
    if (!taskId || isDeleting) return;
    
    try {
      setIsDeleting(true);
      const token = await getToken();
      
      await axios.delete(`http://localhost:5000/api/tasks/delete/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
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
    <motion.div 
      className={`p-6 h-full rounded-lg shadow-md relative ${darkMode ? 'bg-[#171717] border border-[#2C2C2C] text-white' : 'bg-gray-100 text-[#212121]'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 bg-transparent hover:bg-transparent rounded-none z-50 transition-transform hover:scale-110 duration-200"
          style={{ background: 'none', borderRadius: 0 }}
          aria-label="Close"
        >
          <svg 
            className="w-5 h-5 text-emerald-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
      
      <div className={`border-b pb-4 mb-6 ${darkMode ? 'border-[#2C2C2C]' : 'border-gray-200'}`}>
        <motion.h2 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-[#212121]'}`}
        >
          {title || 'Task Details'}
        </motion.h2>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-2">
          <label className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Description
          </label>
          {saveStatus === 'saving' && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
            >
              Saving...
            </motion.span>
          )}
          {saveStatus === 'saved' && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`text-xs text-emerald-400`}
            >
              Saved
            </motion.span>
          )}
          {saveStatus === 'error' && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`text-xs text-red-500`}
            >
              Error saving
            </motion.span>
          )}
        </div>
        <textarea
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
          placeholder="Add a description..."
          className={`w-full min-h-[150px] p-3 rounded border transition-colors duration-200 ${
            darkMode 
              ? 'bg-[#1C1C1C] border-[#2C2C2C] text-gray-200 placeholder-gray-500 focus:border-emerald-600' 
              : 'bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:border-emerald-500'
          } focus:outline-none focus:ring-1 focus:ring-emerald-500`}
        />
      </motion.div>
      
      <div className="min-h-[400px]">
      </div>
      
      <div className="absolute bottom-6 right-6">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleDeleteTask}
          disabled={isDeleting}
          className={`px-4 py-1.5 rounded text-xs font-medium transition-colors duration-200
            ${darkMode
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-emerald-500 hover:bg-emerald-600 text-white'}
            ${isDeleting ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {isDeleting ? 'Deleting...' : 'Delete Task'}
        </motion.button>
      </div>
    </motion.div>
  );
}

export default TaskInfo;