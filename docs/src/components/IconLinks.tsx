import styled from "styled-components";
import { DopeColors } from "../constants";

const Container = styled.div`
  display: flex;
  flexdirection: row;
`;

const GH = styled.i`
  @keyframes colorPulse {
    0% {
      color: ${DopeColors.pink};
    }
    50% {
      color: ${DopeColors.green};
    }
    100% {
      color: ${DopeColors.pink};
    }
  }

  color: ${DopeColors.black};
  transition: transform 0.3s ease, color 1.2s ease;

  &:hover {
    transform: scale(1.2) rotate(8deg);
    animation: colorPulse 1.2s infinite;
  }
`;

const LI = styled.i`
  @keyframes colorPulse {
    0% {
      color: ${DopeColors.pink};
    }
    50% {
      color: ${DopeColors.blue};
    }
    100% {
      color: ${DopeColors.pink};
    }
  }

  color: ${DopeColors.black};
  transition: transform 0.3s ease, color 1.2s ease;

  &:hover {
    transform: scale(1.2) rotate(8deg);
    animation: colorPulse 1.2s infinite;
  }
`;

const Separator = styled.div`
  width: 16px;
`;

export function IconLinks() {
  return (
    <Container>
      <a href="https://www.linkedin.com/in/johnhaup" target="_blank">
        <LI className="fab fa-linkedin header-icon" />
      </a>
      <Separator />
      <a href="https://github.com/johnhaup/dope-map" target="_blank">
        <GH className="fab fa-github header-icon" />
      </a>
    </Container>
  );
}
