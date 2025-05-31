import { VideoIcon, Clipboard, Users } from "lucide-react";

interface FeaturesSectionProps {
  darkMode: boolean;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ darkMode }) => {
  return (
    <section id="features" className="py-16 md:py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Powerful Collaboration Features
        </h2>
        <p
          className={`text-center mx-auto max-w-3xl mb-16 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          Everything your team needs to work efficiently in one platform
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div
            className={`rounded-xl p-6 ${darkMode ? "bg-[#171717]" : "bg-white shadow-md"} 
            transform transition-all hover:scale-105 border ${darkMode ? "border-[#2C2C2C]" : "border-gray-200"}`}
          >
            <div className="p-3 mb-4 rounded-lg inline-block bg-emerald-500 bg-opacity-20">
              <VideoIcon size={24} className="text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">One-Click Video Meetings</h3>
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
              Join video calls instantly with a single click – no setup
              required.
            </p>
          </div>

          {/* Feature 2 */}
          <div
            className={`rounded-xl p-6 ${darkMode ? "bg-[#171717]" : "bg-white shadow-md"} 
            transform transition-all hover:scale-105 border ${darkMode ? "border-[#2C2C2C]" : "border-gray-200"}`}
          >
            <div className="p-3 mb-4 rounded-lg inline-block bg-emerald-500 bg-opacity-20">
              <Clipboard size={24} className="text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Project Management</h3>
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
              Organize tasks with Kanban boards, timelines, and team
              assignments.
            </p>
          </div>

          {/* Feature 3 */}
          <div
            className={`rounded-xl p-6 ${darkMode ? "bg-[#171717]" : "bg-white shadow-md"} 
            transform transition-all hover:scale-105 border ${darkMode ? "border-[#2C2C2C]" : "border-gray-200"}`}
          >
            <div className="p-3 mb-4 rounded-lg inline-block bg-emerald-500 bg-opacity-20">
              <Users size={24} className="text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Create or Join Rooms</h3>
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
              Start a new workspace or jump into an existing one with a room
              code.
            </p>
          </div>

          {/* Feature 4 */}
          <div
            className={`rounded-xl p-6 ${darkMode ? "bg-[#171717]" : "bg-white shadow-md"} 
            transform transition-all hover:scale-105 border ${darkMode ? "border-[#2C2C2C]" : "border-gray-200"}`}
          >
            <div className="p-3 mb-4 rounded-lg inline-block bg-emerald-500 bg-opacity-20">
              <Users size={24} className="text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Real-Time Collaboration</h3>
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
              Work together with live chat, whiteboards, and shared docs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
