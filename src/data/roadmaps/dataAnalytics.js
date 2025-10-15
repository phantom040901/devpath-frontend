// src/data/roadmaps/dataAnalytics.js

const dataAnalyticsRoadmap = {
  id: 'data-analytics',
  title: 'Data & Analytics Career Path',
  description: 'Master data analysis, visualization, SQL, Python, and business intelligence',
  category: 'Data & Analytics',
  estimatedDuration: '16-20 weeks',
  skillsGained: [
    'Data Analysis',
    'SQL & Databases',
    'Python for Data Science',
    'Data Visualization',
    'Statistics & Probability',
    'Business Intelligence',
    'Excel & Power BI',
    'Data Cleaning & ETL'
  ],
  
  modules: [
    {
      id: 1,
      title: 'Data Fundamentals & Excel',
      description: 'Master data analysis basics, Excel, and statistical foundations',
      duration: '4 weeks',
      difficulty: 'Beginner',
      
      learningResources: [
        {
          id: 1,
          title: 'Excel Tutorial for Beginners',
          type: 'video',
          platform: 'YouTube - freeCodeCamp',
          url: 'https://www.youtube.com/watch?v=Vl0H-qTclOg',
          duration: '26 min',
          description: 'Complete Excel course covering formulas, pivot tables, and charts'
        },
        {
          id: 2,
          title: 'Statistics for Data Science',
          type: 'video',
          platform: 'YouTube - freeCodeCamp',
          url: 'https://www.youtube.com/watch?v=xxpc-HPKN28',
          duration: '8 hours',
          description: 'Statistics fundamentals for data analysis'
        },
        {
          id: 3,
          title: 'Data Analysis with Excel',
          type: 'video',
          platform: 'Microsoft Learn',
          url: 'https://www.youtube.com/watch?v=qrbf9DtR3_c',
          duration: '3 hours',
          description: 'Official Excel data analysis training'
        },
        {
          id: 4,
          title: 'Introduction to Data Analytics',
          type: 'video',
          platform: 'YouTube - Google Career Certificates',
          url: 'https://www.youtube.com/watch?v=yZvFH7B6gKI',
          duration: '9 min',
          description: 'Google Data Analytics Professional Certificate preview'
        },
        {
          id: 5,
          title: 'Data Cleaning Techniques',
          type: 'article',
          platform: 'Towards Data Science',
          url: 'https://towardsdatascience.com/',
          duration: '1 hour read',
          description: 'Best practices for cleaning and preparing data'
        }
      ],
      
      quiz: {
        passingScore: 70,
        questions: [
          {
            id: 1,
            question: 'What is a pivot table in Excel?',
            options: [
              'A type of chart',
              'A tool to summarize and analyze large datasets',
              'A formula function',
              'A data validation method'
            ],
            correctAnswer: 1,
            explanation: 'Pivot tables summarize, analyze, and present data in a flexible, interactive way.'
          },
          {
            id: 2,
            question: 'What does the VLOOKUP function do?',
            options: [
              'Validates data',
              'Searches for a value in a table and returns corresponding value',
              'Creates charts',
              'Sorts data vertically'
            ],
            correctAnswer: 1,
            explanation: 'VLOOKUP searches vertically in a table to find and return a value from another column.'
          },
          {
            id: 3,
            question: 'What is the mean in statistics?',
            options: [
              'The middle value',
              'The most frequent value',
              'The average of all values',
              'The range of values'
            ],
            correctAnswer: 2,
            explanation: 'The mean is the average, calculated by summing all values and dividing by the count.'
          },
          {
            id: 4,
            question: 'What is data cleaning?',
            options: [
              'Deleting all data',
              'Removing errors and inconsistencies from datasets',
              'Creating backups',
              'Organizing files'
            ],
            correctAnswer: 1,
            explanation: 'Data cleaning involves identifying and correcting errors, inconsistencies, and missing values in data.'
          },
          {
            id: 5,
            question: 'What is the purpose of data visualization?',
            options: [
              'To make data pretty',
              'To communicate insights and patterns clearly',
              'To hide data complexity',
              'To reduce data size'
            ],
            correctAnswer: 1,
            explanation: 'Data visualization transforms data into visual formats to reveal patterns, trends, and insights.'
          },
          {
            id: 6,
            question: 'What is a histogram used for?',
            options: [
              'Showing relationships between variables',
              'Displaying frequency distribution of numerical data',
              'Comparing categories',
              'Showing trends over time'
            ],
            correctAnswer: 1,
            explanation: 'Histograms display the distribution of numerical data by grouping values into bins.'
          },
          {
            id: 7,
            question: 'What does standard deviation measure?',
            options: [
              'The average value',
              'The spread or dispersion of data',
              'The highest value',
              'The number of data points'
            ],
            correctAnswer: 1,
            explanation: 'Standard deviation measures how spread out values are from the mean.'
          },
          {
            id: 8,
            question: 'What is a correlation?',
            options: [
              'The average of two variables',
              'The relationship between two variables',
              'The difference between values',
              'The sum of all values'
            ],
            correctAnswer: 1,
            explanation: 'Correlation measures the strength and direction of relationship between two variables.'
          },
          {
            id: 9,
            question: 'What is ETL in data processing?',
            options: [
              'Excel Table Lookup',
              'Extract, Transform, Load',
              'Error Testing Logic',
              'Efficient Transfer Loop'
            ],
            correctAnswer: 1,
            explanation: 'ETL is the process of Extracting data from sources, Transforming it, and Loading it into a destination.'
          },
          {
            id: 10,
            question: 'What is the median?',
            options: [
              'The average value',
              'The most common value',
              'The middle value when data is sorted',
              'The range of values'
            ],
            correctAnswer: 2,
            explanation: 'The median is the middle value in a sorted dataset, dividing it into two equal halves.'
          }
        ]
      },
      
      challenge: {
        title: 'Sales Data Analysis in Excel',
        description: 'Analyze a sales dataset and create insights',
        requirements: [
          'Import and clean sales data (remove duplicates, handle missing values)',
          'Calculate key metrics: total sales, average order value, sales by region',
          'Create pivot tables to analyze sales by product category and time period',
          'Build charts: bar chart for top products, line chart for monthly trends',
          'Use conditional formatting to highlight top performers',
          'Create a dashboard summarizing key findings'
        ],
        submissionType: 'text',
        hints: [
          'Use SUMIF, AVERAGEIF, and COUNTIF functions',
          'Create calculated fields in pivot tables',
          'Use slicers for interactive filtering',
          'Format numbers as currency',
          'Add data labels to charts for clarity'
        ]
      }
    },
    
    {
      id: 2,
      title: 'SQL & Database Analysis',
      description: 'Master SQL queries and database management for data analysis',
      duration: '5 weeks',
      difficulty: 'Intermediate',
      
      learningResources: [
        {
          id: 1,
          title: 'SQL Tutorial - Full Database Course',
          type: 'video',
          platform: 'YouTube - freeCodeCamp',
          url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
          duration: '4 hours',
          description: 'Complete SQL course from basics to advanced queries'
        },
        {
          id: 2,
          title: 'SQL for Data Analysis',
          type: 'video',
          platform: 'YouTube - Alex The Analyst',
          url: 'https://www.youtube.com/watch?v=7mz73uXD9DA',
          duration: '4 hours',
          description: 'Practical SQL for data analysis scenarios'
        },
        {
          id: 3,
          title: 'PostgreSQL Tutorial',
          type: 'video',
          platform: 'YouTube - freeCodeCamp',
          url: 'https://www.youtube.com/watch?v=qw--VYLpxG4',
          duration: '4 hours',
          description: 'Learn PostgreSQL database management'
        },
        {
          id: 4,
          title: 'SQL Joins Explained',
          type: 'article',
          platform: 'W3Schools',
          url: 'https://www.w3schools.com/sql/sql_join.asp',
          duration: '1 hour read',
          description: 'Master INNER, LEFT, RIGHT, and FULL joins'
        },
        {
          id: 5,
          title: 'Window Functions in SQL',
          type: 'article',
          platform: 'Mode Analytics',
          url: 'https://mode.com/sql-tutorial/',
          duration: '2 hours read',
          description: 'Advanced SQL window functions tutorial'
        },
        {
          id: 6,
          title: 'SQL Practice Problems',
          type: 'interactive',
          platform: 'LeetCode / HackerRank',
          url: 'https://leetcode.com/problemset/database/',
          duration: '10+ hours',
          description: 'Practice SQL with real interview questions'
        }
      ],
      
      quiz: {
        passingScore: 75,
        questions: [
          {
            id: 1,
            question: 'What does SQL stand for?',
            options: [
              'Standard Query Language',
              'Structured Query Language',
              'Simple Question Language',
              'System Queue Logic'
            ],
            correctAnswer: 1,
            explanation: 'SQL stands for Structured Query Language, used to manage and query relational databases.'
          },
          {
            id: 2,
            question: 'Which SQL clause is used to filter results?',
            options: [
              'FILTER',
              'WHERE',
              'HAVING',
              'SELECT'
            ],
            correctAnswer: 1,
            explanation: 'The WHERE clause filters rows based on specified conditions before grouping.'
          },
          {
            id: 3,
            question: 'What is the difference between WHERE and HAVING?',
            options: [
              'No difference',
              'WHERE filters rows, HAVING filters grouped results',
              'HAVING is faster',
              'WHERE is only for numbers'
            ],
            correctAnswer: 1,
            explanation: 'WHERE filters individual rows before grouping, HAVING filters groups after aggregation.'
          },
          {
            id: 4,
            question: 'What does the JOIN operation do?',
            options: [
              'Adds new columns',
              'Combines rows from two or more tables based on related columns',
              'Deletes duplicate rows',
              'Sorts data'
            ],
            correctAnswer: 1,
            explanation: 'JOIN combines rows from multiple tables based on a related column between them.'
          },
          {
            id: 5,
            question: 'What is a primary key?',
            options: [
              'The first column in a table',
              'A unique identifier for each record in a table',
              'The most important data',
              'A password for the database'
            ],
            correctAnswer: 1,
            explanation: 'A primary key uniquely identifies each record in a table and cannot contain NULL values.'
          },
          {
            id: 6,
            question: 'What does the GROUP BY clause do?',
            options: [
              'Sorts data',
              'Groups rows with same values for aggregate functions',
              'Deletes grouped data',
              'Creates new tables'
            ],
            correctAnswer: 1,
            explanation: 'GROUP BY groups rows with the same values so aggregate functions can be applied to each group.'
          },
          {
            id: 7,
            question: 'Which function counts the number of rows?',
            options: [
              'SUM()',
              'COUNT()',
              'TOTAL()',
              'NUMBER()'
            ],
            correctAnswer: 1,
            explanation: 'COUNT() returns the number of rows that match specified criteria.'
          },
          {
            id: 8,
            question: 'What is a foreign key?',
            options: [
              'A key from another database',
              'A field that links to the primary key of another table',
              'An encrypted key',
              'A backup key'
            ],
            correctAnswer: 1,
            explanation: 'A foreign key is a field that references the primary key in another table, creating a relationship.'
          },
          {
            id: 9,
            question: 'What does DISTINCT do in SQL?',
            options: [
              'Sorts results',
              'Removes duplicate rows from results',
              'Counts rows',
              'Filters data'
            ],
            correctAnswer: 1,
            explanation: 'DISTINCT removes duplicate rows, returning only unique values.'
          },
          {
            id: 10,
            question: 'What is an INNER JOIN?',
            options: [
              'Returns all rows from both tables',
              'Returns only matching rows from both tables',
              'Returns all rows from the left table',
              'Returns all rows from the right table'
            ],
            correctAnswer: 1,
            explanation: 'INNER JOIN returns only rows where there is a match in both tables.'
          },
          {
            id: 11,
            question: 'What does the ORDER BY clause do?',
            options: [
              'Groups data',
              'Sorts results in ascending or descending order',
              'Filters data',
              'Joins tables'
            ],
            correctAnswer: 1,
            explanation: 'ORDER BY sorts the result set by one or more columns in ASC (ascending) or DESC (descending) order.'
          },
          {
            id: 12,
            question: 'What is a subquery?',
            options: [
              'A broken query',
              'A query nested inside another query',
              'A query that runs twice',
              'A simplified query'
            ],
            correctAnswer: 1,
            explanation: 'A subquery is a query nested within another SQL query, often used in WHERE or FROM clauses.'
          },
          {
            id: 13,
            question: 'What does NULL represent in SQL?',
            options: [
              'Zero',
              'Empty string',
              'Missing or unknown value',
              'False'
            ],
            correctAnswer: 2,
            explanation: 'NULL represents a missing, unknown, or inapplicable value, different from zero or empty string.'
          },
          {
            id: 14,
            question: 'What is the purpose of an INDEX in a database?',
            options: [
              'To store data',
              'To speed up data retrieval',
              'To delete data',
              'To backup data'
            ],
            correctAnswer: 1,
            explanation: 'Indexes improve query performance by creating a fast lookup structure for specific columns.'
          },
          {
            id: 15,
            question: 'What does the LIMIT clause do?',
            options: [
              'Restricts column access',
              'Restricts the number of rows returned',
              'Limits database size',
              'Limits query time'
            ],
            correctAnswer: 1,
            explanation: 'LIMIT restricts the number of rows returned in the result set, useful for pagination.'
          }
        ]
      },
      
      challenge: {
        title: 'E-Commerce Database Analysis',
        description: 'Write SQL queries to analyze an e-commerce database',
        requirements: [
          'Write queries to find total sales by product category',
          'Identify top 10 customers by revenue',
          'Calculate month-over-month sales growth',
          'Find products with no sales in the last 30 days',
          'Create a query showing customer lifetime value',
          'Use JOIN to combine customer, order, and product tables',
          'Implement window functions for ranking and running totals'
        ],
        submissionType: 'text',
        hints: [
          'Use SUM() with GROUP BY for aggregations',
          'Use LAG() or LEAD() for comparing periods',
          'LEFT JOIN to find products with no sales',
          'RANK() or ROW_NUMBER() for ranking',
          'Use CTEs (Common Table Expressions) for complex queries'
        ]
      }
    },
    
    {
      id: 3,
      title: 'Python for Data Analysis',
      description: 'Master Python, Pandas, NumPy, and data manipulation',
      duration: '5-6 weeks',
      difficulty: 'Advanced',
      
      learningResources: [
        {
          id: 1,
          title: 'Python for Data Science',
          type: 'video',
          platform: 'YouTube - freeCodeCamp',
          url: 'https://www.youtube.com/watch?v=LHBE6Q9XlzI',
          duration: '12 hours',
          description: 'Complete Python course for data science'
        },
        {
          id: 2,
          title: 'Pandas Tutorial',
          type: 'video',
          platform: 'YouTube - Corey Schafer',
          url: 'https://www.youtube.com/watch?v=vmEHCJofslg',
          duration: '6 hours',
          description: 'Comprehensive Pandas library tutorial'
        },
        {
          id: 3,
          title: 'NumPy Tutorial',
          type: 'video',
          platform: 'YouTube - freeCodeCamp',
          url: 'https://www.youtube.com/watch?v=QUT1VHiLmmI',
          duration: '1 hour',
          description: 'NumPy for numerical computing in Python'
        },
        {
          id: 4,
          title: 'Data Visualization with Matplotlib',
          type: 'video',
          platform: 'YouTube - Tech With Tim',
          url: 'https://www.youtube.com/watch?v=0P7QnIQDBJY',
          duration: '3 hours',
          description: 'Create visualizations with Matplotlib and Seaborn'
        },
        {
          id: 5,
          title: 'Python Data Analysis Certification',
          type: 'interactive',
          platform: 'freeCodeCamp',
          url: 'https://www.freecodecamp.org/learn/data-analysis-with-python/',
          duration: '300 hours',
          description: 'Complete certification with projects'
        }
      ],
      
      quiz: {
        passingScore: 75,
        questions: [
          {
            id: 1,
            question: 'What is Pandas in Python?',
            options: [
              'An animal',
              'A library for data manipulation and analysis',
              'A web framework',
              'A database'
            ],
            correctAnswer: 1,
            explanation: 'Pandas is a powerful Python library for data manipulation and analysis, built on NumPy.'
          },
          {
            id: 2,
            question: 'What is a DataFrame in Pandas?',
            options: [
              'A chart type',
              'A 2-dimensional labeled data structure',
              'A database table',
              'A file format'
            ],
            correctAnswer: 1,
            explanation: 'A DataFrame is a 2D labeled data structure with columns that can contain different types of data.'
          },
          {
            id: 3,
            question: 'What does NumPy provide?',
            options: [
              'Web scraping tools',
              'Support for multi-dimensional arrays and mathematical functions',
              'Database connectivity',
              'Machine learning models'
            ],
            correctAnswer: 1,
            explanation: 'NumPy provides efficient multi-dimensional array objects and mathematical functions for numerical computing.'
          },
          {
            id: 4,
            question: 'How do you read a CSV file in Pandas?',
            options: [
              'pd.open_csv()',
              'pd.read_csv()',
              'pd.load_csv()',
              'pd.import_csv()'
            ],
            correctAnswer: 1,
            explanation: 'pd.read_csv() is the Pandas function to read CSV files into a DataFrame.'
          },
          {
            id: 5,
            question: 'What does the .groupby() method do?',
            options: [
              'Sorts data',
              'Groups data by one or more columns for aggregation',
              'Filters data',
              'Merges dataframes'
            ],
            correctAnswer: 1,
            explanation: 'groupby() groups data by specified columns, allowing aggregate functions to be applied to each group.'
          },
          {
            id: 6,
            question: 'What is the purpose of .iloc[] in Pandas?',
            options: [
              'Integer-location based indexing',
              'Label-based indexing',
              'Conditional filtering',
              'Sorting'
            ],
            correctAnswer: 0,
            explanation: 'iloc[] provides integer-location based indexing for selecting data by position.'
          },
          {
            id: 7,
            question: 'What does .merge() do in Pandas?',
            options: [
              'Combines two DataFrames based on common columns',
              'Deletes duplicate rows',
              'Sorts data',
              'Filters data'
            ],
            correctAnswer: 0,
            explanation: 'merge() combines DataFrames based on common columns, similar to SQL JOIN operations.'
          },
          {
            id: 8,
            question: 'What is Matplotlib used for?',
            options: [
              'Data cleaning',
              'Creating static, animated, and interactive visualizations',
              'Database queries',
              'Web scraping'
            ],
            correctAnswer: 1,
            explanation: 'Matplotlib is a comprehensive library for creating static, animated, and interactive plots in Python.'
          },
          {
            id: 9,
            question: 'How do you handle missing values in Pandas?',
            options: [
              'Ignore them',
              'Use methods like dropna() or fillna()',
              'Delete the entire dataset',
              'Convert to zero automatically'
            ],
            correctAnswer: 1,
            explanation: 'Pandas provides dropna() to remove missing values and fillna() to replace them with specified values.'
          },
          {
            id: 10,
            question: 'What does .apply() do in Pandas?',
            options: [
              'Applies a function along an axis of the DataFrame',
              'Sorts data',
              'Filters rows',
              'Merges dataframes'
            ],
            correctAnswer: 0,
            explanation: 'apply() applies a function along an axis (rows or columns) of a DataFrame.'
          },
          {
            id: 11,
            question: 'What is a Series in Pandas?',
            options: [
              'A type of chart',
              'A one-dimensional labeled array',
              'A database table',
              'A file format'
            ],
            correctAnswer: 1,
            explanation: 'A Series is a one-dimensional labeled array that can hold any data type.'
          },
          {
            id: 12,
            question: 'What does .describe() do?',
            options: [
              'Generates descriptive statistics',
              'Writes dataset description',
              'Exports data',
              'Creates charts'
            ],
            correctAnswer: 0,
            explanation: 'describe() generates descriptive statistics like count, mean, std, min, max for numerical columns.'
          },
          {
            id: 13,
            question: 'What is the purpose of .pivot_table()?',
            options: [
              'Creates a spreadsheet-style pivot table',
              'Rotates data',
              'Sorts data',
              'Filters data'
            ],
            correctAnswer: 0,
            explanation: 'pivot_table() creates a spreadsheet-style pivot table for data summarization and aggregation.'
          },
          {
            id: 14,
            question: 'How do you filter rows in Pandas?',
            options: [
              'Using boolean indexing: df[df[column] > value]',
              'Using FILTER keyword',
              'Using WHERE clause',
              'Using SELECT statement'
            ],
            correctAnswer: 0,
            explanation: 'Boolean indexing filters rows by creating a mask with conditions: df[condition].'
          },
          {
            id: 15,
            question: 'What does .value_counts() do?',
            options: [
              'Counts total values',
              'Returns unique values and their frequencies',
              'Calculates sum',
              'Counts columns'
            ],
            correctAnswer: 1,
            explanation: 'value_counts() returns unique values in a Series and their frequency counts.'
          }
        ]
      },
      
      challenge: {
        title: 'Sales Data Analysis with Python',
        description: 'Analyze and visualize sales data using Python',
        requirements: [
          'Load and clean CSV data using Pandas',
          'Handle missing values and duplicates',
          'Perform exploratory data analysis (EDA)',
          'Calculate key metrics: revenue, growth rate, customer segments',
          'Create visualizations: line plots, bar charts, heatmaps',
          'Find correlations between variables',
          'Generate a summary report with insights'
        ],
        submissionType: 'text',
        hints: [
          'Use pd.read_csv() to load data',
          'Use .isnull() and .dropna() for missing values',
          'Use .groupby() for aggregations',
          'Matplotlib and Seaborn for visualizations',
          'Use .corr() to find correlations',
          'Export results with .to_csv()'
        ]
      }
    },
    
    {
      id: 4,
      title: 'Business Intelligence & Visualization',
      description: 'Master Power BI, Tableau, and data storytelling',
      duration: '4-5 weeks',
      difficulty: 'Expert',
      
      learningResources: [
        {
          id: 1,
          title: 'Power BI Full Course',
          type: 'video',
          platform: 'YouTube - freeCodeCamp',
          url: 'https://www.youtube.com/watch?v=NNSHu0rkew8',
          duration: '4 hours',
          description: 'Complete Power BI tutorial for beginners'
        },
        {
          id: 2,
          title: 'Tableau Tutorial',
          type: 'video',
          platform: 'YouTube - Tableau',
          url: 'https://www.youtube.com/watch?v=jEgVto5QME8',
          duration: '3 hours',
          description: 'Official Tableau training videos'
        },
        {
          id: 3,
          title: 'Data Storytelling',
          type: 'video',
          platform: 'YouTube - Storytelling with Data',
          url: 'https://www.youtube.com/c/storytellingwithdata',
          duration: '2 hours',
          description: 'Learn to tell compelling stories with data'
        },
        {
          id: 4,
          title: 'Dashboard Design Best Practices',
          type: 'article',
          platform: 'Tableau Blog',
          url: 'https://www.toptal.com/designers/data-visualization/dashboard-design-best-practices',
          duration: '1 hour read',
          description: 'Principles for effective dashboard design'
        },
        {
          id: 5,
          title: 'Google Data Studio Tutorial',
          type: 'video',
          platform: 'YouTube - Loves Data',
          url: 'https://www.youtube.com/watch?v=1CXgd4pm1dA',
          duration: '2 hours',
          description: 'Create free dashboards with Google Data Studio'
        },
        {
          id: 6,
          title: 'Advanced DAX Formulas',
          type: 'article',
          platform: 'SQLBI',
          url: 'https://www.sqlbi.com/articles/',
          duration: '3 hours read',
          description: 'Master DAX for Power BI calculations'
        }
      ],
      
      quiz: {
        passingScore: 80,
        questions: [
          {
            id: 1,
            question: 'What is Business Intelligence (BI)?',
            options: [
              'A type of software',
              'Technologies and practices for analyzing business data',
              'A database system',
              'A programming language'
            ],
            correctAnswer: 1,
            explanation: 'BI encompasses technologies, practices, and applications for collecting, analyzing, and presenting business information.'
          },
          {
            id: 2,
            question: 'What is Power BI?',
            options: [
              'A database',
              'A business analytics tool for data visualization',
              'A programming language',
              'A spreadsheet application'
            ],
            correctAnswer: 1,
            explanation: 'Power BI is Microsoft\'s business analytics tool for creating interactive visualizations and reports.'
          },
          {
            id: 3,
            question: 'What does DAX stand for in Power BI?',
            options: [
              'Data Analysis eXpressions',
              'Database Access XML',
              'Digital Analytics eXtension',
              'Data Aggregation eXtension'
            ],
            correctAnswer: 0,
            explanation: 'DAX (Data Analysis Expressions) is a formula language used in Power BI for calculations.'
          },
          {
            id: 4,
            question: 'What is a KPI?',
            options: [
              'Key Programming Interface',
              'Key Performance Indicator',
              'Knowledge Process Integration',
              'Kernel Performance Index'
            ],
            correctAnswer: 1,
            explanation: 'KPI (Key Performance Indicator) is a measurable value showing how effectively objectives are achieved.'
          },
          {
            id: 5,
            question: 'What is the purpose of a dashboard?',
            options: [
              'To store data',
              'To display key metrics and KPIs in one place',
              'To backup data',
              'To create reports'
            ],
            correctAnswer: 1,
            explanation: 'A dashboard visualizes key metrics and KPIs in a single view for quick insights.'
          },
          {
            id: 6,
            question: 'What is data storytelling?',
            options: [
              'Writing fiction about data',
              'Using data to tell a compelling narrative',
              'Creating data animations',
              'Documenting data processes'
            ],
            correctAnswer: 1,
            explanation: 'Data storytelling combines data visualization with narrative to communicate insights effectively.'
          },
          {
            id: 7,
            question: 'What is the difference between a report and a dashboard?',
            options: [
              'No difference',
              'Reports are detailed, dashboards show high-level KPIs',
              'Reports are faster',
              'Dashboards have more pages'
            ],
            correctAnswer: 1,
            explanation: 'Reports provide detailed analysis while dashboards display high-level metrics and KPIs for quick monitoring.'
          },
          {
            id: 8,
            question: 'What is a calculated column in Power BI?',
            options: [
              'A column imported from data source',
              'A column created using DAX formula',
              'A deleted column',
              'A renamed column'
            ],
            correctAnswer: 1,
            explanation: 'Calculated columns are created using DAX formulas and stored in the data model.'
          },
          {
            id: 9,
            question: 'What is a measure in Power BI?',
            options: [
              'The size of a dataset',
              'A calculation performed on aggregated data',
              'A column type',
              'A chart size'
            ],
            correctAnswer: 1,
            explanation: 'Measures are calculations performed dynamically on aggregated data in visualizations.'
          },
          {
            id: 10,
            question: 'What visualization is best for showing trends over time?',
            options: [
              'Pie chart',
              'Line chart',
              'Bar chart',
              'Scatter plot'
            ],
            correctAnswer: 1,
            explanation: 'Line charts are ideal for showing trends and changes over continuous time periods.'
          },
          {
            id: 11,
            question: 'What is ETL in the context of BI?',
            options: [
              'Excel Table Lookup',
              'Extract, Transform, Load',
              'Error Testing Logic',
              'Efficient Transfer Loop'
            ],
            correctAnswer: 1,
            explanation: 'ETL is the process of extracting data from sources, transforming it, and loading it into a data warehouse.'
          },
          {
            id: 12,
            question: 'What is a data warehouse?',
            options: [
              'A physical storage facility',
              'A central repository for integrated data from multiple sources',
              'A backup system',
              'A cloud storage service'
            ],
            correctAnswer: 1,
            explanation: 'A data warehouse is a centralized repository that stores integrated data from various sources for analysis.'
          },
          {
            id: 13,
            question: 'What is the purpose of slicers in Power BI?',
            options: [
              'To cut data',
              'To provide interactive filtering for visualizations',
              'To delete data',
              'To sort data'
            ],
            correctAnswer: 1,
            explanation: 'Slicers are visual filters that allow users to interactively filter data across visualizations.'
          },
          {
            id: 14,
            question: 'What is drill-down in BI?',
            options: [
              'Deleting data',
              'Navigating from summary to detailed data',
              'Creating backups',
              'Exporting data'
            ],
            correctAnswer: 1,
            explanation: 'Drill-down allows users to navigate from summary-level to more detailed data levels in hierarchies.'
          },
          {
            id: 15,
            question: 'What is a data model?',
            options: [
              'A person who models data',
              'A structured framework showing relationships between data tables',
              'A type of chart',
              'A database backup'
            ],
            correctAnswer: 1,
            explanation: 'A data model defines structure, relationships, and constraints between data tables.'
          },
          {
            id: 16,
            question: 'What is the star schema in data modeling?',
            options: [
              'A chart type',
              'A dimensional model with fact and dimension tables',
              'A security model',
              'A network diagram'
            ],
            correctAnswer: 1,
            explanation: 'Star schema is a data model with a central fact table connected to multiple dimension tables.'
          },
          {
            id: 17,
            question: 'What is real-time analytics?',
            options: [
              'Analytics done quickly',
              'Analysis performed on data as it\'s generated',
              'Scheduled reports',
              'Historical analysis'
            ],
            correctAnswer: 1,
            explanation: 'Real-time analytics processes and analyzes data immediately as it\'s created or received.'
          },
          {
            id: 18,
            question: 'What is a dimension in BI terminology?',
            options: [
              'The size of a chart',
              'A descriptive attribute providing context to facts',
              'A measurement',
              'A calculation'
            ],
            correctAnswer: 1,
            explanation: 'Dimensions are descriptive attributes (like date, product, customer) that provide context to numerical facts.'
          },
          {
            id: 19,
            question: 'What is the purpose of data refresh in Power BI?',
            options: [
              'To restart the application',
              'To update data from source systems',
              'To clear cache',
              'To change visualizations'
            ],
            correctAnswer: 1,
            explanation: 'Data refresh updates the Power BI dataset with the latest data from connected sources.'
          },
          {
            id: 20,
            question: 'What makes a good dashboard?',
            options: [
              'Many colors and decorations',
              'Clear, concise, focused on key metrics, easy to understand',
              'As much data as possible',
              'Complex charts'
            ],
            correctAnswer: 1,
            explanation: 'Good dashboards are clear, focused on essential metrics, easy to understand, and actionable.'
          }
        ]
      },
      
      challenge: {
        title: 'Executive Sales Dashboard',
        description: 'Create a comprehensive interactive dashboard',
        requirements: [
          'Choose Power BI, Tableau, or Google Data Studio',
          'Connect to a sales dataset (CSV or database)',
          'Create a clean data model with relationships',
          'Build an executive dashboard with 5-7 key visualizations',
          'Include KPIs: Total Revenue, Orders, Average Order Value, Growth Rate',
          'Add interactive filters (date range, product category, region)',
          'Implement drill-down functionality',
          'Use appropriate chart types for each metric',
          'Apply consistent formatting and color scheme',
          'Add insights or annotations to highlight key findings'
        ],
        submissionType: 'text',
        hints: [
          'Keep dashboard simple and uncluttered',
          'Use card visuals for KPIs at the top',
          'Line charts for trends, bar charts for comparisons',
          'Add tooltips for additional context',
          'Use DAX measures for calculations in Power BI',
          'Test dashboard on different screen sizes',
          'Add a title and last refresh date'
        ]
      }
    }
  ],
  
  finalProject: {
    title: 'Complete Data Analytics Portfolio Project',
    description: 'End-to-end data analysis project with insights and recommendations',
    duration: '3-4 weeks',
    
    overview: 'Choose a real-world dataset and perform complete analysis from data collection to actionable insights. This project showcases your ability to work with data professionally.',
    
    requirements: [
      'Choose an interesting dataset (Kaggle, government data, or collect your own)',
      'Define business questions or hypotheses to investigate',
      'Clean and prepare data (handle missing values, outliers, duplicates)',
      'Perform exploratory data analysis (EDA) with statistics and visualizations',
      'Use SQL for data querying and aggregation',
      'Analyze data with Python (Pandas, NumPy)',
      'Create interactive dashboard with Power BI or Tableau',
      'Document findings with clear insights and recommendations',
      'Present results in a professional format',
      'Include code, visualizations, and executive summary'
    ],
    
    deliverables: [
      {
        title: 'Project Proposal',
        description: 'Dataset description, business questions, and analysis plan',
        format: 'PDF document',
        pages: '2-3 pages'
      },
      {
        title: 'Data Cleaning Documentation',
        description: 'Steps taken to clean and prepare data',
        format: 'Jupyter Notebook or PDF',
        pages: 'Complete process'
      },
      {
        title: 'SQL Analysis',
        description: 'SQL queries used for analysis with explanations',
        format: 'SQL file with comments',
        pages: '10+ queries'
      },
      {
        title: 'Python Analysis Notebook',
        description: 'Complete Python analysis with code, visualizations, and narrative',
        format: 'Jupyter Notebook',
        pages: 'Complete analysis'
      },
      {
        title: 'Interactive Dashboard',
        description: 'Power BI or Tableau dashboard published online',
        format: 'Published dashboard link',
        pages: '1-2 pages'
      },
      {
        title: 'Final Report',
        description: 'Executive summary, methodology, findings, and recommendations',
        format: 'PDF document',
        pages: '10-15 pages'
      },
      {
        title: 'Presentation',
        description: 'Slide deck presenting key findings',
        format: 'PowerPoint or PDF',
        pages: '10-15 slides'
      }
    ],
    
    evaluationCriteria: [
      {
        category: 'Data Quality',
        weight: '20%',
        description: 'Proper data cleaning and preparation'
      },
      {
        category: 'Analysis Depth',
        weight: '25%',
        description: 'Thorough analysis with appropriate methods'
      },
      {
        category: 'Visualizations',
        weight: '20%',
        description: 'Clear, effective visualizations and dashboard'
      },
      {
        category: 'Insights & Recommendations',
        weight: '25%',
        description: 'Actionable insights backed by data'
      },
      {
        category: 'Documentation',
        weight: '10%',
        description: 'Clear documentation and presentation'
      }
    ],
    
    guidelines: [
      'Choose a dataset you\'re passionate about',
      'Define clear, specific business questions',
      'Document every step of your process',
      'Focus on insights, not just descriptions',
      'Make visualizations clear and professional',
      'Provide actionable recommendations',
      'Cite data sources properly',
      'Keep your audience in mind'
    ],
    
    resources: [
      'Kaggle Datasets - kaggle.com/datasets',
      'UCI Machine Learning Repository',
      'Data.gov for government datasets',
      'Google Dataset Search',
      'Jupyter Notebook for Python analysis',
      'Power BI Desktop (free)',
      'Tableau Public (free)',
      'GitHub for sharing code'
    ],
    
    timeline: [
      {
        week: 1,
        tasks: [
          'Choose dataset and define questions',
          'Initial data exploration',
          'Data cleaning and preparation',
          'Set up project structure'
        ]
      },
      {
        week: 2,
        tasks: [
          'SQL analysis and queries',
          'Python analysis with Pandas',
          'Statistical analysis',
          'Initial visualizations'
        ]
      },
      {
        week: 3,
        tasks: [
          'Build interactive dashboard',
          'Advanced analysis and modeling',
          'Generate insights',
          'Start documentation'
        ]
      },
      {
        week: 4,
        tasks: [
          'Finalize dashboard',
          'Write final report',
          'Create presentation',
          'Review and polish everything'
        ]
      }
    ],
    
    submissionInstructions: 'Submit GitHub repository with all code, notebooks, SQL queries, and documentation. Include links to published dashboard and Google Drive/Dropbox with PDF reports. Be prepared to present findings.',
    
    tips: [
      'Start with simple questions and go deeper',
      'Document insights as you discover them',
      'Create visuals throughout your analysis',
      'Think about your story before the final presentation',
      'Ask "So what?" about every finding',
      'Focus on quality over quantity',
      'Get feedback early and iterate',
      'Practice your presentation multiple times'
    ]
  }
};

export default dataAnalyticsRoadmap;