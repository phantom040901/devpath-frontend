import ArrowSwap from "../components/icons/ArrowSwap";
import CardSlash from "../components/icons/CardSlash";
import Cloud from "../components/icons/Cloud";
import DollarCircle from "../components/icons/DollarCircle";
import Import from "../components/icons/Import";
import Integrate from "../components/icons/Integrate";
import MagicPen from "../components/icons/MagicPen";
import Microphone from "../components/icons/Microphone";
import Note from "../components/icons/Note";
import Organization from "../components/icons/Organization";
import Search from "../components/icons/Search";
import Slack from "../components/icons/Slack";
import SMSNotification from "../components/icons/SMSNotification";
import TwoUsers from "../components/icons/TwoUsers";
import Lock from "../components/icons/Lock";

const navigationLinks = [
  {
    id: 1,
    link: "Home",
    href: "#hero",   // 👈 Scroll to Hero section
  },
  {
    id: 2,
    link: "About",
    href: "#about",  // 👈 Scroll to About section
  },
  {
    id: 3,
    link: "How It Works",
    href: "#how-it-works",  // 👈 Scroll to HowItWorks section
  },
  {
    id: 4,
    link: "System Preview",
    href: "#system-preview",   // 👈 Scroll to System Preview section
  },
  
  {
    id: 5, link: "FAQs",
    href: "#faqs"
  },   
];


const reviews = [
  {
    id: 1,
    src: new URL("../assets/headshots/img-11.webp", import.meta.url),
    alt: "Rachel Foster",
  },
  {
    id: 2,
    src: new URL("../assets/headshots/img-7.webp", import.meta.url),
    alt: "Emily Thompson",
  },
  {
    id: 3,
    src: new URL("../assets/headshots/img-5.webp", import.meta.url),
    alt: "Daniel Harris",
  },
  {
    id: 4,
    src: new URL("../assets/headshots/img-9.webp", import.meta.url),
    alt: "Sarah Lee",
  },
  {
    id: 5,
    src: new URL("../assets/headshots/img-15.webp", import.meta.url),
    alt: "Lucas King",
  },
];

const logos = [
  {
    id: 1,
    src: new URL("../assets/logos/Netflix.webp", import.meta.url),
    alt: "Netflix Logo",
  },
  {
    id: 2,
    src: new URL("../assets/logos/ExxonMobile.webp", import.meta.url),
    alt: "Exxon Mobile Logo",
  },
  {
    id: 3,
    src: new URL("../assets/logos/Microsoft.webp", import.meta.url),
    alt: "Microsoft Logo",
  },
  {
    id: 4,
    src: new URL("../assets/logos/Vice.webp", import.meta.url),
    alt: "Vice Logo",
  },
  {
    id: 5,
    src: new URL("../assets/logos/Walmart.webp", import.meta.url),
    alt: "Walmart Logo",
  },
  {
    id: 6,
    src: new URL("../assets/logos/Chase.webp", import.meta.url),
    alt: "Chase Logo",
  },
  {
    id: 7,
    src: new URL("../assets/logos/Visa.webp", import.meta.url),
    alt: "Visa Logo",
  },
  {
    id: 8,
    src: new URL("../assets/logos/Amazon.webp", import.meta.url),
    alt: "Amazon Logo",
  },
];

