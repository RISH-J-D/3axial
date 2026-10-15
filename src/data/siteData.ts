import type { Project, SampleDrawing, TeamMember, JobOpening, BlogPost } from '../types';

export const PROJECTS_DATA: Project[] = [
  {
    id: 'proj-1',
    title: 'The Cays Building',
    category: 'completed',
    sector: 'commercial',
    image: '/uploads/2025/07/The-Cays-Buliding.jpg',
    location: 'North America',
    tonnage: '1,200 Tons',
    description: 'Complex multi-story commercial steel framing with high-spec canopy connections.'
  },
  {
    id: 'proj-2',
    title: 'Graymont Industrial Facility',
    category: 'completed',
    sector: 'industrial',
    image: '/uploads/2025/07/Graymont.jpg',
    location: 'USA',
    tonnage: '2,400 Tons',
    description: 'Heavy industrial lime processing plant steel detailing with pipe racks and hoppers.'
  },
  {
    id: 'proj-3',
    title: 'Bryn Mawr Substation',
    category: 'completed',
    sector: 'infrastructure',
    image: '/uploads/2025/07/Bryn-Mawr-Substation.jpg',
    location: 'Pennsylvania, USA',
    tonnage: '850 Tons',
    description: 'High-voltage electrical substation support framing and equipment gantries.'
  },
  {
    id: 'proj-4',
    title: 'Lethbridge Housing Complex',
    category: 'completed',
    sector: 'commercial',
    image: '/uploads/2025/07/Lethbridge-Housing.jpg',
    location: 'Alberta, Canada',
    tonnage: '950 Tons',
    description: 'Multi-family residential steel structure with architectural balconies and stair towers.'
  },
  {
    id: 'proj-5',
    title: 'CSSPI Ecole Francois La Bernarde',
    category: 'completed',
    sector: 'educational',
    image: '/uploads/2025/07/CSSPI-Ecole-Francois-La-Bernarde.jpg',
    location: 'Quebec, Canada',
    tonnage: '1,100 Tons',
    description: 'Educational facility featuring wide-span roof trusses and gymnasium framing.'
  },
  {
    id: 'proj-6',
    title: 'Tokai Carbon Facility Phase 02',
    category: 'completed',
    sector: 'industrial',
    image: '/uploads/2025/07/Tokai-Carbon-Project-02.jpg',
    location: 'USA',
    tonnage: '3,100 Tons',
    description: 'Carbon black processing mill with heavy ductwork and structural tower frames.'
  },
  {
    id: 'proj-7',
    title: 'Oklahoma Children Hospital',
    category: 'completed',
    sector: 'infrastructure',
    image: '/uploads/2025/07/Oklahoma-Children-Hospital.jpg',
    location: 'Oklahoma, USA',
    tonnage: '1,800 Tons',
    description: 'Healthcare facility steel detailing adhering to seismic resistance standards.'
  },
  {
    id: 'proj-8',
    title: 'Industrial Process Facility Phase II',
    category: 'completed',
    sector: 'industrial',
    image: '/uploads/2025/07/Industrial-Process-Facility.jpg',
    location: 'Texas, USA',
    tonnage: '4,200 Tons',
    description: 'Chemical process building with platform walkways, handrails, and vessel supports.'
  },
  {
    id: 'proj-9',
    title: 'St. Clair College Welcome Centre',
    category: 'completed',
    sector: 'educational',
    image: '/uploads/2025/07/St.-Clair-College-Welcome-Centre.jpg',
    location: 'Ontario, Canada',
    tonnage: '780 Tons',
    description: 'Architectural entrance atrium framing with exposed structural steel.'
  },
  {
    id: 'proj-10',
    title: 'Concrete Batching Factory',
    category: 'completed',
    sector: 'industrial',
    image: '/uploads/2025/07/Concrete-Factory.jpg',
    location: 'USA',
    tonnage: '1,650 Tons',
    description: 'Heavy aggregate handling conveyor gantries and silo support structures.'
  },
  {
    id: 'proj-11',
    title: 'The Wynkoop Plaza',
    category: 'completed',
    sector: 'commercial',
    image: '/uploads/2025/07/The-Wynkoop-2.jpg',
    location: 'Colorado, USA',
    tonnage: '1,450 Tons',
    description: 'Commercial office development with glass curtain wall structural backings.'
  },
  {
    id: 'proj-12',
    title: 'Redbud Elementary School',
    category: 'completed',
    sector: 'educational',
    image: '/uploads/2025/07/Redbud-Elementary.jpg',
    location: 'USA',
    tonnage: '890 Tons',
    description: 'Primary school facility detailing joist and deck layouts with cafeteria framing.'
  },
  {
    id: 'proj-13',
    title: 'Sulphur PS Gym Auditorium',
    category: 'completed',
    sector: 'educational',
    image: '/uploads/2025/07/Sulphur-PS-Gym-Auditorium.jpg',
    location: 'Louisiana, USA',
    tonnage: '1,050 Tons',
    description: 'Long-span roof joist systems and catwalk structures for high school auditorium.'
  },
  {
    id: 'proj-14',
    title: 'Miller Industries Expansion',
    category: 'completed',
    sector: 'industrial',
    image: '/uploads/2025/07/Miller_Industries1.jpg',
    location: 'Tennessee, USA',
    tonnage: '2,800 Tons',
    description: 'Manufacturing facility expansion with overhead crane runway girders.'
  },
  {
    id: 'proj-15',
    title: 'The Campbell Bldg. B',
    category: 'ongoing',
    sector: 'commercial',
    image: '/blueprint-bg.jpg',
    location: 'USA',
    tonnage: '1,600 Tons',
    description: 'Ongoing commercial office building detailing under AISC 360-16 specifications.'
  },
  {
    id: 'proj-16',
    title: 'Yukon 10th Retail Store',
    category: 'ongoing',
    sector: 'commercial',
    image: '/blueprint-bg.jpg',
    location: 'Oklahoma, USA',
    tonnage: '720 Tons',
    description: 'Retail superstore building framing with joist seat details and parapet framing.'
  }
];

