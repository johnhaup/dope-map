import { useCallback, useEffect, useMemo, useRef } from "react";
import AceEditor from "react-ace";
import styled from "styled-components";
import { useWindowSize } from "@uidotdev/usehooks";

import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import { parseInput } from "../utils";
import { useSetAtom } from "jotai";
import { keyReferenceAtom } from "../atoms/state";
import { DopeColors } from "../constants";
import { LinkIcon } from "./LinkIcon";

const EditorWrapper = styled.div<{ $highlight?: unknown }>`
  flex: 1;

  span {
    color: ${({ $highlight }) =>
      $highlight ? `${DopeColors.pink} !important` : undefined};
  }
`;

const EditorHeader = styled.h3<{ $highlight?: unknown }>`
  color: ${DopeColors.blue};
  font-size: 14px;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", "Consolas", "Source Code Pro",
    "source-code-pro", monospace;
  color: ${({ $highlight }) =>
    $highlight ? `${DopeColors.pink} !important` : undefined};
  margin: 0;
  display: inline-flex;
`;

interface Props {
  label: string;
  onChange: (value: string) => void;
  value: string;
  refValue?: unknown;
}

export function EditorInput({ label, onChange, value, refValue }: Props) {
  const _editor = useRef<AceEditor>(null);
  const windowSize = useWindowSize();
  const setKeyReference = useSetAtom(keyReferenceAtom);

  const editorProps = useMemo(() => {
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
        showLineNumbers: true,
        tabSize: 2,
        useWorker: false,
      },
      style: {
        borderRadius: "8px",
        color: refValue ? `${DopeColors.pink} !important` : undefined,
      },
    };
  }, [refValue, windowSize]);

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

  const displayLabel = useMemo(() => {
    return refValue ? `${label} - Reference` : label;
  }, [label, refValue]);

  const onValueChange = useCallback(
    (newValue: string) => {
      setKeyReference(undefined);
      const strippedValue = newValue
        .replace(`// ${label} - Reference\n`, "")
        .replace(`// ${label}\n`, "");
      onChange(strippedValue);
    },
    [label, onChange]
  );

  return (
    <div style={{ flex: 1, position: "relative" }}>
      <EditorWrapper $highlight={refValue}>
        <AceEditor
          {...editorProps}
          value={value}
          onChange={onValueChange}
          ref={_editor}
          markers={[
            {
              startRow: 0,
              startCol: 0,
              endRow: 0,
              endCol: 100,
              className: "readonly-marker",
              type: "fullLine",
            },
          ]}
        />
      </EditorWrapper>
      <div
        style={{
          color: DopeColors.lightPink,
          position: "absolute",
          top: "-12px",
          right: "12px",
          padding: "4px 8px",
          borderRadius: "8px",
          backgroundColor: DopeColors.darkGray,
          border: `1px solid ${DopeColors.offWhite}`,
        }}
      >
        <EditorHeader $highlight={refValue}>
          {displayLabel}
          <LinkIcon show={!!refValue} style={{ margin: "0px 0px 0px 8px" }} />
        </EditorHeader>
      </div>
    </div>
  );
}
