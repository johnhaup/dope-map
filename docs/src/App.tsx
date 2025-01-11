import { ToastContainer } from "react-toastify";
import styled from "styled-components";
import KeyValueForm from "./components/KeyValueForm";
import MapVisualizer from "./components/MapVisualizer";
import { GHIcon } from "./components/GHIcon";
import { useAsciiText, larry3D } from "react-ascii-text";

const AppWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 8px 24px 16px 24px;
  width: 100%;
  box-sizing: border-box;
  text-align: center;

  @media (max-width: 768px) {
    padding: 16px 24px 16px 24px;
  }
`;

const HeaderColumn = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const HeaderWrapperContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0px;
    margin-bottom: 20px;
  }
`;

const Dope = styled.img`
  border-radius: 24px;
  width: 100%;
  max-width: 400px;
  margin: 16px 0px;
`;

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

const HelperText = styled.p`
  font-size: 14px;
  width: 100%;
  max-width: 400px;
`;

const Ascii = styled.pre`
  font-size: 6px;
`;

function Title() {
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

function App() {
  return (
    <AppWrapper>
      <HeaderWrapperContainer>
        <HeaderColumn>
          <Title />
          <Dope src={require("./dope.jpg")} />
          <HelperText>
            Add items to the maps using the key/value inputs. Notice the
            difference when you use an object for the key.
          </HelperText>
          <GHIcon />
        </HeaderColumn>
        <HeaderColumn>
          <KeyValueForm />
        </HeaderColumn>
      </HeaderWrapperContainer>
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
