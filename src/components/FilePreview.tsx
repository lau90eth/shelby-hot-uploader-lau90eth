import { File, Image, Music, Video, FileText } from 'lucide-react';
import { formatFileSize } from '../utils/shelby-real';
interface FilePreviewProps { file: File | null; }
export const FilePreview = ({ file }: FilePreviewProps) => {
  if (!file) return <div className="text-center py-8 text-gray-400"><File className="w-12 h-12 mx-auto mb-2 opacity-50" /><p className="text-sm">No file selected</p></div>;
  const getIcon = () => { if (file.type.startsWith('image/')) return <Image className="w-8 h-8 text-purple-500" />; if (file.type.startsWith('video/')) return <Video className="w-8 h-8 text-red-500" />; if (file.type.startsWith('audio/')) return <Music className="w-8 h-8 text-green-500" />; if (file.type === 'application/pdf') return <FileText className="w-8 h-8 text-red-500" />; return <File className="w-8 h-8 text-blue-500" />; };
  return <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100"><div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">{getIcon()}</div><div className="flex-1 min-w-0"><p className="font-medium text-gray-900 truncate">{file.name}</p><p className="text-sm text-gray-500">{formatFileSize(file.size)} • {file.type || 'Unknown'}</p></div></div>;
};
