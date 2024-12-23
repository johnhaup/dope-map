import { useMemo } from "react";
import AceEditor from "react-ace";
import styled from "styled-components";

import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";

const EditorWrapper = styled.div`
  flex: 1;
`;

const Label = styled.label`
  display: block;
  font-size: 16px;
  font-weight: 600;
  margin: 8px;
  letter-spacing: 0.5px;
`;

export function EditorInput({ label, onChange, value }) {
  const editorProps = useMemo(
    () => ({
      mode: "javascript",
      theme: "monokai",
      fontSize: 14,
      width: "100%",
      height: "200px",
      showPrintMargin: false,
      showGutter: true,
      highlightActiveLine: true,
      setOptions: {
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: false,
        enableSnippets: false,
        showLineNumbers: true,
        tabSize: 2,
        useWorker: false,
      },
      style: {
        borderRadius: "8px",
      },
    }),
    []
  );

  return (
    <EditorWrapper>
      <Label>{label}</Label>
      <AceEditor {...editorProps} value={value} onChange={onChange} />
    </EditorWrapper>
  );
}
