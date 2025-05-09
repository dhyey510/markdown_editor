import React, { useState, useRef, useEffect } from 'react';
import { marked } from 'marked';
import html2pdf from 'html2pdf.js';
import './App.css';

function App() {
  const [markdown, setMarkdown] = useState(`# Welcome to Markdown Editor
    
## Features

- **Real-time Preview**: See your formatted text instantly
- **Export to PDF**: Download your document as a PDF file
- **Copy to Clipboard**: Copy the formatted HTML with a single click

## Example of Long Content

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.

### More Content

- Item 1
- Item 2
- Item 3

#### Even More Content

1. First item
2. Second item
3. Third item
`);

  const previewRef = useRef();
  const editorRef = useRef();
  const [exportStatus, setExportStatus] = useState('');

  // Remove auto-resizing to use fixed height with scrolling
  // useEffect(() => {
  //   if (editorRef.current) {
  //     editorRef.current.style.height = 'auto';
  //     editorRef.current.style.height = `${editorRef.current.scrollHeight}px`;
  //   }
  // }, [markdown]);

  const handleExport = () => {
    if (!previewRef.current) return;
    
    setExportStatus('Preparing PDF...');
    
    // Clone the preview content to make modifications for better PDF output
    const content = previewRef.current.cloneNode(true);
    
    // PDF export options for better handling of long content
    const opt = {
      margin: 10,
      filename: 'markdown-document.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: false,
        scrollY: 0,
        scrollX: 0,
        windowWidth: document.documentElement.offsetWidth
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // Use setTimeout to allow React to update UI with status
    setTimeout(() => {
      html2pdf()
        .from(content)
        .set(opt)
        .save()
        .then(() => {
          setExportStatus('PDF exported successfully!');
          setTimeout(() => setExportStatus(''), 2000);
        })
        .catch(err => {
          console.error('PDF export failed:', err);
          setExportStatus('Export failed. Try again.');
          setTimeout(() => setExportStatus(''), 2000);
        });
    }, 100);
  };

  const handleCopy = () => {
    if (previewRef.current) {
      navigator.clipboard.writeText(previewRef.current.innerText);
      setExportStatus('Copied to clipboard!');
      setTimeout(() => setExportStatus(''), 2000);
    }
  };

  // Parse markdown with proper security
  const getMarkdownHtml = () => {
    try {
      return { __html: marked(markdown, { sanitize: true }) };
    } catch (error) {
      return { __html: '<p>Error rendering markdown</p>' };
    }
  };

  return (
    <>
      <nav className="navbar navbar-dark bg-dark px-4">
        <span className="navbar-brand mb-0 h1">Real-time Markdown Editor</span>
        <div className="text-white">
          {exportStatus && (
            <span className="badge bg-info">
              {exportStatus}
            </span>
          )}
        </div>
      </nav>
      
      <div className="container-fluid">
        <div className="d-flex">
          {/* Editor Pane */}
          <div className="editor-pane" style={{ width: '50%', padding: '20px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5>Editor</h5>
              <small className="text-muted">
                {markdown.length} characters
              </small>
            </div>
            
            <div className="editor-box" style={{ border: '1px solid #dee2e6', borderRadius: '0.25rem', height: '500px'}}>
              <textarea
                ref={editorRef}
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                style={{ width: '100%', height: '100%', padding: '10px', border: 'none', resize: 'none' }}
              />
            </div>
          </div>
          
          {/* Preview Pane */}
          <div className="preview-pane" style={{ width: '50%', padding: '20px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5>Preview</h5>
              <div className="btn-group">
                <button
                  onClick={handleExport}
                  className="btn btn-primary"
                >
                  <i className="fas fa-file-pdf"></i> Export PDF
                </button>
                <button
                  onClick={handleCopy}
                  className="btn btn-info ms-2"
                >
                  <i className="fas fa-copy"></i> Copy
                </button>
              </div>
            </div>
            
            <div className="preview" style={{ border: '1px solid #dee2e6', borderRadius: '0.25rem', padding: '20px', height: '500px', overflow: 'auto' }}>
              <div
                ref={previewRef}
                className="preview-content"
                dangerouslySetInnerHTML={getMarkdownHtml()}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;