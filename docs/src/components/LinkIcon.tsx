import { FiLink } from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";

interface Props {
  show: boolean;
  style?: React.CSSProperties;
}

export const LinkIcon = ({ show, style }: Props) => {
  if (!show) {
    return null;
  }

  return (
    <div style={style}>
      <FiLink />
    </div>
  );
};
