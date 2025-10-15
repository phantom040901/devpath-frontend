// src/data/roadmaps/softwareDevelopment.js

const softwareDevelopmentRoadmap = {
  id: 'software-development',
  title: 'Software Development Career Path',
  description: 'Master full-stack development, programming fundamentals, and modern software engineering practices',
  category: 'Software Development',
  estimatedDuration: '16-24 weeks',
  skillsGained: [
    'Full-Stack Development',
    'JavaScript & TypeScript',
    'React & Node.js',
    'Database Design',
    'API Development',
    'Version Control (Git)',
    'Software Architecture',
    'Agile Methodologies'
  ],
  
  modules: [
    {
      id: 1,
      title: 'Programming Fundamentals',
      description: 'Master the core concepts of programming and software development',
      duration: '4-6 weeks',
      difficulty: 'Beginner',
      
      learningResources: [
        {
          id: 1,
          title: 'JavaScript Programming - Full Course',
          type: 'video',
          platform: 'YouTube - freeCodeCamp',
          url: 'https://www.youtube.com/watch?v=jS4aFq5-91M',
          duration: '7 hours',
          description: 'Complete JavaScript course from basics to advanced concepts'
        },
        {
          id: 2,
          title: 'Git & GitHub for Beginners',
          type: 'video',
          platform: 'YouTube - freeCodeCamp',
          url: 'https://www.youtube.com/watch?v=RGOj5yH7evk',
          duration: '1 hour',
          description: 'Learn version control with Git and GitHub'
        },
        {
          id: 3,
          title: 'HTML & CSS Crash Course',
          type: 'video',
          platform: 'YouTube - Traversy Media',
          url: 'https://www.youtube.com/watch?v=UB1O30fR-EE',
          duration: '2 hours',
          description: 'Build responsive websites with HTML5 and CSS3'
        },
        {
          id: 4,
          title: 'Programming Fundamentals',
          type: 'article',
          platform: 'MDN Web Docs',
          url: 'https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web',
          duration: '3 hours read',
          description: 'Mozilla\'s comprehensive web development guide'
        },
        {
          id: 5,
          title: 'Data Structures & Algorithms',
          type: 'video',
          platform: 'YouTube - CS Dojo',
          url: 'https://www.youtube.com/watch?v=bum_19loj9A',
          duration: '50 minutes',
          description: 'Introduction to data structures and algorithms'
        },
        {
          id: 6,
          title: 'freeCodeCamp - Responsive Web Design',
          type: 'interactive',
          platform: 'freeCodeCamp',
          url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/',
          duration: '300 hours',
          description: 'Hands-on HTML, CSS, and responsive design certification'
        }
      ],
      
      quiz: {
        passingScore: 70,
        questions: [
          {
            id: 1,
            question: 'What does HTML stand for?',
            options: [
              'Hyper Text Markup Language',
              'High Tech Modern Language',
              'Home Tool Markup Language',
              'Hyperlinks and Text Markup Language'
            ],
            correctAnswer: 0,
            explanation: 'HTML stands for Hyper Text Markup Language and is used to structure content on the web.'
          },
          {
            id: 2,
            question: 'Which JavaScript keyword is used to declare a constant variable?',
            options: [
              'var',
              'let',
              'const',
              'constant'
            ],
            correctAnswer: 2,
            explanation: 'const is used to declare variables that cannot be reassigned after initialization.'
          },
          {
            id: 3,
            question: 'What is the purpose of CSS?',
            options: [
              'To add interactivity to web pages',
              'To structure web content',
              'To style and layout web pages',
              'To store data in databases'
            ],
            correctAnswer: 2,
            explanation: 'CSS (Cascading Style Sheets) is used to style and layout web pages, including colors, fonts, and positioning.'
          },
          {
            id: 4,
            question: 'Which Git command is used to save your changes with a message?',
            options: [
              'git push',
              'git save',
              'git commit',
              'git add'
            ],
            correctAnswer: 2,
            explanation: 'git commit saves staged changes to the local repository with a descriptive message.'
          },
          {
            id: 5,
            question: 'What is an array in programming?',
            options: [
              'A single value',
              'A collection of values stored in order',
              'A function that returns multiple values',
              'A type of loop'
            ],
            correctAnswer: 1,
            explanation: 'An array is a data structure that stores a collection of values in an ordered list.'
          },
          {
            id: 6,
            question: 'What does the "DOM" stand for in web development?',
            options: [
              'Data Object Model',
              'Document Object Model',
              'Digital Online Media',
              'Dynamic Output Method'
            ],
            correctAnswer: 1,
            explanation: 'DOM (Document Object Model) is a programming interface for web documents that represents the page structure.'
          },
          {
            id: 7,
            question: 'Which operator is used for strict equality in JavaScript?',
            options: [
              '=',
              '==',
              '===',
              '!='
            ],
            correctAnswer: 2,
            explanation: '=== checks for strict equality, comparing both value and type without type coercion.'
          },
          {
            id: 8,
            question: 'What is the purpose of a function in programming?',
            options: [
              'To store data',
              'To create reusable blocks of code',
              'To style elements',
              'To connect to databases'
            ],
            correctAnswer: 1,
            explanation: 'Functions are reusable blocks of code that perform specific tasks and can be called multiple times.'
          },
          {
            id: 9,
            question: 'Which HTML tag is used to create a hyperlink?',
            options: [
              '<link>',
              '<a>',
              '<href>',
              '<url>'
            ],
            correctAnswer: 1,
            explanation: 'The <a> (anchor) tag is used to create hyperlinks in HTML with the href attribute.'
          },
          {
            id: 10,
            question: 'What is responsive web design?',
            options: [
              'Websites that load quickly',
              'Websites that adapt to different screen sizes',
              'Websites with animations',
              'Websites that respond to user clicks'
            ],
            correctAnswer: 1,
            explanation: 'Responsive web design ensures websites adapt and display properly on various screen sizes and devices.'
          }
        ]
      },
      
      challenge: {
        title: 'Build Your First Web Page',
        description: 'Create a personal portfolio landing page',
        requirements: [
          'Create an HTML file with proper structure (DOCTYPE, html, head, body)',
          'Include a header with your name and navigation links',
          'Create sections for: About Me, Skills, Projects, Contact',
          'Style your page with CSS (colors, fonts, layout)',
          'Make it responsive using media queries',
          'Include at least 3 different HTML5 semantic tags'
        ],
        submissionType: 'text',
        hints: [
          'Use semantic HTML tags like <header>, <nav>, <section>, <footer>',
          'Use CSS Flexbox or Grid for layout',
          'Add a viewport meta tag for mobile responsiveness',
          'Use CSS variables for consistent colors',
          'Test your page on different screen sizes'
        ]
      }
    },
    
    {
      id: 2,
      title: 'Frontend Development with React',
      description: 'Build modern, interactive user interfaces with React.js',
      duration: '5-6 weeks',
      difficulty: 'Intermediate',
      
      learningResources: [
        {
          id: 1,
          title: 'React JS - Full Course for Beginners',
          type: 'video',
          platform: 'YouTube - freeCodeCamp',
          url: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
          duration: '12 hours',
          description: 'Complete React course covering hooks, state management, and more'
        },
        {
          id: 2,
          title: 'React Hooks Tutorial',
          type: 'video',
          platform: 'YouTube - Web Dev Simplified',
          url: 'https://www.youtube.com/watch?v=O6P86uwfdR0',
          duration: '50 minutes',
          description: 'Master React Hooks: useState, useEffect, useContext, and more'
        },
        {
          id: 3,
          title: 'Official React Documentation',
          type: 'article',
          platform: 'React.dev',
          url: 'https://react.dev/learn',
          duration: '4 hours read',
          description: 'Official React documentation with interactive examples'
        },
        {
          id: 4,
          title: 'React Router Tutorial',
          type: 'video',
          platform: 'YouTube - Net Ninja',
          url: 'https://www.youtube.com/watch?v=Law7wfdg_ls',
          duration: '2 hours',
          description: 'Learn routing and navigation in React applications'
        },
        {
          id: 5,
          title: 'State Management with Context API',
          type: 'article',
          platform: 'React Docs',
          url: 'https://react.dev/learn/passing-data-deeply-with-context',
          duration: '1 hour read',
          description: 'Manage global state without external libraries'
        },
        {
          id: 6,
          title: 'Tailwind CSS Crash Course',
          type: 'video',
          platform: 'YouTube - Traversy Media',
          url: 'https://www.youtube.com/watch?v=UBOj6rqRUME',
          duration: '90 minutes',
          description: 'Learn utility-first CSS with Tailwind'
        },
        {
          id: 7,
          title: 'React Projects - Frontend Developer',
          type: 'interactive',
          platform: 'freeCodeCamp',
          url: 'https://www.freecodecamp.org/learn/front-end-development-libraries/',
          duration: '300 hours',
          description: 'Build 5 projects to earn React certification'
        }
      ],
      
      quiz: {
        passingScore: 75,
        questions: [
          {
            id: 1,
            question: 'What is React?',
            options: [
              'A programming language',
              'A JavaScript library for building user interfaces',
              'A database system',
              'A CSS framework'
            ],
            correctAnswer: 1,
            explanation: 'React is a JavaScript library developed by Facebook for building user interfaces, especially single-page applications.'
          },
          {
            id: 2,
            question: 'Which hook is used to manage state in functional components?',
            options: [
              'useEffect',
              'useState',
              'useContext',
              'useReducer'
            ],
            correctAnswer: 1,
            explanation: 'useState is the React hook used to add state to functional components.'
          },
          {
            id: 3,
            question: 'What is JSX?',
            options: [
              'A new programming language',
              'JavaScript XML - a syntax extension for JavaScript',
              'A CSS preprocessor',
              'A testing framework'
            ],
            correctAnswer: 1,
            explanation: 'JSX (JavaScript XML) allows you to write HTML-like syntax in JavaScript, making React code more readable.'
          },
          {
            id: 4,
            question: 'What is the purpose of useEffect hook?',
            options: [
              'To manage component state',
              'To perform side effects in function components',
              'To create context',
              'To optimize performance'
            ],
            correctAnswer: 1,
            explanation: 'useEffect handles side effects like data fetching, subscriptions, or manually changing the DOM.'
          },
          {
            id: 5,
            question: 'What are props in React?',
            options: [
              'Properties passed from parent to child components',
              'Global variables',
              'CSS styles',
              'React built-in functions'
            ],
            correctAnswer: 0,
            explanation: 'Props (properties) are arguments passed from parent components to child components, similar to function parameters.'
          },
          {
            id: 6,
            question: 'What is the Virtual DOM?',
            options: [
              'A copy of the browser DOM',
              'A lightweight representation of the real DOM',
              'A database for storing DOM elements',
              'A CSS framework'
            ],
            correctAnswer: 1,
            explanation: 'Virtual DOM is a lightweight copy of the actual DOM that React uses to optimize rendering performance.'
          },
          {
            id: 7,
            question: 'Which method is used to update state in a class component?',
            options: [
              'updateState()',
              'changeState()',
              'setState()',
              'modifyState()'
            ],
            correctAnswer: 2,
            explanation: 'setState() is the method used to update state in React class components.'
          },
          {
            id: 8,
            question: 'What is React Router used for?',
            options: [
              'Managing component state',
              'Handling navigation and routing in React apps',
              'Connecting to APIs',
              'Styling components'
            ],
            correctAnswer: 1,
            explanation: 'React Router enables navigation and routing in single-page React applications.'
          },
          {
            id: 9,
            question: 'What does the key prop do in React lists?',
            options: [
              'Styles list items',
              'Helps React identify which items changed, added, or removed',
              'Sorts the list',
              'Encrypts list data'
            ],
            correctAnswer: 1,
            explanation: 'Keys help React identify which items in a list have changed, improving rendering performance.'
          },
          {
            id: 10,
            question: 'What is the Context API used for?',
            options: [
              'Making API calls',
              'Sharing state across components without prop drilling',
              'Creating animations',
              'Testing components'
            ],
            correctAnswer: 1,
            explanation: 'Context API provides a way to share values between components without passing props through every level.'
          },
          {
            id: 11,
            question: 'What is component lifecycle in React?',
            options: [
              'The order components are rendered',
              'The series of methods invoked at different stages of a component',
              'How long a component takes to load',
              'The styling process'
            ],
            correctAnswer: 1,
            explanation: 'Component lifecycle refers to the series of events from component creation to removal from the DOM.'
          },
          {
            id: 12,
            question: 'What does lifting state up mean in React?',
            options: [
              'Improving performance',
              'Moving state to a common parent component',
              'Deleting unused state',
              'Creating global variables'
            ],
            correctAnswer: 1,
            explanation: 'Lifting state up means moving state to the closest common ancestor to share it between components.'
          },
          {
            id: 13,
            question: 'What is a controlled component?',
            options: [
              'A component with error handling',
              'A form element whose value is controlled by React state',
              'A component that never re-renders',
              'A component with CSS animations'
            ],
            correctAnswer: 1,
            explanation: 'Controlled components have form data controlled by React state rather than the DOM.'
          },
          {
            id: 14,
            question: 'What is the purpose of React.Fragment?',
            options: [
              'To add CSS styles',
              'To group multiple elements without adding extra nodes to the DOM',
              'To create animations',
              'To fetch data'
            ],
            correctAnswer: 1,
            explanation: 'React.Fragment (or <>) lets you group elements without adding extra DOM nodes.'
          },
          {
            id: 15,
            question: 'What is prop drilling?',
            options: [
              'A React optimization technique',
              'Passing props through multiple component layers',
              'A debugging method',
              'A testing strategy'
            ],
            correctAnswer: 1,
            explanation: 'Prop drilling is passing props through intermediate components that don\'t use them to reach deeply nested components.'
          }
        ]
      },
      
      challenge: {
        title: 'Build a React To-Do Application',
        description: 'Create a fully functional task management app',
        requirements: [
          'Create a React app with component-based architecture',
          'Implement add, edit, delete, and mark complete functionality',
          'Use useState for state management',
          'Use useEffect to persist tasks in localStorage',
          'Add filtering (All, Active, Completed)',
          'Make the UI responsive and styled with CSS or Tailwind',
          'Include input validation and error handling'
        ],
        submissionType: 'text',
        hints: [
          'Break down into components: TodoList, TodoItem, TodoForm',
          'Store todos as an array of objects with id, text, completed properties',
          'Use Date.now() or UUID for unique IDs',
          'Implement filter buttons using conditional rendering',
          'Save to localStorage on every state change'
        ]
      }
    },
    
    {
      id: 3,
      title: 'Backend Development & APIs',
      description: 'Build server-side applications with Node.js and databases',
      duration: '5-6 weeks',
      difficulty: 'Advanced',
      
      learningResources: [
        {
          id: 1,
          title: 'Node.js and Express.js - Full Course',
          type: 'video',
          platform: 'YouTube - freeCodeCamp',
          url: 'https://www.youtube.com/watch?v=Oe421EPjeBE',
          duration: '8 hours',
          description: 'Complete backend development with Node.js and Express'
        },
        {
          id: 2,
          title: 'RESTful API Design - Best Practices',
          type: 'video',
          platform: 'YouTube - Traversy Media',
          url: 'https://www.youtube.com/watch?v=Q-BpqyOT3a8',
          duration: '30 minutes',
          description: 'Learn REST API principles and best practices'
        },
        {
          id: 3,
          title: 'MongoDB Crash Course',
          type: 'video',
          platform: 'YouTube - Web Dev Simplified',
          url: 'https://www.youtube.com/watch?v=ofme2o29ngU',
          duration: '30 minutes',
          description: 'NoSQL database fundamentals with MongoDB'
        },
        {
          id: 4,
          title: 'SQL Tutorial - Full Database Course',
          type: 'video',
          platform: 'YouTube - freeCodeCamp',
          url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
          duration: '4 hours',
          description: 'Comprehensive SQL and relational database tutorial'
        },
        {
          id: 5,
          title: 'Authentication with JWT',
          type: 'video',
          platform: 'YouTube - Web Dev Simplified',
          url: 'https://www.youtube.com/watch?v=mbsmsi7l3r4',
          duration: '20 minutes',
          description: 'Implement secure authentication with JSON Web Tokens'
        },
        {
          id: 6,
          title: 'Node.js Documentation',
          type: 'article',
          platform: 'Node.js Official Docs',
          url: 'https://nodejs.org/en/docs/',
          duration: '3 hours read',
          description: 'Official Node.js documentation and guides'
        },
        {
          id: 7,
          title: 'Backend Development Certification',
          type: 'interactive',
          platform: 'freeCodeCamp',
          url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/',
          duration: '300 hours',
          description: 'Build APIs and microservices certification'
        }
      ],
      
      quiz: {
        passingScore: 75,
        questions: [
          {
            id: 1,
            question: 'What is Node.js?',
            options: [
              'A JavaScript framework',
              'A JavaScript runtime built on Chrome V8 engine',
              'A database system',
              'A CSS preprocessor'
            ],
            correctAnswer: 1,
            explanation: 'Node.js is a JavaScript runtime that executes JavaScript code outside a web browser.'
          },
          {
            id: 2,
            question: 'What does REST stand for?',
            options: [
              'Remote Execution Simple Transfer',
              'Representational State Transfer',
              'Rapid Efficient State Transmission',
              'Real-time Electronic System Transfer'
            ],
            correctAnswer: 1,
            explanation: 'REST (Representational State Transfer) is an architectural style for designing networked applications.'
          },
          {
            id: 3,
            question: 'Which HTTP method is used to retrieve data?',
            options: [
              'POST',
              'PUT',
              'GET',
              'DELETE'
            ],
            correctAnswer: 2,
            explanation: 'GET is the HTTP method used to retrieve data from a server without modifying it.'
          },
          {
            id: 4,
            question: 'What is middleware in Express.js?',
            options: [
              'A database',
              'Functions that execute during request-response cycle',
              'A frontend framework',
              'A testing tool'
            ],
            correctAnswer: 1,
            explanation: 'Middleware functions have access to request and response objects and execute during the request-response cycle.'
          },
          {
            id: 5,
            question: 'What is MongoDB?',
            options: [
              'A relational database',
              'A NoSQL document database',
              'A programming language',
              'A web server'
            ],
            correctAnswer: 1,
            explanation: 'MongoDB is a NoSQL database that stores data in flexible, JSON-like documents.'
          },
          {
            id: 6,
            question: 'What is JWT used for?',
            options: [
              'Styling websites',
              'Secure authentication and information exchange',
              'Database queries',
              'File uploads'
            ],
            correctAnswer: 1,
            explanation: 'JWT (JSON Web Token) is used for securely transmitting information between parties as a JSON object.'
          },
          {
            id: 7,
            question: 'What is an API endpoint?',
            options: [
              'The end of a program',
              'A specific URL where an API can access resources',
              'A database table',
              'A CSS file'
            ],
            correctAnswer: 1,
            explanation: 'An API endpoint is a specific URL path where the API can be accessed to perform operations.'
          },
          {
            id: 8,
            question: 'What is CORS?',
            options: [
              'A database technology',
              'Cross-Origin Resource Sharing - a security feature',
              'A JavaScript framework',
              'A CSS methodology'
            ],
            correctAnswer: 1,
            explanation: 'CORS is a mechanism that allows restricted resources on a web page to be requested from another domain.'
          },
          {
            id: 9,
            question: 'What does npm stand for?',
            options: [
              'New Programming Method',
              'Node Package Manager',
              'Network Protocol Manager',
              'Next Page Module'
            ],
            correctAnswer: 1,
            explanation: 'npm is the default package manager for Node.js, used to install and manage dependencies.'
          },
          {
            id: 10,
            question: 'What is the purpose of environment variables?',
            options: [
              'To style applications',
              'To store configuration and sensitive data outside source code',
              'To create animations',
              'To test code'
            ],
            correctAnswer: 1,
            explanation: 'Environment variables store configuration settings and sensitive data (like API keys) outside the codebase.'
          },
          {
            id: 11,
            question: 'What is SQL injection?',
            options: [
              'A database feature',
              'A security vulnerability where malicious SQL code is inserted',
              'A way to optimize queries',
              'A database design pattern'
            ],
            correctAnswer: 1,
            explanation: 'SQL injection is a code injection technique that exploits vulnerabilities in database queries.'
          },
          {
            id: 12,
            question: 'What is the difference between SQL and NoSQL databases?',
            options: [
              'SQL is newer than NoSQL',
              'SQL uses tables and schemas, NoSQL uses flexible documents',
              'SQL is faster than NoSQL',
              'There is no difference'
            ],
            correctAnswer: 1,
            explanation: 'SQL databases use structured tables with predefined schemas, while NoSQL databases offer flexible, schema-less data storage.'
          },
          {
            id: 13,
            question: 'What is Express.js?',
            options: [
              'A database',
              'A minimal web framework for Node.js',
              'A testing library',
              'A CSS framework'
            ],
            correctAnswer: 1,
            explanation: 'Express.js is a fast, minimalist web framework for Node.js used to build APIs and web applications.'
          },
          {
            id: 14,
            question: 'What HTTP status code indicates successful request?',
            options: [
              '404',
              '500',
              '200',
              '301'
            ],
            correctAnswer: 2,
            explanation: '200 OK indicates that the HTTP request was successful.'
          },
          {
            id: 15,
            question: 'What is async/await in JavaScript?',
            options: [
              'A database feature',
              'A way to handle asynchronous operations more cleanly',
              'A CSS animation',
              'A testing method'
            ],
            correctAnswer: 1,
            explanation: 'async/await is syntactic sugar for working with Promises, making asynchronous code easier to read and write.'
          }
        ]
      },
      
      challenge: {
        title: 'Build a RESTful API',
        description: 'Create a complete backend API for a blog platform',
        requirements: [
          'Set up Express.js server with proper routing',
          'Create CRUD endpoints for blog posts (GET, POST, PUT, DELETE)',
          'Implement user authentication with JWT',
          'Connect to MongoDB or PostgreSQL database',
          'Add input validation and error handling',
          'Implement pagination for listing posts',
          'Add API documentation (describe endpoints, parameters, responses)'
        ],
        submissionType: 'text',
        hints: [
          'Use express.Router() to organize routes',
          'Use bcrypt to hash passwords',
          'Implement middleware for authentication',
          'Use Mongoose (MongoDB) or Sequelize (PostgreSQL) as ORM',
          'Test endpoints using Postman or Thunder Client',
          'Return proper HTTP status codes (200, 201, 400, 401, 404, 500)'
        ]
      }
    },
    
    {
      id: 4,
      title: 'Full-Stack Integration & Best Practices',
      description: 'Combine frontend and backend, deployment, and professional development practices',
      duration: '4-6 weeks',
      difficulty: 'Expert',
      
      learningResources: [
        {
          id: 1,
          title: 'MERN Stack Course - Full Tutorial',
          type: 'video',
          platform: 'YouTube - freeCodeCamp',
          url: 'https://www.youtube.com/watch?v=7CqJlxBYj-M',
          duration: '12 hours',
          description: 'Build full-stack apps with MongoDB, Express, React, Node.js'
        },
        {
          id: 2,
          title: 'Docker Tutorial for Beginners',
          type: 'video',
          platform: 'YouTube - TechWorld with Nana',
          url: 'https://www.youtube.com/watch?v=3c-iBn73dDE',
          duration: '3 hours',
          description: 'Containerize your applications with Docker'
        },
        {
          id: 3,
          title: 'Deploying to Heroku/Vercel/Netlify',
          type: 'article',
          platform: 'Various Docs',
          url: 'https://vercel.com/docs',
          duration: '2 hours read',
          description: 'Deploy full-stack applications to cloud platforms'
        },
        {
          id: 4,
          title: 'Testing JavaScript Applications',
          type: 'video',
          platform: 'YouTube - freeCodeCamp',
          url: 'https://www.youtube.com/watch?v=8Xwq35cPwYg',
          duration: '2 hours',
          description: 'Unit and integration testing with Jest and React Testing Library'
        },
        {
          id: 5,
          title: 'Clean Code Principles',
          type: 'article',
          platform: 'Clean Code Book Summary',
          url: 'https://github.com/ryanmcdermott/clean-code-javascript',
          duration: '3 hours read',
          description: 'Write maintainable, readable code following best practices'
        },
        {
          id: 6,
          title: 'Web Security Fundamentals',
          type: 'video',
          platform: 'YouTube - Traversy Media',
          url: 'https://www.youtube.com/watch?v=4TvcSjQLz4s',
          duration: '1 hour',
          description: 'Secure your web applications from common vulnerabilities'
        },
        {
          id: 7,
          title: 'CI/CD with GitHub Actions',
          type: 'article',
          platform: 'GitHub Docs',
          url: 'https://docs.github.com/en/actions',
          duration: '2 hours read',
          description: 'Automate testing and deployment with CI/CD pipelines'
        },
        {
          id: 8,
          title: 'TypeScript Crash Course',
          type: 'video',
          platform: 'YouTube - Traversy Media',
          url: 'https://www.youtube.com/watch?v=BCg4U1FzODs',
          duration: '90 minutes',
          description: 'Add type safety to JavaScript applications'
        }
      ],
      
      quiz: {
        passingScore: 80,
        questions: [
          {
            id: 1,
            question: 'What is the MERN stack?',
            options: [
              'MySQL, Express, React, Node.js',
              'MongoDB, Express, React, Node.js',
              'MongoDB, Elastic, React, Next.js',
              'MySQL, Express, Redux, Node.js'
            ],
            correctAnswer: 1,
            explanation: 'MERN stack consists of MongoDB (database), Express (backend framework), React (frontend library), and Node.js (runtime).'
          },
          {
            id: 2,
            question: 'What is Docker used for?',
            options: [
              'Version control',
              'Containerizing applications for consistent deployment',
              'Testing applications',
              'Writing code'
            ],
            correctAnswer: 1,
            explanation: 'Docker packages applications into containers that can run consistently across different environments.'
          },
          {
            id: 3,
            question: 'What does CI/CD stand for?',
            options: [
              'Code Integration / Code Deployment',
              'Continuous Integration / Continuous Deployment',
              'Computer Interface / Cloud Database',
              'Code Inspection / Code Development'
            ],
            correctAnswer: 1,
            explanation: 'CI/CD is the practice of automating integration, testing, and deployment of code changes.'
          },
          {
            id: 4,
            question: 'What is TypeScript?',
            options: [
              'A JavaScript runtime',
              'A typed superset of JavaScript',
              'A CSS framework',
              'A database language'
            ],
            correctAnswer: 1,
            explanation: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript, adding type safety.'
          },
          {
            id: 5,
            question: 'What is the purpose of unit testing?',
            options: [
              'To test the entire application',
              'To test individual components or functions in isolation',
              'To test user interfaces',
              'To test deployment'
            ],
            correctAnswer: 1,
            explanation: 'Unit testing verifies that individual units of code (functions, components) work correctly in isolation.'
          },
          {
            id: 6,
            question: 'What is HTTPS and why is it important?',
            options: [
              'A faster version of HTTP',
              'HTTP with SSL/TLS encryption for secure communication',
              'A new programming language',
              'A database protocol'
            ],
            correctAnswer: 1,
            explanation: 'HTTPS encrypts data between client and server using SSL/TLS, protecting sensitive information from interception.'
          },
          {
            id: 7,
            question: 'What is the purpose of environment-specific configuration?',
            options: [
              'To make code run faster',
              'To use different settings for development, staging, and production',
              'To add more features',
              'To reduce code size'
            ],
            correctAnswer: 1,
            explanation: 'Environment-specific configuration allows different settings (like API URLs, database connections) for different deployment environments.'
          },
          {
            id: 8,
            question: 'What is code refactoring?',
            options: [
              'Adding new features',
              'Restructuring existing code without changing external behavior',
              'Fixing bugs',
              'Deleting old code'
            ],
            correctAnswer: 1,
            explanation: 'Refactoring improves code structure, readability, and maintainability without changing functionality.'
          },
          {
            id: 9,
            question: 'What is a webhook?',
            options: [
              'A type of database',
              'An HTTP callback that sends real-time data to other applications',
              'A CSS framework',
              'A testing tool'
            ],
            correctAnswer: 1,
            explanation: 'Webhooks are automated messages sent from apps when events occur, enabling real-time integrations.'
          },
          {
            id: 10,
            question: 'What is the purpose of a .gitignore file?',
            options: [
              'To delete files',
              'To specify files that Git should not track',
              'To list all project files',
              'To configure Git settings'
            ],
            correctAnswer: 1,
            explanation: '.gitignore specifies intentionally untracked files (like node_modules, .env) that Git should ignore.'
          },
          {
            id: 11,
            question: 'What is serverless architecture?',
            options: [
              'Applications with no backend',
              'Cloud computing where server management is abstracted away',
              'Static websites only',
              'Applications without databases'
            ],
            correctAnswer: 1,
            explanation: 'Serverless lets you run code without managing servers; the cloud provider handles infrastructure automatically.'
          },
          {
            id: 12,
            question: 'What is the DRY principle?',
            options: [
              'Delete Redundant YAML',
              'Don\'t Repeat Yourself',
              'Debug Run Yearly',
              'Deploy Rapidly Yearly'
            ],
            correctAnswer: 1,
            explanation: 'DRY principle states that every piece of knowledge should have a single, unambiguous representation in code.'
          },
          {
            id: 13,
            question: 'What is GraphQL?',
            options: [
              'A database',
              'A query language for APIs that allows clients to request specific data',
              'A JavaScript framework',
              'A CSS preprocessor'
            ],
            correctAnswer: 1,
            explanation: 'GraphQL is a query language that enables clients to request exactly the data they need from APIs.'
          },
          {
            id: 14,
            question: 'What is OAuth?',
            options: [
              'A programming language',
              'An authorization framework for secure third-party access',
              'A database system',
              'A testing framework'
            ],
            correctAnswer: 1,
            explanation: 'OAuth is an open standard for access delegation, commonly used for token-based authentication.'
          },
          {
            id: 15,
            question: 'What is load balancing?',
            options: [
              'Optimizing code',
              'Distributing network traffic across multiple servers',
              'Reducing file sizes',
              'Testing performance'
            ],
            correctAnswer: 1,
            explanation: 'Load balancing distributes incoming traffic across multiple servers to ensure reliability and performance.'
          },
          {
            id: 16,
            question: 'What is caching and why is it important?',
            options: [
              'Deleting old data',
              'Storing frequently accessed data for faster retrieval',
              'Backing up databases',
              'Encrypting data'
            ],
            correctAnswer: 1,
            explanation: 'Caching stores copies of frequently accessed data to reduce latency and improve application performance.'
          },
          {
            id: 17,
            question: 'What is an ORM?',
            options: [
              'Object Relational Mapping - a technique to interact with databases using objects',
              'Online Resource Manager',
              'Organized Request Method',
              'Original Response Model'
            ],
            correctAnswer: 0,
            explanation: 'ORM converts data between incompatible type systems (like database tables and programming objects).'
          },
          {
            id: 18,
            question: 'What is semantic versioning (SemVer)?',
            options: [
              'Naming variables properly',
              'A versioning scheme: MAJOR.MINOR.PATCH',
              'Testing methodology',
              'Code formatting standard'
            ],
            correctAnswer: 1,
            explanation: 'SemVer uses MAJOR.MINOR.PATCH format where MAJOR = breaking changes, MINOR = new features, PATCH = bug fixes.'
          },
          {
            id: 19,
            question: 'What is a microservice architecture?',
            options: [
              'Very small applications',
              'Architecture where application is built as small, independent services',
              'Mobile-only applications',
              'Minimalist design pattern'
            ],
            correctAnswer: 1,
            explanation: 'Microservices architecture structures an application as a collection of loosely coupled, independently deployable services.'
          },
          {
            id: 20,
            question: 'What is technical debt?',
            options: [
              'Money owed to developers',
              'Future cost of choosing quick solutions over better approaches',
              'Unpaid software licenses',
              'Outdated hardware'
            ],
            correctAnswer: 1,
            explanation: 'Technical debt is the implied cost of future rework caused by choosing an easy solution now instead of a better approach.'
          }
        ]
      },
      
      challenge: {
        title: 'Full-Stack Project: Task Management System',
        description: 'Build a complete task management application with authentication',
        requirements: [
          'Frontend: Build with React, implement user authentication, task CRUD, drag-and-drop, filtering and search',
          'Backend: Create REST API with Node.js/Express, JWT authentication, MongoDB/PostgreSQL database',
          'Features: User registration/login, create/edit/delete tasks, assign priorities, set due dates, mark complete',
          'Deploy both frontend and backend to cloud platforms (Vercel, Netlify, Heroku, Railway)',
          'Write unit tests for at least 3 components and 3 API endpoints',
          'Use Git with meaningful commit messages',
          'Create a README with setup instructions, API documentation, and screenshots',
          'Implement responsive design for mobile and desktop'
        ],
        submissionType: 'text',
        hints: [
          'Use React Context or Redux for state management',
          'Implement protected routes on frontend',
          'Use bcrypt for password hashing',
          'Implement CORS properly for cross-origin requests',
          'Use environment variables for sensitive data',
          'Add loading states and error handling throughout',
          'Consider using React DnD for drag-and-drop',
          'Write clear API documentation with example requests/responses'
        ]
      }
    }
  ],
  
  finalProject: {
    title: 'Full-Stack Capstone Project',
    description: 'Design and build a complete production-ready web application',
    duration: '3-4 weeks',
    
    overview: 'Create a comprehensive full-stack web application that demonstrates your mastery of software development. This project should showcase all skills learned throughout the roadmap.',
    
    requirements: [
      'Choose a unique project idea (e-commerce, social platform, booking system, etc.)',
      'Design complete system architecture and database schema',
      'Build responsive frontend with React and modern UI/UX practices',
      'Develop RESTful API backend with proper authentication and authorization',
      'Implement at least 5 major features with full CRUD operations',
      'Add real-time features (WebSockets, notifications) - optional but impressive',
      'Write comprehensive tests (unit, integration) with 70%+ code coverage',
      'Deploy to production with CI/CD pipeline',
      'Create professional documentation and user guide',
      'Present project with demo video or live demonstration'
    ],
    
    deliverables: [
      {
        title: 'Project Proposal',
        description: 'Detailed project plan with features, tech stack, and timeline',
        format: 'PDF document',
        pages: '3-5 pages'
      },
      {
        title: 'System Architecture Diagram',
        description: 'Visual representation of system components and data flow',
        format: 'Image or PDF',
        pages: '1-2 diagrams'
      },
      {
        title: 'Source Code Repository',
        description: 'Clean, well-organized GitHub repository with meaningful commits',
        format: 'GitHub link',
        pages: 'Complete codebase'
      },
      {
        title: 'API Documentation',
        description: 'Complete API documentation with endpoints, parameters, and examples',
        format: 'Markdown or Postman collection',
        pages: '5-10 pages'
      },
      {
        title: 'User Guide',
        description: 'Step-by-step guide for using the application',
        format: 'PDF or website',
        pages: '3-5 pages'
      },
      {
        title: 'Deployed Application',
        description: 'Live, working application accessible via URL',
        format: 'Live URL',
        pages: 'Working application'
      },
      {
        title: 'Presentation/Demo',
        description: 'Video walkthrough or live demo of the application',
        format: 'Video (5-10 min) or live demo',
        pages: 'Demonstration'
      }
    ],
    
    evaluationCriteria: [
      {
        category: 'Functionality',
        weight: '30%',
        description: 'Application works correctly with all features implemented'
      },
      {
        category: 'Code Quality',
        weight: '25%',
        description: 'Clean, maintainable, well-documented code following best practices'
      },
      {
        category: 'User Experience',
        weight: '20%',
        description: 'Intuitive, responsive design with good UX/UI'
      },
      {
        category: 'Technical Implementation',
        weight: '15%',
        description: 'Proper use of technologies, security, and architecture'
      },
      {
        category: 'Documentation',
        weight: '10%',
        description: 'Clear, comprehensive documentation and presentation'
      }
    ],
    
    guidelines: [
      'Choose a project that solves a real problem or adds value',
      'Focus on building something you\'re passionate about',
      'Implement proper error handling and validation throughout',
      'Follow security best practices (input sanitization, HTTPS, secure auth)',
      'Write clean, readable code with meaningful variable names',
      'Use Git effectively with feature branches and pull requests',
      'Test thoroughly before deployment',
      'Gather feedback and iterate on your design'
    ],
    
    resources: [
      'GitHub for version control and project showcase',
      'Figma or Adobe XD for UI/UX design mockups',
      'Postman for API testing and documentation',
      'Jest and React Testing Library for testing',
      'Vercel/Netlify for frontend hosting',
      'Railway/Render/Heroku for backend hosting',
      'MongoDB Atlas or PostgreSQL for database',
      'Cloudinary or AWS S3 for file storage'
    ],
    
    timeline: [
      {
        week: 1,
        tasks: [
          'Finalize project idea and scope',
          'Design system architecture and database schema',
          'Create UI/UX mockups',
          'Set up project repositories and development environment',
          'Plan features and create task breakdown'
        ]
      },
      {
        week: 2,
        tasks: [
          'Build backend API with core features',
          'Set up database and models',
          'Implement authentication system',
          'Create frontend components and layouts',
          'Integrate frontend with backend'
        ]
      },
      {
        week: 3,
        tasks: [
          'Implement remaining features',
          'Add styling and polish UI/UX',
          'Write tests for critical functionality',
          'Fix bugs and handle edge cases',
          'Optimize performance'
        ]
      },
      {
        week: 4,
        tasks: [
          'Deploy to production',
          'Set up CI/CD pipeline',
          'Write documentation',
          'Create demo video or prepare live demo',
          'Final testing and refinement'
        ]
      }
    ],
    
    submissionInstructions: 'Submit GitHub repository link containing all source code, README with live URLs, setup instructions, and API documentation. Include a demo video or be prepared for live demonstration.',
    
    tips: [
      'Start simple and add complexity gradually',
      'Commit code frequently with meaningful messages',
      'Test features as you build them',
      'Don\'t try to build everything at once - MVP first',
      'Ask for feedback early and often',
      'Document as you go, not at the end',
      'Keep your code DRY (Don\'t Repeat Yourself)',
      'Focus on making it work, then make it better'
    ]
  }
};

export default softwareDevelopmentRoadmap;