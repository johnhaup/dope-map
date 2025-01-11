import { useSetAtom } from "jotai";
import { useCallback, useState } from "react";
import { useWindowSize } from "@uidotdev/usehooks";
import styled from "styled-components";
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

const EditorsContainer = styled.div`
  flex-direction: column;
  margin: 20px 0px;
`;

const ButtonGroup = styled.div`
  margin: 0px 0px 20px 0px;
  display: flex;
  flex: 1;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
`;

const MethodButton = styled.button`
  padding: 10px 15px;
  border: "1px solid #000"
  border-radius: 4px;
  background-color: "#fff";
  color: "#000"
  cursor: pointer;
  font-family: "Courier New", Courier, monospace; /* Monospace font */
  font-weight: 600;
  font-size: 16px;
  display: flex;
  flex: 1;
  white-space: nowrap;
  text-align: center;
  justify-content: center;

  @media (max-width: 450px) {
    // white-space: wrap;
    min-width: 48%;
    text-overflow: ellipsis;
    overflow: hidden;
  text-align: left;

  }

  &:hover {
    background-color: "#f0f0f0";
  }
`;

const methods = ["set", "get", "has", "delete"];

function KeyValueForm() {
  const windowSize = useWindowSize();
  const [key, setKey] = useState('{\n  hey: "you",\n  whats: "up"\n}');
  const [value, setValue] = useState('"dope."');
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

  const handleMethodClick = useCallback(
    (activeMethod: string) => {
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
    },
    [key, value, setKeyValue]
  );

  const renderMethodButton = useCallback(
    (method: string) => {
      const onClick = () => handleMethodClick(method);

      function getTextBasedOnMediaQuery() {
        if (windowSize.width < 450) {
          return `.${method}()`;
        } else {
          return `.${method}(${key}${method === "set" ? `, ${value}` : ""})`;
        }
      }

      return (
        <MethodButton key={method} onClick={onClick}>
          {getTextBasedOnMediaQuery()}
        </MethodButton>
      );
    },
    [windowSize]
  );

  return (
    <FormContainer>
      <EditorsContainer>
        <EditorInput
          label="Key"
          value={key}
          onChange={setKey}
          borderRadiusConfig="top"
        />
        <EditorInput
          label="Value"
          value={value}
          onChange={setValue}
          borderRadiusConfig="bottom"
        />
      </EditorsContainer>
      <ButtonGroup>{methods.map(renderMethodButton)}</ButtonGroup>
    </FormContainer>
  );
}

export default KeyValueForm;
