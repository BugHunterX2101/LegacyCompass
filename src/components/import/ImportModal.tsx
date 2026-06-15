import React, { useState, useRef } from 'react';
import { 
  XMarkIcon,
  DocumentArrowUpIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import {
  sanitizeInput,
  validateCSVFormat,
  validateFileSize,
  validateFileType,
  validateJSONFormat,
  validateLeadData,
} from '../../utils/validation';

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
    const validTypes = ['text/csv', 'application/json'];
    const fileExtension = selectedFile.name.toLowerCase().split('.').pop();
    
    if (!validateFileType(selectedFile, validTypes) && !['csv', 'json'].includes(fileExtension || '')) {
      setError('Please select a CSV or JSON file');
      return;
    }

    if (!validateFileSize(selectedFile, 5)) {
      setError('File size must be 5 MB or smaller');
      return;
    }
    
    setFile(selectedFile);
    setError(null);
  };

  const parseCSVLine = (line: string): string[] => {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"' && nextChar === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    values.push(current.trim());
    return values;
  };

  const normalizeLeadRows = (rows: any[]): any[] => {
    return rows.map(row => {
      const normalized: Record<string, unknown> = {};
      Object.entries(row).forEach(([key, value]) => {
        const cleanKey = sanitizeInput(key);
        normalized[cleanKey] = typeof value === 'string' ? sanitizeInput(value) : value;
      });
      return normalized;
    });
  };

  const processFile = async () => {
    if (!file) return;
    
    setImporting(true);
    setError(null);
    
    try {
      const text = await file.text();
      let data: any[] = [];
      
      if (file.name.toLowerCase().endsWith('.json')) {
        if (!validateJSONFormat(text)) {
          throw new Error('Invalid JSON format');
        }
        const parsed = JSON.parse(text);
        data = Array.isArray(parsed) ? parsed : [parsed];
      } else if (file.name.toLowerCase().endsWith('.csv')) {
        if (!validateCSVFormat(text)) {
          throw new Error('Invalid CSV format');
        }
        const lines = text.split('\n');
        const headers = parseCSVLine(lines[0]).map(h => sanitizeInput(h.replace(/"/g, '')));
        
        data = lines.slice(1)
          .filter(line => line.trim())
          .map(line => {
            const values = parseCSVLine(line).map(v => v.replace(/"/g, ''));
            const obj: any = {};
            headers.forEach((header, index) => {
              obj[header] = values[index] ? sanitizeInput(values[index]) : '';
            });
            return obj;
          });
      }
      
      if (data.length === 0) {
        throw new Error('No data found in file');
      }

      data = normalizeLeadRows(data);

      const invalidRow = data.findIndex(row => !validateLeadData(row).valid);
      if (invalidRow !== -1) {
        const validation = validateLeadData(data[invalidRow]);
        throw new Error(`Row ${invalidRow + 1} is invalid: ${validation.errors.join(', ')}`);
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 modal-overlay">
      <div className="bg-[#13171D] rounded-2xl border border-slate-700/40 p-6 w-full max-w-md mx-4 modal-content shadow-2xl shadow-black/40">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white flex items-center">
            <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-emerald-500 to-teal-500 mr-3" />
            Import Leads
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700/30"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            dragActive 
              ? 'border-blue-400/60 bg-blue-500/8 shadow-inner' 
              : 'border-slate-700/40 hover:border-slate-600/50 hover:bg-slate-800/20'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="p-3 rounded-xl bg-slate-800/40 inline-block mb-4">
            <DocumentArrowUpIcon className="h-10 w-10 text-slate-400" />
          </div>
          <p className="text-white font-medium mb-1">Drop your file here or</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            browse files
          </button>
          <p className="text-xs text-slate-600 mt-2">Supports CSV and JSON files (max 5 MB)</p>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.json"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>

        {file && (
          <div className="mt-4 p-3.5 bg-[#0E1218] rounded-xl border border-slate-700/30 flex items-center">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 mr-3">
              <DocumentTextIcon className="h-5 w-5 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium truncate">{file.name}</p>
              <p className="text-[10px] text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3.5 bg-red-500/8 border border-red-500/20 rounded-xl flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2.5 flex-shrink-0" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700/30"
          >
            Cancel
          </button>
          <button
            onClick={processFile}
            disabled={!file || importing}
            className="px-5 py-2.5 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:brightness-110"
            style={{
              background: 'linear-gradient(135deg, #059669, #10b981)',
              boxShadow: '0 2px 10px rgba(16, 185, 129, 0.25)',
            }}
          >
            {importing ? 'Importing...' : 'Import'}
          </button>
        </div>
      </div>
    </div>
  );
};