const frequentlyAskedQuestions = [
  // General
  {
    category: "General",
    id: 1,
    questions: [
      {
        id: 1,
        alt: "Product Icon",
        Icon: Note,
        question: "What is DevPath?",
        answer:
          "DevPath is an AI-driven career guidance platform for students and early-career developers. It analyzes skills, interests, and projects to recommend suitable developer roles and personalized learning paths.",
      },
      {
        id: 2,
        alt: "How it works Icon",
        Icon: MagicPen,
        question: "Who is DevPath for?",
        answer:
          "DevPath is aimed at students, recent graduates, bootcamp alumni, and junior engineers who want to identify which developer roles best match their strengths and how to reach them.",
      },
      {
        id: 3,
        alt: "Access Icon",
        Icon: Cloud,
        question: "How do I get started?",
        answer:
          "Start by running the Career Path Simulator on the site — adjust skill sliders or upload project highlights. You can try the basic simulator for free; sign up to save results and get exportable reports.",
      },
      {
        id: 4,
        alt: "Team Icon",
        Icon: TwoUsers,
        question: "Can mentors or educators use DevPath?",
        answer:
          "Yes — instructors and mentors can use DevPath to evaluate cohorts, recommend curated learning tracks, and produce reports useful for advising students or interns.",
      },
    ],
  },

  // Simulator
  {
    category: "Simulator",
    id: 2,
    questions: [
      {
        id: 5,
        alt: "Simulator Icon",
        Icon: Search,
        question: "How does the Career Path Simulator work?",
        answer:
          "The Simulator takes your self-assessed skills (and optional project signals) and computes similarity scores against role profiles. It ranks matching roles and highlights which skills to improve.",
      },
      {
        id: 6,
        alt: "Customize Icon",
        Icon: ArrowSwap,
        question: "Can I customize the skill inputs?",
        answer:
          "Yes — you can adjust sliders for skill areas (e.g., frontend, backend, data) and toggle interests. The simulator updates recommendations instantly based on those inputs.",
      },
      {
        id: 7,
        alt: "Model Icon",
        Icon: Organization,
        question: "Are simulator results accurate?",
        answer:
          "The demo uses a simplified matching algorithm for experimentation. In production, DevPath uses richer signals (project metadata, assessments, employer benchmarks) to generate more accurate fit scores.",
      },
      {
        id: 8,
        alt: "Export Icon",
        Icon: Import,
        question: "Can I save or export simulator results?",
        answer:
          "If you create an account you can save your simulations, generate a downloadable career report, and share results with mentors or recruiters.",
      },
    ],
  },

  // Career Guidance
  {
    category: "Career Guidance",
    id: 3,
    questions: [
      {
        id: 9,
        alt: "Learning Icon",
        Icon: SMSNotification,
        question: "Will DevPath suggest learning resources?",
        answer:
          "Yes — DevPath recommends courses, projects, and micro-tasks targeted to the most impactful skills to help you move toward your chosen role.",
      },
      {
        id: 10,
        alt: "Role Icon",
        Icon: Microphone,
        question: "What roles does DevPath support?",
        answer:
          "DevPath supports common developer roles such as Frontend, Backend, Full-Stack, Mobile, DevOps, and Data roles. We add new role profiles as industry demand evolves.",
      },
      {
        id: 11,
        alt: "Progress Icon",
        Icon: Search,
        question: "Can I track my progress over time?",
        answer:
          "Yes — with an account you can track skill changes, re-run simulations, and compare historical reports to measure growth.",
      },
      {
        id: 12,
        alt: "Mentor Icon",
        Icon: TwoUsers,
        question: "Does DevPath offer mentorship or employer connections?",
        answer:
          "We provide mentorship matching and employer benchmarking features in premium tiers, helping learners connect with mentors and understand employer expectations.",
      },
    ],
  },

  // Accounts & Security
  {
    category: "Accounts & Reports",
    id: 4,
    questions: [
      {
        id: 13,
        alt: "Pricing Icon",
        Icon: DollarCircle,
        question: "Is DevPath free to use?",
        answer:
          "DevPath offers a free tier with basic simulator access. Premium plans unlock saved reports, mentorship features, and deeper analytics for job-readiness.",
      },
      {
        id: 14,
        alt: "Payment Icon",
        Icon: CardSlash,
        question: "Do you offer student discounts?",
        answer:
          "Yes — we provide discounted plans for students and educational institutions. Contact our team via the Community page for academic licensing options.",
      },
      {
        id: 15,
        alt: "Security Icon",
        Icon: Lock,
        question: "How is my data protected?",
        answer:
          "User data and uploaded artifacts are stored securely; we follow industry best practices and encryption. You control what is shared when exporting or connecting external accounts.",
      },
      {
        id: 16,
        alt: "Integrations Icon",
        Icon: Integrate,
        question: "Does DevPath integrate with learning platforms?",
        answer:
          "We are building integrations with GitHub, Coursera, and other learning platforms so project and course signals can automatically inform your career profile.",
      },
    ],
  },
];

