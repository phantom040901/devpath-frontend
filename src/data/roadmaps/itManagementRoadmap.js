// src/data/roadmaps/itManagementRoadmap.js

const itManagementRoadmap = {
  id: 'it-management',
  title: 'IT Management & Business Analysis Career Path',
  description: 'Master project management, business analysis, solutions architecture, and IT leadership',
  category: 'IT Management',
  estimatedDuration: '18-22 weeks',
  skillsGained: [
    'Project Management',
    'Agile & Scrum',
    'Business Analysis',
    'Requirements Gathering',
    'Stakeholder Management',
    'IT Strategy',
    'Solutions Architecture',
    'Leadership & Communication',
    'Risk Management',
    'PMBOK & PMP Knowledge'
  ],
  
  modules: [
    {
      id: 1,
      title: 'Project Management Fundamentals',
      description: 'Learn project management principles, methodologies, and essential PM skills',
      duration: '5 weeks',
      difficulty: 'Beginner',
      
      learningResources: [
        {
          id: 1,
          title: 'Project Management Professional (PMP) Tutorial',
          type: 'video',
          platform: 'YouTube - Simplilearn',
          url: 'https://www.youtube.com/watch?v=vzqDTSZOTic',
          duration: '9 hours',
          description: 'Complete PMP certification prep covering PMBOK guide principles'
        },
        {
          id: 2,
          title: 'Introduction to Project Management',
          type: 'video',
          platform: 'YouTube - Google Career Certificates',
          url: 'https://www.youtube.com/watch?v=bw-NvGvLHtM',
          duration: '6 hours',
          description: 'Google Project Management Certificate program overview'
        },
        {
          id: 3,
          title: 'Project Management Basics',
          type: 'video',
          platform: 'YouTube - freeCodeCamp',
          url: 'https://www.youtube.com/watch?v=502ILHjX9EE',
          duration: '4 hours',
          description: 'Essential project management concepts and frameworks'
        },
        {
          id: 4,
          title: 'Microsoft Project Tutorial',
          type: 'video',
          platform: 'YouTube - Simon Sez IT',
          url: 'https://www.youtube.com/watch?v=gAhyHEWVXL4',
          duration: '5 hours',
          description: 'Learn Microsoft Project for planning and tracking projects'
        },
        {
          id: 5,
          title: 'PMBOK Guide Overview',
          type: 'article',
          platform: 'PMI.org',
          url: 'https://www.pmi.org/pmbok-guide-standards',
          duration: '3 hours read',
          description: 'Project Management Body of Knowledge fundamentals'
        },
        {
          id: 6,
          title: 'Project Planning and Scheduling',
          type: 'article',
          platform: 'Project Management Institute',
          url: 'https://www.projectmanagement.com/',
          duration: '2 hours read',
          description: 'Best practices for project planning and scheduling'
        }
      ],
      
      quiz: {
        passingScore: 70,
        questions: [
          {
            id: 1,
            question: 'What is a project?',
            options: [
              'Ongoing operations',
              'A temporary endeavor to create a unique product or service',
              'Daily tasks',
              'Business as usual'
            ],
            correctAnswer: 1,
            explanation: 'A project is a temporary endeavor with a defined beginning and end, undertaken to create a unique product, service, or result.'
          },
          {
            id: 2,
            question: 'What are the five process groups in project management?',
            options: [
              'Plan, Do, Check, Act, Review',
              'Initiating, Planning, Executing, Monitoring & Controlling, Closing',
              'Start, Build, Test, Deploy, End',
              'Design, Develop, Test, Release, Maintain'
            ],
            correctAnswer: 1,
            explanation: 'The five process groups are: Initiating, Planning, Executing, Monitoring & Controlling, and Closing.'
          },
          {
            id: 3,
            question: 'What is the triple constraint in project management?',
            options: [
              'Time, Cost, Scope',
              'Plan, Execute, Close',
              'Resources, Budget, Timeline',
              'People, Process, Technology'
            ],
            correctAnswer: 0,
            explanation: 'The triple constraint (iron triangle) consists of Scope, Time, and Cost - changes to one affect the others.'
          },
          {
            id: 4,
            question: 'What is a project charter?',
            options: [
              'A team contract',
              'Document that formally authorizes a project',
              'Project timeline',
              'Budget document'
            ],
            correctAnswer: 1,
            explanation: 'A project charter formally authorizes a project, defining objectives, scope, stakeholders, and giving the PM authority.'
          },
          {
            id: 5,
            question: 'What is a Work Breakdown Structure (WBS)?',
            options: [
              'A list of broken items',
              'Hierarchical decomposition of project deliverables',
              'Employee hierarchy',
              'Bug tracking system'
            ],
            correctAnswer: 1,
            explanation: 'WBS is a hierarchical decomposition of the total scope of work into manageable deliverables and work packages.'
          },
          {
            id: 6,
            question: 'What is the critical path in project scheduling?',
            options: [
              'The most important task',
              'The longest sequence of dependent tasks determining project duration',
              'The shortest route',
              'The most expensive path'
            ],
            correctAnswer: 1,
            explanation: 'The critical path is the longest sequence of dependent activities that determines the minimum project duration.'
          },
          {
            id: 7,
            question: 'What is a stakeholder?',
            options: [
              'Only the project sponsor',
              'Anyone affected by or who can affect the project',
              'Only team members',
              'Only customers'
            ],
            correctAnswer: 1,
            explanation: 'A stakeholder is any individual, group, or organization that may affect, be affected by, or perceive itself to be affected by the project.'
          },
          {
            id: 8,
            question: 'What is scope creep?',
            options: [
              'A sneaky person',
              'Uncontrolled expansion of project scope without adjustments',
              'Reduced project scope',
              'Schedule delays'
            ],
            correctAnswer: 1,
            explanation: 'Scope creep is the uncontrolled expansion of project scope without corresponding adjustments to time, cost, and resources.'
          },
          {
            id: 9,
            question: 'What is a Gantt chart?',
            options: [
              'An organization chart',
              'A bar chart showing project schedule and task dependencies',
              'A pie chart',
              'A financial report'
            ],
            correctAnswer: 1,
            explanation: 'A Gantt chart is a horizontal bar chart that illustrates the project schedule, showing tasks, durations, and dependencies.'
          },
          {
            id: 10,
            question: 'What is risk management in projects?',
            options: [
              'Avoiding all risks',
              'Identifying, analyzing, and responding to project risks',
              'Insurance only',
              'Ignoring problems'
            ],
            correctAnswer: 1,
            explanation: 'Risk management involves identifying, analyzing, and responding to project risks throughout the project lifecycle.'
          }
        ]
      },
      
      challenge: {
        title: 'Complete Project Plan Development',
        description: 'Create a comprehensive project management plan for a software implementation',
        requirements: [
          'Define project charter with objectives, scope, and success criteria',
          'Identify and analyze stakeholders with power/interest grid',
          'Create detailed Work Breakdown Structure (WBS) with 3+ levels',
          'Develop project schedule with Gantt chart (minimum 30 tasks)',
          'Identify task dependencies and critical path',
          'Create project budget with cost breakdown',
          'Develop risk register with 10+ risks, probability, impact, and mitigation',
          'Define communication plan for stakeholders',
          'Create resource allocation plan',
          'Develop quality management approach'
        ],
        submissionType: 'text',
        hints: [
          'Use Microsoft Project, ProjectLibre, or Excel for planning',
          'Be specific with task descriptions and deliverables',
          'Assign realistic durations based on complexity',
          'Include buffer time for high-risk activities',
          'Consider resource availability and constraints',
          'Use RACI matrix for responsibility assignment',
          'Document all assumptions and constraints',
          'Create visual representations (charts, diagrams)'
        ]
      }
    },
    
    {
      id: 2,
      title: 'Agile, Scrum & Modern Project Management',
      description: 'Master Agile methodologies, Scrum framework, and iterative project delivery',
      duration: '4-5 weeks',
      difficulty: 'Intermediate',
      
      learningResources: [
        {
          id: 1,
          title: 'Agile Project Management Tutorial',
          type: 'video',
          platform: 'YouTube - Simplilearn',
          url: 'https://www.youtube.com/watch?v=thsFsPnUHRA',
          duration: '4 hours',
          description: 'Complete guide to Agile project management principles'
        },
        {
          id: 2,
          title: 'Scrum Master Certification Training',
          type: 'video',
          platform: 'YouTube - Edureka',
          url: 'https://www.youtube.com/watch?v=9TycLR0TqFA',
          duration: '8 hours',
          description: 'Comprehensive Scrum framework and Scrum Master role training'
        },
        {
          id: 3,
          title: 'Kanban Tutorial',
          type: 'video',
          platform: 'YouTube - Kanbanize',
          url: 'https://www.youtube.com/watch?v=iVaFVa7HYj4',
          duration: '2 hours',
          description: 'Learn Kanban methodology and visual workflow management'
        },
        {
          id: 4,
          title: 'Jira Complete Tutorial',
          type: 'video',
          platform: 'YouTube - Automation Step by Step',
          url: 'https://www.youtube.com/watch?v=8jWKwiIcWPI',
          duration: '5 hours',
          description: 'Master Jira for Agile project management and tracking'
        },
        {
          id: 5,
          title: 'Agile Manifesto and Principles',
          type: 'article',
          platform: 'Agile Alliance',
          url: 'https://www.agilealliance.org/agile101/',
          duration: '2 hours read',
          description: 'Understanding Agile values and twelve principles'
        },
        {
          id: 6,
          title: 'User Story Writing',
          type: 'article',
          platform: 'Mountain Goat Software',
          url: 'https://www.mountaingoatsoftware.com/agile/user-stories',
          duration: '2 hours read',
          description: 'Best practices for writing effective user stories'
        }
      ],
      
      quiz: {
        passingScore: 75,
        questions: [
          {
            id: 1,
            question: 'What is Agile?',
            options: [
              'A programming language',
              'An iterative approach to project delivery emphasizing flexibility',
              'A project management tool',
              'A type of software'
            ],
            correctAnswer: 1,
            explanation: 'Agile is an iterative approach to project management and software development that emphasizes flexibility, collaboration, and customer feedback.'
          },
          {
            id: 2,
            question: 'What is a Sprint in Scrum?',
            options: [
              'Running fast',
              'A time-boxed iteration typically 1-4 weeks',
              'A meeting',
              'A document'
            ],
            correctAnswer: 1,
            explanation: 'A Sprint is a time-boxed iteration (usually 1-4 weeks) during which a potentially shippable product increment is created.'
          },
          {
            id: 3,
            question: 'What are the three roles in Scrum?',
            options: [
              'Manager, Developer, Tester',
              'Product Owner, Scrum Master, Development Team',
              'CEO, CTO, CFO',
              'Designer, Developer, QA'
            ],
            correctAnswer: 1,
            explanation: 'The three Scrum roles are: Product Owner (value maximization), Scrum Master (process facilitation), and Development Team (delivery).'
          },
          {
            id: 4,
            question: 'What is a user story?',
            options: [
              'A biography',
              'A short description of functionality from user perspective',
              'A test case',
              'A bug report'
            ],
            correctAnswer: 1,
            explanation: 'A user story is a short, simple description of a feature from the end-user perspective, typically following: "As a [role], I want [feature], so that [benefit]".'
          },
          {
            id: 5,
            question: 'What is the purpose of a Daily Standup?',
            options: [
              'Exercise',
              'Brief daily synchronization of team progress and blockers',
              'Project review',
              'Performance evaluation'
            ],
            correctAnswer: 1,
            explanation: 'Daily Standup (Daily Scrum) is a 15-minute time-boxed meeting where team members synchronize activities and plan for the next 24 hours.'
          },
          {
            id: 6,
            question: 'What is a product backlog?',
            options: [
              'Overdue items',
              'Prioritized list of features and requirements',
              'Bug list',
              'Completed work'
            ],
            correctAnswer: 1,
            explanation: 'The product backlog is an ordered list of everything needed in the product, maintained by the Product Owner.'
          },
          {
            id: 7,
            question: 'What is Sprint Planning?',
            options: [
              'Planning next year',
              'Meeting to define sprint goal and select backlog items',
              'Budget planning',
              'Career planning'
            ],
            correctAnswer: 1,
            explanation: 'Sprint Planning is a meeting where the team decides what can be delivered in the upcoming sprint and how the work will be achieved.'
          },
          {
            id: 8,
            question: 'What is a Sprint Retrospective?',
            options: [
              'Looking backward',
              'Meeting to reflect on the sprint and identify improvements',
              'Product demo',
              'Planning meeting'
            ],
            correctAnswer: 1,
            explanation: 'Sprint Retrospective is a meeting where the Scrum Team inspects itself and creates a plan for improvements in the next sprint.'
          },
          {
            id: 9,
            question: 'What is velocity in Agile?',
            options: [
              'Speed of typing',
              'Measure of work completed in a sprint',
              'Internet speed',
              'Project timeline'
            ],
            correctAnswer: 1,
            explanation: 'Velocity measures the amount of work (story points or hours) a team completes in a sprint, used for future planning.'
          },
          {
            id: 10,
            question: 'What is Definition of Done (DoD)?',
            options: [
              'Project completion',
              'Shared understanding of what it means for work to be complete',
              'Acceptance criteria',
              'Exit criteria'
            ],
            correctAnswer: 1,
            explanation: 'Definition of Done is a shared understanding of what it means for work to be complete, ensuring quality and consistency.'
          },
          {
            id: 11,
            question: 'What is Kanban?',
            options: [
              'A Japanese food',
              'Visual workflow management system limiting work in progress',
              'A meeting type',
              'A documentation tool'
            ],
            correctAnswer: 1,
            explanation: 'Kanban is a visual system for managing work as it moves through a process, emphasizing continuous flow and limiting WIP.'
          },
          {
            id: 12,
            question: 'What is an Epic in Agile?',
            options: [
              'A great achievement',
              'A large user story that spans multiple sprints',
              'A critical bug',
              'A project phase'
            ],
            correctAnswer: 1,
            explanation: 'An Epic is a large user story that is too big to complete in a single sprint and needs to be broken down into smaller stories.'
          },
          {
            id: 13,
            question: 'What is the role of a Product Owner?',
            options: [
              'Manages the team',
              'Maximizes product value and manages the product backlog',
              'Writes all code',
              'Tests the product'
            ],
            correctAnswer: 1,
            explanation: 'The Product Owner is responsible for maximizing product value and managing the product backlog, representing stakeholder interests.'
          },
          {
            id: 14,
            question: 'What is the role of a Scrum Master?',
            options: [
              'Project manager',
              'Servant leader facilitating Scrum and removing impediments',
              'Team lead',
              'Developer'
            ],
            correctAnswer: 1,
            explanation: 'The Scrum Master is a servant-leader who facilitates Scrum events, removes impediments, and helps the team follow Scrum practices.'
          },
          {
            id: 15,
            question: 'What is a Sprint Review?',
            options: [
              'Performance review',
              'Meeting to inspect sprint increment and adapt backlog',
              'Code review',
              'Retrospective'
            ],
            correctAnswer: 1,
            explanation: 'Sprint Review is held at the end of the sprint to inspect the increment and adapt the product backlog based on feedback.'
          }
        ]
      },
      
      challenge: {
        title: 'Agile Project Management Simulation',
        description: 'Manage a 3-sprint Agile project from inception to delivery',
        requirements: [
          'Create product vision and initial product backlog (20+ user stories)',
          'Write user stories in proper format: As a [role], I want [feature], so that [benefit]',
          'Estimate user stories using story points (Fibonacci sequence)',
          'Prioritize backlog using MoSCoW method',
          'Plan Sprint 1: Sprint goal, selected stories, task breakdown',
          'Simulate daily standups (document 5 standup reports)',
          'Track sprint progress with burndown chart',
          'Conduct Sprint Review documentation',
          'Conduct Sprint Retrospective with identified improvements',
          'Plan and document Sprint 2 and Sprint 3',
          'Use Jira or Trello to manage the project visually'
        ],
        submissionType: 'text',
        hints: [
          'Use acceptance criteria for each user story',
          'Keep stories small enough to complete in one sprint',
          'Consider team capacity when planning sprints',
          'Document blockers and how they were resolved',
          'Show velocity trends across sprints',
          'Include sprint metrics: completed points, velocity, burndown',
          'Demonstrate continuous improvement across sprints',
          'Use proper Agile terminology throughout'
        ]
      }
    },
    
    {
      id: 3,
      title: 'Business Analysis & Requirements Management',
      description: 'Master requirements gathering, business process modeling, and stakeholder management',
      duration: '5 weeks',
      difficulty: 'Advanced',
      
      learningResources: [
        {
    id: 1,
    title: 'Business Analysis Fundamentals Tutorial',
    type: 'article',
    platform: 'TechCanvass',
    url: 'https://businessanalyst.techcanvass.com/business-analysis-tutorials-for-non-it-professionals/?',
    duration: '6 hours',
    description: 'Comprehensive business analysis training covering BABOK principles and core concepts.'
  },
  {
    id: 2,
    title: 'Requirements Gathering Techniques Guide',
    type: 'article',
    platform: 'Modern Requirements Blog',
    url: 'https://www.modernrequirements.com/blogs/requirements-gathering-techniques/?',
    duration: '4 hours',
    description: 'In-depth guide on mastering various techniques for eliciting and managing requirements.'
  },
  {
    id: 3,
    title: 'Business Process Modeling with BPMN Tutorial',
    type: 'article',
    platform: 'Lucidchart',
    url: 'https://www.lucidchart.com/pages/tutorial/bpmn?',
    duration: '3 hours',
    description: 'Step-by-step tutorial to learn Business Process Model and Notation (BPMN) for process mapping and analysis.'
  },
        {
          id: 4,
          title: 'UML Diagrams Tutorial',
          type: 'video',
          platform: 'YouTube - freeCodeCamp',
          url: 'https://www.youtube.com/watch?v=WnMQ8HlmeXc',
          duration: '2 hours',
          description: 'Unified Modeling Language for system design'
        },
        {
          id: 5,
          title: 'Use Case Writing',
          type: 'article',
          platform: 'Modern Analyst',
          url: 'https://www.modernanalyst.com/',
          duration: '2 hours read',
          description: 'Writing effective use cases for system requirements'
        },
        {
          id: 6,
          title: 'Data Flow Diagrams',
          type: 'article',
          platform: 'Lucidchart',
          url: 'https://www.lucidchart.com/pages/data-flow-diagram',
          duration: '1.5 hours read',
          description: 'Creating data flow diagrams for process analysis'
        }
      ],
      
      quiz: {
        passingScore: 75,
        questions: [
          {
            id: 1,
            question: 'What is business analysis?',
            options: [
              'Financial accounting',
              'Practice of enabling change through defining needs and solutions',
              'Market research',
              'Business operations'
            ],
            correctAnswer: 1,
            explanation: 'Business analysis is the practice of enabling change in an organizational context by defining needs and recommending solutions.'
          },
          {
            id: 2,
            question: 'What are functional requirements?',
            options: [
              'Budget requirements',
              'Specific behaviors or functions the system must perform',
              'Non-functional requirements',
              'Business goals'
            ],
            correctAnswer: 1,
            explanation: 'Functional requirements define specific behaviors or functions the system must perform to meet business needs.'
          },
          {
            id: 3,
            question: 'What are non-functional requirements?',
            options: [
              'Requirements that don\'t work',
              'Quality attributes like performance, security, usability',
              'Optional features',
              'Future requirements'
            ],
            correctAnswer: 1,
            explanation: 'Non-functional requirements specify quality attributes such as performance, security, scalability, and usability.'
          },
          {
            id: 4,
            question: 'What is requirements elicitation?',
            options: [
              'Deleting requirements',
              'Process of gathering requirements from stakeholders',
              'Writing code',
              'Testing requirements'
            ],
            correctAnswer: 1,
            explanation: 'Requirements elicitation is the process of gathering, discovering, and defining requirements from stakeholders.'
          },
          {
            id: 5,
            question: 'What is a use case?',
            options: [
              'A storage container',
              'Description of how users interact with system to achieve goal',
              'A test case',
              'A business rule'
            ],
            correctAnswer: 1,
            explanation: 'A use case describes a sequence of interactions between users (actors) and a system to achieve a specific goal.'
          },
          {
            id: 6,
            question: 'What is gap analysis?',
            options: [
              'Finding holes',
              'Identifying difference between current and desired state',
              'Market research',
              'Budget analysis'
            ],
            correctAnswer: 1,
            explanation: 'Gap analysis identifies the difference between the current state (as-is) and desired future state (to-be).'
          },
          {
            id: 7,
            question: 'What is BPMN?',
            options: [
              'A company name',
              'Business Process Model and Notation for process mapping',
              'A software tool',
              'A certification'
            ],
            correctAnswer: 1,
            explanation: 'BPMN (Business Process Model and Notation) is a graphical representation for specifying business processes.'
          },
          {
            id: 8,
            question: 'What is a Business Requirements Document (BRD)?',
            options: [
              'Board meeting notes',
              'Document detailing business objectives and requirements',
              'Bug report',
              'Budget document'
            ],
            correctAnswer: 1,
            explanation: 'A BRD documents business objectives, problems to be solved, and high-level requirements for a project.'
          },
          {
            id: 9,
            question: 'What is a Functional Specification Document (FSD)?',
            options: [
              'Financial report',
              'Detailed technical specification of system functions',
              'Functional test plan',
              'Organization chart'
            ],
            correctAnswer: 1,
            explanation: 'An FSD provides detailed technical specifications of how system functions will be implemented.'
          },
          {
            id: 10,
            question: 'What is requirements traceability?',
            options: [
              'Finding lost requirements',
              'Ability to track requirements through development lifecycle',
              'GPS for documents',
              'Version control'
            ],
            correctAnswer: 1,
            explanation: 'Requirements traceability is the ability to trace requirements from origin through implementation and testing.'
          },
          {
            id: 11,
            question: 'What is SWOT analysis?',
            options: [
              'Security testing',
              'Analysis of Strengths, Weaknesses, Opportunities, Threats',
              'Software testing',
              'Work breakdown'
            ],
            correctAnswer: 1,
            explanation: 'SWOT analysis evaluates Strengths, Weaknesses, Opportunities, and Threats related to business or project.'
          },
          {
            id: 12,
            question: 'What is a stakeholder analysis?',
            options: [
              'Stock market analysis',
              'Identifying and analyzing stakeholder needs and influence',
              'Financial analysis',
              'Risk analysis'
            ],
            correctAnswer: 1,
            explanation: 'Stakeholder analysis identifies stakeholders, their interests, influence, and how they should be engaged.'
          },
          {
            id: 13,
            question: 'What is MoSCoW prioritization?',
            options: [
              'Russian prioritization',
              'Must have, Should have, Could have, Won\'t have',
              'Moscow method',
              'Cost prioritization'
            ],
            correctAnswer: 1,
            explanation: 'MoSCoW is a prioritization technique: Must have, Should have, Could have, Won\'t have this time.'
          },
          {
            id: 14,
            question: 'What is a data flow diagram (DFD)?',
            options: [
              'Flowchart',
              'Visual representation of data movement through system',
              'Organization chart',
              'Timeline'
            ],
            correctAnswer: 1,
            explanation: 'A DFD visually represents how data flows through a system, showing processes, data stores, and external entities.'
          },
          {
            id: 15,
            question: 'What is prototyping in requirements gathering?',
            options: [
              'Creating final product',
              'Building preliminary versions to clarify requirements',
              'Testing phase',
              'Documentation'
            ],
            correctAnswer: 1,
            explanation: 'Prototyping involves creating preliminary versions of a system to help stakeholders visualize and refine requirements.'
          }
        ]
      },
      
      challenge: {
        title: 'Complete Business Analysis Project',
        description: 'Conduct full business analysis for a new system implementation',
        requirements: [
          'Write stakeholder analysis identifying all stakeholders and their interests',
          'Conduct and document 3 different elicitation sessions (interview, workshop, survey)',
          'Create Business Requirements Document (BRD) with problem statement, objectives, scope',
          'Write 15+ functional requirements with acceptance criteria',
          'Identify 10+ non-functional requirements (performance, security, usability)',
          'Create process models using BPMN (as-is and to-be processes)',
          'Develop 5+ use cases with main and alternate flows',
          'Create UML diagrams (use case, activity, sequence diagrams)',
          'Build requirements traceability matrix',
          'Develop data flow diagram (DFD) for the system',
          'Create wireframes or mockups for key interfaces',
          'Perform gap analysis between current and future state'
        ],
        submissionType: 'text',
        hints: [
          'Choose a realistic business scenario (e.g., online ordering system)',
          'Be specific and measurable in requirements',
          'Use proper BA terminology and frameworks',
          'Include assumptions and constraints',
          'Requirements should be testable and unambiguous',
          'Use tools like Lucidchart, Draw.io for diagrams',
          'Create professional documentation',
          'Show clear link between business needs and requirements'
        ]
      }
    },
    
    {
      id: 4,
      title: 'IT Strategy, Solutions Architecture & Leadership',
      description: 'Master solution architecture, IT strategy, and leadership skills',
      duration: '4-5 weeks',
      difficulty: 'Expert',
      
      learningResources: [
        {
    id: 1,
    title: 'Solution Architecture Fundamentals Guide',
    type: 'video',
    platform: 'YouTube - Be A Better Dev',
    url: 'https://www.youtube.com/watch?v=AihWJ3_klRQ',
    duration: '5 hours',
    description: 'Comprehensive introduction to solution architecture principles, roles, and best practices.'
  },
  {
    id: 2,
    title: 'The Strategic Plan Is Dead — Long Live Strategy',
    type: 'article',
    platform: 'Stanford Social Innovation Review',
    url: 'https://ssir.org/articles/entry/the_strategic_plan_is_dead._long_live_strategy?utm_source=chatgpt.com',
    duration: '6 hours',
    description: 'Insightful article on modern IT strategy, digital transformation, and adaptive planning.'
  },
  {
    id: 3,
    title: 'Introduction to Enterprise Architecture with TOGAF',
    type: 'video',
    platform: 'YouTube - Simplilearn',
    url: 'https://www.youtube.com/watch?v=AihWJ3_klRQ',
    duration: '4 hours',
    description: 'Beginner-friendly introduction to the TOGAF framework and enterprise architecture principles.'
  },
  {
    id: 4,
    title: 'Cloud Architecture Patterns',
    type: 'video',
    platform: 'YouTube - AWS Events',
    url: 'https://www.youtube.com/watch?v=K0Ta65OqQkY',
    duration: '3 hours',
    description: 'Cloud architecture patterns and best practices.'
  },
  {
    id: 5,
    title: 'Addressing Leadership Challenges: Strategies for Success',
    type: 'article',
    platform: 'Stanford University - Knight Hennessy Scholars',
    url: 'https://knight-hennessy.stanford.edu/news/addressing-leadership-challenges-strategies-success?utm_source=chatgpt.com',
    duration: '4 hours',
    description: 'Leadership insights and strategies for IT managers, executives, and directors.'
  },
        {
          id: 6,
          title: 'System Design and Architecture',
          type: 'article',
          platform: 'Microsoft Architecture Center',
          url: 'https://docs.microsoft.com/en-us/azure/architecture/',
          duration: '3 hours read',
          description: 'Cloud design patterns and architecture best practices'
        },
        {
          id: 7,
          title: 'Digital Transformation Strategy',
          type: 'article',
          platform: 'Harvard Business Review',
          url: 'https://hbr.org/topic/digital-transformation',
          duration: '2 hours read',
          description: 'Leading digital transformation initiatives'
        }
      ],
      
      quiz: {
        passingScore: 80,
        questions: [
          {
            id: 1,
            question: 'What is solutions architecture?',
            options: [
              'Building physical structures',
              'Designing technology solutions to meet business requirements',
              'Software coding',
              'Network design only'
            ],
            correctAnswer: 1,
            explanation: 'Solutions architecture involves designing comprehensive technology solutions that meet specific business requirements and objectives.'
          },
          {
            id: 2,
            question: 'What is enterprise architecture?',
            options: [
              'Large building design',
              'Holistic view of organization\'s IT landscape and strategy',
              'Software development',
              'Database design'
            ],
            correctAnswer: 1,
            explanation: 'Enterprise architecture provides a holistic view of an organization\'s IT infrastructure, processes, and strategy aligned with business goals.'
          },
          {
            id: 3,
            question: 'What is TOGAF?',
            options: [
              'A programming language',
              'The Open Group Architecture Framework',
              'A cloud platform',
              'A project management tool'
            ],
            correctAnswer: 1,
            explanation: 'TOGAF (The Open Group Architecture Framework) is a framework for enterprise architecture providing methods and tools.'
          },
          {
            id: 4,
            question: 'What is IT governance?',
            options: [
              'Government IT',
              'Framework ensuring IT aligns with business objectives',
              'IT policies only',
              'Compliance audits'
            ],
            correctAnswer: 1,
            explanation: 'IT governance is a framework of policies, processes, and decision rights ensuring IT supports and enables business objectives.'
          },
          {
            id: 5,
            question: 'What is digital transformation?',
            options: [
              'Digitizing documents',
              'Integrating digital technology into all business areas',
              'Website development',
              'Going paperless'
            ],
            correctAnswer: 1,
            explanation: 'Digital transformation integrates digital technology into all business areas, fundamentally changing operations and value delivery.'
          },
          {
            id: 6,
            question: 'What is a technology roadmap?',
            options: [
              'GPS for technology',
              'Strategic plan outlining technology initiatives over time',
              'Network diagram',
              'Software installation guide'
            ],
            correctAnswer: 1,
            explanation: 'A technology roadmap is a strategic plan that outlines technology initiatives, investments, and timelines aligned with business goals.'
          },
          {
            id: 7,
            question: 'What is Total Cost of Ownership (TCO)?',
            options: [
              'Purchase price only',
              'Complete cost of acquiring, operating, and maintaining IT assets',
              'Software license cost',
              'Hardware cost'
            ],
            correctAnswer: 1,
            explanation: 'TCO includes all costs associated with acquiring, operating, maintaining, and eventually disposing of IT assets.'
          },
          {
            id: 8,
            question: 'What is scalability in architecture?',
            options: [
              'Physical size',
              'Ability to handle growth in users, data, or transactions',
              'Cost reduction',
              'Speed of deployment'
            ],
            correctAnswer: 1,
            explanation: 'Scalability is the capability of a system to handle growing amounts of work or users by adding resources.'
          },
          {
            id: 9,
            question: 'What is high availability?',
            options: [
              'Always being at office',
              'System remaining operational with minimal downtime',
              'Fast response time',
              'Many features'
            ],
            correctAnswer: 1,
            explanation: 'High availability ensures systems remain operational and accessible with minimal downtime, often measured as uptime percentage.'
          },
          {
            id: 10,
            question: 'What is disaster recovery?',
            options: [
              'Emergency response',
              'Processes and tools to recover IT systems after failure',
              'Backup only',
              'Insurance'
            ],
            correctAnswer: 1,
            explanation: 'Disaster recovery encompasses strategies and procedures for recovering IT infrastructure and data after catastrophic events.'
          },
          {
            id: 11,
            question: 'What is a Service Level Agreement (SLA)?',
            options: [
              'Service menu',
              'Contract defining expected service levels and responsibilities',
              'Service catalog',
              'Support ticket'
            ],
            correctAnswer: 1,
            explanation: 'An SLA is a formal agreement defining expected service levels, performance metrics, and responsibilities between provider and customer.'
          },
          {
            id: 12,
            question: 'What is vendor management?',
            options: [
              'Shopping',
              'Overseeing and coordinating third-party service providers',
              'Sales management',
              'Inventory control'
            ],
            correctAnswer: 1,
            explanation: 'Vendor management involves selecting, contracting, overseeing, and evaluating third-party service providers.'
          },
          {
            id: 13,
            question: 'What is IT portfolio management?',
            options: [
              'Document folder',
              'Managing collection of IT investments and projects',
              'Stock trading',
              'Resume building'
            ],
            correctAnswer: 1,
            explanation: 'IT portfolio management involves managing the collection of IT investments, projects, and assets to maximize business value.'
          },
          {
            id: 14,
            question: 'What is a proof of concept (POC)?',
            options: [
              'Final product',
              'Small-scale demonstration to verify feasibility',
              'Product documentation',
              'Marketing material'
            ],
            correctAnswer: 1,
            explanation: 'A POC is a small-scale implementation to demonstrate feasibility and validate concepts before full investment.'
          },
          {
            id: 15,
            question: 'What is change management in IT?',
            options: [
              'Changing passwords',
              'Structured approach to transitioning organizations to new state',
              'Software updates only',
              'Hardware replacement'
            ],
            correctAnswer: 1,
            explanation: 'Change management is a structured approach to transitioning individuals, teams, and organizations from current to desired future state.'
          },
          {
            id: 16,
            question: 'What is a business case?',
            options: [
              'Legal case',
              'Justification for project showing costs, benefits, and ROI',
              'Use case',
              'Test case'
            ],
            correctAnswer: 1,
            explanation: 'A business case justifies a project by documenting costs, benefits, risks, and expected return on investment.'
          },
          {
            id: 17,
            question: 'What is ITIL?',
            options: [
              'IT programming language',
              'IT Infrastructure Library - framework for IT service management',
              'Italian IT',
              'IT certification'
            ],
            correctAnswer: 1,
            explanation: 'ITIL (IT Infrastructure Library) is a framework of best practices for IT service management and delivery.'
          },
          {
            id: 18,
            question: 'What is cloud architecture?',
            options: [
              'Weather systems',
              'Design of cloud-based systems and services',
              'Sky photography',
              'Network topology'
            ],
            correctAnswer: 1,
            explanation: 'Cloud architecture involves designing applications and infrastructure that leverage cloud computing resources and services.'
          },
          {
            id: 19,
            question: 'What is technical debt?',
            options: [
              'Money owed for technology',
              'Future cost of rework due to quick solutions',
              'IT budget deficit',
              'Unpaid licenses'
            ],
            correctAnswer: 1,
            explanation: 'Technical debt is the implied cost of additional rework caused by choosing quick solutions instead of better approaches.'
          },
          {
            id: 20,
            question: 'What is stakeholder management?',
            options: [
              'Stock management',
              'Engaging and managing expectations of project stakeholders',
              'Employee management',
              'Customer service'
            ],
            correctAnswer: 1,
            explanation: 'Stakeholder management involves identifying, analyzing, and engaging stakeholders to ensure project success and satisfaction.'
          }
        ]
      },
      
      challenge: {
        title: 'Enterprise IT Strategy and Solution Design',
        description: 'Develop comprehensive IT strategy and solution architecture for digital transformation',
        requirements: [
          'Conduct current state assessment (as-is architecture)',
          'Define business drivers and strategic objectives',
          'Create IT vision and future state architecture (to-be)',
          'Design solution architecture with architecture diagrams',
          'Develop technology roadmap with 3-year timeline',
          'Create cloud migration strategy (if applicable)',
          'Perform cost-benefit analysis with TCO calculations',
          'Develop risk assessment and mitigation strategies',
          'Create governance framework and decision-making structure',
          'Design integration architecture between systems',
          'Develop vendor selection criteria and strategy',
          'Create implementation plan with phases and milestones',
          'Define success metrics and KPIs',
          'Prepare executive presentation deck'
        ],
        submissionType: 'text',
        hints: [
          'Choose a realistic business scenario (e.g., retail digital transformation)',
          'Use architecture frameworks like TOGAF or Zachman',
          'Create visual architecture diagrams (logical, physical, network)',
          'Consider cloud options: IaaS, PaaS, SaaS',
          'Include security and compliance considerations',
          'Address scalability, availability, and performance',
          'Think about change management and training',
          'Use tools like Visio, Lucidchart, or Draw.io',
          'Make recommendations specific and actionable',
          'Include both quick wins and long-term initiatives'
        ]
      }
    }
  ],
  
  finalProject: {
    title: 'Complete IT Management Portfolio Project',
    description: 'End-to-end project demonstrating all IT management competencies',
    duration: '4-5 weeks',
    
    overview: 'Lead a complete IT transformation project from business case through implementation planning. Demonstrate project management, business analysis, solution architecture, and strategic thinking skills.',
    
    requirements: [
      'Develop comprehensive business case with ROI analysis',
      'Create project charter and stakeholder analysis',
      'Conduct requirements gathering and analysis',
      'Write Business Requirements Document (BRD)',
      'Design solution architecture with technical specifications',
      'Create detailed project plan with WBS and Gantt chart',
      'Develop Agile implementation approach with sprint planning',
      'Design risk management and mitigation strategies',
      'Create change management and communication plan',
      'Develop training and adoption strategy',
      'Design governance and decision-making framework',
      'Create IT strategy roadmap for 2-3 years',
      'Develop budget with cost breakdown and TCO',
      'Prepare executive presentation and reports'
    ],
    
    deliverables: [
      {
        title: 'Business Case Document',
        description: 'Complete business justification with financial analysis',
        format: 'PDF document',
        pages: '10-15 pages'
      },
      {
        title: 'Project Charter',
        description: 'Formal project authorization with objectives and scope',
        format: 'PDF document',
        pages: '3-5 pages'
      },
      {
        title: 'Requirements Package',
        description: 'BRD, functional specs, use cases, and traceability matrix',
        format: 'PDF document',
        pages: '20-30 pages'
      },
      {
        title: 'Solution Architecture Document',
        description: 'Technical architecture with diagrams and specifications',
        format: 'PDF with Visio diagrams',
        pages: '15-20 pages'
      },
      {
        title: 'Project Management Plan',
        description: 'Complete project plan with schedule, budget, resources',
        format: 'MS Project file + PDF',
        pages: 'Complete plan'
      },
      {
        title: 'Agile Backlog and Sprint Plans',
        description: 'Product backlog, user stories, and 3 sprint plans',
        format: 'Jira export or Excel',
        pages: '50+ user stories'
      },
      {
        title: 'Risk Management Plan',
        description: 'Risk register, assessment, and mitigation strategies',
        format: 'Excel + PDF summary',
        pages: 'Complete register'
      },
      {
        title: 'Change Management Plan',
        description: 'Stakeholder engagement and organizational change strategy',
        format: 'PDF document',
        pages: '8-10 pages'
      },
      {
        title: 'IT Strategy Roadmap',
        description: '2-3 year technology roadmap with initiatives',
        format: 'PowerPoint/Visio',
        pages: 'Visual roadmap'
      },
      {
        title: 'Executive Presentation',
        description: 'Board-level presentation of strategy and recommendations',
        format: 'PowerPoint',
        pages: '15-20 slides'
      }
    ],
    
    evaluationCriteria: [
      {
        category: 'Strategic Thinking',
        weight: '25%',
        description: 'Business alignment, vision, and strategic planning'
      },
      {
        category: 'Project Management',
        weight: '20%',
        description: 'Planning, scheduling, and execution approach'
      },
      {
        category: 'Business Analysis',
        weight: '20%',
        description: 'Requirements quality and stakeholder management'
      },
      {
        category: 'Solution Architecture',
        weight: '20%',
        description: 'Technical design and architectural decisions'
      },
      {
        category: 'Documentation & Communication',
        weight: '15%',
        description: 'Quality of deliverables and presentations'
      }
    ],
    
    guidelines: [
      'Choose a realistic business transformation scenario',
      'Align IT initiatives with business objectives',
      'Use industry-standard frameworks (PMBOK, TOGAF, BABOK)',
      'Create professional, executive-ready documents',
      'Show clear return on investment',
      'Address risks and mitigation proactively',
      'Consider organizational change impact',
      'Use appropriate tools for each deliverable',
      'Demonstrate both waterfall and Agile approaches',
      'Think like a CIO or IT Director'
    ],
    
    resources: [
      'Microsoft Project or ProjectLibre',
      'Visio or Lucidchart for diagrams',
      'Jira for Agile management',
      'Excel for financial analysis',
      'PowerPoint for presentations',
      'PMBOK Guide (PMI)',
      'BABOK Guide (IIBA)',
      'TOGAF framework documentation',
      'Case study examples online'
    ],
    
    timeline: [
      {
        week: 1,
        tasks: [
          'Define business scenario and objectives',
          'Develop business case and ROI analysis',
          'Create project charter',
          'Conduct stakeholder analysis',
          'Begin requirements gathering'
        ]
      },
      {
        week: 2,
        tasks: [
          'Complete requirements documentation',
          'Create process models and use cases',
          'Design solution architecture',
          'Develop technical specifications',
          'Create architecture diagrams'
        ]
      },
      {
        week: 3,
        tasks: [
          'Develop detailed project plan',
          'Create Agile product backlog',
          'Plan sprints and iterations',
          'Develop risk management plan',
          'Create change management strategy'
        ]
      },
      {
        week: 4,
        tasks: [
          'Build IT strategy roadmap',
          'Complete budget and financial analysis',
          'Develop governance framework',
          'Create training and adoption plan',
          'Prepare all documentation'
        ]
      },
      {
        week: 5,
        tasks: [
          'Create executive presentation',
          'Review and polish all deliverables',
          'Ensure consistency across documents',
          'Practice presentation',
          'Final quality check'
        ]
      }
    ],
    
    submissionInstructions: 'Submit a complete portfolio package including all deliverables in a organized folder structure. Include a master README document explaining each deliverable and how to navigate the submission. Be prepared to present to a mock executive committee.',
    
    tips: [
      'Think from business perspective, not just technical',
      'Every recommendation should tie back to business value',
      'Use real-world examples and industry benchmarks',
      'Make financial analysis realistic and detailed',
      'Show you understand organizational dynamics',
      'Balance innovation with practical implementation',
      'Address the "people" side of change, not just technology',
      'Use metrics and KPIs throughout',
      'Make presentations visual and compelling',
      'Demonstrate both strategic and tactical thinking',
      'Show leadership and decision-making capability',
      'Keep executive summary concise and impactful',
      'Practice explaining complex concepts simply'
    ]
  }
};

export default itManagementRoadmap;