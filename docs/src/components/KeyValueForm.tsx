import { useSetAtom } from "jotai";
import { useCallback, useState } from "react";
import styled from "styled-components";
import {
  handleMapDeleteAtom,
  handleMapGetAtom,
  handleMapSetAtom,
} from "../atoms/setters";

import { parseInput } from "../utils";
import { EditorInput } from "./EditorInput";

const FormContainer = styled.div`
  text-align: center;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const EditorContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0px;
    margin-bottom: 20px;
  }
`;

const ButtonGroup = styled.div`
  margin-top: 20px;
`;

const Button = styled.button`
  margin: 5px;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;
function KeyValueForm() {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const setKeyValue = useSetAtom(handleMapSetAtom);
  const getKeyValue = useSetAtom(handleMapGetAtom);
  const deleteKeyValue = useSetAtom(handleMapDeleteAtom);

  const onSetPress = useCallback(() => {
    setKeyValue({ key: parseInput(key), value: parseInput(value) });
  }, [key, value, setKeyValue]);

  const onGetPress = useCallback(() => {
    getKeyValue(parseInput(key));
  }, [key, getKeyValue]);

  const onDeletePress = useCallback(() => {
    deleteKeyValue(parseInput(key));
  }, [key, deleteKeyValue]);

  return (
    <FormContainer>
      <Title>Key-Value Input</Title>
      <EditorContainer>
        <EditorInput label="Key:" value={key} onChange={setKey} />
        <EditorInput label="Value:" value={value} onChange={setValue} />
      </EditorContainer>
      <ButtonGroup>
        <Button onClick={onSetPress}>Set</Button>
        <Button onClick={onGetPress}>Get</Button>
        <Button onClick={onDeletePress}>Delete</Button>
      </ButtonGroup>
    </FormContainer>
  );
}

export default KeyValueForm;
