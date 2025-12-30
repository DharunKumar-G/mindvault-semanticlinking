import { useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function RichTextEditor({ value, onChange, placeholder = "Write your note..." }) {
  const quillRef = useRef(null);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ],
    clipboard: {
      matchVisual: false
    }
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'blockquote', 'code-block',
    'link', 'image',
    'color', 'background'
  ];

  return (
    <div className="rich-text-editor">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
      />
      <style>{`
        .rich-text-editor .ql-toolbar {
          border: 1px solid rgb(203 213 225);
          border-radius: 0.5rem 0.5rem 0 0;
          background: rgb(248 250 252);
        }
        .dark .rich-text-editor .ql-toolbar {
          border-color: rgb(51 65 85);
          background: rgb(30 41 59);
        }
        .rich-text-editor .ql-container {
          border: 1px solid rgb(203 213 225);
          border-radius: 0 0 0.5rem 0.5rem;
          min-height: 300px;
          font-size: 16px;
        }
        .dark .rich-text-editor .ql-container {
          border-color: rgb(51 65 85);
        }
        .rich-text-editor .ql-editor {
          min-height: 300px;
          color: rgb(15 23 42);
        }
        .dark .rich-text-editor .ql-editor {
          color: rgb(226 232 240);
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          color: rgb(148 163 184);
        }
        .dark .rich-text-editor .ql-editor.ql-blank::before {
          color: rgb(100 116 139);
        }
        .dark .rich-text-editor .ql-toolbar button svg,
        .dark .rich-text-editor .ql-toolbar .ql-stroke {
          stroke: rgb(226 232 240);
        }
        .dark .rich-text-editor .ql-toolbar .ql-fill {
          fill: rgb(226 232 240);
        }
        .dark .rich-text-editor .ql-toolbar button:hover,
        .dark .rich-text-editor .ql-toolbar button.ql-active {
          color: rgb(167 139 250);
        }
        .dark .rich-text-editor .ql-toolbar button:hover svg .ql-stroke,
        .dark .rich-text-editor .ql-toolbar button.ql-active svg .ql-stroke {
          stroke: rgb(167 139 250);
        }
        .dark .rich-text-editor .ql-toolbar button:hover svg .ql-fill,
        .dark .rich-text-editor .ql-toolbar button.ql-active svg .ql-fill {
          fill: rgb(167 139 250);
        }
        .rich-text-editor .ql-editor h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.5em 0;
        }
        .rich-text-editor .ql-editor h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.5em 0;
        }
        .rich-text-editor .ql-editor h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin: 0.5em 0;
        }
        .rich-text-editor .ql-editor a {
          color: rgb(124 58 237);
          text-decoration: underline;
        }
        .dark .rich-text-editor .ql-editor a {
          color: rgb(167 139 250);
        }
        .rich-text-editor .ql-editor code {
          background: rgb(241 245 249);
          padding: 0.2em 0.4em;
          border-radius: 0.25rem;
        }
        .dark .rich-text-editor .ql-editor code {
          background: rgb(30 41 59);
        }
        .rich-text-editor .ql-editor pre {
          background: rgb(241 245 249);
          padding: 1em;
          border-radius: 0.5rem;
          overflow-x: auto;
        }
        .dark .rich-text-editor .ql-editor pre {
          background: rgb(30 41 59);
        }
      `}</style>
    </div>
  );
}