// Tech Career Paths supported by DevPath
const careerPaths = [
  {
    id: 1,
    icon: "💻",
    title: "Software Development",
    description: "Build applications and systems using various programming languages and frameworks.",
    roles: ["Software Developer", "Web Developer", "Mobile App Developer", "Full-Stack Developer"],
    color: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/30"
  },
  {
    id: 2,
    icon: "📊",
    title: "Data & Analytics",
    description: "Extract insights from data using statistical analysis, machine learning, and visualization.",
    roles: ["Data Scientist", "Data Analyst", "Business Intelligence Analyst", "Data Engineer"],
    color: "from-purple-500/20 to-pink-500/20",
    border: "border-purple-500/30"
  },
  {
    id: 3,
    icon: "🔒",
    title: "Networking & Security",
    description: "Design, implement, and secure network infrastructure while protecting systems from cyber threats.",
    roles: ["Network Engineer", "Security Analyst", "Network Administrator", "Cybersecurity Specialist"],
    color: "from-red-500/20 to-rose-500/20",
    border: "border-red-500/30"
  },
  {
    id: 4,
    icon: "✅",
    title: "Quality Assurance & Testing",
    description: "Ensure software quality through systematic testing, automation, and quality control processes.",
    roles: ["QA Engineer", "Test Automation Engineer", "Software Tester", "Quality Analyst"],
    color: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/30"
  },
  {
    id: 5,
    icon: "📈",
    title: "IT Management",
    description: "Lead IT teams, manage projects, and align technology strategy with business objectives.",
    roles: ["IT Manager", "Project Manager", "Product Manager", "Technical Team Lead"],
    color: "from-orange-500/20 to-yellow-500/20",
    border: "border-orange-500/30"
  },
  {
    id: 6,
    icon: "🛠️",
    title: "Technical Support",
    description: "Provide technical assistance, troubleshoot issues, and ensure smooth IT operations.",
    roles: ["IT Support Specialist", "Help Desk Technician", "Technical Support Engineer", "System Support Analyst"],
    color: "from-cyan-500/20 to-blue-500/20",
    border: "border-cyan-500/30"
  },
  {
    id: 7,
    icon: "⚙️",
    title: "Specialized IT",
    description: "Focus on specialized technical domains including systems, databases, and infrastructure.",
    roles: ["System Administrator", "Database Administrator", "DevOps Engineer", "Cloud Solutions Architect"],
    color: "from-indigo-500/20 to-purple-500/20",
    border: "border-indigo-500/30"
  }
];

// Assessment areas covered by DevPath
const assessmentAreas = [
  {
    id: 1,
    icon: "📚",
    title: "Academic Knowledge",
    description: "9 core computer science subjects",
    topics: ["Operating Systems", "Algorithms", "Programming", "Software Engineering", "Computer Networks", "Electronics", "Computer Architecture", "Mathematics", "Communication"]
  },
  {
    id: 2,
    icon: "⚙️",
    title: "Technical Skills",
    description: "Hands-on technical proficiency",
    topics: ["Coding Skills", "Logical Quotient", "Problem Solving", "Memory & Retention"]
  },
  {
    id: 3,
    icon: "🧠",
    title: "Personal Traits",
    description: "Work style and preferences",
    topics: ["Career Interests", "Work Environment", "Team Collaboration", "Learning Style", "Communication Skills"]
  }
];


const footerCols = [
  {
    id: 1,
    category: "Product",
    links: [
      { text: "Features", href: "#about" },
      { text: "How It Works", href: "#how-it-works" },
      { text: "System Preview", href: "#system-preview" },
    ],
  },
  {
    id: 2,
    category: "Company",
    links: [
      { text: "About DevPath", href: "#about" },
      { text: "FAQs", href: "#faqs" },
      { text: "Contact Support", href: "#contact", isModal: true },
    ],
  },
  {
    id: 3,
    category: "Legal",
    links: [
      { text: "Privacy Policy", href: "#privacy", isModal: true },
      { text: "Terms of Service", href: "#terms", isModal: true },
      { text: "Cookie Policy", href: "#privacy", isModal: true },
    ],
  },
];

const socialLinks = [
  {
    id: 1,
    name: "Facebook",
    icon: "facebook",
    url: "https://facebook.com/devpath",
  },
  {
    id: 2,
    name: "Twitter",
    icon: "twitter",
    url: "https://twitter.com/devpath",
  },
  {
    id: 3,
    name: "LinkedIn",
    icon: "linkedin",
    url: "https://linkedin.com/company/devpath",
  },
  {
    id: 4,
    name: "GitHub",
    icon: "github",
    url: "https://github.com/devpath",
  },
];


const features = {
  SmartOrganization: {
    alt: "Smart Organization graphic",
    heading: "Smart Organization",
    description:
      "Automatically categorize and tag your notes using AI-driven analysis. \
      NoteFlow intelligently identifies key topics and organizes your content, \
      making it easy to find and retrieve your notes when you need them most.",
  },
  ContextualReminders: {
    alt: "Contextual Reminders graphic",
    heading: "Contextual Reminders",
    description:
      "Stay on top of important tasks with AI-powered reminders that adapt to the \
      context of your notes. NoteFlow recognizes deadlines, follow-ups, and key actions \
      from your notes and sends timely alerts to ensure nothing slips through the cracks.",
  },
};

export {
  navigationLinks,
  reviews,
  logos,
  frequentlyAskedQuestions,
  careerPaths,
  assessmentAreas,
  footerCols,
  socialLinks,
  features,
};
