// import { useState } from "react";
// import {
//   ArrowRight,
//   Moon,
//   Sun,
// } from "lucide-react";
// import { useEffect } from "react";
// import axios from "axios";
// import { useUser } from "@clerk/clerk-react";
// import { useAuth } from "@clerk/clerk-react";
// import { useNavigate } from "react-router-dom";
// import SignIn from "../components/SignIn";
// import Footer from "../components/Footer";
// import CallToAction from "../components/CallToAction";
// import ProjectsSection from "../components/ProjectsSection";
// import FeaturesSection from "../components/FeaturesSection";
// import TrustedBySection from "../components/TrustedBySection";
// import PlatFormMockup from "../icons/PlatFormMockup";

// interface Workspace {
//   id: string | number;
//   name: string;

// }

// const WorkSpaceNameCode = () => {
//   const characters = "0123456789";
//   let code = "";
//   for (let i = 0; i < 4; i++) {
//     code += characters.charAt(Math.floor(Math.random() * characters.length));
//   }
//   return code;
// };

// const LandingPage = () => {
//   const [darkMode, setDarkMode] = useState(true);
//   const [roomCode, setRoomCode] = useState("");
//   const [showAlert, setShowAlert] = useState(false);
//   const [userName, setUserName] = useState("");
//   const [showNameModal, setShowNameModal] = useState(false);
//   const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
//   const [workspaceNameInput, setWorkspaceNameInput] = useState("pixbay");
//   const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
//   const [selectedWorkspace, setSelectedWorkspace] = useState("");

//   const { isSignedIn, getToken } = useAuth();
//   const { user } = useUser();
//   const navigate = useNavigate();

//   const email = user?.emailAddresses?.[0]?.emailAddress || null;
//   console.log(email);

//   useEffect(() => {
//     const checkUserInDatabase = async () => {
//       if (isSignedIn && email) {
//         const storedName = localStorage.getItem("userName");
        
      
//         try {
//           const token = await getToken();
//           const response = await axios.get(
//             `http://localhost:5000/api/users/check?email=${encodeURIComponent(email)}`,
//             {
//               headers: { Authorization: `Bearer ${token}` },
//             }
//           );

//           if (response.data.exists && storedName) {
        
//             setUserName(storedName);
//           } else {
//             // Either user doesn't exist in DB OR we don't have a stored name
//             setShowNameModal(true);
//             if (storedName) setUserName(storedName); // Pre-fill with stored name if available
//           }
//         } catch (error) {
//           console.error("Error checking user:", error);
//           // If there's an error, show the modal to be safe
//           setShowNameModal(true);
//           if (storedName) setUserName(storedName);
//         }
//       }
//     };

//     checkUserInDatabase();
//   }, [isSignedIn, email, getToken]);

//   useEffect(() => {
//     const fetchWorkspaces = async () => {
//       if (isSignedIn) {
//         try {
//           const token = await getToken();
//           const response = await axios.get(
//             "http://localhost:5000/api/workspaces/user",
//             {
//               headers: { Authorization: `Bearer ${token}` },
//             }
//           );

//           setWorkspaces(response.data);
//         } catch (error) {
//           console.error("Error fetching workspaces:", error);
//         }
//       }
//     };
//     fetchWorkspaces();
//   }, [isSignedIn, getToken]);

//   const handleNameSubmit = async () => {
//     if (userName.trim() && email) {
//       localStorage.setItem("userName", userName);
//       setShowNameModal(false);
//       try {
//         await axios.post("http://localhost:5000/api/users", {
//           email,
//           name: userName,
//           role: "MEMBER",
//         });
//         console.log("User created in database");
//       } catch (error) {
//         console.error("Error creating user:", error);
//       }
//     }
//   };
//   const ShowMaodalForSpace = () => {
//     setShowWorkspaceModal(true);
//   };

//   const handleCreateWorkspace = async () => {
//     // const { getToken } = useAuth(); // 👈 getToken comes from Clerk
//     const token = await getToken(); // 👈 get the session token
//     if (!isSignedIn) {
//       alert('Please sign in to create a room.');
//       return;
//     }

//     const randomCode = WorkSpaceNameCode();
//     const finalWorkspaceName = `${workspaceNameInput}-${randomCode}`;


