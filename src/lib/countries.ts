// Country data for NextStep International
// Full study destination guides for Pakistani students

export type CountryData = {
  slug: string;
  name: string;
  flagEmoji: string;
  tagline: string;
  shortDesc: string;
  longDesc: string;
  capital: string;
  currency: string;
  language: string;
  tuitionRange: string;
  livingCost: string;
  visaProcess: string;
  topUniversities: string;
  popularCourses: string;
  intakeMonths: string;
  scholarships: string;
  workRights: string;
  gradient: string;
  accentColor: string;
  featured: boolean;
  order: number;
};

export const countries: CountryData[] = [
  {
    slug: "united-kingdom",
    name: "United Kingdom",
    flagEmoji: "🇬🇧",
    tagline: "World-class universities and vibrant culture",
    shortDesc:
      "Home to prestigious institutions like Oxford, Cambridge, and Imperial, the UK is a global leader in education.",
    longDesc:
      "The United Kingdom hosts some of the world's oldest and most prestigious universities. Pakistani students benefit from a 1-year master's pathway, a 2-year post-study work visa (Graduate Route), and a rich multicultural environment. Our top partner picks include Edinburgh Napier University (ENU), University of Portsmouth, Birmingham City University, and Nottingham Trent University (NTU).",
    capital: "London",
    currency: "GBP (£)",
    language: "English",
    tuitionRange: "£12,000 – £25,000 / year",
    livingCost: "£1,000 – £1,500 / month",
    visaProcess:
      "Student Visa (Tier 4) requires CAS from a licensed sponsor, proof of funds for tuition + 9 months living costs, and IELTS. Visa decisions typically take 3-4 weeks.",
    topUniversities:
      "University of Oxford, University of Cambridge, Imperial College London, Edinburgh Napier University, University of Portsmouth, Birmingham City University, Nottingham Trent University",
    popularCourses:
      "Business & Management, Computer Science, Engineering, Law, Data Science, MBA, Accounting & Finance",
    intakeMonths: "September (main), January (select courses)",
    scholarships:
      "Chevening Scholarship, Commonwealth Scholarship, GREAT Scholarships, university-specific awards up to £10,000",
    workRights: "20 hours/week during term, full-time in breaks; 2-year Graduate Route visa after studies",
    gradient: "from-[#012169] via-[#1e3a8a] to-[#c8102e]",
    accentColor: "#c8102e",
    featured: true,
    order: 1,
  },
  {
    slug: "australia",
    name: "Australia",
    flagEmoji: "🇦🇺",
    tagline: "Innovation meets adventure down under",
    shortDesc:
      "Study in a country known for its cutting-edge research, stunning landscapes, and laid-back lifestyle.",
    longDesc:
      "Australia combines world-class education with outdoor adventures and multicultural cities. The country offers a transparent visa framework (GS requirement), a Temporary Graduate (485) visa pathway, and strong protections for international students under the ESOS Act. Pakistani students gain access to globally recognized qualifications and excellent post-study work opportunities.",
    capital: "Canberra",
    currency: "AUD ($)",
    language: "English",
    tuitionRange: "A$22,000 – A$45,000 / year",
    livingCost: "A$1,500 – A$2,000 / month",
    visaProcess:
      "Subclass 500 Student Visa requires CoE, GS (Genuine Student) statement, OSHC health cover, and financial evidence. Processing takes 4-8 weeks.",
    topUniversities:
      "University of Melbourne, ANU, University of Sydney, Monash University, University of Adelaide, Edith Cowan University, Griffith University, Murdoch University",
    popularCourses:
      "Nursing, IT, Engineering, Accounting, Hospitality, Data Analytics, Renewable Energy, Health Sciences",
    intakeMonths: "February & July (main); November (limited)",
    scholarships:
      "Australia Awards, Destination Australia Scholarship, university vice-chancellor scholarships up to 30% tuition",
    workRights: "24 hours/week during study; 2-4 year Temporary Graduate (485) visa after course completion",
    gradient: "from-[#00008b] via-[#1e40af] to-[#ff0000]",
    accentColor: "#1e40af",
    featured: true,
    order: 2,
  },
  {
    slug: "united-states",
    name: "United States",
    flagEmoji: "🇺🇸",
    tagline: "Land of opportunity and academic excellence",
    shortDesc:
      "Home to many of the world's top universities and research institutions with unparalleled opportunities for innovation.",
    longDesc:
      "The United States hosts the largest number of top-ranked universities globally, offering unmatched research funding, optional practical training (OPT) of up to 3 years for STEM fields, and the broadest range of programs. Pakistani students gain access to cutting-edge labs, networking with global industry leaders, and flexible credit-based learning.",
    capital: "Washington, D.C.",
    currency: "USD ($)",
    language: "English",
    tuitionRange: "$20,000 – $55,000 / year",
    livingCost: "$1,000 – $2,500 / month",
    visaProcess:
      "F-1 Visa requires Form I-20 from SEVP-certified school, SEVIS fee payment, DS-160 application, and visa interview. Processing varies 2-8 weeks.",
    topUniversities:
      "MIT, Harvard, Stanford, Columbia, NYU, Arizona State University, University of Illinois, Northeastern University",
    popularCourses:
      "Computer Science, Engineering, Business Analytics, Data Science, Public Health, Finance, Cybersecurity",
    intakeMonths: "Fall (August – main), Spring (January), Summer (limited)",
    scholarships:
      "Fulbright Foreign Student Program, university merit scholarships, graduate assistantships (TA/RA) covering tuition + stipend",
    workRights: "20 hours/week on-campus during term; 12-month OPT (36-month STEM OPT) after graduation",
    gradient: "from-[#002868] via-[#1e3a8a] to-[#bf0a30]",
    accentColor: "#bf0a30",
    featured: true,
    order: 3,
  },
  {
    slug: "canada",
    name: "Canada",
    flagEmoji: "🇨🇦",
    tagline: "Friendly nation with world-renowned education",
    shortDesc:
      "Known for its welcoming atmosphere, high-quality education, beautiful landscapes, and a pathway to permanent residency.",
    longDesc:
      "Canada offers excellent research opportunities, a Post-Graduation Work Permit (PGWP) of up to 3 years, and one of the clearest pathways from study to permanent residency. Pakistani students benefit from affordable tuition compared to the US/UK, multicultural cities, and a strong desi community network.",
    capital: "Ottawa",
    currency: "CAD ($)",
    language: "English & French",
    tuitionRange: "C$15,000 – C$35,000 / year",
    livingCost: "C$1,200 – C$2,000 / month",
    visaProcess:
      "Study Permit requires LOA (Letter of Acceptance) from a DLI, proof of funds (GIC + tuition), medical exam, and biometrics. Processing 4-12 weeks.",
    topUniversities:
      "University of Toronto, UBC, McGill, University of Waterloo, University of Manitoba, Wilfrid Laurier, Centennial College, Humber College",
    popularCourses:
      "Computer Science, Engineering, Business Analytics, Healthcare, Data Science, Supply Chain, Hospitality Management",
    intakeMonths: "September (main), January, May (limited)",
    scholarships:
      "Vanier CGS, Trudeau Scholarship, university entrance awards, provincial nomination programs for PR",
    workRights: "24 hours/week off-campus during study; up to 3-year PGWP; clear PR pathway via Express Entry",
    gradient: "from-[#ff0000] via-[#d52b1e] to-[#ffffff]",
    accentColor: "#d52b1e",
    featured: true,
    order: 4,
  },
  {
    slug: "germany",
    name: "Germany",
    flagEmoji: "🇩🇪",
    tagline: "Engineering excellence and cultural richness",
    shortDesc:
      "Home to Europe's finest technical universities with tuition-free education at public universities.",
    longDesc:
      "Germany offers tuition-free education at most public universities, strong industry connections with global automotive and engineering giants, and an 18-month post-study work visa. Pakistani students benefit from the APS certificate process, affordable living, and access to the EU job market in engineering, IT, and renewable energy fields.",
    capital: "Berlin",
    currency: "EUR (€)",
    language: "German & English",
    tuitionRange: "€0 – €1,500 / year (public); €10,000+ (private)",
    livingCost: "€800 – €1,200 / month",
    visaProcess:
      "Student Visa requires university admission letter, blocked account (€11,208/year), health insurance, and APS certificate for Pakistani applicants.",
    topUniversities:
      "TU Munich, Heidelberg University, RWTH Aachen, TU Berlin, University of Stuttgart, LMU Munich, KIT",
    popularCourses:
      "Mechanical Engineering, Automotive, Computer Science, Industrial Engineering, Renewable Energy, Medicine",
    intakeMonths: "Winter (October – main), Summer (April)",
    scholarships:
      "DAAD Scholarship, Deutschlandstipendium (€300/month), Erasmus+, university-specific awards",
    workRights: "120 full days or 240 half days/year during study; 18-month job-seeker visa after graduation",
    gradient: "from-[#000000] via-[#1a1a1a] to-[#ff0000]",
    accentColor: "#ffcc00",
    featured: true,
    order: 5,
  },
  {
    slug: "ireland",
    name: "Ireland",
    flagEmoji: "🇮🇪",
    tagline: "Emerald Isle of knowledge and innovation",
    shortDesc:
      "Experience Irish hospitality while studying at internationally recognized institutions with strong tech industry links.",
    longDesc:
      "Ireland combines rich literary traditions with modern technology and business excellence. As the European headquarters of Google, Meta, and Apple, it offers unmatched career opportunities for IT and business graduates. Pakistani students benefit from a 1-year master's pathway and a 2-year post-study work visa (Third Level Graduate Scheme).",
    capital: "Dublin",
    currency: "EUR (€)",
    language: "English & Irish",
    tuitionRange: "€10,000 – €25,000 / year",
    livingCost: "€1,000 – €1,500 / month",
    visaProcess:
      "Long Stay 'D' Visa requires offer letter, proof of fees paid, private medical insurance, and financial evidence. Processing 4-8 weeks.",
    topUniversities:
      "Trinity College Dublin, UCD, University of Galway, DCU, Dublin Business School, Griffith College, Maynooth University",
    popularCourses:
      "Computer Science, Data Analytics, Business, Pharmacy, Cybersecurity, Cloud Computing, FinTech",
    intakeMonths: "September (main), January (select courses)",
    scholarships:
      "Government of Ireland Scholarship, university merit awards, and faculty-specific bursaries up to €5,000",
    workRights: "20 hours/week during study; 1-year (Level 8) or 2-year (Level 9-10) stay-back option",
    gradient: "from-[#169b62] via-[#0e8a55] to-[#ff883e]",
    accentColor: "#169b62",
    featured: false,
    order: 6,
  },
  {
    slug: "netherlands",
    name: "Netherlands",
    flagEmoji: "🇳🇱",
    tagline: "Progressive education in a historic setting",
    shortDesc:
      "Study in one of Europe's most innovative countries with English-taught programs and a high quality of life.",
    longDesc:
      "The Netherlands offers over 2,100 English-taught programs, a problem-based learning approach pioneered at Maastricht, and a 1-year 'Orientation Year' (zoekjaar) visa for graduates. Pakistani students benefit from affordable tuition, a strong international job market, and bicycle-friendly, inclusive cities.",
    capital: "Amsterdam",
    currency: "EUR (€)",
    language: "Dutch & English",
    tuitionRange: "€8,000 – €18,000 / year",
    livingCost: "€900 – €1,300 / month",
    visaProcess:
      "Entry Visa (MVV) + Residence Permit handled by host university as sponsor. Requires proof of funds, tuberculosis test, and passport.",
    topUniversities:
      "University of Amsterdam, TU Delft, Erasmus University, Utrecht University, Leiden University, Wageningen",
    popularCourses:
      "Business Administration, Computer Science, Aerospace, Water Management, Supply Chain, Economics",
    intakeMonths: "September (main), February (limited)",
    scholarships:
      "Holland Scholarship (€5,000), Erasmus Mundus, Orange Tulip Scholarship, university excellence awards",
    workRights: "16 hours/week during study; 1-year Orientation Year visa to find work after graduation",
    gradient: "from-[#ae1c28] via-[#21468b] to-[#ffffff]",
    accentColor: "#21468b",
    featured: false,
    order: 7,
  },
  {
    slug: "uae",
    name: "UAE",
    flagEmoji: "🇦🇪",
    tagline: "Modern oasis of innovation and luxury",
    shortDesc:
      "Experience futuristic cities, world-class facilities, and gateway to global business opportunities in the Middle East.",
    longDesc:
      "The UAE hosts international branch campuses from the US, UK, and Australia in Dubai and Abu Dhabi, offering globally recognized degrees at lower cost than the home country. Pakistani students benefit from tax-free living, cultural proximity, and proximity to Pakistan with direct flights.",
    capital: "Abu Dhabi",
    currency: "AED (د.إ)",
    language: "Arabic & English",
    tuitionRange: "AED 35,000 – AED 90,000 / year",
    livingCost: "AED 3,000 – AED 6,000 / month",
    visaProcess:
      "Student Residence Visa sponsored by the university, requires medical fitness test, health insurance, and passport.",
    topUniversities:
      "American University of Sharjah, NYU Abu Dhabi, Heriot-Watt Dubai, University of Wollongong Dubai, Middlesex University Dubai",
    popularCourses:
      "Business, Computer Science, Engineering, Hospitality, Architecture, Aviation Management",
    intakeMonths: "September, January, May (varies by campus)",
    scholarships:
      "Mohammed bin Rashid Al Maktoum Knowledge Award, university merit scholarships up to 50% tuition",
    workRights: "Part-time work permit for on-campus/pre-approved zones; post-graduation job search options",
    gradient: "from-[#00732f] via-[#0a8a3f] to-[#ff0000]",
    accentColor: "#0a8a3f",
    featured: false,
    order: 8,
  },
  {
    slug: "malaysia",
    name: "Malaysia",
    flagEmoji: "🇲🇾",
    tagline: "Gateway to Asia with diverse opportunities",
    shortDesc:
      "Affordable education, tropical climate, and strategic Southeast Asian location with international branch campuses.",
    longDesc:
      "Malaysia offers the perfect blend of Eastern and Western cultures with modern facilities. Pakistani students gain access to UK and Australian degrees via branch campuses (e.g., Monash Malaysia, Nottingham Malaysia) at roughly half the cost of studying in the home country, plus halal food and a familiar climate.",
    capital: "Kuala Lumpur",
    currency: "MYR (RM)",
    language: "Malay & English",
    tuitionRange: "RM 15,000 – RM 40,000 / year",
    livingCost: "RM 1,500 – RM 2,500 / month",
    visaProcess:
      "Student Pass issued via EMGS (Education Malaysia Global Services), requires offer letter, medical check, and passport.",
    topUniversities:
      "University of Malaya, Monash University Malaysia, Nottingham Malaysia, Taylor's University, APU, UTM",
    popularCourses:
      "Business, Engineering, Hospitality, Medicine, IT, Aviation, Accounting (ACCA)",
    intakeMonths: "February, July, September (varies by institution)",
    scholarships:
      "Malaysia International Scholarship (MIS), university merit awards, twinning program discounts",
    workRights: "20 hours/week during semester breaks; post-study work permit options for skilled graduates",
    gradient: "from-[#cc0001] via-[#010066] to-[#ffffff]",
    accentColor: "#cc0001",
    featured: false,
    order: 9,
  },
  {
    slug: "turkiye",
    name: "Türkiye",
    flagEmoji: "🇹🇷",
    tagline: "Bridge between Europe and Asia",
    shortDesc:
      "Study at the crossroads of Europe and Asia with rich cultural heritage and modern educational facilities.",
    longDesc:
      "Türkiye offers diverse programs, a growing international student community, and the Türkiye Bursları (Turkey Scholarships) program covering full tuition, accommodation, and stipend. Pakistani students benefit from affordable living, strong medical and engineering programs, and cultural ties via the Muslim world.",
    capital: "Ankara",
    currency: "TRY (₺)",
    language: "Turkish & English",
    tuitionRange: "$600 – $8,000 / year",
    livingCost: "$400 – $700 / month",
    visaProcess:
      "Student Visa requires acceptance letter from Turkish university, passport, financial proof, and consular interview.",
    topUniversities:
      "Bogazici University, METU, Istanbul University, Koç University, Sabanci, Bilkent, Istanbul Technical",
    popularCourses:
      "Medicine, Engineering, International Relations, Business, Architecture, Dentistry",
    intakeMonths: "September (main), February (limited)",
    scholarships:
      "Türkiye Bursları (full scholarship), university quotas, Turkiye Diyanet Foundation scholarships",
    workRights: "Part-time work permit after first year; post-graduation work permit options available",
    gradient: "from-[#e30a17] via-[#c00814] to-[#ffffff]",
    accentColor: "#e30a17",
    featured: false,
    order: 10,
  },
  {
    slug: "hungary",
    name: "Hungary",
    flagEmoji: "🇭🇺",
    tagline: "Central European charm with quality education",
    shortDesc:
      "Affordable European education with excellent medical and engineering programs in a historic setting.",
    longDesc:
      "Hungary offers affordable European education in a country rich with thermal baths, historic architecture, and cultural traditions. The Stipendium Hungaricum scholarship (reserved quota for Pakistan) covers full tuition, accommodation, and monthly stipend. Hungarian medical degrees are recognized across the EU.",
    capital: "Budapest",
    currency: "HUF (Ft)",
    language: "Hungarian & English",
    tuitionRange: "€2,500 – €8,000 / year",
    livingCost: "€400 – €700 / month",
    visaProcess:
      "Type D Long-Stay Visa requires admission letter, accommodation proof, financial means, and health insurance.",
    topUniversities:
      "Eötvös Loránd University, University of Szeged, Semmelweis University, Budapest University of Technology, CEU",
    popularCourses:
      "Medicine (MD), Dentistry, Engineering, Pharmacy, Business, Veterinary Science",
    intakeMonths: "September (main), February (limited medical programs)",
    scholarships:
      "Stipendium Hungaricum (full), Hungary Government Scholarship, university bilateral agreements",
    workRights: "24 hours/week during study; 9-month job-search residence permit after graduation",
    gradient: "from-[#cd2a3e] via-[#436484] to-[#477050]",
    accentColor: "#cd2a3e",
    featured: false,
    order: 11,
  },
  {
    slug: "new-zealand",
    name: "New Zealand",
    flagEmoji: "🇳🇿",
    tagline: "World-class education surrounded by breathtaking landscapes",
    shortDesc:
      "Innovative teaching, a safe environment, and excellent post-study opportunities. All 8 universities rank in the global top 3%.",
    longDesc:
      "New Zealand offers innovative teaching, a safe environment, and excellent post-study opportunities. All eight of its universities consistently rank in the top 3% of the world's universities according to QS World University Rankings. Pakistani students benefit from a Post-Study Work Visa of up to 3 years and a clear PR pathway.",
    capital: "Wellington",
    currency: "NZD ($)",
    language: "English & Māori",
    tuitionRange: "NZ$22,000 – NZ$40,000 / year",
    livingCost: "NZ$1,500 – NZ$2,200 / month",
    visaProcess:
      "Student Visa requires offer of place, evidence of funds, medical/travel insurance, and may require TB screening.",
    topUniversities:
      "University of Auckland, University of Otago, Victoria University of Wellington, AUT, Massey University, University of Canterbury",
    popularCourses:
      "Agriculture, Engineering, Nursing, IT, Business, Hospitality, Environmental Science, Aviation",
    intakeMonths: "February & July (main); November (limited)",
    scholarships:
      "New Zealand Scholarships (MFAT), university international excellence awards, faculty-specific bursaries",
    workRights: "20 hours/week during study; 1-3 year Post-Study Work Visa after qualification",
    gradient: "from-[#00247d] via-[#0a3a9e] to-[#ffffff]",
    accentColor: "#0a3a9e",
    featured: false,
    order: 12,
  },
  {
    slug: "singapore",
    name: "Singapore",
    flagEmoji: "🇸🇬",
    tagline: "Study in the heart of Asia",
    shortDesc:
      "Technological innovation, elite education, and an exciting multicultural lifestyle as a global education powerhouse.",
    longDesc:
      "Singapore combines technological innovation, elite education, and an exciting multicultural lifestyle. It has rapidly emerged as a global powerhouse in education, leading the way in research in Asia. Pakistani students benefit from safe streets, English-medium instruction, and proximity to Asian job markets.",
    capital: "Singapore",
    currency: "SGD ($)",
    language: "English, Malay, Tamil & Mandarin",
    tuitionRange: "S$20,000 – S$50,000 / year",
    livingCost: "S$1,200 – S$2,000 / month",
    visaProcess:
      "Student Pass via SOLAR+ system sponsored by the institution; requires in-person registration at ICA.",
    topUniversities:
      "National University of Singapore (NUS), NTU, Singapore Management University, SUTD, JCU Singapore",
    popularCourses:
      "Computer Science, Business Analytics, Engineering, Finance, Logistics, Data Science, Biomedical",
    intakeMonths: "August (main), January (select programs)",
    scholarships:
      "Singapore International Graduate Award (SINGA), ASEAN Scholarship, university tuition grants with 3-year bond",
    workRights: "16 hours/week during term; Employment Pass / S Pass options after graduation",
    gradient: "from-[#ed2939] via-[#c41e3a] to-[#ffffff]",
    accentColor: "#ed2939",
    featured: false,
    order: 13,
  },
  {
    slug: "indonesia",
    name: "Indonesia",
    flagEmoji: "🇮🇩",
    tagline: "International education in a growing Asian economy",
    shortDesc:
      "Explore international university options in Southeast Asia with affordable living and diverse culture.",
    longDesc:
      "Indonesia offers international university options in Southeast Asia with comparatively affordable living costs, a diverse culture, and access to a rapidly developing regional economy. Pakistani students benefit from a Muslim-majority environment, halal food, and growing number of English-medium programs.",
    capital: "Jakarta",
    currency: "IDR (Rp)",
    language: "Indonesian & English",
    tuitionRange: "$2,000 – $7,000 / year",
    livingCost: "$300 – $600 / month",
    visaProcess:
      "Limited Stay Permit (VITAS) converted to KITAS sponsored by the university; requires offer letter and passport.",
    topUniversities:
      "University of Indonesia, Bandung Institute of Technology, Gadjah Mada University, BINUS, Airlangga",
    popularCourses:
      "Medicine, Engineering, Business, Islamic Studies, Tourism, Tropical Medicine",
    intakeMonths: "August & February",
    scholarships:
      "KNB Scholarship (Developing Country), Darmasiswa, Beasiswa Indonesia, university quotas",
    workRights: "Part-time work permit for on-campus jobs; limited off-campus options",
    gradient: "from-[#ff0000] via-[#e00000] to-[#ffffff]",
    accentColor: "#e00000",
    featured: false,
    order: 14,
  },
  {
    slug: "georgia",
    name: "Georgia",
    flagEmoji: "🇬🇪",
    tagline: "Affordable European education with MBBS pathway",
    shortDesc:
      "Affordable tuition, globally recognized MBBS degrees, and a safe European environment for Pakistani students.",
    longDesc:
      "Georgia has become a top destination for Pakistani students seeking affordable MBBS and engineering degrees in Europe. English-medium programs, globally recognized medical degrees (WHO/NMC), low living costs, and a safe environment make it ideal. No IELTS required for many universities, and the visa process is straightforward with high approval rates.",
    capital: "Tbilisi",
    currency: "GEL (₾)",
    language: "Georgian & English",
    tuitionRange: "$3,000 – $6,000 / year",
    livingCost: "$300 – $500 / month",
    visaProcess:
      "Student Visa (D3) requires university invitation letter, proof of funds, and health insurance. Processing takes 10-15 days.",
    topUniversities:
      "Tbilisi State Medical University, Caucasus University, Georgian National University SEU, University of Georgia, Ivane Javakhishvili Tbilisi State University",
    popularCourses:
      "MBBS / Medicine, Dentistry, Pharmacy, Engineering, Business Administration, IT",
    intakeMonths: "September (main) & February (limited)",
    scholarships:
      "University merit scholarships, Georgia Government Scholarship, bilateral agreements",
    workRights: "Part-time work permit during studies; post-study work visa options available",
    gradient: "from-[#ffffff] via-[#e2001a] to-[#000000]",
    accentColor: "#e2001a",
    featured: false,
    order: 15,
  },
  {
    slug: "china",
    name: "China",
    flagEmoji: "🇨🇳",
    tagline: "World-class MBBS and engineering with scholarships",
    shortDesc:
      "Globally recognized MBBS programs, engineering, and business degrees with generous scholarships for Pakistani students.",
    longDesc:
      "China offers world-class education with a strong focus on MBBS (English-medium), engineering, and business programs. Pakistani students benefit from generous CSC (Chinese Government Scholarships), globally recognized medical degrees, affordable tuition, and proximity to Pakistan. Many universities don't require IELTS, and the cultural exchange programs are extensive.",
    capital: "Beijing",
    currency: "CNY (¥)",
    language: "Mandarin & English",
    tuitionRange: "$2,500 – $8,000 / year",
    livingCost: "$300 – $600 / month",
    visaProcess:
      "X1 Student Visa requires JW202 form, university admission letter, and physical examination form. Processing takes 2-4 weeks.",
    topUniversities:
      "Tsinghua University, Peking University, Fudan University, Zhejiang University, Shanghai Jiao Tong, Nanjing University",
    popularCourses:
      "MBBS / Clinical Medicine, Engineering, Computer Science, Business, Pharmacy, Traditional Chinese Medicine",
    intakeMonths: "September (main) & March (limited)",
    scholarships:
      "CSC (Chinese Government Scholarship), Confucius Institute Scholarship, provincial scholarships, university bilateral awards",
    workRights: "Part-time work with permission; internship opportunities during studies",
    gradient: "from-[#de2910] via-[#c41e1a] to-[#ffde00]",
    accentColor: "#de2910",
    featured: false,
    order: 16,
  },
];

