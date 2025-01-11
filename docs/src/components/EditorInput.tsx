import { useCallback, useEffect, useMemo, useRef } from "react";
import AceEditor from "react-ace";
import styled from "styled-components";
import { useWindowSize } from "@uidotdev/usehooks";

import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import { parseInput } from "../utils";

const EditorWrapper = styled.div`
  flex: 1;
`;

interface Props {
  label: string;
  onChange: (value: string) => void;
  borderRadiusConfig?: "top" | "bottom" | "none";
  value: string;
}

export function EditorInput({
  label,
  onChange,
  value,
  borderRadiusConfig,
}: Props) {
  const _editor = useRef<AceEditor>(null);
  const windowSize = useWindowSize();

  const editorProps = useMemo(() => {
    const borderRadius =
      borderRadiusConfig === "top"
        ? "8px 8px 0px 0px"
        : borderRadiusConfig === "bottom"
        ? "0px 0px 8px 8px"
        : borderRadiusConfig === "none"
        ? "0px"
        : "8px";

    return {
      mode: "javascript",
      theme: "monokai",
      fontSize: 14,
      width: "100%",
      height: windowSize.width < 450 ? "160px" : "240px",
      showPrintMargin: false,
      showGutter: true,
      highlightActiveLine: true,
      setOptions: {
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: false,
        enableSnippets: false,
        showLineNumbers: false,
        tabSize: 2,
        useWorker: false,
      },
      style: {
        borderRadius,
      },
    };
  }, [windowSize]);

  const validateString = (parsed: string) => {
    const quotesRegex = /^(['"]).*\1$/;

    if (!quotesRegex.test(parsed)) {
      const errors = parsed
        .split("\n")
        .map(
          (line) =>
            line.split("").filter((char) => char === '"').length % 2 !== 0 ||
            line.split("").filter((char) => char === "'").length % 2 !== 0
        );
      const row = errors.findIndex((error) => error);
      _editor.current.editor.getSession().setAnnotations([
        {
          row,
          column: 0,
          text: "Unquoted string detected",
          type: "error",
        },
      ]);
    }
  };

  useEffect(() => {
    _editor.current.editor.getSession().clearAnnotations();
    const parsed = parseInput(value);
    if (typeof parsed === "string") {
      validateString(parsed);
    }
  }, [value]);

  const displayValue = useMemo(() => {
    return `// ${label}\n${value}`;
  }, [label, value]);

  const onValueChange = useCallback((newValue: string) => {
    const strippedValue = newValue.replace(`// ${label}\n`, "");
    onChange(strippedValue);
  }, []);

  return (
    <EditorWrapper>
      <AceEditor
        {...editorProps}
        value={displayValue}
        onChange={onValueChange}
        ref={_editor}
      />
    </EditorWrapper>
  );
}
