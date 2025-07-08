/**
 * CounselFlow Ultimate 5.1 - Entity Management
 * Comprehensive entity tracking for group organizations
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { EnhancedTable } from '../components/ui/EnhancedTable';
import { 
  Plus, 
  Edit, 
  Delete, 
  Download, 
  Upload, 
  Building, 
  Users, 
  Calendar, 
  FileText,
  TrendingUp,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  MapPin,
  Briefcase
} from '../components/icons';
import { Entity, EntityFilter, EntitySummary, Shareholder, Director } from '../types/entity';

interface EntityManagementProps {
  className?: string;
}

const EntityManagement: React.FC<EntityManagementProps> = ({ className = '' }) => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [filteredEntities, setFilteredEntities] = useState<Entity[]>([]);
  const [filters, setFilters] = useState<EntityFilter>({});
  const [summary, setSummary] = useState<EntitySummary | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Mock data for demonstration
  const mockEntities: Entity[] = [
    {
      id: '1',
      name: 'TechCorp Holdings',
      legalName: 'TechCorp Holdings Limited',
      registrationNumber: 'TC001234',
      taxId: 'TAX-TC-001',
      industry: 'Technology',
      businessDescription: 'Holding company for technology investments',
      parentEntity: undefined,
      subsidiaries: ['2', '3'],
      ownership: 100,
      incorporationDate: new Date('2020-01-15'),
      jurisdiction: 'Delaware, USA',
      registeredAddress: {
        street: '123 Main Street',
        city: 'Wilmington',
        state: 'Delaware',
        country: 'USA',
        postalCode: '19801'
      },
      currency: 'USD',
      financialYearEnd: '12-31',
      authorizedCapital: 10000000,
      issuedCapital: 5000000,
      shareholders: [
        {
          id: 's1',
          name: 'Founder Ventures LLC',
          type: 'corporate',
          shareholding: 65,
          shareClass: 'Class A',
          votingRights: 65,
          appointedDate: new Date('2020-01-15')
        },
        {
          id: 's2',
          name: 'Employee Stock Plan',
          type: 'corporate',
          shareholding: 20,
          shareClass: 'Class B',
          votingRights: 10,
          appointedDate: new Date('2020-06-01')
        }
      ],
      directors: [
        {
          id: 'd1',
          name: 'John Smith',
          title: 'Chairman & CEO',
          type: 'executive',
          appointedDate: new Date('2020-01-15'),
          isChairman: true,
          contactInfo: {
            email: 'john.smith@techcorp.com',
            phone: '+1-555-0123'
          },
          committees: ['Executive', 'Strategy']
        }
      ],
      nextBoardMeeting: new Date('2024-02-15'),
      lastBoardMeeting: new Date('2024-01-15'),
      meetingFrequency: 'quarterly',
      constitutionalDocuments: [],
      status: 'active',
      complianceStatus: 'compliant',
      lastFilingDate: new Date('2024-01-01'),
      nextFilingDue: new Date('2024-04-01'),
      createdAt: new Date('2020-01-15'),
      updatedAt: new Date('2024-01-15'),
      createdBy: 'system',
      updatedBy: 'admin',
      tags: ['holding-company', 'technology']
    },
    {
      id: '2',
      name: 'TechCorp Software',
      legalName: 'TechCorp Software Inc.',
      registrationNumber: 'TC002345',
      industry: 'Software Development',
      businessDescription: 'Software development and SaaS products',
      parentEntity: '1',
      subsidiaries: [],
      ownership: 100,
      incorporationDate: new Date('2020-06-01'),
      jurisdiction: 'California, USA',
      registeredAddress: {
        street: '456 Innovation Drive',
        city: 'San Francisco',
        state: 'California',
        country: 'USA',
        postalCode: '94105'
      },
      currency: 'USD',
      financialYearEnd: '12-31',
      authorizedCapital: 1000000,
      issuedCapital: 500000,
      shareholders: [
        {
          id: 's3',
          name: 'TechCorp Holdings Limited',
          type: 'corporate',
          shareholding: 100,
          shareClass: 'Ordinary',
          votingRights: 100,
          appointedDate: new Date('2020-06-01')
        }
      ],
      directors: [
        {
          id: 'd2',
          name: 'Sarah Chen',
          title: 'CEO',
          type: 'executive',
          appointedDate: new Date('2020-06-01'),
          isChairman: false,
          contactInfo: {
            email: 'sarah.chen@techcorp.com'
          }
        }
      ],
      nextBoardMeeting: new Date('2024-02-20'),
      meetingFrequency: 'monthly',
      constitutionalDocuments: [],
      status: 'active',
      complianceStatus: 'warning',
      nextFilingDue: new Date('2024-03-15'),
      createdAt: new Date('2020-06-01'),
      updatedAt: new Date('2024-01-10'),
      createdBy: 'admin',
      updatedBy: 'admin',
      tags: ['subsidiary', 'software']
    }
  ];

  const mockSummary: EntitySummary = {
    totalEntities: 2,
    byJurisdiction: {
      'Delaware, USA': 1,
      'California, USA': 1
    },
    byIndustry: {
      'Technology': 1,
      'Software Development': 1
    },
    byStatus: {
      'active': 2,
      'dormant': 0,
      'dissolved': 0
    },
    complianceOverview: {
      compliant: 1,
      warning: 1,
      nonCompliant: 0
    },
    upcomingBoardMeetings: 2,
    overdueFilings: 0
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEntities(mockEntities);
      setFilteredEntities(mockEntities);
      setSummary(mockSummary);
      setIsLoading(false);
    }, 1000);
  }, []);

  const columns = [
    {
      id: 'name',
      label: 'Entity Name',
      accessor: 'name' as keyof Entity,
      sortable: true,
      render: (value: string, entity: Entity) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Building className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{entity.registrationNumber}</div>
          </div>
        </div>
      )
    },
    {
      id: 'industry',
      label: 'Industry',
      accessor: 'industry' as keyof Entity,
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center space-x-2">
          <Briefcase className="w-4 h-4 text-gray-400" />
          <span>{value}</span>
        </div>
      )
    },
    {
      id: 'jurisdiction',
      label: 'Jurisdiction',
      accessor: 'jurisdiction' as keyof Entity,
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>{value}</span>
        </div>
      )
    },
    {
      id: 'shareholders',
      label: 'Shareholders',
      accessor: (entity: Entity) => entity.shareholders.length,
      render: (value: number, entity: Entity) => (
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span>{value}</span>
          {entity.shareholders.length > 0 && (
            <div className="flex -space-x-1">
              {entity.shareholders.slice(0, 3).map((shareholder, idx) => (
                <div
                  key={idx}
                  className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white border-2 border-white"
                  title={shareholder.name}
                >
                  {shareholder.name.charAt(0)}
                </div>
              ))}
            </div>
          )}
        </div>
      )
    },
    {
      id: 'nextBoardMeeting',
      label: 'Next Board Meeting',
      accessor: 'nextBoardMeeting' as keyof Entity,
      sortable: true,
      render: (value: Date | undefined) => value ? (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{value.toLocaleDateString()}</span>
        </div>
      ) : (
        <span className="text-gray-400">Not scheduled</span>
      )
    },
    {
      id: 'complianceStatus',
      label: 'Compliance',
      accessor: 'complianceStatus' as keyof Entity,
      sortable: true,
      render: (value: string) => (
        <Badge
          variant={
            value === 'compliant' ? 'success' :
            value === 'warning' ? 'warning' : 'destructive'
          }
        >
          {value}
        </Badge>
      )
    },
    {
      id: 'status',
      label: 'Status',
      accessor: 'status' as keyof Entity,
      sortable: true,
      render: (value: string) => (
        <Badge
          variant={value === 'active' ? 'success' : 'secondary'}
        >
          {value}
        </Badge>
      )
    }
  ];

  const actions = [
    {
      label: 'View Details',
      icon: Eye,
      onClick: (entity: Entity) => setSelectedEntity(entity),
      variant: 'outline' as const
    },
    {
      label: 'Edit',
      icon: Edit,
      onClick: (entity: Entity) => console.log('Edit entity:', entity.id),
      variant: 'outline' as const
    },
    {
      label: 'Delete',
      icon: Delete,
      onClick: (entity: Entity) => console.log('Delete entity:', entity.id),
      variant: 'danger' as const
    }
  ];

  const bulkActions = [
    {
      label: 'Export Selected',
      icon: Download,
      onClick: (entities: Entity[]) => console.log('Export entities:', entities.map(e => e.id))
    },
    {
      label: 'Delete Selected',
      icon: Delete,
      onClick: (entities: Entity[]) => console.log('Delete entities:', entities.map(e => e.id)),
      variant: 'danger' as const
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Entity Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your group organization entities, shareholders, and governance
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button
            variant="outline"
            icon={Upload}
            onClick={() => setShowImportModal(true)}
          >
            Import Entities
          </Button>
          <Button
            variant="outline"
            icon={Download}
            onClick={() => console.log('Export all entities')}
          >
            Export All
          </Button>
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setShowCreateModal(true)}
          >
            Add Entity
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{summary.totalEntities}</div>
                <div className="text-sm text-gray-500">Total Entities</div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{summary.complianceOverview.compliant}</div>
                <div className="text-sm text-gray-500">Compliant Entities</div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{summary.complianceOverview.warning}</div>
                <div className="text-sm text-gray-500">Compliance Warnings</div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{summary.upcomingBoardMeetings}</div>
                <div className="text-sm text-gray-500">Upcoming Board Meetings</div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Main Table */}
      <Card>
        <EnhancedTable
          data={filteredEntities}
          columns={columns}
          loading={isLoading}
          selectable
          actions={actions}
          bulkActions={bulkActions}
          searchable
          exportable
          onExport={(format) => console.log('Export as:', format)}
          onSearch={(query) => {
            const filtered = entities.filter(entity =>
              entity.name.toLowerCase().includes(query.toLowerCase()) ||
              entity.legalName.toLowerCase().includes(query.toLowerCase()) ||
              entity.industry.toLowerCase().includes(query.toLowerCase()) ||
              entity.jurisdiction.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredEntities(filtered);
          }}
          emptyState={{
            title: 'No entities found',
            description: 'Create your first entity to get started',
            action: (
              <Button
                icon={Plus}
                variant="primary"
                onClick={() => setShowCreateModal(true)}
              >
                Add Entity
              </Button>
            )
          }}
        />
      </Card>

      {/* Entity Details Modal */}
      <AnimatePresence>
        {selectedEntity && (
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
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
                <h2 className="text-xl font-bold text-gray-900">{selectedEntity.name}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedEntity(null)}
                >
                  ×
                </Button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Legal Name</label>
                      <p className="text-gray-900">{selectedEntity.legalName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Registration Number</label>
                      <p className="text-gray-900">{selectedEntity.registrationNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Industry</label>
                      <p className="text-gray-900">{selectedEntity.industry}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Incorporation Date</label>
                      <p className="text-gray-900">{selectedEntity.incorporationDate.toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Shareholders */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Shareholders</h3>
                  <div className="space-y-3">
                    {selectedEntity.shareholders.map((shareholder) => (
                      <div key={shareholder.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{shareholder.name}</div>
                          <div className="text-sm text-gray-500">{shareholder.type} • {shareholder.shareClass}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-900">{shareholder.shareholding}%</div>
                          <div className="text-sm text-gray-500">{shareholder.votingRights}% voting</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Directors */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Directors</h3>
                  <div className="space-y-3">
                    {selectedEntity.directors.map((director) => (
                      <div key={director.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{director.name}</div>
                          <div className="text-sm text-gray-500">{director.title}</div>
                        </div>
                        <div className="flex space-x-2">
                          {director.isChairman && (
                            <Badge variant="info">Chairman</Badge>
                          )}
                          <Badge variant="secondary">{director.type}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EntityManagement;