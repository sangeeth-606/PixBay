import React, { useState } from 'react';
import { CalendarDays } from 'lucide-react';

// Type definitions based on your schema
type SprintStatus = 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'ARCHIVED';
type TaskType = 'TASK' | 'BUG' | 'STORY' | 'EPIC';
type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

interface Task {
  id: string;
  key: string;
  title: string;
  type: TaskType;
  status: TaskStatus;
  priority: Priority;
  storyPoints: number;
  assignee?: {
    id: string;
    name: string;
    initials: string;
  };
}

interface Sprint {
  id: string;
  name: string;
  goal?: string;
  status: SprintStatus;
  startDate: Date;
  endDate: Date;
  progress: number;
  tasks: Task[];
  totalStoryPoints: number;
  completedStoryPoints: number;
}

interface SprintProps {
  sprintId: string;
}

const Sprint: React.FC<SprintProps> = ({ sprintId }) => {
  // This would come from your API in a real app
  const [sprint, setSprint] = useState<Sprint>({
    id: sprintId,
    name: "Sprint 1 (Current)",
    goal: "Complete the user authentication flow and dashboard UI",
    status: "ACTIVE",
    startDate: new Date("2025-04-01"),
    endDate: new Date("2025-04-14"),
    progress: 65,
    tasks: [
      {
        id: "1",
        key: "PIX-101",
        title: "Implement login form validation",
        type: "TASK",
        status: "DONE",
        priority: "HIGH",
        storyPoints: 3,
        assignee: {
          id: "as1",
          name: "Alice Smith",
          initials: "AS"
        }
      },
      {
        id: "2",
        key: "PIX-102",
        title: "Create dashboard layout",
        type: "TASK",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        storyPoints: 5,
        assignee: {
          id: "bj1",
          name: "Bob Johnson",
          initials: "BJ"
        }
      },
      {
        id: "3",
        key: "PIX-103",
        title: "Implement password reset flow",
        type: "TASK",
        status: "TODO",
        priority: "MEDIUM",
        storyPoints: 3,
        assignee: {
          id: "cb1",
          name: "Charlie Brown",
          initials: "CB"
        }
      }
    ],
    totalStoryPoints: 11,
    completedStoryPoints: 3
  });

  // Calculate task counts by status
  const taskCounts = {
    todo: sprint.tasks.filter(task => task.status === 'TODO').length,
    inProgress: sprint.tasks.filter(task => task.status === 'IN_PROGRESS').length,
    done: sprint.tasks.filter(task => task.status === 'DONE').length
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusBadgeClass = (status: SprintStatus) => {
    switch (status) {
      case 'ACTIVE': return 'bg-teal-500 text-white';
      case 'PLANNING': return 'bg-blue-500 text-white';
      case 'COMPLETED': return 'bg-green-500 text-white';
      case 'CANCELLED': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityBadgeClass = (priority: Priority) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-500 text-white';
      case 'MEDIUM': return 'bg-yellow-500 text-white';
      case 'LOW': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusClass = (status: TaskStatus) => {
    switch (status) {
      case 'TODO': return 'bg-gray-200 text-gray-800';
      case 'IN_PROGRESS': return 'bg-blue-200 text-blue-800';
      case 'DONE': return 'bg-teal-200 text-teal-800';
      case 'ARCHIVED': return 'bg-gray-200 text-gray-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{sprint.name}</h1>
          <div className="flex items-center mt-1">
            <span className={`text-xs px-2 py-1 rounded-full mr-2 ${getStatusBadgeClass(sprint.status)}`}>
              {sprint.status}
            </span>
            <span className="text-sm text-gray-400 flex items-center">
              <CalendarDays className="h-4 w-4 mr-1" />
              {formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-white">
            Edit Sprint
          </button>
          <button className="px-4 py-2 rounded-md bg-teal-600 hover:bg-teal-500 text-white">
            Start Sprint
          </button>
        </div>
      </div>
      
      <div className="bg-gray-800 p-6 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">Sprint Goal</h2>
        <p className="text-gray-300">{sprint.goal || "No goal set for this sprint"}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Progress</h3>
          <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
            <div 
              className="bg-teal-500 h-2 rounded-full" 
              style={{ width: `${sprint.progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm">
            <span>{sprint.progress}% complete</span>
            <span>120% time elapsed</span>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Story Points</h3>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold mr-2">{sprint.completedStoryPoints}</span>
            <span className="text-gray-400">/ {sprint.totalStoryPoints}</span>
          </div>
          <div className="text-sm text-gray-400 mt-1">
            {Math.round((sprint.completedStoryPoints / sprint.totalStoryPoints) * 100)}% completed
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Issues</h3>
          <div className="flex justify-between">
            <div className="text-center">
              <div className="text-2xl font-bold">{taskCounts.todo}</div>
              <div className="text-sm text-gray-400">To Do</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{taskCounts.inProgress}</div>
              <div className="text-sm text-gray-400">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{taskCounts.done}</div>
              <div className="text-sm text-gray-400">Done</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex space-x-2 border-b border-gray-700">
          <button className="px-4 py-2 border-b-2 border-teal-500 font-medium">Issues</button>
          <button className="px-4 py-2 text-gray-400 hover:text-white">Burndown Chart</button>
          <button className="px-4 py-2 text-gray-400 hover:text-white">Board</button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded-lg">
          <thead>
            <tr className="text-left text-gray-400 text-sm">
              <th className="py-3 px-4">Key</th>
              <th className="py-3 px-4">Summary</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Assignee</th>
              <th className="py-3 px-4">Story Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {sprint.tasks.map(task => (
              <tr key={task.id} className="hover:bg-gray-700">
                <td className="py-3 px-4 font-medium">{task.key}</td>
                <td className="py-3 px-4">{task.title}</td>
                <td className="py-3 px-4">
                  <span className="flex items-center text-gray-400">
                    <span className="inline-block w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                    {task.type}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${getPriorityBadgeClass(task.priority)}`}>
                    {task.priority}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-1 rounded-md ${getStatusClass(task.status)}`}>
                    {task.status === 'IN_PROGRESS' ? 'IN_PROGRESS' : task.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {task.assignee && (
                    <div className="flex items-center">
                      <span className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-xs mr-2">
                        {task.assignee.initials}
                      </span>
                      <span>{task.assignee.name}</span>
                    </div>
                  )}
                </td>
                <td className="py-3 px-4 text-center">{task.storyPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sprint;