//     try {
//       await axios.post(
//         "http://localhost:5000/api/workspaces/create",
//         {
//           name: finalWorkspaceName,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, // 👈 pass token to backend
//           },
//         }
//       );

//       console.log("Workspace created with name:", finalWorkspaceName);
//       setShowWorkspaceModal(false);
//       navigate(`/workspace/${finalWorkspaceName}`);
//     } catch (error) {
//       console.error("Error creating workspace:", error);
//     }
//   };

//   const handleJoinWorkspace = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const token = await getToken();
//     const workspaceName = roomCode;

//     if (!isSignedIn) {
//       alert('Please sign in to create a room.');
//       return;
//     }
//     try {
//       await axios.post(
//         "http://localhost:5000/api/workspaces/join",
//         { workspaceName: workspaceName },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       console.log("joined WorkSpace:", workspaceName);
//       navigate(`/workspace/${workspaceName}`);
//     } catch (error) {
//       // Type check the error as an AxiosError
//       if (axios.isAxiosError(error)) {
//         if (error.response?.status === 400) {
//           alert("You are already a member of this workspace!");
//           navigate(`/workspace/${workspaceName}`);
//         } else {
//           console.error("Error joining workspace:", error);
//         }
//       } else {
//         console.error("Error joining workspace:", error);
//       }
//     }
//   };
//   const handleWorkspaceSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    
//     const selectedWorkspaceName = e.target.value;
    
//     setSelectedWorkspace(selectedWorkspaceName);
//     if (selectedWorkspaceName) {
//       navigate(`/workspace/${selectedWorkspaceName}`);
//     }
//   };

//   const handleVideoMeetingClick = () => {
//     setShowAlert(true);
//     setTimeout(() => setShowAlert(false), 3000);
//   };

//   const toggleTheme = () => {
//     setDarkMode(!darkMode);
//   };

//   return (
//     <div
//       className={`min-h-screen w-full ${darkMode ? "bg-[#1C1C1C] text-white" : "bg-[#F5F5F5] text-[#212121]"}`}
//     >
//       {/* Navigation */}
//       <nav
//         className={` sticky top-0 px-6 py-4 flex justify-between items-center border-b ${
//           darkMode
//             ? "bg-[#171717] border-[#2C2C2C]"
//             : "bg-white border-gray-200"
//         }`}
//       >
//         <div className="flex items-center space-x-2">
//           <div className="w-8 h-8 bg-emerald-500 rounded-md"></div>
//           <span className="text-xl font-bold">Pixbay </span>
//         </div>
//         <div className="flex items-center space-x-6">
//           <div className="hidden md:flex space-x-6">
//             <a
//               href="#features"
//               className="hover:text-emerald-500 transition-colors"
//             >
//               Features
//             </a>
//             <a
//               href="#projects"
//               className="hover:text-emerald-500 transition-colors"
//             >
//               Projects
//             </a>
//             <a
//               href="#pricing"
//               className="hover:text-emerald-500 transition-colors"
//             >
//               Pricing
//             </a>
//             <div className="text-gray-600 hover:text-indigo-600 font-semibold">
//               <SignIn />
//             </div>
//           </div>
//           <button
//             onClick={toggleTheme}
//             className={`p-2 rounded-full ${
//               darkMode
//                 ? "bg-[#2C2C2C] hover:bg-[#333]"
//                 : "bg-gray-200 hover:bg-gray-300"
//             } transition-colors`}
//           >
//             {darkMode ? <Sun size={20} /> : <Moon size={20} />}
//           </button>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       {showWorkspaceModal && (
//         <div
//           className="fixed inset-0 flex items-center justify-center z-50"
//           style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
//         >
//           <div className="px-6 py-4 rounded-md shadow-lg bg-white text-[#212121] border border-gray-300">
//             <h3 className="text-center text-lg font-semibold mb-4">
//               Create a Name for Your Space
//             </h3>
//             <p className="mb-2 text-sm text-gray-600">
//               Enter a name for your workspace. It will be combined with a random
//               code.
//             </p>
//             <input
//               type="text"
//               value={workspaceNameInput}
//               onChange={(e) => setWorkspaceNameInput(e.target.value)}
//               placeholder="Enter workspace name"
//               className="w-full p-2 rounded-md border bg-gray-50 border-gray-300 text-[#212121]"
//             />
//             <button
//               onClick={handleCreateWorkspace}
//               className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-md font-medium transition-colors w-full"
//             >
//               Create Workspace
//             </button>
//           </div>
//         </div>
//       )}
//       {showNameModal && (
//         <div
//           className="fixed inset-0 flex items-center justify-center z-50"
//           style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
//         >
//           <div
//             className={`px-6 py-4 rounded-md shadow-lg ${
//               darkMode ? "bg-[#2C2C2C] text-white" : "bg-white text-[#212121]"
//             } border ${darkMode ? "border-[#333]" : "border-gray-300"}`}
//           >
//             <h3 className="text-center text-lg font-semibold mb-4">
//               Enter Your Name
//             </h3>
//             <input
//               type="text"
//               value={userName}
//               onChange={(e) => setUserName(e.target.value)}
//               placeholder="Enter your name"
//               className={`w-full p-2 rounded-md border ${
//                 darkMode
//                   ? "bg-[#1C1C1C] border-[#333] text-white"
//                   : "bg-white border-gray-300 text-[#212121]"
//               }`}
//             />
//             <button
//               onClick={handleNameSubmit}
//               className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-md font-medium transition-colors w-full"
//             >
//               Submit
//             </button>
//           </div>
//         </div>
//       )}

