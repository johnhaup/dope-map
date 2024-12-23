import { useCallback, useState } from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import { useSetAtom } from "jotai";
import {
  handleMapDeleteAtom,
  handleMapGetAtom,
  handleMapSetAtom,
} from "../atoms/state";

const labelStyle = {
  fontSize: "16px",
  fontWeight: "600",
  margin: "8px",
  letterSpacing: "0.5px",
};

function KeyValueForm() {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const setKeyValue = useSetAtom(handleMapSetAtom);
  const getKeyValue = useSetAtom(handleMapGetAtom);
  const deleteKeyValue = useSetAtom(handleMapDeleteAtom);

  const parseInput = useCallback((key) => {
    try {
      return eval(`(${key})`);
    } catch (e) {
      console.warn("Invalid key format, treating as string:", key);
      return key;
    }
  }, []);

  const onSetPress = useCallback(() => {
    setKeyValue({ key: parseInput(key), value: parseInput(value) });
  }, [key, value, parseInput]);

  const onGetPress = useCallback(() => {
    const parsedKey = parseInput(key);
    getKeyValue(parsedKey);
  }, [key, parseInput]);

  const onDeletePress = useCallback(() => {
    const parsedKey = parseInput(key);
    deleteKeyValue(parsedKey);
  }, [key, parseInput]);

  return (
    <div>
      <h2>Key-Value Input</h2>
      <div style={{ display: "flex", flexDirection: "row", gap: "24px" }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Key:</label>
          <AceEditor
            mode="javascript"
            theme="monokai"
            name="keyEditor"
            value={key}
            onChange={setKey}
            fontSize={14}
            width="100%"
            height="200px"
            showPrintMargin={false}
            showGutter={true}
            highlightActiveLine={true}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: false,
              enableSnippets: false,
              showLineNumbers: true,
              tabSize: 2,
              useWorker: false,
            }}
            style={{ borderRadius: "8px" }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Value:</label>
          <AceEditor
            mode="javascript"
            theme="monokai"
            name="valueEditor"
            value={value}
            onChange={setValue}
            fontSize={14}
            width="100%"
            height="200px"
            showPrintMargin={false}
            showGutter={true}
            highlightActiveLine={true}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: false,
              enableSnippets: false,
              showLineNumbers: true,
              tabSize: 2,
              useWorker: false,
            }}
            style={{ borderRadius: "8px" }}
          />
        </div>
      </div>
      <div className="button-group">
        <button onClick={onSetPress}>Set</button>
        <button onClick={onGetPress}>Get</button>
        <button onClick={onDeletePress}>Delete</button>
      </div>
    </div>
  );
}

export default KeyValueForm;
