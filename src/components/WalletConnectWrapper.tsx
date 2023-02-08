import React from "react";
import SignClient from "@walletconnect/sign-client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import _ from "lodash";
import Button from "./Button";

interface Props {
  onSessionConnected: (session: any) => void;
  onSessionUpdate: (session: any) => void;
}

interface State {
  isConnecting: boolean;
  signClient: any;
}

class WalletConnectWrapper extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isConnecting: false,
      signClient: null,
    };
  }

  async componentDidMount() {
    const signClient = await SignClient.init({
      projectId: "d3541dee612434b6498552f570478076", // Get ProjectID from WalletConnect
      metadata: {
        name: "Pitaka Connect Example",
        description: "Pitaka Connect Example",
        url: "#",
        icons: [
          "https://raw.githubusercontent.com/tetrixtech/assets/main/icons/PitakaLogo.png",
        ],
      },
    });

    this.setState({ signClient });
    // @ts-ignore
    signClient.on("session_event", ({ event }) => {
      // Handle session events, such as "chainChanged", "accountsChanged", etc.
    });

    signClient.on("session_update", ({ topic, params }) => {
      const { namespaces } = params;
      const _session = signClient.session.get(topic);
      // Overwrite the `namespaces` of the existing session with the incoming one.
      const updatedSession = { ..._session, namespaces };
      // Integrate the updated session state into your dapp state.
      this.props.onSessionUpdate(updatedSession);
    });

    signClient.on("session_delete", () => {
      console.log("Session was deleted");
    });
  }

  handleConnect = async () => {
    try {
      this.setState({ isConnecting: true });
      const { uri, approval } = await this.state.signClient.connect({
        // Optionally: pass a known prior pairing (e.g. from `signClient.core.pairing.getPairings()`) to skip the `uri` step.
        // Provide the namespaces and chains (e.g. `eip155` for EVM-based chains) we want to use in this session.
        requiredNamespaces: {
          eip155: {
            methods: [
              "eth_sendTransaction",
              "eth_signTransaction",
              "eth_sign",
              "personal_sign",
              "eth_signTypedData",
            ],
            chains: ["eip155:1"],
            events: ["chainChanged", "accountsChanged"],
          },
        },
      });

      // Open QRCode modal if a URI was returned (i.e. we're not connecting an existing pairing).
      if (uri) {
        QRCodeModal.open(uri, _, { desktopLinks: []});
      }

      // Await session approval from the wallet.
      const session = await approval();
      // Handle the returned session (e.g. update UI to "connected" state).
      await this.props.onSessionConnected(session);
    } catch (e) {
      console.error(e);
    } finally {
      // Close the QRCode modal in case it was open.
      QRCodeModal.close();
      this.setState({ isConnecting: false });
    }
  };

  render() {
    return (
      <div>
        <h3>Wallet Connect Standalone</h3>
        <Button onClick={this.handleConnect} disabled={this.state.isConnecting}>
          Connect Wallet
        </Button>
      </div>
    );
  }
}

export default WalletConnectWrapper;
