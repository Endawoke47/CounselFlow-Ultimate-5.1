import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Badge } from '../ui/Badge';
import { Select } from '../ui/Select';
import { 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Sparkles, 
  Brain, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  User,
  Building
} from '../icons';
import { ContractType, ContractDraftingSession } from '../../types/contracts';
import { Entity } from '../../types/entity';

interface ContractDraftingWizardProps {
  onClose: () => void;
  onComplete: (session: ContractDraftingSession) => void;
  entities: Entity[];
  className?: string;
}

interface WizardStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
}

const CONTRACT_TYPES: { value: ContractType; label: string; description: string }[] = [
  { value: 'nda', label: 'Non-Disclosure Agreement', description: 'Protect confidential information' },
  { value: 'service_agreement', label: 'Service Agreement', description: 'Define service terms and conditions' },
  { value: 'employment', label: 'Employment Contract', description: 'Employment terms and conditions' },
  { value: 'purchase', label: 'Purchase Agreement', description: 'Goods purchase terms' },
  { value: 'supply', label: 'Supply Agreement', description: 'Supply chain agreements' },
  { value: 'lease', label: 'Lease Agreement', description: 'Property lease terms' },
  { value: 'partnership', label: 'Partnership Agreement', description: 'Business partnership terms' },
  { value: 'joint_venture', label: 'Joint Venture', description: 'Joint business venture' },
  { value: 'licensing', label: 'Licensing Agreement', description: 'Intellectual property licensing' },
  { value: 'consulting', label: 'Consulting Agreement', description: 'Professional consulting services' },
  { value: 'master_services', label: 'Master Services Agreement', description: 'Framework for multiple services' },
  { value: 'sow', label: 'Statement of Work', description: 'Specific work deliverables' },
  { value: 'other', label: 'Other', description: 'Custom contract type' }
];

const RISK_TOLERANCE: { value: string; label: string; description: string }[] = [
  { value: 'conservative', label: 'Conservative', description: 'Minimize risk, favor protection' },
  { value: 'moderate', label: 'Moderate', description: 'Balanced approach to risk' },
  { value: 'aggressive', label: 'Aggressive', description: 'Accept higher risk for better terms' }
];

