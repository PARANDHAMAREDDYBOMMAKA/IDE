import React, { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";

const TerminalComponent = () => {
  const terminalRef = useRef(null);

  useEffect(() => {
    const terminal = new Terminal();
    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    terminal.open(terminalRef.current);
    fitAddon.fit();
    terminal.write("Welcome to the terminal\n");

    return () => terminal.dispose();
  }, []);

  return <div ref={terminalRef} style={{ height: "100%" }} />;
};

export default TerminalComponent;
