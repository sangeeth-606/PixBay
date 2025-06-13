import React from "react";

interface FooterProps {
  darkMode: boolean;
}

const Footer: React.FC<FooterProps> = ({ darkMode }) => {
  return (
    <footer
      className={`py-12 px-6 ${darkMode ? "bg-[#171717] border-t border-[#2C2C2C]" : "bg-gray-100 border-t border-gray-200"}`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center space-x-2 mb-6 md:mb-0">
            <img
              src="/favicon_io/favicon-32x32.png"
              alt="Pixbay Logo"
              className="w-8 h-8"
            />
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

export default Footer;
