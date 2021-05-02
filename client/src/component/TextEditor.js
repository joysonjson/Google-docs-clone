import React, { useState, useEffect, useRef, createRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./textEditor.css";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
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

const SAVE_INTERVAL = 1000;
const TextEditor = () => {
  const [value, setValue] = useState("");
  const [socket, setSocket] = useState();
  const quill = useRef();
  const { id: documentId } = useParams();
  useEffect(() => {
    const s = io("http://localhost:3001");
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);
  useEffect(() => {
    if (socket === null || socket === undefined) return;
    socket.once("load-document", (document) => {
      console.log("Loading the document", document);
      quill.current.getEditor().setContents(document);
    });
    console.log("Id of the doc ", documentId);
    if (documentId === undefined || documentId === null) return;
    socket.emit("get-document", documentId);

    return () => {};
  }, [socket, documentId]);
  useEffect(() => {
    if (socket === null || socket === undefined) return;

    const interval = setInterval(() => {
      console.log("Saving the document");
      socket.emit("save-document", quill.current.getEditor().getContents());
    }, SAVE_INTERVAL);
    return () => {
      clearInterval(interval);
    };
  }, [socket]);

  useEffect(() => {
    if (socket === null || socket === undefined) return;
    const handler = (delta) => {
      console.log("REciving changes", delta, quill);
      // quill.current.updateContents(delta);
      quill.current.getEditor().updateContents(delta);
    };
    socket.on("receive-changes", handler);
    return () => {
      socket.off("receive-changes", handler);
    };
  }, [socket]);

  const saveDocument = () => {};
  return (
    <ReactQuill
      ref={quill}
      theme="snow"
      value={value}
      // onChange={setValue}
      onChange={(val, delta, source) => {
        if (source !== "user") return;
        setValue(val);
        socket.emit("send-changes", delta);
      }}
      modules={{ toolbar: TOOLBAR_OPTIONS }}
    />
  );
};

export default TextEditor;
