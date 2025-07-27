import { getAllGlobalCompanies, getRandomGlobalCompanies } from './globalCompanies';
import { getAllEnhancedSuggestions, searchEnhancedSuggestions } from './enhancedSuggestions';

export const searchSuggestions: { [key: string]: any } = {
  companies: getAllGlobalCompanies(),

  names: [
    'John Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis', 'David Wilson',
    'Jessica Miller', 'Christopher Jones', 'Ashley Garcia', 'Matthew Rodriguez',
    'Amanda Martinez', 'Daniel Anderson', 'Jennifer Taylor', 'James Thomas',
    'Lisa Jackson', 'Robert White', 'Mary Harris', 'William Martin', 'Patricia Thompson',
    'Richard Garcia', 'Linda Martinez', 'Joseph Robinson', 'Barbara Clark',
    'Thomas Rodriguez', 'Susan Lewis', 'Charles Lee', 'Karen Walker', 'Steven Hall',
    'Nancy Allen', 'Kenneth Young', 'Betty Hernandez', 'Paul King', 'Helen Wright',
    'Mark Lopez', 'Sandra Hill', 'Donald Scott', 'Donna Green', 'George Adams',
    'Carol Baker', 'Joshua Gonzalez', 'Ruth Nelson', 'Kevin Carter', 'Sharon Mitchell',
    'Brian Perez', 'Michelle Roberts', 'Edward Turner', 'Laura Phillips',
    'Ronald Campbell', 'Sarah Parker', 'Anthony Evans', 'Kimberly Edwards',
    'Jason Collins', 'Deborah Stewart', 'Ryan Sanchez', 'Dorothy Morris',
    'Jacob Rogers', 'Lisa Reed', 'Gary Cook', 'Nancy Morgan', 'Nicholas Bell',
    'Karen Murphy', 'Eric Bailey', 'Betty Rivera', 'Jonathan Cooper',
    'Helen Richardson', 'Stephen Cox', 'Sandra Howard', 'Larry Ward',
    'Donna Torres', 'Justin Peterson', 'Carol Gray', 'Scott Ramirez',
    'Ruth James', 'Brandon Watson', 'Sharon Brooks', 'Benjamin Kelly',
    'Michelle Sanders', 'Samuel Price', 'Nancy Bennett', 'Gregory Wood',
    'Karen Barnes', 'Alexander Ross', 'Betty Henderson', 'Patrick Coleman'
  ],

  // Enhanced global names with international diversity
  globalNames: [
    // European Names
    'Hans Mueller', 'Anna Schmidt', 'Pierre Dubois', 'Marie Martin', 'Giovanni Rossi',
    'Francesca Bianchi', 'Carlos García', 'María López', 'João Silva', 'Ana Santos',
    'Nikos Papadopoulos', 'Elena Georgiou', 'Jan Kowalski', 'Anna Nowak', 'Petr Novák',
    'Eva Svoboda', 'Lars Andersen', 'Ingrid Nielsen', 'Erik Johansson', 'Anna Lindberg',
    'Olaf Hansen', 'Astrid Larsen', 'Mikko Virtanen', 'Aino Koskinen', 'Vladimir Petrov',
    'Natasha Ivanova', 'Dimitri Volkov', 'Yelena Smirnova', 'Marko Petrović', 'Ana Jovanović',
    
    // Asian Names
    'Hiroshi Tanaka', 'Yuki Sato', 'Kenji Yamamoto', 'Akiko Suzuki', 'Takeshi Watanabe',
    'Li Wei', 'Wang Fang', 'Zhang Ming', 'Liu Ying', 'Chen Jian',
    'Park Min-jun', 'Kim So-young', 'Lee Dong-hyun', 'Choi Ji-hye', 'Jung Seung-ho',
    'Raj Patel', 'Priya Sharma', 'Amit Kumar', 'Sunita Singh', 'Vikram Gupta',
    'Arjun Reddy', 'Kavya Nair', 'Rohit Agarwal', 'Deepika Iyer', 'Sanjay Mehta',
    
    // Middle Eastern Names
    'Ahmed Al-Rashid', 'Fatima Hassan', 'Omar Khalil', 'Layla Mansour', 'Yusuf Ibrahim',
    'Aisha Qureshi', 'Hassan Ali', 'Nour Farah', 'Karim Nazir', 'Zara Malik',
    
    // African Names
    'Kwame Asante', 'Ama Osei', 'Kofi Mensah', 'Akosua Boateng', 'Yaw Oppong',
    'Amara Diallo', 'Mamadou Traoré', 'Fatoumata Keita', 'Ousmane Cissé', 'Aminata Touré',
    'Thabo Mthembu', 'Nomsa Dlamini', 'Sipho Nkomo', 'Thandiwe Moyo', 'Mandla Khumalo',
    
    // Latin American Names
    'Diego Hernández', 'Sofía Rodríguez', 'Alejandro Morales', 'Valentina Castro', 'Mateo Vargas',
    'Isabella Jiménez', 'Santiago Ruiz', 'Camila Torres', 'Nicolás Flores', 'Lucía Mendoza',
    'Rafael Silva', 'Gabriela Santos', 'Fernando Oliveira', 'Beatriz Costa', 'Ricardo Pereira'
  ],

  emails: [
    'john.smith@company.com', 'sarah.johnson@techcorp.com', 'michael.brown@startup.io',
    'emily.davis@enterprise.com', 'david.wilson@innovation.com', 'jessica.miller@solutions.com',
    'chris.jones@platform.com', 'ashley.garcia@systems.com', 'matt.rodriguez@digital.com',
    'amanda.martinez@cloud.com', 'daniel.anderson@software.com', 'jennifer.taylor@data.com',
    'james.thomas@analytics.com', 'lisa.jackson@intelligence.com', 'robert.white@ai.com',
    'mary.harris@machine.com', 'william.martin@learning.com', 'patricia.thompson@neural.com'
  ],

  positions: [
    'CEO', 'CTO', 'CFO', 'COO', 'CMO', 'CHRO', 'VP of Sales', 'VP of Marketing',
    'VP of Engineering', 'VP of Operations', 'VP of Product', 'VP of Finance',
    'Director of Sales', 'Director of Marketing', 'Director of Engineering',
    'Director of Operations', 'Director of Product', 'Director of Finance',
    'Head of Sales', 'Head of Marketing', 'Head of Engineering', 'Head of Operations',
    'Head of Product', 'Head of Finance', 'Sales Manager', 'Marketing Manager',
    'Engineering Manager', 'Operations Manager', 'Product Manager', 'Finance Manager',
    'Senior Sales Manager', 'Senior Marketing Manager', 'Senior Engineering Manager',
    'Senior Operations Manager', 'Senior Product Manager', 'Senior Finance Manager',
    'Lead Developer', 'Senior Developer', 'Software Engineer', 'Data Scientist',
    'Data Analyst', 'Business Analyst', 'Project Manager', 'Program Manager',
    'Scrum Master', 'DevOps Engineer', 'Security Engineer', 'QA Engineer',
    'UX Designer', 'UI Designer', 'Graphic Designer', 'Content Manager',
    'Social Media Manager', 'Digital Marketing Manager', 'SEO Specialist',
    'PPC Specialist', 'Growth Manager', 'Customer Success Manager',
    'Account Manager', 'Sales Representative', 'Business Development Manager',
    'Partnership Manager', 'Recruiter', 'HR Manager', 'Office Manager'
  ],

  industries: [
    'Technology', 'Software', 'SaaS', 'Healthcare', 'Biotechnology', 'Pharmaceuticals',
    'Financial Services', 'Banking', 'Insurance', 'Investment', 'Real Estate',
    'Construction', 'Manufacturing', 'Automotive', 'Aerospace', 'Defense',
    'Energy', 'Oil & Gas', 'Renewable Energy', 'Utilities', 'Telecommunications',
    'Media', 'Entertainment', 'Gaming', 'Publishing', 'Advertising', 'Marketing',
    'Retail', 'E-commerce', 'Fashion', 'Food & Beverage', 'Hospitality',
    'Travel', 'Transportation', 'Logistics', 'Supply Chain', 'Education', 'E-learning',
    'Training', 'Consulting', 'Professional Services', 'Legal', 'Accounting', 'Auditing',
    'Non-profit', 'Government', 'Public Sector', 'Agriculture', 'AgTech', 'Mining',
    'Chemicals', 'Petrochemicals', 'Plastics', 'Materials', 'Textiles', 'Apparel',
    'Paper', 'Packaging', 'Sports', 'Fitness', 'Wellness', 'Beauty', 'Cosmetics',
    'Jewelry', 'Luxury Goods', 'Home & Garden', 'Furniture', 'Appliances',
    'Electronics', 'Semiconductors', 'Hardware', 'Networking', 'Cybersecurity',
    'Cloud Computing', 'Data Analytics', 'Artificial Intelligence', 'Machine Learning',
    'Robotics', 'IoT', 'Blockchain', 'Cryptocurrency', 'FinTech', 'InsurTech',
    'PropTech', 'EdTech', 'HealthTech', 'MedTech', 'CleanTech', 'GreenTech',
    'Space Technology', 'Nanotechnology', 'Virtual Reality', 'Augmented Reality'
  ],

  locations: [
    'San Francisco, CA', 'New York, NY', 'Los Angeles, CA', 'Chicago, IL',
    'Houston, TX', 'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX',
    'San Diego, CA', 'Dallas, TX', 'San Jose, CA', 'Austin, TX',
    'Jacksonville, FL', 'Fort Worth, TX', 'Columbus, OH', 'Charlotte, NC',
    'Seattle, WA', 'Denver, CO', 'El Paso, TX', 'Detroit, MI',
    'Washington, DC', 'Boston, MA', 'Memphis, TN', 'Nashville, TN',
    'Portland, OR', 'Oklahoma City, OK', 'Las Vegas, NV', 'Louisville, KY',
    'Baltimore, MD', 'Milwaukee, WI', 'Albuquerque, NM', 'Tucson, AZ',
    'Fresno, CA', 'Sacramento, CA', 'Mesa, AZ', 'Kansas City, MO',
    'Atlanta, GA', 'Long Beach, CA', 'Colorado Springs, CO', 'Raleigh, NC',
    'Miami, FL', 'Virginia Beach, VA', 'Omaha, NE', 'Oakland, CA',
    'Minneapolis, MN', 'Tulsa, OK', 'Arlington, TX', 'Tampa, FL',
    'New Orleans, LA', 'Wichita, KS', 'Cleveland, OH', 'Bakersfield, CA',
    'Aurora, CO', 'Anaheim, CA', 'Honolulu, HI', 'Santa Ana, CA',
    'Riverside, CA', 'Corpus Christi, TX', 'Lexington, KY', 'Stockton, CA',
    'Henderson, NV', 'Saint Paul, MN', 'St. Louis, MO', 'Cincinnati, OH',
    'Pittsburgh, PA', 'Greensboro, NC', 'Anchorage, AK', 'Plano, TX',
    'Lincoln, NE', 'Orlando, FL', 'Irvine, CA', 'Newark, NJ',
    'Durham, NC', 'Chula Vista, CA', 'Toledo, OH', 'Fort Wayne, IN',
    'St. Petersburg, FL', 'Laredo, TX', 'Jersey City, NJ', 'Chandler, AZ',
    'Madison, WI', 'Lubbock, TX', 'Scottsdale, AZ', 'Reno, NV',
    'Buffalo, NY', 'Gilbert, AZ', 'Glendale, AZ', 'North Las Vegas, NV',
    'Winston-Salem, NC', 'Chesapeake, VA', 'Norfolk, VA', 'Fremont, CA',
    'Garland, TX', 'Irving, TX', 'Hialeah, FL', 'Richmond, VA',
    'Boise, ID', 'Spokane, WA', 'Baton Rouge, LA',
    // International locations
    'London, UK', 'Manchester, UK', 'Birmingham, UK', 'Glasgow, UK', 'Edinburgh, UK',
    'Paris, France', 'Lyon, France', 'Marseille, France', 'Toulouse, France', 'Nice, France',
    'Berlin, Germany', 'Munich, Germany', 'Hamburg, Germany', 'Cologne, Germany', 'Frankfurt, Germany',
    'Madrid, Spain', 'Barcelona, Spain', 'Valencia, Spain', 'Seville, Spain', 'Bilbao, Spain',
    'Rome, Italy', 'Milan, Italy', 'Naples, Italy', 'Turin, Italy', 'Florence, Italy',
    'Amsterdam, Netherlands', 'Rotterdam, Netherlands', 'The Hague, Netherlands', 'Utrecht, Netherlands',
    'Zurich, Switzerland', 'Geneva, Switzerland', 'Basel, Switzerland', 'Bern, Switzerland',
    'Stockholm, Sweden', 'Gothenburg, Sweden', 'Malmö, Sweden', 'Uppsala, Sweden',
    'Oslo, Norway', 'Bergen, Norway', 'Trondheim, Norway', 'Stavanger, Norway',
    'Copenhagen, Denmark', 'Aarhus, Denmark', 'Odense, Denmark', 'Aalborg, Denmark',
    'Helsinki, Finland', 'Espoo, Finland', 'Tampere, Finland', 'Vantaa, Finland',
    'Vienna, Austria', 'Graz, Austria', 'Linz, Austria', 'Salzburg, Austria',
    'Brussels, Belgium', 'Antwerp, Belgium', 'Ghent, Belgium', 'Charleroi, Belgium',
    'Dublin, Ireland', 'Cork, Ireland', 'Limerick, Ireland', 'Galway, Ireland',
    'Lisbon, Portugal', 'Porto, Portugal', 'Braga, Portugal', 'Coimbra, Portugal',
    'Prague, Czech Republic', 'Brno, Czech Republic', 'Ostrava, Czech Republic',
    'Warsaw, Poland', 'Krakow, Poland', 'Gdansk, Poland', 'Wroclaw, Poland',
    'Budapest, Hungary', 'Debrecen, Hungary', 'Szeged, Hungary', 'Miskolc, Hungary',
    'Bucharest, Romania', 'Cluj-Napoca, Romania', 'Timisoara, Romania', 'Iasi, Romania',
    'Sofia, Bulgaria', 'Plovdiv, Bulgaria', 'Varna, Bulgaria', 'Burgas, Bulgaria',
    'Athens, Greece', 'Thessaloniki, Greece', 'Patras, Greece', 'Heraklion, Greece',
    'Moscow, Russia', 'St. Petersburg, Russia', 'Novosibirsk, Russia', 'Yekaterinburg, Russia',
    'Tokyo, Japan', 'Osaka, Japan', 'Yokohama, Japan', 'Nagoya, Japan', 'Kyoto, Japan',
    'Seoul, South Korea', 'Busan, South Korea', 'Incheon, South Korea', 'Daegu, South Korea',
    'Beijing, China', 'Shanghai, China', 'Guangzhou, China', 'Shenzhen, China', 'Chengdu, China',
    'Mumbai, India', 'Delhi, India', 'Bangalore, India', 'Hyderabad, India', 'Chennai, India',
    'Pune, India', 'Kolkata, India', 'Ahmedabad, India', 'Jaipur, India', 'Surat, India',
    'Singapore', 'Hong Kong', 'Taipei, Taiwan', 'Bangkok, Thailand', 'Manila, Philippines',
    'Jakarta, Indonesia', 'Kuala Lumpur, Malaysia', 'Ho Chi Minh City, Vietnam', 'Hanoi, Vietnam',
    'Sydney, Australia', 'Melbourne, Australia', 'Brisbane, Australia', 'Perth, Australia',
    'Adelaide, Australia', 'Gold Coast, Australia', 'Newcastle, Australia', 'Canberra, Australia',
    'Auckland, New Zealand', 'Wellington, New Zealand', 'Christchurch, New Zealand', 'Hamilton, New Zealand',
    'Toronto, Canada', 'Vancouver, Canada', 'Montreal, Canada', 'Calgary, Canada', 'Ottawa, Canada',
    'Edmonton, Canada', 'Mississauga, Canada', 'Winnipeg, Canada', 'Quebec City, Canada',
    'São Paulo, Brazil', 'Rio de Janeiro, Brazil', 'Brasília, Brazil', 'Salvador, Brazil',
    'Fortaleza, Brazil', 'Belo Horizonte, Brazil', 'Manaus, Brazil', 'Curitiba, Brazil',
    'Mexico City, Mexico', 'Guadalajara, Mexico', 'Monterrey, Mexico', 'Puebla, Mexico',
    'Tijuana, Mexico', 'León, Mexico', 'Juárez, Mexico', 'Zapopan, Mexico',
    'Buenos Aires, Argentina', 'Córdoba, Argentina', 'Rosario, Argentina', 'Mendoza, Argentina',
    'La Plata, Argentina', 'San Miguel de Tucumán, Argentina', 'Mar del Plata, Argentina',
    'Santiago, Chile', 'Valparaíso, Chile', 'Concepción, Chile', 'La Serena, Chile',
    'Bogotá, Colombia', 'Medellín, Colombia', 'Cali, Colombia', 'Barranquilla, Colombia',
    'Lima, Peru', 'Arequipa, Peru', 'Trujillo, Peru', 'Chiclayo, Peru',
    'Caracas, Venezuela', 'Maracaibo, Venezuela', 'Valencia, Venezuela', 'Barquisimeto, Venezuela',
    'Quito, Ecuador', 'Guayaquil, Ecuador', 'Cuenca, Ecuador', 'Santo Domingo, Ecuador',
    'La Paz, Bolivia', 'Santa Cruz, Bolivia', 'Cochabamba, Bolivia', 'Sucre, Bolivia',
    'Montevideo, Uruguay', 'Salto, Uruguay', 'Paysandú, Uruguay', 'Las Piedras, Uruguay',
    'Asunción, Paraguay', 'Ciudad del Este, Paraguay', 'San Lorenzo, Paraguay', 'Luque, Paraguay',
    'Cape Town, South Africa', 'Johannesburg, South Africa', 'Durban, South Africa', 'Pretoria, South Africa',
    'Port Elizabeth, South Africa', 'Bloemfontein, South Africa', 'East London, South Africa',
    'Cairo, Egypt', 'Alexandria, Egypt', 'Giza, Egypt', 'Shubra El-Kheima, Egypt',
    'Casablanca, Morocco', 'Rabat, Morocco', 'Fez, Morocco', 'Marrakech, Morocco',
    'Lagos, Nigeria', 'Kano, Nigeria', 'Ibadan, Nigeria', 'Abuja, Nigeria',
    'Nairobi, Kenya', 'Mombasa, Kenya', 'Nakuru, Kenya', 'Eldoret, Kenya',
    'Addis Ababa, Ethiopia', 'Dire Dawa, Ethiopia', 'Mekelle, Ethiopia', 'Gondar, Ethiopia',
    'Accra, Ghana', 'Kumasi, Ghana', 'Tamale, Ghana', 'Takoradi, Ghana',
    'Tel Aviv, Israel', 'Jerusalem, Israel', 'Haifa, Israel', 'Rishon LeZion, Israel',
    'Dubai, UAE', 'Abu Dhabi, UAE', 'Sharjah, UAE', 'Al Ain, UAE',
    'Riyadh, Saudi Arabia', 'Jeddah, Saudi Arabia', 'Mecca, Saudi Arabia', 'Medina, Saudi Arabia',
    'Kuwait City, Kuwait', 'Hawalli, Kuwait', 'Al Farwaniyah, Kuwait', 'Al Ahmadi, Kuwait',
    'Doha, Qatar', 'Al Rayyan, Qatar', 'Umm Salal, Qatar', 'Al Wakrah, Qatar',
    'Manama, Bahrain', 'Riffa, Bahrain', 'Muharraq, Bahrain', 'Hamad Town, Bahrain',
    'Muscat, Oman', 'Seeb, Oman', 'Salalah, Oman', 'Bawshar, Oman',
    'Amman, Jordan', 'Zarqa, Jordan', 'Irbid, Jordan', 'Russeifa, Jordan',
    'Beirut, Lebanon', 'Tripoli, Lebanon', 'Sidon, Lebanon', 'Tyre, Lebanon',
    'Damascus, Syria', 'Aleppo, Syria', 'Homs, Syria', 'Latakia, Syria',
    'Baghdad, Iraq', 'Basra, Iraq', 'Mosul, Iraq', 'Erbil, Iraq',
    'Tehran, Iran', 'Mashhad, Iran', 'Isfahan, Iran', 'Karaj, Iran',
    'Istanbul, Turkey', 'Ankara, Turkey', 'Izmir, Turkey', 'Bursa, Turkey'
  ],

  companySizes: [
    '1-10 employees', '11-50 employees', '51-100 employees', '101-500 employees',
    '501-1000 employees', '1001-5000 employees', '5001-10000 employees', '10000+ employees'
  ],

  sources: [
    'LinkedIn Sales Navigator', 'Apollo.io', 'ZoomInfo', 'Salesforce', 'HubSpot',
    'Pipedrive', 'Outreach', 'SalesLoft', 'Prospector', 'Hunter.io',
    'FindThatLead', 'Voila Norbert', 'Clearbit', 'FullContact', 'Lusha', 'ContactOut',
    'Snov.io', 'GetProspect', 'Skrapp', 'FindEmails', 'Email Finder', 'Lead411',
    'DiscoverOrg', 'InsideView', 'Hoovers', 'Crunchbase', 'AngelList', 'Product Hunt',
    'GitHub', 'Stack Overflow', 'Twitter', 'Facebook', 'Instagram', 'YouTube', 'TikTok',
    'LinkedIn', 'Xing', 'Viadeo', 'Meetup', 'Eventbrite', 'Facebook Events',
    'Cold Email', 'Cold Call', 'Warm Email', 'Warm Call', 'Referral', 'Introduction',
    'Conference', 'Webinar', 'Trade Show', 'Exhibition', 'Seminar', 'Workshop',
    'Advertisement', 'Google Ads', 'Facebook Ads', 'LinkedIn Ads', 'Twitter Ads',
    'Content Marketing', 'Blog', 'Newsletter', 'Podcast', 'Video Marketing',
    'SEO', 'Organic Search', 'PPC', 'SEM', 'Social Media Marketing',
    'Email Marketing', 'Direct Mail', 'Telemarketing', 'SMS Marketing',
    'Networking Event', 'Business Meetup', 'Industry Event', 'Chamber of Commerce',
    'Partnership', 'Strategic Alliance', 'Joint Venture', 'Affiliate Program',
    'Influencer Marketing', 'Brand Ambassador', 'Thought Leadership',
    'Press Release', 'PR Campaign', 'Media Coverage', 'News Article',
    'Word of Mouth', 'Customer Referral', 'Employee Referral', 'Partner Referral',
    'Inbound Marketing', 'Lead Magnet', 'Landing Page', 'Contact Form',
    'Live Chat', 'Chatbot', 'Demo Request', 'Free Trial', 'Freemium',
    'App Store', 'Google Play', 'Software Directory', 'Review Site',
    'Industry Report', 'White Paper', 'Case Study', 'Success Story',
    'Customer Success', 'Account-Based Marketing', 'Personalized Outreach'
  ],

  // Enhanced categories with 1000+ entries
  technologies: getAllEnhancedSuggestions('technologies'),
  revenues: getAllEnhancedSuggestions('revenues'),
  enhancedPositions: getAllEnhancedSuggestions('enhancedPositions'),
  enhancedIndustries: getAllEnhancedSuggestions('enhancedIndustries'),
  enhancedLocations: getAllEnhancedSuggestions('enhancedLocations')
};

export const getSearchSuggestions = (type: string): string[] => {
  const suggestions = searchSuggestions[type] || [];
  
  // For companies, return a mix of global companies and random selection for better performance
  if (type === 'companies') {
    return getRandomGlobalCompanies(100); // Return 100 random companies for better UX
  }
  
  // For enhanced categories, return full datasets
  if (['technologies', 'revenues', 'enhancedPositions', 'enhancedIndustries', 'enhancedLocations'].includes(type)) {
    return suggestions[type as string] || [];
  }
  
  return suggestions;
};

// Enhanced search function for better performance with large datasets
export const filterSearchSuggestions = (query: string, type: string, limit: number = 20): string[] => {
  // Use enhanced search for large datasets
  if (['technologies', 'revenues', 'enhancedPositions', 'enhancedIndustries', 'enhancedLocations', 'companies'].includes(type as string)) {
    return searchEnhancedSuggestions(query, type as string, limit);
  }
  
  const suggestions = getSearchSuggestions(type as string);
  
  if (!query.trim()) {
    return suggestions.slice(0, limit);
  }
  
  const filtered = suggestions.filter(item => 
    item.toLowerCase().includes(query.toLowerCase())
  );
  
  return filtered.slice(0, limit);
};