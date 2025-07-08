import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Bell, AlertTriangle, Clock, Calendar as CalendarIcon, Users, FileText, Gavel, Building, Phone, Video, MapPin, Filter, Search } from 'lucide-react';
import { Card, Button, Badge } from '../components/ui/UIComponents';

// Import existing data from other modules
const mockMatters = [
  {
    id: '5da33d7b-e9a5-4de3-8919-92cbffacb059',
    title: 'Synergize Vertical Supply-Chains',
    client: 'Supply Chain Dynamics LLC',
    type: 'Litigation',
    status: 'active',
    priority: 'low',
    assignedLawyer: 'John Smith',
    createdAt: '2023-08-15',
    dueDate: '2024-12-15',
    estimatedValue: 980000,
    description: 'Complex litigation involving vertical supply chain integration and antitrust considerations.',
    hoursLogged: 245,
    tags: ['Litigation', 'Supply Chain', 'Antitrust'],
    lastActivity: '2024-01-20'
  },
  {
    id: '35b66297-498c-4af0-b686-a525d7e91763',
    title: 'Expedite Killer Initiatives',
    client: 'Innovation Partners Corp',
    type: 'Advisory',
    status: 'active',
    priority: 'high',
    assignedLawyer: 'Sarah Johnson',
    createdAt: '2023-09-01',
    dueDate: '2024-06-30',
    estimatedValue: 180000,
    description: 'Strategic advisory services for high-impact business initiatives and market expansion.',
    hoursLogged: 89,
    tags: ['Advisory', 'Strategy', 'Market Expansion'],
    lastActivity: '2024-01-18'
  },
  {
    id: 'a3e24549-d2ff-487a-b130-a6643025452e',
    title: 'Disintermediate Proactive Paradigms',
    client: 'Technology Solutions Inc',
    type: 'Transactional',
    status: 'active',
    priority: 'medium',
    assignedLawyer: 'Michael Brown',
    createdAt: '2023-10-10',
    dueDate: '2024-08-01',
    estimatedValue: 440000,
    description: 'Transactional work involving technology transfer and paradigm shift implementation.',
    hoursLogged: 156,
    tags: ['Transactional', 'Technology', 'Paradigm'],
    lastActivity: '2024-01-19'
  },
  {
    id: 'b1d4c2e9-920f-45c5-9040-e564b2eb56fa',
    title: 'Redefine Granular Architectures',
    client: 'Enterprise Systems Ltd',
    type: 'Litigation',
    status: 'active',
    priority: 'medium',
    assignedLawyer: 'Emily Davis',
    createdAt: '2023-07-01',
    dueDate: '2024-05-15',
    estimatedValue: 900000,
    description: 'Litigation involving complex system architectures and intellectual property disputes.',
    hoursLogged: 198,
    tags: ['Litigation', 'Architecture', 'IP'],
    lastActivity: '2024-01-15'
  },
  {
    id: '617d4b33-a1b7-4d48-963f-b49bae32c2ab',
    title: 'Grow Wireless Channels',
    client: 'Wireless Communications Corp',
    type: 'Transactional',
    status: 'active',
    priority: 'low',
    assignedLawyer: 'Robert Wilson',
    createdAt: '2023-06-05',
    dueDate: '2024-04-30',
    estimatedValue: 710000,
    description: 'Transactional matters related to wireless channel expansion and regulatory compliance.',
    hoursLogged: 123,
    tags: ['Transactional', 'Wireless', 'Regulatory'],
    lastActivity: '2024-01-16'
  }
];

