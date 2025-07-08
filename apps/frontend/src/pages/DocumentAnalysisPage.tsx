import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FileUpload } from '../components/ui/FileUpload'
import { EnhancedTable } from '../components/ui/EnhancedTable'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { AI, Analytics, Download, Eye, FileText } from '../components/icons'
import { documentAnalysisService, type AnalysisResult } from '../services/documentAnalysis'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

export function DocumentAnalysisPage() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([])
  const [loading, setLoading] = useState(false)

  const handleFilesSelected = (files: File[]) => {
    setUploadedFiles(prev => [...prev, ...files])
  }

  const handleAnalysisComplete = (analyses: AnalysisResult[]) => {
    setAnalysisResults(prev => {
      const newResults = analyses.filter(
        analysis => !prev.some(existing => existing.id === analysis.id)
      )
      return [...prev, ...newResults]
    })
  }

  const handleViewAnalysis = (analysis: AnalysisResult) => {
    if (analysis.result) {
      // In a real app, this would open a detailed view modal/page
      console.log('Analysis result:', analysis.result)
      toast.success('Analysis details logged to console')
    }
  }

  const handleDownloadAnalysis = async (analysis: AnalysisResult) => {
    try {
      await documentAnalysisService.downloadAnalysisReport(analysis.id)
      toast.success('Analysis report downloaded')
    } catch (error) {
      toast.error('Failed to download analysis')
    }
  }

  const analysisColumns = [
    {
      id: 'fileName',
      label: 'Document',
      accessor: (analysis: AnalysisResult) => {
        const file = uploadedFiles.find(f => analysis.fileId.includes(f.name))
        return file?.name || 'Unknown'
      },
      render: (value: string) => (
        <div className="flex items-center space-x-3">
          <FileText size={20} className="text-gray-500" />
          <div>
            <div className="font-medium text-gray-900">{value}</div>
          </div>
        </div>
      )
    },
    {
      id: 'type',
      label: 'Analysis Type',
      accessor: 'type' as keyof AnalysisResult,
      render: (value: string) => (
        <Badge variant="outline" className="capitalize">
          {value.replace('-', ' ')}
        </Badge>
      )
    },
    {
      id: 'status',
      label: 'Status',
      accessor: 'status' as keyof AnalysisResult,
      render: (value: string) => {
        const variants = {
          pending: 'warning',
          processing: 'info',
          completed: 'success',
          error: 'destructive'
        }
        return (
          <Badge variant={variants[value as keyof typeof variants] as any}>
            {value}
          </Badge>
        )
      }
    },
    {
      id: 'createdAt',
      label: 'Created',
      accessor: 'createdAt' as keyof AnalysisResult,
      render: (value: Date) => (
        <span className="text-sm text-gray-500">
          {formatDistanceToNow(value, { addSuffix: true })}
        </span>
      )
    }
  ]

  const analysisActions = [
    {
      label: 'View',
      icon: Eye,
      onClick: handleViewAnalysis,
      show: (analysis: AnalysisResult) => analysis.status === 'completed'
    },
    {
      label: 'Download',
      icon: Download,
      onClick: handleDownloadAnalysis,
      show: (analysis: AnalysisResult) => analysis.status === 'completed' && !!analysis.downloadUrl
    }
  ]

  const stats = [
    {
      title: 'Total Documents',
      value: uploadedFiles.length,
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'Analyses Completed',
      value: analysisResults.filter(a => a.status === 'completed').length,
      icon: Analytics,
      color: 'text-green-600'
    },
    {
      title: 'In Progress',
      value: analysisResults.filter(a => a.status === 'processing').length,
      icon: AI,
      color: 'text-yellow-600'
    },
    {
      title: 'Total Analyses',
      value: analysisResults.length,
      icon: Analytics,
      color: 'text-purple-600'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            AI Document Analysis
          </h1>
          <p className="text-gray-600 mt-2">
            Upload legal documents for comprehensive AI-powered analysis including risk assessment, 
            compliance checking, and key terms extraction.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                    <Icon size={24} className={stat.color} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* File Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AI size={24} className="text-primary-600" />
            <span>Upload & Analyze Documents</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload
            accept=".pdf,.doc,.docx,.txt"
            multiple={true}
            maxSize={25}
            maxFiles={10}
            onFilesSelected={handleFilesSelected}
            onAnalysisComplete={handleAnalysisComplete}
            allowAnalysis={true}
            analysisTypes={['summary', 'risk-assessment', 'key-terms', 'compliance-check', 'contract-review']}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Analytics size={24} className="text-primary-600" />
              <span>Analysis Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EnhancedTable
              data={analysisResults}
              columns={analysisColumns}
              actions={analysisActions}
              loading={loading}
              searchable={true}
              exportable={true}
              onExport={(format) => {
                toast.success(`Exporting analysis results as ${format.toUpperCase()}`)
              }}
              emptyState={{
                title: 'No Analysis Results',
                description: 'Upload documents and select analysis types to see results here.',
                action: (
                  <Button variant="outline" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    Upload Documents
                  </Button>
                )
              }}
              className="mt-6"
            />
          </CardContent>
        </Card>
      )}

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Document Summary</h4>
              <p className="text-sm text-gray-600">
                Generate executive summaries highlighting key points, obligations, and important dates.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Risk Assessment</h4>
              <p className="text-sm text-gray-600">
                Identify potential legal risks, liability issues, and provide mitigation recommendations.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Key Terms Extraction</h4>
              <p className="text-sm text-gray-600">
                Extract important terms, dates, amounts, parties, and contractual obligations.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Compliance Check</h4>
              <p className="text-sm text-gray-600">
                Review documents against regulatory requirements and industry standards.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Contract Review</h4>
              <p className="text-sm text-gray-600">
                Comprehensive analysis of contract terms with negotiation recommendations.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Legal Research</h4>
              <p className="text-sm text-gray-600">
                Research relevant laws, precedents, and regulatory requirements related to the document.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}