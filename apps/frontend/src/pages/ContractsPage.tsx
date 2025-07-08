import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { 
  Plus, 
  Sparkles, 
  Brain, 
  FileText, 
  Search, 
  Upload, 
  Download,
  Eye,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Building,
  Users,
  Filter,
  MoreVertical,
  Zap,
  Shield
} from '../components/icons';
import { Contract, ContractType, ContractStatus, ContractDraftingSession, ContractReviewSession, ContractImportJob } from '../types/contracts';
import { Entity } from '../types/entity';
import ContractDraftingWizard from '../components/contracts/ContractDraftingWizard';
import ContractReviewInterface from '../components/contracts/ContractReviewInterface';

interface ContractsPageProps {
  className?: string;
}

const ContractsPage: React.FC<ContractsPageProps> = ({ className = '' }) => {
  const [activeWorkflow, setActiveWorkflow] = useState<'drafting' | 'reviewing' | 'repository'>('repository');
  const [showDraftingWizard, setShowDraftingWizard] = useState(false);
  const [showReviewInterface, setShowReviewInterface] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContractStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<ContractType | 'all'>('all');

  // Mock data - replace with actual API calls
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    // Mock entities
    const mockEntities: Entity[] = [
      {
        id: 'entity-1',
        name: 'TechCorp Holdings',
        legalName: 'TechCorp Holdings, Inc.',
        type: 'corporation',
        registrationNumber: 'TC-2024-001',
        taxId: '12-3456789',
        incorporationDate: new Date('2020-01-15'),
        status: 'active',
        jurisdiction: 'Delaware, USA',
        address: {
          street: '123 Innovation Drive',
          city: 'San Francisco',
          state: 'CA',
          country: 'USA',
          postalCode: '94105'
        },
        contact: {
          primaryPhone: '+1-555-0123',
          primaryEmail: 'legal@techcorp.com',
          website: 'https://techcorp.com'
        },
        businessInfo: {
          industry: 'Technology',
          employees: 500,
          revenue: 50000000,
          description: 'Leading technology solutions provider'
        },
        governance: {
          boardSize: 7,
          independentDirectors: 3,
          lastBoardMeeting: new Date('2024-01-15')
        },
        compliance: {
          regulatoryStatus: 'compliant',
          lastAudit: new Date('2023-12-01'),
          licenses: []
        },
        shareholders: [],
        directors: [],
        boardMeetings: [],
        constitutionalDocuments: [],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15'),
        createdBy: 'system',
        updatedBy: 'system'
      }
    ];

    // Mock contracts
    const mockContracts: Contract[] = [
      {
        id: 'contract-1',
        title: 'Enterprise Software License Agreement',
        type: 'licensing',
        status: 'active',
        priority: 'high',
        workflowStage: 'repository',
        counterparty: {
          name: 'Global Enterprises Inc.',
          type: 'company',
          contactEmail: 'contracts@globalent.com'
        },
        internalEntity: 'entity-1',
        signatories: [
          {
            party: 'internal',
            name: 'John Smith',
            title: 'CEO',
            email: 'john.smith@techcorp.com',
            signedAt: new Date('2024-01-15')
          }
        ],
        financialTerms: {
          totalValue: 150000,
          currency: 'USD',
          paymentTerms: 'Net 30 days'
        },
        timeline: {
          createdDate: new Date('2024-01-01'),
          effectiveDate: new Date('2024-01-15'),
          expirationDate: new Date('2024-12-31')
        },
        legalFramework: {
          governingLaw: 'California',
          jurisdiction: 'California, USA',
          disputeResolution: 'arbitration',
          confidentialityLevel: 'confidential'
        },
        management: {
          assignedTo: 'user-1',
          reviewers: ['user-2'],
          businessOwner: 'user-3',
          department: 'Legal'
        },
        content: {
          description: 'Annual software licensing agreement for enterprise suite',
          keyTerms: [
            {
              term: 'License Duration',
              description: '12 months with auto-renewal',
              category: 'commercial'
            },
            {
              term: 'User Limit',
              description: 'Up to 500 concurrent users',
              category: 'technical'
            }
          ],
          riskLevel: 'low',
          riskFactors: ['Standard terms', 'Established counterparty']
        },
        aiAnalysis: {
          riskScore: 25,
          riskCategory: 'low',
          redFlags: [],
          recommendations: [
            {
              category: 'optimization',
              priority: 'low',
              description: 'Consider adding usage analytics clause',
              implementation: 'Add monitoring provisions in next renewal'
            }
          ],
          missingClauses: [],
          analyzedAt: new Date('2024-01-10'),
          analysisVersion: '1.0',
          confidence: 95
        },
        documents: [
          {
            id: 'doc-1',
            name: 'Enterprise_License_Agreement_v1.pdf',
            type: 'main_contract',
            format: 'pdf',
            url: '/documents/contract-1/main.pdf',
            version: '1.0',
            size: 2048000,
            checksum: 'abc123',
            isLatest: true,
            uploadedAt: new Date('2024-01-01'),
            uploadedBy: 'user-1'
          }
        ],
        progressTracking: {
          milestones: [],
          workflowSteps: [],
          approvalWorkflow: []
        },
        linkedRecords: {},
        system: {
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-15'),
          createdBy: 'user-1',
          updatedBy: 'user-1',
          version: 1,
          changeLog: [],
          tags: ['enterprise', 'software', 'licensing'],
          access: {
            visibility: 'restricted'
          }
        }
      },
      {
        id: 'contract-2',
        title: 'Professional Services Agreement',
        type: 'service_agreement',
        status: 'under_negotiation',
        priority: 'medium',
        workflowStage: 'reviewing',
        counterparty: {
          name: 'Consulting Partners LLC',
          type: 'company',
          contactEmail: 'legal@consultingpartners.com'
        },
        internalEntity: 'entity-1',
        signatories: [],
        financialTerms: {
          totalValue: 75000,
          currency: 'USD',
          paymentTerms: 'Net 45 days'
        },
        timeline: {
          createdDate: new Date('2024-01-10'),
          effectiveDate: new Date('2024-02-01'),
          expirationDate: new Date('2024-07-31')
        },
        legalFramework: {
          governingLaw: 'California',
          jurisdiction: 'California, USA',
          disputeResolution: 'litigation',
          confidentialityLevel: 'confidential'
        },
        management: {
          assignedTo: 'user-2',
          reviewers: ['user-1', 'user-3'],
          businessOwner: 'user-4',
          department: 'Legal'
        },
        content: {
          description: 'Professional consulting services for digital transformation',
          keyTerms: [
            {
              term: 'Service Duration',
              description: '6 months fixed term',
              category: 'commercial'
            },
            {
              term: 'Deliverables',
              description: 'Monthly reports and final implementation plan',
              category: 'operational'
            }
          ],
          riskLevel: 'medium',
          riskFactors: ['New counterparty', 'Payment terms longer than standard']
        },
        aiAnalysis: {
          riskScore: 65,
          riskCategory: 'medium',
          redFlags: [
            {
              category: 'financial',
              severity: 'medium',
              description: 'Payment terms (Net 45) exceed company standard (Net 30)',
              recommendation: 'Negotiate to Net 30 or add early payment discount',
              clause: 'Section 4.2'
            }
          ],
          recommendations: [
            {
              category: 'protection',
              priority: 'high',
              description: 'Add liability limitation clause',
              implementation: 'Insert standard liability cap provision'
            }
          ],
          missingClauses: [
            {
              clause: 'Liability Limitation',
              importance: 'critical',
              reasoning: 'High-value service agreement lacks liability protection'
            }
          ],
          analyzedAt: new Date('2024-01-12'),
          analysisVersion: '1.0',
          confidence: 88
        },
        documents: [
          {
            id: 'doc-2',
            name: 'Services_Agreement_Draft_v2.docx',
            type: 'main_contract',
            format: 'docx',
            url: '/documents/contract-2/draft.docx',
            version: '2.0',
            size: 1024000,
            checksum: 'def456',
            isLatest: true,
            uploadedAt: new Date('2024-01-12'),
            uploadedBy: 'user-2'
          }
        ],
        progressTracking: {
          milestones: [],
          workflowSteps: [],
          approvalWorkflow: []
        },
        linkedRecords: {},
        system: {
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-12'),
          createdBy: 'user-2',
          updatedBy: 'user-2',
          version: 2,
          changeLog: [],
          tags: ['services', 'consulting', 'transformation'],
          access: {
            visibility: 'restricted'
          }
        }
      }
    ];

    setEntities(mockEntities);
    setContracts(mockContracts);
  };

  const handleDraftingComplete = (session: ContractDraftingSession) => {
    console.log('Drafting session completed:', session);
    setShowDraftingWizard(false);
    // TODO: Create new contract from session
  };

  const handleReviewComplete = (review: ContractReviewSession) => {
    console.log('Review completed:', review);
    setShowReviewInterface(false);
    // TODO: Update contract with review results
  };

  const getContractsByWorkflow = () => {
    return contracts.filter(contract => contract.workflowStage === activeWorkflow);
  };

  const getFilteredContracts = () => {
    let filtered = getContractsByWorkflow();

    if (searchTerm) {
      filtered = filtered.filter(contract => 
        contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.counterparty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.content.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(contract => contract.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(contract => contract.type === typeFilter);
    }

    return filtered;
  };

  const getWorkflowStats = () => {
    const drafting = contracts.filter(c => c.workflowStage === 'drafting').length;
    const reviewing = contracts.filter(c => c.workflowStage === 'reviewing').length;
    const repository = contracts.filter(c => c.workflowStage === 'repository').length;
    const totalValue = contracts.reduce((sum, c) => sum + (c.financialTerms.totalValue || 0), 0);
    const highRisk = contracts.filter(c => c.content.riskLevel === 'high').length;
    const expiringSoon = contracts.filter(c => {
      if (!c.timeline.expirationDate) return false;
      const expDate = new Date(c.timeline.expirationDate);
      const now = new Date();
      const monthsUntilExpiry = (expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30);
      return monthsUntilExpiry <= 3 && monthsUntilExpiry > 0;
    }).length;

    return { drafting, reviewing, repository, totalValue, highRisk, expiringSoon };
  };

  const stats = getWorkflowStats();
  const filteredContracts = getFilteredContracts();

  const workflowTabs = [
    { 
      id: 'drafting', 
      label: 'Draft Contracts', 
      icon: Sparkles, 
      count: stats.drafting,
      description: 'AI-powered contract creation'
    },
    { 
      id: 'reviewing', 
      label: 'Review & Analyze', 
      icon: Brain, 
      count: stats.reviewing,
      description: 'AI contract analysis & risk assessment'
    },
    { 
      id: 'repository', 
      label: 'Contract Repository', 
      icon: FileText, 
      count: stats.repository,
      description: 'Track & manage all contracts'
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contracts</h1>
          <p className="text-gray-600 mt-1">AI-powered contract lifecycle management</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            icon={Upload}
            onClick={() => setShowImportModal(true)}
          >
            Import Contracts
          </Button>
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setShowDraftingWizard(true)}
          >
            Create Contract
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Portfolio Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(stats.totalValue / 1000000).toFixed(1)}M
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">+12%</span>
            <span className="text-gray-500 ml-1">this quarter</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Contracts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.repository}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-blue-600 font-medium">{stats.reviewing} under review</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Risk Items</p>
              <p className="text-2xl font-bold text-gray-900">{stats.highRisk}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-red-600 font-medium">Require attention</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-gray-900">{stats.expiringSoon}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-orange-600 font-medium">Next 3 months</span>
          </div>
        </Card>
      </div>

      {/* Workflow Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {workflowTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveWorkflow(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeWorkflow === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
                <Badge variant="secondary" size="sm">
                  {tab.count}
                </Badge>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search contracts, parties, terms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="template_selection">Template Selection</option>
            <option value="ai_drafting">AI Drafting</option>
            <option value="under_negotiation">Under Negotiation</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="nda">NDA</option>
            <option value="service_agreement">Service Agreement</option>
            <option value="licensing">Licensing</option>
            <option value="employment">Employment</option>
            <option value="partnership">Partnership</option>
          </select>
        </div>
      </div>

      {/* Workflow Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeWorkflow}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Drafting Workflow */}
          {activeWorkflow === 'drafting' && (
            <div className="space-y-6">
              <Card className="p-8 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-primary-100 rounded-full">
                    <Sparkles className="w-8 h-8 text-primary-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Contract Drafting</h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Create professional contracts quickly with our AI assistant. Simply provide your requirements, 
                  and we'll generate a comprehensive draft tailored to your needs.
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    variant="primary"
                    icon={Sparkles}
                    onClick={() => setShowDraftingWizard(true)}
                    size="lg"
                  >
                    Start AI Drafting
                  </Button>
                  <Button
                    variant="outline"
                    icon={FileText}
                    size="lg"
                  >
                    Browse Templates
                  </Button>
                </div>
              </Card>

              {/* Recent Drafts */}
              {filteredContracts.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Drafts</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredContracts.map((contract) => (
                      <ContractCard key={contract.id} contract={contract} onAction={() => {}} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reviewing Workflow */}
          {activeWorkflow === 'reviewing' && (
            <div className="space-y-6">
              <Card className="p-8 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Brain className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Contract Review & Analysis</h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Upload contracts for comprehensive AI analysis. Get risk assessments, compliance checks, 
                  clause recommendations, and market comparisons.
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    variant="primary"
                    icon={Upload}
                    size="lg"
                  >
                    Upload for Review
                  </Button>
                  <Button
                    variant="outline"
                    icon={Shield}
                    size="lg"
                  >
                    Bulk Analysis
                  </Button>
                </div>
              </Card>

              {/* Contracts Under Review */}
              {filteredContracts.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Under Review</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredContracts.map((contract) => (
                      <ContractCard 
                        key={contract.id} 
                        contract={contract} 
                        onAction={() => {
                          setSelectedContract(contract);
                          setShowReviewInterface(true);
                        }} 
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Repository Workflow */}
          {activeWorkflow === 'repository' && (
            <div className="space-y-6">
              {filteredContracts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredContracts.map((contract) => (
                    <ContractCard key={contract.id} contract={contract} onAction={() => {}} />
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-gray-100 rounded-full">
                      <FileText className="w-8 h-8 text-gray-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No contracts found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                      ? 'Try adjusting your search criteria or filters.'
                      : 'Start building your contract portfolio with AI-powered tools.'}
                  </p>
                  <Button
                    variant="primary"
                    icon={Plus}
                    onClick={() => setShowDraftingWizard(true)}
                  >
                    Create First Contract
                  </Button>
                </Card>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Contract Drafting Wizard Modal */}
      {showDraftingWizard && (
        <ContractDraftingWizard
          onClose={() => setShowDraftingWizard(false)}
          onComplete={handleDraftingComplete}
          entities={entities}
        />
      )}

      {/* Contract Review Interface Modal */}
      {showReviewInterface && selectedContract && (
        <ContractReviewInterface
          contractId={selectedContract.id}
          documentId={selectedContract.documents[0]?.id || ''}
          documentContent="[Sample contract content would be loaded here...]"
          onClose={() => {
            setShowReviewInterface(false);
            setSelectedContract(null);
          }}
          onReviewComplete={handleReviewComplete}
        />
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Import Historical Contracts</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowImportModal(false)}
                >
                  ×
                </Button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Upload existing contracts for AI analysis and summarization. Supported formats: PDF, DOCX, TXT.
              </p>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Drop files here or click to browse</p>
                <p className="text-sm text-gray-500">Maximum file size: 10MB</p>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowImportModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary">
                  Start Import & Analysis
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// Contract Card Component
interface ContractCardProps {
  contract: Contract;
  onAction: () => void;
}

const ContractCard: React.FC<ContractCardProps> = ({ contract, onAction }) => {
  const getStatusColor = (status: ContractStatus) => {
    switch (status) {
      case 'active':
      case 'fully_executed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'under_negotiation':
      case 'legal_review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ai_drafting':
      case 'human_review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'expired':
      case 'terminated':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
      case 'critical':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <FileText className="w-5 h-5 text-primary-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg leading-tight">
              {contract.title}
            </h3>
            <p className="text-sm text-gray-600">{contract.type.replace('_', ' ')}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${getRiskColor(contract.content.riskLevel)}`} />
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Counterparty:</span>
          <span className="text-sm font-medium text-gray-900">{contract.counterparty.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Value:</span>
          <span className="text-sm font-semibold text-green-600">
            {contract.financialTerms.totalValue ? 
              `$${contract.financialTerms.totalValue.toLocaleString()}` : 
              'N/A'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Status:</span>
          <Badge className={getStatusColor(contract.status)}>
            {contract.status.replace('_', ' ')}
          </Badge>
        </div>
      </div>

      {/* AI Insights */}
      {contract.aiAnalysis && (
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center mb-2">
            <Brain className="w-4 h-4 text-purple-600 mr-2" />
            <span className="text-sm font-semibold text-purple-700">AI Analysis</span>
            <Badge variant="secondary" size="sm" className="ml-2">
              {contract.aiAnalysis.confidence}% confidence
            </Badge>
          </div>
          <p className="text-xs text-purple-600">
            Risk Score: {contract.aiAnalysis.riskScore}/100 • 
            {contract.aiAnalysis.redFlags.length} red flags • 
            {contract.aiAnalysis.recommendations.length} recommendations
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4" />
          </Button>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={contract.workflowStage === 'reviewing' ? Brain : Zap}
          onClick={onAction}
        >
          {contract.workflowStage === 'reviewing' ? 'Review' : 'Analyze'}
        </Button>
      </div>
    </Card>
  );
};

export default ContractsPage;