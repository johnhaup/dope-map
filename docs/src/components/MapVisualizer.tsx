import { useAtomValue } from "jotai";
import {
  dopeMapEntriesArrayAtom,
  dopeMapSizeAtom,
  jsMapEntriesArrayAtom,
  jsMapSizeAtom,
} from "../atoms/derived";

import styled from "styled-components";
import { MapOutput } from "./MapOutput";
import { DopeColors } from "../constants";

const SectionHeader = styled.h3`
  text-align: center;
  margin-bottom: 8px;
`;

const VisualizerContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: stretch;
  width: 100%;
  height: 400px;
  overflow: hidden;
  margin-top: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    gap: 0px;
  }
`;

const OutputContainer = styled.div`
  flex: 1;
  background-color: ${DopeColors.black};
  color: ${DopeColors.offWhite};
  font-family: "Courier New", monospace;
  font-size: 14px;
  border: 1px solid ${DopeColors.darkGray};
  border-radius: 8px;
  overflow: auto;
  padding: 10px;
  margin-bottom: 20px;
`;

const OutputHeader = styled.div`
  position: relative;
`;

const MapHeader = styled.h3`
  color: ${DopeColors.blue};
  margin: 0;
`;

const SizeContainer = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Hint = styled.p`
  font-size: 12px;
  font-style: italic;
  margin: 0px;
`;

function MapVisualizer() {
  const mapData = useAtomValue(jsMapEntriesArrayAtom);
  const dopeMapData = useAtomValue(dopeMapEntriesArrayAtom);
  const mapSize = useAtomValue(jsMapSizeAtom);
  const dopeMapSize = useAtomValue(dopeMapSizeAtom);

  return (
    <div>
      <SectionHeader>Map Visualization</SectionHeader>
      <Hint>Click on a key to copy its reference to the key input.</Hint>
      <Hint>Note that the entries below are shown in reverse order.</Hint>
      <VisualizerContainer>
        <OutputContainer>
          <OutputHeader>
            <MapHeader>DopeMap</MapHeader>
            <SizeContainer>
              <MapHeader>{`Size: ${dopeMapSize}`}</MapHeader>
            </SizeContainer>
          </OutputHeader>
          <MapOutput data={dopeMapData} />
        </OutputContainer>
        <OutputContainer>
          <OutputHeader>
            <MapHeader style={{ color: DopeColors.green }}>Map</MapHeader>
            <SizeContainer>
              <MapHeader
                style={{
                  color: DopeColors.green,
                }}
              >{`Size: ${mapSize}`}</MapHeader>
            </SizeContainer>
          </OutputHeader>
          <MapOutput data={mapData} color={DopeColors.green} />
        </OutputContainer>
      </VisualizerContainer>
    </div>
  );
}

export default MapVisualizer;
