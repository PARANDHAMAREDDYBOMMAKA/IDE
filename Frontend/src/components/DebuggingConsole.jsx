import React from "react";

const DebuggingConsole = ({ messages }) => {
  return (
    <div
      style={{
        height: "200px",
        overflow: "auto",
        backgroundColor: "#1e1e1e",
        color: "#fff",
      }}
    >
      {messages.map((msg, index) => (
        <div key={index}>{msg}</div>
      ))}
    </div>
  );
};

export default DebuggingConsole;