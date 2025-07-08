import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../../modules/users/entities/user.entity';
import { Matter } from '../../modules/matters/entities/matter.entity';
import { Contract } from '../../modules/contracts/entities/contract.entity';

export async function seedDatabase(dataSource: DataSource) {
  console.log('🌱 Starting database seeding...');

  const userRepository = dataSource.getRepository(User);
  const matterRepository = dataSource.getRepository(Matter);
  const contractRepository = dataSource.getRepository(Contract);

  // Clear existing data
  await contractRepository.delete({});
  await matterRepository.delete({});
  await userRepository.delete({});

  // Create demo users
  const hashedPassword = await bcrypt.hash('demo123', 12);
  
  const users = await userRepository.save([
    {
      email: 'admin@counselflow.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Admin',
      title: 'Managing Partner',
      firm: 'CounselFlow Legal Group',
      role: 'admin',
      barNumber: 'CA123456',
      jurisdiction: 'California',
      bio: 'Experienced managing partner with 20+ years in corporate law',
      phone: '+1-555-0101',
    },
    {
      email: 'sarah.partner@counselflow.com',
      password: hashedPassword,
      firstName: 'Sarah',
      lastName: 'Johnson',
      title: 'Senior Partner',
      firm: 'CounselFlow Legal Group',
      role: 'partner',
      barNumber: 'CA234567',
      jurisdiction: 'California',
      bio: 'Specializes in IP law and technology contracts',
      phone: '+1-555-0102',
    },
    {
      email: 'mike.associate@counselflow.com',
      password: hashedPassword,
      firstName: 'Michael',
      lastName: 'Chen',
      title: 'Senior Associate',
      firm: 'CounselFlow Legal Group',
      role: 'associate',
      barNumber: 'CA345678',
      jurisdiction: 'California',
      bio: 'Corporate law specialist focusing on M&A transactions',
      phone: '+1-555-0103',
    },
    {
      email: 'lisa.associate@counselflow.com',
      password: hashedPassword,
      firstName: 'Lisa',
      lastName: 'Rodriguez',
      title: 'Associate',
      firm: 'CounselFlow Legal Group',
      role: 'associate',
      barNumber: 'CA456789',
      jurisdiction: 'California',
      bio: 'Employment law and compliance expert',
      phone: '+1-555-0104',
    },
    {
      email: 'demo.client@techcorp.com',
      password: hashedPassword,
      firstName: 'Robert',
      lastName: 'Wilson',
      title: 'General Counsel',
      firm: 'TechCorp Industries',
      role: 'client',
      jurisdiction: 'California',
      bio: 'In-house counsel for technology company',
      phone: '+1-555-0105',
    },
  ]);

  console.log('✅ Created demo users');

  // Create demo matters
  const matterData = [
    {
      title: 'TechCorp Acquisition of StartupAI',
      description: 'Complete acquisition transaction including due diligence, contract negotiation, and regulatory approval',
      clientName: 'TechCorp Industries',
      clientId: users[4].id,
      type: 'corporate',
      status: 'active',
      priority: 'high',
      estimatedValue: 25000000,
      billableHours: 450,
      hourlyRate: 650,
      dueDate: new Date('2024-03-15'),
      tags: ['M&A', 'Technology', 'Due Diligence'],
      assignedLawyerId: users[0].id,
      customFields: {
        dealValue: '$25M',
        jurisdiction: 'Delaware',
        expectedClosing: '2024-03-15'
      }
    },
    {
      title: 'Global Services Employment Class Action Defense',
      description: 'Defending against wage and hour class action lawsuit filed by former employees',
      clientName: 'Global Services LLC',
      type: 'litigation',
      status: 'active',
      priority: 'critical',
      estimatedValue: 750000,
      billableHours: 280,
      hourlyRate: 750,
      dueDate: new Date('2024-02-28'),
      tags: ['Employment', 'Class Action', 'Defense'],
      assignedLawyerId: users[3].id,
      customFields: {
        courtJurisdiction: 'Federal District Court',
        plaintiffCount: '450+',
        caseNumber: 'CV-2023-12345'
      }
    },
    {
      title: 'Innovation Labs Patent Portfolio Development',
      description: 'Comprehensive IP strategy including patent filing, trademark registration, and trade secret protection',
      clientName: 'Innovation Labs',
      type: 'intellectual_property',
      status: 'active',
      priority: 'high',
      estimatedValue: 125000,
      billableHours: 95,
      hourlyRate: 550,
      dueDate: new Date('2024-04-30'),
      tags: ['Patents', 'Trademarks', 'IP Strategy'],
      assignedLawyerId: users[1].id,
      customFields: {
        patentApplications: '12',
        trademarkFilings: '8',
        jurisdictions: 'US, EU, APAC'
      }
    },
    {
      title: 'Metro Holdings Real Estate Transaction',
      description: 'Commercial real estate acquisition of downtown office complex',
      clientName: 'Metro Holdings',
      type: 'real_estate',
      status: 'pending',
      priority: 'medium',
      estimatedValue: 1500000,
      billableHours: 120,
      hourlyRate: 500,
      dueDate: new Date('2024-05-15'),
      tags: ['Real Estate', 'Commercial', 'Acquisition'],
      assignedLawyerId: users[2].id,
      customFields: {
        propertyValue: '$15M',
        location: 'Downtown San Francisco',
        propertyType: 'Office Complex'
      }
    },
    {
      title: 'Sterling Enterprises Contract Dispute Resolution',
      description: 'Mediation and potential litigation regarding breach of software licensing agreement',
      clientName: 'Sterling Enterprises',
      type: 'litigation',
      status: 'on_hold',
      priority: 'medium',
      estimatedValue: 300000,
      billableHours: 65,
      hourlyRate: 600,
      dueDate: new Date('2024-06-01'),
      tags: ['Contract Dispute', 'Software', 'Mediation'],
      assignedLawyerId: users[2].id,
      customFields: {
        disputeAmount: '$300K',
        mediationDate: '2024-02-15',
        contractType: 'Software License'
      }
    }
  ];

  const matters = [];
  for (const matterItem of matterData) {
    const matter = matterRepository.create({
      ...matterItem,
      tags: Array.isArray(matterItem.tags) ? matterItem.tags.join(',') : matterItem.tags,
      customFields: typeof matterItem.customFields === 'object' ? JSON.stringify(matterItem.customFields) : matterItem.customFields
    });
    matters.push(await matterRepository.save(matter));
  }

  console.log('✅ Created demo matters');

  // Create demo contracts
  const contractData = [
    {
      title: 'TechCorp - StartupAI Acquisition Agreement',
      description: 'Stock purchase agreement for acquisition of StartupAI by TechCorp Industries',
      type: 'partnership',
      status: 'negotiation',
      priority: 'critical',
      value: 25000000,
      effectiveDate: new Date('2024-03-15'),
      expirationDate: new Date('2024-12-31'),
      autoRenewal: false,
      terms: 'Complete acquisition of StartupAI including all IP, employees, and assets. Payment structure: $20M cash, $5M earnout over 2 years.',
      parties: [
        { name: 'TechCorp Industries', role: 'Buyer', jurisdiction: 'Delaware' },
        { name: 'StartupAI Inc.', role: 'Seller', jurisdiction: 'Delaware' }
      ],
      keyTerms: {
        purchasePrice: '$25,000,000',
        paymentStructure: 'Cash + Earnout',
        closingDate: '2024-03-15',
        representations: 'Standard tech acquisition reps',
        indemnification: '18-month survival period'
      },
      riskAssessment: {
        overallRisk: 'Medium',
        keyRisks: ['IP ownership disputes', 'Employee retention', 'Technology integration'],
        mitigationStrategy: 'Comprehensive due diligence and strong indemnification provisions'
      },
      tags: ['M&A', 'Technology', 'High Value'],
      assignedLawyerId: users[0].id,
      matterId: matters[0].id
    },
    {
      title: 'Innovation Labs Software License Agreement',
      description: 'Enterprise software licensing agreement with comprehensive IP protection',
      type: 'licensing',
      status: 'executed',
      priority: 'high',
      value: 500000,
      effectiveDate: new Date('2024-01-01'),
      expirationDate: new Date('2026-12-31'),
      renewalDate: new Date('2026-10-01'),
      autoRenewal: true,
      renewalNoticeDays: 90,
      terms: 'Exclusive licensing of AI technology platform with revenue sharing model',
      parties: [
        { name: 'Innovation Labs', role: 'Licensor', jurisdiction: 'California' },
        { name: 'Enterprise Solutions Corp', role: 'Licensee', jurisdiction: 'New York' }
      ],
      keyTerms: {
        licenseScope: 'Exclusive North American rights',
        royaltyRate: '12% of net revenue',
        minimumGuarantee: '$100K annually',
        territory: 'North America',
        termination: 'Material breach with 30-day cure'
      },
      riskAssessment: {
        overallRisk: 'Low',
        keyRisks: ['Revenue performance', 'IP infringement claims'],
        mitigationStrategy: 'Strong performance milestones and comprehensive IP warranties'
      },
      tags: ['IP Licensing', 'Software', 'Revenue Share'],
      assignedLawyerId: users[1].id,
      matterId: matters[2].id
    },
    {
      title: 'Global Services Employment Agreement Template',
      description: 'Standardized employment agreement for senior executives',
      type: 'employment',
      status: 'executed',
      priority: 'medium',
      value: 0,
      effectiveDate: new Date('2024-01-01'),
      terms: 'Executive employment agreement with standard compensation, benefits, and restrictive covenants',
      parties: [
        { name: 'Global Services LLC', role: 'Employer', jurisdiction: 'California' },
        { name: 'Executive Employee', role: 'Employee', jurisdiction: 'California' }
      ],
      keyTerms: {
        baseSalary: 'Market competitive',
        bonus: 'Performance-based up to 50% of base',
        equity: 'Stock options per equity plan',
        nonCompete: '12 months post-termination',
        confidentiality: 'Perpetual with standard exceptions'
      },
      riskAssessment: {
        overallRisk: 'Low',
        keyRisks: ['Non-compete enforcement', 'Trade secret protection'],
        mitigationStrategy: 'Carefully crafted restrictive covenants and regular policy updates'
      },
      tags: ['Employment', 'Executive', 'Template'],
      assignedLawyerId: users[3].id
    },
    {
      title: 'Metro Holdings Office Lease Agreement',
      description: 'Commercial office space lease for headquarters expansion',
      type: 'real_estate',
      status: 'review',
      priority: 'medium',
      value: 2400000,
      effectiveDate: new Date('2024-06-01'),
      expirationDate: new Date('2029-05-31'),
      renewalDate: new Date('2029-02-01'),
      autoRenewal: false,
      renewalNoticeDays: 120,
      terms: '5-year lease with option to renew for additional 5 years. Annual rent escalation of 3%.',
      parties: [
        { name: 'Metro Holdings', role: 'Tenant', jurisdiction: 'California' },
        { name: 'Downtown Properties LLC', role: 'Landlord', jurisdiction: 'California' }
      ],
      keyTerms: {
        monthlyRent: '$40,000',
        securityDeposit: '$120,000',
        usePeriod: 'General office use',
        improvements: 'Tenant responsible for build-out',
        utilities: 'Tenant pays all utilities'
      },
      riskAssessment: {
        overallRisk: 'Medium',
        keyRisks: ['Market rent fluctuation', 'Early termination costs', 'Build-out delays'],
        mitigationStrategy: 'Market rent review clause and construction milestone tracking'
      },
      tags: ['Real Estate', 'Commercial Lease', 'Headquarters'],
      assignedLawyerId: users[2].id,
      matterId: matters[3].id
    },
    {
      title: 'Sterling Enterprises Vendor Services Agreement',
      description: 'IT services agreement with performance guarantees and SLA requirements',
      type: 'service',
      status: 'draft',
      priority: 'low',
      value: 150000,
      effectiveDate: new Date('2024-04-01'),
      expirationDate: new Date('2025-03-31'),
      autoRenewal: true,
      renewalNoticeDays: 60,
      terms: 'Comprehensive IT support services with 99.5% uptime guarantee and 4-hour response SLA',
      parties: [
        { name: 'Sterling Enterprises', role: 'Client', jurisdiction: 'California' },
        { name: 'TechSupport Solutions', role: 'Vendor', jurisdiction: 'Texas' }
      ],
      keyTerms: {
        serviceLevel: '99.5% uptime guarantee',
        responseTime: '4 hours for critical issues',
        monthlyFee: '$12,500',
        penaltyClause: '5% credit for SLA breaches',
        termination: '30-day notice for convenience'
      },
      riskAssessment: {
        overallRisk: 'Low',
        keyRisks: ['Service quality degradation', 'Vendor financial stability'],
        mitigationStrategy: 'Regular performance reviews and financial health monitoring'
      },
      tags: ['IT Services', 'SLA', 'Vendor Management'],
      assignedLawyerId: users[2].id,
      matterId: matters[4].id
    }
  ];

  const contracts = [];
  for (const contractItem of contractData) {
    const contract = contractRepository.create({
      ...contractItem,
      parties: Array.isArray(contractItem.parties) ? contractItem.parties.join(',') : contractItem.parties,
      tags: Array.isArray(contractItem.tags) ? contractItem.tags.join(',') : contractItem.tags,
      keyTerms: typeof contractItem.keyTerms === 'object' ? JSON.stringify(contractItem.keyTerms) : contractItem.keyTerms,
      riskAssessment: typeof contractItem.riskAssessment === 'object' ? JSON.stringify(contractItem.riskAssessment) : contractItem.riskAssessment
    });
    contracts.push(await contractRepository.save(contract));
  }

  console.log('✅ Created demo contracts');
  console.log('🎉 Database seeding completed successfully!');
  console.log('📊 Demo data summary:');
  console.log(`   - Users: ${users.length}`);
  console.log(`   - Matters: ${matters.length}`);
  console.log(`   - Contracts: ${contracts.length}`);
  console.log('\n🔐 Demo login credentials:');
  console.log('   Email: admin@counselflow.com');
  console.log('   Password: demo123');
}