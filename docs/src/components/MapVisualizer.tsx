import { useAtomValue } from "jotai";
import {
  dopeMapEntriesArrayAtom,
  dopeMapSizeAtom,
  jsMapEntriesArrayAtom,
  jsMapSizeAtom,
} from "../atoms/state";

function MapVisualizer() {
  const mapData = useAtomValue(jsMapEntriesArrayAtom);
  const dopeMapData = useAtomValue(dopeMapEntriesArrayAtom);
  const mapSize = useAtomValue(jsMapSizeAtom);
  const dopeMapSize = useAtomValue(dopeMapSizeAtom);

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Map Visualization
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          alignItems: "stretch",
          width: "100%",
          height: "400px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            flex: 1,
            backgroundColor: "#1e1e1e",
            color: "#dcdcdc",
            fontFamily: "Courier New, monospace",
            fontSize: "14px",
            border: "1px solid #333",
            borderRadius: "4px",
            overflow: "auto",
            padding: "10px",
          }}
        >
          <div
            style={{
              position: "relative",
              flexShrink: 0,
            }}
          >
            <h3 style={{ color: "#4fa3d1", margin: 0 }}>Map</h3>
            <div
              style={{
                position: "absolute",
                right: "0px",
                top: "0px",
                height: "100%",
                justifyContent: "center",
              }}
            >
              <h3
                style={{
                  color: "#4fa3d1",
                  margin: 0,
                }}
              >{`Size: ${mapSize}`}</h3>
            </div>
          </div>
          <pre
            style={{
              margin: 0,
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              lineHeight: "1.4",
              textAlign: "left",
            }}
          >
            {JSON.stringify(mapData, null, 2)}
          </pre>
        </div>
        <div
          style={{
            flex: 1,
            backgroundColor: "#1e1e1e",
            color: "#dcdcdc",
            fontFamily: "Courier New, monospace",
            fontSize: "14px",
            border: "1px solid #333",
            borderRadius: "4px",
            overflow: "auto",
            padding: "10px",
          }}
        >
          <div
            style={{
              position: "relative",
            }}
          >
            <h3 style={{ color: "#3ca94b", margin: 0 }}>DopeMap</h3>
            <div
              style={{
                position: "absolute",
                right: "0px",
                top: "0px",
                height: "100%",
                justifyContent: "center",
              }}
            >
              <h3
                style={{
                  color: "#3ca94b",
                  margin: 0,
                }}
              >{`Size: ${dopeMapSize}`}</h3>
            </div>
          </div>
          <pre
            style={{
              margin: 0,
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              lineHeight: "1.4",
              textAlign: "left",
            }}
          >
            {JSON.stringify(dopeMapData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default MapVisualizer;
