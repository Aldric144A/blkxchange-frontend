import { useState } from 'react';
import { X, Upload, Download, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Papa from 'papaparse';
import { getAdminHeaders } from '@/utils/auth';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  type: 'vendors' | 'products' | 'professionals';
  apiEndpoint: string;
  templateUrl: string;
  requiredFields: string[];
}

type ImportStep = 'upload' | 'validate' | 'preview' | 'importing' | 'complete';

interface ImportResult {
  successful: number;
  skipped: number;
  failed: number;
  errors: string[];
}

export function BulkImportModal({
  isOpen,
  onClose,
  onSuccess,
  type,
  apiEndpoint,
  templateUrl,
  requiredFields,
}: BulkImportModalProps) {
  const [step, setStep] = useState<ImportStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setValidationErrors([]);
    }
  };

  const handleUpload = () => {
    if (!file) return;

    setLoading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as any[];
        setParsedData(data);
        
        const errors: string[] = [];
        if (data.length === 0) {
          errors.push('CSV file is empty');
        } else {
          const headers = Object.keys(data[0]);
          const missingFields = requiredFields.filter(field => !headers.includes(field));
          if (missingFields.length > 0) {
            errors.push(`Missing required columns: ${missingFields.join(', ')}`);
          }
        }

        setValidationErrors(errors);
        setLoading(false);
        
        if (errors.length === 0) {
          setStep('preview');
        } else {
          setStep('validate');
        }
      },
      error: (error) => {
        setValidationErrors([`Failed to parse CSV: ${error.message}`]);
        setLoading(false);
        setStep('validate');
      },
    });
  };

  const handleImport = async () => {
    setStep('importing');
    setLoading(true);

    try {
      const headers = getAdminHeaders();
      const response = await fetch(`${import.meta.env.VITE_API_URL}${apiEndpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ data: parsedData }),
      });

      if (!response.ok) {
        throw new Error('Import failed');
      }

      const result = await response.json();
      setImportResult(result);
      setStep('complete');
      onSuccess();
    } catch (error) {
      console.error('Import error:', error);
      setValidationErrors(['Import failed. Please try again.']);
      setStep('validate');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep('upload');
    setFile(null);
    setParsedData([]);
    setValidationErrors([]);
    setImportResult(null);
    setLoading(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  if (!isOpen) return null;

  const getTitle = () => {
    const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
    switch (step) {
      case 'upload':
        return `Bulk Import ${typeLabel}`;
      case 'validate':
        return 'Validation Errors';
      case 'preview':
        return `Preview ${typeLabel} Import`;
      case 'importing':
        return 'Importing...';
      case 'complete':
        return 'Import Complete';
      default:
        return `Bulk Import ${typeLabel}`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-emerald-600 p-6 rounded-t-xl flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">{getTitle()}</h2>
          <button onClick={handleClose} className="text-white hover:text-gray-200 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Upload Step */}
          {step === 'upload' && (
            <div className="space-y-6">
              <div className="text-center">
                <Upload className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Upload CSV File</h3>
                <p className="text-gray-600 mb-4">
                  Select a CSV file containing {type} data to import
                </p>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  Choose CSV File
                </label>
                {file && (
                  <p className="mt-4 text-sm text-gray-600">
                    Selected: <span className="font-medium">{file.name}</span>
                  </p>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Download className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900 mb-1">Need a template?</p>
                    <p className="text-sm text-blue-700 mb-2">
                      Download our CSV template with sample data and required columns
                    </p>
                    <a
                      href={templateUrl}
                      download
                      className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      Download {type} template
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleClose} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!file || loading}
                  className="flex-1 bg-brand-gold hover:bg-brand-gold/90 text-black font-semibold"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Upload & Validate'
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Validation Errors Step */}
          {step === 'validate' && (
            <div className="space-y-6">
              <div className="text-center">
                <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Validation Errors</h3>
                <p className="text-gray-600">
                  Please fix the following errors and try again
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <ul className="space-y-2">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="flex items-start gap-2 text-red-700">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{error}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleReset} className="flex-1 bg-brand-gold hover:bg-brand-gold/90 text-black font-semibold">
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {/* Preview Step */}
          {step === 'preview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Preview Import Data</h3>
                <p className="text-gray-600">
                  Review the first 10 rows before importing {parsedData.length} total records
                </p>
              </div>

              <div className="border rounded-lg overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(parsedData[0] || {}).map((header) => (
                        <th key={header} className="px-4 py-2 text-left font-semibold text-gray-700 border-b">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parsedData.slice(0, 10).map((row, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        {Object.values(row).map((value: any, cellIndex) => (
                          <td key={cellIndex} className="px-4 py-2 text-gray-700">
                            {value || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {parsedData.length > 10 && (
                <p className="text-sm text-gray-600 text-center">
                  ... and {parsedData.length - 10} more rows
                </p>
              )}

              <div className="flex gap-3">
                <Button onClick={handleReset} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={handleImport}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold"
                >
                  Confirm Import ({parsedData.length} records)
                </Button>
              </div>
            </div>
          )}

          {/* Importing Step */}
          {step === 'importing' && (
            <div className="text-center py-12">
              <Loader2 className="w-16 h-16 text-emerald-600 mx-auto mb-4 animate-spin" />
              <h3 className="text-xl font-semibold mb-2">Importing Data...</h3>
              <p className="text-gray-600">Please wait while we process your import</p>
            </div>
          )}

          {/* Complete Step */}
          {step === 'complete' && importResult && (
            <div className="space-y-6">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Import Completed Successfully!</h3>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-green-600">{importResult.successful}</p>
                  <p className="text-sm text-green-700 mt-1">Successful</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-yellow-600">{importResult.skipped}</p>
                  <p className="text-sm text-yellow-700 mt-1">Skipped (Duplicates)</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-red-600">{importResult.failed}</p>
                  <p className="text-sm text-red-700 mt-1">Failed</p>
                </div>
              </div>

              {importResult.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="font-semibold text-red-900 mb-2">Errors:</p>
                  <ul className="space-y-1">
                    {importResult.errors.slice(0, 5).map((error, index) => (
                      <li key={index} className="text-sm text-red-700">• {error}</li>
                    ))}
                    {importResult.errors.length > 5 && (
                      <li className="text-sm text-red-700">... and {importResult.errors.length - 5} more</li>
                    )}
                  </ul>
                </div>
              )}

              <Button onClick={handleClose} className="w-full bg-brand-gold hover:bg-brand-gold/90 text-black font-semibold">
                Close
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