//       <section className="relative px-6 py-16 md:py-24">
//         {/* Background pattern */}

//         <div className="absolute inset-0 overflow-hidden">
//           <div className="absolute transform rotate-45 opacity-5">
//             {Array.from({ length: 10 }).map((_, i) => (
//               <div
//                 key={i}
//                 className="h-[100px] w-[800px] bg-emerald-500 my-[100px] ml-[-400px]"
//                 style={{ transform: `translateX(${i * 200}px)` }}
//               ></div>
//             ))}
//           </div>
//         </div>

//         <div className="relative max-w-6xl mx-auto text-center">
//           <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-inter">
//             Work Together, Anywhere with
//             <br />
//             <span className="gradient-text">Pixbay </span>
//           </h1>

//           <p
//             className={`text-lg md:text-xl mx-auto max-w-3xl mb-10 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
//           >
//             Create or join rooms, manage projects, and connect with one-click
//             video meetings.
//           </p>

//           <div className="flex flex-wrap justify-center gap-4 mb-12">
//             <button
//               onClick={ShowMaodalForSpace}
//               className="bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-6 rounded-md font-medium flex items-center transition-all transform hover:scale-105"
//             >
//               Create a Room
//               <ArrowRight className="ml-2" size={18} />
//             </button>

//             <form onSubmit={handleJoinWorkspace} className="flex">
//               <input
//                 type="text"
//                 placeholder="Enter Room Code"
//                 value={roomCode}
//                 onChange={(e) => setRoomCode(e.target.value)}
//                 className={`py-3 px-4 rounded-l-md border-r-0 w-36 md:w-48 focus:outline-none ${
//                   darkMode
//                     ? "bg-[#2C2C2C] border-[#333]"
//                     : "bg-white border-gray-300"
//                 }`}
//               />
//               <button
//                 type="submit"
//                 className="bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-6 rounded-r-md font-medium transition-colors"
//               >
//                 Join Room
//               </button>
//             </form>

