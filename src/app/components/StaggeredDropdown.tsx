"use client";

import { FiChevronDown, FiMaximize2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const StaggeredDropDown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState("S");

  return (
    <div className="p-8 flex items-center justify-center bg-white">
      <div className="relative">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-2 px-3 py-2 rounded-md text-indigo-50 bg-black hover:bg-black transition-colors"
        >
          <FiMaximize2 />
          <span className="font-medium text-sm">{selectedAction}</span>
          <motion.span variants={iconVariants}>
            <FiChevronDown />
          </motion.span>
        </button>

        <AnimatePresence>
          {open && (
            <motion.ul
              initial="closed"
              animate="open"
              exit="closed"
              variants={wrapperVariants}
              style={{ originY: "top", translateX: "-50%" }}
              className="flex flex-col gap-2 p-2 rounded-lg bg-white shadow-xl absolute top-[100%] left-[50%] w-20 overflow-hidden"
            >
              <Option setOpen={setOpen} setSelectedAction={setSelectedAction} text="S" />
              <Option setOpen={setOpen} setSelectedAction={setSelectedAction} text="M" />
              <Option setOpen={setOpen} setSelectedAction={setSelectedAction} text="L" />
              <Option setOpen={setOpen} setSelectedAction={setSelectedAction} text="XL" />
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

interface OptionProps {
  text: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedAction: React.Dispatch<React.SetStateAction<string>>;
}

const Option: React.FC<OptionProps> = ({ text, setOpen, setSelectedAction }) => {
  const handleClick = () => {
    setOpen(false);
    setSelectedAction(text);
  };

  return (
    <motion.li
      variants={itemVariants}
      onClick={handleClick}
      className="flex items-center gap-2 w-full p-2 text-xs font-medium whitespace-nowrap rounded-md hover:bg-gray-200 text-slate-700 hover:text-black transition-colors cursor-pointer"
    >
      <motion.span variants={actionIconVariants}></motion.span>
      <span>{text}</span>
    </motion.li>
  );
};

export default StaggeredDropDown;

const wrapperVariants = {
  open: {
    scaleY: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  closed: {
    scaleY: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.1,
    },
  },
};

const iconVariants = {
  open: { rotate: 180 },
  closed: { rotate: 0 },
};

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
    },
  },
  closed: {
    opacity: 0,
    y: -15,
    transition: {
      when: "afterChildren",
    },
  },
};

const actionIconVariants = {
  open: { scale: 1, y: 0 },
  closed: { scale: 0, y: -7 },
};