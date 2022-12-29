import { useConnect } from 'wagmi'
import Button from './Button'
 
export function WagmiConnect() {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect()
 
  return (
    <div style={{ marginTop: 10 }}>
      <h3>Wagmi Wallet Connect</h3>
      {connectors.map((connector) => (
        <div style={{ marginTop: 10 }}>
        <Button
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect({ connector })}>
          {connector.name}
          {!connector.ready && ' (unsupported)'}
          {isLoading &&
            connector.id === pendingConnector?.id &&
            ' (connecting)'}
        </Button>
        </div>
      ))}
 
      {error && <div>{error.message}</div>}
    </div>
  )
}