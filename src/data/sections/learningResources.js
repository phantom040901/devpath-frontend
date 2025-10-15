// src/data/sections/learningResources.js

export const learningResources = {
  // Academic Subjects
  "Operating Systems": {
  threshold: 70,
  beginner: [
    {
      id: "os_basics_full_course_0",
      title: "Operating System Basics - Full Course",
      url: "https://www.youtube.com/watch?v=vBURTt97EkA",
      platform: "freeCodeCamp",
      duration: "2.5 hours",
      type: "video",
      description: "Complete introduction to OS concepts, processes, threads, and memory management"
    },
    {
      id: "process_management_fundamentals_1",
      title: "Process Management Fundamentals",
      url: "https://www.geeksforgeeks.org/introduction-of-process-management/",
      platform: "GeeksforGeeks",
      duration: "45 min",
      type: "article",
      description: "Understanding processes, threads, scheduling algorithms, and synchronization"
    },
    {
      id: "os_practice_quiz_2",
      title: "Operating Systems Practice Quiz",
      url: "https://www.sanfoundry.com/operating-system-questions-answers/",
      platform: "Sanfoundry",
      duration: "1 hour",
      type: "practice",
      description: "1000+ MCQs to test your understanding of OS concepts"
    }
  ],
  intermediate: [
    {
      id: "memory_management_deep_dive_0",
      title: "Memory Management Deep Dive",
      url: "https://www.youtube.com/watch?v=qdkxXygc3rE",
      platform: "Neso Academy",
      duration: "3 hours",
      type: "video",
      description: "Virtual memory, paging, segmentation, and memory allocation explained in depth"
    },
    {
      id: "deadlock_and_synchronization_1",
      title: "Deadlock and Synchronization",
      url: "https://www.geeksforgeeks.org/operating-systems/deadlock-detection-recovery/",
      platform: "GeeksforGeeks",
      duration: "1.5 hours",
      type: "article",
      description: "Deadlock prevention, avoidance, detection, and recovery mechanisms"
    }
  ],
  advanced: [
    {
      id: "linux_kernel_development_0",
      title: "Linux Kernel Development",
      url: "https://www.kernel.org/doc/html/latest/",
      platform: "Linux Kernel Docs",
      duration: "20 hours",
      type: "article",
      description: "Dive deep into Linux kernel architecture, modules, and system calls"
    }
  ]
},


  "Algorithms": {
    threshold: 70,
    beginner: [
      {
        id: "algorithms_for_beginners_0",
        title: "Algorithms for Beginners",
        url: "https://www.youtube.com/watch?v=8hly31xKli0",
        platform: "freeCodeCamp",
        duration: "2 hours",
        type: "video",
        description: "Introduction to algorithms, time complexity, and Big O notation"
      },
      {
        id: "sorting_algorithms_visuali_1",
        title: "Sorting Algorithms Visualized",
        url: "https://www.youtube.com/watch?v=kPRA0W1kECg",
        platform: "YouTube",
        duration: "40 min",
        type: "video",
        description: "Visual explanation of bubble, selection, insertion, merge, and quick sort"
      },
      {
        id: "algorithm_practice_easy_le_2",
        title: "Algorithm Practice - Easy Level",
        url: "https://www.hackerrank.com/domains/algorithms",
        platform: "HackerRank",
        duration: "5 hours",
        type: "practice",
        description: "Solve 50+ easy algorithm problems with instant feedback"
      },
      {
        id: "search_algorithms_tutorial_3",
        title: "Search Algorithms Tutorial",
        url: "https://www.programiz.com/dsa/algorithm",
        platform: "Programiz",
        duration: "1 hour",
        type: "interactive",
        description: "Linear search, binary search with interactive examples"
      }
    ],
    intermediate: [
      {
        id: "data_structures_algorithms_0",
        title: "Data Structures & Algorithms - Complete Course",
        url: "https://www.youtube.com/watch?v=RBSGKlAvoiM",
        platform: "freeCodeCamp",
        duration: "5 hours",
        type: "video",
        description: "Comprehensive DS&A with graph algorithms and dynamic programming"
      },
      {
        id: "dynamic_programming_patter_1",
        title: "Dynamic Programming Patterns",
        url: "https://leetcode.com/discuss/general-discussion/458695/dynamic-programming-patterns",
        platform: "LeetCode",
        duration: "3 hours",
        type: "article",
        description: "Master common DP patterns with examples and practice problems"
      },
      {
        id: "graph_algorithms_visualiza_2",
        title: "Graph Algorithms Visualization",
        url: "https://visualgo.net/en/graphds",
        platform: "VisuAlgo",
        duration: "2 hours",
        type: "interactive",
        description: "Interactive visualization of BFS, DFS, Dijkstra's, and more"
      }
    ],
    advanced: [
      {
        id: "competitive_programming_te_0",
        title: "Competitive Programming Techniques",
        url: "https://cp-algorithms.com/",
        platform: "CP-Algorithms",
        duration: "30 hours",
        type: "article",
        description: "Advanced algorithms for competitive programming"
      }
    ]
  },

  "Programming": {
    threshold: 70,
    beginner: [
      {
        id: "python_full_course_for_beg_0",
        title: "Python Full Course for Beginners",
        url: "https://www.youtube.com/watch?v=rfscVS0vtbw",
        platform: "freeCodeCamp",
        duration: "4.5 hours",
        type: "video",
        description: "Complete Python programming from basics to intermediate concepts"
      },
      {
        id: "javascript_crash_course_1",
        title: "JavaScript Crash Course",
        url: "https://www.youtube.com/watch?v=hdI2bqOjy3c",
        platform: "Traversy Media",
        duration: "1.5 hours",
        type: "video",
        description: "Modern JavaScript fundamentals in 90 minutes"
      },
      {
        id: "python_exercises_practice__2",
        title: "Python Exercises - Practice 100+ Problems",
        url: "https://www.w3resource.com/python-exercises/",
        platform: "W3Resource",
        duration: "10 hours",
        type: "practice",
        description: "Hands-on Python exercises from basic to advanced"
      },
      {
        id: "java_programming_basics_3",
        title: "Java Programming Basics",
        url: "https://www.youtube.com/watch?v=eIrMbAQSU34",
        platform: "Programming with Mosh",
        duration: "2.5 hours",
        type: "video",
        description: "Complete Java tutorial for absolute beginners"
      }
    ],
    intermediate: [
      {
        id: "object_oriented_programmin_0",
        title: "Object-Oriented Programming",
        url: "https://www.youtube.com/watch?v=pTB0EiLXUC8",
        platform: "Programming with Mosh",
        duration: "2 hours",
        type: "video",
        description: "OOP principles: encapsulation, inheritance, polymorphism"
      },
      {
        id: "clean_code_principles_1",
        title: "Clean Code Principles",
        url: "https://www.youtube.com/watch?v=7EmboKQH8lM",
        platform: "freeCodeCamp",
        duration: "1.5 hours",
        type: "video",
        description: "Write maintainable, readable, and efficient code"
      },
      {
        id: "functional_programming_con_2",
        title: "Functional Programming Concepts",
        url: "https://www.youtube.com/watch?v=e-5obm1G_FY",
        platform: "freeCodeCamp",
        duration: "2 hours",
        type: "video",
        description: "Functional programming paradigms in JavaScript and Python"
      }
    ],
    advanced: [
      {
        id: "design_patterns_in_program_0",
        title: "Design Patterns in Programming",
        url: "https://refactoring.guru/design-patterns",
        platform: "Refactoring.Guru",
        duration: "8 hours",
        type: "article",
        description: "23 Gang of Four patterns with real-world examples"
      },
      {
        id: "advanced_python_programming_1",
        title: "Advanced Python Programming",
        url: "https://www.youtube.com/watch?v=HGOBQPFzWKo",
        platform: "freeCodeCamp",
        duration: "6 hours",
        type: "video",
        description: "Decorators, generators, context managers, and metaprogramming"
      }
    ]
  },

  "Software Engineering": {
    threshold: 70,
    beginner: [
      {
        id: "software_development_life__0",
        title: "Software Development Life Cycle (SDLC)",
        url: "https://www.youtube.com/watch?v=i-QyW8D3ei0",
        platform: "Simplilearn",
        duration: "30 min",
        type: "video",
        description: "SDLC phases, models, and best practices"
      },
      {
        id: "agile_methodology_tutorial_1",
        title: "Agile Methodology Tutorial",
        url: "https://www.youtube.com/watch?v=8eVXTyIZ1Hs",
        platform: "Edureka",
        duration: "1 hour",
        type: "video",
        description: "Agile principles, Scrum framework, and sprint planning"
      },
      {
        id: "git_github_for_beginners_2",
        title: "Git & GitHub for Beginners",
        url: "https://www.youtube.com/watch?v=RGOj5yH7evk",
        platform: "freeCodeCamp",
        duration: "1 hour",
        type: "video",
        description: "Version control basics, commits, branches, and collaboration"
      },
      {
        id: "software_testing_fundament_3",
        title: "Software Testing Fundamentals",
        url: "https://www.guru99.com/software-testing.html",
        platform: "Guru99",
        duration: "2 hours",
        type: "article",
        description: "Testing types, test cases, and quality assurance"
      }
    ],
    intermediate: [
      {
        id: "software_architecture_patte_0",
        title: "Software Architecture Patterns",
        url: "https://www.youtube.com/watch?v=BrT3AO8bVQY",
        platform: "InfoQ",
        duration: "45 min",
        type: "video",
        description: "MVC, microservices, event-driven architecture"
      },
      {
        id: "restful_api_design_best_pr_1",
        title: "RESTful API Design Best Practices",
        url: "https://www.youtube.com/watch?v=0oXYLzuucwE",
        platform: "Traversy Media",
        duration: "40 min",
        type: "video",
        description: "Design scalable and maintainable REST APIs"
      },
      {
        id: "ci_cd_pipeline_tutorial_2",
        title: "CI/CD Pipeline Tutorial",
        url: "https://www.youtube.com/watch?v=scEDHsr3APg",
        platform: "freeCodeCamp",
        duration: "1 hour",
        type: "video",
        description: "Continuous integration and deployment with Jenkins"
      }
    ],
    advanced: [
      {
        id: "system_design_interview_co_0",
        title: "System Design Interview Course",
        url: "https://www.youtube.com/watch?v=bUHFg8CZFws",
        platform: "freeCodeCamp",
        duration: "4 hours",
        type: "video",
        description: "Design scalable systems like Twitter, Instagram, Uber"
      },
      {
        id: "microservices_architecture_1",
        title: "Microservices Architecture",
        url: "https://www.youtube.com/watch?v=CdBtNQZH8a4",
        platform: "freeCodeCamp",
        duration: "3 hours",
        type: "video",
        description: "Build and deploy microservices with Docker and Kubernetes"
      }
    ]
  },

  "Computer Networks": {
    threshold: 70,
    beginner: [
      {
        id: "computer_networks_full_cou_0",
        title: "Computer Networks Full Course",
        url: "https://www.youtube.com/watch?v=qiQR5rTSshw",
        platform: "Gate Smashers",
        duration: "10 hours",
        type: "video",
        description: "Complete networking: OSI model, TCP/IP, protocols, and routing"
      },
      {
        id: "network_protocols_explaine_1",
        title: "Network Protocols Explained",
        url: "https://www.cloudflare.com/learning/network-layer/",
        platform: "Cloudflare Learning",
        duration: "2 hours",
        type: "article",
        description: "HTTP, HTTPS, DNS, SMTP, FTP protocols with examples"
      },
      {
        id: "ip_addressing_and_subnetti_2",
        title: "IP Addressing and Subnetting",
        url: "https://www.youtube.com/watch?v=s_Ntt6eTn94",
        platform: "PowerCert",
        duration: "30 min",
        type: "video",
        description: "IPv4, IPv6, subnet masks, and CIDR notation"
      }
    ],
    intermediate: [
      {
        id: "network_security_fundament_0",
        title: "Network Security Fundamentals",
        url: "https://www.youtube.com/watch?v=bBC-nXj3Ng4",
        platform: "freeCodeCamp",
        duration: "3 hours",
        type: "video",
        description: "Firewalls, VPN, SSL/TLS, and network threats"
      },
      {
        id: "wireshark_network_analysis_1",
        title: "Wireshark Network Analysis",
        url: "https://www.youtube.com/watch?v=TkCSr30UojM",
        platform: "NetworkChuck",
        duration: "45 min",
        type: "video",
        description: "Packet analysis and network troubleshooting"
      }
    ],
    advanced: [
      {
        id: "software_defined_networkin_0",
        title: "Software Defined Networking (SDN)",
        url: "https://www.coursera.org/learn/sdn",
        platform: "Coursera",
        duration: "6 weeks",
        type: "course",
        description: "Modern network architecture and SDN principles"
      }
    ]
  },

 "Communication": {
  threshold: 70,
  beginner: [
    {
      id: "effective_communication_sk_0",
      title: "Effective Communication Skills",
      url: "https://www.youtube.com/watch?v=eIho2S0ZahI",
      platform: "Indeed",
      duration: "10 min",
      type: "video",
      description: "Professional workplace communication techniques"
    },
    {
      id: "technical_writing_course_1",
      title: "Technical Writing Course",
      url: "https://developers.google.com/tech-writing/overview",
      platform: "Google",
      duration: "4 hours",
      type: "course",
      description: "Write clear technical documentation and reports"
    },
    {
      id: "presentation_skills_worksh_2",
      title: "Presentation Skills Workshop",
      url: "https://www.youtube.com/watch?v=Iwpi1Lm6dFo",
      platform: "Stanford Graduate School",
      duration: "45 min",
      type: "video",
      description: "Public speaking and presentation delivery"
    }
  ],
  intermediate: [],
  advanced: [
    {
      id: "executive_communication_st_0",
      title: "Advanced Communication for Leaders",
      url: "https://ocw.mit.edu/courses/15-281-advanced-communication-for-leaders-spring-2016/",
      platform: "MIT OpenCourseWare",
      duration: "3 hours (selected lectures)",
      type: "video",
      description: "Oral and interpersonal communication skills for leaders: presenting to difficult audiences, running effective meetings, active listening, and executive presence."
    }
  ]
},



  "Mathematics": {
    threshold: 70,
    beginner: [
      {
        id: "discrete_mathematics_for_c_0",
        title: "Discrete Mathematics for Computer Science",
        url: "https://www.youtube.com/watch?v=tyDKR4FG3Yw",
        platform: "TrevTutor",
        duration: "10 hours",
        type: "video",
        description: "Logic, sets, relations, graph theory, and combinatorics"
      },
      {
        id: "statistics_and_probability_1",
        title: "Statistics and Probability",
        url: "https://www.khanacademy.org/math/statistics-probability",
        platform: "Khan Academy",
        duration: "15 hours",
        type: "interactive",
        description: "Complete statistics course with practice problems"
      },
      {
        id: "linear_algebra_fundamental_2",
        title: "Linear Algebra Fundamentals",
        url: "https://www.youtube.com/watch?v=JnTa9XtvmfI",
        platform: "3Blue1Brown",
        duration: "3 hours",
        type: "video",
        description: "Visual intuition for vectors, matrices, and transformations"
      }
    ],
    intermediate: [
      {
        id: "calculus_for_machine_learn_0",
        title: "Calculus for Machine Learning",
        url: "https://www.youtube.com/watch?v=WUvTyaaNkzM",
        platform: "freeCodeCamp",
        duration: "2 hours",
        type: "video",
        description: "Essential calculus concepts for data science"
      },
      {
        id: "probability_theory_1",
        title: "Probability Theory",
        url: "https://www.youtube.com/watch?v=1uW3qMFA9Ho",
        platform: "MIT OpenCourseWare",
        duration: "5 hours",
        type: "video",
        description: "Advanced probability for data science and ML"
      }
    ],
    advanced: [
      {
        id: "optimization_for_machine_le_0",
        title: "Optimization for Machine Learning",
        url: "https://www.youtube.com/watch?v=IHZwWFHWa-w",
        platform: "Stanford",
        duration: "10 hours",
        type: "video",
        description: "Gradient descent, convex optimization, and advanced techniques"
      }
    ]
  },

  "Electronics": {
  threshold: 70,
  beginner: [
    {
      id: "basic_electronics_complete_0",
      title: "Basic Electronics - Complete Course",
      url: "https://www.youtube.com/watch?v=nb4ovfwqup8",
      platform: "freeCodeCamp",
      duration: "5 hours",
      type: "video",
      description: "Fundamentals of electronics, circuits, resistors, capacitors, and transistors"
    },
    {
      id: "digital_electronics_fundam_1",
      title: "Digital Electronics Fundamentals",
      url: "https://www.electronics-tutorials.ws/digital/digital.html",
      platform: "Electronics Tutorials",
      duration: "8 hours",
      type: "article",
      description: "Logic gates, Boolean algebra, flip-flops, and combinational circuits"
    },
    {
      id: "circuit_analysis_basics_2",
      title: "Circuit Analysis Basics",
      url: "https://www.khanacademy.org/science/electrical-engineering",
      platform: "Khan Academy",
      duration: "10 hours",
      type: "interactive",
      description: "Ohm's law, Kirchhoff's laws, series and parallel circuits"
    },
    {
      id: "electronics_practice_proble_3",
      title: "Electronics Practice Problems",
      url: "https://www.allaboutcircuits.com/worksheets/",
      platform: "All About Circuits",
      duration: "5 hours",
      type: "practice",
      description: "Hands-on practice with circuit analysis and electronics problems"
    }
  ],
  intermediate: [
    {
      id: "analog_electronics_0",
      title: "Analog Electronics",
      url: "https://www.youtube.com/watch?v=7jaa1rlW7Ak",
      platform: "Neso Academy",
      duration: "6 hours",
      type: "video",
      description: "Op-amps, amplifiers, filters, and analog circuit design"
    },
    {
      id: "microcontrollers_and_embedd_1",
      title: "Microcontrollers and Embedded Systems",
      url: "https://www.youtube.com/watch?v=7vhvnaWUZjE",
      platform: "edX",
      duration: "8 hours",
      type: "video",
      description: "Arduino, microcontroller programming, and interfacing"
    }
  ],
  advanced: [
    {
      id: "vlsi_design_0",
      title: "VLSI Design",
      url: "https://nptel.ac.in/courses/108106191",
      platform: "NPTEL",
      duration: "12 hours",
      type: "video",
      description: "Very Large Scale Integration (VLSI) design and CMOS technology"
    }
  ]
},


  "Computer Networks": {
  threshold: 70,
  beginner: [
    {
      id: "computer_networks_full_cou_0",
      title: "Computer Networks Full Course",
      url: "https://www.youtube.com/watch?v=qiQR5rTSshw",
      platform: "Gate Smashers",
      duration: "10 hours",
      type: "video",
      description: "Complete networking: OSI model, TCP/IP, protocols, and routing"
    },
    {
      id: "network_protocols_explaine_1",
      title: "Network Protocols Explained",
      url: "https://www.cloudflare.com/learning/network-layer/",
      platform: "Cloudflare Learning",
      duration: "2 hours",
      type: "article",
      description: "HTTP, HTTPS, DNS, SMTP, FTP protocols with examples"
    },
    {
      id: "ip_addressing_and_subnetti_2",
      title: "IP Addressing and Subnetting",
      url: "https://www.youtube.com/watch?v=s_Ntt6eTn94",
      platform: "PowerCert",
      duration: "30 min",
      type: "video",
      description: "IPv4, IPv6, subnet masks, and CIDR notation"
    }
  ],
  intermediate: [
    {
      id: "network_security_fundament_0",
      title: "Network Security Fundamentals",
      url: "https://www.youtube.com/watch?v=bBC-nXj3Ng4",
      platform: "freeCodeCamp",
      duration: "3 hours",
      type: "video",
      description: "Firewalls, VPN, SSL/TLS, and network threats"
    },
    {
      id: "wireshark_network_analysis_1",
      title: "Wireshark Network Analysis",
      url: "https://www.youtube.com/watch?v=TkCSr30UojM",
      platform: "NetworkChuck",
      duration: "45 min",
      type: "video",
      description: "Packet analysis and network troubleshooting"
    }
  ],
  advanced: [
    {
      id: "advanced_network_security_0",
      title: "Advanced Network Security",
      url: "https://www.youtube.com/watch?v=2_lswM1S264",
      platform: "edX",
      duration: "8 hours",
      type: "video",
      description: "Penetration testing, intrusion detection, and advanced security"
    }
  ]
},



  // Technical Skills
  "Coding Skills": {
    threshold: 80,
    beginner: [
      {
        id: "problem_solving_patterns_0",
        title: "Problem Solving Patterns",
        url: "https://www.youtube.com/watch?v=XKu_SEDAykw",
        platform: "freeCodeCamp",
        duration: "10 hours",
        type: "video",
        description: "Master coding patterns: two pointers, sliding window, recursion"
      },
      {
        id: "leetcode_easy_top_50_probl_1",
        title: "LeetCode Easy - Top 50 Problems",
        url: "https://leetcode.com/problemset/?difficulty=EASY",
        platform: "LeetCode",
        duration: "20 hours",
        type: "practice",
        description: "Essential coding problems for interviews"
      },
      {
        id: "coding_interview_bootcamp_2",
        title: "Coding Interview Bootcamp",
        url: "https://www.youtube.com/watch?v=8hly31xKli0",
        platform: "freeCodeCamp",
        duration: "6 hours",
        type: "video",
        description: "Arrays, strings, linked lists problem-solving"
      },
      {
        id: "hackerrank_problem_solving_3",
        title: "HackerRank Problem Solving",
        url: "https://www.hackerrank.com/domains/algorithms",
        platform: "HackerRank",
        duration: "15 hours",
        type: "practice",
        description: "100+ progressively difficult coding challenges"
      }
    ],
    intermediate: [
      {
        id: "advanced_data_structures_0",
        title: "Advanced Data Structures",
        url: "https://www.youtube.com/watch?v=RBSGKlAvoiM",
        platform: "freeCodeCamp",
        duration: "5 hours",
        type: "video",
        description: "Trees, heaps, tries, and advanced implementations"
      },
      {
        id: "leetcode_medium_75_study_p_1",
        title: "LeetCode Medium - 75 Study Plan",
        url: "https://leetcode.com/studyplan/leetcode-75/",
        platform: "LeetCode",
        duration: "30 hours",
        type: "practice",
        description: "Curated list of 75 essential medium problems"
      },
      {
        id: "competitive_programming_ha_2",
        title: "Competitive Programming Handbook",
        url: "https://cses.fi/book/book.pdf",
        platform: "CSES",
        duration: "40 hours",
        type: "article",
        description: "Comprehensive guide to competitive programming"
      }
    ],
    advanced: [
      {
        id: "system_design_for_coding_i_0",
        title: "System Design for Coding Interviews",
        url: "https://www.youtube.com/watch?v=bUHFg8CZFws",
        platform: "freeCodeCamp",
        duration: "4 hours",
        type: "video",
        description: "Design scalable systems and architecture"
      },
      {
        id: "leetcode_hard_top_100_1",
        title: "LeetCode Hard - Top 100",
        url: "https://leetcode.com/problemset/all/?difficulty=HARD",
        platform: "LeetCode",
        duration: "50 hours",
        type: "practice",
        description: "Master the most challenging algorithmic problems"
      }
    ]
  },

 "Logical Quotient": {
  threshold: 70,
  beginner: [
    {
      id: "critical_thinking_0",
      title: "Critical Thinking and Problem Solving",
      url: "https://www.youtube.com/watch?v=NKEhdsnKKHs",
      platform: "CrashCourse",
      duration: "45 min",
      type: "video",
      description: "Develop systematic problem-solving approaches"
    },
    {
      id: "brain_teasers_logic_1",
      title: "Brain Teasers and Logic Puzzles",
      url: "https://www.geeksforgeeks.org/puzzles/",
      platform: "GeeksforGeeks",
      duration: "10 hours",
      type: "practice",
      description: "200+ logic puzzles with detailed solutions"
    },
    {
      id: "aptitude_test_prep_2",
      title: "Aptitude Test Preparation",
      url: "https://www.indiabix.com/aptitude/questions-and-answers/",
      platform: "IndiaBix",
      duration: "15 hours",
      type: "practice",
      description: "Quantitative aptitude and logical reasoning practice"
    }
  ],
  intermediate: [
    {
      id: "advanced_logical_reasoning_0",
      title: "Advanced Logical Reasoning",
      url: "https://brilliant.org/courses/logic/",
      platform: "Brilliant",
      duration: "8 hours",
      type: "interactive",
      description: "Pattern recognition and deductive reasoning"
    },
    {
      id: "math_problem_solving_1",
      title: "Mathematical Problem Solving",
      url: "https://www.youtube.com/watch?v=h0gbw-Ur_do",
      platform: "MIT OpenCourseWare",
      duration: "6 hours",
      type: "video",
      description: "Advanced problem-solving techniques from MIT"
    }
  ],
  advanced: [
    {
      id: "competitive_programming_logic_0",
      title: "Competitive Programming Logic",
      url: "https://codeforces.com/",
      platform: "Codeforces",
      duration: "Ongoing",
      type: "practice",
      description: "Master algorithmic thinking through competitive programming"
    },
    {
      id: "game_theory_strategy_1",
      title: "Game Theory and Strategic Thinking",
      url: "https://www.youtube.com/watch?v=nM3rTU927io",
      platform: "Yale University",
      duration: "12 hours",
      type: "video",
      description: "Strategic reasoning and decision-making under uncertainty"
    }
  ]
},

  "Memory Score": {
  threshold: 70,
  beginner: [
    {
      id: "memory_improvement_techniques_0",
      title: "Memory Improvement Techniques",
      url: "https://www.youtube.com/watch?v=bSycdIx-C48",
      platform: "Jim Kwik",
      duration: "30 min",
      type: "video",
      description: "Proven techniques to enhance memory retention"
    },
    {
      id: "memory_training_games_1",
      title: "Memory Training Games",
      url: "https://www.lumosity.com/",
      platform: "Lumosity",
      duration: "Daily practice",
      type: "interactive",
      description: "Scientific brain training and memory exercises"
    },
    {
      id: "memory_palace_technique_2",
      title: "Memory Palace Technique",
      url: "https://www.youtube.com/watch?v=3vlpQHJ09do",
      platform: "Memorize Academy",
      duration: "45 min",
      type: "video",
      description: "Learn the ancient memory palace method for long-term retention"
    }
  ],
  intermediate: [
    {
      id: "advanced_memory_techniques_0",
      title: "Advanced Memory Techniques",
      url: "https://www.youtube.com/watch?v=mh9B5UJbbRg",
      platform: "Memory Athletes",
      duration: "1 hour",
      type: "video",
      description: "Championship memory techniques for rapid recall and retention"
    }
  ],
  advanced: [
    {
      id: "speed_reading_memory_0",
      title: "Speed Reading and Memory Retention",
      url: "https://www.youtube.com/watch?v=ZwEquW_Yij0",
      platform: "Jim Kwik",
      duration: "2 hours",
      type: "video",
      description: "Advanced speed reading while maintaining comprehension"
    },
    {
      id: "memory_championship_training_1",
      title: "Memory Championship Training",
      url: "https://www.artofmemory.com/",
      platform: "Art of Memory",
      duration: "20 hours",
      type: "course",
      description: "Train like a memory champion with advanced mnemonic techniques"
    }
  ]
},

};

