import { larry3D, useAsciiText } from "react-ascii-text";
import styled from "styled-components";

const AsciiWrapper = styled.div`
  display: flex;
  flex-direction: row;

  @media (max-width: 450px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0px;
  }
`;

const Ascii = styled.pre`
  font-size: 6px;
`;

export function DopeHeader() {
  const mapRef = useAsciiText({
    animationCharacters: "▒░█",
    animationCharacterSpacing: 1,
    animationDelay: 2000,
    animationDirection: "down",
    animationInterval: 1000,
    animationLoop: true,
    animationSpeed: 30,
    font: larry3D,
    isAnimated: false,
    text: ["Map vs"],
  });
  const dopeMapRef = useAsciiText({
    animationCharacters: "▒░█",
    animationCharacterSpacing: 1,
    animationDelay: 2000,
    animationDirection: "down",
    animationInterval: 1000,
    animationLoop: true,
    animationSpeed: 30,
    font: larry3D,
    isAnimated: false,
    text: ["DOPEMAP"],
  });

  return (
    <AsciiWrapper>
      <Ascii ref={mapRef}></Ascii>
      <Ascii ref={dopeMapRef}></Ascii>
    </AsciiWrapper>
  );
}
