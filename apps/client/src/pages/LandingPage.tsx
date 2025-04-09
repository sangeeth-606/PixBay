import { useState } from "react";
import {
  ArrowRight,
  VideoIcon,
  Clipboard,
  Users,
  Moon,
  Sun,
} from "lucide-react";
import { useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import SignIn from "../components/SignIn";

interface Workspace {
  id: string | number;
  name: string;
  // Add other properties your workspace objects have
}

const WorkSpaceNameCode = () => {
  const characters = "0123456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

const LandingPage = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [roomCode, setRoomCode] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [userName, setUserName] = useState("");
  const [showNameModal, setShowNameModal] = useState(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [workspaceNameInput, setWorkspaceNameInput] = useState("pixbay");
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState("");

  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();

  const email = user?.emailAddresses?.[0]?.emailAddress || null;
  console.log(email);

  useEffect(() => {
    if (isSignedIn && email) {
      const storedName = localStorage.getItem("userName");
      if (storedName) {
        setUserName(storedName);
      } else {
        setShowNameModal(true);
      }
    }
  }, [isSignedIn, email]);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      if (isSignedIn) {
        try {
          const token = await getToken();
          const response = await axios.get(
            "http://localhost:5000/api/workspaces/user",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          setWorkspaces(response.data);
        } catch (error) {
          console.error("Error fetching workspaces:", error);
        }
      }
    };
    fetchWorkspaces();
  }, [isSignedIn, getToken]);

  const handleNameSubmit = async () => {
    if (userName.trim() && email) {
      localStorage.setItem("userName", userName);
      setShowNameModal(false);
      try {
        await axios.post("http://localhost:5000/api/users", {
          email,
          name: userName,
          role: "MEMBER",
        });
        console.log("User created in database");
      } catch (error) {
        console.error("Error creating user:", error);
      }
    }
  };
  const ShowMaodalForSpace = () => {
    setShowWorkspaceModal(true);
  };

  const handleCreateWorkspace = async () => {
    // const { getToken } = useAuth(); // 👈 getToken comes from Clerk
    const token = await getToken(); // 👈 get the session token
    if (!isSignedIn) {
      alert('Please sign in to create a room.');
      return;
    }

    const randomCode = WorkSpaceNameCode();
    const finalWorkspaceName = `${workspaceNameInput}-${randomCode}`;


    try {
      await axios.post(
        "http://localhost:5000/api/workspaces/create",
        {
          name: finalWorkspaceName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // 👈 pass token to backend
          },
        }
      );

      console.log("Workspace created with name:", finalWorkspaceName);
      setShowWorkspaceModal(false);
      navigate("/dashboard", { state: { workSpaceCode: finalWorkspaceName } });
    } catch (error) {
      console.error("Error creating workspace:", error);
    }
  };

  const handleJoinWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = await getToken();
    const workspaceName = roomCode;

    if (!isSignedIn) {
      alert('Please sign in to create a room.');
      return;
    }
    try {
      await axios.post(
        "http://localhost:5000/api/workspaces/join",
        { workspaceName: workspaceName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("joined WorkSpace:", workspaceName);
      navigate("/dashboard", { state: { workSpaceCode: workspaceName } });
    } catch (error) {
      // Type check the error as an AxiosError
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          alert("You are already a member of this workspace!");
          navigate("/dashboard", { state: { workSpaceCode: workspaceName } });
        } else {
          console.error("Error joining workspace:", error);
        }
      } else {
        console.error("Error joining workspace:", error);
      }
    }
  };
  const handleWorkspaceSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    
    const selectedWorkspaceName = e.target.value;
    
    setSelectedWorkspace(selectedWorkspaceName);
    if (selectedWorkspaceName) {
      navigate("/dashboard", {
        state: { workSpaceCode: selectedWorkspaceName },
      });
    }
  };

  const handleVideoMeetingClick = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      className={`min-h-screen w-full ${darkMode ? "bg-[#1C1C1C] text-white" : "bg-[#F5F5F5] text-[#212121]"}`}
    >
      {/* Navigation */}
      <nav
        className={` sticky top-0 px-6 py-4 flex justify-between items-center border-b ${
          darkMode
            ? "bg-[#171717] border-[#2C2C2C]"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-md"></div>
          <span className="text-xl font-bold">Pixbay </span>
        </div>
        <div className="flex items-center space-x-6">
          <div className="hidden md:flex space-x-6">
            <a
              href="#features"
              className="hover:text-emerald-500 transition-colors"
            >
              Features
            </a>
            <a
              href="#projects"
              className="hover:text-emerald-500 transition-colors"
            >
              Projects
            </a>
            <a
              href="#pricing"
              className="hover:text-emerald-500 transition-colors"
            >
              Pricing
            </a>
            <div className="text-gray-600 hover:text-indigo-600 font-semibold">
              <SignIn />
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${
              darkMode
                ? "bg-[#2C2C2C] hover:bg-[#333]"
                : "bg-gray-200 hover:bg-gray-300"
            } transition-colors`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      {showWorkspaceModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
        >
          <div className="px-6 py-4 rounded-md shadow-lg bg-white text-[#212121] border border-gray-300">
            <h3 className="text-center text-lg font-semibold mb-4">
              Create a Name for Your Space
            </h3>
            <p className="mb-2 text-sm text-gray-600">
              Enter a name for your workspace. It will be combined with a random
              code.
            </p>
            <input
              type="text"
              value={workspaceNameInput}
              onChange={(e) => setWorkspaceNameInput(e.target.value)}
              placeholder="Enter workspace name"
              className="w-full p-2 rounded-md border bg-gray-50 border-gray-300 text-[#212121]"
            />
            <button
              onClick={handleCreateWorkspace}
              className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-md font-medium transition-colors w-full"
            >
              Create Workspace
            </button>
          </div>
        </div>
      )}
      {showNameModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
        >
          <div
            className={`px-6 py-4 rounded-md shadow-lg ${
              darkMode ? "bg-[#2C2C2C] text-white" : "bg-white text-[#212121]"
            } border ${darkMode ? "border-[#333]" : "border-gray-300"}`}
          >
            <h3 className="text-center text-lg font-semibold mb-4">
              Enter Your Name
            </h3>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              className={`w-full p-2 rounded-md border ${
                darkMode
                  ? "bg-[#1C1C1C] border-[#333] text-white"
                  : "bg-white border-gray-300 text-[#212121]"
              }`}
            />
            <button
              onClick={handleNameSubmit}
              className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-md font-medium transition-colors w-full"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      <section className="relative px-6 py-16 md:py-24">
        {/* Background pattern */}

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute transform rotate-45 opacity-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-[100px] w-[800px] bg-emerald-500 my-[100px] ml-[-400px]"
                style={{ transform: `translateX(${i * 200}px)` }}
              ></div>
            ))}
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-inter">
            Work Together, Anywhere with
            <br />
            <span className="gradient-text">Pixbay </span>
          </h1>

          <p
            className={`text-lg md:text-xl mx-auto max-w-3xl mb-10 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Create or join rooms, manage projects, and connect with one-click
            video meetings.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={ShowMaodalForSpace}
              className="bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-6 rounded-md font-medium flex items-center transition-all transform hover:scale-105"
            >
              Create a Room
              <ArrowRight className="ml-2" size={18} />
            </button>

            <form onSubmit={handleJoinWorkspace} className="flex">
              <input
                type="text"
                placeholder="Enter Room Code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                className={`py-3 px-4 rounded-l-md border-r-0 w-36 md:w-48 focus:outline-none ${
                  darkMode
                    ? "bg-[#2C2C2C] border-[#333]"
                    : "bg-white border-gray-300"
                }`}
              />
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-6 rounded-r-md font-medium transition-colors"
              >
                Join Room
              </button>
            </form>

            <select
              className={`py-3 px-6 rounded-md font-medium transition-all transform hover:scale-105 ${
                darkMode
                  ? "bg-[#2C2C2C] hover:bg-[#333] text-white border border-[#333]"
                  : "bg-white hover:bg-gray-100 text-[#212121] border border-gray-300"
              }`}
              onChange={handleWorkspaceSelect}
              value={selectedWorkspace}
            >
              <option
                value=""
                disabled
                className={darkMode ? "bg-[#1C1C1C]" : "bg-white"}
              >
                All your spaces
              </option>
              {workspaces.map((workspace) => (
                <option
                  key={workspace.id}
                  value={workspace.name}
                  className={darkMode ? "bg-[#1C1C1C]" : "bg-white"}
                >
                  {workspace.name}
                </option>
              ))}
            </select>
          </div>

          {/* Hero Image */}
          {showAlert && (
            <div
              className={`fixed inset-0 flex items-center justify-center z-50`}
              style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
            >
              <div
                className={`px-6 py-4 rounded-md shadow-lg ${
                  darkMode
                    ? "bg-[#2C2C2C] text-white"
                    : "bg-white text-[#212121]"
                } border ${darkMode ? "border-[#333]" : "border-gray-300"}`}
              >
                <p className="text-center font-medium">Join the room first</p>
                <button
                  onClick={() => setShowAlert(false)}
                  className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-md font-medium transition-colors w-full"
                >
                  Close
                </button>
              </div>
            </div>
          )}
          <div
            className={`relative mx-auto w-full max-w-4xl rounded-xl overflow-hidden border ${
              darkMode
                ? "border-[#2C2C2C] bg-[#171717]"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="h-[300px] md:h-[400px] flex items-center justify-center">
              {/* Platform Interface mockup */}
              <div className="w-full max-w-3xl p-4">
                <div
                  className={`w-full mb-4 flex items-center justify-between ${
                    darkMode ? "bg-[#1C1C1C]" : "bg-gray-100"
                  } p-3 rounded-lg`}
                >
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#ef4444] mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-[#f59e0b] mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  </div>
                  <div
                    className={`px-4 py-1 rounded-md text-xs ${
                      darkMode ? "bg-[#2C2C2C]" : "bg-gray-200"
                    }`}
                  >
                    pixbay.workspace/room/XYZ-123
                  </div>
                  <div className="flex items-center space-x-3">
                    <VideoIcon size={16} className="text-emerald-500" />
                    <Users
                      size={16}
                      className={darkMode ? "text-gray-400" : "text-gray-600"}
                    />
                    <Clipboard size={16} className="text-emerald-500" />
                  </div>
                </div>

                <div className="flex w-full h-48 gap-4">
                  {/* Sidebar */}
                  <div
                    className={`w-1/4 rounded-lg ${
                      darkMode ? "bg-[#1C1C1C]" : "bg-gray-100"
                    } p-3`}
                  >
                    <div className="w-full h-6 mb-3 rounded-md bg-emerald-500 bg-opacity-20"></div>
                    {[1, 2, 3, 4].map((item) => (
                      <div
                        key={item}
                        className={`w-full h-4 mb-2 rounded-md ${
                          darkMode ? "bg-[#2C2C2C]" : "bg-gray-200"
                        }`}
                      ></div>
                    ))}
                  </div>

                  {/* Main content */}
                  <div
                    className={`flex-1 rounded-lg ${
                      darkMode ? "bg-[#1C1C1C]" : "bg-gray-100"
                    } p-3`}
                  >
                    <div className="flex justify-between mb-3">
                      <div
                        className={`w-1/3 h-6 rounded-md ${
                          darkMode ? "bg-[#2C2C2C]" : "bg-gray-200"
                        }`}
                      ></div>
                      <div className="w-24 h-6 rounded-md bg-emerald-500 bg-opacity-30"></div>
                    </div>

                    {/* Kanban-like board */}
                    <div className="flex gap-2 h-32">
                      {[1, 2, 3].map((col) => (
                        <div
                          key={col}
                          className={`flex-1 rounded-md p-2 ${
                            darkMode ? "bg-[#2C2C2C]" : "bg-gray-200"
                          }`}
                        >
                          <div
                            className={`w-full h-4 mb-2 rounded-sm ${
                              darkMode ? "bg-[#333]" : "bg-gray-300"
                            }`}
                          ></div>
                          <div
                            className={`w-full h-16 rounded-sm bg-emerald-500 bg-opacity-30`}
                          ></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section
        className={`py-12 ${darkMode ? "bg-[#171717]" : "bg-white"} border-y ${
          darkMode ? "border-[#2C2C2C]" : "border-gray-200"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p
            className={`text-sm mb-6 uppercase tracking-wide ${darkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Trusted by teams worldwide
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              "Company A",
              "Company B",
              "Company C",
              "Company D",
              "Company E",
            ].map((company, i) => (
              <div
                key={i}
                className={`text-lg font-medium ${darkMode ? "text-gray-300" : "text-gray-500"}`}
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
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
              <h3 className="text-xl font-bold mb-2">
                One-Click Video Meetings
              </h3>
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
              <h3 className="text-xl font-bold mb-2">
                Real-Time Collaboration
              </h3>
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                Work together with live chat, whiteboards, and shared docs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Showcase Section */}
      <section
        id="projects"
        className={`py-16 md:py-24 px-6 ${darkMode ? "bg-[#171717]" : "bg-gray-100"} border-y ${
          darkMode ? "border-[#2C2C2C]" : "border-gray-200"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            What You Can Build
          </h2>
          <p
            className={`text-center mx-auto max-w-3xl mb-16 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Create different types of projects for any team or purpose
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "App Design", type: "Design Project", color: "emerald" },
              {
                title: "Marketing Campaign",
                type: "Marketing Project",
                color: "emerald",
              },
              {
                title: "Product Launch",
                type: "Product Project",
                color: "emerald",
              },
              {
                title: "Development Sprint",
                type: "Engineering Project",
                color: "emerald",
              },
              {
                title: "Content Calendar",
                type: "Content Project",
                color: "emerald",
              },
              {
                title: "Research Study",
                type: "Research Project",
                color: "emerald",
              },
            ].map((project, i) => (
              <div
                key={i}
                className={`rounded-xl overflow-hidden transform transition-all hover:scale-105 ${
                  darkMode ? "bg-[#1C1C1C]" : "bg-white shadow-md"
                } border ${darkMode ? "border-[#2C2C2C]" : "border-gray-200"}`}
              >
                <div className={`h-40 bg-${project.color}-500 bg-opacity-20`}>
                  <div className="h-full flex items-center justify-center">
                    <div
                      className={`h-20 w-20 rounded-xl bg-${project.color}-500`}
                    ></div>
                  </div>
                </div>
                <div className="p-6">
                  <div
                    className={`text-sm rounded-full inline-block px-3 py-1 mb-2 ${
                      darkMode ? "bg-[#2C2C2C]" : "bg-gray-100"
                    }`}
                  >
                    {project.type}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p
                    className={`mb-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Collaborate with your team on this{" "}
                    {project.type.toLowerCase()}.
                  </p>
                  <button className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-md text-sm transition-colors">
                    Join Project
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 px-6 relative">
        {/* Background pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute transform rotate-[135deg] opacity-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-[100px] w-[800px] bg-emerald-500 my-[100px] ml-[-400px]"
                style={{ transform: `translateX(${i * 200}px)` }}
              ></div>
            ))}
          </div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p
            className={`mx-auto max-w-2xl mb-10 text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Create a room or join your team in seconds. Experience the future of
            collaborative workspaces.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-8 rounded-md font-medium text-lg flex items-center transition-all transform hover:scale-105">
              Sign Up Free
              <ArrowRight className="ml-2" size={18} />
            </button>
            <button
              className={`py-3 px-8 rounded-md font-medium text-lg transition-all transform hover:scale-105 ${
                darkMode
                  ? "bg-[#171717] hover:bg-[#2C2C2C] text-white border border-[#2C2C2C]"
                  : "bg-white hover:bg-gray-100 text-[#212121] border border-gray-300"
              }`}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`py-12 px-6 ${darkMode ? "bg-[#171717] border-t border-[#2C2C2C]" : "bg-gray-100 border-t border-gray-200"}`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <div className="w-8 h-8 bg-emerald-500 rounded-md"></div>
              <span className="text-xl font-bold">Pixbay </span>
            </div>
            <div className="flex space-x-4">
              <a
                href="#"
                className={`${darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"} transition-colors`}
              >
                About
              </a>
              <a
                href="#"
                className={`${darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"} transition-colors`}
              >
                Features
              </a>
              <a
                href="#"
                className={`${darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"} transition-colors`}
              >
                Support
              </a>
              <a
                href="#"
                className={`${darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"} transition-colors`}
              >
                Contact
              </a>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p
              className={`${darkMode ? "text-gray-400" : "text-gray-600"} mb-4 md:mb-0`}
            >
              © 2025 Pixbay . All rights reserved.
            </p>
            <div className="flex space-x-4">
              {[TwitterIcon, LinkedInIcon, GithubIcon, DiscordIcon].map(
                (Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className={`${darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"} transition-colors`}
                  >
                    <Icon />
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Simple icons for the footer
const TwitterIcon = () => (
  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23 3a10 10 0 01-3 1 5 5 0 00-8.5 4.5v1A10 10 0 013 4s-4 9 5 13a11 11 0 01-7 2c9 5 20 0 20-11.5a6 6 0 00-.1-1c1-.7 1.8-1.8 2.1-3z"></path>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const GithubIcon = () => (
  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"></path>
  </svg>
);

const DiscordIcon = () => (
  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"></path>
  </svg>
);

export default LandingPage;