export const SAMPLE_DRAWINGS: SampleDrawing[] = [
  {
    id: 'sd-1',
    title: 'Shop Drawing Detail 01',
    category: 'shop',
    categoryLabel: 'Shop Drawings',
    image: '/uploads/2025/08/Shop-Drawings-1-400x284.jpg'
  },
  {
    id: 'sd-2',
    title: 'Shop Drawing Detail 02',
    category: 'shop',
    categoryLabel: 'Shop Drawings',
    image: '/uploads/2025/08/Shop-Drawings-2-400x284.jpg'
  },
  {
    id: 'sd-3',
    title: 'Shop Drawing Detail 03',
    category: 'shop',
    categoryLabel: 'Shop Drawings',
    image: '/uploads/2025/08/Shop-Drawings-3-400x284.jpg'
  },
  {
    id: 'sd-4',
    title: 'Shop Drawing Detail 04',
    category: 'shop',
    categoryLabel: 'Shop Drawings',
    image: '/uploads/2025/08/Shop-Drawings-4-400x284.jpg'
  },
  {
    id: 'sd-5',
    title: 'AB Plan & Embed Plan 01',
    category: 'ab',
    categoryLabel: 'AB & Embed Plans',
    image: '/uploads/2025/08/AB-Plan-And-Embed-Plan-Drawings-1-400x284.jpg'
  },
  {
    id: 'sd-6',
    title: 'AB Plan & Embed Plan 02',
    category: 'ab',
    categoryLabel: 'AB & Embed Plans',
    image: '/uploads/2025/08/AB-Plan-And-Embed-Plan-Drawings-2-400x284.jpg'
  },
  {
    id: 'sd-7',
    title: 'Structural Framing Plan 01',
    category: 'structural',
    categoryLabel: 'Structural Steel',
    image: '/uploads/2025/08/Structural-steel-Drawings-1-400x284.jpg'
  },
  {
    id: 'sd-8',
    title: 'Structural Framing Plan 02',
    category: 'structural',
    categoryLabel: 'Structural Steel',
    image: '/uploads/2025/08/Structural-steel-Drawings-2-400x284.jpg'
  },
  {
    id: 'sd-9',
    title: 'Misc Steel Stair Elevation',
    category: 'misc',
    categoryLabel: 'Miscellaneous Steel',
    image: '/uploads/2025/08/Miscellaneous-Steel-Drawings-1-400x284.jpg'
  },
  {
    id: 'sd-10',
    title: 'Misc Steel Handrail Detail',
    category: 'misc',
    categoryLabel: 'Miscellaneous Steel',
    image: '/uploads/2025/08/Miscellaneous-Steel-Drawings-2-400x284.jpg'
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Jagatheesh R',
    role: 'President / Owner',
    image: '/uploads/2025/07/6.jpg'
  },
  {
    id: 'tm-2',
    name: 'Jamuna Kumar',
    role: 'Director',
    image: '/uploads/2025/07/Untitled-design-2-4.jpg'
  },
  {
    id: 'tm-3',
    name: 'Manoj Kumar',
    role: 'Vice President',
    image: '/uploads/2025/07/5-1.jpg'
  },
  {
    id: 'tm-4',
    name: 'Anand Kailash',
    role: 'Sr. Project Manager',
    image: '/uploads/2025/07/4-2.jpg'
  },
  {
    id: 'tm-5',
    name: 'Sathish Subramanian',
    role: 'Project Manager',
    image: '/uploads/2025/07/1-3.jpg'
  },
  {
    id: 'tm-6',
    name: 'Antony Arokiam Ulaganathan',
    role: 'Project Manager',
    image: '/uploads/2025/07/2-3.jpg'
  },
  {
    id: 'tm-7',
    name: 'Selva Perumal',
    role: 'Head - Execution & Deliveries',
    image: '/uploads/2025/07/3.jpg'
  }
];

