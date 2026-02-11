export interface UploadedBlob { id: string; name: string; size: number; type: string; url: string; transactionHash: string; timestamp: number; expirationDays: number; status: 'pending' | 'success' | 'error'; testResult?: { success: boolean; responseTime: number; size: number; }; }
export interface UploadParams { file: File; name: string; expirationDays: number; owner: string; }
export interface UploadResult { blobId: string; url: string; txHash: string; }
