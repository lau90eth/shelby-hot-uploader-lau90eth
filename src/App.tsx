import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Upload, Database, Wallet, LogOut, Github, Twitter, MessageCircle } from 'lucide-react';
import { useAptosWallet } from './hooks/useAptosWallet';
import { UploadForm } from './components/UploadForm';
import { MyBlobs } from './components/MyBlobs';
import { ShelbyLogo } from './components/ShelbyLogo';

type Tab = 'upload' | 'blobs';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('upload');
  const { connected, account, loading, error, connect, disconnect, signAndSubmitTransaction } = useAptosWallet();
  
  const truncate = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Toaster position="top-right" />
      
      <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <ShelbyLogo size="md" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Shelby Hot Uploader</h1>
            <p className="text-xs text-pink-600 font-medium">by Lau90eth</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <button onClick={() => setActiveTab('upload')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'upload' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
              <Upload className="w-4 h-4" />Upload
            </button>
            <button onClick={() => setActiveTab('blobs')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'blobs' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
              <Database className="w-4 h-4" />My Blobs
            </button>
          </div>
          
          {!connected ? (
            <button onClick={connect} disabled={loading} className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all shadow-md">
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Wallet className="w-4 h-4" />}
              Connect
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-mono text-sm text-green-700">{account ? truncate(account.address.toString()) : ''}</span>
              </div>
              <button onClick={disconnect} className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </nav>

      {error && (
        <div className="max-w-6xl mx-auto px-6 pt-4 w-full">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <span className="font-medium">Error:</span> {error}
          </div>
        </div>
      )}

      <main className="flex-1 max-w-6xl mx-auto px-6 py-8 w-full">
        {activeTab === 'upload' ? (
          connected && account ? (
            <>
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4"><ShelbyLogo size="xl" /></div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Upload to Shelby</h2>
                <p className="text-gray-600">Store files on Shelby decentralized storage</p>
              </div>
              <UploadForm walletAddress={account.address.toString()} signAndSubmitTransaction={signAndSubmitTransaction} />
            </>
          ) : (
            <div className="card p-12 max-w-md mx-auto mt-12 text-center">
              <div className="flex justify-center mb-6"><ShelbyLogo size="xl" /></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Connect Wallet</h2>
              <p className="text-gray-600 mb-6">Connect Petra wallet to upload files</p>
              <button onClick={connect} disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2">
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Wallet className="w-5 h-5" />}
                Connect Petra
              </button>
              <p className="text-xs text-gray-500 mt-4">Set Petra to <span className="font-semibold text-pink-600">Shelbynet</span></p>
            </div>
          )
        ) : (
          <MyBlobs />
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShelbyLogo size="sm" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Shelby Hot Uploader by Lau90eth</p>
              <p className="text-xs text-gray-500">Testnet tool – Use test wallet only | Feedback in Discord #creations</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com/lau90eth" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900"><Github className="w-5 h-5" /></a>
            <a href="https://x.com/lau_6669" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400"><Twitter className="w-5 h-5" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