//             <select
//               className={`py-3 px-6 rounded-md font-medium transition-all transform hover:scale-105 ${
//                 darkMode
//                   ? "bg-[#2C2C2C] hover:bg-[#333] text-white border border-[#333]"
//                   : "bg-white hover:bg-gray-100 text-[#212121] border border-gray-300"
//               }`}
//               onChange={handleWorkspaceSelect}
//               value={selectedWorkspace}
//             >
//               <option
//                 value=""
//                 disabled
//                 className={darkMode ? "bg-[#1C1C1C]" : "bg-white"}
//               >
//                 All your spaces
//               </option>
//               {workspaces.map((workspace) => (
//                 <option
//                   key={workspace.id}
//                   value={workspace.name}
//                   className={darkMode ? "bg-[#1C1C1C]" : "bg-white"}
//                 >
//                   {workspace.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Hero Image */}
//           {showAlert && (
//             <div
//               className={`fixed inset-0 flex items-center justify-center z-50`}
//               style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
//             >
//               <div
//                 className={`px-6 py-4 rounded-md shadow-lg ${
//                   darkMode
//                     ? "bg-[#2C2C2C] text-white"
//                     : "bg-white text-[#212121]"
//                 } border ${darkMode ? "border-[#333]" : "border-gray-300"}`}
//               >
//                 <p className="text-center font-medium">Join the room first</p>
//                 <button
//                   onClick={() => setShowAlert(false)}
//                   className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-md font-medium transition-colors w-full"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           )}
//           <div
//             className={`relative mx-auto w-full max-w-4xl rounded-xl overflow-hidden border ${
//               darkMode
//                 ? "border-[#2C2C2C] bg-[#171717]"
//                 : "border-gray-200 bg-white"
//             }`}
//           >
//             <div className="h-[300px] md:h-[400px] flex items-center justify-center">
//               {/* Platform Interface mockup */}
//              <PlatFormMockup darkMode={darkMode}/>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Trusted By Section */}
//       <TrustedBySection darkMode={darkMode}/>

//       {/* Features Section */}
//       <FeaturesSection darkMode={darkMode} />

//       {/* Projects Showcase Section */}
//       <ProjectsSection darkMode={darkMode}/>

//       {/* Call to Action */}
//       <CallToAction darkMode={darkMode} />

//       {/* Footer */}
   
//       <Footer darkMode={darkMode} />
//     </div>
//   );
// };

// export default LandingPage;

import { useState, useEffect } from "react";
import {
  ArrowRight,
  Moon,
  Sun,
} from "lucide-react";
import axios from "axios";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import SignIn from "../components/SignIn";
import Footer from "../components/Footer";
import CallToAction from "../components/CallToAction";
import ProjectsSection from "../components/ProjectsSection";
import FeaturesSection from "../components/FeaturesSection";
import TrustedBySection from "../components/TrustedBySection";
import PlatFormMockup from "../icons/PlatFormMockup";

interface Workspace {
  id: string | number;
  name: string;
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

  // Function to fetch user data from the server
  const fetchUserData = async () => {
    if (isSignedIn && email) {
      try {
        const token = await getToken();
        const response = await axios.get(
          `http://localhost:5000/api/users/check?email=${encodeURIComponent(email)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.exists) {
          // User exists, set the username from the server
          setUserName(response.data.name);
          setShowNameModal(false); // No modal needed
        } else {
          // User doesn’t exist, show the modal
          setShowNameModal(true);
        }
      } catch (error) {
        console.error("Error checking user:", error);
        // On error, show the modal as a fallback
        setShowNameModal(true);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [isSignedIn, email, getToken]);

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
      try {
        const token = await getToken();
        await axios.post(
          "http://localhost:5000/api/users",
          {
            email,
            name: userName,
            role: "MEMBER",
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("User created in database");
        setShowNameModal(false);
        // Fetch user data again to set the username from the server
        await fetchUserData();
      } catch (error) {
        console.error("Error creating user:", error);
      }
    }
  };

  const ShowMaodalForSpace = () => {
    setShowWorkspaceModal(true);
  };

  const handleCreateWorkspace = async () => {
    const token = await getToken();
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
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Workspace created with name:", finalWorkspaceName);
      setShowWorkspaceModal(false);
      navigate(`/workspace/${finalWorkspaceName}`);
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
      navigate(`/workspace/${workspaceName}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          alert("You are already a member of this workspace!");
          navigate(`/workspace/${workspaceName}`);
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
      navigate(`/workspace/${selectedWorkspaceName}`);
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
              <PlatFormMockup darkMode={darkMode} />
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <TrustedBySection darkMode={darkMode} />

      {/* Features Section */}
      <FeaturesSection darkMode={darkMode} />

      {/* Projects Showcase Section */}
      <ProjectsSection darkMode={darkMode} />

      {/* Call to Action */}
      <CallToAction darkMode={darkMode} />

      {/* Footer */}
      <Footer darkMode={darkMode} />
    </div>
  );
};

export default LandingPage;