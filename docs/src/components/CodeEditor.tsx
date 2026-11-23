import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import { FiLink } from "react-icons/fi";
import type { Parsed } from "../parse";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  parsed: Parsed;
  linked?: boolean;
};

export function CodeEditor({ label, value, onChange, parsed, linked }: Props) {
  return (
    <div className={`editor ${linked ? "linked" : ""}`}>
      <div className="editor-label">
        {label}
        {linked && (
          <>
            <FiLink aria-hidden /> reference
          </>
        )}
      </div>
      <AceEditor
        mode="javascript"
        theme="monokai"
        name={`editor-${label}`}
        value={value}
        onChange={onChange}
        width="100%"
        height="100%"
        fontSize={14}
        showPrintMargin={false}
        highlightActiveLine={false}
        annotations={
          parsed.ok
            ? []
            : [{ row: parsed.row, column: parsed.column, text: parsed.message, type: "error" }]
        }
        setOptions={{ useWorker: false, tabSize: 2 }}
        editorProps={{ $blockScrolling: true }}
      />
      {!parsed.ok && <div className="editor-error">{parsed.message}</div>}
    </div>
  );
}
