import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Plus, AlertTriangle, TrendingUp, Shield } from '../components/icons';

const RiskManagementPage: React.FC = () => {
  const mockRisks = [
    {
      id: '1',
      title: 'Data Protection Compliance Gap',
      severity: 'high',
      type: 'regulatory',
      entity: 'TechCorp EU',
      status: 'open',
      dueDate: '2024-03-15'
    },
    {
      id: '2', 
      title: 'Contract Renewal Risk - Major Client',
      severity: 'medium',
      type: 'commercial',
      entity: 'TechCorp Holdings',
      status: 'mitigated',
      dueDate: '2024-04-01'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Risk Management</h1>
          <p className="text-gray-600 mt-1">Comprehensive risk registry across all entities</p>
        </div>
        <Button variant="primary" icon={Plus}>Log New Risk</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Risks</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High/Critical</p>
              <p className="text-2xl font-bold text-gray-900">6</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-500" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Mitigated</p>
              <p className="text-2xl font-bold text-gray-900">18</p>
            </div>
            <Shield className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Risk Trend</p>
              <p className="text-2xl font-bold text-gray-900">↓ 15%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>
      
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Active Risks</h3>
          <div className="space-y-4">
            {mockRisks.map((risk) => (
              <div key={risk.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{risk.title}</h4>
                  <p className="text-sm text-gray-600">{risk.entity} • {risk.type}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={risk.severity === 'high' ? 'destructive' : 'warning'}>
                    {risk.severity}
                  </Badge>
                  <Badge variant={risk.status === 'mitigated' ? 'success' : 'secondary'}>
                    {risk.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RiskManagementPage;