// Assessment to resource mapping
export const assessmentToResourceMap = {
  // Academic Assessments
  "assessments_operating_systems": "Operating Systems",
  "assessments_algorithms": "Algorithms",
  "assessments_programming": "Programming",
  "assessments_software_engineering": "Software Engineering",
  "assessments_computer_networks": "Computer Networks",
  "assessments_communication": "Communication",
  "assessments_mathematics": "Mathematics",
  "assessments_electronics": "Electronics",
  "assessments_computer_architecture": "Computer Architecture",
  
  // Abbreviated names (matching the academic score keys)
  "assessments_os": "Operating Systems",
  "assessments_algo": "Algorithms",
  "assessments_prog": "Programming",
  "assessments_se": "Software Engineering",
  "assessments_cn": "Computer Networks",
  "assessments_comm": "Communication",
  "assessments_math": "Mathematics",
  "assessments_es": "Electronics",
  "assessments_ca": "Computer Architecture",
  
  // Technical assessments
  "technicalAssessments_coding_skills": "Coding Skills",
  "technicalAssessments_logical_quotient": "Logical Quotient",
  "technicalAssessments_memory_test": "Memory Score"
};

export const assessmentToTopicsMap = {
  // Academic Assessments
  "assessments_operating_systems": ["Operating Systems"],
  "assessments_algorithms": ["Algorithms"],
  "assessments_programming": ["Programming"],
  "assessments_software_engineering": ["Software Engineering"],
  "assessments_computer_networks": ["Computer Networks"],
  "assessments_communication": ["Communication"],
  "assessments_mathematics": ["Mathematics"],
  "assessments_electronics": ["Electronics"],
  "assessments_computer_architecture": ["Computer Architecture"],
  
  // Abbreviated names
  "assessments_os": ["Operating Systems"],
  "assessments_algo": ["Algorithms"],
  "assessments_prog": ["Programming"],
  "assessments_se": ["Software Engineering"],
  "assessments_cn": ["Computer Networks"],
  "assessments_comm": ["Communication"],
  "assessments_math": ["Mathematics"],
  "assessments_es": ["Electronics"],
  "assessments_ca": ["Computer Architecture"],
  
  // Technical assessments - can map to multiple topics
  "technicalAssessments_coding_skills": ["Coding Skills", "Programming", "Algorithms"],
  "technicalAssessments_logical_quotient": ["Logical Quotient", "Algorithms"],
  "technicalAssessments_memory_test": ["Memory Score"]
};

