// src/data/roadmaps/networkingSecurity.js

export const networkingSecurityRoadmap = {
  id: 'networking-security',
  title: 'Networking & Security Career Path',
  description: 'Master network infrastructure, cybersecurity principles, and security operations',
  category: 'Networking & Security',
  estimatedDuration: '16-20 weeks',
  skillsGained: [
    'Network Administration',
    'Cybersecurity Fundamentals',
    'Firewall Configuration',
    'Security Operations',
    'Incident Response',
    'Network Protocols',
    'Penetration Testing',
    'Security Compliance'
  ],
  
  modules: [
    {
      id: 1,
      title: 'Networking Fundamentals',
      description: 'Learn the foundation of computer networks and protocols',
      duration: '4 weeks',
      difficulty: 'Beginner',
      
      learningResources: [
        {
          id: 1,
          title: 'Computer Networking Course - Network Engineering',
          type: 'video',
          platform: 'YouTube - freeCodeCamp',
          url: 'https://www.youtube.com/watch?v=qiQR5rTSshw',
          duration: '9 hours',
          description: 'Complete networking course covering OSI model, TCP/IP, subnetting, and more'
        },
        {
          id: 2,
          title: 'Networking Basics: OSI Model Explained',
          type: 'video',
          platform: 'YouTube - NetworkChuck',
          url: 'https://www.youtube.com/watch?v=3kfO61Mensg',
          duration: '15 minutes',
          description: 'Clear explanation of the 7 layers of OSI model'
        },
        {
          id: 3,
          title: 'Subnetting Made Easy',
          type: 'video',
          platform: 'YouTube - Sunny Classroom',
          url: 'https://www.youtube.com/watch?v=s_Ntt6eTn94',
          duration: '20 minutes',
          description: 'Learn IP subnetting with practical examples'
        },
        {
          id: 4,
          title: 'Introduction to Networking',
          type: 'article',
          platform: 'Cisco Networking Academy',
          url: 'https://www.netacad.com/courses/networking',
          duration: '2 hours read',
          description: 'Official Cisco networking basics documentation'
        },
        {
          id: 5,
          title: 'TCP/IP Protocol Suite',
          type: 'article',
          platform: 'GeeksforGeeks',
          url: 'https://www.geeksforgeeks.org/tcp-ip-model/',
          duration: '30 minutes read',
          description: 'Deep dive into TCP/IP protocol architecture'
        },
        {
          id: 6,
          title: 'Network Troubleshooting Tools',
          type: 'interactive',
          platform: 'Practical Networking',
          url: 'https://www.practicalnetworking.net/',
          duration: '1 hour',
          description: 'Learn ping, traceroute, netstat, and other essential tools'
        }
      ],
      
      quiz: {
        passingScore: 70,
        questions: [
          {
            id: 1,
            question: 'Which layer of the OSI model is responsible for routing packets across networks?',
            options: [
              'Data Link Layer',
              'Network Layer',
              'Transport Layer',
              'Session Layer'
            ],
            correctAnswer: 1,
            explanation: 'The Network Layer (Layer 3) handles logical addressing and routing of packets between networks.'
          },
          {
            id: 2,
            question: 'What is the default subnet mask for a Class C IP address?',
            options: [
              '255.0.0.0',
              '255.255.0.0',
              '255.255.255.0',
              '255.255.255.255'
            ],
            correctAnswer: 2,
            explanation: 'Class C networks use 255.255.255.0 as the default subnet mask, providing 254 usable host addresses.'
          },
          {
            id: 3,
            question: 'Which protocol is used to automatically assign IP addresses to devices on a network?',
            options: [
              'DNS',
              'DHCP',
              'FTP',
              'HTTP'
            ],
            correctAnswer: 1,
            explanation: 'DHCP (Dynamic Host Configuration Protocol) automatically assigns IP addresses and network configuration to devices.'
          },
          {
            id: 4,
            question: 'What is the purpose of the TCP three-way handshake?',
            options: [
              'To encrypt data transmission',
              'To establish a reliable connection',
              'To route packets efficiently',
              'To compress network traffic'
            ],
            correctAnswer: 1,
            explanation: 'The TCP three-way handshake (SYN, SYN-ACK, ACK) establishes a reliable connection before data transmission.'
          },
          {
            id: 5,
            question: 'Which command is used to test connectivity between two network devices?',
            options: [
              'netstat',
              'ping',
              'traceroute',
              'ipconfig'
            ],
            correctAnswer: 1,
            explanation: 'The ping command sends ICMP echo requests to test network connectivity and measure round-trip time.'
          },
          {
            id: 6,
            question: 'What does NAT stand for in networking?',
            options: [
              'Network Access Technology',
              'Network Address Translation',
              'New Authentication Token',
              'Network Adapter Test'
            ],
            correctAnswer: 1,
            explanation: 'NAT (Network Address Translation) translates private IP addresses to public IPs for internet access.'
          },
          {
            id: 7,
            question: 'Which port number does HTTPS use by default?',
            options: [
              '80',
              '443',
              '8080',
              '3389'
            ],
            correctAnswer: 1,
            explanation: 'HTTPS (HTTP Secure) uses port 443 by default for encrypted web traffic.'
          },
          {
            id: 8,
            question: 'What is the maximum number of usable hosts in a /24 subnet?',
            options: [
              '254',
              '255',
              '256',
              '512'
            ],
            correctAnswer: 0,
            explanation: 'A /24 subnet has 256 total addresses, minus 2 (network and broadcast), leaving 254 usable host addresses.'
          },
          {
            id: 9,
            question: 'Which device operates at Layer 2 of the OSI model?',
            options: [
              'Router',
              'Switch',
              'Hub',
              'Firewall'
            ],
            correctAnswer: 1,
            explanation: 'Switches operate at Layer 2 (Data Link Layer) using MAC addresses to forward frames.'
          },
          {
            id: 10,
            question: 'What is the primary function of DNS?',
            options: [
              'Encrypt network traffic',
              'Assign IP addresses automatically',
              'Translate domain names to IP addresses',
              'Monitor network performance'
            ],
            correctAnswer: 2,
            explanation: 'DNS (Domain Name System) translates human-readable domain names (like google.com) to IP addresses.'
          }
        ]
      },
      
      challenge: {
        title: 'Network Design Challenge',
        description: 'Design a basic network topology for a small office',
        requirements: [
          'Create a network diagram for an office with 3 departments (HR, Sales, IT)',
          'Each department needs 20 computers',
          'Use appropriate subnet masks for each department',
          'Include a router, switches, and firewall in your design',
          'Document IP addressing scheme',
          'Explain how devices in different departments will communicate'
        ],
        submissionType: 'text',
        hints: [
          'Consider using /27 subnets for each department',
          'Place the router as the gateway between departments',
          'Use VLANs to segment department traffic',
          'Document IP ranges for each subnet'
        ]
      }
    },
    
    {
      id: 2,
      title: 'Cybersecurity Fundamentals',
      description: 'Understanding security principles, threats, and defense mechanisms',
      duration: '5 weeks',
      difficulty: 'Intermediate',
      
      learningResources: [
        {
          id: 1,
          title: 'Cybersecurity Full Course for Beginners',
          type: 'video',
          platform: 'YouTube - MyGreatLearning',
          url: 'https://www.youtube.com/watch?v=U_P23SqJaDc',
          duration: '3 hours',
          description: 'Complete introduction to cybersecurity concepts and practices'
        },
        {
          id: 2,
          title: 'CompTIA Security+ Full Course',
          type: 'video',
          platform: 'YouTube - Professor Messer',
          url: 'https://www.professormesser.com/security-plus/sy0-601/sy0-601-video/sy0-601-comptia-security-plus-course/',
          duration: '20+ hours',
          description: 'Industry-standard security certification training'
        },
        {
          id: 3,
          title: 'CIA Triad: Confidentiality, Integrity, Availability',
          type: 'article',
          platform: 'NIST Cybersecurity',
          url: 'https://www.nist.gov/cybersecurity',
          duration: '30 minutes read',
          description: 'Understanding the three pillars of information security'
        },
        {
          id: 4,
          title: 'Common Cyber Attacks and Prevention',
          type: 'article',
          platform: 'CISA - Cybersecurity Tips',
          url: 'https://www.cisa.gov/cybersecurity-best-practices',
          duration: '1 hour read',
          description: 'Learn about phishing, malware, ransomware, and DDoS attacks'
        },
        {
          id: 5,
          title: 'Introduction to Cryptography',
          type: 'video',
          platform: 'YouTube - Computerphile',
          url: 'https://www.youtube.com/watch?v=jhXCTbFnK8o',
          duration: '25 minutes',
          description: 'Understand encryption, hashing, and digital signatures'
        },
        {
          id: 6,
          title: 'Security Frameworks: NIST & ISO 27001',
          type: 'article',
          platform: 'Security Standards',
          url: 'https://www.iso.org/isoiec-27001-information-security.html',
          duration: '45 minutes read',
          description: 'Learn industry security frameworks and compliance'
        },
        {
          id: 7,
          title: 'TryHackMe - Pre Security Path',
          type: 'interactive',
          platform: 'TryHackMe',
          url: 'https://tryhackme.com/path/outline/presecurity',
          duration: '4-6 hours',
          description: 'Hands-on introduction to cybersecurity concepts (free account needed)'
        }
      ],
      
      quiz: {
        passingScore: 75,
        questions: [
          {
            id: 1,
            question: 'What does the CIA triad stand for in cybersecurity?',
            options: [
              'Central Intelligence Agency',
              'Confidentiality, Integrity, Availability',
              'Cyber Information Analysis',
              'Computer Internet Access'
            ],
            correctAnswer: 1,
            explanation: 'The CIA triad represents the three core principles of information security: Confidentiality, Integrity, and Availability.'
          },
          {
            id: 2,
            question: 'Which type of attack involves tricking users into revealing sensitive information?',
            options: [
              'DDoS Attack',
              'SQL Injection',
              'Phishing',
              'Buffer Overflow'
            ],
            correctAnswer: 2,
            explanation: 'Phishing is a social engineering attack that tricks users into revealing passwords, credit cards, or other sensitive data.'
          },
          {
            id: 3,
            question: 'What is the purpose of a firewall?',
            options: [
              'To encrypt data',
              'To filter network traffic based on security rules',
              'To backup data automatically',
              'To speed up internet connection'
            ],
            correctAnswer: 1,
            explanation: 'A firewall monitors and filters incoming/outgoing network traffic based on predetermined security rules.'
          },
          {
            id: 4,
            question: 'Which encryption type uses the same key for encryption and decryption?',
            options: [
              'Asymmetric encryption',
              'Public key encryption',
              'Symmetric encryption',
              'Hash encryption'
            ],
            correctAnswer: 2,
            explanation: 'Symmetric encryption uses the same secret key for both encryption and decryption (e.g., AES, DES).'
          },
          {
            id: 5,
            question: 'What is a zero-day vulnerability?',
            options: [
              'A vulnerability fixed within 24 hours',
              'A security flaw unknown to the software vendor',
              'A vulnerability that has been patched',
              'A scheduled security update'
            ],
            correctAnswer: 1,
            explanation: 'A zero-day vulnerability is a security flaw unknown to the vendor, leaving zero days to fix before potential exploitation.'
          },
          {
            id: 6,
            question: 'Which protocol provides secure remote access to network devices?',
            options: [
              'Telnet',
              'SSH',
              'FTP',
              'HTTP'
            ],
            correctAnswer: 1,
            explanation: 'SSH (Secure Shell) provides encrypted remote access, replacing the insecure Telnet protocol.'
          },
          {
            id: 7,
            question: 'What is the primary purpose of a VPN?',
            options: [
              'Speed up internet connection',
              'Block advertisements',
              'Create a secure, encrypted connection over a public network',
              'Increase bandwidth'
            ],
            correctAnswer: 2,
            explanation: 'VPN (Virtual Private Network) creates an encrypted tunnel over public networks, ensuring privacy and security.'
          },
          {
            id: 8,
            question: 'Which of the following is NOT a type of malware?',
            options: [
              'Ransomware',
              'Trojan',
              'Firewall',
              'Worm'
            ],
            correctAnswer: 2,
            explanation: 'Firewall is a security device. Ransomware, Trojans, and Worms are all types of malicious software.'
          },
          {
            id: 9,
            question: 'What does MFA stand for in security?',
            options: [
              'Multiple File Access',
              'Multi-Factor Authentication',
              'Managed Firewall Application',
              'Malware Filter Algorithm'
            ],
            correctAnswer: 1,
            explanation: 'MFA (Multi-Factor Authentication) requires two or more verification methods to access an account or system.'
          },
          {
            id: 10,
            question: 'Which security principle states that users should only have access to resources they need?',
            options: [
              'Defense in Depth',
              'Security by Obscurity',
              'Least Privilege',
              'Zero Trust'
            ],
            correctAnswer: 2,
            explanation: 'The Principle of Least Privilege ensures users have only the minimum access necessary to perform their job functions.'
          },
          {
            id: 11,
            question: 'What is a DDoS attack designed to do?',
            options: [
              'Steal passwords',
              'Encrypt files for ransom',
              'Overwhelm a system with traffic to make it unavailable',
              'Install backdoors'
            ],
            correctAnswer: 2,
            explanation: 'DDoS (Distributed Denial of Service) floods a target with massive traffic to disrupt or crash the service.'
          },
          {
            id: 12,
            question: 'Which hashing algorithm is considered most secure for passwords?',
            options: [
              'MD5',
              'SHA-1',
              'bcrypt',
              'Base64'
            ],
            correctAnswer: 2,
            explanation: 'bcrypt is a strong, adaptive hashing algorithm designed specifically for password storage. MD5 and SHA-1 are outdated.'
          },
          {
            id: 13,
            question: 'What is penetration testing?',
            options: [
              'Installing antivirus software',
              'Authorized simulated cyberattack to test system security',
              'Backing up critical data',
              'Monitoring network traffic'
            ],
            correctAnswer: 1,
            explanation: 'Penetration testing (ethical hacking) involves authorized attacks to identify and fix security vulnerabilities.'
          },
          {
            id: 14,
            question: 'Which port is commonly used for SSH connections?',
            options: [
              '21',
              '22',
              '80',
              '443'
            ],
            correctAnswer: 1,
            explanation: 'SSH uses port 22 by default for secure remote connections.'
          },
          {
            id: 15,
            question: 'What does IDS stand for in cybersecurity?',
            options: [
              'Internet Data Service',
              'Intrusion Detection System',
              'Internal Defense Strategy',
              'Information Distribution Software'
            ],
            correctAnswer: 1,
            explanation: 'IDS (Intrusion Detection System) monitors network traffic for suspicious activity and potential threats.'
          }
        ]
      },
      
      challenge: {
        title: 'Security Assessment Challenge',
        description: 'Perform a security assessment of a hypothetical scenario',
        requirements: [
          'Scenario: A small company has 50 employees using Windows computers, one file server, and basic WiFi network',
          'Identify at least 8 potential security vulnerabilities',
          'For each vulnerability, explain the risk level (High/Medium/Low)',
          'Propose specific security controls to mitigate each risk',
          'Create a prioritized action plan (what to fix first)',
          'Include recommendations for employee security training topics'
        ],
        submissionType: 'text',
        hints: [
          'Consider physical security, network security, and user security',
          'Think about password policies, WiFi encryption, backup systems',
          'Evaluate firewall configuration, antivirus protection, update management',
          'Consider social engineering risks and employee awareness'
        ]
      }
    },
    
    {
      id: 3,
      title: 'Network & Security Operations',
      description: 'Advanced network administration and security monitoring',
      duration: '4 weeks',
      difficulty: 'Advanced',
      
      learningResources: [
        {
          id: 1,
          title: 'Wireshark Tutorial for Beginners',
          type: 'video',
          platform: 'YouTube - NetworkChuck',
          url: 'https://www.youtube.com/watch?v=lb1Dw0elw0Q',
          duration: '30 minutes',
          description: 'Learn packet analysis with Wireshark for network troubleshooting'
        },
        {
          id: 2,
          title: 'Firewall Configuration and Management',
          type: 'video',
          platform: 'YouTube - David Bombal',
          url: 'https://www.youtube.com/watch?v=kDEX1HXybrU',
          duration: '1 hour',
          description: 'Hands-on firewall setup and rule configuration'
        },
        {
          id: 3,
          title: 'Security Information and Event Management (SIEM)',
          type: 'article',
          platform: 'Splunk Documentation',
          url: 'https://www.splunk.com/en_us/cyber-security.html',
          duration: '1 hour read',
          description: 'Understanding SIEM systems for security monitoring'
        },
        {
          id: 4,
          title: 'Incident Response and Handling',
          type: 'article',
          platform: 'SANS Institute',
          url: 'https://www.sans.org/blog/the-five-steps-of-incident-response/',
          duration: '45 minutes read',
          description: 'Learn the incident response lifecycle'
        },
        {
          id: 5,
          title: 'Virtual Private Networks (VPN) Deep Dive',
          type: 'video',
          platform: 'YouTube - PowerCert',
          url: 'https://www.youtube.com/watch?v=R-JUOpCgTZc',
          duration: '20 minutes',
          description: 'Understanding VPN protocols and implementations'
        },
        {
          id: 6,
          title: 'Network Security Best Practices',
          type: 'article',
          platform: 'Cisco Security',
          url: 'https://www.cisco.com/c/en/us/products/security/what-is-network-security.html',
          duration: '30 minutes read',
          description: 'Industry best practices for securing networks'
        },
        {
          id: 7,
          title: 'Log Analysis and Monitoring',
          type: 'interactive',
          platform: 'TryHackMe - SOC Level 1',
          url: 'https://tryhackme.com/paths',
          duration: '8-10 hours',
          description: 'Practical log analysis and security operations training'
        }
      ],
      
      quiz: {
        passingScore: 75,
        questions: [
          {
            id: 1,
            question: 'What is the primary purpose of Wireshark?',
            options: [
              'Firewall configuration',
              'Network packet analysis',
              'Antivirus scanning',
              'Password management'
            ],
            correctAnswer: 1,
            explanation: 'Wireshark is a network protocol analyzer that captures and inspects network packets for troubleshooting and analysis.'
          },
          {
            id: 2,
            question: 'Which of the following is a stateful firewall characteristic?',
            options: [
              'It only filters based on IP addresses',
              'It tracks the state of network connections',
              'It cannot inspect packet contents',
              'It only works with UDP traffic'
            ],
            correctAnswer: 1,
            explanation: 'Stateful firewalls track connection states and make decisions based on the context of traffic, not just individual packets.'
          },
          {
            id: 3,
            question: 'What does SIEM stand for?',
            options: [
              'System Information Exchange Manager',
              'Security Information and Event Management',
              'Server Intrusion Enforcement Module',
              'Secure Internet Email Messenger'
            ],
            correctAnswer: 1,
            explanation: 'SIEM systems collect, analyze, and correlate security logs from multiple sources to detect threats and incidents.'
          },
          {
            id: 4,
            question: 'Which phase comes FIRST in the incident response lifecycle?',
            options: [
              'Containment',
              'Eradication',
              'Preparation',
              'Recovery'
            ],
            correctAnswer: 2,
            explanation: 'Preparation is the first phase, involving planning, training, and establishing procedures before incidents occur.'
          },
          {
            id: 5,
            question: 'What type of VPN is commonly used for site-to-site connections?',
            options: [
              'SSL VPN',
              'IPSec VPN',
              'PPTP VPN',
              'Remote Access VPN'
            ],
            correctAnswer: 1,
            explanation: 'IPSec VPN is commonly used for site-to-site connections, creating secure tunnels between networks.'
          },
          {
            id: 6,
            question: 'What is the purpose of network segmentation?',
            options: [
              'Increase bandwidth',
              'Reduce latency',
              'Isolate network sections to limit attack spread',
              'Simplify network management'
            ],
            correctAnswer: 2,
            explanation: 'Network segmentation divides networks into smaller sections to contain breaches and limit lateral movement.'
          },
          {
            id: 7,
            question: 'Which protocol is used for secure email transmission?',
            options: [
              'SMTP',
              'POP3',
              'TLS/SSL with SMTP',
              'FTP'
            ],
            correctAnswer: 2,
            explanation: 'TLS/SSL protocols encrypt SMTP traffic for secure email transmission (SMTPS uses port 465 or 587).'
          },
          {
            id: 8,
            question: 'What is a honeypot in cybersecurity?',
            options: [
              'A backup system',
              'A decoy system to attract and study attackers',
              'An encryption algorithm',
              'A type of firewall'
            ],
            correctAnswer: 1,
            explanation: 'A honeypot is a deliberately vulnerable system used to attract attackers and study their techniques.'
          },
          {
            id: 9,
            question: 'Which tool is commonly used for network scanning and discovery?',
            options: [
              'Wireshark',
              'Nmap',
              'PuTTY',
              'FileZilla'
            ],
            correctAnswer: 1,
            explanation: 'Nmap (Network Mapper) is a powerful tool for network discovery, port scanning, and security auditing.'
          },
          {
            id: 10,
            question: 'What does ACL stand for in network security?',
            options: [
              'Automatic Configuration List',
              'Access Control List',
              'Advanced Cyber Lockdown',
              'Application Control Layer'
            ],
            correctAnswer: 1,
            explanation: 'ACL (Access Control List) defines rules that filter network traffic based on various criteria like IP, port, or protocol.'
          },
          {
            id: 11,
            question: 'What is the primary difference between IDS and IPS?',
            options: [
              'IDS detects threats, IPS actively blocks them',
              'IDS is hardware-based, IPS is software-based',
              'IDS monitors external traffic, IPS monitors internal',
              'There is no difference'
            ],
            correctAnswer: 0,
            explanation: 'IDS (Intrusion Detection System) passively monitors and alerts, while IPS (Intrusion Prevention System) actively blocks threats.'
          },
          {
            id: 12,
            question: 'Which port does RDP (Remote Desktop Protocol) use by default?',
            options: [
              '22',
              '3389',
              '443',
              '8080'
            ],
            correctAnswer: 1,
            explanation: 'RDP uses port 3389 by default for remote Windows desktop connections.'
          },
          {
            id: 13,
            question: 'What is the purpose of a DMZ (Demilitarized Zone) in network architecture?',
            options: [
              'Speed up internet connection',
              'Provide a buffer zone between internal network and internet',
              'Store backup data',
              'Encrypt all network traffic'
            ],
            correctAnswer: 1,
            explanation: 'DMZ is a network segment that separates public-facing servers from the internal network, adding a security layer.'
          },
          {
            id: 14,
            question: 'What does MAC filtering do on a wireless network?',
            options: [
              'Encrypts WiFi signals',
              'Speeds up connection',
              'Allows/blocks devices based on their MAC addresses',
              'Changes WiFi password automatically'
            ],
            correctAnswer: 2,
            explanation: 'MAC filtering allows only devices with specified MAC addresses to connect to the network.'
          },
          {
            id: 15,
            question: 'Which encryption standard is currently recommended for WiFi networks?',
            options: [
              'WEP',
              'WPA',
              'WPA2',
              'WPA3'
            ],
            correctAnswer: 3,
            explanation: 'WPA3 is the latest and most secure WiFi encryption standard, though WPA2 is still widely acceptable.'
          }
        ]
      },
      
      challenge: {
        title: 'Security Operations Center (SOC) Simulation',
        description: 'Analyze a security incident and respond appropriately',
        requirements: [
          'Scenario: You receive alerts about unusual login attempts from multiple countries within 10 minutes on a user account',
          'Analyze the scenario and identify the type of attack',
          'Document your step-by-step incident response process',
          'List all the logs/data you would collect for investigation',
          'Determine immediate containment actions',
          'Propose short-term and long-term remediation steps',
          'Create a brief incident report (who, what, when, where, how, impact)'
        ],
        submissionType: 'text',
        hints: [
          'Consider if this is a credential stuffing or account compromise attack',
          'Think about disabling the account temporarily',
          'Review authentication logs, firewall logs, SIEM alerts',
          'Consider implementing MFA and geofencing',
          'Document timeline and affected systems'
        ]
      }
    },
    
    {
      id: 4,
      title: 'Advanced Security & Compliance',
      description: 'Professional security practices, compliance, and career preparation',
      duration: '3-4 weeks',
      difficulty: 'Expert',
      
      learningResources: [
        {
          id: 1,
          title: 'Ethical Hacking Full Course',
          type: 'video',
          platform: 'YouTube - Edureka',
          url: 'https://www.youtube.com/watch?v=dz7Ntp7KQGA',
          duration: '10 hours',
          description: 'Complete ethical hacking and penetration testing course'
        },
        {
          id: 2,
          title: 'Cloud Security Fundamentals',
          type: 'video',
          platform: 'YouTube - AWS Training',
          url: 'https://www.youtube.com/watch?v=a9__D53WsUs',
          duration: '2 hours',
          description: 'Security in cloud environments (AWS, Azure, GCP)'
        },
        {
          id: 3,
          title: 'GDPR and Data Privacy Compliance',
          type: 'article',
          platform: 'GDPR.eu',
          url: 'https://gdpr.eu/',
          duration: '1 hour read',
          description: 'Understanding data protection regulations and compliance'
        },
        {
          id: 4,
          title: 'Security Auditing and Risk Assessment',
          type: 'article',
          platform: 'ISACA Standards',
          url: 'https://www.isaca.org/resources/news-and-trends/industry-news/2021/what-is-a-security-audit',
          duration: '45 minutes read',
          description: 'Learn to conduct security audits and risk assessments'
        },
        {
          id: 5,
          title: 'Cybersecurity Career Paths',
          type: 'video',
          platform: 'YouTube - Cyberspatial',
          url: 'https://www.youtube.com/watch?v=wWKbQIfEGrQ',
          duration: '30 minutes',
          description: 'Overview of career opportunities in cybersecurity'
        },
        {
          id: 6,
          title: 'Security Certifications Guide',
          type: 'article',
          platform: 'CompTIA Career Roadmap',
          url: 'https://www.comptia.org/certifications/which-certification',
          duration: '30 minutes read',
          description: 'Guide to security certifications (Security+, CEH, CISSP)'
        },
        {
          id: 7,
          title: 'Security Documentation Best Practices',
          type: 'article',
          platform: 'SANS Institute',
          url: 'https://www.sans.org/white-papers/',
          duration: '1 hour read',
          description: 'Learn to create professional security documentation'
        },
        {
          id: 8,
          title: 'Hack The Box Academy',
          type: 'interactive',
          platform: 'HackTheBox',
          url: 'https://academy.hackthebox.com/',
          duration: '20+ hours',
          description: 'Hands-on penetration testing labs and challenges'
        }
      ],
      
      quiz: {
        passingScore: 80,
        questions: [
          {
            id: 1,
            question: 'What is the primary goal of penetration testing?',
            options: [
              'To damage systems intentionally',
              'To identify and exploit vulnerabilities before attackers do',
              'To install antivirus software',
              'To train employees'
            ],
            correctAnswer: 1,
            explanation: 'Penetration testing ethically exploits vulnerabilities to help organizations fix them before malicious actors can.'
          },
          {
            id: 2,
            question: 'Which phase of ethical hacking involves gathering information about the target?',
            options: [
              'Exploitation',
              'Reconnaissance',
              'Post-exploitation',
              'Reporting'
            ],
            correctAnswer: 1,
            explanation: 'Reconnaissance (information gathering) is the first phase where hackers collect data about the target system.'
          },
          {
            id: 3,
            question: 'What does GDPR primarily regulate?',
            options: [
              'Network infrastructure',
              'Personal data protection and privacy',
              'Software licensing',
              'Internet speed'
            ],
            correctAnswer: 1,
            explanation: 'GDPR (General Data Protection Regulation) is EU legislation protecting personal data and privacy rights.'
          },
          {
            id: 4,
            question: 'Which security framework is specifically designed for critical infrastructure?',
            options: [
              'ISO 27001',
              'NIST Cybersecurity Framework',
              'PCI DSS',
              'HIPAA'
            ],
            correctAnswer: 1,
            explanation: 'The NIST Cybersecurity Framework provides guidelines for critical infrastructure protection and risk management.'
          },
          {
            id: 5,
            question: 'What is a SQL injection attack?',
            options: [
              'Injecting hardware into servers',
              'Exploiting input fields to execute malicious database queries',
              'Installing SQL databases',
              'Encrypting SQL data'
            ],
            correctAnswer: 1,
            explanation: 'SQL injection exploits vulnerable input fields to execute unauthorized database commands, potentially accessing or modifying data.'
          },
          {
            id: 6,
            question: 'What is the purpose of a Security Audit?',
            options: [
              'To fix all security issues automatically',
              'To assess and evaluate security controls and compliance',
              'To train employees on security',
              'To purchase security tools'
            ],
            correctAnswer: 1,
            explanation: 'Security audits systematically evaluate an organization\'s security posture, controls, and compliance with standards.'
          },
          {
            id: 7,
            question: 'Which cloud security responsibility belongs to the customer in most cloud models?',
            options: [
              'Physical datacenter security',
              'Data encryption and access control',
              'Network infrastructure hardware',
              'Virtualization layer security'
            ],
            correctAnswer: 1,
            explanation: 'In shared responsibility models, customers typically manage data security, encryption, and access controls.'
          },
          {
            id: 8,
            question: 'What is the principle of "Defense in Depth"?',
            options: [
              'Using only one strong firewall',
              'Implementing multiple layers of security controls',
              'Focusing only on perimeter security',
              'Relying on antivirus software alone'
            ],
            correctAnswer: 1,
            explanation: 'Defense in Depth uses multiple security layers so if one fails, others still provide protection.'
          },
          {
            id: 9,
            question: 'What does CVE stand for in vulnerability management?',
            options: [
              'Computer Virus Encyclopedia',
              'Common Vulnerabilities and Exposures',
              'Cyber Verification Entity',
              'Central Vulnerability Enforcement'
            ],
            correctAnswer: 1,
            explanation: 'CVE is a standardized identifier for publicly known cybersecurity vulnerabilities.'
          },
          {
            id: 10,
            question: 'Which certification is considered entry-level for IT security professionals?',
            options: [
              'CISSP',
              'CompTIA Security+',
              'CISM',
              'OSCP'
            ],
            correctAnswer: 1,
            explanation: 'CompTIA Security+ is widely recognized as the foundational certification for cybersecurity careers.'
          },
          {
            id: 11,
            question: 'What is a "supply chain attack" in cybersecurity?',
            options: [
              'Attacking shipping companies',
              'Compromising a trusted third-party vendor to access targets',
              'Stealing physical products',
              'DDoS on e-commerce sites'
            ],
            correctAnswer: 1,
            explanation: 'Supply chain attacks compromise trusted vendors or software to infiltrate target organizations through the supply chain.'
          },
          {
            id: 12,
            question: 'What is the primary purpose of a Business Continuity Plan (BCP)?',
            options: [
              'Increase profits',
              'Ensure critical operations continue during/after disruptions',
              'Train new employees',
              'Upgrade technology'
            ],
            correctAnswer: 1,
            explanation: 'BCP ensures essential business functions continue during disasters, cyberattacks, or other disruptions.'
          },
          {
            id: 13,
            question: 'What does "privilege escalation" mean in security context?',
            options: [
              'Giving users more privileges intentionally',
              'Exploiting flaws to gain higher access levels than authorized',
              'Upgrading software licenses',
              'Promoting employees'
            ],
            correctAnswer: 1,
            explanation: 'Privilege escalation exploits vulnerabilities to gain unauthorized elevated access (e.g., user to admin).'
          },
          {
            id: 14,
            question: 'Which framework is mandatory for organizations handling credit card data?',
            options: [
              'HIPAA',
              'PCI DSS',
              'FERPA',
              'SOX'
            ],
            correctAnswer: 1,
            explanation: 'PCI DSS (Payment Card Industry Data Security Standard) is required for organizations that process credit card transactions.'
          },
          {
            id: 15,
            question: 'What is "threat intelligence" in cybersecurity?',
            options: [
              'Training employees on threats',
              'Collected information about threats to inform security decisions',
              'Antivirus software updates',
              'Firewall configurations'
            ],
            correctAnswer: 1,
            explanation: 'Threat intelligence involves collecting and analyzing information about current/emerging threats to improve defenses.'
          },
          {
            id: 16,
            question: 'What is the purpose of a disaster recovery plan?',
            options: [
              'Prevent all disasters',
              'Restore IT systems and data after a disaster',
              'Train employees for emergencies',
              'Purchase insurance'
            ],
            correctAnswer: 1,
            explanation: 'Disaster recovery plans outline procedures to restore critical IT infrastructure and data after disruptions.'
          },
          {
            id: 17,
            question: 'What is "security orchestration" in modern security operations?',
            options: [
              'Playing security awareness videos',
              'Automating and coordinating security tools and processes',
              'Organizing security team meetings',
              'Creating security policies'
            ],
            correctAnswer: 1,
            explanation: 'Security orchestration automates and integrates various security tools and workflows for efficient incident response.'
          },
          {
            id: 18,
            question: 'Which technique helps prevent cross-site scripting (XSS) attacks?',
            options: [
              'Using strong passwords',
              'Input validation and output encoding',
              'Firewall configuration',
              'Network segmentation'
            ],
            correctAnswer: 1,
            explanation: 'Input validation and output encoding sanitize user input to prevent malicious script injection in web applications.'
          },
          {
            id: 19,
            question: 'What is "security awareness training" primarily aimed at?',
            options: [
              'Teaching employees to configure firewalls',
              'Educating users about security threats and safe practices',
              'Training IT staff on new tools',
              'Certifying security professionals'
            ],
            correctAnswer: 1,
            explanation: 'Security awareness training educates all employees about recognizing and preventing security threats like phishing.'
          },
          {
            id: 20,
            question: 'What career path focuses on proactively searching for threats within networks?',
            options: [
              'Help Desk Technician',
              'Threat Hunter',
              'Web Developer',
              'Database Administrator'
            ],
            correctAnswer: 1,
            explanation: 'Threat Hunters proactively search for hidden threats and advanced persistent threats (APTs) within networks.'
          }
        ]
      },
      
      challenge: {
        title: 'Comprehensive Security Project',
        description: 'Create a complete security strategy for an organization',
        requirements: [
          'Scenario: You are hired as the first security professional for a 200-employee tech company',
          'Create a comprehensive security program from scratch',
          'Include: Risk assessment methodology, security policies (at least 5), technical controls, security architecture diagram',
          'Develop an incident response plan with clear roles and procedures',
          'Design a security awareness training program for employees',
          'Create a compliance checklist for relevant regulations',
          'Propose security tools and technologies (with budget justification)',
          'Develop metrics/KPIs to measure security program effectiveness'
        ],
        submissionType: 'text',
        hints: [
          'Start with risk assessment to prioritize efforts',
          'Consider people, processes, and technology',
          'Include policies: Acceptable Use, Password, Incident Response, Data Classification, Remote Work',
          'Think about network security, endpoint security, data security',
          'Consider cloud security if they use cloud services',
          'Include both preventive and detective controls',
          'Plan for security monitoring and continuous improvement'
        ]
      }
    }
  ],
  
  finalProject: {
    title: 'Network Security Implementation Project',
    description: 'Design and document a complete network security solution',
    duration: '2-3 weeks',
    
    overview: 'Apply everything you\'ve learned to create a professional-grade network security implementation for a real-world scenario. This capstone project will demonstrate your ability to design, implement, and document enterprise network security.',
    
    requirements: [
      'Design a secure network architecture for a medium-sized organization (500 users, 3 office locations)',
      'Create detailed network diagrams with proper segmentation (DMZ, internal zones, guest networks, VLANs)',
      'Document comprehensive firewall rules and access control policies for all network zones',
      'Implement a security monitoring strategy (tools, log sources, alerting rules, response procedures)',
      'Create an incident response playbook covering at least 5 common security scenarios',
      'Develop complete security documentation: policies (minimum 5), procedures, and user guidelines',
      'Design disaster recovery and backup strategy with RTO/RPO targets',
      'Include cost analysis and ROI justification for all security investments',
      'Create an executive presentation explaining your design decisions and security posture'
    ],
    
    deliverables: [
      {
        title: 'Network Architecture Diagrams',
        description: 'Professional quality diagrams showing network topology, security zones, and data flows',
        format: 'PDF or PNG (use Draw.io, Lucidchart, or similar)',
        pages: '3-5 diagrams'
      },
      {
        title: 'Security Policy Document',
        description: 'Comprehensive policies covering access control, password management, acceptable use, incident response, and data classification',
        format: 'PDF document',
        pages: '10-15 pages'
      },
      {
        title: 'Firewall Configuration Document',
        description: 'Complete firewall rule set with justification for each rule, including zone definitions and ACLs',
        format: 'PDF or Excel spreadsheet',
        pages: '5-8 pages'
      },
      {
        title: 'Incident Response Playbook',
        description: 'Step-by-step procedures for responding to common incidents (malware, data breach, DDoS, insider threat, phishing)',
        format: 'PDF document',
        pages: '8-12 pages'
      },
      {
        title: 'Security Monitoring Dashboard Design',
        description: 'Mock-up or description of security monitoring dashboard with key metrics, alerts, and visualizations',
        format: 'PDF with screenshots or diagrams',
        pages: '3-5 pages'
      },
      {
        title: 'Executive Summary',
        description: 'High-level overview for non-technical executives covering security posture, risks addressed, and investment justification',
        format: 'PDF document',
        pages: '2-3 pages'
      },
      {
        title: 'Technical Presentation',
        description: 'Comprehensive presentation explaining your design, implementation approach, and security benefits',
        format: 'PowerPoint or Google Slides',
        pages: '15-25 slides'
      }
    ],
    
    evaluationCriteria: [
      {
        category: 'Completeness',
        weight: '25%',
        description: 'All required deliverables submitted with appropriate level of detail'
      },
      {
        category: 'Technical Accuracy',
        weight: '25%',
        description: 'Correct application of security principles, protocols, and best practices'
      },
      {
        category: 'Practical Feasibility',
        weight: '20%',
        description: 'Design is realistic and implementable with available technologies and budget'
      },
      {
        category: 'Documentation Quality',
        weight: '15%',
        description: 'Clear, professional documentation with proper formatting and organization'
      },
      {
        category: 'Security Effectiveness',
        weight: '15%',
        description: 'Design effectively addresses security risks and follows defense-in-depth principles'
      }
    ],
    
    guidelines: [
      'Use real-world security tools and technologies in your design (pfSense, Cisco, Palo Alto, Splunk, etc.)',
      'Reference industry standards and frameworks (NIST, ISO 27001, CIS Controls)',
      'Consider compliance requirements (GDPR, PCI DSS if applicable)',
      'Include both technical and administrative security controls',
      'Think about scalability and future growth',
      'Balance security with usability and business needs',
      'Provide cost estimates for hardware, software, and personnel',
      'Include training and awareness program for employees'
    ],
    
    resources: [
      'Draw.io or Lucidchart for network diagrams',
      'NIST Cybersecurity Framework for security structure',
      'CIS Controls for prioritizing security measures',
      'SANS Incident Response templates',
      'Real-world security architecture examples online',
      'Vendor documentation (Cisco, Palo Alto, Fortinet)',
      'Security policy templates (SANS, NIST)',
      'Cost estimation tools and vendor pricing guides'
    ],
    
    timeline: [
      {
        week: 1,
        tasks: [
          'Research and planning',
          'Network architecture design',
          'Create network diagrams',
          'Define security zones and requirements'
        ]
      },
      {
        week: 2,
        tasks: [
          'Develop security policies and procedures',
          'Create firewall rule set',
          'Design monitoring and incident response',
          'Document disaster recovery plan'
        ]
      },
      {
        week: 3,
        tasks: [
          'Finalize all documentation',
          'Create executive summary',
          'Build presentation',
          'Review and polish all deliverables',
          'Prepare for presentation/submission'
        ]
      }
    ],
    
    submissionInstructions: 'Compile all deliverables into a single organized folder or ZIP file. Include a README file with table of contents and brief description of each deliverable. Be prepared to present your work and answer questions about your design decisions.',
    
    tips: [
      'Start with threat modeling - what are you protecting against?',
      'Use the principle of least privilege throughout your design',
      'Layer your security controls (defense in depth)',
      'Make your documentation clear enough for someone else to implement',
      'Include diagrams and visuals to support your explanations',
      'Cite your sources and reference industry standards',
      'Show your work - explain WHY you made each design decision',
      'Test your logic - would this actually work in the real world?'
    ]
  }
};

export default networkingSecurityRoadmap;