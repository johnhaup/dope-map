import styled, { CSSProperties } from "styled-components";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const DOPE_IMG = require("../dope-badges.png");

const Dope = styled.img`
  border-radius: 24px;
  width: 100%;
  max-width: 400px;
  margin: 16px 0px;
`;

interface Props {
  style?: CSSProperties;
}

export function DopeMascot({ style }: Props) {
  return <Dope src={DOPE_IMG} style={style} />;
}
