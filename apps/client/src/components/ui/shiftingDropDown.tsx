import React, { ReactNode, useEffect, useState } from "react";
import {
  FiArrowRight,
  FiBarChart2,
  FiChevronDown,
  FiHome,
  FiPieChart,
} from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

interface ShiftingDropDownProps {
  darkMode?: boolean;
}

export const ShiftingDropDown: React.FC<ShiftingDropDownProps> = ({
  darkMode = true,
}) => {
  return (
    <div className="flex w-full h-full justify-start md:justify-center relative">
      <Tabs darkMode={darkMode} />
    </div>
  );
};

interface TabsProps {
  darkMode: boolean;
}

const Tabs: React.FC<TabsProps> = ({ darkMode }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [dir, setDir] = useState<null | "l" | "r">(null);

  const handleSetSelected = (val: number | null) => {
    if (typeof selected === "number" && typeof val === "number") {
      setDir(selected > val ? "r" : "l");
    } else if (val === null) {
      setDir(null);
    }

    setSelected(val);
  };

  return (
    <div
      onMouseLeave={() => handleSetSelected(null)}
      className="relative flex h-fit gap-2"
    >
      {TABS.map((t) => {
        return (
          <Tab
            key={t.id}
            selected={selected}
            handleSetSelected={handleSetSelected}
            tab={t.id}
            darkMode={darkMode}
          >
            {t.title}
          </Tab>
        );
      })}

      <AnimatePresence>
        {selected && (
          <Content dir={dir} selected={selected} darkMode={darkMode} />
        )}
      </AnimatePresence>
    </div>
  );
};

interface TabProps {
  children: ReactNode;
  tab: number;
  handleSetSelected: (val: number | null) => void;
  selected: number | null;
  darkMode: boolean;
}

