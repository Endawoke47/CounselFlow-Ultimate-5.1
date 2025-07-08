import React, { useState } from 'react';
import { Card, Button, Input, Badge, Modal } from '../components/ui/UIComponents';

interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  fields: Array<{
    name: string;
    type: 'text' | 'textarea' | 'select' | 'date' | 'number';
    label: string;
    required: boolean;
    options?: string[];
  }>;
}

const DocumentGenerator: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState('');

  const templates: DocumentTemplate[] = [
    {
      id: 'nda',
      name: 'Non-Disclosure Agreement',
      description: 'Standard NDA for protecting confidential information',
      icon: '🔒',
      category: 'Contracts',
      fields: [
        { name: 'party1Name', type: 'text', label: 'First Party Name', required: true },
        { name: 'party2Name', type: 'text', label: 'Second Party Name', required: true },
        { name: 'effectiveDate', type: 'date', label: 'Effective Date', required: true },
        { name: 'jurisdiction', type: 'select', label: 'Jurisdiction', required: true, options: ['Delaware', 'California', 'New York', 'Texas'] },
        { name: 'term', type: 'select', label: 'Term', required: true, options: ['1 year', '2 years', '3 years', '5 years', 'Indefinite'] },
      ]
    },
    {
      id: 'employment',
      name: 'Employment Agreement',
      description: 'Comprehensive employment contract template',
      icon: '👤',
      category: 'HR',
      fields: [
        { name: 'employeeName', type: 'text', label: 'Employee Name', required: true },
        { name: 'position', type: 'text', label: 'Position/Title', required: true },
        { name: 'salary', type: 'number', label: 'Annual Salary', required: true },
        { name: 'startDate', type: 'date', label: 'Start Date', required: true },
        { name: 'benefits', type: 'textarea', label: 'Benefits Package', required: false },
      ]
    },
    {
      id: 'service',
      name: 'Service Agreement',
      description: 'Professional services contract template',
      icon: '🤝',
      category: 'Contracts',
      fields: [
        { name: 'clientName', type: 'text', label: 'Client Name', required: true },
        { name: 'serviceDescription', type: 'textarea', label: 'Service Description', required: true },
        { name: 'fee', type: 'number', label: 'Service Fee', required: true },
        { name: 'deliverables', type: 'textarea', label: 'Deliverables', required: true },
        { name: 'timeline', type: 'text', label: 'Timeline', required: true },
      ]
    },
    {
      id: 'privacy',
      name: 'Privacy Policy',
      description: 'GDPR/CCPA compliant privacy policy',
      icon: '🛡️',
      category: 'Compliance',
      fields: [
        { name: 'companyName', type: 'text', label: 'Company Name', required: true },
        { name: 'website', type: 'text', label: 'Website URL', required: true },
        { name: 'contactEmail', type: 'text', label: 'Contact Email', required: true },
        { name: 'dataTypes', type: 'textarea', label: 'Types of Data Collected', required: true },
      ]
    },
    {
      id: 'tos',
      name: 'Terms of Service',
      description: 'Website/app terms of service',
      icon: '📋',
      category: 'Compliance',
      fields: [
        { name: 'serviceName', type: 'text', label: 'Service/App Name', required: true },
        { name: 'companyName', type: 'text', label: 'Company Name', required: true },
        { name: 'serviceType', type: 'select', label: 'Service Type', required: true, options: ['Website', 'Mobile App', 'SaaS Platform', 'E-commerce'] },
        { name: 'userObligations', type: 'textarea', label: 'User Obligations', required: true },
      ]
    },
    {
      id: 'demand',
      name: 'Demand Letter',
      description: 'Professional demand letter template',
      icon: '⚖️',
      category: 'Litigation',
      fields: [
        { name: 'recipientName', type: 'text', label: 'Recipient Name', required: true },
        { name: 'issue', type: 'textarea', label: 'Issue Description', required: true },
        { name: 'demand', type: 'textarea', label: 'Specific Demand', required: true },
        { name: 'deadline', type: 'date', label: 'Response Deadline', required: true },
      ]
    }
  ];

  const categories = [...new Set(templates.map(t => t.category))];

  const handleTemplateSelect = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setFormData({});
  };

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleGenerate = async () => {
    if (!selectedTemplate) return;
    
    setIsGenerating(true);
    
    // Simulate AI document generation
    setTimeout(() => {
      const sampleDocument = `
# ${selectedTemplate.name}

**Generated on:** ${new Date().toLocaleDateString()}

## Document Details

${selectedTemplate.fields.map(field => {
  const value = formData[field.name] || '[TO BE FILLED]';
  return `**${field.label}:** ${value}`;
}).join('\n')}

## Terms and Conditions

This document has been generated using AI-powered legal template generation. 
Please review all terms carefully and consult with a qualified attorney before execution.

---

*This document was created using CounselFlow's AI Document Generator*
      `;
      
      setGeneratedDocument(sampleDocument);
      setIsGenerating(false);
      setShowPreview(true);
    }, 2000);
  };

  const renderFormField = (field: any) => {
    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-teal-800">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              className="w-full px-3 py-2 border border-teal-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all duration-200"
              rows={4}
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={`Enter ${field.label.toLowerCase()}`}
            />
          </div>
        );
      
      case 'select':
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-teal-800">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <select
              className="w-full px-3 py-2 border border-teal-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all duration-200"
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
            >
              <option value="">Select {field.label}</option>
              {field.options?.map((option: string) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        );
      
      default:
        return (
          <Input
            key={field.name}
            label={`${field.label} ${field.required ? '*' : ''}`}
            type={field.type}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        );
    }
  };

  return (
    <div className="px-4 lg:px-6 bg-gradient-to-br from-teal-50 to-white min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-700 to-cyan-600 bg-clip-text text-transparent">
              Document Generator
            </h1>
            <p className="text-teal-600 mt-2 text-lg font-medium">
              AI-powered legal document creation with professional templates
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              ✨ AI Powered
            </div>
            <Button variant="secondary" className="border-teal-200 text-teal-700 hover:bg-teal-50">
              Template Library
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Template Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <h2 className="text-xl font-semibold text-teal-800 mb-6">Choose Template</h2>
            
            {categories.map(category => (
              <div key={category} className="mb-6">
                <h3 className="text-sm font-semibold text-teal-600 uppercase tracking-wider mb-3">
                  {category}
                </h3>
                <div className="space-y-2">
                  {templates.filter(t => t.category === category).map(template => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                        selectedTemplate?.id === template.id
                          ? 'border-teal-500 bg-teal-50 shadow-sm'
                          : 'border-teal-200 hover:border-teal-400 hover:bg-teal-50/50'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-xl">{template.icon}</span>
                        <div>
                          <h4 className="font-medium text-teal-800">{template.name}</h4>
                          <p className="text-sm text-teal-600 mt-1">{template.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          {selectedTemplate ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{selectedTemplate.icon}</span>
                  <div>
                    <h2 className="text-xl font-semibold text-teal-800">{selectedTemplate.name}</h2>
                    <p className="text-teal-600">{selectedTemplate.description}</p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {selectedTemplate.category}
                </div>
              </div>

              <div className="space-y-6">
                {selectedTemplate.fields.map(field => renderFormField(field))}
                
                <div className="flex items-center justify-between pt-6 border-t border-teal-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-teal-600">AI will review and optimize your document</span>
                  </div>
                  <Button
                    variant="ai"
                    onClick={handleGenerate}
                    loading={isGenerating}
                    icon="✨"
                    iconPosition="left"
                    className="px-6 bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-700 hover:to-cyan-700"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Document'}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg h-full flex items-center justify-center">
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-xl font-semibold text-teal-800 mb-2">Select a Template</h3>
                <p className="text-teal-600">Choose a document template from the left to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Document Preview"
        size="xl"
      >
        <div className="space-y-4">
          <div className="bg-teal-50 rounded-lg p-4">
            <pre className="whitespace-pre-wrap text-sm text-teal-800 font-mono">
              {generatedDocument}
            </pre>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="secondary" size="sm" className="border-teal-200 text-teal-700 hover:bg-teal-50">Edit</Button>
              <Button variant="secondary" size="sm" className="border-teal-200 text-teal-700 hover:bg-teal-50">Download PDF</Button>
              <Button variant="secondary" size="sm" className="border-teal-200 text-teal-700 hover:bg-teal-50">Download DOCX</Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" onClick={() => setShowPreview(false)} className="text-teal-600 hover:bg-teal-50">
                Close
              </Button>
              <Button variant="primary" className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-700 hover:to-cyan-700">Save to Documents</Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Recent Documents */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
        <h2 className="text-xl font-semibold text-teal-800 mb-6">Recent Documents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'TechCorp NDA', type: 'NDA', date: '2 hours ago', status: 'draft' },
            { name: 'Employment Agreement - Jane Smith', type: 'Employment', date: '1 day ago', status: 'final' },
            { name: 'Service Agreement - ABC Corp', type: 'Service', date: '3 days ago', status: 'review' },
          ].map((doc, index) => (
            <div key={index} className="p-4 border border-teal-200 rounded-lg hover:border-teal-400 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-teal-800">{doc.name}</h4>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  doc.status === 'final' ? 'bg-green-100 text-green-700' : 
                  doc.status === 'review' ? 'bg-orange-100 text-orange-700' : 
                  'bg-teal-100 text-teal-700'
                }`}>
                  {doc.status}
                </div>
              </div>
              <p className="text-sm text-teal-600 mb-2">{doc.type}</p>
              <p className="text-xs text-teal-500">{doc.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentGenerator;
