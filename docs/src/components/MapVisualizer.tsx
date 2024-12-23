import { useAtomValue } from "jotai";
import {
  dopeMapEntriesArrayAtom,
  dopeMapSizeAtom,
  jsMapEntriesArrayAtom,
  jsMapSizeAtom,
} from "../atoms/derived";

import styled from "styled-components";

const SectionHeader = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const VisualizerContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: stretch;
  width: 100%;
  height: 400px;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    gap: 0px;
  }
`;

const OutputContainer = styled.div`
  flex: 1;
  background-color: #1e1e1e;
  color: #dcdcdc;
  font-family: "Courier New", monospace;
  font-size: 14px;
  border: 1px solid #333;
  border-radius: 4px;
  overflow: auto;
  padding: 10px;
  margin-bottom: 20px;
`;

const OutputHeader = styled.div`
  position: relative;
`;

const MapHeader = styled.h3`
  color: #4fa3d1;
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

const MapOutput = styled.pre`
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.4;
  text-align: left;
`;

function MapVisualizer() {
  const mapData = useAtomValue(jsMapEntriesArrayAtom);
  const dopeMapData = useAtomValue(dopeMapEntriesArrayAtom);
  const mapSize = useAtomValue(jsMapSizeAtom);
  const dopeMapSize = useAtomValue(dopeMapSizeAtom);

  return (
    <div>
      <SectionHeader>Map Visualization</SectionHeader>
      <VisualizerContainer>
        <OutputContainer>
          <OutputHeader>
            <MapHeader>Map</MapHeader>
            <SizeContainer>
              <MapHeader>{`Size: ${mapSize}`}</MapHeader>
            </SizeContainer>
          </OutputHeader>
          <MapOutput>{JSON.stringify(mapData, null, 2)}</MapOutput>
        </OutputContainer>
        <OutputContainer>
          <OutputHeader>
            <MapHeader style={{ color: "#3ca94b" }}>DopeMap</MapHeader>
            <SizeContainer>
              <MapHeader
                style={{
                  color: "#3ca94b",
                }}
              >{`Size: ${dopeMapSize}`}</MapHeader>
            </SizeContainer>
          </OutputHeader>
          <MapOutput>{JSON.stringify(dopeMapData, null, 2)}</MapOutput>
        </OutputContainer>
      </VisualizerContainer>
    </div>
  );
}

export default MapVisualizer;