const mockContracts = [
  {
    id: '9b0a0667-6343-4c06-bd26-7154311d4720',
    title: 'Whiteboard Compelling Architectures',
    client: 'Brown-Braun',
    type: 'Employment',
    status: 'expired',
    value: 952530.93,
    startDate: '2023-10-12',
    endDate: '2026-03-19',
    lastModified: '2024-01-15',
    description: 'Comprehensive employment agreement with intellectual property and non-compete clauses',
    priority: 'high',
    tags: ['Employment', 'IP', 'Non-Compete']
  },
  {
    id: '66f06d14-27bd-41b3-8ca6-d8c1b5ceea98',
    title: 'Leverage Impactful Models',
    client: 'Moore-Gomez',
    type: 'Employment',
    status: 'draft',
    value: 605863.88,
    startDate: '2023-07-17',
    endDate: '2026-03-29',
    lastModified: '2024-01-10',
    description: 'Employment contract for senior management position with equity participation',
    priority: 'medium',
    tags: ['Employment', 'Senior', 'Equity']
  },
  {
    id: 'bc8acc54-7287-4bb1-b8a7-178153ae297f',
    title: 'Generate Integrated Synergies',
    client: 'Sanders-Nguyen',
    type: 'Employment',
    status: 'expired',
    value: 867663.51,
    startDate: '2024-06-22',
    endDate: '2026-02-27',
    lastModified: '2024-06-25',
    description: 'Executive employment agreement with performance-based compensation',
    priority: 'high',
    tags: ['Executive', 'Performance', 'Compensation']
  },
  {
    id: 'ba8ef08f-8502-45c3-916d-7e0193f68f10',
    title: 'Whiteboard Viral Relationships',
    client: 'Dean, Mcgee and Torres',
    type: 'SOW',
    status: 'draft',
    value: 565513.2,
    startDate: '2023-08-04',
    endDate: '2026-03-24',
    lastModified: '2023-08-15',
    description: 'Statement of Work for strategic consulting and business development services',
    priority: 'high',
    tags: ['SOW', 'Consulting', 'Strategy']
  }
];

