"use client";

import React, { useState } from "react";

const Terminal: React.FC = () => {
  const [commands, setCommands] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);

  const handleInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(input);
      setInput("");
      setHistoryIndex(null); // Reset history index after executing a command
    } else if (e.key === "ArrowUp") {
      if (historyIndex === null) {
        setHistoryIndex(commandHistory.length - 1); // Start from the last command
      } else if (historyIndex > 0) {
        setHistoryIndex(historyIndex - 1);
      }
      if (historyIndex !== null && historyIndex >= 0) {
        setInput(commandHistory[historyIndex]);
      }
    } else if (e.key === "ArrowDown") {
      if (historyIndex !== null && historyIndex < commandHistory.length - 1) {
        setHistoryIndex(historyIndex + 1);
        setInput(commandHistory[historyIndex + 1]);
      } else {
        setHistoryIndex(null);
        setInput("");
      }
    }
  };

  const executeCommand = async (cmd: string) => {
    const trimmedCommand = cmd.trim();

    // Log the command entered by the user
    setCommands((prev) => [...prev, `$ ${trimmedCommand}`]);

    // Simulate command execution
    setTimeout(() => {
      const output = simulateCommand(trimmedCommand);
      setCommands((prev) => [...prev, output]);
    }, 1000); // Simulate a delay for command execution

    // Update command history
    setCommandHistory((prev) => [...prev, trimmedCommand]);
  };

  const simulateCommand = (cmd: string): string => {
    const parts = cmd.split(" ");

    // Handle package installation commands
    if (parts[0] === "npm" && parts[1] === "install") {
      return `npm notice created a lockfile as package-lock.json.`;
    } else if (parts[0] === "yarn" && parts[1] === "add") {
      return `success Saved 1 new dependency to package.json.`;
    } else if (parts[0] === "brew" && parts[1] === "install") {
      return `==> Downloading https://formulae.brew.sh/...`;
    } else {
      return `zsh: command not found: ${parts[0]}`; // Handle unknown commands
    }
  };

  return (
    <div className="w-1/4 bg-gray-800 text-white border-l border-gray-700 p-4">
      <h2 className="font-bold">Terminal</h2>
      <div className="h-64 overflow-y-scroll border border-gray-700 p-2">
        {commands.map((cmd, index) => (
          <div key={index} className="text-green-400">
            {cmd}
          </div>
        ))}
        <div className="text-green-400">{`$ ${input}`}</div>{" "}
        {/* Display current input */}
      </div>
      <input
        className="border rounded p-2 w-full mt-2 bg-gray-700 text-white"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleInput}
        placeholder="Type a command..."
      />
    </div>
  );
};

export default Terminal;
