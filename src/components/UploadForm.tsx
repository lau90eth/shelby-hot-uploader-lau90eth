import { useState, useRef, useCallback } from 'react';
import { Upload, X, File, Calendar, CheckCircle, ExternalLink, Copy, Loader2, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { FilePreview } from './FilePreview';
import { AutoTestRead } from './AutoTestRead';
import { uploadToShelbyReal, formatFileSize, getExplorerLink } from '../utils/shelby-real';
import type { UploadedBlob } from '../types';

interface UploadFormProps {
  walletAddress: string;
  signAndSubmitTransaction: (transaction: any) => Promise<{ hash: string }>;
}

export const UploadForm = ({ walletAddress, signAndSubmitTransaction }: UploadFormProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [blobName, setBlobName] = useState('');
  const [expirationDays, setExpirationDays] = useState(365);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedBlob, setUploadedBlob] = useState<UploadedBlob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setBlobName(file.name);
      setUploadedBlob(null);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setBlobName(file.name);
      setUploadedBlob(null);
    }
  }, []);

  const handleUpload = async () => {
    // ✅ FIX: usa selectedFile invece di file
    if (!selectedFile || !walletAddress) {
      toast.error('Select file and connect wallet');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      setUploadProgress(30);
      
      const result = await uploadToShelbyReal(
        { 
          file: selectedFile,  // ✅ selectedFile definito
          name: blobName || selectedFile.name, 
          expirationDays, 
          owner: walletAddress 
        }, 
        signAndSubmitTransaction
      );

      setUploadProgress(100);

      const newBlob: UploadedBlob = {
        id: result.blobId,
        name: blobName || selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        url: result.url,
        transactionHash: result.txHash,
        timestamp: Date.now(),
        expirationDays,
        status: 'success',
      };

      const existing = JSON.parse(localStorage.getItem('shelby_blobs') || '[]');
      localStorage.setItem('shelby_blobs', JSON.stringify([newBlob, ...existing]));

      setUploadedBlob(newBlob);
      toast.success('Uploaded to Shelby!');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  const resetForm = () => {
    setSelectedFile(null);
    setBlobName('');
    setUploadedBlob(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (uploadedBlob) {
    return (
      <div className="card max-w-2xl mx-auto text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Upload Complete!</h2>
        <p className="text-gray-600 mb-8">File stored on Shelby network</p>
        
        <AutoTestRead 
          blobUrl={uploadedBlob.url} 
          onTestComplete={(result) => setUploadedBlob(prev => prev ? { ...prev, testResult: result } : null)} 
        />
        
        <div className="space-y-3 max-w-md mx-auto mt-6">
          <button 
            onClick={() => copyToClipboard(uploadedBlob.url, 'URL')} 
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <Copy className="w-4 h-4" />Copy URL
          </button>
          <a 
            href={getExplorerLink(uploadedBlob.transactionHash)} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-primary flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />View Explorer
          </a>
          <button onClick={resetForm} className="btn-secondary">Upload Another</button>
        </div>
        
        <div className="mt-8 p-4 bg-gray-50 rounded-xl text-left max-w-md mx-auto">
          <p className="text-xs text-gray-500 mb-1">Blob ID</p>
          <p className="font-mono text-sm text-gray-700 break-all mb-4">{uploadedBlob.id}</p>
          <p className="text-xs text-gray-500 mb-1">Transaction</p>
          <p className="font-mono text-sm text-gray-700 break-all">{uploadedBlob.transactionHash}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
            <Upload className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Upload Files</h3>
        </div>
        
        <div className="space-y-4">
          <div 
            onDrop={handleDrop} 
            onDragOver={(e) => e.preventDefault()} 
            onClick={() => fileInputRef.current?.click()} 
            className="upload-zone"
          >
            <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" />
            <Upload className="w-12 h-12 mx-auto text-pink-500 mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">Drop file here</p>
            <p className="text-sm text-gray-500">or click to browse</p>
          </div>
          
          {selectedFile && (
            <button 
              onClick={() => setSelectedFile(null)} 
              className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-medium py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />Remove
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">File Details</h3>
        </div>
        
        <div className="space-y-4">
          <FilePreview file={selectedFile} />
          
          {selectedFile && (
            <>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <File className="w-4 h-4" />Blob Name
                </label>
                <input 
                  type="text" 
                  value={blobName} 
                  onChange={(e) => setBlobName(e.target.value)} 
                  className="input-field" 
                  placeholder="Enter name" 
                />
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4" />Expiration
                </label>
                <select 
                  value={expirationDays} 
                  onChange={(e) => setExpirationDays(Number(e.target.value))} 
                  className="input-field"
                >
                  <option value={7}>7 Days</option>
                  <option value={30}>30 Days</option>
                  <option value={90}>90 Days</option>
                  <option value={180}>180 Days</option>
                  <option value={365}>365 Days</option>
                </select>
              </div>

              {isUploading ? (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Uploading...</span>
                    <span className="text-sm text-pink-600 font-semibold">{uploadProgress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-pink-500 to-rose-600 transition-all" 
                      style={{ width: `${uploadProgress}%` }} 
                    />
                  </div>
                </div>
              ) : (
                <button 
                  onClick={handleUpload} 
                  className="btn-primary flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5" />Upload to Shelby
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
