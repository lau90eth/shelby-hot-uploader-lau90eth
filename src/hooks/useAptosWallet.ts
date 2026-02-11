import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useCallback } from "react";

export const useAptosWallet = () => {
  const { 
    connected, 
    account, 
    wallet, 
    connect, 
    disconnect, 
    signAndSubmitTransaction,
    isLoading 
  } = useWallet();

  const handleConnect = useCallback(async () => {
    try {
      await connect("Petra");
    } catch (err: any) {
      console.error("Connection error:", err);
    }
  }, [connect]);

  return {
    connected,
    account: account ? { address: account.address.toString(), publicKey: account.publicKey?.toString() || "" } : null,
    wallet,
    loading: isLoading,
    error: null,
    connect: handleConnect,
    disconnect,
    signAndSubmitTransaction
  };
};
