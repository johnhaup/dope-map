import { ToastContainer } from "react-toastify";
import styled from "styled-components";
import KeyValueForm from "./components/KeyValueForm";
import MapVisualizer from "./components/MapVisualizer";
import { GHIcon } from "./components/GHIcon";

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
  width: 100%;
  max-width: 350px;
`;

const HeaderIconsContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

function App() {
  return (
    <AppWrapper>
      <HeaderIconsContainer>
        <div />
        <h1>Map vs DopeMap</h1>
        <GHIcon />
      </HeaderIconsContainer>
      <Dope src={require("./dope.jpg")} />
      <KeyValueForm />
      <MapVisualizer />
      <ToastContainer
        aria-label={"toast"}
        position="bottom-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        theme="light"
      />
    </AppWrapper>
  );
}

export default App;
