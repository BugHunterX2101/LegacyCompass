import React, { useState, useRef } from 'react';
import { 
  XMarkIcon,
  DocumentArrowUpIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any[]) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    const validTypes = ['text/csv', 'application/json', '.csv', '.json'];
    const fileExtension = selectedFile.name.toLowerCase().split('.').pop();
    
    if (!validTypes.includes(selectedFile.type) && !['csv', 'json'].includes(fileExtension || '')) {
      setError('Please select a CSV or JSON file');
      return;
    }
    
    setFile(selectedFile);
    setError(null);
  };

  const processFile = async () => {
    if (!file) return;
    
    setImporting(true);
    setError(null);
    
    try {
      const text = await file.text();
      let data: any[] = [];
      
      if (file.name.toLowerCase().endsWith('.json')) {
        data = JSON.parse(text);
      } else if (file.name.toLowerCase().endsWith('.csv')) {
        // Simple CSV parser
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        
        data = lines.slice(1)
          .filter(line => line.trim())
          .map(line => {
            const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
            const obj: any = {};
            headers.forEach((header, index) => {
              obj[header] = values[index] || '';
            });
            return obj;
          });
      }
      
      if (data.length === 0) {
        throw new Error('No data found in file');
      }
      
      onImport(data);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Import Leads</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-blue-400 bg-blue-400/10' 
              : 'border-gray-600 hover:border-gray-500'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <DocumentArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-white mb-2">Drop your file here or</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            browse files
          </button>
          <p className="text-sm text-gray-500 mt-2">Supports CSV and JSON files</p>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.json"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>

        {file && (
          <div className="mt-4 p-3 bg-[#161B22] rounded border border-gray-700">
            <p className="text-sm text-white">Selected: {file.name}</p>
            <p className="text-xs text-gray-400">Size: {(file.size / 1024).toFixed(1)} KB</p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-900/20 border border-red-700 rounded flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={processFile}
            disabled={!file || importing}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {importing ? 'Importing...' : 'Import'}
          </button>
        </div>
      </div>
    </div>
  );
};