export const JOB_OPENINGS: JobOpening[] = [
  {
    id: 'job-1',
    title: 'Business Development Manager – BDM',
    department: 'Sales & Market Growth',
    location: 'Bangalore (Electronic City)',
    description: 'We’re seeking a Business Development Manager to drive growth by building client relationships and expanding our presence in global steel detailing markets. Strong communication, market insight, and experience in B2B sales within AISC or construction industry are essential.',
    requirements: [
      '5+ years in B2B construction / steel sales',
      'Knowledge of AISC / CISC steel detailing markets',
      'Track record in international client acquisition',
      'Strong negotiation & proposal writing skills'
    ]
  },
  {
    id: 'job-2',
    title: 'Connection Design Engineer',
    department: 'Structural Engineering',
    location: 'Bangalore (Electronic City)',
    description: 'We’re seeking a Connection Design Engineer to develop safe, efficient, and code-compliant steel connections for diverse structural projects. Strong understanding of AISC 360/341 standards and proficiency in RAM, STAAD.Pro, or IDEA StatiCa preferred.',
    requirements: [
      'B.Tech / M.Tech in Civil / Structural Engineering',
      'Proficiency in IDEA StatiCa & RAM Connection',
      'In-depth knowledge of AISC & CISC codes',
      'PE Stamping experience is a major plus'
    ]
  },
  {
    id: 'job-3',
    title: 'Research & Development (R & D) Specialist',
    department: 'Tekla Automation & BIM',
    location: 'Bangalore (Electronic City)',
    description: 'We are building an R&D team dedicated to innovation in steel detailing technology. Ideal candidates will create Tekla C# Open API plugins, custom components, and automated BIM workflows.',
    requirements: [
      'Experience in Tekla Open API development (C# / .NET)',
      'Background in BIM workflow optimization',
      'Strong algorithmic problem solving',
      'Passion for automation in structural drafting'
    ]
  },
  {
    id: 'job-4',
    title: 'Tekla Administrator',
    department: 'Systems & CAD Operations',
    location: 'Bangalore (Electronic City)',
    description: 'We are seeking skilled Tekla Admin professionals to support and stream our steel detailing operations. Manages Tekla Structures licenses, environment settings, firm folders, and project setups.',
    requirements: [
      'Advanced Tekla Structures administration',
      'Custom environment & template configuration',
      'License server setup & team troubleshooting',
      'Quality assurance setup for shop drawings'
    ]
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'digital-revolution-in-steel-detailing',
    title: 'The Digital Revolution in Steel Detailing: How Technology is Reshaping Construction',
    date: 'July 5, 2025',
    readTime: '6 min read',
    category: 'Technology',
    image: '/uploads/2025/07/medium-vecteezy_london-uk-november-24-2016-heathrow-express-train-to_16108060_medium-1080x675.jpg',
    sourceUrl: 'https://www.3axialsteeldetail.com/the-digital-revolution-in-steel-detailing-how-technology-is-reshaping-construction/',
    excerpt: 'From manual drafting tables to intelligent 3D models — how BIM, cloud collaboration, automation and CNC integration are rewriting the rules of structural fabrication.',
    content: [
      { type: 'quote', text: 'The ancient Egyptians detailed pyramids with papyrus. We use AI-powered BIM. The difference? Precision measured in millimeters, not cubits.' },
      { type: 'p', text: 'At 3Axial Steel Detail, we’re not just drafters – we’re digital orchestrators transforming how steel structures come to life. Here’s how cutting-edge tech is rewriting the rules of structural fabrication.' },
      { type: 'p', text: 'In the ever-evolving landscape of construction, digital transformation is no longer a trend — it’s a necessity. Among the many areas being transformed, steel detailing stands out as a key beneficiary of technological innovation. From manual drafting tables to sophisticated 3D modeling software, the journey of steel detailing showcases how far the industry has come — and how much further it’s going.' },
      { type: 'h2', text: 'What Is Steel Detailing — Reimagined?' },
      { type: 'p', text: 'Steel detailing involves creating detailed drawings and models for the fabrication and erection of structural steel components. But in today’s context, it’s no longer just about 2D shop drawings. The digital revolution has turned steel detailing into a powerful, intelligent process that integrates with entire construction ecosystems — from design to onsite execution.' },
      { type: 'h2', text: 'From Paper to Pixels: The Evolution of Steel Detailing' },
      { type: 'h3', text: 'Traditional detailing' },
      { type: 'ul', items: ['Manual drafting', 'Static 2D drawings', 'Higher chances of human error', 'Time-consuming revisions'] },
      { type: 'h3', text: 'Digital detailing today' },
      { type: 'ul', items: ['Intelligent 3D modeling (BIM)', 'Automated clash detection', 'Real-time collaboration', 'Integration with fabrication machinery (CNC)'] },
      { type: 'p', text: 'The shift from 2D to 3D has transformed how teams collaborate, visualize, and execute construction projects with greater accuracy and efficiency.' },
      { type: 'ol', items: ['1970s — Hand drawings', '1990s — 2D CAD', '2000s — 3D modeling', 'Today — 4D BIM + AI'] },
      { type: 'h2', text: 'Game-Changing Technologies in Steel Detailing' },
      { type: 'h3', text: '1. Building Information Modeling (BIM)' },
      { type: 'p', text: 'BIM enables the creation of highly detailed, data-rich 3D models. These models go beyond visualization — they contain material specifications, schedules, weights, costs, and even sequencing information.' },
      { type: 'ul', items: ['Visual clarity for all stakeholders', 'Clash detection before construction', 'Integrated project planning'] },
      { type: 'h3', text: '2. Cloud Collaboration' },
      { type: 'p', text: 'With platforms like Trimble Connect, Autodesk BIM 360, and Tekla Model Sharing, teams can collaborate in real time across geographies. Changes are tracked, approved, and implemented without delay.' },
      { type: 'ul', items: ['Faster decision-making', 'Reduced rework', 'Centralized project communication'] },
      { type: 'h3', text: '3. AI and Automation' },
      { type: 'p', text: 'AI is being used to optimize detailing workflows, suggest beam connections, and automate repetitive tasks — dramatically increasing productivity.' },
      { type: 'ul', items: ['Reduced human error', 'Faster turnaround time', 'Smarter design choices'] },
      { type: 'h3', text: '4. AR/VR for Visualization' },
      { type: 'p', text: 'Augmented and virtual reality tools allow clients, architects, and site engineers to “walk through” steel structures even before fabrication starts.' },
      { type: 'ul', items: ['Better client understanding', 'Easier approval process', 'Onsite assembly simulation'] },
      { type: 'h3', text: '5. Integration with Fabrication Machines' },
      { type: 'p', text: 'Today’s detailing software can generate files that directly communicate with CNC machines, ensuring precise fabrication without manual re-entry.' },
      { type: 'ul', items: ['Increased speed and accuracy', 'Cost savings in manufacturing', 'Reduced material waste'] },
      { type: 'h2', text: 'Core Technologies Powering Modern Detailing' },
      { type: 'h3', text: 'Tekla Structures: the nervous system' },
      { type: 'ul', items: ['Clash detection: auto-identifies 97% of structural conflicts pre-fabrication', 'Parametric components: generates 500+ connection types in seconds', 'Cloud collaboration: real-time markups across 12+ stakeholder types'] },
      { type: 'h3', text: 'SDS/2: the precision engine' },
      { type: 'ul', items: ['Automated NC files for CNC machines', 'Bolt-by-bolt material optimization', 'Tolerance calibration to 0.01 mm'] },
      { type: 'h2', text: 'Case Study: Denver Sports Arena' },
      { type: 'p', text: 'Challenge: 8,400 tons of steel, 18 intersecting curved roofs and a 6-month fabrication deadline.' },
      { type: 'ul', items: ['AI-driven topology optimization reduced steel tonnage by 14%', 'AR-guided erection cut installation errors by 63%', 'Blockchain-tracked materials prevented $287K in theft/loss'] },
      { type: 'p', text: 'Result: completed 23 days early with zero RFIs.' },
      { type: 'h2', text: 'Real-World Impact: What This Means for Construction' },
      { type: 'ul', items: ['Faster project turnarounds', 'Reduced onsite errors', 'Lower construction costs', 'Greener, sustainable practices', 'Stronger collaboration between teams'] },
      { type: 'h2', text: 'The Future of Steel Detailing' },
      { type: 'ul', items: ['Generative AI detailing: algorithm-driven connection design', 'Digital twins: live sensor-fed structural health monitoring', 'Carbon-calculating BIM: auto-select lowest-emission materials', 'Robotics in steel assembly guided by detailed 3D models'] },
      { type: 'p', text: 'As these technologies mature, the role of a steel detailer is shifting from drafter to digital architect of steel — a professional who not only draws but also drives construction innovation.' },
      { type: 'quote', text: 'Tomorrow’s detailing won’t just model steel – it’ll model sustainability.', cite: 'Elena Rodriguez, CTO at 3Axial' },
      { type: 'h2', text: 'Why Tech Choices Matter' },
      { type: 'p', text: 'Three red flags in outdated detailing:' },
      { type: 'ul', items: ['Manual clash detection (guaranteed field conflicts)', 'Disconnected design/fabrication workflows', 'Paper-based approval loops'] },
      { type: 'p', text: 'Our axiom: if your detailer isn’t using cloud-based BIM, you’re building with 20th-century risk.' },
      { type: 'h2', text: 'Conclusion' },
      { type: 'p', text: 'Steel detailing has evolved from drafting tables to AI-assisted collaboration. At 3Axial, we turn technological potential into structural perfection – one algorithmically optimized connection at a time.' }
    ]
  },
  {
    id: 'critical-role-of-steel-detailing',
    title: 'Building Success: The Critical Role of Steel Detailing in Construction',
    date: 'June 28, 2025',
    readTime: '5 min read',
    category: 'Steel Detailing',
    image: '/uploads/2025/06/medium-vecteezy_london-england-july-15-2017-london-paddington-station_12008056_medium-1080x675.jpg',
    sourceUrl: 'https://www.3axialsteeldetail.com/best-steel-detailers-in-bangalore/',
    excerpt: 'Steel detailing is the silent blueprint guiding every bolt and beam into place. Why precision detailing isn’t just important — it’s foundational to every successful steel structure.',
    content: [
      { type: 'p', text: 'In the symphony of construction, steel detailing is the invisible conductor ensuring every beam, bolt, and connection performs in perfect harmony. At 3Axial Steel Detail, we transform engineering visions into buildable realities.' },
      { type: 'p', text: 'Here’s why precision detailing isn’t just important — it’s foundational. In the world of modern construction, success doesn’t start with bricks and mortar — it begins with precision. One of the most crucial, yet often overlooked, aspects of building any steel structure is steel detailing. Whether it’s a skyscraper, bridge, factory, or stadium, steel detailing is the silent blueprint guiding every bolt and beam into place.' },
      { type: 'h2', text: 'What Is Steel Detailing?' },
      { type: 'p', text: 'Steel detailing is the process of creating detailed drawings and plans for steel fabricators and erectors. These include shop drawings for manufacturing steel components and erection drawings that guide onsite assembly. It’s the bridge between design and execution — translating architects’ and engineers’ visions into a practical, buildable reality. It bridges the gap between:' },
      { type: 'ul', items: ['Structural engineers’ designs', 'Fabricators’ workshops', 'Erection teams on-site'] },
      { type: 'p', text: 'Think of it as the DNA blueprint for steel structures.' },
      { type: 'h2', text: 'Why Your Project Can’t Succeed Without It' },
      { type: 'h3', text: 'Prevents costly errors' },
      { type: 'p', text: 'A single misplaced bolt hole can cause weeks of delays. Detailing catches clashes before fabrication. Example: our clash detection on a Houston high-rise saved $220K in rework.' },
      { type: 'h3', text: 'Ensures code compliance' },
      { type: 'p', text: 'Our drawings embed AISC, CISC, and Eurocode standards — critical for permits and safety certifications.' },
      { type: 'h3', text: 'Optimises material usage' },
      { type: 'p', text: 'AI-driven nesting in Tekla reduces scrap steel by 12–18%, directly boosting your ROI.' },
      { type: 'h2', text: 'Why Is Steel Detailing So Important?' },
      { type: 'h3', text: '1. Accuracy = safety' },
      { type: 'p', text: 'Even a small error in detailing can lead to misaligned structures, onsite delays, or — worse — safety risks. Precise detailing ensures structural integrity, helping buildings withstand environmental loads, stresses, and time.' },
      { type: 'h3', text: '2. Cost-effective construction' },
      { type: 'p', text: 'Accurate shop drawings help fabricators cut steel to the right size, reducing waste and avoiding rework. Clear erection plans reduce delays, prevent onsite confusion, and ultimately save money.' },
      { type: 'h3', text: '3. Faster project delivery' },
      { type: 'p', text: 'Detailed plans ensure fabricators and construction teams know exactly what to do and when. This reduces downtime and helps teams meet tight deadlines without sacrificing quality.' },
      { type: 'h3', text: '4. Seamless collaboration' },
      { type: 'p', text: 'Steel detailing integrates inputs from architects, structural engineers, MEP (mechanical, electrical, plumbing) engineers, and contractors. It’s the language that unites everyone, avoiding conflicts between different disciplines.' },
      { type: 'h2', text: 'Who Performs Steel Detailing?' },
      { type: 'p', text: 'Professional steel detailers or structural CAD technicians use advanced software like Tekla Structures, AutoCAD, or Revit to produce 2D and 3D models. These experts must understand building codes, steel standards (like AISC, IS, or Eurocode), and fabrication techniques.' },
      { type: 'h2', text: '2D vs. 3D Detailing: What’s Changing?' },
      { type: 'p', text: 'Traditionally, detailing relied on 2D drawings. But today, 3D BIM (Building Information Modeling) is revolutionizing the industry. It allows for real-time collaboration, clash detection, and precise visualization before a single beam is cut.' },
      { type: 'p', text: 'A 3D model isn’t just a picture — it’s a data-rich simulation of the final build, reducing errors and optimizing the construction workflow.' },
      { type: 'h2', text: 'The 3Axial Steel Detail Advantage' },
      { type: 'p', text: 'Precision powered by technology. We leverage:' },
      { type: 'ul', items: ['Tekla Structures for BIM-integrated 3D modeling', 'Advanced SDS/2 for fabrication-level accuracy', 'Cloud collaboration for real-time stakeholder updates'] },
      { type: 'h3', text: 'Case snapshot: Vancouver Sports Complex' },
      { type: 'ul', items: ['Challenge: 5,000+ complex tubular connections', 'Our solution: parametric modeling automated 85% of connections', 'Result: fabrication time cut by 30%'] },
      { type: 'h2', text: 'When Should You Involve a Detailer?' },
      { type: 'ol', items: ['Concept design', 'Engage detailer', 'Design development', 'Fabrication', 'Erection'] },
      { type: 'p', text: 'Early collaboration prevents 92% of constructability issues (NCSEA 2023 Report).' },
      { type: 'h2', text: 'Applications of Steel Detailing' },
      { type: 'ul', items: ['Commercial buildings (malls, office towers)', 'Industrial plants', 'Warehouses', 'Bridges & flyovers', 'Sports complexes', 'Metro & rail infrastructure'] },
      { type: 'h2', text: 'Future-Proofing with 3Axial' },
      { type: 'ul', items: ['AI-driven error forecasting', 'AR-assisted site verification', 'Carbon-footprint optimization in material specs'] },
      { type: 'h2', text: 'Conclusion' },
      { type: 'p', text: 'Steel detailing is the silent guardian of your project’s structural integrity, budget, and timeline. At 3Axial Steel Detail, we don’t just draw — we engineer certainty.' },
      { type: 'quote', text: 'The difference between a good structure and a great one lies in the details.', cite: 'Mark Richardson, P.Eng., Founder' }
    ]
  }
];
