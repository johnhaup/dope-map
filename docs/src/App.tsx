import "./App.css";
import KeyValueForm from "./components/KeyValueForm";
import MapVisualizer from "./components/MapVisualizer";
import styled from "styled-components";

const AppWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0px 24px 16px 24px;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
`;

const Dope = styled.img`
  border-radius: 24px;
`;

function App() {
  return (
    <AppWrapper>
      <h1>Map vs DopeMap</h1>
      <h5>WIP 🚧</h5>
      <Dope src={require("./dope.jpg")} />
      <KeyValueForm />
      <MapVisualizer />
    </AppWrapper>
  );
}

export default App;
