import React, { useState, useRef } from 'react';
import {
  XMarkIcon,
  DocumentArrowUpIcon,
  ExclamationTriangleIcon,
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
  const [preview, setPreview] = useState<number>(0);
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
    if (files && files[0]) handleFile(files[0]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) handleFile(files[0]);
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
    setPreview(0);
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
        const cleanKey = sanitizeInput(key.trim());
        normalized[cleanKey] = typeof value === 'string' ? sanitizeInput(value) : value;
      });

      // Ensure required fields have defaults
      if (!normalized.tags) normalized.tags = [];
      if (!normalized.status) normalized.status = 'new';
      if (!normalized.score) normalized.score = 50;
      if (!normalized.employeeCount) normalized.employeeCount = 0;

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
          throw new Error('Invalid JSON format. Please check your file.');
        }
        const parsed = JSON.parse(text);
        data = Array.isArray(parsed) ? parsed : [parsed];
      } else if (file.name.toLowerCase().endsWith('.csv')) {
        if (!validateCSVFormat(text)) {
          throw new Error('Invalid CSV format. Please ensure consistent columns.');
        }
        const lines = text.split('\n').filter(line => line.trim());
        if (lines.length < 2) throw new Error('CSV must have a header row and at least one data row');

        const headers = parseCSVLine(lines[0]).map(h => sanitizeInput(h.replace(/"/g, '').trim()));

        data = lines
          .slice(1)
          .filter(line => line.trim())
          .map(line => {
            const values = parseCSVLine(line).map(v => v.replace(/"/g, '').trim());
            const obj: any = {};
            headers.forEach((header, index) => {
              obj[header] = values[index] !== undefined ? sanitizeInput(values[index]) : '';
            });
            return obj;
          });
      } else {
        throw new Error('Unsupported file type. Please use CSV or JSON.');
      }

      if (data.length === 0) {
        throw new Error('No data found in file');
      }

      data = normalizeLeadRows(data);
      setPreview(data.length);

      // Validate a sample of rows (first 10)
      const sampleSize = Math.min(data.length, 10);
      for (let i = 0; i < sampleSize; i++) {
        const validation = validateLeadData(data[i]);
        if (!validation.valid) {
          throw new Error(`Row ${i + 1} is invalid: ${validation.errors.join(', ')}`);
        }
      }

      onImport(data);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    if (!importing) {
      setFile(null);
      setError(null);
      setPreview(0);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-6 w-full max-w-md mx-4 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Import Leads</h3>
          <button
            onClick={handleClose}
            disabled={importing}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            dragActive
              ? 'border-blue-400 bg-blue-400/10'
              : file
              ? 'border-green-500 bg-green-500/5'
              : 'border-gray-600 hover:border-gray-500'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !importing && fileInputRef.current?.click()}
        >
          <DocumentArrowUpIcon className={`h-12 w-12 mx-auto mb-4 ${file ? 'text-green-400' : 'text-gray-400'}`} />
          {file ? (
            <>
              <p className="text-white mb-1 font-medium">{file.name}</p>
              <p className="text-gray-400 text-sm">{(file.size / 1024).toFixed(1)} KB</p>
              {preview > 0 && (
                <p className="text-green-400 text-sm mt-1">{preview} rows ready to import</p>
              )}
            </>
          ) : (
            <>
              <p className="text-white mb-2">Drop your file here or</p>
              <span className="text-blue-400 hover:text-blue-300 font-medium cursor-pointer">
                browse files
              </span>
              <p className="text-sm text-gray-500 mt-2">Supports CSV and JSON files (max 5 MB)</p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.json"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>

        {/* Format hint */}
        <div className="mt-3 p-3 bg-[#161B22] rounded border border-gray-700">
          <p className="text-xs text-gray-400 font-medium mb-1">Required CSV columns:</p>
          <p className="text-xs text-gray-500">companyName, industry, location</p>
          <p className="text-xs text-gray-500 mt-1">Optional: email, phone, contactPerson, website, score, status, revenue, employeeCount</p>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-900/20 border border-red-700 rounded flex items-start space-x-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={handleClose}
            disabled={importing}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={processFile}
            disabled={!file || importing}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {importing && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            <span>{importing ? 'Importing...' : 'Import'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
