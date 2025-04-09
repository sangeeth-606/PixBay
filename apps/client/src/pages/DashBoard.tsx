import { useLocation } from 'react-router-dom';

function DashBoard() {
    const location = useLocation();
    const {workSpaceCode} = location.state || {};
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome to the Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Workspace Information</h2>
          <div className="flex items-center">
            <span className="text-gray-600 font-medium">Workspace Code:</span>
            <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-md font-mono">
              {workSpaceCode || "No workspace code provided"}
            </span>
          </div>
        </div>
        
        {/* You can add more dashboard sections here */}
      </div>
    </div>
  )
}

export default DashBoard