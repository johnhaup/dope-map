import { larry3D, useAsciiText } from "react-ascii-text";
import { FiGithub, FiHelpCircle, FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../theme";
import mascot from "../dope-badges.png";

function Ascii({ text }: { text: string }) {
  const ref = useAsciiText({ font: larry3D, text, isAnimated: false });
  return <pre className="ascii" ref={ref} aria-hidden />;
}

export function AsciiTitle() {
  return (
    <h1 className="ascii-title">
      <span className="visually-hidden">Map vs DopeMap</span>
      <Ascii text="Map vs" />
      <Ascii text="DOPEMAP" />
    </h1>
  );
}

export function Header({ onInfo }: { onInfo: () => void }) {
  const { theme, toggle } = useTheme();

  return (
    <header className="header">
      <img className="mascot" src={mascot} alt="" />
      <AsciiTitle />
      <nav className="header-actions">
        <button className="icon-button" onClick={onInfo} aria-label="How it works">
          <FiHelpCircle />
        </button>
        <button
          className="icon-button"
          onClick={toggle}
          aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
        >
          {theme === "dark" ? <FiSun /> : <FiMoon />}
        </button>
        <a
          className="icon-button"
          href="https://github.com/johnhaup/dope-map"
          aria-label="DopeMap on GitHub"
        >
          <FiGithub />
        </a>
      </nav>
    </header>
  );
}
