import { useCallback, useMemo } from "react";
import styled from "styled-components";
import { FiLink } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAtom } from "jotai";
import { keyReferenceAtom } from "../atoms/state";
import { DopeColors } from "../constants";

const StyledMapOutput = styled.pre`
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.4;
  text-align: left;
`;

const Entry = styled.div<{
  $hide: boolean;
}>`
  border-bottom: ${({ $hide }) =>
    $hide ? undefined : `1px solid ${DopeColors.darkGray}`};
`;

const Key = styled.strong<{
  $color: string;
}>`
  cursor: pointer;
  color: ${({ $color }) => $color};
  display: inline-flex;
  align-items: center;
  position: relative;
  padding: 4px 0px 4px 8px;

  &:hover {
    color: ${DopeColors.lightPink};
    font-weight: 700;
    opacity: 0.8;
    background-color: ${DopeColors.darkGray};
    border-radius: 8px;
  }
`;

const LinkIcon = styled.span<{ $show: boolean }>`
  visibility: ${({ $show }) => ($show ? "visibile" : "hidden")};
  margin-horizontalt: 4px;
`;

interface Props {
  data: [unknown, unknown][];
  color?: string;
}

export const MapOutput = ({ data, color = DopeColors.blue }: Props) => {
  const [keyReference, setKeyReference] = useAtom(keyReferenceAtom);

  const renderEntry = useCallback(
    (index: number) => {
      const [key, value] = data[index];
      const isLinked = keyReference === key;
      const $color = isLinked ? DopeColors.pink : color;

      const onClick = () => {
        if (isLinked) {
          setKeyReference(undefined);
          toast(`Cleared reference!`);
        } else {
          setKeyReference(key);
          toast(`Copied key reference to key input!`);
        }
      };

      return (
        <Entry key={`map-output-${index}`} $hide={index === 0}>
          {index}:
          <Key onClick={onClick} $color={$color}>
            {JSON.stringify(key, null, 2)}
            <LinkIcon $show={isLinked}>
              <FiLink />
            </LinkIcon>
          </Key>
          : {JSON.stringify(value, null, 2)}
        </Entry>
      );
    },
    [keyReference, data]
  );

  const reversedIndexes = useMemo(
    // Reverse render array without mutating original
    () => data.map((_, i) => i).reverse(),
    [data]
  );

  return <StyledMapOutput>{reversedIndexes.map(renderEntry)}</StyledMapOutput>;
};
