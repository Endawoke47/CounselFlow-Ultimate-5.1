import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { 
  Upload, 
  FileText, 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Eye,
  Download,
  RefreshCw,
  Clock,
  Zap,
  BarChart3,
  ChevronDown,
  ChevronUp
} from '../icons';
import { ContractImportJob, Contract } from '../../types/contracts';

interface ContractImportWizardProps {
  onClose: () => void;
  onImportComplete: (importedContracts: Contract[]) => void;
  className?: string;
}

interface ImportFile {
  id: string;
  file: File;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  extractedData?: {
    title?: string;
    counterparty?: string;
    type?: string;
    value?: number;
    extractionMethod: 'ocr' | 'text_extraction' | 'structured_data';
    confidence: number;
  };
  aiSummary?: {
    summary: string;
    keyPoints: string[];
    riskFactors: string[];
    confidence: number;
  };
  error?: string;
  previewContent?: string;
}

const ContractImportWizard: React.FC<ContractImportWizardProps> = ({
  onClose,
  onImportComplete,
  className = ''
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [importFiles, setImportFiles] = useState<ImportFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importJob, setImportJob] = useState<ContractImportJob | null>(null);
  const [expandedFiles, setExpandedFiles] = useState<Record<string, boolean>>({});

  const steps = [
    {
      id: 'upload',
      title: 'Upload Documents',
      description: 'Select contract files to import and analyze'
    },
    {
      id: 'configure',
      title: 'Import Settings',
      description: 'Configure extraction and analysis options'
    },
    {
      id: 'process',
      title: 'AI Processing',
      description: 'Extract data and generate summaries'
    },
    {
      id: 'review',
      title: 'Review & Validate',
      description: 'Review extracted data and AI analysis'
    },
    {
      id: 'complete',
      title: 'Import Complete',
      description: 'Contracts successfully imported'
    }
  ];

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: ImportFile[] = acceptedFiles.map((file, index) => ({
      id: `file_${Date.now()}_${index}`,
      file,
      status: 'pending',
      progress: 0
    }));
    setImportFiles(prev => [...prev, ...newFiles]);
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    onDrop(files);
  };

  const removeFile = (fileId: string) => {
    setImportFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const startProcessing = async () => {
    setIsProcessing(true);
    setCurrentStep(2);

    // Create import job
    const job: ContractImportJob = {
      id: `import_${Date.now()}`,
      source: {
        type: 'file_upload',
        files: importFiles.map(f => ({
          id: f.id,
          name: f.file.name,
          type: f.file.type,
          size: f.file.size,
          uploaded_at: new Date()
        }))
      },
      processing: {
        extractionMethod: 'hybrid',
        aiSummarization: true,
        autoClassification: true,
        duplicateDetection: true,
        dataValidation: true,
        batchSize: 5
      },
      status: 'processing',
      progress: {
        totalItems: importFiles.length,
        processedItems: 0,
        successfulItems: 0,
        failedItems: 0
      },
      results: {
        importedContracts: [],
        failedImports: [],
        summary: {
          totalProcessed: 0,
          successRate: 0,
          averageProcessingTime: 0,
          dataQualityScore: 0
        },
        duplicatesFound: []
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'current_user',
      processingLogs: []
    };

    setImportJob(job);

    // Simulate processing each file
    for (let i = 0; i < importFiles.length; i++) {
      const file = importFiles[i];
      
      // Update file status to processing
      setImportFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, status: 'processing' } : f
      ));

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

      // Simulate extraction and AI analysis
      const mockExtraction = generateMockExtraction(file.file);
      const mockSummary = generateMockSummary(file.file);

      // Update file with results
      setImportFiles(prev => prev.map(f => 
        f.id === file.id ? {
          ...f,
          status: 'completed',
          progress: 100,
          extractedData: mockExtraction,
          aiSummary: mockSummary,
          previewContent: generateMockContent(file.file)
        } : f
      ));

      // Update job progress
      setImportJob(prev => prev ? {
        ...prev,
        progress: {
          ...prev.progress,
          processedItems: i + 1,
          successfulItems: i + 1
        }
      } : null);
    }

    setIsProcessing(false);
    setCurrentStep(3);
  };

  const generateMockExtraction = (file: File) => {
    const mockTitles = [
      'Software License Agreement',
      'Professional Services Contract',
      'Non-Disclosure Agreement',
      'Master Service Agreement',
      'Partnership Agreement',
      'Employment Contract',
      'Vendor Agreement'
    ];

    const mockCounterparties = [
      'TechCorp Industries',
      'Global Services LLC',
      'Innovation Partners',
      'Enterprise Solutions Inc',
      'Consulting Group Ltd',
      'Digital Dynamics Corp'
    ];

    const mockTypes = ['licensing', 'service_agreement', 'nda', 'employment', 'partnership'];

    return {
      title: mockTitles[Math.floor(Math.random() * mockTitles.length)],
      counterparty: mockCounterparties[Math.floor(Math.random() * mockCounterparties.length)],
      type: mockTypes[Math.floor(Math.random() * mockTypes.length)],
      value: Math.floor(Math.random() * 500000) + 50000,
      extractionMethod: 'hybrid' as const,
      confidence: Math.floor(Math.random() * 20) + 80 // 80-100%
    };
  };

  const generateMockSummary = (file: File) => {
    const mockSummaries = [
      'Standard commercial agreement with typical terms and conditions. Includes payment schedules, deliverables, and termination clauses.',
      'Service-based contract focusing on professional consulting services with milestone-based deliverables and performance metrics.',
      'Confidentiality agreement protecting proprietary information with standard disclosure restrictions and penalty clauses.',
      'Comprehensive partnership agreement outlining shared responsibilities, revenue distribution, and governance structure.',
      'Employment contract detailing compensation, benefits, responsibilities, and termination conditions with standard legal protections.'
    ];

    const mockKeyPoints = [
      'Payment terms: Net 30 days',
      'Contract duration: 12 months',
      'Auto-renewal clause included',
      'Liability cap: $500,000',
      'Governing law: California',
      'Dispute resolution: Arbitration'
    ];

    const mockRiskFactors = [
      'Payment terms longer than company standard',
      'Limited liability protection',
      'Broad indemnification clause',
      'Intellectual property ownership unclear',
      'Termination notice period too short'
    ];

    return {
      summary: mockSummaries[Math.floor(Math.random() * mockSummaries.length)],
      keyPoints: mockKeyPoints.slice(0, Math.floor(Math.random() * 3) + 3),
      riskFactors: mockRiskFactors.slice(0, Math.floor(Math.random() * 3) + 1),
      confidence: Math.floor(Math.random() * 15) + 85 // 85-100%
    };
  };

  const generateMockContent = (file: File) => {
    return `
CONTRACT AGREEMENT

This Agreement is entered into on [DATE] between [COMPANY] ("Company") and ${file.name.replace(/\.[^/.]+$/, "").replace(/_/g, ' ')} ("Counterparty").

WHEREAS, the parties desire to establish the terms and conditions for [PURPOSE];

NOW, THEREFORE, in consideration of the mutual covenants contained herein, the parties agree as follows:

1. SCOPE OF SERVICES
The Counterparty shall provide services as detailed in Exhibit A attached hereto and incorporated by reference.

2. PAYMENT TERMS
Company shall pay Counterparty the fees specified in Exhibit B according to the payment schedule outlined therein.

3. TERM AND TERMINATION
This Agreement shall commence on [START DATE] and continue until [END DATE], unless terminated earlier in accordance with the provisions herein.

4. CONFIDENTIALITY
Both parties acknowledge that they may have access to confidential information and agree to maintain such information in strict confidence.

5. GENERAL PROVISIONS
This Agreement constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, or agreements relating to the subject matter herein.

[Additional contract content would continue here...]
    `;
  };

  const toggleFileExpansion = (fileId: string) => {
    setExpandedFiles(prev => ({
      ...prev,
      [fileId]: !prev[fileId]
    }));
  };

  const handleComplete = () => {
    // Convert import files to contracts
    const importedContracts: Contract[] = importFiles
      .filter(f => f.status === 'completed' && f.extractedData)
      .map(f => ({
        // Create basic contract structure from extracted data
        id: `contract_${f.id}`,
        title: f.extractedData!.title!,
        type: f.extractedData!.type as any,
        status: 'human_review' as any,
        priority: 'medium' as any,
        workflowStage: 'repository' as any,
        counterparty: {
          name: f.extractedData!.counterparty!,
          type: 'company' as const
        },
        internalEntity: 'entity-1',
        signatories: [],
        financialTerms: {
          totalValue: f.extractedData!.value,
          currency: 'USD'
        },
        timeline: {
          createdDate: new Date()
        },
        legalFramework: {
          governingLaw: 'California',
          jurisdiction: 'California, USA',
          disputeResolution: 'arbitration',
          confidentialityLevel: 'confidential'
        },
        management: {
          assignedTo: 'current_user',
          reviewers: [],
          businessOwner: 'current_user',
          department: 'Legal'
        },
        content: {
          description: f.aiSummary?.summary || 'Imported contract',
          keyTerms: f.aiSummary?.keyPoints?.map(point => ({
            term: point.split(':')[0] || point,
            description: point.split(':')[1]?.trim() || '',
            category: 'commercial' as const
          })) || [],
          riskLevel: f.aiSummary?.riskFactors && f.aiSummary.riskFactors.length > 2 ? 'high' : 
                    f.aiSummary?.riskFactors && f.aiSummary.riskFactors.length > 0 ? 'medium' : 'low',
          riskFactors: f.aiSummary?.riskFactors || []
        },
        importData: {
          importDate: new Date(),
          originalFormat: f.file.type,
          extractionMethod: f.extractedData!.extractionMethod,
          aiSummary: {
            summary: f.aiSummary!.summary,
            keyPoints: f.aiSummary!.keyPoints,
            confidence: f.aiSummary!.confidence,
            extractedAt: new Date()
          },
          validationStatus: 'needs_review'
        },
        documents: [{
          id: `doc_${f.id}`,
          name: f.file.name,
          type: 'main_contract',
          format: f.file.type.includes('pdf') ? 'pdf' : 'docx',
          url: URL.createObjectURL(f.file),
          version: '1.0',
          size: f.file.size,
          checksum: 'imported',
          isLatest: true,
          uploadedAt: new Date(),
          uploadedBy: 'current_user'
        }],
        progressTracking: {
          milestones: [],
          workflowSteps: [],
          approvalWorkflow: []
        },
        linkedRecords: {},
        system: {
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'current_user',
          updatedBy: 'current_user',
          version: 1,
          changeLog: [],
          tags: ['imported'],
          access: {
            visibility: 'restricted'
          }
        }
      } as Contract));

    onImportComplete(importedContracts);
    onClose();
  };

  const getFileIcon = (file: File) => {
    if (file.type.includes('pdf')) return '📄';
    if (file.type.includes('word')) return '📝';
    if (file.type.includes('text')) return '📃';
    return '📄';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Contract Import & Analysis</h2>
                <p className="text-purple-100 text-sm">AI-powered historical contract processing</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  index <= currentStep 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {index < currentStep ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    index < currentStep ? 'bg-purple-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-2">
            <h3 className="font-semibold text-gray-900">{steps[currentStep].title}</h3>
            <p className="text-sm text-gray-600">{steps[currentStep].description}</p>
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step 0: Upload */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Contract Files</h3>
                    <p className="text-gray-600 mb-4">
                      Drop files here or click to browse. Supported formats: PDF, DOCX, TXT
                    </p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.docx,.doc,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <Button variant="primary" as="span">
                        Choose Files
                      </Button>
                    </label>
                    <p className="text-sm text-gray-500 mt-2">Maximum file size: 10MB per file</p>
                  </div>

                  {/* File List */}
                  {importFiles.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Selected Files ({importFiles.length})</h4>
                      {importFiles.map((file) => (
                        <Card key={file.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{getFileIcon(file.file)}</span>
                              <div>
                                <p className="font-medium text-gray-900">{file.file.name}</p>
                                <p className="text-sm text-gray-500">
                                  {formatFileSize(file.file.size)} • {file.file.type}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(file.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 1: Configure */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Import Configuration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Extraction Method
                        </label>
                        <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                          <option value="hybrid">Hybrid (OCR + Text)</option>
                          <option value="ocr">OCR Only</option>
                          <option value="text_extraction">Text Extraction Only</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Batch Size
                        </label>
                        <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                          <option value="5">5 files</option>
                          <option value="10">10 files</option>
                          <option value="20">20 files</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-6 space-y-4">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="ai-summary" defaultChecked className="rounded" />
                        <label htmlFor="ai-summary" className="text-sm text-gray-700">
                          Generate AI summaries and key point extraction
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="auto-classify" defaultChecked className="rounded" />
                        <label htmlFor="auto-classify" className="text-sm text-gray-700">
                          Automatically classify contract types
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="duplicate-check" defaultChecked className="rounded" />
                        <label htmlFor="duplicate-check" className="text-sm text-gray-700">
                          Check for duplicate contracts
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="data-validation" defaultChecked className="rounded" />
                        <label htmlFor="data-validation" className="text-sm text-gray-700">
                          Validate extracted data against business rules
                        </label>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Step 2: Processing */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <Card className="p-8 text-center">
                    <div className="flex items-center justify-center mb-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Processing Contracts</h3>
                    <p className="text-gray-600 mb-6">
                      Our AI is extracting data, analyzing content, and generating summaries...
                    </p>
                    <div className="max-w-md mx-auto">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">Overall Progress</span>
                        <span className="text-sm font-medium text-gray-900">
                          {importJob?.progress.processedItems || 0} of {importJob?.progress.totalItems || 0}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${importJob ? (importJob.progress.processedItems / importJob.progress.totalItems) * 100 : 0}%` 
                          }}
                        />
                      </div>
                    </div>
                  </Card>

                  {/* File Processing Status */}
                  <div className="space-y-3">
                    {importFiles.map((file) => (
                      <Card key={file.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">{getFileIcon(file.file)}</span>
                            <div>
                              <p className="font-medium text-gray-900">{file.file.name}</p>
                              <p className="text-sm text-gray-500">
                                {file.status === 'pending' && 'Queued for processing'}
                                {file.status === 'processing' && 'Extracting data and analyzing...'}
                                {file.status === 'completed' && 'Processing completed'}
                                {file.status === 'failed' && 'Processing failed'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {file.status === 'processing' && (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                            )}
                            {file.status === 'completed' && (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            )}
                            {file.status === 'failed' && (
                              <AlertTriangle className="w-5 h-5 text-red-500" />
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Review Extracted Data</h3>
                    <Badge variant="success">
                      {importFiles.filter(f => f.status === 'completed').length} of {importFiles.length} processed
                    </Badge>
                  </div>

                  {importFiles.map((file) => (
                    <Card key={file.id} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-3">
                          <span className="text-2xl">{getFileIcon(file.file)}</span>
                          <div>
                            <h4 className="font-semibold text-gray-900">{file.file.name}</h4>
                            <p className="text-sm text-gray-500">{formatFileSize(file.file.size)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFileExpansion(file.id)}
                          >
                            {expandedFiles[file.id] ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {file.status === 'completed' && file.extractedData && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contract Title</label>
                            <Input value={file.extractedData.title} readOnly />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Counterparty</label>
                            <Input value={file.extractedData.counterparty} readOnly />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contract Type</label>
                            <Input value={file.extractedData.type} readOnly />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                            <Input value={file.extractedData.value ? `$${file.extractedData.value.toLocaleString()}` : 'N/A'} readOnly />
                          </div>
                        </div>
                      )}

                      {file.aiSummary && (
                        <div className="space-y-4">
                          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                              <Brain className="w-4 h-4 text-purple-600 mr-2" />
                              <span className="font-semibold text-purple-700">AI Analysis</span>
                              <Badge variant="secondary" size="sm" className="ml-2">
                                {file.aiSummary.confidence}% confidence
                              </Badge>
                            </div>
                            <p className="text-sm text-purple-600 mb-3">{file.aiSummary.summary}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="font-medium text-purple-700 mb-2">Key Points</h5>
                                <ul className="text-xs text-purple-600 space-y-1">
                                  {file.aiSummary.keyPoints.map((point, index) => (
                                    <li key={index}>• {point}</li>
                                  ))}
                                </ul>
                              </div>
                              {file.aiSummary.riskFactors.length > 0 && (
                                <div>
                                  <h5 className="font-medium text-red-700 mb-2">Risk Factors</h5>
                                  <ul className="text-xs text-red-600 space-y-1">
                                    {file.aiSummary.riskFactors.map((risk, index) => (
                                      <li key={index}>• {risk}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>

                          {expandedFiles[file.id] && file.previewContent && (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                              <h5 className="font-medium text-gray-700 mb-2">Document Preview</h5>
                              <div className="max-h-48 overflow-y-auto">
                                <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                                  {file.previewContent}
                                </pre>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}

              {/* Step 4: Complete */}
              {currentStep === 4 && (
                <div className="text-center space-y-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Import Completed Successfully!</h3>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    {importFiles.filter(f => f.status === 'completed').length} contracts have been successfully 
                    imported and analyzed. You can now review and manage them in your contract repository.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-md mx-auto">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {importFiles.filter(f => f.status === 'completed').length}
                      </p>
                      <p className="text-sm text-gray-600">Imported</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        {Math.round(importFiles.reduce((avg, f) => avg + (f.aiSummary?.confidence || 0), 0) / importFiles.length)}%
                      </p>
                      <p className="text-sm text-gray-600">Avg Confidence</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">0</p>
                      <p className="text-sm text-gray-600">Duplicates</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => currentStep > 0 ? setCurrentStep(currentStep - 1) : onClose()}
              disabled={isProcessing}
            >
              {currentStep === 0 ? 'Cancel' : 'Previous'}
            </Button>
            
            <div className="flex space-x-3">
              {currentStep === 0 && (
                <Button
                  variant="primary"
                  onClick={() => setCurrentStep(1)}
                  disabled={importFiles.length === 0}
                >
                  Configure Import
                </Button>
              )}
              {currentStep === 1 && (
                <Button
                  variant="primary"
                  onClick={startProcessing}
                  icon={Zap}
                >
                  Start Processing
                </Button>
              )}
              {currentStep === 3 && (
                <Button
                  variant="primary"
                  onClick={() => setCurrentStep(4)}
                  icon={CheckCircle}
                >
                  Accept & Import
                </Button>
              )}
              {currentStep === 4 && (
                <Button
                  variant="primary"
                  onClick={handleComplete}
                >
                  Go to Contracts
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContractImportWizard;