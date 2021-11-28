import React, { useState, useEffect, useRef, createRef } from "react";
import ReactQuill, { Quill } from "react-quill";
import ImageResize from "quill-image-resize-module-react";

import "react-quill/dist/quill.snow.css";
import "./textEditor.css";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

Quill.register("modules/imageResize", ImageResize);

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
  const imagePicker = useRef();

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

  const insertImage = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (
      e.currentTarget &&
      e.currentTarget.files &&
      e.currentTarget.files.length > 0
    ) {
      const file = e.currentTarget.files[0];

      const q = quill.current.getEditor();
      q.focus();

      let range = q.getSelection();
      let position = range ? range.index : 0;

      //먼저 노드 서버에다가 이미지를 넣은 다음에   여기 아래에 src에다가 그걸 넣으면 그게
      //이미지 블롯으로 가서  크리에이트가 이미지를 형성 하며 그걸 발류에서     src 랑 alt 를 가져간후에  editorHTML에 다가 넣는다.
      q.insertEmbed(position, "image", {
        src: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
        alt: "altname",
      });
      q.setSelection(position + 1);

      // if (this._isMounted) {
      //   this.setState(
      //     {
      //       files: [...this.state.files, file],
      //     },
      //     () => {
      //       this.props.onFilesChange(this.state.files);
      //     }
      //   );
      // }
    }
  };
  const imageHandler = () => {
    imagePicker.current.click();
  };
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
    <>
      <div id="toolbar">
        <select
          className="ql-header"
          defaultValue={""}
          onChange={(e) => e.persist()}
        >
          <option value="1" />
          <option value="2" />
          <option value="" />
        </select>
        <button className="ql-bold" />
        <button className="ql-italic" />
        <button className="ql-underline" />
        <button className="ql-strike" />
        <button className="ql-insertImage">I</button>
        <button className="ql-insertVideo">V</button>
        <button className="ql-insertFile">F</button>
        <button className="ql-link" />
        <button className="ql-code-block" />
        <button className="ql-video" />
        <button className="ql-blockquote" />
        <button className="ql-clean" />
      </div>
      <input
        type="file"
        accept="image/*"
        ref={imagePicker}
        style={{ display: "none" }}
        onChange={insertImage}
      />
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
        modules={{
          toolbar: {
            container: "#toolbar",
            //id ="toorbar"는  그 위에 B I U S I V F P 이거 있는 곳이다.
            handlers: {
              insertImage: (e) => imageHandler(e),
            },
          },
          imageResize: {
            displayStyles: {
              backgroundColor: "black",
              border: "none",
              color: "white",
            },
            modules: ["Resize", "DisplaySize", "Toolbar"],
          },
        }}
      />
    </>
  );
};

export default TextEditor;
