// src/data/roadmaps/qaTestingRoadmap.js

const qaTestingRoadmap = {
  id: 'qa-testing',
  title: 'Quality Assurance & Testing Career Path',
  description: 'Master software testing, automation, QA methodologies, and quality assurance practices',
  category: 'Quality Assurance & Testing',
  estimatedDuration: '16-20 weeks',
  skillsGained: [
    'Manual Testing',
    'Test Automation',
    'Selenium WebDriver',
    'API Testing',
    'Performance Testing',
    'Test Planning & Strategy',
    'Bug Tracking & Reporting',
    'CI/CD Integration',
    'Agile/Scrum Testing'
  ],
  
  modules: [
    {
  id: 1,
  title: 'Software Testing Fundamentals',
  description: 'Learn testing principles, SDLC, test case design, and manual testing.',
  duration: '4 weeks',
  difficulty: 'Beginner',

  learningResources: [
    {
      id: 1,
      title: 'Software Testing Full Course for Beginners',
      type: 'video',
      platform: 'YouTube - Simplilearn',
      url: 'https://www.youtube.com/watch?v=H7aXldSq0hI',
      duration: '3.5 hours',
      description: 'Comprehensive beginner tutorial covering testing principles, SDLC, and manual testing.'
    },
    {
      id: 2,
      title: 'Manual Testing Tutorial',
      type: 'video',
      platform: 'YouTube - Guru99',
      url: 'https://www.youtube.com/watch?v=FQIJSo1m3fE',
      duration: '2 hours',
      description: 'Step-by-step guide on test case design, defect management, and testing lifecycle.'
    },
    {
      id: 3,
      title: 'ISTQB Foundation Level Explained',
      type: 'video',
      platform: 'YouTube - Software Testing Mentor',
      url: 'https://www.youtube.com/watch?v=JfF8A5F7KkI',
      duration: '4 hours',
      description: 'Covers ISTQB topics, verification vs validation, and software quality principles.'
    },
    {
      id: 4,
      title: 'Agile Testing Tutorial',
      type: 'video',
      platform: 'YouTube - Edureka!',
      url: 'https://www.youtube.com/watch?v=1l8hfaRjXvU',
      duration: '2 hours',
      description: 'Learn testing strategies in Agile and Scrum with examples.'
    },
    {
      id: 5,
      title: 'Software Testing Life Cycle (STLC) Explained',
      type: 'article',
      platform: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/software-testing-life-cycle-stlc/',
      duration: '30 min read',
      description: 'Detailed overview of STLC phases from requirement analysis to test closure.'
    }
  ],

  quiz: {
    passingScore: 70,
    questions: [
      {
        id: 1,
        question: 'Which phase comes first in the Software Testing Life Cycle (STLC)?',
        options: [
          'Test Execution',
          'Test Planning',
          'Requirement Analysis',
          'Test Closure'
        ],
        correctAnswer: 2,
        explanation: 'Requirement Analysis is the first phase where test requirements are understood and identified.'
      },
      {
        id: 2,
        question: 'What is the primary goal of software testing?',
        options: [
          'To prove the software works perfectly',
          'To find defects and ensure software meets requirements',
          'To speed up development',
          'To replace manual work with automation'
        ],
        correctAnswer: 2,
        explanation: 'The purpose of testing is to detect defects early and ensure the product meets business requirements.'
      },
      {
        id: 3,
        question: 'Which of the following describes verification?',
        options: [
          'Evaluating the product during development to ensure it meets requirements',
          'Checking whether the software meets user expectations',
          'Testing user interface design only',
          'Running test cases on live systems'
        ],
        correctAnswer: 1,
        explanation: 'Verification ensures the product is built according to design specifications before release.'
      },
      {
        id: 4,
        question: 'Which testing approach does not require internal knowledge of the system?',
        options: [
          'White Box Testing',
          'Black Box Testing',
          'Unit Testing',
          'Integration Testing'
        ],
        correctAnswer: 2,
        explanation: 'Black box testing focuses on input and output behavior without considering internal logic.'
      },
      {
        id: 5,
        question: 'In Agile methodology, when is testing performed?',
        options: [
          'After all development is done',
          'Only at the end of the project',
          'Continuously throughout iterations',
          'Only after deployment'
        ],
        correctAnswer: 3,
        explanation: 'In Agile, testing is continuous — done during each sprint along with development.'
      }
    ]
  },

  challenge: {
    title: 'E-Commerce Website Testing Project',
    description: 'Create a detailed test plan and test cases for an e-commerce website.',
    requirements: [
      'Write a test plan document with objectives and scope.',
      'Create 20+ test cases covering login, cart, checkout, and search.',
      'Apply equivalence partitioning and boundary value analysis.',
      'Include positive and negative test scenarios.',
      'Report 5 bugs with steps to reproduce and expected vs actual results.'
    ],
    submissionType: 'text'
  }
},

    
  {
  id: 2,
  title: 'Test Automation with Selenium',
  description: 'Master Selenium WebDriver, automation frameworks, and best practices.',
  duration: '5–6 weeks',
  difficulty: 'Intermediate',

  learningResources: [
    {
      id: 1,
      title: 'Selenium WebDriver with Java - Test Automation University',
      type: 'video',
      platform: 'Test Automation University (Free)',
      url: 'https://testautomationu.applitools.com/selenium-webdriver-tutorial-java/',
      duration: '7 hours',
      description: 'Complete free Selenium WebDriver course with Java covering locators, waits, and advanced techniques'
    },
    {
      id: 2,
      title: 'Selenium Python Tutorial - Complete Guide',
      type: 'article',
      platform: 'Real Python',
      url: 'https://realpython.com/modern-web-automation-with-python-and-selenium/',
      duration: '3 hours read',
      description: 'Modern web automation with Python and Selenium including Page Object Model implementation'
    },
    {
      id: 3,
      title: 'Selenium Python Bindings Official Documentation',
      type: 'article',
      platform: 'Selenium Documentation',
      url: 'https://selenium-python.readthedocs.io/',
      duration: '4 hours read',
      description: 'Official Selenium Python documentation with examples and best practices'
    },
    {
      id: 4,
      title: 'Selenium WebDriver Tutorial - Complete Course',
      type: 'article',
      platform: 'BrowserStack',
      url: 'https://www.browserstack.com/guide/selenium-tutorial',
      duration: '5 hours read',
      description: 'Comprehensive Selenium tutorial covering setup, WebDriver, and automation frameworks for both Java and Python'
    },
    {
      id: 5,
      title: 'Selenium Official Documentation',
      type: 'article',
      platform: 'Selenium.dev',
      url: 'https://www.selenium.dev/documentation/',
      duration: '6 hours read',
      description: 'Official Selenium documentation covering WebDriver APIs, Grid, IDE, and best practices'
    },
    {
      id: 6,
      title: 'Page Object Model (POM) and Test Automation',
      type: 'article',
      platform: 'ToolsQA',
      url: 'https://www.toolsqa.com/selenium-webdriver/selenium-tutorial/',
      duration: '3 hours read',
      description: 'Learn Page Object Model framework design, data-driven testing, and TestNG integration'
    },
    {
      id: 7,
      title: 'XPath and CSS Selectors Tutorial',
      type: 'article',
      platform: 'Guru99',
      url: 'https://www.guru99.com/xpath-selenium.html',
      duration: '1.5 hours read',
      description: 'Master XPath and CSS selectors for effective element location in Selenium'
    },
    {
      id: 8,
      title: 'Selenium Python Tutorial',
      type: 'article',
      platform: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/selenium-python-tutorial/',
      duration: '4 hours read',
      description: 'Complete Selenium Python tutorial with practical examples and automation techniques'
    }
  ],

  quiz: {
    passingScore: 75,
    questions: [
      {
        id: 1,
        question: 'What is Selenium WebDriver used for?',
        options: [
          'Building web applications',
          'Automating browser interactions for testing',
          'Managing databases',
          'Generating reports'
        ],
        correctAnswer: 1,
        explanation: 'Selenium WebDriver automates browser actions for testing web applications.'
      },
      {
        id: 2,
        question: 'Which locator strategy is NOT supported in Selenium?',
        options: [
          'ID',
          'Name',
          'Title',
          'XPath'
        ],
        correctAnswer: 2,
        explanation: 'Selenium supports ID, Name, Class, CSS Selector, and XPath; Title is not a locator.'
      },
      {
        id: 3,
        question: 'What is the benefit of using the Page Object Model?',
        options: [
          'Faster execution speed',
          'Reusability and maintainability of test code',
          'Improved browser compatibility',
          'Parallel testing'
        ],
        correctAnswer: 1,
        explanation: 'POM helps structure automation code for easier maintenance and scalability.'
      },
      {
        id: 4,
        question: 'What does implicit wait do in Selenium?',
        options: [
          'Waits for a fixed time before each action',
          'Waits dynamically for elements to appear in the DOM',
          'Stops the execution permanently',
          'Refreshes the page automatically'
        ],
        correctAnswer: 1,
        explanation: 'Implicit wait sets a global timeout for WebDriver to search for elements before throwing errors.'
      },
      {
        id: 5,
        question: 'Which annotation is used in TestNG to execute code before each test?',
        options: [
          '@BeforeTest',
          '@AfterTest',
          '@BeforeClass',
          '@BeforeMethod'
        ],
        correctAnswer: 3,
        explanation: '@BeforeMethod runs before each test method execution in TestNG.'
      },
      {
        id: 6,
        question: 'What is the difference between absolute and relative XPath?',
        options: [
          'Absolute starts from the root node, relative starts anywhere',
          'Absolute is faster',
          'Relative uses CSS syntax',
          'No difference'
        ],
        correctAnswer: 0,
        explanation: 'Absolute XPath starts at the root (/html), while relative (//) can start from any node.'
      },
      {
        id: 7,
        question: 'Why use explicit waits instead of Thread.sleep()?',
        options: [
          'They are slower but more stable',
          'Explicit waits are conditional and efficient',
          'Thread.sleep() is dynamic',
          'They perform data validation'
        ],
        correctAnswer: 1,
        explanation: 'Explicit waits pause execution only until specific conditions are met, unlike fixed delays.'
      },
      {
        id: 8,
        question: 'What does Selenium Grid allow you to do?',
        options: [
          'Run tests on multiple machines and browsers simultaneously',
          'Store test data',
          'Create reports',
          'Manage XPath selectors'
        ],
        correctAnswer: 0,
        explanation: 'Selenium Grid enables parallel testing across different environments.'
      },
      {
        id: 9,
        question: 'What is a WebElement in Selenium?',
        options: [
          'A class representing an HTML element',
          'A locator type',
          'A framework',
          'A reporting tool'
        ],
        correctAnswer: 0,
        explanation: 'WebElement represents an HTML element and allows interaction using Selenium methods.'
      },
      {
        id: 10,
        question: 'What is data-driven testing?',
        options: [
          'Testing database systems',
          'Running the same test with different input data',
          'Manual exploratory testing',
          'Performance testing'
        ],
        correctAnswer: 1,
        explanation: 'Data-driven testing separates data from logic, allowing multiple datasets for one test script.'
      }
    ]
  },

  challenge: {
    title: 'Automated Login and Shopping Cart Test Suite',
    description: 'Build a Selenium automation framework using the Page Object Model (POM).',
    requirements: [
      'Set up Selenium WebDriver with Java or Python.',
      'Implement the POM design pattern for maintainable test code.',
      'Automate test cases for login (valid/invalid), product search, add-to-cart, and checkout.',
      'Use explicit waits for synchronization and stability.',
      'Implement data-driven testing with external sources (CSV/Excel).',
      'Add assertions to verify expected results.',
      'Generate HTML or Extent Reports.',
      'Handle exceptions and take screenshots on failure.',
      'Organize test execution using TestNG annotations and test suites.',
      'Include README with setup instructions and execution steps.'
    ],
    submissionType: 'text',
    hints: [
      'Use WebDriverManager to handle browser drivers automatically.',
      'Create separate page classes for each web page.',
      'Implement reusable utility methods for waits, logging, and screenshots.',
      'Use properties/config files for URLs and test data paths.',
      'Capture screenshots in @AfterMethod on test failures.'
    ]
  }
},

    
    {
      id: 3,
      title: 'API Testing & Performance Testing',
      description: 'Master REST API testing, Postman, JMeter, and performance analysis',
      duration: '4-5 weeks',
      difficulty: 'Advanced',
      
      learningResources: [
        {
          id: 1,
          title: 'API Testing with Postman',
          type: 'video',
          platform: 'YouTube - freeCodeCamp',
          url: 'https://www.youtube.com/watch?v=VywxIQ2ZXw4',
          duration: '2 hours',
          description: 'Complete Postman course for API testing and automation'
        },
        {
          id: 2,
          title: 'REST API Testing with Rest Assured',
          type: 'video',
          platform: 'YouTube - Automation Step by Step',
          url: 'https://www.youtube.com/watch?v=FjnF-P7FY28',
          duration: '5 hours',
          description: 'API automation using Rest Assured in Java'
        },
        {
          id: 3,
          title: 'JMeter Performance Testing',
          type: 'video',
          platform: 'YouTube - Guru99',
          url: 'https://www.youtube.com/playlist?list=PLkkGqdBS1r094KcNXRy4Q-v5biuNWv-h7',
          duration: '4 hours',
          description: 'Complete JMeter course for load and performance testing'
        },
        {
          id: 4,
          title: 'Understanding REST APIs',
          type: 'video',
          platform: 'YouTube - Programming with Mosh',
          url: 'https://www.youtube.com/watch?v=SLwpqD8n3d0',
          duration: '1 hour',
          description: 'REST API fundamentals every tester should know'
        },
        {
          id: 5,
          title: 'API Testing Best Practices',
          type: 'article',
          platform: 'Postman Learning Center',
          url: 'https://learning.postman.com/',
          duration: '2 hours read',
          description: 'Best practices for effective API testing'
        },
        {
          id: 6,
          title: 'Performance Testing Fundamentals',
          type: 'article',
          platform: 'LoadRunner Documentation',
          url: 'https://www.guru99.com/performance-testing.html',
          duration: '2 hours read',
          description: 'Understanding load, stress, spike, and endurance testing'
        }
      ],
      
      quiz: {
        passingScore: 75,
        questions: [
          {
            id: 1,
            question: 'What is API Testing?',
            options: [
              'Testing user interfaces',
              'Testing application programming interfaces directly',
              'Testing databases',
              'Testing networks'
            ],
            correctAnswer: 1,
            explanation: 'API testing validates APIs directly at the message layer, testing business logic, data responses, and security.'
          },
          {
            id: 2,
            question: 'What does REST stand for?',
            options: [
              'Remote Execution Service Technology',
              'Representational State Transfer',
              'Rapid Enterprise Software Testing',
              'Request Execution State Transfer'
            ],
            correctAnswer: 1,
            explanation: 'REST (Representational State Transfer) is an architectural style for designing networked applications.'
          },
          {
            id: 3,
            question: 'Which HTTP method is used to retrieve data?',
            options: [
              'POST',
              'GET',
              'PUT',
              'DELETE'
            ],
            correctAnswer: 1,
            explanation: 'GET method is used to retrieve data from a server without modifying it.'
          },
          {
            id: 4,
            question: 'What HTTP status code indicates successful response?',
            options: [
              '404',
              '200',
              '500',
              '301'
            ],
            correctAnswer: 1,
            explanation: '200 OK indicates the request succeeded and the server returned the requested data.'
          },
          {
            id: 5,
            question: 'What is Postman?',
            options: [
              'A mail service',
              'An API testing and development platform',
              'A database tool',
              'A browser'
            ],
            correctAnswer: 1,
            explanation: 'Postman is a collaboration platform for API development, testing, and documentation.'
          },
          {
            id: 6,
            question: 'What is the purpose of assertions in API testing?',
            options: [
              'To send requests',
              'To verify response meets expected criteria',
              'To create APIs',
              'To document APIs'
            ],
            correctAnswer: 1,
            explanation: 'Assertions validate that API responses match expected values for status codes, response time, body content, etc.'
          },
          {
            id: 7,
            question: 'What is performance testing?',
            options: [
              'Testing software speed',
              'Testing stability, scalability, and responsiveness under load',
              'Testing features',
              'Testing security'
            ],
            correctAnswer: 1,
            explanation: 'Performance testing evaluates speed, stability, scalability, and responsiveness under various load conditions.'
          },
          {
            id: 8,
            question: 'What is load testing?',
            options: [
              'Testing loading screens',
              'Testing system behavior under expected user load',
              'Testing weight capacity',
              'Testing file uploads'
            ],
            correctAnswer: 1,
            explanation: 'Load testing evaluates system performance under expected concurrent user load and transaction volumes.'
          },
          {
            id: 9,
            question: 'What is stress testing?',
            options: [
              'Testing under pressure',
              'Testing system beyond normal capacity to find breaking point',
              'Testing team stress',
              'Testing deadlines'
            ],
            correctAnswer: 1,
            explanation: 'Stress testing pushes the system beyond normal capacity to identify the breaking point and failure modes.'
          },
          {
            id: 10,
            question: 'What is Apache JMeter?',
            options: [
              'A code editor',
              'An open-source tool for load and performance testing',
              'A database',
              'A browser'
            ],
            correctAnswer: 1,
            explanation: 'Apache JMeter is an open-source tool for load testing and measuring performance of applications.'
          },
          {
            id: 11,
            question: 'What does JSON stand for?',
            options: [
              'Java Standard Object Notation',
              'JavaScript Object Notation',
              'Just Simple Object Names',
              'Joint Service Object Network'
            ],
            correctAnswer: 1,
            explanation: 'JSON (JavaScript Object Notation) is a lightweight data-interchange format commonly used in APIs.'
          },
          {
            id: 12,
            question: 'What is response time in performance testing?',
            options: [
              'Time to write code',
              'Time taken to receive response after sending request',
              'Time to fix bugs',
              'Time to deploy'
            ],
            correctAnswer: 1,
            explanation: 'Response time measures the duration between sending a request and receiving the complete response.'
          },
          {
            id: 13,
            question: 'What is throughput in performance testing?',
            options: [
              'Data storage capacity',
              'Number of requests processed per unit time',
              'Network bandwidth',
              'Server count'
            ],
            correctAnswer: 1,
            explanation: 'Throughput measures how many requests/transactions the system can handle per unit of time.'
          },
          {
            id: 14,
            question: 'What is a 401 status code?',
            options: [
              'Success',
              'Unauthorized - authentication required',
              'Not Found',
              'Server Error'
            ],
            correctAnswer: 1,
            explanation: '401 Unauthorized indicates authentication is required and has failed or not been provided.'
          },
          {
            id: 15,
            question: 'What is the purpose of headers in API requests?',
            options: [
              'Decoration',
              'Pass additional information like authentication, content type',
              'Store data',
              'Increase speed'
            ],
            correctAnswer: 1,
            explanation: 'Headers contain metadata like authentication tokens, content type, and other contextual information.'
          }
        ]
      },
      
      challenge: {
        title: 'API Test Automation & Performance Testing Suite',
        description: 'Build comprehensive API test suite and performance test scenarios',
        requirements: [
          'Choose a public API (e.g., JSONPlaceholder, ReqRes, OpenWeatherMap)',
          'Create Postman collection with 15+ API test cases',
          'Test all CRUD operations (GET, POST, PUT, DELETE)',
          'Validate status codes, response times, and response body',
          'Implement authentication testing',
          'Create negative test cases (invalid data, missing parameters)',
          'Set up environment variables for different environments',
          'Write automated API tests using Rest Assured or similar',
          'Create JMeter performance test plan with 100+ concurrent users',
          'Generate performance test reports with graphs',
          'Document API endpoints and test scenarios'
        ],
        submissionType: 'text',
        hints: [
          'Use Postman tests tab for assertions',
          'Chain requests using variables',
          'Test edge cases and boundary values',
          'Verify response schema using JSON Schema',
          'Add response time assertions',
          'Create JMeter thread groups for different user loads',
          'Use listeners to view results',
          'Test with ramp-up period to simulate realistic load',
          'Monitor server resources during performance tests'
        ]
      }
    },
    
    {
      id: 4,
      title: 'CI/CD, Advanced Testing & Test Management',
      description: 'Master Jenkins, Git, test strategy, and professional QA practices',
      duration: '3-4 weeks',
      difficulty: 'Expert',
      
      learningResources: [
        {
          id: 1,
          title: 'Git and GitHub for Testers',
          type: 'video',
          platform: 'YouTube - freeCodeCamp',
          url: 'https://www.youtube.com/watch?v=RGOj5yH7evk',
          duration: '1 hour',
          description: 'Version control essentials for test automation'
        },
        {
          id: 2,
          title: 'Jenkins CI/CD for Test Automation',
          type: 'video',
          platform: 'YouTube - Automation Step by Step',
          url: 'https://www.youtube.com/watch?v=FX322RVNGj4',
          duration: '4 hours',
          description: 'Integrate automated tests with Jenkins CI/CD pipeline'
        },
        {
          id: 3,
          title: 'Docker for Testers',
          type: 'video',
          platform: 'YouTube - TechWorld with Nana',
          url: 'https://www.youtube.com/watch?v=3c-iBn73dDE',
          duration: '2 hours',
          description: 'Containerization basics for test environments'
        },
        {
          id: 4,
          title: 'Test Management with Jira',
          type: 'video',
          platform: 'YouTube - Simplilearn',
          url: 'https://www.youtube.com/watch?v=QjPf9JNuL38',
          duration: '3 hours',
          description: 'Manage testing activities using Jira and Xray'
        },
        {
          id: 5,
          title: 'BDD with Cucumber',
          type: 'video',
          platform: 'YouTube - Automation Step by Step',
          url: 'https://www.youtube.com/watch?v=s2Yhj-uyJ2M',
          duration: '4 hours',
          description: 'Behavior Driven Development with Cucumber framework'
        },
        {
          id: 6,
          title: 'Mobile Testing with Appium',
          type: 'video',
          platform: 'YouTube - SDET-QA Automation',
          url: 'https://www.youtube.com/watch?v=mAylNVddfJc',
          duration: '5 hours',
          description: 'Automated mobile testing for iOS and Android'
        },
        {
          id: 7,
          title: 'Test Strategy and Planning',
          type: 'article',
          platform: 'Ministry of Testing',
          url: 'https://www.ministryoftesting.com/',
          duration: '2 hours read',
          description: 'Creating effective test strategies and plans'
        }
      ],
      
      quiz: {
        passingScore: 80,
        questions: [
          {
            id: 1,
            question: 'What is CI/CD?',
            options: [
              'A testing tool',
              'Continuous Integration and Continuous Deployment',
              'A programming language',
              'A database'
            ],
            correctAnswer: 1,
            explanation: 'CI/CD automates integrating code changes and deploying to production, including automated testing.'
          },
          {
            id: 2,
            question: 'What is Jenkins?',
            options: [
              'A test framework',
              'An automation server for CI/CD',
              'A programming language',
              'A browser'],
            correctAnswer: 1,
            explanation: 'Jenkins is an open-source automation server used to build, test, and deploy software in CI/CD pipelines.'
          },
          {
            id: 3,
            question: 'What is Git?',
            options: [
              'A testing tool',
              'A distributed version control system',
              'A bug tracking system',
              'A browser'
            ],
            correctAnswer: 1,
            explanation: 'Git is a distributed version control system for tracking changes in source code and test scripts.'
          },
          {
            id: 4,
            question: 'What is a test strategy?',
            options: [
              'A test case',
              'High-level document defining testing approach and objectives',
              'A bug report',
              'A test tool'
            ],
            correctAnswer: 1,
            explanation: 'A test strategy is a high-level document outlining the testing approach, scope, resources, and schedule.'
          },
          {
            id: 5,
            question: 'What is Behavior Driven Development (BDD)?',
            options: [
              'A programming style',
              'Development approach using natural language to describe behavior',
              'A testing tool',
              'A deployment method'
            ],
            correctAnswer: 1,
            explanation: 'BDD uses natural language (Given-When-Then) to describe application behavior, bridging technical and business teams.'
          },
          {
            id: 6,
            question: 'What is Cucumber?',
            options: [
              'A vegetable',
              'A BDD framework that executes tests written in Gherkin',
              'A browser',
              'A database'
            ],
            correctAnswer: 1,
            explanation: 'Cucumber is a BDD framework that allows writing tests in plain language (Gherkin syntax).'
          },
          {
            id: 7,
            question: 'What is Docker?',
            options: [
              'A shipping company',
              'A platform for containerizing applications',
              'A test framework',
              'A programming language'
            ],
            correctAnswer: 1,
            explanation: 'Docker is a platform for developing, shipping, and running applications in isolated containers.'
          },
          {
            id: 8,
            question: 'What is a test plan?',
            options: [
              'A single test case',
              'Document detailing test scope, approach, resources, and schedule',
              'A bug report',
              'A code review'
            ],
            correctAnswer: 1,
            explanation: 'A test plan documents the scope, approach, resources, schedule, and deliverables for testing activities.'
          },
          {
            id: 9,
            question: 'What is Jira?',
            options: [
              'A programming language',
              'A project management and issue tracking tool',
              'A test framework',
              'A database'
            ],
            correctAnswer: 1,
            explanation: 'Jira is a project management tool used for issue tracking, bug tracking, and agile project management.'
          },
          {
            id: 10,
            question: 'What is test coverage?',
            options: [
              'Number of testers',
              'Measure of how much code/functionality is tested',
              'Test duration',
              'Bug count'
            ],
            correctAnswer: 1,
            explanation: 'Test coverage measures the percentage of code, requirements, or functionality covered by tests.'
          },
          {
            id: 11,
            question: 'What is shift-left testing?',
            options: [
              'Testing on the left side',
              'Moving testing activities earlier in development cycle',
              'Testing after deployment',
              'Manual testing only'
            ],
            correctAnswer: 1,
            explanation: 'Shift-left testing means starting testing activities earlier in the SDLC to find defects sooner.'
          },
          {
            id: 12,
            question: 'What is Appium?',
            options: [
              'A mineral',
              'An open-source tool for mobile application testing',
              'A web browser',
              'A database'
            ],
            correctAnswer: 1,
            explanation: 'Appium is an open-source framework for automating mobile application testing on iOS and Android.'
          },
          {
            id: 13,
            question: 'What is a build in CI/CD?',
            options: [
              'Construction work',
              'Compiling code and creating executable artifacts',
              'Writing tests',
              'Deployment'
            ],
            correctAnswer: 1,
            explanation: 'A build compiles source code and creates deployable artifacts, often including running automated tests.'
          },
          {
            id: 14,
            question: 'What is test automation ROI?',
            options: [
              'Test speed',
              'Return on Investment - value gained from automation',
              'Number of tests',
              'Tool cost'
            ],
            correctAnswer: 1,
            explanation: 'Test automation ROI measures the value gained (time saved, bugs found) versus the cost of implementation.'
          },
          {
            id: 15,
            question: 'What is exploratory testing?',
            options: [
              'Testing without planning',
              'Simultaneous learning, test design, and execution',
              'Automated testing',
              'Performance testing'
            ],
            correctAnswer: 1,
            explanation: 'Exploratory testing involves simultaneous learning, test design, and execution without predefined scripts.'
          },
          {
            id: 16,
            question: 'What is a pipeline in CI/CD?',
            options: [
              'Water pipe',
              'Automated sequence of stages for building, testing, and deploying',
              'Test case',
              'Bug report'
            ],
            correctAnswer: 1,
            explanation: 'A CI/CD pipeline is an automated workflow that builds, tests, and deploys code through various stages.'
          },
          {
            id: 17,
            question: 'What is risk-based testing?',
            options: [
              'Dangerous testing',
              'Prioritizing testing based on risk assessment',
              'Random testing',
              'Testing everything'
            ],
            correctAnswer: 1,
            explanation: 'Risk-based testing prioritizes testing efforts based on the risk and impact of potential failures.'
          },
          {
            id: 18,
            question: 'What is test automation pyramid?',
            options: [
              'A building',
              'Model showing ideal distribution of different test types',
              'A tool',
              'A bug report'
            ],
            correctAnswer: 1,
            explanation: 'The test pyramid shows ideal distribution: many unit tests at base, fewer integration tests, fewer UI tests at top.'
          },
          {
            id: 19,
            question: 'What is test data management?',
            options: [
              'Deleting data',
              'Creating, maintaining, and managing data for testing',
              'Data entry',
              'Database backup'
            ],
            correctAnswer: 1,
            explanation: 'Test data management involves creating, maintaining, and managing appropriate data for various test scenarios.'
          },
          {
            id: 20,
            question: 'What is continuous testing?',
            options: [
              'Testing all day',
              'Executing automated tests throughout software delivery pipeline',
              'Manual testing',
              'Testing once'
            ],
            correctAnswer: 1,
            explanation: 'Continuous testing executes automated tests continuously throughout the software delivery pipeline for immediate feedback.'
          }
        ]
      },
      
      challenge: {
        title: 'Complete CI/CD Testing Pipeline',
        description: 'Build end-to-end automated testing pipeline with Jenkins',
        requirements: [
          'Set up GitHub repository with test automation code',
          'Configure Jenkins server (local or cloud)',
          'Create Jenkins pipeline for automated test execution',
          'Integrate Selenium tests to run on every commit',
          'Add API tests to the pipeline',
          'Configure parallel test execution',
          'Set up email notifications for build results',
          'Generate and publish test reports (HTML, Allure)',
          'Implement BDD tests using Cucumber',
          'Add code quality checks (SonarQube optional)',
          'Create Dockerfile for test environment',
          'Document complete setup process'
        ],
        submissionType: 'text',
        hints: [
          'Use Jenkinsfile for pipeline as code',
          'Use Git webhooks to trigger builds automatically',
          'Configure Jenkins plugins: Git, TestNG, Allure',
          'Use parallel stages for faster execution',
          'Store credentials securely in Jenkins',
          'Use Docker for consistent test environments',
          'Archive test reports as artifacts',
          'Add post-build actions for notifications',
          'Use Maven/Gradle for build management'
        ]
      }
    }
  ],
  
  finalProject: {
    title: 'Complete QA Portfolio Project',
    description: 'End-to-end testing project demonstrating all QA skills',
    duration: '3-4 weeks',
    
    overview: 'Create a comprehensive testing portfolio showcasing manual testing, automation, API testing, performance testing, and CI/CD integration. This project demonstrates your ability to work as a professional QA engineer.',
    
    requirements: [
      'Choose a real application (web app with APIs) or use demo sites like Sauce Demo, OrangeHRM',
      'Create comprehensive test plan and strategy document',
      'Design and document 50+ manual test cases covering all features',
      'Build automation framework using Selenium with Page Object Model',
      'Automate 30+ critical test scenarios',
      'Perform API testing with REST Assured or Postman',
      'Create performance test suite using JMeter',
      'Set up CI/CD pipeline with Jenkins/GitHub Actions',
      'Implement BDD scenarios using Cucumber',
      'Document and report 10+ bugs with detailed steps',
      'Generate professional test reports',
      'Create test metrics dashboard'
    ],
    
    deliverables: [
      {
        title: 'Test Strategy Document',
        description: 'Comprehensive test approach, scope, tools, and resources',
        format: 'PDF document',
        pages: '5-8 pages'
      },
      {
        title: 'Test Plan',
        description: 'Detailed test plan with schedule, milestones, and deliverables',
        format: 'PDF document',
        pages: '8-10 pages'
      },
      {
        title: 'Manual Test Cases',
        description: 'Excel/Google Sheets with 50+ detailed test cases',
        format: 'Excel/CSV file',
        pages: '50+ test cases'
      },
      {
        title: 'Test Automation Framework',
        description: 'Complete Selenium framework with POM and 30+ automated tests',
        format: 'GitHub repository',
        pages: 'Complete codebase'
      },
      {
        title: 'API Test Suite',
        description: 'Postman collection and/or Rest Assured tests',
        format: 'JSON collection / Code',
        pages: '15+ API tests'
      },
      {
        title: 'Performance Test Results',
        description: 'JMeter test plans and performance analysis report',
        format: 'JMX file + PDF report',
        pages: 'Complete analysis'
      },
      {
        title: 'Bug Reports',
        description: 'Detailed bug reports with severity, priority, steps to reproduce',
        format: 'PDF or Jira export',
        pages: '10+ bugs'
      },
      {
        title: 'CI/CD Pipeline',
        description: 'Jenkinsfile and configuration for automated test execution',
        format: 'Code in repository',
        pages: 'Working pipeline'
      },
      {
        title: 'Test Execution Report',
        description: 'Summary of test execution with pass/fail metrics',
        format: 'PDF with charts',
        pages: '5-8 pages'
      },
      {
        title: 'Demo Video',
        description: 'Screen recording demonstrating tests and framework',
        format: 'Video file/YouTube link',
        pages: '10-15 minutes'
      }
    ],
    
    evaluationCriteria: [
      {
        category: 'Test Planning & Documentation',
        weight: '20%',
        description: 'Quality of test strategy, plan, and documentation'
      },
      {
        category: 'Test Coverage',
        weight: '20%',
        description: 'Comprehensiveness of manual and automated tests'
      },
      {
        category: 'Automation Quality',
        weight: '25%',
        description: 'Framework design, code quality, and maintainability'
      },
      {
        category: 'Bug Detection & Reporting',
        weight: '15%',
        description: 'Quality and detail of bug reports'
      },
      {
        category: 'CI/CD Integration',
        weight: '10%',
        description: 'Successful pipeline setup and execution'
      },
      {
        category: 'Professional Presentation',
        weight: '10%',
        description: 'Overall presentation, documentation, and demo'
      }
    ],
    
    guidelines: [
      'Choose an application with sufficient complexity (5+ features)',
      'Document everything - pretend you\'re joining a real team',
      'Follow industry best practices and naming conventions',
      'Write clean, maintainable, well-commented code',
      'Create a professional README with setup instructions',
      'Use realistic test data and scenarios',
      'Demonstrate both positive and negative testing',
      'Show your problem-solving and debugging skills',
      'Keep everything organized in a clear folder structure',
      'Make your GitHub repository public for portfolio'
    ],
    
    resources: [
      'Test site: https://www.saucedemo.com/',
      'Test site: https://opensource-demo.orangehrmlive.com/',
      'Test site: https://the-internet.herokuapp.com/',
      'API: https://reqres.in/',
      'API: https://jsonplaceholder.typicode.com/',
      'Selenium WebDriver documentation',
      'TestNG documentation',
      'Jenkins documentation',
      'GitHub Actions documentation',
      'Test case templates online'
    ],
    
    timeline: [
      {
        week: 1,
        tasks: [
          'Choose application and explore functionality',
          'Write test strategy and test plan',
          'Create manual test cases (functional, UI, integration)',
          'Execute manual tests and log bugs',
          'Set up automation framework structure'
        ]
      },
      {
        week: 2,
        tasks: [
          'Develop Page Object Model classes',
          'Automate critical test scenarios',
          'Create data-driven tests',
          'Set up API test suite in Postman/Rest Assured',
          'Execute and validate API tests'
        ]
      },
      {
        week: 3,
        tasks: [
          'Complete remaining automation scripts',
          'Create JMeter performance test plan',
          'Execute performance tests and analyze results',
          'Set up Jenkins pipeline',
          'Integrate tests with CI/CD',
          'Implement BDD scenarios with Cucumber'
        ]
      },
      {
        week: 4,
        tasks: [
          'Generate comprehensive test reports',
          'Create test metrics and dashboard',
          'Write final documentation',
          'Record demo video',
          'Polish GitHub repository',
          'Prepare presentation'
        ]
      }
    ],
    
    submissionInstructions: 'Submit GitHub repository URL containing all code, test cases, and documentation. Include links to: published Postman collection, Jenkins build (if publicly accessible), demo video, and test reports. Ensure README has complete setup and execution instructions.',
    
    tips: [
      'Start with manual testing to understand the application deeply',
      'Build automation framework incrementally, test as you go',
      'Use version control from day one - commit regularly',
      'Write descriptive commit messages',
      'Don\'t automate everything - focus on critical paths',
      'Balance between positive and negative test scenarios',
      'Make test data management reusable',
      'Add proper waits and synchronization in automation',
      'Screenshot failures automatically for debugging',
      'Test your pipeline multiple times before submission',
      'Proofread all documentation for professionalism',
      'Get feedback from peers if possible',
      'Practice explaining your project - you\'ll present it in interviews'
    ]
  }
};

export default qaTestingRoadmap;