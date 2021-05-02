import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./textEditor.css";
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

  return (
    <ReactQuill
      placeholder={"Write something..."}
      theme="snow"
      value={value}
      onChange={setValue}
      modules={{ toolbar: TOOLBAR_OPTIONS }}
    />
  );
};

export default TextEditor;
