import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./textEditor.css";
import { io } from "socket.io-client";
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

const TextEditor = () => {
  const [value, setValue] = useState("");
  useEffect(() => {
    const s = io("http://localhost:3002");

    return () => {
      s.disconnect();
    };
  }, []);

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={setValue}
      modules={{ toolbar: TOOLBAR_OPTIONS }}
    />
  );
};

export default TextEditor;
