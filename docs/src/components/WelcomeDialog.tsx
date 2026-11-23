import { RefObject, useEffect } from "react";
import mascot from "../dope-badges.png";
import { AsciiTitle } from "./Header";

const SEEN = "welcome-seen";

export function WelcomeDialog({ ref }: { ref: RefObject<HTMLDialogElement | null> }) {
  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(SEEN) === "1";
    } catch {
      // storage blocked: show it every visit
    }
    if (!seen && !ref.current?.open) ref.current?.showModal();
  }, [ref]);

  const markSeen = () => {
    try {
      localStorage.setItem(SEEN, "1");
    } catch {
      // ignore
    }
  };

  return (
    <dialog
      ref={ref}
      className="welcome"
      onClose={markSeen}
      // a click on the backdrop lands on the dialog element itself
      onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
    >
      <AsciiTitle />
      <img className="welcome-mascot" src={mascot} alt="DOPE mascot with passing badges" />
      <p>
        Set the same key in both maps and watch what happens. A <code>Map</code>{" "}
        sees every new object as a new key. A <code>DopeMap</code> hashes the
        object's contents, so equal objects land on the same entry, in any
        property order.
      </p>
      <p>Click a key in either map to reuse that exact object as the key.</p>
      <form method="dialog">
        <button className="button primary" autoFocus>
          dope.
        </button>
      </form>
    </dialog>
  );
}
