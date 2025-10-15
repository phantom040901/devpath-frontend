// src/data/roadmaps/specializedITRoadmap.js

const specializedITRoadmap = {
  id: 'specialized-it',
  title: 'Specialized IT Roles Career Path',
  description: 'Master IT auditing, portal administration, and CRM development for specialized technical roles',
  category: 'Specialized',
  estimatedDuration: '20-24 weeks',
  skillsGained: [
    'IT Audit & Compliance',
    'Risk Assessment',
    'Security Controls',
    'SharePoint Administration',
    'Portal Development',
    'CRM Development (Dynamics 365)',
    'Salesforce Administration',
    'Business Process Automation',
    'Regulatory Frameworks (SOX, GDPR, ISO 27001)'
  ],
  
  modules: [
    {
  id: 1,
  title: 'IT Audit Fundamentals & Compliance',
  description: 'Master IT audit principles, compliance frameworks, and risk assessment',
  duration: '6 weeks',
  difficulty: 'Beginner',

  learningResources: [
    {
      id: 1,
      title: 'IT Audit for Beginners – Introduction to IT Audit, Controls & Testing',
      type: 'video',
      platform: 'YouTube – Peju / Your IT Career',
      url: 'https://www.youtube.com/watch?v=7TFK-VRt6l0',  // Intro to IT audit, controls, and testing :contentReference[oaicite:0]{index=0}
      duration: '≈ 1.5 hours',
      description: 'Covers what an IT audit is, types of controls, testing controls, and audit basics.'
    },
    {
      id: 2,
      title: 'Getting Started With: IT Audit (IIA series)',
      type: 'video',
      platform: 'YouTube – The Institute of Internal Auditors',
      url: 'https://www.youtube.com/watch?v=D82WGSoLCbc',  // quick tips & overview of IT audit :contentReference[oaicite:1]{index=1}
      duration: '≈ 10 minutes',
      description: 'Short overview of IT audit roles, general vs application controls, and audit process steps.'
    },
    {
      id: 3,
      title: 'What Is an IT Audit? – JumpCloud',
      type: 'video',
      platform: 'YouTube – JumpCloud',
      url: 'https://www.youtube.com/watch?v=QIOiC3b4_1A',  // defines IT audit and how to conduct it :contentReference[oaicite:2]{index=2}
      duration: '≈ 8 minutes',
      description: 'Explains scope of IT audits, risk, planning, and frameworks.'
    },
    {
      id: 4,
      title: 'Auditing Basics (Cybersecurity & Compliance) – Playlist',
      type: 'video playlist',
      platform: 'YouTube',
      url: 'https://www.youtube.com/playlist?list=PLvNz20jdFwUWnnBLrWHWVRYRv90gnn-kK',  // auditing fundamentals playlist :contentReference[oaicite:3]{index=3}
      duration: 'varies (multiple videos)',
      description: 'Collection of videos covering audit process, compliance, risk, and control topics.'
    },
    {
      id: 5,
      title: 'COBIT – ISACA Official Resources',
      type: 'article / documentation',
      platform: 'ISACA',
      url: 'https://www.isaca.org/resources/cobit',  // ISACA’s COBIT resources page :contentReference[oaicite:4]{index=4}
      duration: 'varies (read by section)',
      description: 'Foundation, guides, and resources about the COBIT IT governance and control framework.'
    },
    {
      id: 6,
      title: 'COBIT 5 Framework Guide (PDF)',
      type: 'document / article',
      platform: 'ISACA / public PDF',
      url: 'https://community.mis.temple.edu/mis5203sec003spring2020/files/2019/01/COBIT-2019-Framework-Introduction-and-Methodology_res_eng_1118.pdf',  // COBIT 2019 intro PDF :contentReference[oaicite:5]{index=5}
      duration: '≈ 2 hours read',
      description: 'PDF introduction to COBIT 2019 framework, methodology, and governance principles.'
    },
    {
      id: 7,
      title: 'How to Conduct Internal Audit Step by Step',
      type: 'video',
      platform: 'YouTube – Prabh Nair',
      url: 'https://www.youtube.com/watch?v=gaClcfhfWFM',  // tutorial on audit steps :contentReference[oaicite:6]{index=6}
      duration: '≈ 15 minutes',
      description: 'Walkthrough of audit planning, fieldwork, reporting, and follow-up steps.'
    }
  ],

  quiz: {
    passingScore: 75,
    questions: [
      {
        id: 1,
        question: 'Which video introduces IT auditing, control types, and control testing?',
        options: [
          'What Is an IT Audit? (JumpCloud)',
          'How to Conduct Internal Audit Step by Step',
          'IT Audit for Beginners (Peju / Your IT Career)',
          'Auditing Basics Playlist'
        ],
        correctAnswer: 2,
        explanation: '“IT Audit for Beginners” (Peju) covers audit intro, controls, and testing. :contentReference[oaicite:7]{index=7}'
      },
      {
        id: 2,
        question: 'What is a primary purpose of an IT audit?',
        options: [
          'Design software applications',
          'Examine IT controls, processes, compliance, and risks',
          'Manage databases',
          'Write hardware specs'
        ],
        correctAnswer: 1,
        explanation: 'IT audit evaluates controls, risk, compliance, and processes to ensure reliable operations.'
      },
      {
        id: 3,
        question: 'Which framework is featured on ISACA’s COBIT resources page?',
        options: [
          'ITIL',
          'COBIT (Control Objectives for Information and Related Technologies)',
          'TOGAF',
          'COBIT++'
        ],
        correctAnswer: 1,
        explanation: 'ISACA manages the COBIT framework and publishes official COBIT resources. :contentReference[oaicite:8]{index=8}'
      },
      {
        id: 4,
        question: 'Which video shows audit steps from planning to reporting?',
        options: [
          'Getting Started With: IT Audit',
          'What Is an IT Audit?',
          'How to Conduct Internal Audit Step by Step',
          'Auditing Basics Playlist'
        ],
        correctAnswer: 2,
        explanation: '“How to Conduct Internal Audit Step by Step” gives a full process walkthrough. :contentReference[oaicite:9]{index=9}'
      },
      {
        id: 5,
        question: 'What does COBIT 2019 PDF “Introduction and Methodology” explain?',
        options: [
          'How to code audit scripts',
          'COBIT governance principles, methodology, and framework structure',
          'Microsoft product pricing',
          'Network protocols'
        ],
        correctAnswer: 1,
        explanation: 'The PDF is an introduction to COBIT’s methodology, governance, and framework structure. :contentReference[oaicite:10]{index=10}'
      },
      {
        id: 6,
        question: 'Which video gives a quick overview of IT audit roles and control types?',
        options: [
          'IT Audit for Beginners',
          'Getting Started With: IT Audit',
          'What Is an IT Audit?',
          'Auditing Basics Playlist'
        ],
        correctAnswer: 1,
        explanation: '“Getting Started With: IT Audit” gives a concise overview of audit roles and control types. :contentReference[oaicite:11]{index=11}'
      },
      {
        id: 7,
        question: 'Which resource would you use to study governance & control objectives for IT?',
        options: [
          'Peju video',
          'JumpCloud video',
          'COBIT resources page (ISACA)',
          'Prabh Nair video'
        ],
        correctAnswer: 2,
        explanation: 'The COBIT page is the go-to source for governance & control objectives in IT. :contentReference[oaicite:12]{index=12}'
      },
      {
        id: 8,
        question: 'Which video shows how audits are executed from fieldwork to final report?',
        options: [
          'Getting Started With: IT Audit',
          'IT Audit for Beginners',
          'How to Conduct Internal Audit Step by Step',
          'Auditing Basics Playlist'
        ],
        correctAnswer: 2,
        explanation: '“How to Conduct Internal Audit Step by Step” walks through fieldwork, report writing, follow-ups. :contentReference[oaicite:13]{index=13}'
      },
      {
        id: 9,
        question: 'What is one key goal of internal controls in auditing?',
        options: [
          'Speeding user interfaces',
          'Ensuring accuracy, security, compliance, and reducing fraud',
          'Maximizing memory usage',
          'Reducing network latency'
        ],
        correctAnswer: 1,
        explanation: 'Internal controls aim to protect assets, ensure accurate data, compliance, and reduce fraud risk.'
      },
      {
        id: 10,
        question: 'Which video introduces audit methodology and topics like control risk management?',
        options: [
          'IT Audit for Beginners (Peju)',
          'What Is an IT Audit?',
          'Getting Started With: IT Audit',
          'Auditing Basics Playlist'
        ],
        correctAnswer: 0,
        explanation: 'Peju’s video covers audit concepts, controls, testing, and methodology. :contentReference[oaicite:14]{index=14}'
      },
      {
        id: 11,
        question: 'What is a control deficiency in auditing?',
        options: [
          'An extra control',
          'A weakness or gap in a control that may fail to mitigate risk',
          'Software error',
          'Network outage'
        ],
        correctAnswer: 1,
        explanation: 'A control deficiency exists when a control is missing or ineffective, causing risk exposure.'
      },
      {
        id: 12,
        question: 'What is segregation of duties in audit compliance?',
        options: [
          'One person does all tasks',
          'Dividing responsibilities to reduce errors or fraud',
          'Single user account',
          'Working in pairs always'
        ],
        correctAnswer: 1,
        explanation: 'Segregation of duties splits responsibilities so no one person has too much control or opportunity for misuse.'
      },
      {
        id: 13,
        question: 'Which video defines “What Is an IT Audit?” in simple terms?',
        options: [
          'IT Audit for Beginners',
          'Getting Started With: IT Audit',
          'What Is an IT Audit?',
          'Prabh Nair video'
        ],
        correctAnswer: 2,
        explanation: 'The JumpCloud video titled “What Is an IT Audit?” gives a clear definition and scope. :contentReference[oaicite:15]{index=15}'
      },
      {
        id: 14,
        question: 'What is the primary difference between general IT controls and application controls?',
        options: [
          'There is no difference',
          'General controls are enterprise-wide (IT environment); application controls are specific to software functions',
          'App controls manage hardware',
          'General controls manage users only'
        ],
        correctAnswer: 1,
        explanation: 'General IT controls cover the overall IT environment (access, backup, change), while application controls focus on transactions and data within systems.'
      },
      {
        id: 15,
        question: 'Which resource is best to read for frameworks and governance in auditing?',
        options: [
          'Peju video',
          'COBIT 2019 PDF',
          'JumpCloud video',
          'Prabh Nair video'
        ],
        correctAnswer: 1,
        explanation: 'The COBIT 2019 PDF is a foundational resource for governance, methodology, and control frameworks. :contentReference[oaicite:16]{index=16}'
      }
    ]
  },

  challenge: {
    title: 'IT Audit Assessment Project',
    description: 'Conduct comprehensive IT audit for a fictional organization',
    requirements: [
      'Define audit scope and objectives',
      'Conduct risk assessment with risk register',
      'Develop audit program with test procedures',
      'Evaluate IT general controls (access, change management, backup)',
      'Assess application controls',
      'Review compliance with COBIT and regulatory controls (e.g. SOX / GDPR)',
      'Identify control deficiencies and recommend remediation',
      'Create audit findings documentation with severity levels',
      'Develop remediation action plan with timelines',
      'Write executive audit report including summary and metrics',
      'Present audit results to management with key visual aids'
    ],
    submissionType: 'text / document',
    hints: [
      'Use COBIT framework principles to map controls to objectives',
      'Distinguish general vs application controls when designing tests',
      'Document evidence and sampling procedures clearly',
      'Prioritize findings by risk impact and likelihood',
      'Ensure your remediation plan is actionable and timebound',
      'Include heat maps or charts to illustrate risk areas',
      'Provide a summary in non-technical language for executives',
      'In the audit report, include control categories, audit findings, and recommended actions'
    ]
  }
},

    {
  id: 2,
  title: 'Advanced IT Audit & Security Controls',
  description: 'Master advanced auditing techniques, security controls, and regulatory compliance',
  duration: '5 weeks',
  difficulty: 'Intermediate',

  learningResources: [
    {
      id: 1,
      title: 'Introduction To CISA – Overview & Audit Domains',
      type: 'video',
      platform: 'YouTube – Infosec Train',
      url: 'https://www.youtube.com/watch?v=ZUA-Eq8cpeI',  // reliable intro to CISA ([youtube.com](https://www.youtube.com/watch?v=ZUA-Eq8cpeI&utm_source=chatgpt.com))
      duration: '≈ 1 hour',
      description: 'CISA overview, audit domains, certification path, and role of IT audit'
    },
    {
      id: 2,
      title: 'IS Audit & Assurance Standards (ISACA)',
      type: 'video',
      platform: 'YouTube – Ask Kuzma / Audit Academy',
      url: 'https://www.youtube.com/watch?v=SVUVUlm3Z5g',  // ITAF / IS Audit standards (Ask Kuzma) :contentReference[oaicite:0]{index=0}
      duration: '≈ 30 minutes',
      description: 'Introduction to ISACA’s IT Audit & Assurance standards, principles, and practices'
    },
    {
      id: 3,
      title: 'NIST Cybersecurity Framework – Overview',
      type: 'video',
      platform: 'YouTube – Optic Cyber',
      url: 'https://www.youtube.com/watch?v=f-6J7-WqcGE',  // NIST CSF 2.0 overview video :contentReference[oaicite:1]{index=1}
      duration: '≈ 10 minutes',
      description: 'Explains NIST CSF core functions, tiers, and how it’s used in cybersecurity risk management'
    },
    {
      id: 4,
      title: 'Hands on with the NIST Cybersecurity Framework 2.0',
      type: 'video',
      platform: 'YouTube – Antisyphon Training',
      url: 'https://www.youtube.com/watch?v=BrWw62XCQg0',  // practical NIST CSF 2.0 session :contentReference[oaicite:2]{index=2}
      duration: '≈ 1 hour',
      description: 'Applied view of NIST CSF 2.0, measurement, maturity and implementation tips'
    },
    {
      id: 5,
      title: 'Auditing Information Systems – ISACA / CISA Playlist',
      type: 'video playlist',
      platform: 'YouTube – audit training series',
      url: 'https://www.youtube.com/playlist?list=PLs6Q7Yu5KS2bVVcbHj-FLv-A_UFx-0tc1',  // “The Process of Auditing Information Systems” playlist :contentReference[oaicite:3]{index=3}
      duration: 'varies (multiple lessons)',
      description: 'Series covering IS audit planning, standards, laws/regulations, controls, and assurance processes'
    },
    {
      id: 6,
      title: 'NIST Cybersecurity Framework – CSF Resources & Guidance',
      type: 'article / documentation',
      platform: 'NIST / US Government',
      url: 'https://www.nist.gov/cyberframework',  // official NIST CSF page
      duration: 'varies read time',
      description: 'Official NIST framework documentation, implementation guides, and references'
    }
  ],

  quiz: {
    passingScore: 75,
    questions: [
      {
        id: 1,
        question: 'What certification is introduced in the “Introduction to CISA” video?',
        options: [
          'CISM',
          'CISA (Certified Information Systems Auditor)',
          'CISSP',
          'ISO 27001 Lead Auditor'
        ],
        correctAnswer: 1,
        explanation: 'The video explicitly introduces the CISA certification and its audit domains. ([youtube.com](https://www.youtube.com/watch?v=ZUA-Eq8cpeI&utm_source=chatgpt.com))'
      },
      {
        id: 2,
        question: 'Which video discusses ISACA’s IT Audit & Assurance standards?',
        options: [
          'Introduction to CISA',
          'IS Audit & Assurance Standards (Ask Kuzma)',
          'NIST CSF Overview',
          'Audit Systems Playlist'
        ],
        correctAnswer: 1,
        explanation: 'The Ask Kuzma video covers ISACA’s standards, including audit and assurance frameworks. :contentReference[oaicite:4]{index=4}'
      },
      {
        id: 3,
        question: 'What is the purpose of the NIST Cybersecurity Framework?',
        options: [
          'Define programming languages',
          'Manage cybersecurity risk using standardized functions and profiles',
          'Design hardware circuits',
          'List software bugs'
        ],
        correctAnswer: 1,
        explanation: 'The NIST CSF provides a common language and structured approach to identify, protect, detect, respond, recover in cybersecurity. :contentReference[oaicite:5]{index=5}'
      },
      {
        id: 4,
        question: 'Which video gives an applied view of NIST CSF in practice?',
        options: [
          'NIST CSF Overview',
          'Hands on with the NIST CSF 2.0',
          'IS Audit Standards',
          'CISA Introduction'
        ],
        correctAnswer: 1,
        explanation: '“Hands on with the NIST CSF 2.0” shows how to measure and apply the framework in real settings. :contentReference[oaicite:6]{index=6}'
      },
      {
        id: 5,
        question: 'Which resource is a video playlist covering audit processes and controls?',
        options: [
          'Audit Systems Playlist',
          'NIST CSF Overview',
          'Introduction to CISA',
          'Hands on NIST'
        ],
        correctAnswer: 0,
        explanation: 'The “Process of Auditing Information Systems” playlist covers audit planning, controls, regulation, etc. :contentReference[oaicite:7]{index=7}'
      },
      {
        id: 6,
        question: 'What official documentation source is used for cybersecurity framework guidance?',
        options: [
          'Microsoft Docs',
          'ISO website',
          'NIST Cybersecurity Framework site',
          'Wikipedia'
        ],
        correctAnswer: 2,
        explanation: 'The NIST CSF site is the official source for framework documentation, guides, and reference models.'
      },
      {
        id: 7,
        question: 'In IS audit standards video, what concept is emphasized?',
        options: [
          'Cooking recipes',
          'IT auditing and assurance principles / standards',
          'Video game design',
          'Sports analytics'
        ],
        correctAnswer: 1,
        explanation: 'The video explores the principles and standards guiding IS audits and assurance engagements. :contentReference[oaicite:8]{index=8}'
      },
      {
        id: 8,
        question: 'Which video introduces IS Audit & Assurance as vendor-neutral? (standards apply broadly across industries)',
        options: [
          'NIST CSF Overview',
          'Ask Kuzma – ITAF introduction',
          'CISA Intro',
          'Audit Playlist'
        ],
        correctAnswer: 1,
        explanation: 'The Ask Kuzma video presents IS Audit & Assurance standards in a vendor-neutral manner. :contentReference[oaicite:9]{index=9}'
      },
      {
        id: 9,
        question: 'Which framework helps link cybersecurity risk and business objectives using a common language?',
        options: [
          'COBIT only',
          'NIST CSF',
          'TCP/IP Model',
          'HTML'
        ],
        correctAnswer: 1,
        explanation: 'NIST CSF is designed to align cybersecurity practices with business goals using standardized language and structure. :contentReference[oaicite:10]{index=10}'
      },
      {
        id: 10,
        question: 'What is the relationship between audit controls and the standards videos?',
        options: [
          'Standards define the criteria; audit videos teach how to test and apply them',
          'Standards are unrelated to audits',
          'Standards replace audits',
          'Audits define standards'
        ],
        correctAnswer: 0,
        explanation: 'Audit standards set the criteria and principles; the videos show how audits should be conducted in line with them.'
      }
    ]
  },

  challenge: {
    title: 'Security Controls Audit & Compliance Assessment',
    description: 'Perform a security audit of systems and map them to frameworks like NIST and ISACA standards.',
    requirements: [
      'Use the NIST CSF to assess security posture of a sample system',
      'Map controls to NIST functions (Identify, Protect, Detect, Respond, Recover)',
      'Evaluate audit criteria against ISACA’s audit standard principles',
      'Design tests for access controls, change management, encryption, and incident management',
      'Document findings, gaps, and risk ratings',
      'Recommend remediations with prioritized roadmap',
      'Create a compliance dashboard summarizing findings and metrics',
      'Present your audit to stakeholders with clear visuals and justifications'
    ],
    submissionType: 'text / document',
    hints: [
      'Use the NIST framework structure to guide your audit flow',
      'Refer to audit standards when designing your control tests',
      'Include risk rating (High / Medium / Low) and justification',
      'Use the audit playlist videos as conceptual guides for methodology',
      'Align remediation with business impact and cost',
      'Include evidence and references to standards or frameworks'
    ]
  }
},

    {
  id: 3,
  title: 'Advanced Portal Administration (SharePoint & Web Portals)',
  description: 'Gain mastery in advanced SharePoint administration, governance, automation, and Power Platform integration for enterprise-level portals.',
  duration: '6-7 weeks',
  difficulty: 'Advanced',

  learningResources: [
    {
      id: 1,
      title: 'Build Your First Power App with SharePoint (Hands-on)',
      type: 'video',
      platform: 'YouTube — Shane Young',
      url: 'https://www.youtube.com/watch?v=CKZcb08xxiE',
      duration: '≈ 2 hours',
      description: 'Step-by-step: create a Power App backed by a SharePoint list — covers connectors, forms, and publishing.'
    },
    {
      id: 2,
      title: 'SharePoint Framework (SPFx) — Getting Started (Tutorial)',
      type: 'video playlist',
      platform: 'YouTube — SPFx / community tutorials',
      url: 'https://www.youtube.com/watch?v=2RXMvEy2Iek&list=PLWv_zMQc_6Moc4RfWf-YcO4Mp4NY9ZTYs',
      duration: 'varies (playlist of SPFx setup & web part creation)',
      description: 'SPFx environment setup and building your first web part using modern toolchain (Yeoman, Gulp, React/TypeScript).'
    },
    {
      id: 3,
      title: 'Power Apps Portals — Introduction & Step-by-Step Tutorial',
      type: 'video series',
      platform: 'YouTube — Power Apps / tutorial series',
      url: 'https://www.youtube.com/watch?v=_yJ4V5145z8',
      duration: '≈ 1.5 hours (series / multipart content)',
      description: 'Intro to Power Apps Portals (Power Pages): configuration, authentication options, and publishing external portals.'
    },
    {
      id: 4,
      title: 'SharePoint governance plan (Microsoft Learn)',
      type: 'article / documentation',
      platform: 'Microsoft Learn (docs.microsoft.com)',
      url: 'https://learn.microsoft.com/en-us/sharepoint/governance-plan',
      duration: '≈ 2-4 hours (read & reference)',
      description: 'Official Microsoft guidance on governance, lifecycle, roles, policies, and compliance for SharePoint deployments.'
    },
    {
      id: 5,
      title: 'PnP / Microsoft 365 Patterns & Practices — SPFx & Admin Guidance (playlist)',
      type: 'video playlist / community resources',
      platform: 'YouTube — Microsoft 365 PnP',
      url: 'https://www.youtube.com/playlist?list=PLu1AjnsrTx3XhawoAI9JmkoESKPJiFkPZ',
      duration: 'varies (deep dives, sample code, component patterns)',
      description: 'Community-driven best practices and tutorial recordings for SPFx development, property panes, and advanced scenarios.'
    }
  ],

  quiz: {
    passingScore: 80,
    questions: [
      {
        id: 1,
        question: 'Which tool does the Shane Young Power Apps tutorial use as the data source for the sample app?',
        options: [
          'SQL Server',
          'SharePoint list',
          'Excel on local PC',
          'Dropbox'
        ],
        correctAnswer: 1,
        explanation: 'Shane Young demonstrates building a Power App using a SharePoint list as the backend data source.'
      },
      {
        id: 2,
        question: 'What is the first step when setting up a SPFx development environment in the SPFx playlist?',
        options: [
          'Install Visual Studio 2010',
          'Install Node.js, Yeoman generator for SPFx, and gulp',
          'Create an Azure VM',
          'Enable PowerShell remoting'
        ],
        correctAnswer: 1,
        explanation: 'SPFx requires a modern toolchain: Node.js, Yeoman generator for SharePoint, and gulp to scaffold and build projects.'
      },
      {
        id: 3,
        question: 'Power Apps Portals (Power Pages) are primarily used to:',
        options: [
          'Host desktop applications',
          'Create external-facing websites that interact with Dataverse/SharePoint data',
          'Replace SQL databases',
          'Design OS-level drivers'
        ],
        correctAnswer: 1,
        explanation: 'Power Apps Portals (Power Pages) enable external users to interact with organization data via web portals.'
      },
      {
        id: 4,
        question: 'What is a primary goal of a SharePoint governance plan in Microsoft Learn guidance?',
        options: [
          'Maximize the number of sites',
          'Define roles, policies, lifecycle, and standards to ensure secure & consistent use',
          'Remove permissions entirely',
          'Limit users from uploading files'
        ],
        correctAnswer: 1,
        explanation: 'Governance plans establish roles, policies, and lifecycle rules to keep SharePoint consistent, secure, and manageable.'
      },
      {
        id: 5,
        question: 'What language is commonly used for SPFx web part development according to PnP materials?',
        options: [
          'TypeScript (often with React)',
          'PHP',
          'Perl',
          'Ruby'
        ],
        correctAnswer: 0,
        explanation: 'SPFx development is typically done using TypeScript and often React for UI components.'
      },
      {
        id: 6,
        question: 'Which of the following is a recommended pattern for provisioning consistent SharePoint site structure?',
        options: [
          'Manual site creation each time',
          'Use PnP templates or site provisioning scripts (PnP PowerShell / PnP provisioning engine)',
          'Create sites by copying HTML files',
          'Ask users to create sites themselves with no template'
        ],
        correctAnswer: 1,
        explanation: 'PnP templates and provisioning scripts ensure consistent site structure, metadata, and settings across sites.'
      },
      {
        id: 7,
        question: 'What is managed metadata used for in SharePoint governance?',
        options: [
          'Encrypting files',
          'Standardized taxonomy & tagging to improve search and organization',
          'Running scheduled tasks',
          'Managing user licenses'
        ],
        correctAnswer: 1,
        explanation: 'Managed metadata provides consistent taxonomy and tagging across the tenant, which improves findability.'
      },
      {
        id: 8,
        question: 'Which admin capability helps auditing user activity in Microsoft 365 / SharePoint Online?',
        options: [
          'Audit Log Search in the Microsoft Purview / Security & Compliance center',
          'Changing the site theme',
          'Disabling SharePoint entirely',
          'Deleting the Recycle Bin'
        ],
        correctAnswer: 0,
        explanation: 'Audit Log Search in Microsoft Purview lets admins search events and user activities across Microsoft 365 services.'
      },
      {
        id: 9,
        question: 'When building a custom SPFx web part, which dev command bundle is typically used to run a local workbench during development?',
        options: [
          'gulp serve',
          'npm install build',
          'dotnet run',
          'mvn package'
        ],
        correctAnswer: 0,
        explanation: '“gulp serve” launches the local workbench and serves the SPFx web part for local development and testing.'
      },
      {
        id: 10,
        question: 'Which Power Platform component is best for creating automated approval workflows in SharePoint?',
        options: [
          'Power BI',
          'Power Automate',
          'Power Virtual Agents',
          'Power Query'
        ],
        correctAnswer: 1,
        explanation: 'Power Automate is used to build flows (approval, notifications, data sync) integrated with SharePoint lists and libraries.'
      }
    ]
  },

  challenge: {
    title: 'Advanced Enterprise Portal Automation Project',
    description: 'Design, automate, and secure a complete enterprise-level SharePoint and Power Platform portal ecosystem.',
    requirements: [
      'Design advanced information architecture and hub site relationships',
      'Automate site provisioning using PnP PowerShell or provisioning engine',
      'Integrate SharePoint with Power Apps and Power Automate for business workflows',
      'Develop at least one custom SPFx web part and deploy it to the app catalog',
      'Implement governance policies (roles, retention, sensitivity labels) and document them',
      'Configure auditing and monitoring (audit log search, site usage analytics)',
      'Create Power BI report showing portal usage and key metrics',
      'Document administration processes and runbooks for ongoing maintenance'
    ],
    submissionType: 'text / repo / package',
    hints: [
      'Use the SPFx playlist to get your environment and first web part working (Node, Yeoman, gulp).',
      'Use PnP provisioning templates to automate site templates and metadata.',
      'Leverage Power Automate for approval flows and Power Apps for forms and user interactions.',
      'Use Microsoft Learn governance guidance to draft your governance plan.',
      'Record short demo videos or include a README for how to deploy your SPFx package and provisioning scripts.'
    ]
  }
},

    
    {
  id: 4,
  title: 'CRM Development (Dynamics 365 & Salesforce) — Expert Level',
  description: 'Master advanced CRM development across Dynamics 365 and Salesforce, with deep customization, integration, and architecture skills.',
  duration: '6-8 weeks',
  difficulty: 'Expert',

  learningResources: [
    {
      id: 1,
      title: 'Becoming a Dynamics 365 Developer (Webinar)',
      type: 'video',
      platform: 'YouTube — xRMCoaches',
      url: 'https://www.youtube.com/watch?v=FnWugHDVPi4',
      duration: '≈ 1.5 hours',
      description: 'Explores tools, approaches, and advanced developer mindset in Dynamics 365. :contentReference[oaicite:0]{index=0}'
    },
    {
      id: 2,
      title: 'Dynamics 365 CRM Plugin Development Basics (Playlist)',
      type: 'video playlist',
      platform: 'YouTube — Dynamix Academy',
      url: 'https://www.youtube.com/playlist?list=PLelARlgcXqy4RDYnqJXYqBqk5DNyX49DO',
      duration: 'varies (multiple plugin dev modules)',
      description: 'Step-by-step tutorials on building plugins for Dynamics 365. :contentReference[oaicite:1]{index=1}'
    },
    {
      id: 3,
      title: 'Apex Programming Crash Course',
      type: 'video',
      platform: 'YouTube — Coderversity',
      url: 'https://www.youtube.com/watch?v=HeRZjnuXJUQ',
      duration: '≈ 1 hour',
      description: 'Fundamentals of Apex development for Salesforce (classes, triggers, syntax) :contentReference[oaicite:2]{index=2}'
    },
    {
      id: 4,
      title: 'Salesforce Apex Common Library & Design Patterns',
      type: 'video',
      platform: 'YouTube — Coding With The Force',
      url: 'https://www.youtube.com/watch?v=HQrVEX4oE3A',
      duration: '≈ 7.5 hours',
      description: 'Deep dive into Apex libraries, design patterns (Unit of Work, Factory, Service Layer) :contentReference[oaicite:3]{index=3}'
    },
    {
      id: 5,
      title: 'Microsoft Documentation: Dynamics 365 Developer Guide',
      type: 'article / docs',
      platform: 'Microsoft Docs',
      url: 'https://learn.microsoft.com/en-us/dynamics365/', 
      duration: 'varies (reference by module)',
      description: 'Official Microsoft docs covering plugin, workflow, Web API, solution framework.'
    }
  ],

  quiz: {
    passingScore: 80,
    questions: [
      {
        id: 1,
        question: 'Which video describes the tools and mindset for becoming a Dynamics 365 developer?',
        options: [
          'Apex Programming Crash Course',
          'Becoming a Dynamics 365 Developer',
          'Dynamics Plugin Dev Basics',
          'Coding With The Force Patterns'
        ],
        correctAnswer: 1,
        explanation: '“Becoming a Dynamics 365 Developer” provides a developer’s roadmap and mindset for Dynamics 365. :contentReference[oaicite:4]{index=4}'
      },
      {
        id: 2,
        question: 'What is the focus of the plugin development playlist for Dynamics 365?',
        options: [
          'User interface theming',
          'Plugin (server-side) event logic',
          'Power BI visualization',
          'SharePoint integration'
        ],
        correctAnswer: 1,
        explanation: 'The playlist teaches writing server-side plugins that respond to events in Dynamics 365. :contentReference[oaicite:5]{index=5}'
      },
      {
        id: 3,
        question: 'Which video is best for learning Apex fundamentals like classes, triggers, and syntax?',
        options: [
          'Becoming a Dynamics Developer',
          'Dynamics Plugin Dev',
          'Apex Programming Crash Course',
          'Coding With The Force Patterns'
        ],
        correctAnswer: 2,
        explanation: 'The “Apex Programming Crash Course” by Coderversity teaches foundational Apex concepts. :contentReference[oaicite:6]{index=6}'
      },
      {
        id: 4,
        question: 'Which resource delves into Apex design patterns and advanced architecture?',
        options: [
          'Dynamics Plugin Dev Playlist',
          'Becoming a Dynamics Developer',
          'Coding With The Force – Apex Common Library',
          'Apex Crash Course'
        ],
        correctAnswer: 2,
        explanation: 'The “Apex Common Library & Design Patterns” video covers advanced architecture and design in Apex. :contentReference[oaicite:7]{index=7}'
      },
      {
        id: 5,
        question: 'Which official site do you use for Dynamics 365 development reference and APIs?',
        options: [
          'trailhead.salesforce.com',
          'learn.microsoft.com/dynamics365',
          'enterpriseintegrationpatterns.com',
          'youtube.com'
        ],
        correctAnswer: 1,
        explanation: 'Microsoft Docs (learn.microsoft.com/dynamics365) is the official reference for Dynamics 365 developer guides.'
      },
      {
        id: 6,
        question: 'What is a plugin in Dynamics 365?',
        options: [
          'UI skin/theme',
          'Custom server-side code triggered by events',
          'Client-side script only',
          'Report layout'
        ],
        correctAnswer: 1,
        explanation: 'Plugins are server-side custom code triggered by platform events (create, update, delete).'
      },
      {
        id: 7,
        question: 'Which Apex concept is highlighted by the Crash Course video?',
        options: [
          'Lightning Web Components only',
          'Classes and Triggers in Apex',
          'Power Automate flow creation',
          'Dynamics 365 plugin code'
        ],
        correctAnswer: 1,
        explanation: 'The Crash Course covers core Apex constructs: classes, triggers, syntax, and programming basics.'
      },
      {
        id: 8,
        question: 'What design pattern is emphasized in the Apex Common Library tutorial?',
        options: [
          'Singleton only',
          'Factory, Unit of Work, Selector, Service Layer',
          'MVC only',
          'Observer only'
        ],
        correctAnswer: 1,
        explanation: 'The tutorial covers multiple design patterns including Factory, Unit of Work, Service Layer. :contentReference[oaicite:8]{index=8}'
      },
      {
        id: 9,
        question: 'Which combination is correct: Apex + Lightning means...',
        options: [
          'Backend code + UI framework',
          'Database only',
          'Excel macros',
          'Network protocol'
        ],
        correctAnswer: 0,
        explanation: 'Apex handles business logic/back-end, Lightning handles front-end UI (components).'
      },
      {
        id: 10,
        question: 'What is the Dataverse in the CRM ecosystem (Dynamics / Power Platform)?',
        options: [
          'Salesforce-only feature',
          'Underlying data platform storing entities / records',
          'File storage service',
          'Network hub'
        ],
        correctAnswer: 1,
        explanation: 'Dataverse (Common Data Service) stores the data model used by Dynamics 365 and Power Platform components.'
      }
    ]
  },

  challenge: {
    title: 'Full-stack CRM Solution Project',
    description: 'Design and build a CRM solution with advanced custom logic, integrations, UI, and architecture.',
    requirements: [
      'Design the data model (entities, relationships) for a CRM scenario (e.g. case management)',
      'Implement server-side logic: plugins/triggers in Dynamics / Apex in Salesforce',
      'Build forms and UI customizations (Lightning / Model-driven / Canvas apps)',
      'Create business process flows / workflows / flows for key business logic',
      'Integrate CRM with an external system using Web API / REST',
      'Apply design patterns (unit of work, service layers) in Apex / plugin code',
      'Implement security roles and permission models',
      'Create unit and integration tests for custom code',
      'Package solution for deployment (solutions / unmanaged → managed or packages)',
      'Document architecture, APIs, user guide, and deployment instructions'
    ],
    submissionType: 'text / code repository',
    hints: [
      'Choose realistic domain (e.g. customer support, sales pipeline, field service) to model data',
      'Modularize code — separate service, data access, validation layers',
      'Use asynchronous operations (queueable, future) for long-running tasks',
      'In Salesforce, use bulk-safe code and governor limits awareness',
      'In Dynamics, use early binding, messages, secure registration of plugins',
      'Include rollback and error-handling logic',
      'Use Microsoft / Salesforce tools for debugging (Logs, Developer Console, F12, tracing)',
      'Structure your solution for deployment lifecycle (dev → test → prod)',
      'Include a README file explaining setup, dependencies, and architecture rationale'
    ]
  }
}

  ],
  
  finalProject: {
    title: 'Specialized IT Professional Portfolio',
    description: 'Comprehensive portfolio demonstrating expertise across specialized IT domains',
    duration: '4-5 weeks',
    
    overview: 'Create a professional portfolio showcasing skills in IT audit, portal administration, and CRM development. This capstone project demonstrates your ability to work across specialized IT roles and deliver enterprise-level solutions.',
    
    requirements: [
      'Choose ONE primary specialization (IT Audit, Portal Admin, or CRM Development)',
      'Complete comprehensive project in chosen specialization',
      'Demonstrate cross-functional skills from other specializations',
      'Create enterprise-grade documentation',
      'Build working prototypes or implementations',
      'Present business value and ROI',
      'Include governance and compliance considerations',
      'Develop training and support materials'
    ],
    
    deliverables: [
      {
        title: 'Executive Summary',
        description: 'High-level overview of project, value proposition, and outcomes',
        format: 'PDF document',
        pages: '3-5 pages'
      },
      {
        title: 'Technical Specification',
        description: 'Detailed technical design and architecture documentation',
        format: 'PDF with diagrams',
        pages: '20-30 pages'
      },
      {
        title: 'Implementation Artifacts',
        description: 'Code, configurations, audit reports, or portal sites',
        format: 'Source code/configs/reports',
        pages: 'Complete implementation'
      },
      {
        title: 'Test Documentation',
        description: 'Test plans, test cases, and test results',
        format: 'PDF + Excel',
        pages: '15-20 pages'
      },
      {
        title: 'User Documentation',
        description: 'User guides, admin guides, and training materials',
        format: 'PDF + Videos',
        pages: '20+ pages'
      },
      {
        title: 'Governance & Compliance',
        description: 'Security controls, audit trails, compliance documentation',
        format: 'PDF document',
        pages: '10-15 pages'
      },
      {
        title: 'Business Case',
        description: 'ROI analysis, cost-benefit, and business justification',
        format: 'PDF + Excel',
        pages: '8-10 pages'
      },
      {
        title: 'Presentation Deck',
        description: 'Executive presentation of solution and outcomes',
        format: 'PowerPoint',
        pages: '20-25 slides'
      }
    ],
    
    projectOptions: [
      {
        specialization: 'IT Audit',
        title: 'Enterprise IT Audit & Compliance Program',
        description: 'Design and execute comprehensive IT audit program',
        requirements: [
          'Conduct enterprise-wide IT risk assessment',
          'Develop multi-year audit plan',
          'Execute audits across 3+ IT domains (security, operations, development)',
          'Create automated audit procedures using data analytics',
          'Build compliance dashboard with real-time monitoring',
          'Develop remediation tracking system',
          'Create audit management framework',
          'Present findings to executive leadership'
        ]
      },
      {
        specialization: 'Portal Administration',
        title: 'Enterprise Intranet & Collaboration Platform',
        description: 'Build complete enterprise portal solution',
        requirements: [
          'Design information architecture for 1000+ users',
          'Build SharePoint intranet with multiple hub sites',
          'Develop custom SPFx web parts',
          'Create Power Apps portal for external partners',
          'Implement enterprise search and knowledge management',
          'Build automated provisioning system',
          'Configure governance and retention policies',
          'Develop migration plan from legacy systems'
        ]
      },
      {
        specialization: 'CRM Development',
        title: 'Enterprise CRM Implementation & Customization',
        description: 'Develop complete CRM solution with integrations',
        requirements: [
          'Design CRM data model for complex business processes',
          'Build custom Dynamics 365 or Salesforce solution',
          'Develop plugins/triggers for business logic',
          'Create automated workflows and approvals',
          'Build integration with ERP and marketing systems',
          'Develop mobile app using Power Apps or Lightning',
          'Implement AI/ML features (predictive lead scoring)',
          'Create analytics dashboards and reports'
        ]
      }
    ],
    
    evaluationCriteria: [
      {
        category: 'Technical Excellence',
        weight: '30%',
        description: 'Quality of technical implementation and architecture'
      },
      {
        category: 'Business Value',
        weight: '25%',
        description: 'Demonstrated ROI and business impact'
      },
      {
        category: 'Documentation Quality',
        weight: '20%',
        description: 'Completeness and professionalism of documentation'
      },
      {
        category: 'Governance & Compliance',
        weight: '15%',
        description: 'Security, audit trails, and compliance adherence'
      },
      {
        category: 'Innovation & Best Practices',
        weight: '10%',
        description: 'Use of modern technologies and industry best practices'
      }
    ],
    
    guidelines: [
      'Choose a realistic enterprise scenario',
      'Demonstrate deep expertise in chosen specialization',
      'Show understanding of other specializations',
      'Focus on enterprise-scale solutions',
      'Include governance and compliance from the start',
      'Document architectural decisions and trade-offs',
      'Provide clear ROI and business justification',
      'Create production-ready implementations',
      'Include disaster recovery and business continuity',
      'Follow industry standards and frameworks'
    ],
    
    resources: [
      'ISACA resources for IT audit',
      'Microsoft Learn for Dynamics 365 and SharePoint',
      'Salesforce Trailhead for CRM development',
      'COBIT framework documentation',
      'SharePoint PnP (Patterns and Practices)',
      'Power Platform documentation',
      'GitHub for code repositories',
      'Azure DevOps for project management',
      'Visio/Lucidchart for architecture diagrams'
    ],
    
    timeline: [
      {
        week: 1,
        tasks: [
          'Select specialization and project scope',
          'Conduct research and requirements gathering',
          'Create technical design and architecture',
          'Develop project plan and timeline',
          'Set up development/audit environment'
        ]
      },
      {
        week: 2,
        tasks: [
          'Begin core implementation/audit execution',
          'Develop custom components or conduct audits',
          'Build integrations or control testing',
          'Create initial documentation',
          'Conduct interim testing'
        ]
      },
      {
        week: 3,
        tasks: [
          'Complete implementation/audit activities',
          'Build dashboards and reports',
          'Conduct comprehensive testing',
          'Develop governance documentation',
          'Create user training materials'
        ]
      },
      {
        week: 4,
        tasks: [
          'Finalize all documentation',
          'Conduct security and compliance review',
          'Build business case and ROI analysis',
          'Create presentation materials',
          'Prepare demo environment'
        ]
      },
      {
        week: 5,
        tasks: [
          'Final testing and quality assurance',
          'Complete all deliverables',
          'Prepare executive presentation',
          'Practice demo and presentation',
          'Submit portfolio package'
        ]
      }
    ],
    
    submissionInstructions: 'Submit complete portfolio package including all deliverables organized in professional folder structure. Include executive summary as entry point. Provide working demo environment or recorded demonstration. Include GitHub repository for code/configurations. Prepare 30-minute executive presentation.',
    
    tips: [
      'Think like an enterprise architect or senior consultant',
      'Every decision should have business justification',
      'Security and compliance are not afterthoughts',
      'Document assumptions and constraints clearly',
      'Create solutions that scale and are maintainable',
      'Include monitoring and operational procedures',
      'Show thought leadership and innovation',
      'Make presentations executive-friendly',
      'Quantify business benefits where possible',
      'Include lessons learned and future roadmap',
      'Demonstrate understanding of organizational change',
      'Create reusable templates and frameworks',
      'Show integration thinking across systems',
      'Include vendor evaluation criteria if applicable',
      'Demonstrate cost optimization strategies'
    ]
  }
};

export default specializedITRoadmap;