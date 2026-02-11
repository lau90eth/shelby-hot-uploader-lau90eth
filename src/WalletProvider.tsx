import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { ReactNode } from "react";

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AptosWalletAdapterProvider autoConnect={false}>
      {children}
    </AptosWalletAdapterProvider>
  );
};
