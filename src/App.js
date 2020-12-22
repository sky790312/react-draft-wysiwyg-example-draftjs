import React, { useState, useCallback } from "react";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import DOMPurify from "dompurify";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./App.css";

const initialHTML =
  '<p>My initial content.</p><p></p><p>test: <span style="color: rgb(26,188,156);">qqq</span></p>';

const App = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(
      ContentState.createFromBlockArray(htmlToDraft(initialHTML))
    )
  );
  const [convertedContent, setConvertedContent] = useState(initialHTML);

  const onEditorStateChange = useCallback(
    state => {
      setEditorState(state);

      const currentContentAsHTML = draftToHtml(
        convertToRaw(editorState.getCurrentContent())
      );
      setConvertedContent(currentContentAsHTML);
    },
    [editorState]
  );

  onsubmit = useCallback(() => {
    console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
  }, [editorState]);

  const createMarkup = useCallback(html => {
    return {
      __html: DOMPurify.sanitize(html)
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">Rich Text Editor Example</header>
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        wrapperClassName="draft-section-wrapper"
        editorClassName="editor-wrapper"
        toolbarClassName="toolbar-wrapper"
        toolbar={{
          options: [
            "inline",
            "blockType",
            "fontSize",
            "fontFamily",
            "list",
            "textAlign",
            "colorPicker",
            "remove",
            "history"
          ]
        }}
      />
      <button onClick={onsubmit}>submit</button>
      <div
        className="preview-wrapper"
        dangerouslySetInnerHTML={createMarkup(convertedContent)}
      ></div>
    </div>
  );
};

export default App;
