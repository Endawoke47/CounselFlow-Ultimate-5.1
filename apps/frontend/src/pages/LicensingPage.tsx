import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Plus, Shield, Calendar, AlertTriangle } from '../components/icons';

const LicensingPage: React.FC = () => {
  const mockLicenses = [
    {
      id: '1',
      name: 'Business Operating License',
      entity: 'TechCorp Holdings',
      jurisdiction: 'Delaware, USA',
      status: 'active',
      expirationDate: '2024-12-31',
      renewalDue: '2024-11-01'
    },
    {
      id: '2',
      name: 'Data Protection Registration',
      entity: 'TechCorp EU',
      jurisdiction: 'Ireland',
      status: 'pending_renewal',
      expirationDate: '2024-03-15',
      renewalDue: '2024-02-15'
    }
  ];

  const mockRegulations = [
    {
      id: '1',
      title: 'EU AI Act Implementation',
      jurisdiction: 'European Union',
      effectiveDate: '2024-08-01',
      impact: 'high',
      status: 'monitoring'
    },
    {
      id: '2',
      title: 'Updated Data Localization Requirements',
      jurisdiction: 'Singapore',
      effectiveDate: '2024-06-01',
      impact: 'medium',
      status: 'compliant'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Licensing & Regulatory</h1>
          <p className="text-gray-600 mt-1">Track licenses and monitor regulatory changes</p>
        </div>
        <Button variant="primary" icon={Plus}>Add License</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Licenses</p>
              <p className="text-2xl font-bold text-gray-900">28</p>
            </div>
            <Shield className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
            <Calendar className="w-8 h-8 text-orange-500" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Compliance Issues</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Watchlist Items</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">License Portfolio</h3>
            <div className="space-y-4">
              {mockLicenses.map((license) => (
                <div key={license.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{license.name}</h4>
                    <p className="text-sm text-gray-600">{license.entity} • {license.jurisdiction}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={license.status === 'active' ? 'success' : 'warning'}>
                      {license.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Regulatory Watchlist</h3>
            <div className="space-y-4">
              {mockRegulations.map((regulation) => (
                <div key={regulation.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{regulation.title}</h4>
                    <p className="text-sm text-gray-600">{regulation.jurisdiction} • Effective {regulation.effectiveDate}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={regulation.impact === 'high' ? 'destructive' : 'warning'}>
                      {regulation.impact} impact
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LicensingPage;