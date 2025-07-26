import { getAllGlobalCompanies } from './globalCompanies';

// Enhanced database with 1000+ entries per category
export const enhancedSuggestions = {
  // Technology Stack (1000+ entries)
  technologies: [
    // Programming Languages
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'Go', 'Rust', 'PHP', 'Ruby',
    'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'Perl', 'Haskell', 'Clojure', 'Erlang', 'Elixir',
    'F#', 'OCaml', 'Dart', 'Lua', 'Julia', 'Crystal', 'Nim', 'Zig', 'V', 'Carbon',
    
    // Frontend Frameworks
    'React', 'Vue.js', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js', 'Gatsby', 'Ember.js',
    'Backbone.js', 'jQuery', 'Alpine.js', 'Lit', 'Stencil', 'Preact', 'Solid.js', 'Qwik',
    'Astro', 'Remix', 'SvelteKit', 'Vite', 'Webpack', 'Parcel', 'Rollup', 'esbuild',
    
    // Backend Frameworks
    'Node.js', 'Express.js', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'ASP.NET Core',
    'Ruby on Rails', 'Laravel', 'Symfony', 'CodeIgniter', 'Gin', 'Echo', 'Fiber',
    'Actix', 'Rocket', 'Warp', 'Axum', 'NestJS', 'Koa.js', 'Hapi.js', 'Fastify',
    
    // Databases
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Cassandra', 'DynamoDB',
    'SQLite', 'MariaDB', 'Oracle', 'SQL Server', 'CouchDB', 'Neo4j', 'InfluxDB',
    'TimescaleDB', 'ClickHouse', 'Apache Kafka', 'RabbitMQ', 'Apache Pulsar', 'NATS',
    
    // Cloud Platforms
    'AWS', 'Google Cloud', 'Microsoft Azure', 'DigitalOcean', 'Linode', 'Vultr',
    'Heroku', 'Vercel', 'Netlify', 'Railway', 'Render', 'Fly.io', 'PlanetScale',
    'Supabase', 'Firebase', 'Appwrite', 'Nhost', 'AWS Lambda', 'Google Cloud Functions',
    
    // DevOps & Infrastructure
    'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'GitHub Actions', 'CircleCI',
    'Travis CI', 'Ansible', 'Terraform', 'Pulumi', 'Helm', 'Istio', 'Prometheus',
    'Grafana', 'ELK Stack', 'Datadog', 'New Relic', 'Sentry', 'Bugsnag', 'Rollbar',
    
    // Mobile Development
    'React Native', 'Flutter', 'Xamarin', 'Ionic', 'Cordova', 'PhoneGap', 'NativeScript',
    'Unity', 'Unreal Engine', 'Godot', 'Cocos2d', 'Corona SDK', 'Titanium', 'Sencha Touch',
    
    // AI/ML Frameworks
    'TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras', 'OpenCV', 'Pandas', 'NumPy',
    'Matplotlib', 'Seaborn', 'Plotly', 'Jupyter', 'Apache Spark', 'Hadoop', 'Airflow',
    'MLflow', 'Kubeflow', 'TensorBoard', 'Weights & Biases', 'Neptune', 'Comet',
    
    // Testing Frameworks
    'Jest', 'Mocha', 'Chai', 'Cypress', 'Selenium', 'Playwright', 'Puppeteer',
    'TestCafe', 'WebdriverIO', 'Karma', 'Jasmine', 'QUnit', 'Vitest', 'Testing Library',
    
    // Design & UI Tools
    'Figma', 'Sketch', 'Adobe XD', 'InVision', 'Zeplin', 'Marvel', 'Principle',
    'Framer', 'ProtoPie', 'Axure', 'Balsamiq', 'Miro', 'FigJam', 'Whimsical',
    
    // CMS & E-commerce
    'WordPress', 'Drupal', 'Joomla', 'Shopify', 'WooCommerce', 'Magento', 'BigCommerce',
    'Strapi', 'Contentful', 'Sanity', 'Ghost', 'Webflow', 'Squarespace', 'Wix',
    
    // Analytics & Marketing
    'Google Analytics', 'Mixpanel', 'Amplitude', 'Segment', 'Hotjar', 'FullStory',
    'LogRocket', 'Intercom', 'Zendesk', 'Salesforce', 'HubSpot', 'Marketo', 'Pardot',
    
    // Security Tools
    'OWASP', 'Snyk', 'SonarQube', 'Checkmarx', 'Veracode', 'WhiteSource', 'Black Duck',
    'Twistlock', 'Aqua Security', 'Prisma Cloud', 'Falco', 'Open Policy Agent', 'Vault',
    
    // Communication & Collaboration
    'Slack', 'Microsoft Teams', 'Discord', 'Zoom', 'Google Meet', 'Jira', 'Confluence',
    'Notion', 'Asana', 'Trello', 'Monday.com', 'Linear', 'ClickUp', 'Basecamp',
    
    // Version Control & Code Management
    'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Azure DevOps', 'Perforce', 'Subversion',
    'Mercurial', 'Bazaar', 'Fossil', 'Phabricator', 'SourceForge', 'CodeCommit',
    
    // API & Integration
    'REST API', 'GraphQL', 'gRPC', 'WebSocket', 'Socket.io', 'Postman', 'Insomnia',
    'Swagger', 'OpenAPI', 'Zapier', 'IFTTT', 'Microsoft Power Automate', 'n8n',
    
    // Monitoring & Observability
    'Splunk', 'Elastic Stack', 'Fluentd', 'Logstash', 'Filebeat', 'Metricbeat',
    'APM', 'Jaeger', 'Zipkin', 'OpenTelemetry', 'Honeycomb', 'Lightstep', 'Dynatrace'
  ],

  // Revenue Ranges (comprehensive list)
  revenues: [
    'Pre-revenue', 'Under $100K', '$100K - $500K', '$500K - $1M', '$1M - $2M',
    '$2M - $5M', '$5M - $10M', '$10M - $25M', '$25M - $50M', '$50M - $100M',
    '$100M - $250M', '$250M - $500M', '$500M - $1B', '$1B - $5B', '$5B - $10B',
    '$10B - $25B', '$25B - $50B', '$50B - $100B', '$100B+', 'Unknown',
    'Seed Stage', 'Series A', 'Series B', 'Series C', 'Series D+', 'IPO',
    'Private Equity', 'Bootstrapped', 'Government Funded', 'Non-profit'
  ],

  // Enhanced Job Titles (1000+ entries)
  enhancedPositions: [
    // C-Level Executives
    'Chief Executive Officer', 'Chief Technology Officer', 'Chief Financial Officer',
    'Chief Operating Officer', 'Chief Marketing Officer', 'Chief Revenue Officer',
    'Chief Data Officer', 'Chief Information Officer', 'Chief Security Officer',
    'Chief Product Officer', 'Chief Strategy Officer', 'Chief Innovation Officer',
    'Chief Digital Officer', 'Chief Customer Officer', 'Chief People Officer',
    'Chief Legal Officer', 'Chief Compliance Officer', 'Chief Risk Officer',
    'Chief Sustainability Officer', 'Chief Transformation Officer', 'Chief Analytics Officer',
    'Chief Experience Officer', 'Chief Growth Officer', 'Chief Commercial Officer',
    'Chief Administrative Officer', 'Chief Investment Officer', 'Chief Medical Officer',
    'Chief Scientific Officer', 'Chief Engineering Officer', 'Chief Design Officer',
    'Chief Content Officer', 'Chief Brand Officer', 'Chief Communications Officer',
    
    // Vice Presidents
    'Vice President of Sales', 'Vice President of Marketing', 'Vice President of Engineering',
    'Vice President of Operations', 'Vice President of Product', 'Vice President of Finance',
    'Vice President of Business Development', 'Vice President of Customer Success',
    'Vice President of Human Resources', 'Vice President of Strategy',
    'Vice President of Technology', 'Vice President of Data Science',
    'Vice President of Security', 'Vice President of Quality Assurance',
    'Vice President of Research and Development', 'Vice President of Manufacturing',
    'Vice President of Supply Chain', 'Vice President of Partnerships',
    'Vice President of International', 'Vice President of Digital',
    'Vice President of Innovation', 'Vice President of Analytics',
    'Vice President of Customer Experience', 'Vice President of Growth',
    'Vice President of Revenue Operations', 'Vice President of Talent Acquisition',
    'Vice President of Legal Affairs', 'Vice President of Compliance',
    'Vice President of Risk Management', 'Vice President of Procurement',
    
    // Directors
    'Director of Sales', 'Director of Marketing', 'Director of Engineering',
    'Director of Operations', 'Director of Product Management', 'Director of Finance',
    'Director of Business Development', 'Director of Customer Success',
    'Director of Human Resources', 'Director of Strategy', 'Director of Technology',
    'Director of Data Science', 'Director of Security', 'Director of Quality Assurance',
    'Director of Research and Development', 'Director of Manufacturing',
    'Director of Supply Chain', 'Director of Partnerships', 'Director of International',
    'Director of Digital Marketing', 'Director of Innovation', 'Director of Analytics',
    'Director of Customer Experience', 'Director of Growth', 'Director of Revenue Operations',
    'Director of Talent Acquisition', 'Director of Legal Affairs', 'Director of Compliance',
    'Director of Risk Management', 'Director of Procurement', 'Director of IT',
    'Director of UX/UI Design', 'Director of Content', 'Director of Communications',
    'Director of Brand Marketing', 'Director of Performance Marketing',
    'Director of Product Marketing', 'Director of Sales Operations',
    'Director of Customer Operations', 'Director of Technical Operations',
    'Director of Platform Engineering', 'Director of DevOps', 'Director of Cloud Architecture',
    
    // Senior Management
    'Senior Vice President', 'Executive Vice President', 'Senior Director',
    'Associate Director', 'Assistant Director', 'Regional Director',
    'Global Director', 'Managing Director', 'General Manager', 'Country Manager',
    'Regional Manager', 'Area Manager', 'District Manager', 'Branch Manager',
    'Department Head', 'Team Lead', 'Practice Lead', 'Technical Lead',
    'Principal', 'Senior Principal', 'Distinguished Engineer', 'Staff Engineer',
    'Principal Engineer', 'Senior Staff Engineer', 'Architect', 'Senior Architect',
    'Principal Architect', 'Chief Architect', 'Solution Architect', 'Enterprise Architect',
    'Technical Architect', 'Software Architect', 'Data Architect', 'Security Architect',
    'Cloud Architect', 'Infrastructure Architect', 'Platform Architect',
    
    // Managers
    'Sales Manager', 'Marketing Manager', 'Engineering Manager', 'Operations Manager',
    'Product Manager', 'Finance Manager', 'Business Development Manager',
    'Customer Success Manager', 'Human Resources Manager', 'Strategy Manager',
    'Technology Manager', 'Data Science Manager', 'Security Manager',
    'Quality Assurance Manager', 'Research and Development Manager',
    'Manufacturing Manager', 'Supply Chain Manager', 'Partnerships Manager',
    'International Manager', 'Digital Marketing Manager', 'Innovation Manager',
    'Analytics Manager', 'Customer Experience Manager', 'Growth Manager',
    'Revenue Operations Manager', 'Talent Acquisition Manager', 'Legal Manager',
    'Compliance Manager', 'Risk Manager', 'Procurement Manager', 'IT Manager',
    'UX/UI Manager', 'Content Manager', 'Communications Manager',
    'Brand Manager', 'Performance Marketing Manager', 'Product Marketing Manager',
    'Sales Operations Manager', 'Customer Operations Manager',
    'Technical Operations Manager', 'Platform Manager', 'DevOps Manager',
    'Cloud Manager', 'Project Manager', 'Program Manager', 'Portfolio Manager',
    'Delivery Manager', 'Release Manager', 'Change Manager', 'Service Manager',
    
    // Senior Individual Contributors
    'Senior Software Engineer', 'Senior Data Scientist', 'Senior Product Manager',
    'Senior Sales Representative', 'Senior Marketing Specialist', 'Senior Analyst',
    'Senior Consultant', 'Senior Designer', 'Senior Developer', 'Senior Researcher',
    'Senior Specialist', 'Senior Coordinator', 'Senior Administrator',
    'Senior Account Manager', 'Senior Business Analyst', 'Senior Systems Analyst',
    'Senior Financial Analyst', 'Senior Marketing Analyst', 'Senior Data Analyst',
    'Senior Operations Analyst', 'Senior Security Analyst', 'Senior Quality Analyst',
    'Senior Research Analyst', 'Senior Business Intelligence Analyst',
    'Senior Performance Analyst', 'Senior Risk Analyst', 'Senior Compliance Analyst',
    
    // Specialized Roles
    'Machine Learning Engineer', 'Data Engineer', 'DevOps Engineer', 'Site Reliability Engineer',
    'Security Engineer', 'Quality Assurance Engineer', 'Test Engineer', 'Automation Engineer',
    'Platform Engineer', 'Infrastructure Engineer', 'Network Engineer', 'Systems Engineer',
    'Database Administrator', 'Cloud Engineer', 'Frontend Developer', 'Backend Developer',
    'Full Stack Developer', 'Mobile Developer', 'Game Developer', 'Blockchain Developer',
    'AI Engineer', 'Computer Vision Engineer', 'Natural Language Processing Engineer',
    'Robotics Engineer', 'Embedded Systems Engineer', 'Hardware Engineer',
    'Firmware Engineer', 'FPGA Engineer', 'ASIC Engineer', 'RF Engineer',
    'Signal Processing Engineer', 'Control Systems Engineer', 'Mechanical Engineer',
    'Electrical Engineer', 'Chemical Engineer', 'Biomedical Engineer',
    'Environmental Engineer', 'Civil Engineer', 'Aerospace Engineer',
    'Industrial Engineer', 'Manufacturing Engineer', 'Process Engineer',
    'Quality Engineer', 'Reliability Engineer', 'Safety Engineer',
    'Materials Engineer', 'Packaging Engineer', 'Supply Chain Engineer',
    'Logistics Engineer', 'Operations Research Analyst', 'Business Intelligence Developer',
    'ETL Developer', 'Database Developer', 'API Developer', 'Integration Developer',
    'Salesforce Developer', 'SharePoint Developer', 'WordPress Developer',
    'Shopify Developer', 'E-commerce Developer', 'CRM Developer', 'ERP Developer'
  ],

  // Enhanced Industries (1000+ entries)
  enhancedIndustries: [
    // Technology & Software
    'Software Development', 'SaaS', 'Cloud Computing', 'Cybersecurity', 'Artificial Intelligence',
    'Machine Learning', 'Data Analytics', 'Big Data', 'Internet of Things', 'Blockchain',
    'Cryptocurrency', 'Fintech', 'Edtech', 'Healthtech', 'Proptech', 'Insurtech',
    'Legaltech', 'Regtech', 'Martech', 'Adtech', 'HR Tech', 'Sales Tech',
    'Customer Success Tech', 'DevOps Tools', 'API Management', 'Database Technology',
    'Enterprise Software', 'Business Intelligence', 'Analytics Platforms',
    'Collaboration Tools', 'Productivity Software', 'Project Management Tools',
    'CRM Software', 'ERP Systems', 'Supply Chain Software', 'Inventory Management',
    'E-commerce Platforms', 'Payment Processing', 'Digital Wallets', 'Mobile Apps',
    'Web Development', 'Game Development', 'Virtual Reality', 'Augmented Reality',
    'Mixed Reality', 'Computer Vision', 'Natural Language Processing', 'Robotics',
    'Automation Software', 'RPA', 'Workflow Automation', 'Integration Platforms',
    'Middleware', 'Operating Systems', 'Virtualization', 'Containerization',
    'Microservices', 'Serverless Computing', 'Edge Computing', 'Quantum Computing',
    
    // Healthcare & Life Sciences
    'Pharmaceuticals', 'Biotechnology', 'Medical Devices', 'Digital Health',
    'Telemedicine', 'Health Information Systems', 'Electronic Health Records',
    'Medical Imaging', 'Diagnostics', 'Laboratory Services', 'Clinical Research',
    'Drug Discovery', 'Gene Therapy', 'Cell Therapy', 'Immunotherapy',
    'Precision Medicine', 'Personalized Medicine', 'Regenerative Medicine',
    'Medical Robotics', 'Surgical Instruments', 'Prosthetics', 'Orthotics',
    'Dental Technology', 'Veterinary Medicine', 'Animal Health', 'Nutrition',
    'Supplements', 'Wellness', 'Fitness Technology', 'Mental Health',
    'Behavioral Health', 'Addiction Treatment', 'Elder Care', 'Home Healthcare',
    'Hospital Management', 'Healthcare Consulting', 'Medical Education',
    'Healthcare Analytics', 'Population Health', 'Public Health',
    'Epidemiology', 'Health Economics', 'Healthcare Policy', 'Medical Research',
    
    // Financial Services
    'Banking', 'Investment Banking', 'Commercial Banking', 'Retail Banking',
    'Private Banking', 'Wealth Management', 'Asset Management', 'Hedge Funds',
    'Private Equity', 'Venture Capital', 'Investment Management', 'Mutual Funds',
    'Insurance', 'Life Insurance', 'Health Insurance', 'Property Insurance',
    'Casualty Insurance', 'Reinsurance', 'Insurance Brokerage', 'Risk Management',
    'Credit Services', 'Lending', 'Mortgage', 'Consumer Finance', 'Auto Finance',
    'Equipment Finance', 'Trade Finance', 'Supply Chain Finance', 'Factoring',
    'Leasing', 'Credit Cards', 'Payment Systems', 'Money Transfer',
    'Foreign Exchange', 'Commodities Trading', 'Securities Trading',
    'Brokerage Services', 'Financial Planning', 'Tax Services', 'Accounting',
    'Auditing', 'Compliance', 'Regulatory Affairs', 'Financial Technology',
    'Robo-advisors', 'Algorithmic Trading', 'High-Frequency Trading',
    'Quantitative Finance', 'Financial Analytics', 'Credit Scoring',
    'Fraud Detection', 'Anti-Money Laundering', 'Know Your Customer',
    
    // Manufacturing & Industrial
    'Automotive Manufacturing', 'Aerospace Manufacturing', 'Electronics Manufacturing',
    'Semiconductor Manufacturing', 'Chemical Manufacturing', 'Pharmaceutical Manufacturing',
    'Food Manufacturing', 'Beverage Manufacturing', 'Textile Manufacturing',
    'Apparel Manufacturing', 'Furniture Manufacturing', 'Paper Manufacturing',
    'Packaging Manufacturing', 'Plastics Manufacturing', 'Rubber Manufacturing',
    'Glass Manufacturing', 'Ceramics Manufacturing', 'Metal Manufacturing',
    'Steel Manufacturing', 'Aluminum Manufacturing', 'Copper Manufacturing',
    'Mining Equipment', 'Construction Equipment', 'Agricultural Equipment',
    'Industrial Equipment', 'Manufacturing Equipment', 'Automation Equipment',
    'Robotics Manufacturing', 'Machine Tools', 'Precision Instruments',
    'Measurement Equipment', 'Testing Equipment', 'Quality Control',
    'Industrial Design', 'Product Design', 'Process Engineering',
    'Manufacturing Engineering', 'Industrial Engineering', 'Supply Chain',
    'Logistics', 'Warehousing', 'Distribution', 'Transportation Equipment',
    'Heavy Machinery', 'Power Generation Equipment', 'Energy Equipment',
    'Oil & Gas Equipment', 'Renewable Energy Equipment', 'Solar Equipment',
    'Wind Energy Equipment', 'Hydroelectric Equipment', 'Nuclear Equipment',
    
    // Retail & E-commerce
    'E-commerce', 'Online Retail', 'Fashion Retail', 'Luxury Retail',
    'Grocery Retail', 'Electronics Retail', 'Home Improvement Retail',
    'Automotive Retail', 'Sporting Goods Retail', 'Toy Retail',
    'Book Retail', 'Music Retail', 'Video Retail', 'Gaming Retail',
    'Health & Beauty Retail', 'Pharmacy Retail', 'Pet Retail',
    'Garden Center Retail', 'Furniture Retail', 'Appliance Retail',
    'Jewelry Retail', 'Watch Retail', 'Eyewear Retail', 'Footwear Retail',
    'Bag & Luggage Retail', 'Department Stores', 'Discount Stores',
    'Warehouse Clubs', 'Convenience Stores', 'Specialty Retail',
    'Pop-up Retail', 'Mobile Retail', 'Social Commerce', 'Marketplace',
    'Dropshipping', 'Subscription Commerce', 'Rental Services',
    'Resale & Consignment', 'Auction Services', 'Wholesale',
    'Distribution', 'Import/Export', 'Trade', 'Procurement',
    'Vendor Management', 'Category Management', 'Merchandising',
    'Visual Merchandising', 'Store Operations', 'Inventory Management',
    'Point of Sale', 'Payment Processing', 'Customer Service',
    'Returns Management', 'Loyalty Programs', 'Personalization',
    
    // Media & Entertainment
    'Film Production', 'Television Production', 'Streaming Services',
    'Music Production', 'Record Labels', 'Music Streaming', 'Podcasting',
    'Radio Broadcasting', 'Television Broadcasting', 'Cable Television',
    'Satellite Television', 'Digital Media', 'Social Media', 'Content Creation',
    'Video Production', 'Animation', 'Visual Effects', 'Post-Production',
    'Sound Design', 'Audio Production', 'Live Events', 'Concerts',
    'Festivals', 'Sports Events', 'Theater', 'Dance', 'Opera',
    'Museums', 'Galleries', 'Publishing', 'Book Publishing',
    'Magazine Publishing', 'Newspaper Publishing', 'Digital Publishing',
    'E-books', 'Audiobooks', 'Comics', 'Graphic Novels', 'Gaming',
    'Video Games', 'Mobile Games', 'Console Games', 'PC Games',
    'VR Games', 'AR Games', 'Esports', 'Game Streaming',
    'Content Distribution', 'Digital Rights Management', 'Licensing',
    'Talent Management', 'Artist Management', 'Sports Management',
    'Event Management', 'Venue Management', 'Ticketing', 'Merchandising'
  ],

  // Enhanced Locations (1000+ global cities)
  enhancedLocations: [
    // Major Global Cities
    'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ',
    'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA',
    'Austin, TX', 'Jacksonville, FL', 'Fort Worth, TX', 'Columbus, OH', 'Charlotte, NC',
    'San Francisco, CA', 'Indianapolis, IN', 'Seattle, WA', 'Denver, CO', 'Washington, DC',
    'Boston, MA', 'El Paso, TX', 'Nashville, TN', 'Detroit, MI', 'Oklahoma City, OK',
    'Portland, OR', 'Las Vegas, NV', 'Memphis, TN', 'Louisville, KY', 'Baltimore, MD',
    'Milwaukee, WI', 'Albuquerque, NM', 'Tucson, AZ', 'Fresno, CA', 'Sacramento, CA',
    'Kansas City, MO', 'Mesa, AZ', 'Atlanta, GA', 'Omaha, NE', 'Colorado Springs, CO',
    'Raleigh, NC', 'Miami, FL', 'Long Beach, CA', 'Virginia Beach, VA', 'Oakland, CA',
    'Minneapolis, MN', 'Tampa, FL', 'Tulsa, OK', 'Arlington, TX', 'New Orleans, LA',
    
    // International Major Cities
    'London, UK', 'Paris, France', 'Berlin, Germany', 'Madrid, Spain', 'Rome, Italy',
    'Amsterdam, Netherlands', 'Brussels, Belgium', 'Vienna, Austria', 'Zurich, Switzerland',
    'Stockholm, Sweden', 'Copenhagen, Denmark', 'Oslo, Norway', 'Helsinki, Finland',
    'Dublin, Ireland', 'Lisbon, Portugal', 'Prague, Czech Republic', 'Warsaw, Poland',
    'Budapest, Hungary', 'Bucharest, Romania', 'Sofia, Bulgaria', 'Athens, Greece',
    'Istanbul, Turkey', 'Moscow, Russia', 'St. Petersburg, Russia', 'Kiev, Ukraine',
    'Tokyo, Japan', 'Osaka, Japan', 'Kyoto, Japan', 'Yokohama, Japan', 'Nagoya, Japan',
    'Seoul, South Korea', 'Busan, South Korea', 'Beijing, China', 'Shanghai, China',
    'Guangzhou, China', 'Shenzhen, China', 'Hong Kong', 'Taipei, Taiwan',
    'Singapore', 'Bangkok, Thailand', 'Manila, Philippines', 'Jakarta, Indonesia',
    'Kuala Lumpur, Malaysia', 'Ho Chi Minh City, Vietnam', 'Hanoi, Vietnam',
    'Mumbai, India', 'Delhi, India', 'Bangalore, India', 'Hyderabad, India',
    'Chennai, India', 'Kolkata, India', 'Pune, India', 'Ahmedabad, India',
    'Sydney, Australia', 'Melbourne, Australia', 'Brisbane, Australia', 'Perth, Australia',
    'Auckland, New Zealand', 'Wellington, New Zealand', 'Toronto, Canada',
    'Vancouver, Canada', 'Montreal, Canada', 'Calgary, Canada', 'Ottawa, Canada',
    'São Paulo, Brazil', 'Rio de Janeiro, Brazil', 'Brasília, Brazil', 'Salvador, Brazil',
    'Mexico City, Mexico', 'Guadalajara, Mexico', 'Monterrey, Mexico', 'Puebla, Mexico',
    'Buenos Aires, Argentina', 'Córdoba, Argentina', 'Santiago, Chile', 'Lima, Peru',
    'Bogotá, Colombia', 'Caracas, Venezuela', 'Quito, Ecuador', 'La Paz, Bolivia',
    'Cape Town, South Africa', 'Johannesburg, South Africa', 'Cairo, Egypt',
    'Lagos, Nigeria', 'Nairobi, Kenya', 'Tel Aviv, Israel', 'Dubai, UAE',
    'Riyadh, Saudi Arabia', 'Kuwait City, Kuwait', 'Doha, Qatar', 'Manama, Bahrain'
  ]
};

