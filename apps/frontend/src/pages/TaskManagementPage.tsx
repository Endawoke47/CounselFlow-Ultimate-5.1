import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Plus, CheckCircle, Calendar, User } from '../components/icons';

const TaskManagementPage: React.FC = () => {
  const mockTasks = [
    {
      id: '1',
      title: 'Review TechCorp Contract Terms',
      priority: 'high',
      dueDate: '2024-02-15',
      assignedTo: 'Sarah Chen',
      status: 'in_progress',
      matter: 'TechCorp Acquisition'
    },
    {
      id: '2',
      title: 'Update Privacy Policy for GDPR',
      priority: 'medium', 
      dueDate: '2024-02-20',
      assignedTo: 'Legal Team',
      status: 'pending',
      matter: 'Compliance Review'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
          <p className="text-gray-600 mt-1">Track and manage legal team tasks and deadlines</p>
        </div>
        <Button variant="primary" icon={Plus}>Create Task</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Open Tasks</p>
              <p className="text-2xl font-bold text-gray-900">18</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Due This Week</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>
            <Calendar className="w-8 h-8 text-orange-500" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">32</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Team Members</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <User className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>
      
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Tasks</h3>
          <div className="space-y-4">
            {mockTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{task.title}</h4>
                  <p className="text-sm text-gray-600">{task.matter} • Due {task.dueDate}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={task.priority === 'high' ? 'destructive' : 'warning'}>
                    {task.priority}
                  </Badge>
                  <Badge variant={task.status === 'in_progress' ? 'info' : 'secondary'}>
                    {task.status.replace('_', ' ')}
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

export default TaskManagementPage;