const mockClients = [
  {
    id: '1',
    name: 'John Smith',
    company: 'TechCorp Industries',
    email: 'john.smith@techcorp.com',
    phone: '+1 (555) 123-4567',
    address: '123 Tech Street, Silicon Valley, CA 94105',
    type: 'business',
    status: 'active',
    createdAt: '2023-01-15',
    lastContact: '2024-01-10',
    totalMatters: 8,
    totalValue: 450000,
    industry: 'Technology',
    primaryContact: 'John Smith - CEO',
    tags: ['Fortune 500', 'Tech', 'Long-term']
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    company: 'Global Services LLC',
    email: 'sarah.j@globalservices.com',
    phone: '+1 (555) 234-5678',
    address: '456 Business Ave, New York, NY 10001',
    type: 'business',
    status: 'active',
    createdAt: '2023-03-20',
    lastContact: '2024-01-08',
    totalMatters: 3,
    totalValue: 125000,
    industry: 'Consulting',
    primaryContact: 'Sarah Johnson - Founder',
    tags: ['SMB', 'Consulting', 'Regular']
  },
  {
    id: '3',
    name: 'Michael Brown',
    company: '',
    email: 'michael.brown@email.com',
    phone: '+1 (555) 345-6789',
    address: '789 Residential St, Austin, TX 73301',
    type: 'individual',
    status: 'active',
    createdAt: '2023-06-10',
    lastContact: '2024-01-05',
    totalMatters: 2,
    totalValue: 35000,
    industry: 'Individual',
    primaryContact: 'Michael Brown',
    tags: ['Personal', 'Real Estate']
  },
  {
    id: '4',
    name: 'Emily Davis',
    company: 'InnovaTech Solutions',
    email: 'emily.davis@innovatech.com',
    phone: '+1 (555) 456-7890',
    address: '321 Innovation Dr, Seattle, WA 98101',
    type: 'business',
    status: 'prospect',
    createdAt: '2024-01-01',
    lastContact: '2024-01-12',
    totalMatters: 0,
    totalValue: 0,
    industry: 'Software',
    primaryContact: 'Emily Davis - CTO',
    tags: ['Prospect', 'Software', 'AI']
  }
];

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: 'court' | 'client-meeting' | 'deposition' | 'deadline' | 'internal' | 'mediation';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  client?: string;
  matter?: string;
  location?: string;
  meetingType?: 'in-person' | 'video' | 'phone';
  description?: string;
  attendees?: string[];
  reminder?: number; // minutes before
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  
  // New event form state
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    type: 'client-meeting' as CalendarEvent['type'],
    riskLevel: 'medium' as CalendarEvent['riskLevel'],
    client: '',
    matter: '',
    location: '',
    meetingType: 'in-person' as CalendarEvent['meetingType'],
    description: '',
    attendees: '',
    reminder: 60
  });

  // Generate comprehensive calendar events from existing data
  const generateEventsFromData = (): CalendarEvent[] => {
    const events: CalendarEvent[] = [];
    let eventId = 1;

    // Helper function to generate random date within a month
    const getRandomDateInMonth = (year: number, month: number) => {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const randomDay = Math.floor(Math.random() * daysInMonth) + 1;
      return new Date(year, month, randomDay);
    };

    // Helper function to get random time
    const getRandomTime = () => {
      const hours = Math.floor(Math.random() * 9) + 9; // 9 AM to 5 PM
      const minutes = ['00', '15', '30', '45'][Math.floor(Math.random() * 4)];
      return `${hours.toString().padStart(2, '0')}:${minutes}`;
    };

    // Helper function to get end time (1-4 hours later)
    const getEndTime = (startTime: string) => {
      const [hours, minutes] = startTime.split(':').map(Number);
      const duration = Math.floor(Math.random() * 4) + 1; // 1-4 hours
      const endHours = Math.min(hours + duration, 18); // Don't go past 6 PM
      return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    // Generate events for July 2025 - December 2026
    const months = [
      { year: 2025, month: 6 }, // July 2025
      { year: 2025, month: 7 }, // August 2025
      { year: 2025, month: 8 }, // September 2025
      { year: 2025, month: 9 }, // October 2025
      { year: 2025, month: 10 }, // November 2025
      { year: 2025, month: 11 }, // December 2025
      { year: 2026, month: 0 }, // January 2026
      { year: 2026, month: 1 }, // February 2026
      { year: 2026, month: 2 }, // March 2026
      { year: 2026, month: 3 }, // April 2026
      { year: 2026, month: 4 }, // May 2026
      { year: 2026, month: 5 }, // June 2026
      { year: 2026, month: 6 }, // July 2026
      { year: 2026, month: 7 }, // August 2026
      { year: 2026, month: 8 }, // September 2026
      { year: 2026, month: 9 }, // October 2026
      { year: 2026, month: 10 }, // November 2026
      { year: 2026, month: 11 }, // December 2026
    ];

    months.forEach(({ year, month }) => {
      const eventsThisMonth: CalendarEvent[] = [];
      
      // Generate 5-8 events per month
      const eventCount = Math.floor(Math.random() * 4) + 5;
      
      for (let i = 0; i < eventCount; i++) {
        const eventDate = getRandomDateInMonth(year, month);
        const startTime = getRandomTime();
        const endTime = getEndTime(startTime);
        
        // Select random data sources
        const matterIndex = Math.floor(Math.random() * mockMatters.length);
        const contractIndex = Math.floor(Math.random() * mockContracts.length);
        const clientIndex = Math.floor(Math.random() * mockClients.length);
        
        const matter = mockMatters[matterIndex];
        const contract = mockContracts[contractIndex];
        const client = mockClients[clientIndex];
        
        // Determine event type and details based on data
        let eventType: CalendarEvent['type'];
        let riskLevel: CalendarEvent['riskLevel'];
        let title: string;
        let description: string;
        let eventClient: string;
        let matterName: string;
        
        // Mix of event types based on matter/contract data
        const eventTypes = ['court', 'client-meeting', 'deposition', 'deadline', 'internal', 'mediation'];
        const randomEventType = eventTypes[Math.floor(Math.random() * eventTypes.length)] as CalendarEvent['type'];
        
        eventType = randomEventType;
        
        // Set risk level based on priority from matters/contracts
        if (matter.priority === 'critical' || contract.priority === 'high') {
          riskLevel = 'critical';
        } else if (matter.priority === 'high' || contract.priority === 'high') {
          riskLevel = 'high';
        } else if (matter.priority === 'medium' || contract.priority === 'medium') {
          riskLevel = 'medium';
        } else {
          riskLevel = 'low';
        }
        
        // Generate event details based on type
        switch (eventType) {
          case 'court':
            title = `${matter.title} - Court Hearing`;
            description = `Court proceedings for ${matter.description}`;
            eventClient = matter.client;
            matterName = matter.title;
            break;
          case 'deadline':
            title = `${contract.title} - Contract Deadline`;
            description = `${contract.description}`;
            eventClient = contract.client;
            matterName = contract.title;
            break;
          case 'client-meeting':
            title = `Strategy Meeting - ${client.company || client.name}`;
            description = `Client meeting to discuss ongoing matters and strategic planning`;
            eventClient = client.company || client.name;
            matterName = `${client.industry} Advisory`;
            break;
          case 'deposition':
            title = `${matter.title} - Deposition`;
            description = `Witness deposition for ${matter.description}`;
            eventClient = matter.client;
            matterName = matter.title;
            break;
          case 'mediation':
            title = `${matter.title} - Mediation Session`;
            description = `Mediation proceedings for ${matter.description}`;
            eventClient = matter.client;
            matterName = matter.title;
            break;
          default: // internal
            title = `${matter.title} - Case Review`;
            description = `Internal team meeting to review case progress`;
            eventClient = matter.client;
            matterName = matter.title;
        }
        
        const newEvent: CalendarEvent = {
          id: `generated-${eventId++}`,
          title: title.length > 50 ? title.substring(0, 47) + '...' : title,
          date: eventDate,
          startTime,
          endTime,
          type: eventType,
          riskLevel,
          client: eventClient,
          matter: matterName,
          location: eventType === 'court' ? 'Federal District Court' : 
                   eventType === 'deposition' ? 'Law Office Conference Room' :
                   eventType === 'mediation' ? 'Mediation Center' :
                   eventType === 'client-meeting' ? 'Client Offices' : 'Law Office',
          meetingType: Math.random() > 0.6 ? 'video' : Math.random() > 0.3 ? 'in-person' : 'phone',
          description,
          attendees: [
            matter.assignedLawyer || 'John Doe',
            eventType === 'client-meeting' ? client.primaryContact : 'Legal Team',
            eventType === 'court' ? 'Court Officials' : 'Support Staff'
          ],
          reminder: riskLevel === 'critical' ? 1440 : riskLevel === 'high' ? 240 : 60,
          status: 'scheduled'
        };
        
        eventsThisMonth.push(newEvent);
      }
      
      events.push(...eventsThisMonth);
    });

    // Add some current month (July 2025) events for immediate visibility
    const currentMonthEvents: CalendarEvent[] = [
      {
        id: 'current-1',
        title: 'Supply Chain Dynamics - Court Hearing',
        date: new Date(2025, 6, 10), // July 10, 2025
        startTime: '09:00',
        endTime: '11:30',
        type: 'court',
        riskLevel: 'critical',
        client: 'Supply Chain Dynamics LLC',
        matter: 'Synergize Vertical Supply-Chains',
        location: 'Federal District Court, Room 203',
        meetingType: 'in-person',
        description: 'Complex litigation involving vertical supply chain integration and antitrust considerations.',
        attendees: ['John Smith', 'Legal Team', 'Expert Witness'],
        reminder: 120,
        status: 'scheduled'
      },
      {
        id: 'current-2',
        title: 'TechCorp Industries - Strategy Meeting',
        date: new Date(2025, 6, 11), // July 11, 2025
        startTime: '14:00',
        endTime: '16:00',
        type: 'client-meeting',
        riskLevel: 'high',
        client: 'TechCorp Industries',
        matter: 'Technology Expansion',
        location: 'Client Offices - Silicon Valley',
        meetingType: 'in-person',
        description: 'High-value client meeting to discuss technology expansion and patent portfolio strategy.',
        attendees: ['John Smith - CEO', 'Sarah Johnson', 'Legal Team'],
        reminder: 60,
        status: 'scheduled'
      },
      {
        id: 'current-3',
        title: 'Innovation Partners - Contract Deadline',
        date: new Date(2025, 6, 15), // July 15, 2025
        startTime: '17:00',
        endTime: '17:00',
        type: 'deadline',
        riskLevel: 'critical',
        client: 'Innovation Partners Corp',
        matter: 'Expedite Killer Initiatives',
        description: 'Critical deadline for strategic advisory services agreement finalization.',
        reminder: 1440,
        status: 'scheduled'
      },
      {
        id: 'current-4',
        title: 'Brown-Braun - Employment Contract Review',
        date: new Date(2025, 6, 18), // July 18, 2025
        startTime: '10:30',
        endTime: '12:00',
        type: 'client-meeting',
        riskLevel: 'medium',
        client: 'Brown-Braun',
        matter: 'Whiteboard Compelling Architectures',
        location: 'Law Office Conference Room A',
        meetingType: 'video',
        description: 'Review employment agreement with intellectual property and non-compete clauses.',
        attendees: ['Legal Team', 'HR Representative'],
        reminder: 30,
        status: 'scheduled'
      },
      {
        id: 'current-5',
        title: 'Enterprise Systems - IP Deposition',
        date: new Date(2025, 6, 22), // July 22, 2025
        startTime: '09:00',
        endTime: '15:00',
        type: 'deposition',
        riskLevel: 'high',
        client: 'Enterprise Systems Ltd',
        matter: 'Redefine Granular Architectures',
        location: 'Opposing Counsel Offices',
        meetingType: 'in-person',
        description: 'Key witness deposition involving complex system architectures and intellectual property disputes.',
        attendees: ['Emily Davis', 'Court Reporter', 'Technical Expert'],
        reminder: 90,
        status: 'scheduled'
      },
      {
        id: 'current-6',
        title: 'Global Services LLC - Mediation Session',
        date: new Date(2025, 6, 25), // July 25, 2025
        startTime: '13:00',
        endTime: '17:00',
        type: 'mediation',
        riskLevel: 'medium',
        client: 'Global Services LLC',
        matter: 'Consulting Agreement Dispute',
        location: 'Downtown Mediation Center',
        meetingType: 'in-person',
        description: 'Mediation session to resolve consulting agreement terms and compensation dispute.',
        attendees: ['Sarah Johnson - Founder', 'Mediator', 'Legal Team'],
        reminder: 60,
        status: 'scheduled'
      },
      {
        id: 'current-7',
        title: 'Moore-Gomez - Contract Finalization',
        date: new Date(2025, 6, 28), // July 28, 2025
        startTime: '11:00',
        endTime: '13:00',
        type: 'deadline',
        riskLevel: 'high',
        client: 'Moore-Gomez',
        matter: 'Leverage Impactful Models',
        description: 'Final deadline for employment contract with senior management equity participation.',
        reminder: 240,
        status: 'scheduled'
      },
      {
        id: 'current-8',
        title: 'InnovaTech Solutions - New Client Intake',
        date: new Date(2025, 6, 30), // July 30, 2025
        startTime: '15:00',
        endTime: '16:30',
        type: 'client-meeting',
        riskLevel: 'low',
        client: 'InnovaTech Solutions',
        matter: 'Initial Legal Assessment',
        location: 'Law Office Conference Room B',
        meetingType: 'video',
        description: 'New client intake meeting for software company seeking legal advisory services.',
        attendees: ['Emily Davis - CTO', 'Legal Team'],
        reminder: 30,
        status: 'scheduled'
      }
    ];

    events.unshift(...currentMonthEvents);

    return events;
  };

  // Demo calendar events with realistic legal data - now generated from actual data
  const [events, setEvents] = useState<CalendarEvent[]>(() => generateEventsFromData());

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString() &&
      (filterRisk === 'all' || event.riskLevel === filterRisk) &&
      (filterType === 'all' || event.type === filterType)
    ).sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  // Get upcoming notifications (next 7 days)
  const getUpcomingNotifications = () => {
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return events.filter(event => 
      event.date >= now && event.date <= weekFromNow && event.status === 'scheduled'
    ).sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  // Color coding based on event type and risk level
  const getEventColor = (event: CalendarEvent) => {
    const baseColors = {
      court: 'bg-red-500',
      deadline: 'bg-orange-500',
      'client-meeting': 'bg-blue-500',
      deposition: 'bg-purple-500',
      mediation: 'bg-green-500',
      internal: 'bg-gray-500'
    };

    const riskIntensity = {
      low: 'bg-opacity-60',
      medium: 'bg-opacity-75',
      high: 'bg-opacity-90',
      critical: 'bg-opacity-100 ring-2 ring-red-300'
    };

    return `${baseColors[event.type]} ${riskIntensity[event.riskLevel]}`;
  };

  const getRiskBadgeVariant = (riskLevel: string) => {
    const variants = {
      low: 'success' as const,
      medium: 'warning' as const,
      high: 'danger' as const,
      critical: 'danger' as const
    };
    return variants[riskLevel as keyof typeof variants] || variants.low;
  };

  const getRiskBadgeColor = (riskLevel: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[riskLevel as keyof typeof colors] || colors.low;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      court: <Gavel className="w-4 h-4" />,
      deadline: <Clock className="w-4 h-4" />,
      'client-meeting': <Users className="w-4 h-4" />,
      deposition: <FileText className="w-4 h-4" />,
      mediation: <Building className="w-4 h-4" />,
      internal: <CalendarIcon className="w-4 h-4" />
    };
    return icons[type as keyof typeof icons] || icons.internal;
  };

  const getMeetingTypeIcon = (meetingType?: string) => {
    switch (meetingType) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'in-person': return <MapPin className="w-4 h-4" />;
      default: return <CalendarIcon className="w-4 h-4" />;
    }
  };

  // Generate calendar grid
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayWeekday = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const calendarDays = [];

    // Previous month days
    for (let i = 0; i < firstDayWeekday; i++) {
      const prevDate = new Date(year, month, -firstDayWeekday + i + 1);
      calendarDays.push({ date: prevDate, isCurrentMonth: false });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      calendarDays.push({ date, isCurrentMonth: true });
    }

    // Next month days
    const remainingDays = 42 - calendarDays.length; // 6 rows × 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      calendarDays.push({ date: nextDate, isCurrentMonth: false });
    }

    return calendarDays;
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  // Handle new event form submission
  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.startTime || !newEvent.endTime) {
      alert('Please fill in all required fields');
      return;
    }

    const eventDate = new Date(newEvent.date);
    const attendeesArray = newEvent.attendees ? newEvent.attendees.split(',').map(a => a.trim()) : [];

    const createdEvent: CalendarEvent = {
      id: `new-${Date.now()}`,
      title: newEvent.title,
      date: eventDate,
      startTime: newEvent.startTime,
      endTime: newEvent.endTime,
      type: newEvent.type,
      riskLevel: newEvent.riskLevel,
      client: newEvent.client || undefined,
      matter: newEvent.matter || undefined,
      location: newEvent.location || undefined,
      meetingType: newEvent.meetingType,
      description: newEvent.description || undefined,
      attendees: attendeesArray.length > 0 ? attendeesArray : undefined,
      reminder: newEvent.reminder,
      status: 'scheduled'
    };

    setEvents(prev => [...prev, createdEvent]);
    setShowNewEventModal(false);
    resetNewEventForm();
  };

  // Reset new event form
  const resetNewEventForm = () => {
    setNewEvent({
      title: '',
      date: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
      startTime: '',
      endTime: '',
      type: 'client-meeting',
      riskLevel: 'medium',
      client: '',
      matter: '',
      location: '',
      meetingType: 'in-person',
      description: '',
      attendees: '',
      reminder: 60
    });
  };

  // Open new event modal with selected date pre-filled
  const openNewEventModal = (date?: Date) => {
    resetNewEventForm();
    if (date) {
      setNewEvent(prev => ({
        ...prev,
        date: date.toISOString().split('T')[0]
      }));
    }
    setShowNewEventModal(true);
  };

  const calendarDays = generateCalendarDays();
  const upcomingNotifications = getUpcomingNotifications();
  const today = new Date();

  return (
    <div className="px-4 lg:px-6 bg-gradient-to-br from-teal-50 to-white min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-700 to-cyan-600 bg-clip-text text-transparent">Legal Calendar</h1>
            <p className="text-teal-600 mt-2 text-lg font-medium">
              Manage your legal schedule and deadlines • 
              <span className="font-semibold text-teal-700"> {events.length} events</span> from 
            <span className="font-medium text-primary"> {mockMatters.length} active matters</span> and 
            <span className="font-medium text-primary"> {mockContracts.length} contracts</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => setSelectedDate(today)}
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            Today
          </Button>
          <Button variant="secondary" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button 
            variant="primary"
            onClick={() => openNewEventModal()}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Event
          </Button>
        </div>
      </div>

      {/* Notifications Bar */}
      {upcomingNotifications.length > 0 && (
        <Card className="border-l-4 border-l-red-500 bg-red-50">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-red-600 mt-1" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-red-900">Upcoming Deadlines & Events</h3>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => {
                    const nextEvent = upcomingNotifications[0];
                    setSelectedDate(nextEvent.date);
                  }}
                >
                  View All
                </Button>
              </div>
              <div className="mt-2 space-y-1">
                {upcomingNotifications.slice(0, 3).map(event => (
                  <div 
                    key={event.id} 
                    className="flex items-center gap-2 text-sm text-red-800 hover:bg-red-100 p-2 rounded cursor-pointer"
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowEventModal(true);
                    }}
                  >
                    {getTypeIcon(event.type)}
                    <span className="flex-1">{event.title}</span>
                    <span className="text-red-600">
                      {event.date.toLocaleDateString()} at {formatTime(event.startTime)}
                    </span>
                    <Badge variant={getRiskBadgeVariant(event.riskLevel)}>
                      {event.riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                ))}
                {upcomingNotifications.length > 3 && (
                  <p className="text-sm text-red-600 font-medium">
                    +{upcomingNotifications.length - 3} more upcoming events
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Calendar */}
        <div className="lg:col-span-3">
          <Card>
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-xl font-semibold">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h2>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1"
                >
                  <option value="all">All Types</option>
                  <option value="court">Court</option>
                  <option value="client-meeting">Client Meetings</option>
                  <option value="deadline">Deadlines</option>
                  <option value="deposition">Depositions</option>
                  <option value="mediation">Mediation</option>
                  <option value="internal">Internal</option>
                </select>
                <select
                  value={filterRisk}
                  onChange={(e) => setFilterRisk(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1"
                >
                  <option value="all">All Risk Levels</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-6">
              {/* Week Days Header */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center font-medium text-gray-600 text-sm">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                  const dayEvents = getEventsForDate(day.date);
                  const isToday = day.date.toDateString() === today.toDateString();
                  const isSelected = selectedDate?.toDateString() === day.date.toDateString();

                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedDate(day.date)}
                      onDoubleClick={() => openNewEventModal(day.date)}
                      className={`
                        min-h-[120px] p-2 border border-gray-200 cursor-pointer transition-colors
                        ${!day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'hover:bg-gray-50'}
                        ${isToday ? 'bg-blue-50 border-blue-300' : ''}
                        ${isSelected ? 'bg-blue-100 border-blue-400' : ''}
                      `}
                      title={day.isCurrentMonth ? 'Click to select, double-click to create event' : ''}
                    >
                      <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : ''}`}>
                        {day.date.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 3).map(event => (
                          <div
                            key={event.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(event);
                              setShowEventModal(true);
                            }}
                            className={`
                              text-xs p-1 rounded text-white cursor-pointer truncate
                              ${getEventColor(event)}
                            `}
                            title={`${event.title} - ${formatTime(event.startTime)}`}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-gray-500 font-medium">
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Events */}
          <Card>
            <div className="p-4 border-b">
              <h3 className="font-semibold">Today's Schedule</h3>
              <p className="text-sm text-gray-600">{today.toLocaleDateString()}</p>
            </div>
            <div className="p-4">
              {getEventsForDate(today).length > 0 ? (
                <div className="space-y-3">
                  {getEventsForDate(today).map(event => (
                    <div
                      key={event.id}
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowEventModal(true);
                      }}
                      className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(event.type)}
                          <span className="font-medium text-sm">{event.title}</span>
                        </div>
                        <Badge variant={getRiskBadgeVariant(event.riskLevel)}>
                          {event.riskLevel}
                        </Badge>
                      </div>
                      <div className="mt-1 text-xs text-gray-600">
                        {formatTime(event.startTime)} - {formatTime(event.endTime)}
                      </div>
                      {event.client && (
                        <div className="mt-1 text-xs text-gray-500">
                          {event.client}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No events scheduled for today</p>
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <div className="p-4 border-b">
              <h3 className="font-semibold">Quick Actions</h3>
            </div>
            <div className="p-4 space-y-2">
              <button
                onClick={() => {
                  setNewEvent(prev => ({ ...prev, type: 'client-meeting', riskLevel: 'medium' }));
                  openNewEventModal();
                }}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Schedule Client Meeting</span>
                </div>
              </button>
              <button
                onClick={() => {
                  setNewEvent(prev => ({ ...prev, type: 'court', riskLevel: 'high' }));
                  openNewEventModal();
                }}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-red-50 hover:border-red-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Gavel className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium">Add Court Date</span>
                </div>
              </button>
              <button
                onClick={() => {
                  setNewEvent(prev => ({ ...prev, type: 'deadline', riskLevel: 'critical' }));
                  openNewEventModal();
                }}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-orange-50 hover:border-orange-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium">Set Deadline</span>
                </div>
              </button>
            </div>
          </Card>

          {/* Legend */}
          <Card>
            <div className="p-4 border-b">
              <h3 className="font-semibold">Event Types</h3>
            </div>
            <div className="p-4 space-y-3">
              {[
                { type: 'court', label: 'Court Hearings', color: 'bg-red-500' },
                { type: 'deadline', label: 'Deadlines', color: 'bg-orange-500' },
                { type: 'client-meeting', label: 'Client Meetings', color: 'bg-blue-500' },
                { type: 'deposition', label: 'Depositions', color: 'bg-purple-500' },
                { type: 'mediation', label: 'Mediation', color: 'bg-green-500' },
                { type: 'internal', label: 'Internal', color: 'bg-gray-500' }
              ].map(({ type, label, color }) => (
                <div key={type} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded ${color}`}></div>
                  <span className="text-sm">{label}</span>
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <h4 className="font-medium text-sm mb-2">Risk Levels</h4>
              <div className="space-y-2">
                {[
                  { level: 'critical', label: 'Critical', variant: 'danger' as const },
                  { level: 'high', label: 'High', variant: 'danger' as const },
                  { level: 'medium', label: 'Medium', variant: 'warning' as const },
                  { level: 'low', label: 'Low', variant: 'success' as const }
                ].map(({ level, label, variant }) => (
                  <div key={level} className="flex items-center gap-2">
                    <Badge variant={variant}>{label}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Event Detail Modal */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedEvent.title}</h2>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge variant={getRiskBadgeVariant(selectedEvent.riskLevel)}>
                      {selectedEvent.riskLevel.toUpperCase()} RISK
                    </Badge>
                    <span className="text-sm text-gray-600 capitalize">{selectedEvent.type.replace('-', ' ')}</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Date & Time</h4>
                  <div className="text-sm text-gray-600">
                    <p>{selectedEvent.date.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                    <p>{formatTime(selectedEvent.startTime)} - {formatTime(selectedEvent.endTime)}</p>
                  </div>
                </div>
                
                {selectedEvent.client && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Client</h4>
                    <p className="text-sm text-gray-600">{selectedEvent.client}</p>
                  </div>
                )}
                
                {selectedEvent.matter && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Matter</h4>
                    <p className="text-sm text-gray-600">{selectedEvent.matter}</p>
                  </div>
                )}
                
                {selectedEvent.location && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {getMeetingTypeIcon(selectedEvent.meetingType)}
                      <span>{selectedEvent.location}</span>
                    </div>
                  </div>
                )}
              </div>
              
              {selectedEvent.description && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-sm text-gray-600">{selectedEvent.description}</p>
                </div>
              )}
              
              {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Attendees</h4>
                  <div className="text-sm text-gray-600">
                    {selectedEvent.attendees.map((attendee, index) => (
                      <span key={index}>
                        {attendee}
                        {index < selectedEvent.attendees!.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <Button variant="primary">Edit Event</Button>
                <Button variant="secondary">Duplicate</Button>
                <Button variant="secondary">Cancel Event</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Event Modal */}
      {showNewEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Create New Event</h2>
                <button
                  onClick={() => setShowNewEventModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter event title"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Time */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time *
                    </label>
                    <input
                      type="time"
                      value={newEvent.startTime}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, startTime: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Time *
                    </label>
                    <input
                      type="time"
                      value={newEvent.endTime}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, endTime: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Event Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Type
                  </label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value as CalendarEvent['type'] }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="client-meeting">Client Meeting</option>
                    <option value="court">Court Hearing</option>
                    <option value="deposition">Deposition</option>
                    <option value="deadline">Deadline</option>
                    <option value="mediation">Mediation</option>
                    <option value="internal">Internal Meeting</option>
                  </select>
                </div>

                {/* Risk Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Risk Level
                  </label>
                  <select
                    value={newEvent.riskLevel}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, riskLevel: e.target.value as CalendarEvent['riskLevel'] }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                {/* Client */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client
                  </label>
                  <input
                    type="text"
                    value={newEvent.client}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, client: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Client name"
                  />
                </div>

                {/* Matter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Matter
                  </label>
                  <input
                    type="text"
                    value={newEvent.matter}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, matter: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Matter description"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Event location"
                  />
                </div>

                {/* Meeting Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meeting Type
                  </label>
                  <select
                    value={newEvent.meetingType}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, meetingType: e.target.value as CalendarEvent['meetingType'] }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="in-person">In Person</option>
                    <option value="video">Video Call</option>
                    <option value="phone">Phone Call</option>
                  </select>
                </div>

                {/* Reminder */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reminder (minutes before)
                  </label>
                  <select
                    value={newEvent.reminder}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, reminder: parseInt(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={120}>2 hours</option>
                    <option value={240}>4 hours</option>
                    <option value={1440}>24 hours</option>
                  </select>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Event description"
                  />
                </div>

                {/* Attendees */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Attendees (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newEvent.attendees}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, attendees: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="John Doe, Jane Smith, Legal Team"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  variant="primary"
                  onClick={handleCreateEvent}
                >
                  Create Event
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => setShowNewEventModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default CalendarPage;
