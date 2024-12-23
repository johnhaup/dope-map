import "./App.css";
import KeyValueForm from "./components/KeyValueForm";
import MapVisualizer from "./components/MapVisualizer";

function App() {
  return (
    <div style={{ padding: "0px 24px 16px 24px", textAlign: "center" }}>
      <h1>DopeMap vs JavaScript Map</h1>
      <img src={require("./dope.jpg")} style={{ borderRadius: "24px" }} />
      <KeyValueForm />
      <MapVisualizer />
    </div>
  );
}

export default App;
