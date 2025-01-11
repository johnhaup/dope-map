import React from "react";
import styled from "styled-components";
import { FiCopy } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StyledMapOutput = styled.pre`
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
    color: #4fa3d1;
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
    color: rgb(123, 198, 239);
    font-weight: 700;
  }
`;

export const MapOutput = ({ data }: { data: [any, any][] }) => {
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
    <StyledMapOutput>
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
