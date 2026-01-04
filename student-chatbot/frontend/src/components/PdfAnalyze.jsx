import React, { useState } from "react";
import axios from "axios";

export default function PdfAnalyze() {
  const [file, setFile] = useState(null);
  const [reply, setReply] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:4000/api/analyze-pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setReply(res.data.reply);
    } catch (err) {
      setReply("Error analyzing PDF.");
      console.error(err);
    }
  };

  return (
    <div className="pdf-analyze">
      <h2>📄 Analyze PDF</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Analyze</button>
      </form>
      {reply && <div className="reply-box">{reply}</div>}
    </div>
  );
}
