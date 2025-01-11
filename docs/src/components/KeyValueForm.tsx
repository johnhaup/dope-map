import { useSetAtom } from "jotai";
import { useCallback, useState } from "react";
import styled from "styled-components";
import { FaPlay } from "react-icons/fa6";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { handleKeyMapMethodAtom, handleMapSetAtom } from "../atoms/setters";

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

const methods = ["set", "get", "has", "delete"];

function KeyValueForm() {
  const [activeMethod, setActiveMethod] = useState("set");
  const [key, setKey] = useState("{\n  hey: 'you'\n}");
  const [value, setValue] = useState("dope.");
  const setKeyValue = useSetAtom(handleMapSetAtom);
  const handleKeyMapMethod = useSetAtom(handleKeyMapMethodAtom);

  const handleResult = useCallback(
    (type: string, result: any, errorValue: any) => {
      const message = `${type} returned: ${result}`;
      if (result === errorValue) {
        toast.error(message);
      } else {
        toast.success(message);
      }
    },
    []
  );

  const onRunPress = useCallback(() => {
    if (activeMethod === "set") {
      const { map, dopeMap } = setKeyValue({
        key: parseInput(key),
        value: parseInput(value),
      });
      if (dopeMap === 0) {
        toast("DopeMap updated item");
      } else {
        toast.success("DopeMap set new item");
      }
      if (map === 0) {
        toast("Map updated item");
      } else {
        toast.success("Map set new item");
      }
    } else if (activeMethod === "get") {
      const { map, dopeMap } = handleKeyMapMethod({
        key: parseInput(key),
        method: "get",
      });
      handleResult("DopeMap", dopeMap, undefined);
      handleResult("Map", map, undefined);
    } else if (activeMethod === "delete") {
      const { map, dopeMap } = handleKeyMapMethod({
        key: parseInput(key),
        method: "delete",
      });
      handleResult("DopeMap", dopeMap, false);
      handleResult("Map", map, false);
    } else if (activeMethod === "has") {
      const { map, dopeMap } = handleKeyMapMethod({
        key: parseInput(key),
        method: "has",
      });
      handleResult("DopeMap", dopeMap, false);
      handleResult("Map", map, false);
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
