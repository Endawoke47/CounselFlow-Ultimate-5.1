/**
 * CounselFlow Ultimate 5.1 - Entity Import/Export Component
 * Bulk import and export functionality for entity data
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { FileUpload } from '../ui/FileUpload';
import { 
  Download, 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  X,
  Eye,
  Save
} from '../icons';
import { Entity, BulkImportEntity } from '../../types/entity';

interface ImportPreviewRow {
  row: number;
  data: BulkImportEntity;
  errors: string[];
  warnings: string[];
  status: 'valid' | 'warning' | 'error';
}

interface EntityImportExportProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'import' | 'export';
  entities?: Entity[];
  onImportComplete?: (entities: Entity[]) => void;
}

export const EntityImportExport: React.FC<EntityImportExportProps> = ({
  isOpen,
  onClose,
  mode,
  entities = [],
  onImportComplete
}) => {
  const [step, setStep] = useState<'upload' | 'preview' | 'complete'>('upload');
  const [importData, setImportData] = useState<ImportPreviewRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResults, setImportResults] = useState<{
    successful: number;
    failed: number;
    warnings: number;
  }>({ successful: 0, failed: 0, warnings: 0 });

  const validateEntityData = (data: any[], startRow: number = 2): ImportPreviewRow[] => {
    return data.map((row, index) => {
      const errors: string[] = [];
      const warnings: string[] = [];
      
      // Required field validation
      if (!row.name?.trim()) errors.push('Name is required');
      if (!row.legalName?.trim()) errors.push('Legal name is required');
      if (!row.registrationNumber?.trim()) errors.push('Registration number is required');
      if (!row.industry?.trim()) errors.push('Industry is required');
      if (!row.jurisdiction?.trim()) errors.push('Jurisdiction is required');
      if (!row.currency?.trim()) errors.push('Currency is required');
      
      // Date validation
      if (row.incorporationDate) {
        const date = new Date(row.incorporationDate);
        if (isNaN(date.getTime())) {
          errors.push('Invalid incorporation date format');
        } else if (date > new Date()) {
          warnings.push('Incorporation date is in the future');
        }
      } else {
        errors.push('Incorporation date is required');
      }
      
      // Numeric validation
      if (row.authorizedCapital !== undefined && (isNaN(row.authorizedCapital) || row.authorizedCapital < 0)) {
        errors.push('Authorized capital must be a positive number');
      }
      
      if (row.issuedCapital !== undefined && (isNaN(row.issuedCapital) || row.issuedCapital < 0)) {
        errors.push('Issued capital must be a positive number');
      }
      
      if (row.authorizedCapital && row.issuedCapital && row.issuedCapital > row.authorizedCapital) {
        warnings.push('Issued capital exceeds authorized capital');
      }
      
      // Business logic warnings
      if (row.name === row.legalName) {
        warnings.push('Name and legal name are identical');
      }
      
      const status = errors.length > 0 ? 'error' : warnings.length > 0 ? 'warning' : 'valid';
      
      return {
        row: startRow + index,
        data: row,
        errors,
        warnings,
        status
      };
    });
  };

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    
    try {
      // Parse CSV/Excel file (mock implementation)
      const text = await file.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      const expectedHeaders = [
        'name', 'legalName', 'registrationNumber', 'industry', 
        'jurisdiction', 'incorporationDate', 'authorizedCapital', 
        'issuedCapital', 'currency'
      ];
      
      // Validate headers
      const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
      if (missingHeaders.length > 0) {
        throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
      }
      
      const data = lines.slice(1).filter(line => line.trim()).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const row: any = {};
        headers.forEach((header, index) => {
          let value = values[index] || '';
          
          // Type conversion
          if (['authorizedCapital', 'issuedCapital'].includes(header)) {
            value = value ? parseFloat(value) : undefined;
          }
          
          row[header] = value;
        });
        return row;
      });
      
      const validatedData = validateEntityData(data);
      setImportData(validatedData);
      setStep('preview');
    } catch (error) {
      console.error('Import error:', error);
      // Handle error state
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    setIsProcessing(true);
    
    // Filter out rows with errors
    const validRows = importData.filter(row => row.status !== 'error');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const results = {
        successful: validRows.filter(row => row.status === 'valid').length,
        failed: importData.filter(row => row.status === 'error').length,
        warnings: validRows.filter(row => row.status === 'warning').length
      };
      
      setImportResults(results);
      setStep('complete');
      
      // Convert validated data to Entity objects and callback
      if (onImportComplete) {
        const newEntities: Entity[] = validRows.map(row => ({
          id: `imported-${Date.now()}-${Math.random()}`,
          ...row.data,
          incorporationDate: new Date(row.data.incorporationDate),
          parentEntity: undefined,
          subsidiaries: [],
          ownership: 100,
          operatingAddress: undefined,
          shareholders: [],
          directors: [],
          nextBoardMeeting: undefined,
          lastBoardMeeting: undefined,
          meetingFrequency: 'quarterly' as const,
          constitutionalDocuments: [],
          status: 'active' as const,
          complianceStatus: 'compliant' as const,
          lastFilingDate: undefined,
          nextFilingDue: undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'import',
          updatedBy: 'import',
          registeredAddress: {
            street: '',
            city: '',
            country: '',
            postalCode: ''
          },
          financialYearEnd: '12-31'
        }));
        
        onImportComplete(newEntities);
      }
    } catch (error) {
      console.error('Import processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    const headers = [
      'name', 'legalName', 'registrationNumber', 'industry', 
      'jurisdiction', 'incorporationDate', 'authorizedCapital', 
      'issuedCapital', 'currency'
    ];
    
    const sampleData = [
      'TechCorp Holdings,TechCorp Holdings Limited,TC001234,Technology,Delaware USA,2020-01-15,10000000,5000000,USD',
      'SoftwareCorp Inc,SoftwareCorp Incorporated,SC002345,Software Development,California USA,2021-06-01,1000000,500000,USD'
    ];
    
    const csvContent = [headers.join(','), ...sampleData].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'entity_import_template.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const exportEntities = () => {
    if (entities.length === 0) return;
    
    const headers = [
      'name', 'legalName', 'registrationNumber', 'industry', 
      'jurisdiction', 'incorporationDate', 'authorizedCapital', 
      'issuedCapital', 'currency', 'status', 'complianceStatus'
    ];
    
    const csvRows = entities.map(entity => [
      entity.name,
      entity.legalName,
      entity.registrationNumber,
      entity.industry,
      entity.jurisdiction,
      entity.incorporationDate.toISOString().split('T')[0],
      entity.authorizedCapital,
      entity.issuedCapital,
      entity.currency,
      entity.status,
      entity.complianceStatus
    ].join(','));
    
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `entities_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
            <h2 className="text-xl font-bold text-gray-900">
              {mode === 'import' ? 'Import Entities' : 'Export Entities'}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="p-6">
            {mode === 'export' ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Download className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Export {entities.length} Entities</h3>
                <p className="text-gray-600">
                  Export all entity data to CSV format for backup or analysis.
                </p>
                <Button
                  variant="primary"
                  icon={Download}
                  onClick={exportEntities}
                >
                  Download CSV Export
                </Button>
              </div>
            ) : (
              <>
                {step === 'upload' && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Entity Data</h3>
                      <p className="text-gray-600">
                        Upload a CSV file with entity information. Download our template to get started.
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <Button
                        variant="outline"
                        icon={FileText}
                        onClick={downloadTemplate}
                      >
                        Download Template
                      </Button>
                    </div>

                    <FileUpload
                      accept=".csv,.xlsx,.xls"
                      maxSize={10 * 1024 * 1024} // 10MB
                      onFileSelect={handleFileUpload}
                      loading={isProcessing}
                    />
                  </div>
                )}

                {step === 'preview' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Import Preview</h3>
                      <div className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">
                            Valid ({importData.filter(r => r.status === 'valid').length})
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">
                            Warnings ({importData.filter(r => r.status === 'warning').length})
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">
                            Errors ({importData.filter(r => r.status === 'error').length})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Row
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Entity Name
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Issues
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {importData.map((row, index) => (
                            <tr key={index} className={
                              row.status === 'error' ? 'bg-red-50' :
                              row.status === 'warning' ? 'bg-yellow-50' : ''
                            }>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                {row.row}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{row.data.name}</div>
                                <div className="text-sm text-gray-500">{row.data.legalName}</div>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <Badge
                                  variant={
                                    row.status === 'valid' ? 'success' :
                                    row.status === 'warning' ? 'warning' : 'destructive'
                                  }
                                >
                                  {row.status}
                                </Badge>
                              </td>
                              <td className="px-4 py-4">
                                {row.errors.length > 0 && (
                                  <div className="space-y-1">
                                    {row.errors.map((error, idx) => (
                                      <div key={idx} className="text-sm text-red-600 flex items-center">
                                        <AlertTriangle className="w-3 h-3 mr-1" />
                                        {error}
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {row.warnings.length > 0 && (
                                  <div className="space-y-1">
                                    {row.warnings.map((warning, idx) => (
                                      <div key={idx} className="text-sm text-yellow-600 flex items-center">
                                        <AlertTriangle className="w-3 h-3 mr-1" />
                                        {warning}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={() => setStep('upload')}
                      >
                        Back
                      </Button>
                      <Button
                        variant="primary"
                        icon={Save}
                        onClick={handleImport}
                        disabled={importData.filter(r => r.status !== 'error').length === 0}
                        loading={isProcessing}
                      >
                        Import {importData.filter(r => r.status !== 'error').length} Entities
                      </Button>
                    </div>
                  </div>
                )}

                {step === 'complete' && (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Import Complete</h3>
                    <div className="space-y-2">
                      <p className="text-green-600">✅ {importResults.successful} entities imported successfully</p>
                      {importResults.warnings > 0 && (
                        <p className="text-yellow-600">⚠️ {importResults.warnings} entities imported with warnings</p>
                      )}
                      {importResults.failed > 0 && (
                        <p className="text-red-600">❌ {importResults.failed} entities failed to import</p>
                      )}
                    </div>
                    <Button variant="primary" onClick={onClose}>
                      Done
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};