import React from 'react';

interface TrustedBySectionProps {
  darkMode: boolean;
}

const TrustedBySection: React.FC<TrustedBySectionProps> = ({ darkMode }) => {
  return (
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
  );
};

export default TrustedBySection;
