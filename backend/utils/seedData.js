require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Admin = require('../models/Admin');
const TeamMember = require('../models/TeamMember');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Achievement = require('../models/Achievement');
const SiteSettings = require('../models/SiteSettings');

const seedData = async () => {
  await connectDB();

  // Clear existing data
  await Promise.all([
    Admin.deleteMany({}),
    TeamMember.deleteMany({}),
    Project.deleteMany({}),
    Skill.deleteMany({}),
    Achievement.deleteMany({}),
    SiteSettings.deleteMany({}),
  ]);

  console.log('🗑️  Cleared existing data');

  // Create Admin
  const admin = await Admin.create({
    name: 'V. Rama Krishna',
    email: process.env.ADMIN_EMAIL || 'admin@syntaxsquad.dev',
    password: process.env.ADMIN_PASSWORD || 'Admin@123456',
    role: 'admin',
  });
  console.log('✅ Admin created');

  // Create Admin accounts for team members
  const memberAdmins = [
    { name: 'V. Rama Krishna', email: 'ramakrishna@syntaxsquad.dev', password: 'Admin@123456', role: 'member' },
    { name: 'G. Kumar Pavan Manikantha', email: 'pavan@syntaxsquad.dev', password: 'Admin@123456', role: 'member' },
    { name: 'K. Srinivas Bhaskar', email: 'srinivas@syntaxsquad.dev', password: 'Admin@123456', role: 'member' },
    { name: 'K. Lokesh', email: 'lokesh@syntaxsquad.dev', password: 'Admin@123456', role: 'member' },
    { name: 'K. Manikanta', email: 'manikanta@syntaxsquad.dev', password: 'Admin@123456', role: 'member' },
  ];

  for (const ma of memberAdmins) {
    await Admin.create(ma);
  }
  console.log('✅ Team member admins created');

  // Create Site Settings
  await SiteSettings.create({
    teamName: 'Syntax Squad',
    tagline: 'Building Ideas. Creating Solutions. Growing Together.',
    description: 'Syntax Squad is a passionate team of software developers dedicated to building innovative solutions using modern technologies. We combine creativity, technical expertise, and collaborative spirit to deliver exceptional projects.',
    mission: 'To develop innovative and impactful software solutions that solve real-world problems through collaboration, modern technologies, and continuous learning.',
    vision: 'To become a leading software development team known for quality, innovation, collaboration, and producing graduates who are industry-ready.',
    email: 'syntaxsquad.team@gmail.com',
    location: 'Andhra Pradesh, India',
    socialLinks: {
      github: 'https://github.com/syntax-squad',
      linkedin: 'https://linkedin.com/company/syntax-squad',
    },
    heroText: 'We build modern, scalable web applications and intelligent systems using cutting-edge technologies. From concept to deployment, we deliver excellence.',
  });
  console.log('✅ Site settings created');

  // Create Team Members
  const rama = await TeamMember.create({
    name: 'V. Rama Krishna',
    slug: 'v-rama-krishna',
    role: 'Team Lead & Frontend Developer',
    shortBio: 'Passionate frontend developer and team lead with expertise in React, modern CSS, and UI/UX design.',
    fullBio: 'V. Rama Krishna is the Team Lead of Syntax Squad, bringing together technical expertise and leadership skills. With a strong foundation in frontend development and UI/UX design, he leads the team in building beautiful, responsive web applications. He is passionate about creating user-centric solutions and fostering a collaborative team environment.',
    email: 'ramakrishna@syntaxsquad.dev',
    location: 'Andhra Pradesh, India',
    careerObjective: 'To leverage my technical skills and leadership abilities to build innovative web solutions while growing as a full-stack developer and tech lead.',
    responsibilities: [
      'Team coordination and task management',
      'UI/UX planning and design',
      'Frontend development with React',
      'Project presentation and client communication',
      'Code review and quality assurance',
    ],
    areasOfInterest: ['Frontend Development', 'UI/UX Design', 'React Ecosystem', 'Team Leadership', 'Open Source'],
    currentLearning: ['TypeScript', 'Next.js', 'Node.js', 'System Design'],
    skills: [
      { name: 'HTML', level: 'Advanced', category: 'Frontend Development' },
      { name: 'CSS', level: 'Advanced', category: 'Frontend Development' },
      { name: 'JavaScript', level: 'Advanced', category: 'Programming Languages' },
      { name: 'React', level: 'Advanced', category: 'Frontend Development' },
      { name: 'Tailwind CSS', level: 'Advanced', category: 'Frontend Development' },
      { name: 'Vite', level: 'Intermediate', category: 'Development Tools' },
      { name: 'Git', level: 'Advanced', category: 'Development Tools' },
      { name: 'GitHub', level: 'Advanced', category: 'Development Tools' },
      { name: 'Figma', level: 'Intermediate', category: 'UI/UX Design' },
      { name: 'Responsive Design', level: 'Advanced', category: 'Frontend Development' },
    ],
    githubUrl: 'https://github.com/ramakrishna',
    linkedinUrl: 'https://linkedin.com/in/ramakrishna',
    availability: 'Open to Opportunities',
    displayOrder: 1,
    filterCategory: ['Team Leadership', 'Frontend'],
    projectCount: 3,
  });

  const pavan = await TeamMember.create({
    name: 'G. Kumar Pavan Manikantha',
    slug: 'g-kumar-pavan-manikantha',
    role: 'Backend Developer',
    shortBio: 'Backend developer specializing in Node.js, Express, and MongoDB with a focus on building robust REST APIs.',
    fullBio: 'G. Kumar Pavan Manikantha is a dedicated backend developer who architects and builds the server-side infrastructure of Syntax Squad projects. With expertise in Node.js, Express, and MongoDB, he ensures that our applications are scalable, secure, and performant. He is passionate about clean API design and database optimization.',
    email: 'pavan@syntaxsquad.dev',
    location: 'Andhra Pradesh, India',
    careerObjective: 'To build scalable backend systems and REST APIs that power modern web applications, while growing expertise in cloud technologies and microservices.',
    responsibilities: [
      'Backend API design and development',
      'Server-side architecture',
      'JWT authentication implementation',
      'Database integration and optimization',
      'API testing with Postman',
    ],
    areasOfInterest: ['Backend Development', 'API Design', 'Database Management', 'Cloud Computing', 'DevOps'],
    currentLearning: ['Docker', 'AWS', 'GraphQL', 'Microservices'],
    skills: [
      { name: 'Node.js', level: 'Advanced', category: 'Backend Development' },
      { name: 'Express.js', level: 'Advanced', category: 'Backend Development' },
      { name: 'MongoDB', level: 'Advanced', category: 'Database Management' },
      { name: 'REST API', level: 'Advanced', category: 'Backend Development' },
      { name: 'JavaScript', level: 'Advanced', category: 'Programming Languages' },
      { name: 'Postman', level: 'Advanced', category: 'Development Tools' },
      { name: 'JWT', level: 'Intermediate', category: 'Backend Development' },
      { name: 'Git', level: 'Intermediate', category: 'Development Tools' },
      { name: 'Mongoose', level: 'Advanced', category: 'Database Management' },
    ],
    githubUrl: 'https://github.com/pavanmanikantha',
    linkedinUrl: 'https://linkedin.com/in/pavanmanikantha',
    availability: 'Open to Opportunities',
    displayOrder: 2,
    filterCategory: ['Backend'],
    projectCount: 3,
  });

  const srinivas = await TeamMember.create({
    name: 'K. Srinivas Bhaskar',
    slug: 'k-srinivas-bhaskar',
    role: 'ML Developer & Second Team Lead',
    shortBio: 'Machine Learning developer and co-lead specializing in Python, scikit-learn, and intelligent system development.',
    fullBio: 'K. Srinivas Bhaskar serves as both a Machine Learning Developer and Second Team Lead in Syntax Squad. He is responsible for building and integrating intelligent ML models into our projects. With expertise in Python, Pandas, NumPy, and Scikit-learn, he drives the AI/ML capabilities of the team while also supporting team coordination.',
    email: 'srinivas@syntaxsquad.dev',
    location: 'Andhra Pradesh, India',
    careerObjective: 'To apply machine learning and data science skills to build intelligent applications that make a positive impact, while growing into a full-stack AI/ML engineer.',
    responsibilities: [
      'Machine learning model development and training',
      'Dataset preprocessing and feature engineering',
      'Model evaluation and optimization',
      'ML model integration with backend APIs',
      'Team coordination support',
    ],
    areasOfInterest: ['Machine Learning', 'Deep Learning', 'Data Science', 'AI Applications', 'Python Development'],
    currentLearning: ['TensorFlow', 'Deep Learning', 'NLP', 'Computer Vision'],
    skills: [
      { name: 'Python', level: 'Advanced', category: 'Programming Languages' },
      { name: 'Pandas', level: 'Advanced', category: 'Machine Learning' },
      { name: 'NumPy', level: 'Advanced', category: 'Machine Learning' },
      { name: 'Scikit-learn', level: 'Advanced', category: 'Machine Learning' },
      { name: 'Machine Learning', level: 'Advanced', category: 'Machine Learning' },
      { name: 'Data Preprocessing', level: 'Advanced', category: 'Machine Learning' },
      { name: 'Model Evaluation', level: 'Intermediate', category: 'Machine Learning' },
      { name: 'Git', level: 'Intermediate', category: 'Development Tools' },
      { name: 'Jupyter Notebook', level: 'Advanced', category: 'Development Tools' },
    ],
    githubUrl: 'https://github.com/srinivasbhaskar',
    linkedinUrl: 'https://linkedin.com/in/srinivasbhaskar',
    availability: 'Open to Opportunities',
    displayOrder: 3,
    filterCategory: ['Machine Learning', 'Team Leadership'],
    projectCount: 2,
  });

  const lokesh = await TeamMember.create({
    name: 'K. Lokesh',
    slug: 'k-lokesh',
    role: 'Developer & Testing Member',
    shortBio: 'Developer and quality assurance specialist focused on feature development, bug identification, and software testing.',
    fullBio: 'K. Lokesh is a dedicated developer and testing member of Syntax Squad. He contributes to feature development while ensuring the quality of our software through rigorous testing and bug identification. His attention to detail and systematic approach to testing makes him an invaluable part of the team.',
    email: 'lokesh@syntaxsquad.dev',
    location: 'Andhra Pradesh, India',
    careerObjective: 'To develop robust software features and implement comprehensive testing strategies that ensure high-quality, reliable applications.',
    responsibilities: [
      'Feature development and implementation',
      'Software testing and quality assurance',
      'Bug identification and reporting',
      'Documentation support',
      'Code review participation',
    ],
    areasOfInterest: ['Software Testing', 'Full Stack Development', 'Quality Assurance', 'DevOps', 'Automation Testing'],
    currentLearning: ['React', 'Testing Libraries', 'CI/CD', 'Automation Testing'],
    skills: [
      { name: 'JavaScript', level: 'Intermediate', category: 'Programming Languages' },
      { name: 'HTML', level: 'Intermediate', category: 'Frontend Development' },
      { name: 'CSS', level: 'Intermediate', category: 'Frontend Development' },
      { name: 'Software Testing', level: 'Intermediate', category: 'Development Tools' },
      { name: 'Bug Tracking', level: 'Intermediate', category: 'Development Tools' },
      { name: 'Git', level: 'Intermediate', category: 'Development Tools' },
      { name: 'Python', level: 'Beginner', category: 'Programming Languages' },
    ],
    githubUrl: 'https://github.com/klokesh',
    linkedinUrl: 'https://linkedin.com/in/klokesh',
    availability: 'Open to Opportunities',
    displayOrder: 4,
    filterCategory: ['Frontend', 'Backend'],
    projectCount: 2,
  });

  const manikanta = await TeamMember.create({
    name: 'K. Manikanta',
    slug: 'k-manikanta',
    role: 'Developer & Documentation Member',
    shortBio: 'Developer and documentation specialist responsible for feature implementation, research, and maintaining comprehensive project documentation.',
    fullBio: 'K. Manikanta is a developer and documentation member who ensures that all Syntax Squad projects are well-documented and properly researched. He contributes to feature implementation while maintaining comprehensive documentation that helps the team and future maintainers understand the project architecture and functionality.',
    email: 'manikanta@syntaxsquad.dev',
    location: 'Andhra Pradesh, India',
    careerObjective: 'To contribute to impactful software projects through feature development and maintaining excellent documentation practices that enable team collaboration and knowledge sharing.',
    responsibilities: [
      'Feature implementation and development',
      'Project documentation creation and maintenance',
      'Testing support',
      'Research and content preparation',
      'Technical writing',
    ],
    areasOfInterest: ['Software Development', 'Technical Writing', 'Research', 'Web Development', 'Open Source'],
    currentLearning: ['React', 'Node.js', 'Technical Documentation', 'API Design'],
    skills: [
      { name: 'JavaScript', level: 'Intermediate', category: 'Programming Languages' },
      { name: 'HTML', level: 'Intermediate', category: 'Frontend Development' },
      { name: 'CSS', level: 'Intermediate', category: 'Frontend Development' },
      { name: 'Technical Writing', level: 'Advanced', category: 'Soft Skills' },
      { name: 'Research', level: 'Advanced', category: 'Soft Skills' },
      { name: 'Git', level: 'Beginner', category: 'Development Tools' },
      { name: 'Python', level: 'Beginner', category: 'Programming Languages' },
    ],
    githubUrl: 'https://github.com/kmanikanta',
    linkedinUrl: 'https://linkedin.com/in/kmanikanta',
    availability: 'Open to Opportunities',
    displayOrder: 5,
    filterCategory: ['Frontend', 'Backend'],
    projectCount: 2,
  });

  console.log('✅ Team members created');

  // Create Projects with contributions
  const mediGuide = await Project.create({
    title: 'MediGuide',
    slug: 'mediguide',
    shortDescription: 'A symptom-based disease prediction and specialist recommendation platform.',
    fullDescription: 'MediGuide is a comprehensive healthcare web application that helps users understand possible health conditions based on symptoms. The platform uses machine learning algorithms to predict diseases and recommends appropriate medical specialists and nearby hospitals, providing users with a complete health guidance experience.',
    problemStatement: 'Many people in India lack access to immediate medical consultation and often do not know which specialist to visit for their symptoms, leading to delayed treatment and unnecessary expenses.',
    proposedSolution: 'A web platform where users can input their symptoms and receive AI-powered disease predictions along with specialist recommendations and nearby hospital information, making healthcare guidance accessible to everyone.',
    objectives: [
      'Enable symptom-based disease prediction using ML',
      'Recommend appropriate medical specialists',
      'Provide nearby hospital information',
      'Create an intuitive health dashboard',
      'Ensure secure user authentication',
    ],
    features: [
      'Symptom input interface',
      'ML-based disease prediction',
      'Medical specialist recommendation',
      'Hospital finder integration',
      'User authentication and dashboard',
      'Medical precautions display',
      'Responsive health result interface',
      'User history tracking',
    ],
    technologies: ['React', 'CSS', 'Node.js', 'Express', 'MongoDB', 'Python', 'Machine Learning', 'Scikit-learn', 'REST API'],
    category: 'Healthcare',
    status: 'In Progress',
    contributors: [
      {
        name: 'V. Rama Krishna',
        role: 'Team Lead & Frontend Developer',
        workCompleted: [
          'Designed the complete website UI/UX',
          'Developed Home, Login, Dashboard, Symptom Input, and Result pages',
          'Managed team tasks and project progress',
          'Integrated frontend routing with React Router',
          'Coordinated backend and ML teams',
        ],
        technologies: ['React', 'CSS', 'React Router', 'Vite'],
        status: 'In Progress',
      },
      {
        name: 'G. Kumar Pavan Manikantha',
        role: 'Backend Developer',
        workCompleted: [
          'Developed REST API endpoints',
          'Implemented JWT authentication',
          'Designed MongoDB database schema',
          'Integrated Python ML model with Node.js backend',
          'API testing and documentation',
        ],
        technologies: ['Node.js', 'Express', 'MongoDB', 'JWT'],
        status: 'In Progress',
      },
      {
        name: 'K. Srinivas Bhaskar',
        role: 'ML Developer',
        workCompleted: [
          'Preprocessed medical dataset',
          'Trained disease prediction model',
          'Evaluated and optimized model accuracy',
          'Created prediction API endpoint',
          'Documented ML pipeline',
        ],
        technologies: ['Python', 'Scikit-learn', 'Pandas', 'NumPy'],
        status: 'In Progress',
      },
      {
        name: 'K. Lokesh',
        role: 'Developer & Tester',
        workCompleted: [
          'Feature development support',
          'Manual testing of all pages',
          'Bug identification and reporting',
          'UI component testing',
        ],
        technologies: ['JavaScript', 'HTML', 'CSS'],
        status: 'In Progress',
      },
      {
        name: 'K. Manikanta',
        role: 'Developer & Documentation',
        workCompleted: [
          'Project documentation creation',
          'Research on medical datasets',
          'Content preparation for health information',
          'Testing support',
        ],
        technologies: ['Markdown', 'JavaScript'],
        status: 'In Progress',
      },
    ],
    githubUrl: 'https://github.com/syntax-squad/mediguide',
    progressPercentage: 65,
    isFeatured: true,
    displayOrder: 1,
    challenges: ['Ensuring ML model accuracy', 'Integrating Python with Node.js', 'Handling large medical datasets'],
    futureImprovements: ['Mobile app version', 'Doctor appointment booking', 'Real-time hospital availability'],
  });

  const connectHub = await Project.create({
    title: 'ConnectHub',
    slug: 'connecthub',
    shortDescription: 'An all-in-one messaging interface to access multiple platforms from a centralized dashboard.',
    fullDescription: 'ConnectHub is a unified messaging platform that integrates multiple messaging services into a single, clean interface. Users can access WhatsApp, Telegram, and other messaging platforms from one centralized dashboard, streamlining communication and improving productivity.',
    problemStatement: 'Managing multiple messaging applications is time-consuming and inefficient. Users constantly switch between apps, leading to missed messages and reduced productivity.',
    proposedSolution: 'A unified dashboard that aggregates multiple messaging platforms in one place, allowing users to stay connected across all their messaging services without switching applications.',
    objectives: [
      'Create a unified messaging interface',
      'Integrate multiple messaging platforms',
      'Provide a clean, distraction-free dashboard',
      'Support message search and filtering',
    ],
    features: [
      'Multi-platform messaging integration',
      'Unified inbox view',
      'Platform-specific message formatting',
      'Search across all conversations',
      'Notification management',
      'Clean, minimal UI',
    ],
    technologies: ['React', 'JavaScript', 'CSS', 'API Integration', 'Node.js'],
    category: 'Full Stack',
    status: 'In Progress',
    contributors: [
      {
        name: 'V. Rama Krishna',
        role: 'Frontend Developer',
        workCompleted: ['UI design and development', 'Dashboard layout', 'Component architecture'],
        technologies: ['React', 'CSS'],
        status: 'In Progress',
      },
      {
        name: 'G. Kumar Pavan Manikantha',
        role: 'Backend Developer',
        workCompleted: ['API integration', 'Backend server setup', 'Authentication'],
        technologies: ['Node.js', 'Express'],
        status: 'In Progress',
      },
    ],
    githubUrl: 'https://github.com/syntax-squad/connecthub',
    progressPercentage: 30,
    isFeatured: true,
    displayOrder: 2,
    challenges: ['API rate limiting', 'Multi-platform authentication', 'Real-time message sync'],
    futureImprovements: ['Mobile notifications', 'AI message categorization', 'More platform integrations'],
  });

  const bookMotion = await Project.create({
    title: 'BookMotion',
    slug: 'bookmotion',
    shortDescription: 'An AI-powered platform that summarizes books in Telugu and English and creates animated visual representations.',
    fullDescription: 'BookMotion is an innovative AI-powered education platform that accepts book PDFs and transforms them into engaging, multilingual summaries. The platform identifies key characters, plots, and themes, then creates visual animated representations of the book content, making literature accessible and engaging for all readers.',
    problemStatement: 'Many students and readers struggle with lengthy books and language barriers. Traditional reading is time-consuming and not always engaging, especially for regional language speakers.',
    proposedSolution: 'An AI platform that automatically summarizes books in multiple languages (Telugu and English), identifies key elements, and creates animated visual stories that make reading accessible and engaging.',
    objectives: [
      'Accept and process PDF book uploads',
      'Generate accurate multilingual summaries',
      'Identify characters and storylines',
      'Create animated visual representations',
      'Support Telugu and English languages',
    ],
    features: [
      'PDF upload and processing',
      'AI-powered book summarization',
      'Telugu and English translation',
      'Character identification',
      'Animated visual storytelling',
      'Reading progress tracking',
    ],
    technologies: ['React', 'Node.js', 'Python', 'AI APIs', 'PDF Processing', 'NLP', 'Animation Libraries'],
    category: 'Education',
    status: 'Planning',
    contributors: [
      {
        name: 'V. Rama Krishna',
        role: 'Frontend Developer',
        workCompleted: ['UI planning', 'Component design'],
        technologies: ['React'],
        status: 'Planned',
      },
      {
        name: 'K. Srinivas Bhaskar',
        role: 'AI/ML Developer',
        workCompleted: ['Research on NLP models', 'API integration planning'],
        technologies: ['Python', 'NLP', 'AI APIs'],
        status: 'Planned',
      },
    ],
    githubUrl: 'https://github.com/syntax-squad/bookmotion',
    progressPercentage: 10,
    isFeatured: true,
    displayOrder: 3,
    challenges: ['Accurate Telugu NLP processing', 'Animation generation from text', 'PDF parsing accuracy'],
    futureImprovements: ['Support for more regional languages', 'Interactive quiz generation', 'Community reading groups'],
  });

  console.log('✅ Projects created');

  // Update member contributions
  await TeamMember.findByIdAndUpdate(rama._id, {
    contributions: [
      { projectName: 'MediGuide', role: 'Team Lead & Frontend Developer', tasks: ['UI/UX Design', 'Frontend Development', 'Team Management', 'Routing'], technologies: ['React', 'CSS', 'Vite'], contributionLevel: 'Lead', status: 'In Progress' },
      { projectName: 'ConnectHub', role: 'Frontend Developer', tasks: ['Dashboard UI', 'Component Architecture'], technologies: ['React', 'CSS'], contributionLevel: 'High', status: 'In Progress' },
      { projectName: 'BookMotion', role: 'Frontend Developer', tasks: ['UI Planning', 'Component Design'], technologies: ['React'], contributionLevel: 'Medium', status: 'Planned' },
    ],
  });

  // Create Skills
  const skillsData = [
    { name: 'React', category: 'Frontend Development', icon: '⚛️', experienceLevel: 'Advanced', members: [rama._id] },
    { name: 'Node.js', category: 'Backend Development', icon: '🟢', experienceLevel: 'Advanced', members: [pavan._id] },
    { name: 'MongoDB', category: 'Database Management', icon: '🍃', experienceLevel: 'Advanced', members: [pavan._id] },
    { name: 'Python', category: 'Programming Languages', icon: '🐍', experienceLevel: 'Advanced', members: [srinivas._id, lokesh._id, manikanta._id] },
    { name: 'Machine Learning', category: 'Machine Learning', icon: '🤖', experienceLevel: 'Advanced', members: [srinivas._id] },
    { name: 'JavaScript', category: 'Programming Languages', icon: '💛', experienceLevel: 'Advanced', members: [rama._id, pavan._id, lokesh._id, manikanta._id] },
    { name: 'Tailwind CSS', category: 'Frontend Development', icon: '💨', experienceLevel: 'Advanced', members: [rama._id] },
    { name: 'Express.js', category: 'Backend Development', icon: '🚀', experienceLevel: 'Advanced', members: [pavan._id] },
    { name: 'Scikit-learn', category: 'Machine Learning', icon: '📊', experienceLevel: 'Advanced', members: [srinivas._id] },
    { name: 'Git', category: 'Development Tools', icon: '🔧', experienceLevel: 'Advanced', members: [rama._id, pavan._id, srinivas._id, lokesh._id] },
    { name: 'Figma', category: 'UI/UX Design', icon: '🎨', experienceLevel: 'Intermediate', members: [rama._id] },
    { name: 'REST API', category: 'Backend Development', icon: '🔌', experienceLevel: 'Advanced', members: [pavan._id] },
  ];
  await Skill.insertMany(skillsData);
  console.log('✅ Skills created');

  // Create Achievements
  await Achievement.insertMany([
    {
      title: 'Full Stack Web Development Certification',
      organization: 'Udemy',
      date: new Date('2024-06-15'),
      description: 'Completed comprehensive full stack web development course covering React, Node.js, and MongoDB.',
      type: 'Certification',
      member: rama._id,
      memberName: 'V. Rama Krishna',
    },
    {
      title: 'Machine Learning with Python',
      organization: 'Coursera',
      date: new Date('2024-08-20'),
      description: 'Completed machine learning specialization covering supervised, unsupervised learning and model evaluation.',
      type: 'Certification',
      member: srinivas._id,
      memberName: 'K. Srinivas Bhaskar',
    },
    {
      title: 'College Hackathon - 2nd Place',
      organization: 'RGMCET Tech Fest',
      date: new Date('2024-11-10'),
      description: 'Secured 2nd place in college hackathon with the MediGuide project prototype.',
      type: 'Hackathon',
      member: rama._id,
      memberName: 'V. Rama Krishna',
    },
    {
      title: 'Node.js and Express Backend Development',
      organization: 'freeCodeCamp',
      date: new Date('2024-07-30'),
      description: 'Completed backend development certification covering REST API design, authentication, and database integration.',
      type: 'Certification',
      member: pavan._id,
      memberName: 'G. Kumar Pavan Manikantha',
    },
    {
      title: 'Software Development Workshop',
      organization: 'College IEEE Chapter',
      date: new Date('2024-09-15'),
      description: 'Participated in a 2-day software development workshop covering agile methodologies and modern development practices.',
      type: 'Workshop',
      member: lokesh._id,
      memberName: 'K. Lokesh',
    },
    {
      title: 'Technical Documentation Excellence Award',
      organization: 'RGMCET',
      date: new Date('2024-12-01'),
      description: 'Recognized for outstanding technical documentation of the MediGuide project.',
      type: 'Award',
      member: manikanta._id,
      memberName: 'K. Manikanta',
    },
  ]);
  console.log('✅ Achievements created');

  console.log('\n🎉 Database seeded successfully!');
  console.log(`\n📧 Admin Email: ${process.env.ADMIN_EMAIL || 'admin@syntaxsquad.dev'}`);
  console.log(`🔑 Admin Password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
  
  process.exit(0);
};

seedData().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
