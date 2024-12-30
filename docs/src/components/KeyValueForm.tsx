import { useSetAtom } from "jotai";
import { useCallback, useState } from "react";
import styled from "styled-components";
import { FaPlay } from "react-icons/fa6";

import {
  handleMapDeleteAtom,
  handleMapGetAtom,
  handleMapSetAtom,
} from "../atoms/setters";

import { parseInput } from "../utils";
import { EditorInput } from "./EditorInput";

const FormContainer = styled.div`
  flex-direction: column;
  text-align: center;
  width: 100%;
`;

const EditorContainer = styled.div`
  margin-bottom: 20px;
`;

const ButtonGroup = styled.div`
  margin: 20px 0px;
`;

const MethodButton = styled.button<{ $isActive: boolean }>`
  margin: 5px;
  padding: 10px 15px;
  border: ${({ $isActive }) =>
    $isActive ? "1px solid black" : "1px solid black"};
  border-radius: 4px;
  background-color: ${({ $isActive }) =>
    $isActive ? "#1e1e1e" : "white"}; /* Dark background color for active */
  color: ${({ $isActive }) =>
    $isActive ? "#f0f0f0" : "black"}; /* Light text color for active */
  cursor: pointer;
  font-family: "Courier New", Courier, monospace; /* Monospace font */
  font-weight: ${({ $isActive }) => ($isActive ? 800 : 600)};
  font-size: 16px;

  &:hover {
    background-color: ${({ $isActive }) =>
      $isActive
        ? "#2d2d2d"
        : "#f0f0f0"}; /* Slightly lighter background on hover */
  }
`;

const RunButton = styled.button`
  width: 100%;
  padding: 10px 0px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  border-radius: 4px;
  border-width: 0px;

  &:hover {
    background-color: #45a049;
  }
`;

const methods = ["set", "get", "delete"];

function KeyValueForm() {
  const [activeMethod, setActiveMethod] = useState("set");
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const setKeyValue = useSetAtom(handleMapSetAtom);
  const getKeyValue = useSetAtom(handleMapGetAtom);
  const deleteKeyValue = useSetAtom(handleMapDeleteAtom);

  const onRunPress = useCallback(() => {
    if (activeMethod === "set") {
      setKeyValue({ key: parseInput(key), value: parseInput(value) });
    } else if (activeMethod === "get") {
      getKeyValue(parseInput(key));
    } else if (activeMethod === "delete") {
      deleteKeyValue(parseInput(key));
    }
  }, [key, value, setKeyValue, activeMethod]);

  const renderMethodButton = useCallback(
    (method) => (
      <MethodButton
        key={method}
        onClick={() => setActiveMethod(method)}
        $isActive={activeMethod === method}
      >
        {`.${method}()`}
      </MethodButton>
    ),
    [activeMethod]
  );

  return (
    <FormContainer>
      <ButtonGroup>{methods.map(renderMethodButton)}</ButtonGroup>
      <EditorContainer>
        <EditorInput label="Key:" value={key} onChange={setKey} />
        {activeMethod === "set" && (
          <EditorInput label="Value:" value={value} onChange={setValue} />
        )}
      </EditorContainer>
      <RunButton onClick={onRunPress}>
        <FaPlay size={24} />
      </RunButton>
    </FormContainer>
  );
}

export default KeyValueForm;