const ContractDraftingWizard: React.FC<ContractDraftingWizardProps> = ({
  onClose,
  onComplete,
  entities,
  className = ''
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [session, setSession] = useState<Partial<ContractDraftingSession>>({
    id: `draft_${Date.now()}`,
    status: 'initializing',
    currentStep: 0,
    totalSteps: 5,
    requirements: {
      contractType: 'service_agreement',
      businessObjective: '',
      parties: {
        internal: '',
        counterparty: {
          name: '',
          type: 'company'
        }
      },
      keyTerms: [],
      constraints: {
        riskTolerance: 'moderate'
      }
    },
    aiDrafting: {
      prompt: '',
      iterations: [],
      currentIteration: 0,
      confidence: 0
    },
    humanReview: {
      reviewers: [],
      feedback: [],
      approvalStatus: 'pending'
    }
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [newKeyTerm, setNewKeyTerm] = useState({ term: '', value: '', importance: 'important' as const });

  const steps: WizardStep[] = [
    {
      id: 'contract_type',
      title: 'Contract Type',
      description: 'Select the type of contract you want to create',
      component: ContractTypeStep
    },
    {
      id: 'parties',
      title: 'Parties',
      description: 'Define the parties involved in the contract',
      component: PartiesStep
    },
    {
      id: 'key_terms',
      title: 'Key Terms',
      description: 'Specify the key terms and conditions',
      component: KeyTermsStep
    },
    {
      id: 'constraints',
      title: 'Constraints',
      description: 'Set budget, timeline, and risk preferences',
      component: ConstraintsStep
    },
    {
      id: 'ai_generation',
      title: 'AI Generation',
      description: 'AI will generate your contract based on the requirements',
      component: AIGenerationStep
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setSession(prev => ({ ...prev, currentStep: currentStep + 1 }));
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setSession(prev => ({ ...prev, currentStep: currentStep - 1 }));
    }
  };

  const handleGenerateContract = async () => {
    setIsProcessing(true);
    setSession(prev => ({ ...prev, status: 'ai_drafting' }));

    try {
      // Simulate AI contract generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const generatedContent = `
        [Contract Draft Generated by AI]
        
        ${session.requirements?.contractType?.toUpperCase().replace('_', ' ')} AGREEMENT
        
        This agreement is entered into on [DATE] between ${session.requirements?.parties?.internal} ("Company") and ${session.requirements?.parties?.counterparty?.name} ("${session.requirements?.parties?.counterparty?.type === 'company' ? 'Vendor' : 'Individual'}").
        
        Business Objective: ${session.requirements?.businessObjective}
        
        Key Terms:
        ${session.requirements?.keyTerms?.map(term => `- ${term.term}: ${term.value}`).join('\n')}
        
        [Additional contract content would be generated here based on the selected template and AI processing...]
      `;

      setSession(prev => ({
        ...prev,
        status: 'human_review',
        aiDrafting: {
          ...prev.aiDrafting!,
          generatedContent,
          confidence: 85,
          iterations: [
            {
              version: 1,
              content: generatedContent,
              timestamp: new Date()
            }
          ],
          currentIteration: 1
        }
      }));

    } catch (error) {
      console.error('Contract generation failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleComplete = () => {
    const completedSession: ContractDraftingSession = {
      ...session,
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'current_user' // Replace with actual user ID
    } as ContractDraftingSession;

    onComplete(completedSession);
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">AI Contract Drafting</h2>
                <p className="text-primary-100 text-sm">Create contracts with AI assistance</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              ×
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {steps[currentStep].title}
            </h3>
            <p className="text-gray-600 text-sm">
              {steps[currentStep].description}
            </p>
          </div>

          <CurrentStepComponent
            session={session}
            setSession={setSession}
            entities={entities}
            newKeyTerm={newKeyTerm}
            setNewKeyTerm={setNewKeyTerm}
            isProcessing={isProcessing}
            onGenerate={handleGenerateContract}
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              icon={ChevronLeft}
            >
              Previous
            </Button>
            
            <div className="flex space-x-3">
              {currentStep === steps.length - 1 ? (
                <Button
                  variant="primary"
                  onClick={handleComplete}
                  disabled={!session.aiDrafting?.generatedContent}
                  icon={CheckCircle}
                >
                  Complete Contract
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleNext}
                  disabled={!isStepValid(currentStep, session)}
                  icon={ChevronRight}
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Step Components
const ContractTypeStep: React.FC<any> = ({ session, setSession }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CONTRACT_TYPES.map((type) => (
          <motion.div
            key={type.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSession((prev: any) => ({
              ...prev,
              requirements: { ...prev.requirements, contractType: type.value }
            }))}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
              session.requirements?.contractType === type.value
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">{type.label}</h4>
              {session.requirements?.contractType === type.value && (
                <CheckCircle className="w-5 h-5 text-primary-600" />
              )}
            </div>
            <p className="text-sm text-gray-600">{type.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const PartiesStep: React.FC<any> = ({ session, setSession, entities }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Building className="w-5 h-5 text-primary-600" />
            <h4 className="font-semibold text-gray-900">Internal Entity</h4>
          </div>
          <Select
            value={session.requirements?.parties?.internal || ''}
            onChange={(value) => setSession((prev: any) => ({
              ...prev,
              requirements: {
                ...prev.requirements,
                parties: {
                  ...prev.requirements.parties,
                  internal: value
                }
              }
            }))}
            placeholder="Select internal entity"
          >
            {entities.map((entity) => (
              <option key={entity.id} value={entity.id}>
                {entity.name} ({entity.legalName})
              </option>
            ))}
          </Select>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2 mb-4">
            <User className="w-5 h-5 text-primary-600" />
            <h4 className="font-semibold text-gray-900">Counterparty</h4>
          </div>
          <div className="space-y-3">
            <Input
              placeholder="Counterparty name"
              value={session.requirements?.parties?.counterparty?.name || ''}
              onChange={(e) => setSession((prev: any) => ({
                ...prev,
                requirements: {
                  ...prev.requirements,
                  parties: {
                    ...prev.requirements.parties,
                    counterparty: {
                      ...prev.requirements.parties.counterparty,
                      name: e.target.value
                    }
                  }
                }
              }))}
            />
            <Select
              value={session.requirements?.parties?.counterparty?.type || 'company'}
              onChange={(value) => setSession((prev: any) => ({
                ...prev,
                requirements: {
                  ...prev.requirements,
                  parties: {
                    ...prev.requirements.parties,
                    counterparty: {
                      ...prev.requirements.parties.counterparty,
                      type: value
                    }
                  }
                }
              }))}
            >
              <option value="company">Company</option>
              <option value="individual">Individual</option>
              <option value="government">Government</option>
            </Select>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <FileText className="w-5 h-5 text-primary-600" />
          <h4 className="font-semibold text-gray-900">Business Objective</h4>
        </div>
        <Textarea
          placeholder="Describe the business objective and purpose of this contract..."
          value={session.requirements?.businessObjective || ''}
          onChange={(e) => setSession((prev: any) => ({
            ...prev,
            requirements: {
              ...prev.requirements,
              businessObjective: e.target.value
            }
          }))}
          rows={4}
        />
      </Card>
    </div>
  );
};

const KeyTermsStep: React.FC<any> = ({ session, setSession, newKeyTerm, setNewKeyTerm }) => {
  const addKeyTerm = () => {
    if (newKeyTerm.term && newKeyTerm.value) {
      setSession((prev: any) => ({
        ...prev,
        requirements: {
          ...prev.requirements,
          keyTerms: [...(prev.requirements.keyTerms || []), { ...newKeyTerm }]
        }
      }));
      setNewKeyTerm({ term: '', value: '', importance: 'important' });
    }
  };

  const removeKeyTerm = (index: number) => {
    setSession((prev: any) => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        keyTerms: prev.requirements.keyTerms.filter((_: any, i: number) => i !== index)
      }
    }));
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h4 className="font-semibold text-gray-900 mb-4">Add Key Terms</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Input
            placeholder="Term name"
            value={newKeyTerm.term}
            onChange={(e) => setNewKeyTerm(prev => ({ ...prev, term: e.target.value }))}
          />
          <Input
            placeholder="Value/Description"
            value={newKeyTerm.value}
            onChange={(e) => setNewKeyTerm(prev => ({ ...prev, value: e.target.value }))}
          />
          <div className="flex space-x-2">
            <Select
              value={newKeyTerm.importance}
              onChange={(value) => setNewKeyTerm(prev => ({ ...prev, importance: value as any }))}
            >
              <option value="nice_to_have">Nice to have</option>
              <option value="important">Important</option>
              <option value="critical">Critical</option>
            </Select>
            <Button onClick={addKeyTerm} variant="primary" size="sm">
              Add
            </Button>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900">Current Key Terms</h4>
        {session.requirements?.keyTerms?.length > 0 ? (
          <div className="space-y-2">
            {session.requirements.keyTerms.map((term: any, index: number) => (
              <Card key={index} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{term.term}</span>
                      <Badge variant={
                        term.importance === 'critical' ? 'destructive' :
                        term.importance === 'important' ? 'warning' : 'secondary'
                      }>
                        {term.importance}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{term.value}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeKeyTerm(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No key terms added yet. Add terms that are important for your contract.</p>
        )}
      </div>
    </div>
  );
};

const ConstraintsStep: React.FC<any> = ({ session, setSession }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h4 className="font-semibold text-gray-900 mb-4">Budget Range</h4>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum</label>
                <Input
                  type="number"
                  placeholder="Min amount"
                  value={session.requirements?.constraints?.budgetRange?.min || ''}
                  onChange={(e) => setSession((prev: any) => ({
                    ...prev,
                    requirements: {
                      ...prev.requirements,
                      constraints: {
                        ...prev.requirements.constraints,
                        budgetRange: {
                          ...prev.requirements.constraints?.budgetRange,
                          min: parseFloat(e.target.value) || 0
                        }
                      }
                    }
                  }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maximum</label>
                <Input
                  type="number"
                  placeholder="Max amount"
                  value={session.requirements?.constraints?.budgetRange?.max || ''}
                  onChange={(e) => setSession((prev: any) => ({
                    ...prev,
                    requirements: {
                      ...prev.requirements,
                      constraints: {
                        ...prev.requirements.constraints,
                        budgetRange: {
                          ...prev.requirements.constraints?.budgetRange,
                          max: parseFloat(e.target.value) || 0
                        }
                      }
                    }
                  }))}
                />
              </div>
            </div>
            <Select
              value={session.requirements?.constraints?.budgetRange?.currency || 'USD'}
              onChange={(value) => setSession((prev: any) => ({
                ...prev,
                requirements: {
                  ...prev.requirements,
                  constraints: {
                    ...prev.requirements.constraints,
                    budgetRange: {
                      ...prev.requirements.constraints?.budgetRange,
                      currency: value
                    }
                  }
                }
              }))}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="CAD">CAD</option>
            </Select>
          </div>
        </Card>

        <Card className="p-4">
          <h4 className="font-semibold text-gray-900 mb-4">Timeline</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <Input
                type="date"
                value={session.requirements?.constraints?.timeline?.start ? 
                  new Date(session.requirements.constraints.timeline.start).toISOString().split('T')[0] : ''}
                onChange={(e) => setSession((prev: any) => ({
                  ...prev,
                  requirements: {
                    ...prev.requirements,
                    constraints: {
                      ...prev.requirements.constraints,
                      timeline: {
                        ...prev.requirements.constraints?.timeline,
                        start: e.target.value ? new Date(e.target.value) : undefined
                      }
                    }
                  }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <Input
                type="date"
                value={session.requirements?.constraints?.timeline?.end ? 
                  new Date(session.requirements.constraints.timeline.end).toISOString().split('T')[0] : ''}
                onChange={(e) => setSession((prev: any) => ({
                  ...prev,
                  requirements: {
                    ...prev.requirements,
                    constraints: {
                      ...prev.requirements.constraints,
                      timeline: {
                        ...prev.requirements.constraints?.timeline,
                        end: e.target.value ? new Date(e.target.value) : undefined
                      }
                    }
                  }
                }))}
              />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <h4 className="font-semibold text-gray-900 mb-4">Risk Tolerance</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {RISK_TOLERANCE.map((risk) => (
            <motion.div
              key={risk.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSession((prev: any) => ({
                ...prev,
                requirements: {
                  ...prev.requirements,
                  constraints: {
                    ...prev.requirements.constraints,
                    riskTolerance: risk.value
                  }
                }
              }))}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                session.requirements?.constraints?.riskTolerance === risk.value
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-gray-900">{risk.label}</h5>
                {session.requirements?.constraints?.riskTolerance === risk.value && (
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                )}
              </div>
              <p className="text-sm text-gray-600">{risk.description}</p>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};

const AIGenerationStep: React.FC<any> = ({ session, isProcessing, onGenerate }) => {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-primary-100 rounded-full">
              <Brain className="w-8 h-8 text-primary-600" />
            </div>
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">AI Contract Generation</h4>
          <p className="text-gray-600 mb-6">
            Our AI will analyze your requirements and generate a comprehensive contract draft
          </p>

          {!session.aiDrafting?.generatedContent && !isProcessing && (
            <Button
              variant="primary"
              onClick={onGenerate}
              icon={Sparkles}
              size="lg"
            >
              Generate Contract
            </Button>
          )}

          {isProcessing && (
            <div className="flex items-center justify-center space-x-2 text-primary-600">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
              <span>Generating contract...</span>
            </div>
          )}
        </div>
      </Card>

      {session.aiDrafting?.generatedContent && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Generated Contract</h4>
            <div className="flex items-center space-x-2">
              <Badge variant="success">
                {session.aiDrafting.confidence}% Confidence
              </Badge>
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">
                {session.aiDrafting.iterations?.[0]?.timestamp ? 
                  new Date(session.aiDrafting.iterations[0].timestamp).toLocaleString() : 
                  'Just now'}
              </span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-gray-700">
              {session.aiDrafting.generatedContent}
            </pre>
          </div>
        </Card>
      )}
    </div>
  );
};

// Helper function to validate step completion
const isStepValid = (step: number, session: any): boolean => {
  switch (step) {
    case 0: // Contract Type
      return !!session.requirements?.contractType;
    case 1: // Parties
      return !!(session.requirements?.parties?.internal && 
                session.requirements?.parties?.counterparty?.name &&
                session.requirements?.businessObjective);
    case 2: // Key Terms
      return true; // Optional step
    case 3: // Constraints
      return !!session.requirements?.constraints?.riskTolerance;
    case 4: // AI Generation
      return !!session.aiDrafting?.generatedContent;
    default:
      return false;
  }
};

export default ContractDraftingWizard;