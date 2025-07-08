import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Plus, Users, TrendingUp, DollarSign } from '../components/icons';

const OutsourcingPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Outsourcing & Legal Spend</h1>
          <p className="text-gray-600 mt-1">Manage external counsel and track legal spend performance</p>
        </div>
        <Button variant="primary" icon={Plus}>Add Provider</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Spend (YTD)</p>
              <p className="text-2xl font-bold text-gray-900">$2.4M</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Providers</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Provider Rating</p>
              <p className="text-2xl font-bold text-gray-900">4.2</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Budget Adherence</p>
              <p className="text-2xl font-bold text-gray-900">87%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-500" />
          </div>
        </Card>
      </div>
      
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">External Providers</h3>
          <p className="text-gray-500">Provider management interface will be implemented here</p>
        </div>
      </Card>
    </div>
  );
};

export default OutsourcingPage;