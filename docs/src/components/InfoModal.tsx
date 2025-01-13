import { useState } from "react";
import Modal from "react-modal";
import styled from "styled-components";
import { DopeColors } from "../constants";
import { DopeHeader } from "./DopeHeader";
import { DopeMascot } from "./DopeMascot";

const HelperText = styled.p`
  font-size: 14px;
  width: 100%;
  max-width: 400px;
`;

export function InfoModal() {
  const [isOpen, setIsOpen] = useState(true);

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Welcome Modal"
      ariaHideApp={false}
      style={{
        overlay: {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255,255,255, 0.75)",
          zIndex: 100,
          justifyContent: "center",
          alignItems: "center",
        },
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "16px",
        },
      }}
    >
      <DopeHeader />
      <DopeMascot />
      <HelperText>
        Add items to the maps using the key/value inputs. Notice the difference
        when you use an object for the key. Try switching the order of the keys!
        You can use references to existing keys by clicking on them in the Maps.
      </HelperText>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          paddingRight: "8px",
        }}
      >
        <button onClick={closeModal}>dope.</button>
      </div>
    </Modal>
  );
}
