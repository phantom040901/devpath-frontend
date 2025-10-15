// src/data/roadmaps/technicalSupportRoadmap.js

const technicalSupportRoadmap = {
  id: 'technical-support',
  title: 'Technical Support & Help Desk Career Path',
  description: 'Master IT support, troubleshooting, customer service, and technical problem-solving',
  category: 'Technical Support',
  estimatedDuration: '14-16 weeks',
  skillsGained: [
    'Hardware & Software Troubleshooting',
    'Windows & Mac OS Support',
    'Network Troubleshooting',
    'Customer Service Excellence',
    'Ticketing Systems',
    'Remote Support Tools',
    'Active Directory',
    'IT Service Management (ITIL)',
    'Cloud Support (Microsoft 365, Google Workspace)'
  ],
  
  modules: [
    {
  id: 1,
  title: 'IT Support Fundamentals & Customer Service',
  description: 'Master IT support basics, customer service, and communication skills',
  duration: '3-4 weeks',
  difficulty: 'Beginner',

  learningResources: [
    {
      id: 1,
      title: 'Intro to IT | Google IT Support Certificate',
      type: 'video',
      platform: 'YouTube — Google Career Certificates',
      url: 'https://www.youtube.com/watch?v=f_c7PrH3rX8',
      duration: '≈ 40 mins',
      description: 'Introduction to key IT support topics (hardware, software, binary, troubleshooting)'
    },
    {
      id: 2,
      title: 'Technical Support Fundamentals (Google)',
      type: 'video',
      platform: 'YouTube',
      url: 'https://www.youtube.com/watch?v=a_s1hiy0JNs',
      duration: '≈ 4 hours (free series)',
      description: 'Comprehensive overview of computers, operating systems, networking, and troubleshooting'
    },
    {
      id: 3,
      title: 'IT Support Training for Entry-level IT Professionals',
      type: 'video',
      platform: 'YouTube — Josh Madakor',
      url: 'https://www.youtube.com/watch?v=9lRJKh4tjQ0',
      duration: '≈ 2 hours',
      description: 'Practical training for entry-level IT support and help desk roles'
    },
    {
      id: 4,
      title: 'Computer Networking Crash Course (Google IT Support)',
      type: 'video',
      platform: 'YouTube — Google Career Certificates',
      url: 'https://www.youtube.com/watch?v=PuvcEHakaXE',
      duration: '≈ 1 hour',
      description: 'Networking fundamentals explained in simple terms'
    },
    {
      id: 5,
      title: 'ITIL 4 Foundation Full Course (Free)',
      type: 'video',
      platform: 'YouTube — SkillFront',
      url: 'https://www.youtube.com/watch?v=A5VRuC72G_c',
      duration: '≈ 3 hours',
      description: 'Comprehensive introduction to ITIL 4 and service management practices'
    },
    {
      id: 6,
      title: 'ITIL 4 Explained in 10 Minutes',
      type: 'video',
      platform: 'YouTube — Simply Explained',
      url: 'https://www.youtube.com/watch?v=HBpEgGcqjHw',
      duration: '10 minutes',
      description: 'Quick overview of ITIL 4 core concepts and service value system'
    },
    {
      id: 7,
      title: 'Establish Help Desk Best Practices',
      type: 'article',
      platform: 'TechTarget',
      url: 'https://www.techtarget.com/searchenterprisedesktop/feature/Establish-help-desk-best-practices-to-improve-the-system',
      duration: '≈ 2 hours read',
      description: 'Best practices for help desk operations, ticketing, and workflows'
    }
  ],

  quiz: {
    passingScore: 70,
    questions: [
      {
        id: 1,
        question: 'What is the primary goal of an IT support professional?',
        options: [
          'Developing new software',
          'Ensuring users can effectively use IT systems by resolving issues',
          'Designing websites',
          'Writing documentation only'
        ],
        correctAnswer: 1,
        explanation: 'IT support focuses on helping users resolve technical issues so they can work effectively.'
      },
      {
        id: 2,
        question: 'According to the Google IT Support course, what is the FIRST step in troubleshooting?',
        options: [
          'Reboot the device immediately',
          'Gather information about the problem',
          'Escalate to Level 2 support',
          'Replace the hardware'
        ],
        correctAnswer: 1,
        explanation: 'Effective troubleshooting begins with gathering details about the issue and user environment.'
      },
      {
        id: 3,
        question: 'What does ITIL focus on in IT service management?',
        options: [
          'Programming standards',
          'Best practices for delivering quality IT services',
          'Hardware repair techniques',
          'Network cable installation'
        ],
        correctAnswer: 1,
        explanation: 'ITIL is a framework of best practices for managing IT services to meet business needs.'
      },
      {
        id: 4,
        question: 'What is the purpose of a Service Level Agreement (SLA)?',
        options: [
          'Define expected service standards between provider and customer',
          'Record all employee login times',
          'Store network configurations',
          'Measure user satisfaction only'
        ],
        correctAnswer: 0,
        explanation: 'An SLA defines performance expectations like response and resolution times between IT and users.'
      },
      {
        id: 5,
        question: 'In networking basics, what is the function of an IP address?',
        options: [
          'Identify a device on a network',
          'Measure internet speed',
          'Store software licenses',
          'Encrypt network data'
        ],
        correctAnswer: 0,
        explanation: 'An IP address uniquely identifies a device in a network for communication.'
      },
      {
        id: 6,
        question: 'What is a ticketing system used for in IT support?',
        options: [
          'Monitoring social media',
          'Tracking and managing user support requests',
          'Selling event tickets',
          'Scheduling team meetings'
        ],
        correctAnswer: 1,
        explanation: 'A ticketing system logs, prioritizes, and tracks user issues from start to resolution.'
      },
      {
        id: 7,
        question: 'Which soft skill is MOST important for help desk technicians?',
        options: [
          'Empathy and communication',
          'Hardware assembly speed',
          'Programming efficiency',
          'Mathematical accuracy'
        ],
        correctAnswer: 0,
        explanation: 'Empathy and clear communication are critical for providing excellent IT support.'
      },
      {
        id: 8,
        question: 'In ITIL, what does the term "Incident" refer to?',
        options: [
          'Any unplanned interruption to an IT service',
          'Scheduled maintenance event',
          'Hardware upgrade',
          'Training session'
        ],
        correctAnswer: 0,
        explanation: 'An Incident is an unplanned disruption that affects service availability or quality.'
      },
      {
        id: 9,
        question: 'What does “escalation” mean in help desk support?',
        options: [
          'Transferring a complex issue to higher-level support',
          'Increasing ticket count',
          'Closing unresolved tickets',
          'Decreasing priority'
        ],
        correctAnswer: 0,
        explanation: 'Escalation ensures issues are handled by staff with the right expertise.'
      },
      {
        id: 10,
        question: 'What is the main purpose of documentation in IT support?',
        options: [
          'Record steps taken and create reusable knowledge for future issues',
          'Store passwords securely',
          'Archive emails',
          'Replace customer communication'
        ],
        correctAnswer: 0,
        explanation: 'Documenting fixes builds a knowledge base and supports consistent issue resolution.'
      }
    ]
  },

  challenge: {
    title: 'Help Desk Simulation Project',
    description: 'Simulate handling a day of IT support tickets to demonstrate practical support skills.',
    requirements: [
      'Review 10 mock support ticket scenarios (provided)',
      'Prioritize tickets by urgency and business impact',
      'Write detailed responses for each issue',
      'Document troubleshooting steps clearly',
      'Identify tickets requiring escalation',
      'Create 3 knowledge base articles for common issues',
      'Draft professional email replies to users',
      'Track time spent per ticket',
      'Explain customer service best practices applied',
      'Reflect on lessons learned and improvements'
    ],
    submissionType: 'text',
    hints: [
      'Use the troubleshooting process: Identify → Research → Test → Resolve → Document',
      'Apply empathetic and professional communication at all times',
      'Escalate when an issue exceeds your scope or permissions',
      'Reference ITIL concepts like Incident and Problem Management',
      'Include before/after results where possible',
      'Structure KB articles with title, symptoms, cause, and solution'
    ]
  }
},

    {
  id: 2,
  title: 'Windows & Software Support',
  description: 'Master Windows OS, software troubleshooting, and application support',
  duration: '4 weeks',
  difficulty: 'Intermediate',

  learningResources: [
    {
      id: 1,
      title: 'An Overview of Windows (CompTIA A+ 220-1102)',
      type: 'video',
      platform: 'YouTube — Professor Messer',
      url: 'https://www.youtube.com/watch?v=3MHDU4kFChU',
      duration: '≈ 7 minutes',
      description: 'Windows editions, features, and differences as part of free A+ Core 2 training'
    },
    {
      id: 2,
      title: 'Windows Architecture Explained',
      type: 'video',
      platform: 'YouTube — PowerCert Animated Videos',
      url: 'https://www.youtube.com/watch?v=POAX0iFzMIU',
      duration: '≈ 10 minutes',
      description: 'Understanding how Windows processes, memory, and system components interact'
    },
    {
      id: 3,
      title: 'CompTIA A+ 220-1102 Training Course (Free Videos)',
      type: 'video series',
      platform: 'Professor Messer',
      url: 'https://www.professormesser.com/free-a-plus-training/220-1102/220-1102-video/220-1102-training-course/',
      duration: '≈ 9 h 34 min (total)',
      description: 'Complete free course covering operating systems, security, and troubleshooting'
    },
    {
      id: 4,
      title: 'Linux Commands (CompTIA A+ 220-1102)',
      type: 'video',
      platform: 'YouTube — Professor Messer',
      url: 'https://www.youtube.com/watch?v=wqfdU4hngxw',
      duration: '≈ 7 minutes',
      description: 'Essential Linux command line tools for IT support professionals'
    },
    {
      id: 5,
      title: 'PowerCert Animated Videos — Windows & IT Topics',
      type: 'video playlist',
      platform: 'YouTube — PowerCert Animated Videos',
      url: 'https://www.youtube.com/c/PowerCertAnimatedVideos/playlists',
      duration: 'varies by video',
      description: 'Animated lessons on networking, Windows administration, and troubleshooting'
    },
    {
      id: 6,
      title: 'Deploy Windows by Using Microsoft Deployment Toolkit (MDT)',
      type: 'article / documentation',
      platform: 'Microsoft Learn',
      url: 'https://learn.microsoft.com/en-us/windows/deployment/windows-deployment-scenarios',
      duration: '≈ 2 hours read',
      description: 'Official Microsoft documentation on deploying and configuring Windows at scale'
    },
    {
      id: 7,
      title: 'How to Change IP Address on Windows 10/11 (Tutorial)',
      type: 'video',
      platform: 'YouTube — TechHut',
      url: 'https://www.youtube.com/watch?v=qWNqpWz0lQI',
      duration: '≈ 10 minutes',
      description: 'Hands-on tutorial showing how to modify IP configuration on Windows systems'
    }
  ],

  quiz: {
    passingScore: 75,
    questions: [
      {
        id: 1,
        question: 'What is the Windows Registry?',
        options: [
          'A list of registered users',
          'A database storing system and application configuration',
          'A software store',
          'A backup system'
        ],
        correctAnswer: 1,
        explanation: 'The Windows Registry is a hierarchical database storing low-level settings for the operating system and applications.'
      },
      {
        id: 2,
        question: 'What is Safe Mode in Windows?',
        options: [
          'Secure browsing mode',
          'Diagnostic mode with minimal drivers and services',
          'Administrator mode',
          'Backup mode'
        ],
        correctAnswer: 1,
        explanation: 'Safe Mode is a diagnostic startup mode that loads Windows with minimal drivers and services for troubleshooting.'
      },
      {
        id: 3,
        question: 'What does BSOD stand for?',
        options: [
          'Basic System Operating Device',
          'Blue Screen of Death',
          'Boot Sequence On Demand',
          'Binary System Output Display'
        ],
        correctAnswer: 1,
        explanation: 'BSOD (Blue Screen of Death) is a critical error screen displayed when Windows encounters a fatal system error.'
      },
      {
        id: 4,
        question: 'What is Group Policy in Windows?',
        options: [
          'User groups',
          'Centralized management of user and computer settings',
          'Meeting scheduler',
          'File sharing permissions'
        ],
        correctAnswer: 1,
        explanation: 'Group Policy is a Windows feature for centralized management and configuration of operating systems, applications, and user settings.'
      },
      {
        id: 5,
        question: 'What is the purpose of System Restore?',
        options: [
          'Restore deleted files',
          'Revert system to previous state without affecting personal files',
          'Backup system',
          'Reinstall Windows'
        ],
        correctAnswer: 1,
        explanation: 'System Restore reverts computer files and settings to an earlier point in time without affecting personal files.'
      },
      {
        id: 6,
        question: 'What is Task Manager used for?',
        options: [
          'Creating tasks',
          'Monitoring processes, performance, and ending tasks',
          'Scheduling meetings',
          'Managing projects'
        ],
        correctAnswer: 1,
        explanation: 'Task Manager monitors running applications, processes, CPU/memory usage, and allows ending unresponsive tasks.'
      },
      {
        id: 7,
        question: 'What is a device driver?',
        options: [
          'A person who drives devices',
          'Software enabling OS to communicate with hardware',
          'A hardware component',
          'A storage device'
        ],
        correctAnswer: 1,
        explanation: 'A device driver is software that enables the operating system to communicate with and control hardware devices.'
      },
      {
        id: 8,
        question: 'What does "boot" mean?',
        options: [
          'Footwear',
          'Starting up the computer and loading OS',
          'Shutting down',
          'Restarting applications'
        ],
        correctAnswer: 1,
        explanation: 'Boot (bootstrap) refers to the process of starting up a computer and loading the operating system into memory.'
      },
      {
        id: 9,
        question: 'What is the difference between hibernate and sleep?',
        options: [
          'No difference',
          'Hibernate saves to disk and powers off; sleep keeps in RAM',
          'Hibernate is faster',
          'Sleep uses more power'
        ],
        correctAnswer: 1,
        explanation: 'Hibernate saves the session to disk and powers off; Sleep keeps the session in RAM and uses minimal power.'
      },
      {
        id: 10,
        question: 'What is Windows Update?',
        options: [
          'Version upgrade',
          'Service delivering security patches and feature updates',
          'Antivirus software',
          'Backup service'
        ],
        correctAnswer: 1,
        explanation: 'Windows Update is a service that delivers security patches, bug fixes, and feature updates to Windows systems.'
      },
      {
        id: 11,
        question: 'What is UAC (User Account Control)?',
        options: [
          'User access card',
          'Security feature requiring permission for system changes',
          'Account settings',
          'User agreement'
        ],
        correctAnswer: 1,
        explanation: 'UAC is a security feature that requires administrator permission before allowing changes to the system.'
      },
      {
        id: 12,
        question: 'What is Event Viewer?',
        options: [
          'Calendar application',
          'Tool for viewing system logs and error messages',
          'Event planning software',
          'Video player'
        ],
        correctAnswer: 1,
        explanation: 'Event Viewer is a Windows tool that displays detailed information about system events, errors, and warnings.'
      },
      {
        id: 13,
        question: 'What does "disk cleanup" do?',
        options: [
          'Formats the drive',
          'Removes temporary and unnecessary files to free space',
          'Defragments the disk',
          'Repairs disk errors'
        ],
        correctAnswer: 1,
        explanation: 'Disk Cleanup removes temporary files, system files, and other unnecessary data to free up disk space.'
      },
      {
        id: 14,
        question: 'What is the purpose of System File Checker (sfc)?',
        options: [
          'Check file sizes',
          'Scan and repair corrupted Windows system files',
          'Search for files',
          'Organize files'
        ],
        correctAnswer: 1,
        explanation: 'System File Checker (sfc /scannow) scans and repairs corrupted Windows system files.'
      },
      {
        id: 15,
        question: 'What is Microsoft 365?',
        options: [
          '365-day trial',
          'Cloud-based productivity suite with Office apps and services',
          'Windows version',
          'Antivirus software'
        ],
        correctAnswer: 1,
        explanation: 'Microsoft 365 is a cloud-based subscription service offering Office applications, email, storage, and collaboration tools.'
      }
    ]
  },

  challenge: {
    title: 'Windows Troubleshooting Scenarios',
    description: 'Diagnose and resolve complex Windows issues',
    requirements: [
      'Troubleshoot slow computer performance (document 10 optimization steps)',
      'Resolve application crash issues (diagnostic process)',
      'Fix Windows Update failure (step-by-step resolution)',
      'Recover from boot failure using Safe Mode or Recovery Environment',
      'Perform System Restore from recovery environment (Rstrui.exe)',
      'Diagnose and fix network connectivity issues',
      'Remove malware/virus from infected system',
      'Restore deleted files or recover corrupted data',
      'Configure Group Policy for security settings',
      'Set up and manage user accounts and permissions',
      'Create detailed troubleshooting documentation for each scenario'
    ],
    submissionType: 'text',
    hints: [
      'Use built-in Windows tools: Task Manager, Event Viewer, Resource Monitor',
      'Check for recent changes before issues started',
      'Run System File Checker (sfc) and DISM for system repairs',
      'Update drivers and Windows to latest versions',
      'Use MSConfig to diagnose startup issues',
      'Document each step taken and results observed',
      'Include screenshots or command outputs',
      'Provide prevention tips for future issues'
    ]
  }
},

    {
  id: 3,
  title: 'Hardware & Network Support',
  description: 'Master hardware troubleshooting, networking basics, and infrastructure support',
  duration: '4 weeks',
  difficulty: 'Advanced',

  learningResources: [
    {
      id: 1,
      title: 'CompTIA A+ Core 1 (220-1101) Full Training Course',
      type: 'video series',
      platform: 'Professor Messer',
      url: 'https://www.professormesser.com/free-a-plus-training/220-1101/220-1101-video/220-1101-training-course/',
      duration: '≈ 9h 36m total run time',
      description: 'Complete coverage of PC hardware, networking, mobile devices, and troubleshooting concepts.'
    },
    {
      id: 2,
      title: 'How to Pass Your 220-1101 & 220-1102 A+ Exams',
      type: 'video',
      platform: 'YouTube – Professor Messer',
      url: 'https://www.youtube.com/watch?v=87t6P5ZHTP0',
      duration: '≈ 11 minutes',
      description: 'Exam preparation strategies and understanding of core A+ exam domains.'
    },
    {
      id: 3,
      title: 'Networking Fundamentals — IP, Ports, and Protocols',
      type: 'video',
      platform: 'YouTube – Professor Messer',
      url: 'https://www.youtube.com/playlist?list=PLG49S3nxzAnnOmvg5UGVenB_qQgsh01uC',
      duration: '≈ 1 hour (selected modules)',
      description: 'Introduction to networking concepts such as IP addressing, ports, and communication protocols.'
    },
    {
      id: 4,
      title: 'PowerCert Animated Videos — Hardware & Networking',
      type: 'video playlist',
      platform: 'YouTube – PowerCert Animated Videos',
      url: 'https://www.youtube.com/c/PowerCertAnimatedVideos',
      duration: 'varies by video',
      description: 'Animated lessons explaining computer components, cables, devices, and troubleshooting processes.'
    },
    {
      id: 5,
      title: 'Subnet Mask — Explained',
      type: 'video',
      platform: 'YouTube – PowerCert Animated Videos',
      url: 'https://www.youtube.com/watch?v=s_Ntt6eTn94',
      duration: '≈ 6 minutes',
      description: 'Easy-to-understand subnetting explanation for beginner to intermediate networking learners.'
    },
    {
      id: 6,
      title: 'CompTIA A+ Core Series — Official Guide',
      type: 'article / documentation',
      platform: 'CompTIA',
      url: 'https://www.comptia.org/content/guides/comptia-a-plus-core-series',
      duration: '≈ 2 hours read',
      description: 'Official CompTIA guide for understanding Core 1 & Core 2 objectives and exam domains.'
    }
  ],

  quiz: {
    passingScore: 75,
    questions: [
      {
        id: 1,
        question: 'During POST, which component is being verified?',
        options: [
          'Operating System',
          'Hardware components like RAM and CPU',
          'User settings',
          'Network adapters only'
        ],
        correctAnswer: 1,
        explanation: 'POST (Power-On Self-Test) checks core hardware like memory, CPU, and motherboard before booting the OS.'
      },
      {
        id: 2,
        question: 'Which component stores temporary data used by the CPU?',
        options: [
          'HDD',
          'SSD',
          'RAM',
          'NIC'
        ],
        correctAnswer: 2,
        explanation: 'RAM (Random Access Memory) temporarily stores data that the CPU accesses quickly during operations.'
      },
      {
        id: 3,
        question: 'Which statement correctly describes the difference between HDD and SSD?',
        options: [
          'Both use magnetic storage',
          'HDDs have no moving parts, SSDs do',
          'HDD uses spinning disks, SSD uses flash memory',
          'They perform the same speed'
        ],
        correctAnswer: 2,
        explanation: 'HDDs rely on magnetic spinning platters; SSDs use flash memory with faster access and no moving parts.'
      },
      {
        id: 4,
        question: 'What does DNS do in a network?',
        options: [
          'Assigns IP addresses automatically',
          'Translates domain names to IP addresses',
          'Encrypts traffic',
          'Provides Wi-Fi connectivity'
        ],
        correctAnswer: 1,
        explanation: 'DNS (Domain Name System) converts domain names like google.com into IP addresses that computers can use.'
      },
      {
        id: 5,
        question: 'Which command displays network configuration information in Windows?',
        options: [
          'ping',
          'ipconfig',
          'netstat',
          'nslookup'
        ],
        correctAnswer: 1,
        explanation: 'The ipconfig command shows a computer’s current IP configuration, gateway, and subnet mask.'
      },
      {
        id: 6,
        question: 'Which protocol automatically assigns IP addresses to devices?',
        options: [
          'DNS',
          'HTTP',
          'DHCP',
          'FTP'
        ],
        correctAnswer: 2,
        explanation: 'DHCP (Dynamic Host Configuration Protocol) automatically assigns IP configuration to devices on a network.'
      },
      {
        id: 7,
        question: 'What is a subnet mask used for?',
        options: [
          'Masking IP addresses for privacy',
          'Defining network and host portions of an IP address',
          'Encrypting data packets',
          'Assigning MAC addresses'
        ],
        correctAnswer: 1,
        explanation: 'Subnet masks divide an IP address into network and host parts, defining which devices share a network.'
      },
      {
        id: 8,
        question: 'What does the ping command do?',
        options: [
          'Tests connectivity between devices',
          'Configures wireless settings',
          'Monitors CPU temperature',
          'Sends emails'
        ],
        correctAnswer: 0,
        explanation: 'Ping sends ICMP packets to test network connectivity and measure response times.'
      },
      {
        id: 9,
        question: 'What is a router’s main function?',
        options: [
          'Connect devices within the same network',
          'Route traffic between different networks',
          'Store website data locally',
          'Provide antivirus protection'
        ],
        correctAnswer: 1,
        explanation: 'Routers forward packets between separate networks, typically linking a LAN to the internet.'
      },
      {
        id: 10,
        question: 'What is thermal paste used for in a PC build?',
        options: [
          'Improving heat transfer between CPU and heatsink',
          'Securing the heatsink in place',
          'Insulating components',
          'Lubricating fan bearings'
        ],
        correctAnswer: 0,
        explanation: 'Thermal paste enhances heat transfer from the CPU to the heatsink, preventing overheating.'
      }
    ]
  },

  challenge: {
    title: 'Hardware & Network Support Project',
    description: 'Diagnose and resolve real-world hardware and networking problems.',
    requirements: [
      'Diagnose a PC that fails POST (beep codes, display issues)',
      'Replace faulty RAM and verify successful boot',
      'Troubleshoot overheating with thermal management tools',
      'Resolve “No Internet” issues using ipconfig and ping',
      'Configure a wireless router and secure Wi-Fi network',
      'Test and document LAN connectivity and speed',
      'Assign static IP to a workstation and verify connectivity',
      'Set up and troubleshoot a network printer',
      'Use PowerCert references to identify correct cable types',
      'Document findings and create a support summary report'
    ],
    submissionType: 'text',
    hints: [
      'Refer to POST error codes for startup diagnostics',
      'Ensure proper seating of RAM and GPU',
      'Monitor temperatures with free tools like HWMonitor',
      'Use ping and ipconfig for initial network troubleshooting',
      'Double-check DNS and DHCP configurations',
      'Use CompTIA A+ video references for step-by-step repair techniques'
    ]
  }
},

    
  {
  id: 4,
  title: 'Advanced Support & Cloud Services',
  description: 'Master advanced troubleshooting, cloud platforms, and support automation',
  duration: '3-4 weeks',
  difficulty: 'Expert',

  learningResources: [
  {
    id: 1,
    title: "John Savill — Windows & Infrastructure (channel)",
    type: "video playlist / channel",
    platform: "YouTube — John Savill",
    url: "https://www.youtube.com/channel/UCpIn7ox7j7bH_OFj7tYouOQ",
    duration: "varies (pick deep-dive videos)",
    description: "Windows troubleshooting, AD, DNS, DHCP, event log diagnostics, and Azure infrastructure."
  },
  {
    id: 2,
    title: "PowerShell for IT Support (Shane Young)",
    type: "video playlist / channel",
    platform: "YouTube — Shane Young",
    url: "https://www.youtube.com/@ShanesCows",
    duration: "varies (PowerShell for Beginners playlist)",
    description: "Practical PowerShell scripting and automation tutorials for IT tasks and provisioning."
  },
  {
    id: 3,
    title: "Microsoft 365 — Official Playlists",
    type: "video playlist",
    platform: "YouTube — Microsoft 365",
    url: "https://www.youtube.com/c/microsoft365/playlists",
    duration: "varies (multiple admin videos & walkthroughs)",
    description: "Official Microsoft 365 admin, Exchange Online, Teams, OneDrive, and security configuration videos."
  },
  {
    id: 4,
    title: "Google Workspace Admin — Official Playlist",
    type: "video playlist",
    platform: "YouTube — Google Workspace",
    url: "https://www.youtube.com/playlist?list=PLdNQT0j4QFT6Wj4lqq0QS2GBgOROqEoPB",
    duration: "varies (admin console, security, device mgmt)",
    description: "Google Workspace admin console tutorials: user management, security, and device policies."
  },
  {
    id: 5,
    title: "ServiceNow — Docs + Free Full Course Playlist",
    type: "official docs + video playlist",
    platform: "ServiceNow / YouTube (Gautham Digital Learning)",
    url: "https://docs.servicenow.com/",
    altVideo: "https://www.youtube.com/playlist?list=PLceS1NsRXd6ClFZuqc3upWZdLnauI6TFt",
    duration: "varies (docs + ~7+ hrs video content)",
    description: "Official ServiceNow documentation for ITSM plus a free YouTube full-course playlist for admin & developer topics."
  }
]
,

  quiz: {
    passingScore: 80,
    questions: [
      {
        id: 1,
        question: 'What is PowerShell primarily used for in IT support?',
        options: [
          'Gaming performance optimization',
          'Task automation and system configuration',
          'File compression',
          'Video rendering'
        ],
        correctAnswer: 1,
        explanation: 'PowerShell automates system administration and supports remote management and scripting.'
      },
      {
        id: 2,
        question: 'What is Microsoft 365 used for in IT environments?',
        options: [
          'Application development',
          'Cloud productivity, collaboration, and email services',
          'Database hosting',
          'Game streaming'
        ],
        correctAnswer: 1,
        explanation: 'Microsoft 365 offers cloud-based productivity tools like Teams, Exchange, and SharePoint.'
      },
      {
        id: 3,
        question: 'What is Conditional Access in Azure AD?',
        options: [
          'Temporary access permissions',
          'Security policy that grants or denies access based on specific conditions',
          'Firewall configuration setting',
          'DNS filtering tool'
        ],
        correctAnswer: 1,
        explanation: 'Conditional Access enforces policies based on user, device, or location to secure resources.'
      },
      {
        id: 4,
        question: 'What does ServiceNow primarily provide?',
        options: [
          'Email hosting service',
          'IT Service Management (ITSM) and workflow automation',
          'Video conferencing tool',
          'Hardware diagnostics'
        ],
        correctAnswer: 1,
        explanation: 'ServiceNow is a platform for automating IT service management and digital workflows.'
      },
      {
        id: 5,
        question: 'What is Google Workspace Admin Console used for?',
        options: [
          'Developing Android apps',
          'Managing users, devices, and security settings in Google Workspace',
          'Hosting websites',
          'Running database servers'
        ],
        correctAnswer: 1,
        explanation: 'The Admin Console allows admins to manage user accounts, security, and devices in Google Workspace.'
      }
    ]
  },

  challenge: {
    title: 'Enterprise Support & Cloud Migration Project',
    description: 'Execute a full-scale support project integrating Microsoft 365, PowerShell automation, and ServiceNow workflows.',
    requirements: [
      'Create migration plan for 100 users to Microsoft 365',
      'Automate user provisioning using PowerShell scripts',
      'Configure MFA and Conditional Access policies',
      'Implement incident tracking workflow in ServiceNow',
      'Set up self-service knowledge base for common issues'
    ],
    submissionType: 'text',
    hints: [
      'Test PowerShell scripts in sandbox environments before deployment',
      'Use Microsoft 365 admin center for license and group management',
      'Include rollback and verification steps in migration plan',
      'Document each process with screenshots and logs'
    ]
  }
}


  ],
  
  finalProject: {
    title: 'Complete IT Support Portfolio Project',
    description: 'Comprehensive help desk and technical support portfolio',
    duration: '3-4 weeks',
    
    overview: 'Create a complete IT support portfolio demonstrating troubleshooting expertise, customer service skills, technical documentation, and support process management. This project showcases your readiness for a professional help desk or technical support role.',
    
    requirements: [
      'Develop comprehensive IT support handbook',
      'Create troubleshooting guides for 20+ common issues',
      'Build knowledge base with searchable articles',
      'Design support workflow and escalation procedures',
      'Develop customer service training materials',
      'Create hardware and software inventory system',
      'Document Windows and network troubleshooting procedures',
      'Build PowerShell automation scripts for support tasks',
      'Design remote support procedures and tools setup',
      'Create incident response and security procedures',
      'Develop SLA and performance metrics tracking',
      'Build self-service portal mockup/prototype'
    ],
    
    deliverables: [
      {
        title: 'IT Support Handbook',
        description: 'Complete reference guide for help desk operations',
        format: 'PDF document',
        pages: '30-40 pages'
      },
      {
        title: 'Knowledge Base',
        description: 'Searchable repository with 25+ troubleshooting articles',
        format: 'Wiki or website',
        pages: '25+ articles'
      },
      {
        title: 'Troubleshooting Guides',
        description: 'Step-by-step guides for Windows, hardware, network issues',
        format: 'PDF documents',
        pages: '20+ guides'
      },
      {
        title: 'Support Process Documentation',
        description: 'Workflows, escalation procedures, and SLA definitions',
        format: 'Flowcharts + PDF',
        pages: '10-15 pages'
      },
      {
        title: 'PowerShell Automation Scripts',
        description: 'Scripts for user management, system checks, reporting',
        format: 'PS1 files with documentation',
        pages: '10+ scripts'
      },
      {
        title: 'Customer Service Guide',
        description: 'Communication best practices and scenario handling',
        format: 'PDF document',
        pages: '8-12 pages'
      },
      {
        title: 'Security Incident Response Plan',
        description: 'Procedures for handling security incidents',
        format: 'PDF document',
        pages: '5-8 pages'
      },
      {
        title: 'Hardware Inventory System',
        description: 'Asset tracking spreadsheet or database',
        format: 'Excel/Access database',
        pages: 'Complete system'
      },
      {
        title: 'Remote Support Toolkit',
        description: 'Guide to remote support tools and setup',
        format: 'PDF + software configs',
        pages: '10 pages'
      },
      {
        title: 'Video Tutorials',
        description: '5+ video guides for common support tasks',
        format: 'Video files/YouTube',
        pages: '30-50 minutes total'
      }
    ],
    
    evaluationCriteria: [
      {
        category: 'Technical Knowledge',
        weight: '30%',
        description: 'Depth and accuracy of technical solutions'
      },
      {
        category: 'Documentation Quality',
        weight: '25%',
        description: 'Clarity, completeness, and professionalism of docs'
      },
      {
        category: 'Problem-Solving Approach',
        weight: '20%',
        description: 'Logical troubleshooting methodology'
      },
      {
        category: 'Customer Service Focus',
        weight: '15%',
        description: 'User-friendly communication and support approach'
      },
      {
        category: 'Organization & Process',
        weight: '10%',
        description: 'Well-structured workflows and procedures'
      }
    ],
    
    guidelines: [
      'Write for end users, not just technical staff',
      'Include screenshots and diagrams for clarity',
      'Use consistent formatting and templates',
      'Provide both quick fixes and detailed solutions',
      'Include prevention tips with each solution',
      'Test all procedures before documenting',
      'Make knowledge base easily searchable',
      'Consider accessibility in all documentation',
      'Include troubleshooting decision trees',
      'Add video tutorials for visual learners'
    ],
    
    resources: [
      'Microsoft Docs for Windows reference',
      'Screen recording: OBS Studio, Camtasia',
      'Documentation: Word, Google Docs',
      'Knowledge base: Notion, Confluence, MediaWiki',
      'Diagram tools: Draw.io, Visio, Lucidchart',
      'Ticketing systems: osTicket, Spiceworks',
      'Remote tools: TeamViewer, AnyDesk, Chrome Remote Desktop',
      'PowerShell ISE for script development'
    ],
    
    timeline: [
      {
        week: 1,
        tasks: [
          'Outline IT support handbook structure',
          'Research and compile common issues list',
          'Create troubleshooting guide templates',
          'Begin writing Windows troubleshooting guides',
          'Set up knowledge base platform'
        ]
      },
      {
        week: 2,
        tasks: [
          'Complete hardware troubleshooting guides',
          'Write network connectivity solutions',
          'Develop customer service scenarios',
          'Create support workflow diagrams',
          'Write PowerShell automation scripts'
        ]
      },
      {
        week: 3,
        tasks: [
          'Build knowledge base articles',
          'Create video tutorials',
          'Develop security incident procedures',
          'Design hardware inventory system',
          'Write remote support documentation'
        ]
      },
      {
        week: 4,
        tasks: [
          'Complete all documentation',
          'Test scripts and procedures',
          'Create self-service portal mockup',
          'Organize all deliverables',
          'Final review and polish'
        ]
      }
    ],
    
    submissionInstructions: 'Submit organized portfolio with all deliverables in clearly labeled folders. Include a master index document explaining each deliverable. Provide links to knowledge base, videos, and any online resources. Create a portfolio website or PDF showcasing your work.',
    
    tips: [
      'Start with most common issues users face',
      'Use real scenarios from online forums for authenticity',
      'Make troubleshooting guides beginner-friendly',
      'Include both symptoms and solutions in knowledge base',
      'Use consistent troubleshooting methodology throughout',
      'Add "Related Articles" links in knowledge base',
      'Create Quick Start guides for new users',
      'Include both text and visual instructions',
      'Test documentation with non-technical users',
      'Keep language simple and jargon-free',
      'Add search optimization keywords to articles',
      'Include troubleshooting flowcharts for complex issues',
      'Document "lessons learned" from each scenario',
      'Create cheat sheets for quick reference'
    ]
  }
};

export default technicalSupportRoadmap;