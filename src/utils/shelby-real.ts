import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { ShelbyBlobClient, expectedTotalChunksets } from '@shelby-protocol/sdk/browser';

const config = new AptosConfig({
  network: Network.CUSTOM,
  fullnode: 'https://api.shelbynet.shelby.xyz/v1',
  faucet: 'https://faucet.shelbynet.shelby.xyz',
});

export const aptos = new Aptos(config);

export const SHELBY_RPC_ENDPOINT = 'https://api.shelbynet.shelby.xyz/shelby';
export const SHELBY_EXPLORER_URL = 'https://explorer.aptoslabs.com';

export interface ShelbyUploadParams {
  file: File;
  name: string;
  expirationDays: number;
  owner: string;
}

export interface ShelbyUploadResult {
  blobId: string;
  txHash: string;
  url: string;
}

const calculateExpirationMicros = (days: number): number => {
  return (1000 * 60 * 60 * 24 * days + Date.now()) * 1000;
};

export const uploadToShelbyReal = async (
  params: ShelbyUploadParams,
  signAndSubmitTransaction: any
): Promise<ShelbyUploadResult> => {
  const { file, name, expirationDays, owner } = params;

  const payload = ShelbyBlobClient.createRegisterBlobPayload({
    account: owner,
    blobName: name,
    blobMerkleRoot: await calculateMerkleRoot(file),
    numChunksets: expectedTotalChunksets(file.size),
    expirationMicros: calculateExpirationMicros(expirationDays),
    blobSize: file.size,
  });

  const transaction = { data: payload };

  console.log("Transaction:", JSON.stringify(transaction, null, 2));

  const response = await signAndSubmitTransaction(transaction);
  
  const uploadUrl = `${SHELBY_RPC_ENDPOINT}/v1/blobs/${owner}/${encodeURIComponent(name)}`;
  
  // Upload con retry
  let retries = 3;
  while (retries > 0) {
    try {
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Length': file.size.toString(),
        },
        body: await file.arrayBuffer(),
      });
      
      if (uploadResponse.ok) break;
      
      retries--;
      if (retries > 0) await new Promise(r => setTimeout(r, 1000));
    } catch (e) {
      retries--;
      if (retries === 0) throw e;
    }
  }

  return {
    blobId: name,
    txHash: response.hash,
    url: uploadUrl
  };
};

const calculateMerkleRoot = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// ✅ FIX: Link corretto per Aptos Explorer
export const getExplorerLink = (txHash: string): string => {
  return `${SHELBY_EXPLORER_URL}/txn/${txHash}?network=shelbynet`;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileType = (file: File): 'image' | 'video' | 'audio' | 'pdf' | 'text' | 'unknown' => {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('video/')) return 'video';
  if (file.type.startsWith('audio/')) return 'audio';
  if (file.type === 'application/pdf') return 'pdf';
  if (file.type.startsWith('text/')) return 'text';
  return 'unknown';
};
