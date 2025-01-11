import React from "react";
import styled from "styled-components";
import { FiCopy } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StyledMapOutput = styled.pre<{ $color: string; $hoverColor?: string }>`
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.4;
  text-align: left;

  div {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  strong {
    cursor: pointer;
    color: ${({ $color }) => $color};
    display: inline-flex;
    align-items: center;
    gap: 5px;
    position: relative;

    .link-icon {
      visibility: hidden;
      opacity: 0;
      margin-left: 4px;
      transition: visibility 0.2s, opacity 0.2s;
    }

    &:hover .link-icon {
      visibility: visible;
      opacity: 1;
    }
  }

  strong:hover {
    color: ${({ $hoverColor }) => $hoverColor};
    font-weight: 700;
  }
`;

interface Props {
  data: [any, any][];
  color?: string;
  hoverColor?: string;
}

export const MapOutput = ({
  data,
  color = "#4fa3d1",
  hoverColor = "#ff9ff3",
}: Props) => {
  const handleCopy = (key: any) => {
    let copyContent = key;

    if (typeof key === "object" && key !== null) {
      copyContent = JSON.stringify(key, null, 2);
    }

    navigator.clipboard
      .writeText(copyContent)
      .then(() => {
        toast(`Copied to clipboard:\n${copyContent}`);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  return (
    <StyledMapOutput $color={color} $hoverColor={hoverColor}>
      {data.map(([key, value], index) => (
        <div key={`map-output-${index}`}>
          <strong onClick={() => handleCopy(key)}>
            {JSON.stringify(key, null, 2)}
            <span className="link-icon">
              <FiCopy />
            </span>
          </strong>
          : {JSON.stringify(value, null, 2)}
        </div>
      ))}
    </StyledMapOutput>
  );
};