const Tab: React.FC<TabProps> = ({
  children,
  tab,
  handleSetSelected,
  selected,
  darkMode,
}) => {
  return (
    <button
      id={`shift-tab-${tab}`}
      onMouseEnter={() => handleSetSelected(tab)}
      onClick={() => handleSetSelected(tab)}
      className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-sm transition-colors ${
        selected === tab
          ? darkMode
            ? "bg-neutral-800 text-neutral-100"
            : "bg-gray-200 text-gray-900"
          : darkMode
            ? "text-neutral-400"
            : "text-gray-600"
      }`}
    >
      <span>{children}</span>
      <FiChevronDown
        className={`transition-transform ${
          selected === tab ? "rotate-180" : ""
        }`}
      />
    </button>
  );
};

interface ContentProps {
  selected: number | null;
  dir: null | "l" | "r";
  darkMode: boolean;
}

const Content: React.FC<ContentProps> = ({ selected, dir, darkMode }) => {
  return (
    <motion.div
      id="overlay-content"
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: 8,
      }}
      className={`absolute left-0 top-[calc(100%_+_24px)] w-96 rounded-lg border z-50 p-4 ${
        darkMode
          ? "border-neutral-600 bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-800"
          : "border-gray-200 bg-white shadow-lg"
      }`}
    >
      <Bridge />
      <Nub selected={selected} darkMode={darkMode} />

      {TABS.map((t) => {
        return (
          <div className="overflow-hidden" key={t.id}>
            {selected === t.id && (
              <motion.div
                initial={{
                  opacity: 0,
                  x: dir === "l" ? 100 : dir === "r" ? -100 : 0,
                }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                <t.Component darkMode={darkMode} />
              </motion.div>
            )}
          </div>
        );
      })}
    </motion.div>
  );
};

const Bridge = () => (
  <div className="absolute -top-[24px] left-0 right-0 h-[24px]" />
);

interface NubProps {
  selected: number | null;
  darkMode: boolean;
}

const Nub: React.FC<NubProps> = ({ selected, darkMode }) => {
  const [left, setLeft] = useState(0);

  useEffect(() => {
    moveNub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const moveNub = () => {
    if (selected) {
      const hoveredTab = document.getElementById(`shift-tab-${selected}`);
      const overlayContent = document.getElementById("overlay-content");

      if (!hoveredTab || !overlayContent) return;

      const tabRect = hoveredTab.getBoundingClientRect();
      const { left: contentLeft } = overlayContent.getBoundingClientRect();

      const tabCenter = tabRect.left + tabRect.width / 2 - contentLeft;

      setLeft(tabCenter);
    }
  };

  return (
    <motion.span
      style={{
        clipPath: "polygon(0 0, 100% 0, 50% 50%, 0% 100%)",
      }}
      animate={{ left }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className={`absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-tl border ${
        darkMode
          ? "border-neutral-600 bg-neutral-900"
          : "border-gray-200 bg-white"
      }`}
    />
  );
};

interface ComponentProps {
  darkMode: boolean;
}

const Products: React.FC<ComponentProps> = ({ darkMode }) => {
  return (
    <div>
      <div className="flex gap-4">
        <div>
          <h3
            className={`mb-2 text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            Collaboration
          </h3>
          <a
            href="#"
            className={`mb-1 block text-sm ${darkMode ? "text-neutral-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
          >
            Video Meetings
          </a>
          <a
            href="#"
            className={`block text-sm ${darkMode ? "text-neutral-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
          >
            Real-time Chat
          </a>
        </div>
        <div>
          <h3
            className={`mb-2 text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            Project Management
          </h3>
          <a
            href="#"
            className={`mb-1 block text-sm ${darkMode ? "text-neutral-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
          >
            Kanban Boards
          </a>
          <a
            href="#"
            className={`mb-1 block text-sm ${darkMode ? "text-neutral-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
          >
            Sprint Planning
          </a>
          <a
            href="#"
            className={`block text-sm ${darkMode ? "text-neutral-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
          >
            Task Management
          </a>
        </div>
        <div>
          <h3
            className={`mb-2 text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            Workspaces
          </h3>
          <a
            href="#"
            className={`mb-1 block text-sm ${darkMode ? "text-neutral-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
          >
            Create Room
          </a>
          <a
            href="#"
            className={`mb-1 block text-sm ${darkMode ? "text-neutral-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
          >
            Join Existing
          </a>
          <a
            href="#"
            className={`block text-sm ${darkMode ? "text-neutral-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
          >
            Member Management
          </a>
        </div>
      </div>

      <button
        className={`ml-auto mt-4 flex items-center gap-1 text-sm ${darkMode ? "text-emerald-300" : "text-emerald-600"}`}
      >
        <span>Explore all features</span>
        <FiArrowRight />
      </button>
    </div>
  );
};

const Pricing: React.FC<ComponentProps> = ({ darkMode }) => {
  return (
    <div
      className={`grid grid-cols-3 gap-4 divide-x ${darkMode ? "divide-neutral-700" : "divide-gray-200"}`}
    >
      <a
        href="#"
        className={`flex w-full flex-col items-center justify-center py-2 transition-colors ${
          darkMode
            ? "text-neutral-400 hover:text-neutral-50"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        <FiHome
          className={`mb-2 text-xl ${darkMode ? "text-emerald-300" : "text-emerald-600"}`}
        />
        <span className="text-xs">Remote Teams</span>
      </a>
      <a
        href="#"
        className={`flex w-full flex-col items-center justify-center py-2 transition-colors ${
          darkMode
            ? "text-neutral-400 hover:text-neutral-50"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        <FiBarChart2
          className={`mb-2 text-xl ${darkMode ? "text-emerald-300" : "text-emerald-600"}`}
        />
        <span className="text-xs">Project Planning</span>
      </a>
      <a
        href="#"
        className={`flex w-full flex-col items-center justify-center py-2 transition-colors ${
          darkMode
            ? "text-neutral-400 hover:text-neutral-50"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        <FiPieChart
          className={`mb-2 text-xl ${darkMode ? "text-emerald-300" : "text-emerald-600"}`}
        />
        <span className="text-xs">Agile Workflows</span>
      </a>
    </div>
  );
};

const Blog: React.FC<ComponentProps> = ({ darkMode }) => {
  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        <a href="#">
          <div className="mb-2 h-14 w-full rounded object-cover bg-emerald-500/20 flex items-center justify-center">
            <span className="text-emerald-500 font-bold">Guide</span>
          </div>
          <h4
            className={`mb-0.5 text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            Getting Started with Pixbay
          </h4>
          <p
            className={`text-xs ${darkMode ? "text-neutral-400" : "text-gray-600"}`}
          >
            Learn how to create your first workspace and invite team members for
            seamless collaboration.
          </p>
        </a>
        <a href="#">
          <div className="mb-2 h-14 w-full rounded object-cover bg-emerald-500/20 flex items-center justify-center">
            <span className="text-emerald-500 font-bold">Tutorial</span>
          </div>
          <h4
            className={`mb-0.5 text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            Video Meeting Best Practices
          </h4>
          <p
            className={`text-xs ${darkMode ? "text-neutral-400" : "text-gray-600"}`}
          >
            Tips and tricks to make your virtual meetings more productive and
            engaging with Pixbay.
          </p>
        </a>
      </div>
      <button
        className={`ml-auto mt-4 flex items-center gap-1 text-sm ${darkMode ? "text-emerald-300" : "text-emerald-600"}`}
      >
        <span>Browse more resources</span>
        <FiArrowRight />
      </button>
    </div>
  );
};

const TABS = [
  {
    title: "Features",
    Component: Products,
  },
  {
    title: "Solutions",
    Component: Pricing,
  },
  {
    title: "Resources",
    Component: Blog,
  },
].map((n, idx) => ({ ...n, id: idx + 1 }));
