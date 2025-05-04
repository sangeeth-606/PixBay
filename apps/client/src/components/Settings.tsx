import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Briefcase, 
  PaintBucket, 
  Bell, 
  Save, 
  Trash2, 
  UserPlus, 
  X, 
  Check, 
  Moon, 
  Sun 
} from 'lucide-react';
import axios from 'axios';
import { useAuth, useUser } from '@clerk/clerk-react';
import { LoadingSpinner } from './LoadingSpinner';

interface SettingsProps {
  workspaceName: string;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

interface WorkspaceMember {
  id: string;
  userId: string;
  role: string;
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export function Settings({ workspaceName, darkMode, toggleDarkMode }: SettingsProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('MEMBER');
  const [workspace, setWorkspace] = useState({ name: workspaceName, id: '' });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    taskAssignments: true,
    mentions: true,
    projectUpdates: true,
    dailyDigest: false,
  });

  // User profile states
  const { user } = useUser();
  const { getToken } = useAuth();
  const [profileName, setProfileName] = useState(user?.fullName || '');
  
  // Load workspace details and members
  useEffect(() => {
    const loadWorkspaceDetails = async () => {
      if (!workspaceName) return;
      
      setIsLoading(true);
      try {
        const token = await getToken();
        
        // Get workspace details
        const workspaceRes = await axios.get(
          `http://localhost:5000/api/workspaces/by-name/${workspaceName}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setWorkspace(workspaceRes.data);
        
        // Get workspace members
        if (workspaceRes.data.id) {
          const membersRes = await axios.get(
            `http://localhost:5000/api/workspaces/${workspaceRes.data.id}/members`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          setMembers(membersRes.data);
        }
      } catch (error) {
        console.error('Error loading workspace details:', error);
        setMessage({ type: 'error', text: 'Failed to load workspace details' });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadWorkspaceDetails();
  }, [workspaceName, getToken]);
  
  // Update profile
  const handleProfileUpdate = async () => {
    setIsSaving(true);
    try {
      // This would connect to your user update API
      // For now, we'll just simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setMessage({ type: 'success', text: 'Profile updated successfully' });
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Invite new member
  const handleInviteMember = async () => {
    if (!newMemberEmail) {
      setMessage({ type: 'error', text: 'Please enter an email address' });
      return;
    }
    
    setIsSaving(true);
    try {
      const token = await getToken();
      
      await axios.post(
        `http://localhost:5000/api/workspaces/${workspace.id}/members`,
        { email: newMemberEmail, role: newMemberRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Refresh members list
      const membersRes = await axios.get(
        `http://localhost:5000/api/workspaces/${workspace.id}/members`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMembers(membersRes.data);
      setNewMemberEmail('');
      setMessage({ type: 'success', text: 'Member invited successfully' });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error inviting member:', error);
      setMessage({ type: 'error', text: 'Failed to invite member' });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Update member role
  const handleUpdateMemberRole = async (memberId: string, newRole: string) => {
    setIsSaving(true);
    try {
      const token = await getToken();
      
      await axios.put(
        `http://localhost:5000/api/workspaces/members/${memberId}`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state
      setMembers(prevMembers => 
        prevMembers.map(member => 
          member.id === memberId ? { ...member, role: newRole } : member
        )
      );
      
      setMessage({ type: 'success', text: 'Member role updated' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error updating member role:', error);
      setMessage({ type: 'error', text: 'Failed to update member role' });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Remove member
  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    
    setIsSaving(true);
    try {
      const token = await getToken();
      
      await axios.delete(
        `http://localhost:5000/api/workspaces/members/${memberId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state
      setMembers(prevMembers => prevMembers.filter(member => member.id !== memberId));
      
      setMessage({ type: 'success', text: 'Member removed successfully' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error removing member:', error);
      setMessage({ type: 'error', text: 'Failed to remove member' });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Update notification settings
  const handleNotificationUpdate = async () => {
    setIsSaving(true);
    try {
      // This would connect to your notification settings API
      // For now, we'll just simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setMessage({ type: 'success', text: 'Notification settings updated' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update notification settings' });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className={`flex h-full items-center justify-center ${darkMode ? "bg-[#121212]" : "bg-gray-50"}`}>
        <LoadingSpinner size={40} />
      </div>
    );
  }
  
  return (
    <div className={`h-full overflow-auto ${darkMode ? "bg-[#121212] text-white" : "bg-gray-50 text-gray-800"}`}>
      <div className="container mx-auto max-w-6xl p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="mb-6 text-3xl font-bold">Settings</h1>
          
          {/* Status message */}
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-4 rounded-md p-3 ${
                message.type === 'success'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-800/30 dark:text-emerald-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300'
              }`}
            >
              {message.type === 'success' ? (
                <Check className="mr-2 inline h-5 w-5" />
              ) : (
                <X className="mr-2 inline h-5 w-5" />
              )}
              {message.text}
            </motion.div>
          )}
          
          {/* Tabs */}
          <div className="mb-6 flex space-x-2 overflow-x-auto border-b border-gray-200 pb-2 dark:border-gray-700">
            {[
              { id: 'profile', label: 'Profile', icon: <User className="mr-2 h-4 w-4" /> },
              { id: 'workspace', label: 'Workspace', icon: <Briefcase className="mr-2 h-4 w-4" /> },
              { id: 'appearance', label: 'Appearance', icon: <PaintBucket className="mr-2 h-4 w-4" /> },
              { id: 'notifications', label: 'Notifications', icon: <Bell className="mr-2 h-4 w-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center whitespace-nowrap rounded-t-md px-4 py-2 text-sm font-medium ${
                  activeTab === tab.id
                    ? darkMode
                      ? 'border-b-2 border-emerald-500 text-emerald-500'
                      : 'border-b-2 border-emerald-600 text-emerald-600'
                    : darkMode
                      ? 'text-gray-400 hover:text-gray-300'
                      : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Tab Content */}
          <div className={`rounded-lg ${darkMode ? "bg-[#1E1E1E]" : "bg-white"} p-6 shadow-sm`}>
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="mb-4 text-xl font-semibold">Profile Settings</h2>
                <div className="mb-6 grid gap-6 md:grid-cols-2">
                  <div>
                    <label className={`mb-2 block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Name
                    </label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className={`w-full rounded-md border ${
                        darkMode 
                          ? "border-gray-700 bg-gray-800 text-white focus:border-emerald-500" 
                          : "border-gray-300 bg-white text-gray-900 focus:border-emerald-600"
                      } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
                    />
                  </div>
                  <div>
                    <label className={`mb-2 block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.emailAddresses?.[0]?.emailAddress || ''}
                      disabled
                      className={`w-full rounded-md border ${
                        darkMode 
                          ? "border-gray-700 bg-gray-800/50 text-gray-400" 
                          : "border-gray-300 bg-gray-100 text-gray-500"
                      } px-3 py-2`}
                    />
                    <p className="mt-1 text-xs text-gray-500">Email is managed by your account provider</p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleProfileUpdate}
                    disabled={isSaving}
                    className={`flex items-center rounded-md ${
                      darkMode
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-emerald-500 hover:bg-emerald-600"
                    } px-4 py-2 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-70`}
                  >
                    {isSaving ? (
                      <>
                        <LoadingSpinner size={16} className="mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
            
            {/* Workspace Settings */}
            {activeTab === 'workspace' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="mb-4 text-xl font-semibold">Workspace Settings</h2>
                
                <div className="mb-6">
                  <label className={`mb-2 block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Workspace Name
                  </label>
                  <input
                    type="text"
                    value={workspace.name}
                    onChange={(e) => setWorkspace({...workspace, name: e.target.value})}
                    className={`w-full rounded-md border ${
                      darkMode 
                        ? "border-gray-700 bg-gray-800 text-white focus:border-emerald-500" 
                        : "border-gray-300 bg-white text-gray-900 focus:border-emerald-600"
                    } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
                  />
                </div>
                
                <div className="mb-6">
                  <h3 className={`mb-3 text-lg font-medium ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                    Members
                  </h3>
                  <div className={`mb-4 overflow-hidden rounded-md border ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                    <table className="w-full">
                      <thead className={`${darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-50 text-gray-700"}`}>
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium">Member</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Role</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Joined</th>
                          <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {members.map((member) => (
                          <tr key={member.id} className={`${darkMode ? "bg-[#1E1E1E] hover:bg-gray-800/50" : "bg-white hover:bg-gray-50"}`}>
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <div className={`h-8 w-8 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-200"} flex items-center justify-center text-sm font-semibold uppercase`}>
                                  {member.user.name?.charAt(0) || member.user.email?.charAt(0) || '?'}
                                </div>
                                <div className="ml-3">
                                  <p className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                                    {member.user.name || 'Unnamed User'}
                                  </p>
                                  <p className="text-xs text-gray-500">{member.user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <select
                                value={member.role}
                                onChange={(e) => handleUpdateMemberRole(member.id, e.target.value)}
                                className={`rounded-md border ${
                                  darkMode 
                                    ? "border-gray-700 bg-gray-800 text-white" 
                                    : "border-gray-300 bg-white text-gray-900"
                                } px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500`}
                              >
                                <option value="ADMIN">Admin</option>
                                <option value="MANAGER">Manager</option>
                                <option value="MEMBER">Member</option>
                                <option value="GUEST">Guest</option>
                              </select>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {new Date(member.joinedAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => handleRemoveMember(member.id)}
                                className={`rounded-md p-1 ${
                                  darkMode 
                                    ? "hover:bg-red-900/30 text-red-400" 
                                    : "hover:bg-red-100 text-red-600"
                                }`}
                                title="Remove member"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className={`mb-2 text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Invite new member
                    </h4>
                    <div className="flex space-x-2">
                      <input
                        type="email"
                        placeholder="Email address"
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                        className={`flex-1 rounded-md border ${
                          darkMode 
                            ? "border-gray-700 bg-gray-800 text-white" 
                            : "border-gray-300 bg-white text-gray-900"
                        } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
                      />
                      <select
                        value={newMemberRole}
                        onChange={(e) => setNewMemberRole(e.target.value)}
                        className={`rounded-md border ${
                          darkMode 
                            ? "border-gray-700 bg-gray-800 text-white" 
                            : "border-gray-300 bg-white text-gray-900"
                        } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
                      >
                        <option value="ADMIN">Admin</option>
                        <option value="MANAGER">Manager</option>
                        <option value="MEMBER">Member</option>
                        <option value="GUEST">Guest</option>
                      </select>
                      <button
                        onClick={handleInviteMember}
                        disabled={isSaving || !newMemberEmail}
                        className={`flex items-center rounded-md ${
                          darkMode
                            ? "bg-emerald-600 hover:bg-emerald-700"
                            : "bg-emerald-500 hover:bg-emerald-600"
                        } px-4 py-2 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-70`}
                      >
                        {isSaving ? (
                          <LoadingSpinner size={16} />
                        ) : (
                          <>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Invite
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
                  <h3 className="mb-4 text-lg font-medium text-red-600 dark:text-red-400">Danger Zone</h3>
                  <button 
                    className={`rounded-md border ${
                      darkMode
                        ? "border-red-900 bg-red-900/20 text-red-400 hover:bg-red-900/30"
                        : "border-red-200 bg-red-100 text-red-600 hover:bg-red-200"
                    } px-4 py-2 text-sm font-medium transition-colors`}
                  >
                    Delete Workspace
                  </button>
                </div>
              </motion.div>
            )}
            
            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="mb-6 text-xl font-semibold">Appearance Settings</h2>
                
                <div className="mb-6">
                  <h3 className={`mb-3 text-lg font-medium ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                    Theme
                  </h3>
                  <div className="flex space-x-4">
                    <div
                      onClick={darkMode ? undefined : toggleDarkMode}
                      className={`relative flex cursor-pointer flex-col items-center rounded-lg border p-4 ${
                        darkMode
                          ? "border-emerald-500 bg-[#1A1A1A]"
                          : "border-gray-200 bg-gray-50 hover:border-gray-300"
                      }`}
                    >
                      <div className="mb-2 rounded-md bg-gray-900 p-3">
                        <Moon className={`h-6 w-6 ${darkMode ? "text-emerald-500" : "text-gray-400"}`} />
                      </div>
                      <span className={`text-sm font-medium ${darkMode ? "text-emerald-500" : "text-gray-900"}`}>
                        Dark
                      </span>
                      {darkMode && (
                        <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                          <Check size={12} />
                        </span>
                      )}
                    </div>
                    
                    <div
                      onClick={darkMode ? toggleDarkMode : undefined}
                      className={`relative flex cursor-pointer flex-col items-center rounded-lg border p-4 ${
                        !darkMode
                          ? "border-emerald-500 bg-white"
                          : "border-gray-700 bg-gray-800 hover:border-gray-600"
                      }`}
                    >
                      <div className="mb-2 rounded-md bg-blue-50 p-3">
                        <Sun className={`h-6 w-6 ${!darkMode ? "text-emerald-500" : "text-gray-600"}`} />
                      </div>
                      <span className={`text-sm font-medium ${!darkMode ? "text-emerald-500" : "text-gray-300"}`}>
                        Light
                      </span>
                      {!darkMode && (
                        <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                          <Check size={12} />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className={`mb-3 text-lg font-medium ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                    Default View
                  </h3>
                  <div className="max-w-md">
                    <select
                      className={`w-full rounded-md border ${
                        darkMode 
                          ? "border-gray-700 bg-gray-800 text-white" 
                          : "border-gray-300 bg-white text-gray-900"
                      } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
                    >
                      <option value="kanban">Kanban Board</option>
                      <option value="list">List View</option>
                      <option value="calendar">Calendar View</option>
                      <option value="timeline">Timeline View</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="mb-6 text-xl font-semibold">Notification Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                        Email Notifications
                      </h3>
                      <p className="text-xs text-gray-500">Receive notifications via email</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input 
                        type="checkbox" 
                        checked={notifications.emailNotifications}
                        onChange={() => setNotifications({...notifications, emailNotifications: !notifications.emailNotifications})}
                        className="peer sr-only" 
                      />
                      <div className={`peer h-6 w-11 rounded-full ${
                        darkMode ? "bg-gray-700" : "bg-gray-200"
                      } after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500/50`}></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                        Task Assignments
                      </h3>
                      <p className="text-xs text-gray-500">Notify when you're assigned to a task</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input 
                        type="checkbox" 
                        checked={notifications.taskAssignments}
                        onChange={() => setNotifications({...notifications, taskAssignments: !notifications.taskAssignments})}
                        className="peer sr-only" 
                      />
                      <div className={`peer h-6 w-11 rounded-full ${
                        darkMode ? "bg-gray-700" : "bg-gray-200"
                      } after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500/50`}></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                        Mentions
                      </h3>
                      <p className="text-xs text-gray-500">Notify when you're mentioned in comments</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input 
                        type="checkbox" 
                        checked={notifications.mentions}
                        onChange={() => setNotifications({...notifications, mentions: !notifications.mentions})}
                        className="peer sr-only" 
                      />
                      <div className={`peer h-6 w-11 rounded-full ${
                        darkMode ? "bg-gray-700" : "bg-gray-200"
                      } after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500/50`}></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                        Project Updates
                      </h3>
                      <p className="text-xs text-gray-500">Notify of important project changes</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input 
                        type="checkbox" 
                        checked={notifications.projectUpdates}
                        onChange={() => setNotifications({...notifications, projectUpdates: !notifications.projectUpdates})}
                        className="peer sr-only" 
                      />
                      <div className={`peer h-6 w-11 rounded-full ${
                        darkMode ? "bg-gray-700" : "bg-gray-200"
                      } after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500/50`}></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                        Daily Digest
                      </h3>
                      <p className="text-xs text-gray-500">Receive a daily summary of activities</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input 
                        type="checkbox" 
                        checked={notifications.dailyDigest}
                        onChange={() => setNotifications({...notifications, dailyDigest: !notifications.dailyDigest})}
                        className="peer sr-only" 
                      />
                      <div className={`peer h-6 w-11 rounded-full ${
                        darkMode ? "bg-gray-700" : "bg-gray-200"
                      } after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500/50`}></div>
                    </label>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleNotificationUpdate}
                    disabled={isSaving}
                    className={`flex items-center rounded-md ${
                      darkMode
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-emerald-500 hover:bg-emerald-600"
                    } px-4 py-2 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-70`}
                  >
                    {isSaving ? (
                      <>
                        <LoadingSpinner size={16} className="mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Settings;
