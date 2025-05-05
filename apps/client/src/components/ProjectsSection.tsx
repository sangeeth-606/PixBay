import React from 'react';

interface ProjectsSectionProps {
  darkMode: boolean;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ darkMode }) => {
  return (
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
  );
};

export default ProjectsSection;
