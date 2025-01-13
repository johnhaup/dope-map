import { ToastContainer } from "react-toastify";
import styled from "styled-components";
import { DopeHeader } from "./components/DopeHeader";
import { DopeMascot } from "./components/DopeMascot";
import { GHIcon } from "./components/GHIcon";
import { InfoModal } from "./components/InfoModal";
import KeyValueForm from "./components/KeyValueForm";
import MapVisualizer from "./components/MapVisualizer";
import { useWindowSize } from "@uidotdev/usehooks";

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

const HeaderRow = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
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

function App() {
  const windowSize = useWindowSize();

  return (
    <AppWrapper>
      <InfoModal />
      <HeaderWrapperContainer>
        <HeaderRow>
          <div style={{ display: "flex" }}>
            {windowSize.width > 768 && (
              <DopeMascot
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "8px",
                  margin: "8px 16px 8px 0px",
                }}
              />
            )}
            <DopeHeader />
          </div>
          {windowSize.width > 768 && <GHIcon />}
        </HeaderRow>
      </HeaderWrapperContainer>
      <KeyValueForm />
      <MapVisualizer />
      {windowSize.width <= 768 && <GHIcon />}
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
