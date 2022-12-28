import React from "react";
import ReactDOM from "react-dom/client";
import WalletConnectWrapper from "./components/WalletConnectWrapper";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <WalletConnectWrapper
    onSessionConnected={(session: any) => console.log(session)}
    onSessionUpdate={(session: any) => console.log(session)}
  />
);
