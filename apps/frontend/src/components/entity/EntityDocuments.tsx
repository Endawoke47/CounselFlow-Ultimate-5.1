/**
 * CounselFlow Ultimate 5.1 - Entity Document Management
 * Constitutional documents and file management for entities
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { FileUpload } from '../ui/FileUpload';
import { 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  Edit, 
  Delete,
  Calendar,
  User,
  Plus,
  Shield
} from '../icons';
import { ConstitutionalDocument } from '../../types/entity';

interface EntityDocumentsProps {
  entityId: string;
  documents: ConstitutionalDocument[];
  onDocumentUpload: (file: File, metadata: Partial<ConstitutionalDocument>) => void;
  onDocumentDelete: (documentId: string) => void;
  onDocumentView: (document: ConstitutionalDocument) => void;
  className?: string;
}

const DOCUMENT_TYPES = [
  { value: 'articles_of_association', label: 'Articles of Association', icon: '📜' },
  { value: 'memorandum', label: 'Memorandum of Association', icon: '📋' },
  { value: 'shareholders_agreement', label: 'Shareholders Agreement', icon: '🤝' },
  { value: 'board_charter', label: 'Board Charter', icon: '⚖️' },
  { value: 'other', label: 'Other Constitutional Document', icon: '📄' }
];

export const EntityDocuments: React.FC<EntityDocumentsProps> = ({
  entityId,
  documents,
  onDocumentUpload,
  onDocumentDelete,
  onDocumentView,
  className = ''
}) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadMetadata, setUploadMetadata] = useState<Partial<ConstitutionalDocument>>({
    type: 'articles_of_association',
    version: '1.0',
    effectiveDate: new Date(),
    isActive: true
  });

  const handleFileUpload = (file: File) => {
    const document: Partial<ConstitutionalDocument> = {
      ...uploadMetadata,
      entityId,
      title: uploadMetadata.title || file.name,
      fileSize: file.size,
      uploadedAt: new Date(),
      uploadedBy: 'current-user' // Would come from auth context
    };
    
    onDocumentUpload(file, document);
    setShowUploadModal(false);
    setUploadMetadata({
      type: 'articles_of_association',
      version: '1.0',
      effectiveDate: new Date(),
      isActive: true
    });
  };

  const getDocumentTypeInfo = (type: string) => {
    return DOCUMENT_TYPES.find(t => t.value === type) || DOCUMENT_TYPES[4];
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Constitutional Documents</h3>
          <p className="text-sm text-gray-600">
            Manage key constitutional and governance documents
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setShowUploadModal(true)}
        >
          Upload Document
        </Button>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 gap-4">
        {documents.map((document) => {
          const typeInfo = getDocumentTypeInfo(document.type);
          
          return (
            <Card key={document.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{document.title}</h4>
                      {document.isActive && (
                        <Badge variant="success">Active</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <span>{typeInfo.label}</span>
                      <span>•</span>
                      <span>Version {document.version}</span>
                      <span>•</span>
                      <span>{formatFileSize(document.fileSize)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>Effective: {document.effectiveDate.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>Uploaded by: {document.uploadedBy}</span>
                      </div>
                    </div>
                    
                    {document.description && (
                      <p className="text-sm text-gray-600 mt-2">{document.description}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Eye}
                    onClick={() => onDocumentView(document)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Download}
                    onClick={() => window.open(document.fileUrl, '_blank')}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Delete}
                    onClick={() => onDocumentDelete(document.id)}
                  />
                </div>
              </div>
            </Card>
          );
        })}
        
        {documents.length === 0 && (
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents</h3>
            <p className="text-gray-600 mb-4">
              Upload constitutional documents to get started
            </p>
            <Button
              variant="primary"
              icon={Upload}
              onClick={() => setShowUploadModal(true)}
            >
              Upload First Document
            </Button>
          </Card>
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
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
              className="bg-white rounded-xl max-w-lg w-full shadow-2xl"
            >
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-bold text-gray-900">Upload Document</h2>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Document Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Type
                  </label>
                  <select
                    value={uploadMetadata.type}
                    onChange={(e) => setUploadMetadata(prev => ({ 
                      ...prev, 
                      type: e.target.value as ConstitutionalDocument['type'] 
                    }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {DOCUMENT_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Title
                  </label>
                  <input
                    type="text"
                    value={uploadMetadata.title || ''}
                    onChange={(e) => setUploadMetadata(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter document title"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Version */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Version
                  </label>
                  <input
                    type="text"
                    value={uploadMetadata.version || ''}
                    onChange={(e) => setUploadMetadata(prev => ({ ...prev, version: e.target.value }))}
                    placeholder="e.g., 1.0, 2.1"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Effective Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Effective Date
                  </label>
                  <input
                    type="date"
                    value={uploadMetadata.effectiveDate?.toISOString().split('T')[0] || ''}
                    onChange={(e) => setUploadMetadata(prev => ({ 
                      ...prev, 
                      effectiveDate: new Date(e.target.value) 
                    }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={uploadMetadata.description || ''}
                    onChange={(e) => setUploadMetadata(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the document"
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload File
                  </label>
                  <FileUpload
                    accept=".pdf,.doc,.docx"
                    maxSize={10 * 1024 * 1024} // 10MB
                    onFileSelect={handleFileUpload}
                  />
                </div>
              </div>
              
              <div className="border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowUploadModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};