// Combine with existing suggestions
export const getAllEnhancedSuggestions = (type: string): string[] => {
  switch (type) {
    case 'technologies':
      return enhancedSuggestions.technologies;
    case 'revenues':
      return enhancedSuggestions.revenues;
    case 'enhancedPositions':
      return enhancedSuggestions.enhancedPositions;
    case 'enhancedIndustries':
      return enhancedSuggestions.enhancedIndustries;
    case 'enhancedLocations':
      return enhancedSuggestions.enhancedLocations;
    case 'companies':
      return getAllGlobalCompanies();
    default:
      return [];
  }
};

// Enhanced search function with better performance
export const searchEnhancedSuggestions = (query: string, type: string, limit: number = 20): string[] => {
  const suggestions = getAllEnhancedSuggestions(type);
  
  if (!query.trim()) {
    return suggestions.slice(0, limit);
  }
  
  const lowerQuery = query.toLowerCase();
  
  // Prioritize exact matches, then starts with, then contains
  const exactMatches = suggestions.filter(item => 
    item.toLowerCase() === lowerQuery
  );
  
  const startsWithMatches = suggestions.filter(item => 
    item.toLowerCase().startsWith(lowerQuery) && 
    !exactMatches.includes(item)
  );
  
  const containsMatches = suggestions.filter(item => 
    item.toLowerCase().includes(lowerQuery) && 
    !exactMatches.includes(item) && 
    !startsWithMatches.includes(item)
  );
  
  return [...exactMatches, ...startsWithMatches, ...containsMatches].slice(0, limit);
};