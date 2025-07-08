import React, { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, File, FileText, FilePdf, X, Check, AlertCircle, Download } from '../icons'
import { Button } from './Button'
import { ErrorDisplay } from './ErrorDisplay'
import { documentAnalysisService, type AnalysisType, type AnalysisResult } from '../../services/documentAnalysis'
import toast from 'react-hot-toast'

interface FileUploadProps {
  accept?: string
  multiple?: boolean
  maxSize?: number // in MB
  maxFiles?: number
  onFilesSelected?: (files: File[]) => void
  onUploadComplete?: (results: UploadResult[]) => void
  onAnalysisComplete?: (analyses: FileAnalysis[]) => void
  disabled?: boolean
  className?: string
  showPreview?: boolean
  allowAnalysis?: boolean
  analysisTypes?: AnalysisType[]
}

interface UploadResult {
  file: File
  id: string
  url: string
  status: 'uploading' | 'completed' | 'error'
  progress: number
  error?: string
}

// Use types from the service
type FileAnalysis = AnalysisResult

const ANALYSIS_TYPES: { [key in AnalysisType]: { label: string; description: string } } = {
  'summary': {
    label: 'Document Summary',
    description: 'Generate executive summary of key points'
  },
  'risk-assessment': {
    label: 'Risk Assessment',
    description: 'Identify potential legal risks and liability issues'
  },
  'key-terms': {
    label: 'Key Terms Extraction',
    description: 'Extract important terms, dates, and obligations'
  },
  'compliance-check': {
    label: 'Compliance Review',
    description: 'Check against regulatory requirements'
  },
  'contract-review': {
    label: 'Contract Analysis',
    description: 'Comprehensive contract terms analysis'
  },
  'legal-research': {
    label: 'Legal Research',
    description: 'Research relevant laws and precedents'
  },
  'redaction': {
    label: 'Document Redaction',
    description: 'Automatically redact sensitive information'
  }
}