export const services = [
  {
    icon: "Compass",
    title: "Career Counseling",
    description:
      "Personalized guidance to match your academic background, budget, and career goals with the right destination and course.",
  },
  {
    icon: "FileCheck",
    title: "University Admissions",
    description:
      "End-to-end application support — from shortlisting universities to statement of purpose review and offer acceptance.",
  },
  {
    icon: "Plane",
    title: "Visa Processing",
    description:
      "Expert handling of student visa applications with a 96% success rate, including documentation, financials, and interview prep.",
  },
  {
    icon: "GraduationCap",
    title: "IELTS / PTE Preparation",
    description:
      "Certified trainers deliver targeted IELTS and PTE prep to help you hit the band score your dream university demands.",
  },
  {
    icon: "Wallet",
    title: "Scholarship Guidance",
    description:
      "Maximize your funding with scholarship matching, essay coaching, and timely application tracking for 200+ awards.",
  },
  {
    icon: "Home",
    title: "Pre-Departure & Accommodation",
    description:
      "Airport pickup, accommodation arrangement, bank account setup, and SIM activation so you settle in stress-free.",
  },
];

export const stats = [
  { label: "Students Placed", value: "12,000+", icon: "Users" },
  { label: "Partner Universities", value: "850+", icon: "Building2" },
  { label: "Study Destinations", value: "16", icon: "Globe2" },
  { label: "Visa Success Rate", value: "96%", icon: "BadgeCheck" },
];


export const compareFactors = [
  {
    icon: "GraduationCap",
    title: "Academic Fit",
    description:
      "Entry requirements, relevant courses, intakes, and progression options matched to your qualification.",
    points: [
      "Entry requirements & academic equivalency",
      "Course curriculum & specialization options",
      "Intake availability & deadlines",
      "Progression and pathway programs",
    ],
  },
  {
    icon: "Wallet",
    title: "Realistic Budget",
    description:
      "Tuition, living costs, available scholarships, and the funds needed for a visa application.",
    points: [
      "Tuition fee range per program",
      "Monthly living cost estimates",
      "Scholarship & funding options",
      "Visa financial evidence requirements",
    ],
  },
  {
    icon: "FileCheck",
    title: "Visa Preparation",
    description:
      "English test expectations, financial evidence, document timelines, and country-specific requirements.",
    points: [
      "English test score requirements",
      "Financial evidence & bank statements",
      "Document attestation & timelines",
      "Interview preparation & country rules",
    ],
  },
];
