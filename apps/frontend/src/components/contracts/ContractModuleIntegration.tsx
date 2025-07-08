import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  Building, 
  AlertTriangle, 
  Scale, 
  FileText, 
  CheckCircle, 
  Users, 
  Shield, 
  Database,
  TrendingUp,
  Eye,
  Plus,
  ExternalLink,
  Link as LinkIcon,
  ArrowRight
} from '../components/icons';
import { Contract } from '../../types/contracts';

interface LinkedModule {
  id: string;
  type: 'entity' | 'dispute' | 'matter' | 'risk' | 'policy' | 'outsourcing';
  name: string;
  description: string;
  status: string;
  link: string;
  metadata: Record<string, any>;
  createdAt: Date;
}

interface ModuleIntegrationProps {
  contract: Contract;
  onIntegrationUpdate: (linkedRecords: Contract['linkedRecords']) => void;
  className?: string;
}

const ContractModuleIntegration: React.FC<ModuleIntegrationProps> = ({
  contract,
  onIntegrationUpdate,
  className = ''
}) => {
  const [linkedModules, setLinkedModules] = useState<LinkedModule[]>([]);
  const [availableLinks, setAvailableLinks] = useState<Record<string, any[]>>({});
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedModuleType, setSelectedModuleType] = useState<string>('');

  const moduleTypes = [
    {
      id: 'entity',
      name: 'Entity Management',
      icon: Building,
      color: 'blue',
      description: 'Link to entities involved in this contract',
      linkType: 'entities'
    },
    {
      id: 'dispute',
      name: 'Dispute Management', 
      icon: Scale,
      color: 'red',
      description: 'Connect related disputes and litigation',
      linkType: 'disputes'
    },
    {
      id: 'matter',
      name: 'Matter Management',
      icon: FileText,
      color: 'green',
      description: 'Associate with ongoing legal matters',
      linkType: 'matters'
    },
    {
      id: 'risk',
      name: 'Risk Management',
      icon: AlertTriangle,
      color: 'orange',
      description: 'Link to identified risks and mitigation plans',
      linkType: 'risks'
    },
    {
      id: 'policy',
      name: 'Policy Management',
      icon: Shield,
      color: 'purple',
      description: 'Connect to relevant policies and procedures',
      linkType: 'policies'
    },
    {
      id: 'outsourcing',
      name: 'Outsourcing & Spend',
      icon: Users,
      color: 'indigo',
      description: 'Track external counsel and costs',
      linkType: 'outsourcingRecords'
    }
  ];

  useEffect(() => {
    loadLinkedModules();
    loadAvailableLinks();
  }, [contract.id]);

  const loadLinkedModules = () => {
    // Mock data - in real implementation, fetch from API
    const mockLinkedModules: LinkedModule[] = [
      {
        id: 'entity-1',
        type: 'entity',
        name: 'TechCorp Holdings',
        description: 'Primary contracting entity',
        status: 'active',
        link: '/entity-management/entity-1',
        metadata: {
          type: 'corporation',
          jurisdiction: 'Delaware',
          employees: 500
        },
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'risk-1',
        type: 'risk',
        name: 'Payment Default Risk',
        description: 'Risk of counterparty payment default',
        status: 'medium',
        link: '/risks/risk-1',
        metadata: {
          severity: 'medium',
          probability: 0.3,
          impact: 'financial'
        },
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'policy-1',
        type: 'policy',
        name: 'Contract Approval Policy',
        description: 'Standard contract approval procedures',
        status: 'active',
        link: '/policies/policy-1',
        metadata: {
          version: '2.1',
          lastUpdated: new Date(),
          approvalRequired: true
        },
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      }
    ];

    setLinkedModules(mockLinkedModules);
  };

  const loadAvailableLinks = () => {
    // Mock available items for linking
    const mockAvailable = {
      entities: [
        { id: 'ent-2', name: 'Global Services LLC', type: 'subsidiary' },
        { id: 'ent-3', name: 'Innovation Partners', type: 'joint_venture' }
      ],
      disputes: [
        { id: 'disp-1', name: 'Contract Breach - Client XYZ', status: 'active' },
        { id: 'disp-2', name: 'IP Infringement Claim', status: 'settled' }
      ],
      matters: [
        { id: 'mat-1', name: 'M&A Due Diligence - TechCorp', status: 'in_progress' },
        { id: 'mat-2', name: 'Regulatory Compliance Review', status: 'completed' }
      ],
      risks: [
        { id: 'risk-2', name: 'Intellectual Property Risk', severity: 'high' },
        { id: 'risk-3', name: 'Regulatory Compliance Risk', severity: 'low' }
      ],
      policies: [
        { id: 'pol-2', name: 'Data Privacy Policy', version: '3.0' },
        { id: 'pol-3', name: 'Vendor Management Policy', version: '1.5' }
      ],
      outsourcingRecords: [
        { id: 'out-1', name: 'External Legal Counsel - Johnson & Associates', spend: 125000 },
        { id: 'out-2', name: 'Contract Review Services - Legal Corp', spend: 45000 }
      ]
    };

    setAvailableLinks(mockAvailable);
  };

  const getModuleInfo = (type: string) => {
    return moduleTypes.find(m => m.id === type) || moduleTypes[0];
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      red: 'bg-red-100 text-red-800 border-red-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const handleCreateLink = (moduleType: string, itemId: string) => {
    const moduleInfo = getModuleInfo(moduleType);
    const availableItems = availableLinks[moduleInfo.linkType] || [];
    const item = availableItems.find(i => i.id === itemId);

    if (item) {
      const newLink: LinkedModule = {
        id: `${moduleType}-${itemId}`,
        type: moduleType as any,
        name: item.name,
        description: `Linked ${moduleInfo.name.toLowerCase()} record`,
        status: item.status || 'active',
        link: `/${moduleType}-management/${itemId}`,
        metadata: item,
        createdAt: new Date()
      };

      setLinkedModules(prev => [...prev, newLink]);
      
      // Update contract linked records
      const updatedLinkedRecords = {
        ...contract.linkedRecords,
        [moduleInfo.linkType]: [
          ...(contract.linkedRecords[moduleInfo.linkType as keyof typeof contract.linkedRecords] || []),
          itemId
        ]
      };
      
      onIntegrationUpdate(updatedLinkedRecords);
    }

    setShowLinkModal(false);
  };

  const removeLink = (linkId: string) => {
    setLinkedModules(prev => prev.filter(link => link.id !== linkId));
    
    // Update contract linked records by removing the reference
    // This would need more sophisticated logic to identify which array to update
    // For now, just trigger the update callback
    onIntegrationUpdate(contract.linkedRecords);
  };

  const groupedModules = moduleTypes.reduce((acc, moduleType) => {
    acc[moduleType.id] = linkedModules.filter(link => link.type === moduleType.id);
    return acc;
  }, {} as Record<string, LinkedModule[]>);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Module Integration</h2>
          <p className="text-gray-600">Connect this contract with related records across modules</p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setShowLinkModal(true)}
        >
          Add Connection
        </Button>
      </div>

      {/* Integration Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Connections</p>
              <p className="text-2xl font-bold text-gray-900">{linkedModules.length}</p>
            </div>
            <LinkIcon className="w-8 h-8 text-blue-500" />
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Across {Object.keys(groupedModules).filter(key => groupedModules[key].length > 0).length} modules
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Risk Connections</p>
              <p className="text-2xl font-bold text-gray-900">{groupedModules.risk?.length || 0}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-500" />
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Active risk monitoring
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Entity Links</p>
              <p className="text-2xl font-bold text-gray-900">{groupedModules.entity?.length || 0}</p>
            </div>
            <Building className="w-8 h-8 text-green-500" />
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Connected entities
          </div>
        </Card>
      </div>

      {/* Module Sections */}
      <div className="space-y-6">
        {moduleTypes.map((moduleType) => {
          const Icon = moduleType.icon;
          const connections = groupedModules[moduleType.id] || [];
          
          return (
            <Card key={moduleType.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-${moduleType.color}-100`}>
                    <Icon className={`w-5 h-5 text-${moduleType.color}-600`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{moduleType.name}</h3>
                    <p className="text-sm text-gray-600">{moduleType.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" size="sm">
                    {connections.length} connected
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedModuleType(moduleType.id);
                      setShowLinkModal(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Link
                  </Button>
                </div>
              </div>

              {connections.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {connections.map((connection) => (
                    <motion.div
                      key={connection.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{connection.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{connection.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge className={getColorClasses(moduleType.color)} size="sm">
                              {connection.status}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {connection.createdAt.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 ml-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(connection.link, '_blank')}
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(connection.link, '_blank')}
                            title="Open in Module"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLink(connection.id)}
                            className="text-red-600 hover:text-red-700"
                            title="Remove Link"
                          >
                            ×
                          </Button>
                        </div>
                      </div>

                      {/* Connection Metadata */}
                      {connection.metadata && Object.keys(connection.metadata).length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {Object.entries(connection.metadata).slice(0, 4).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-gray-500 capitalize">{key}:</span>
                                <span className="font-medium text-gray-700">
                                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                  <Icon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-3">No connections to {moduleType.name.toLowerCase()}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedModuleType(moduleType.id);
                      setShowLinkModal(true);
                    }}
                  >
                    Create First Connection
                  </Button>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="justify-start h-auto p-4"
            onClick={() => window.open('/entity-management', '_blank')}
          >
            <div className="flex items-center space-x-3">
              <Building className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <p className="font-medium">View Entities</p>
                <p className="text-xs text-gray-600">Manage related entities</p>
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="justify-start h-auto p-4"
            onClick={() => window.open('/risks', '_blank')}
          >
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <div className="text-left">
                <p className="font-medium">Risk Dashboard</p>
                <p className="text-xs text-gray-600">Monitor contract risks</p>
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="justify-start h-auto p-4"
            onClick={() => window.open('/disputes', '_blank')}
          >
            <div className="flex items-center space-x-3">
              <Scale className="w-5 h-5 text-red-600" />
              <div className="text-left">
                <p className="font-medium">Dispute Tracker</p>
                <p className="text-xs text-gray-600">Track related disputes</p>
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="justify-start h-auto p-4"
            onClick={() => window.open('/outsourcing', '_blank')}
          >
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-purple-600" />
              <div className="text-left">
                <p className="font-medium">External Counsel</p>
                <p className="text-xs text-gray-600">Manage legal spend</p>
              </div>
            </div>
          </Button>
        </div>
      </Card>

      {/* Link Creation Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Create Module Connection</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLinkModal(false)}
                >
                  ×
                </Button>
              </div>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {selectedModuleType ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      {React.createElement(getModuleInfo(selectedModuleType).icon, {
                        className: 'w-5 h-5 text-primary-600'
                      })}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {getModuleInfo(selectedModuleType).name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Select items to link with this contract
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {(availableLinks[getModuleInfo(selectedModuleType).linkType] || []).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
                      >
                        <div>
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            {Object.entries(item).slice(1, 3).map(([key, value]) => (
                              <span key={key} className="text-xs text-gray-500">
                                {key}: {String(value)}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleCreateLink(selectedModuleType, item.id)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Link
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {moduleTypes.map((moduleType) => {
                    const Icon = moduleType.icon;
                    return (
                      <button
                        key={moduleType.id}
                        onClick={() => setSelectedModuleType(moduleType.id)}
                        className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-left"
                      >
                        <div className={`p-2 rounded-lg bg-${moduleType.color}-100`}>
                          <Icon className={`w-5 h-5 text-${moduleType.color}-600`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{moduleType.name}</h3>
                          <p className="text-sm text-gray-600">{moduleType.description}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (selectedModuleType) {
                      setSelectedModuleType('');
                    } else {
                      setShowLinkModal(false);
                    }
                  }}
                >
                  {selectedModuleType ? 'Back' : 'Cancel'}
                </Button>
                {!selectedModuleType && (
                  <Button variant="primary" disabled>
                    Select a module to continue
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ContractModuleIntegration;