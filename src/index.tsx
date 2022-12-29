import React from "react";
import ReactDOM from "react-dom/client";
import WalletConnectWrapper from "./components/WalletConnectWrapper";
import { WagmiConfig, createClient, configureChains, mainnet } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { WagmiConnect } from "./components/WagmiConnect";

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider, webSocketProvider } = configureChains(
  [mainnet],
  [publicProvider()],
)

// Set up client
const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
        version: '2',
        projectId: 'd3541dee612434b6498552f570478076', // YOUR <PROJECT_ID>
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
})

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <>
    <WalletConnectWrapper
    onSessionConnected={(session: any) => console.log(session)}
    onSessionUpdate={(session: any) => console.log(session)} />
    <WagmiConfig client={client}>
      <WagmiConnect />
    </WagmiConfig>
  </>
);