// Get recommended difficulty level based on score
export function getRecommendedLevel(score, threshold) {
  const percentage = (score / threshold) * 100;
  
  if (percentage < 50) return "beginner";
  if (percentage < 80) return "intermediate";
  return "advanced";
}

// Identify weak areas from assessment scores
export function identifyWeakAreas(academicScores, technicalSkills) {
  const weakAreas = [];
  
  // Academic assessments (0-100 scale)
  Object.entries(academicScores).forEach(([key, score]) => {
    const assessmentId = `assessments_${key.replace('_perc', '')}`;
    const topic = assessmentToResourceMap[assessmentId];
    
    if (topic && learningResources[topic] && score > 0) {
      const threshold = learningResources[topic].threshold;
      
      if (score < threshold) {
        weakAreas.push({
          topic,
          currentScore: Math.round(score),
          threshold,
          gap: Math.round(threshold - score),
          type: "academic",
          assessmentId
        });
      }
    }
  });
  
  // Technical assessments
  Object.entries(technicalSkills).forEach(([key, value]) => {
    const assessmentId = `technicalAssessments_${key}`;
    const topic = assessmentToResourceMap[assessmentId];
    
    if (topic && learningResources[topic] && value > 0) {
      const threshold = learningResources[topic].threshold;
      
      let maxScore = 5;
      if (key === 'memory_test') {
        maxScore = 10;
      }
      
      const scorePercentage = (value / maxScore) * 100;
      
      if (scorePercentage < threshold) {
        weakAreas.push({
          topic,
          currentScore: Math.round(scorePercentage),
          threshold,
          gap: Math.round(threshold - scorePercentage),
          type: "technical",
          assessmentId
        });
      }
    }
  });
  
  // Sort by gap (highest priority = largest gap)
  return weakAreas.sort((a, b) => b.gap - a.gap);
}