import React from 'react';
import { ArrowRight } from "lucide-react";

interface CallToActionProps {
  darkMode: boolean;
}

const CallToAction: React.FC<CallToActionProps> = ({ darkMode }) => {
  return (
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
  );
};

export default CallToAction;