export function FileUpload({
  accept = '.pdf,.doc,.docx,.txt',
  multiple = true,
  maxSize = 10, // 10MB default
  maxFiles = 10,
  onFilesSelected,
  onUploadComplete,
  onAnalysisComplete,
  disabled = false,
  className = '',
  showPreview = true,
  allowAnalysis = true,
  analysisTypes = ['summary', 'risk-assessment', 'key-terms']
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([])
  const [analyses, setAnalyses] = useState<FileAnalysis[]>([])
  const [selectedAnalysisTypes, setSelectedAnalysisTypes] = useState<Set<AnalysisType>>(
    new Set(analysisTypes)
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getFileIcon = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'pdf':
        return FilePdf
      case 'doc':
      case 'docx':
        return FileText
      case 'txt':
        return File
      default:
        return File
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size exceeds ${maxSize}MB limit`
    }

    // Check file type
    if (accept) {
      const acceptedTypes = accept.split(',').map(type => type.trim())
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
      if (!acceptedTypes.includes(fileExtension)) {
        return `File type ${fileExtension} not supported`
      }
    }

    return null
  }

  const validateFiles = (files: File[]): { valid: File[]; errors: string[] } => {
    const errors: string[] = []
    const valid: File[] = []

    if (files.length > maxFiles) {
      errors.push(`Too many files selected. Maximum ${maxFiles} files allowed.`)
      return { valid: [], errors }
    }

    files.forEach(file => {
      const error = validateFile(file)
      if (error) {
        errors.push(`${file.name}: ${error}`)
      } else {
        valid.push(file)
      }
    })

    return { valid, errors }
  }

  const handleFileSelection = useCallback((files: File[]) => {
    const { valid, errors } = validateFiles(files)

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error, { duration: 5000 }))
    }

    if (valid.length > 0) {
      onFilesSelected?.(valid)
      startUpload(valid)
    }
  }, [onFilesSelected, maxFiles, maxSize, accept])

  const startUpload = async (files: File[]) => {
    const newResults: UploadResult[] = files.map(file => ({
      file,
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      url: '',
      status: 'uploading' as const,
      progress: 0
    }))

    setUploadResults(prev => [...prev, ...newResults])

    // Simulate upload progress
    for (const result of newResults) {
      try {
        // Simulate upload with progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100))
          setUploadResults(prev => 
            prev.map(r => 
              r.id === result.id 
                ? { ...r, progress }
                : r
            )
          )
        }

        // Complete upload
        const uploadUrl = URL.createObjectURL(result.file)
        setUploadResults(prev => 
          prev.map(r => 
            r.id === result.id 
              ? { ...r, status: 'completed', url: uploadUrl, progress: 100 }
              : r
          )
        )

        toast.success(`${result.file.name} uploaded successfully`)

        // Start analysis if enabled
        if (allowAnalysis && selectedAnalysisTypes.size > 0) {
          startAnalysis(result)
        }

      } catch (error) {
        setUploadResults(prev => 
          prev.map(r => 
            r.id === result.id 
              ? { ...r, status: 'error', error: 'Upload failed' }
              : r
          )
        )
        toast.error(`Failed to upload ${result.file.name}`)
      }
    }

    const completedResults = newResults.map(result => ({
      ...result,
      status: 'completed' as const,
      progress: 100
    }))
    onUploadComplete?.(completedResults)
  }

  const startAnalysis = async (uploadResult: UploadResult) => {
    // Process each selected analysis type
    for (const analysisType of selectedAnalysisTypes) {
      try {
        // Start analysis using the service
        const analysisResult = await documentAnalysisService.uploadAndAnalyze({
          fileId: uploadResult.id,
          fileName: uploadResult.file.name,
          fileType: uploadResult.file.type,
          analysisType,
          file: uploadResult.file
        })

        // Add to state
        setAnalyses(prev => [...prev, analysisResult])

        // Set up polling for status updates
        const pollAnalysis = async () => {
          const updated = await documentAnalysisService.getAnalysis(analysisResult.id)
          if (updated) {
            setAnalyses(prev => 
              prev.map(a => a.id === updated.id ? updated : a)
            )

            if (updated.status === 'completed') {
              toast.success(`${ANALYSIS_TYPES[analysisType].label} completed`)
            } else if (updated.status === 'error') {
              toast.error(`${ANALYSIS_TYPES[analysisType].label} failed`)
            } else if (updated.status === 'processing') {
              // Continue polling
              setTimeout(pollAnalysis, 2000)
            }
          }
        }

        // Start polling
        setTimeout(pollAnalysis, 1000)

      } catch (error) {
        toast.error(`Failed to start ${ANALYSIS_TYPES[analysisType].label}`)
        console.error('Analysis error:', error)
      }
    }

    // Get all analyses for this file
    const fileAnalyses = await documentAnalysisService.getAnalysesByFile(uploadResult.id)
    onAnalysisComplete?.(fileAnalyses)
  }

  // Remove mock functions as we're now using the real service

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setIsDragOver(true)
    }
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    if (disabled) return

    const files = Array.from(e.dataTransfer.files)
    handleFileSelection(files)
  }, [disabled, handleFileSelection])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFileSelection(files)
    
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [handleFileSelection])

  const removeFile = (fileId: string) => {
    setUploadResults(prev => prev.filter(r => r.id !== fileId))
    setAnalyses(prev => prev.filter(a => a.fileId !== fileId))
  }

  const downloadAnalysis = async (analysis: FileAnalysis) => {
    try {
      await documentAnalysisService.downloadAnalysisReport(analysis.id)
      toast.success('Analysis report downloaded')
    } catch (error) {
      toast.error('Failed to download analysis report')
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-200
          ${isDragOver 
            ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          disabled={disabled}
          className="hidden"
        />

        <div className="space-y-4">
          <div className="flex justify-center">
            <Upload 
              size={48} 
              className={`${isDragOver ? 'text-primary-500' : 'text-gray-400'} transition-colors`} 
            />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Upload Documents
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Drag and drop files here, or click to select
            </p>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>Supported formats: {accept}</p>
            <p>Maximum file size: {maxSize}MB</p>
            {multiple && <p>Maximum {maxFiles} files</p>}
          </div>
        </div>
      </div>

      {/* Analysis Type Selection */}
      {allowAnalysis && analysisTypes.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
            AI Analysis Options
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysisTypes.map(type => (
              <label
                key={type}
                className="flex items-start space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedAnalysisTypes.has(type)}
                  onChange={(e) => {
                    const newSet = new Set(selectedAnalysisTypes)
                    if (e.target.checked) {
                      newSet.add(type)
                    } else {
                      newSet.delete(type)
                    }
                    setSelectedAnalysisTypes(newSet)
                  }}
                  className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {ANALYSIS_TYPES[type].label}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {ANALYSIS_TYPES[type].description}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Upload Results */}
      <AnimatePresence>
        {uploadResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
              Uploaded Files
            </h4>
            
            <div className="space-y-3">
              {uploadResults.map(result => {
                const Icon = getFileIcon(result.file)
                const fileAnalyses = analyses.filter(a => a.fileId === result.id)
                
                return (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3"
                  >
                    {/* File Info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon size={24} className="text-gray-500" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {result.file.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatFileSize(result.file.size)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {result.status === 'completed' && (
                          <Check size={20} className="text-green-500" />
                        )}
                        {result.status === 'error' && (
                          <AlertCircle size={20} className="text-red-500" />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(result.id)}
                          icon={X}
                        />
                      </div>
                    </div>

                    {/* Upload Progress */}
                    {result.status === 'uploading' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Uploading...</span>
                          <span>{result.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${result.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Analysis Results */}
                    {fileAnalyses.length > 0 && (
                      <div className="space-y-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <h5 className="font-medium text-gray-900 dark:text-gray-100">
                          AI Analysis Results
                        </h5>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {fileAnalyses.map(analysis => (
                            <div
                              key={`${analysis.fileId}-${analysis.type}`}
                              className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-sm">
                                  {ANALYSIS_TYPES[analysis.type].label}
                                </span>
                                <div className="flex items-center space-x-2">
                                  {analysis.status === 'completed' && analysis.downloadUrl && (
                                    <Button
                                      variant="ghost"
                                      size="xs"
                                      onClick={() => downloadAnalysis(analysis)}
                                      icon={Download}
                                    />
                                  )}
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    analysis.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                    analysis.status === 'processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                    analysis.status === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                  }`}>
                                    {analysis.status}
                                  </span>
                                </div>
                              </div>
                              
                              {analysis.status === 'processing' && (
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                                  <div className="bg-blue-500 h-1 rounded-full animate-pulse w-2/3" />
                                </div>
                              )}
                              
                              {analysis.error && (
                                <ErrorDisplay
                                  type="error"
                                  title="Analysis Failed"
                                  message={analysis.error}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}