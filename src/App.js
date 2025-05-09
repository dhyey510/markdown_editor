import React, { useState, useRef } from 'react';
import { marked } from 'marked';
import html2pdf from 'html2pdf.js';
import './App.css';

function App() {
  const [markdown, setMarkdown] = useState(`# Welcome to Markdown Editor
    
## Features

- **Real-time Preview**: See your formatted text instantly
- **Export to PDF**: Download your document as a PDF file
- **Copy to Clipboard**: Copy the formatted HTML with a single click
`);
  const previewRef = useRef();

  const handleExport = () => {
    html2pdf().from(previewRef.current).save();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(previewRef.current.innerText);
    alert('Copied to clipboard!');
  };

  return (
    <>
      <nav className="navbar navbar-dark bg-dark px-4">
        <span className="navbar-brand mb-0 h1">Real-time Markdown Editor</span>
      </nav>
      <div className="container-fluid">
        <div className="row">
          {/* Markdown Editor */}
          <div className="col-md-6 p-0">
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
            />
          </div>

          {/* Preview Pane */}
          <div className="col-md-6 p-3">
            <div className="btn-group float-end mb-2" role="group">
              <button className="btn btn-primary" onClick={handleExport}>
                <i className="fas fa-file-pdf"></i> Export PDF
              </button>
              <button className="btn btn-info ms-2" onClick={handleCopy}>
                <i className="fas fa-copy"></i> Copy
              </button>
            </div>
            <h5 className="mb-3">Preview</h5>
            <div ref={previewRef} className="preview" dangerouslySetInnerHTML={{ __html: marked(markdown) }} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
