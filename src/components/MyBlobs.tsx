import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { File, ExternalLink, Copy, Trash2, Clock, HardDrive, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatFileSize, getExplorerLink } from '../utils/shelby-real';
import { AutoTestRead } from './AutoTestRead';
import type { UploadedBlob } from '../types';

export const MyBlobs = () => {
  const [blobs, setBlobs] = useState<UploadedBlob[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlob, setSelectedBlob] = useState<UploadedBlob | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('shelby_blobs');
    if (saved) {
      try {
        setBlobs(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const filteredBlobs = blobs.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Copied!');
  };

  const deleteBlob = (id: string) => {
    const updated = blobs.filter(b => b.id !== id);
    setBlobs(updated);
    localStorage.setItem('shelby_blobs', JSON.stringify(updated));
    toast.success('Removed');
  };

  const getIcon = (type: string) => {
    if (type.startsWith('image/')) return 'text-purple-500';
    if (type.startsWith('video/')) return 'text-red-500';
    if (type.startsWith('audio/')) return 'text-green-500';
    return 'text-blue-500';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="input-field pl-10" 
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <HardDrive className="w-4 h-4" />
          <span>{blobs.length} blobs</span>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {filteredBlobs.map((blob, i) => (
            <motion.div 
              key={blob.id} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, x: -100 }} 
              transition={{ delay: i * 0.05 }} 
              className="card hover:shadow-xl transition-shadow cursor-pointer" 
              onClick={() => setSelectedBlob(selectedBlob?.id === blob.id ? null : blob)}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 bg-gray-50 rounded-xl ${getIcon(blob.type)}`}>
                  <File className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{blob.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{formatFileSize(blob.size)}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(blob.timestamp).toLocaleDateString()}
                    </span>
                    <span className="text-pink-600 font-medium">{blob.expirationDays}d</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {blob.testResult?.success && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">✓</span>
                  )}
                  <button 
                    onClick={(e) => { e.stopPropagation(); copyUrl(blob.url); }} 
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Copy className="w-4 h-4 text-gray-500" />
                  </button>
                  <a 
                    href={getExplorerLink(blob.transactionHash)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    onClick={(e) => e.stopPropagation()} 
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <ExternalLink className="w-4 h-4 text-gray-500" />
                  </a>
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteBlob(blob.id); }} 
                    className="p-2 hover:bg-red-50 text-red-500 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {selectedBlob?.id === blob.id && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  className="mt-4 pt-4 border-t border-gray-100"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500">Blob ID</p>
                      <p className="font-mono text-sm text-gray-700 break-all">{blob.id}</p>
                      <p className="text-xs text-gray-500 mt-3">Transaction</p>
                      <p className="font-mono text-sm text-gray-700 break-all">{blob.transactionHash}</p>
                    </div>
                    <AutoTestRead blobUrl={blob.url} autoStart={false} />
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredBlobs.length === 0 && (
        <div className="card p-12 text-center">
          <HardDrive className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No blobs found</p>
        </div>
      )}
    </div>
  );
};
