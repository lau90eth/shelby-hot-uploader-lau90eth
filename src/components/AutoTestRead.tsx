import { useState } from 'react';
import { Play, CheckCircle, XCircle, Loader2 } from 'lucide-react';
interface AutoTestReadProps { blobUrl: string; autoStart?: boolean; onTestComplete?: (result: { success: boolean; responseTime: number; size: number }) => void; }
export const AutoTestRead = ({ blobUrl, autoStart = true, onTestComplete }: AutoTestReadProps) => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; responseTime: number; size: number } | null>(null);
  const runTest = async () => { setTesting(true); const start = performance.now(); try { const response = await fetch(blobUrl, { method: 'HEAD' }); const end = performance.now(); const testResult = { success: response.ok, responseTime: Math.round(end - start), size: parseInt(response.headers.get('content-length') || '0') }; setResult(testResult); onTestComplete?.(testResult); } catch { setResult({ success: false, responseTime: 0, size: 0 }); } finally { setTesting(false); } };
  if (!autoStart && !result && !testing) return <button onClick={runTest} className="flex items-center gap-2 text-sm text-pink-600 hover:text-pink-700 font-medium"><Play className="w-4 h-4" />Test Retrieval</button>;
  if (testing) return <div className="flex items-center gap-2 text-sm text-gray-600"><Loader2 className="w-4 h-4 animate-spin" />Testing...</div>;
  if (result) return <div className={`flex items-center gap-2 text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>{result.success ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}{result.success ? `Retrieved in ${result.responseTime}ms` : 'Failed'}</div>;
  return null;
};
