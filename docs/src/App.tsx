import { Header } from "./components/Header";
import { WelcomeDialog } from "./components/WelcomeDialog";
import { Playground } from "./components/Playground";
import { SpeedRace } from "./components/SpeedRace";
import { HookDemo } from "./components/HookDemo";
import { CopyButton } from "./components/CopyButton";
import { useRef } from "react";

const INSTALL = "npm i @johnhaup/dope-map";

export function App() {
  const welcome = useRef<HTMLDialogElement>(null);

  return (
    <div className="page">
      <WelcomeDialog ref={welcome} />
      <Header onInfo={() => welcome.current?.showModal()} />

      <section className="intro">
        <p className="lede">
          A <code>Map</code> that matches keys by <em>value</em>, not by
          reference. Two objects that look the same are the same key, whatever
          order their properties are in.
        </p>
        <div className="install">
          <code>{INSTALL}</code>
          <CopyButton text={INSTALL} label="Copy install command" />
        </div>
      </section>

      <Playground />
      <SpeedRace />
      <HookDemo />

      <footer className="footer">
        <a href="https://github.com/johnhaup/dope-map">GitHub</a>
        <span aria-hidden>·</span>
        <a href="https://www.npmjs.com/package/@johnhaup/dope-map">npm</a>
        <span aria-hidden>·</span>
        <span>stay dope.</span>
      </footer>
    </div>
  );
}
