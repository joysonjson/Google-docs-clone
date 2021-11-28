import React, { useEffect, useState } from "react";

import QuillEditor from "../QuilEditor";
// import { Typography, Button, Form, message } from "antd";
import axios from "axios";
// import { useSelector } from "react-redux";

// const { Title } = Typography;

function CreatePage(props) {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);

  const onEditorChange = (value) => {
    setContent(value);
    console.log(content);
  };

  const onFilesChange = (files) => {
    setFiles(files);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setContent("");
  };

  return (
    <div style={{ maxWidth: "900px", margin: " auto" }}>
      <QuillEditor
        placeholder={""}
        onEditorChange={onEditorChange}
        onFilesChange={onFilesChange}
      />
    </div>
  );
}

export default CreatePage;
