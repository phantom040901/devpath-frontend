// RIASEC category definitions for academic assessment questions
// Based on Holland's RIASEC theory of career interests

export const RIASEC_CATEGORIES = {
  R: {
    code: "R",
    name: "Realistic",
    description: "Practical, hands-on problem solving",
    bgClass: "bg-red-500/20",
    textClass: "text-red-400",
    borderClass: "border-red-500/30",
    solidBg: "bg-red-500"
  },
  I: {
    code: "I",
    name: "Investigative",
    description: "Analytical thinking and research",
    bgClass: "bg-blue-500/20",
    textClass: "text-blue-400",
    borderClass: "border-blue-500/30",
    solidBg: "bg-blue-500"
  },
  A: {
    code: "A",
    name: "Artistic",
    description: "Creative and innovative thinking",
    bgClass: "bg-purple-500/20",
    textClass: "text-purple-400",
    borderClass: "border-purple-500/30",
    solidBg: "bg-purple-500"
  },
  S: {
    code: "S",
    name: "Social",
    description: "Helping and working with others",
    bgClass: "bg-yellow-500/20",
    textClass: "text-yellow-400",
    borderClass: "border-yellow-500/30",
    solidBg: "bg-yellow-500"
  },
  E: {
    code: "E",
    name: "Enterprising",
    description: "Leadership and persuasion",
    bgClass: "bg-orange-500/20",
    textClass: "text-orange-400",
    borderClass: "border-orange-500/30",
    solidBg: "bg-orange-500"
  },
  C: {
    code: "C",
    name: "Conventional",
    description: "Organizing and following procedures",
    bgClass: "bg-green-500/20",
    textClass: "text-green-400",
    borderClass: "border-green-500/30",
    solidBg: "bg-green-500"
  }
};

export const RIASEC_CODES = ["R", "I", "A", "S", "E", "C"];

/**
 * Calculate RIASEC distribution from an array of questions
 * @param {Array} questions - Array of question objects with riasecCategories field
 * @returns {Object} Distribution counts for each RIASEC code
 */
export function calculateRiasecDistribution(questions) {
  const distribution = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

  if (!questions || !Array.isArray(questions)) {
    return distribution;
  }

  questions.forEach(q => {
    const categories = q.riasecCategories || [];
    categories.forEach(code => {
      if (distribution.hasOwnProperty(code)) {
        distribution[code]++;
      }
    });
  });

  return distribution;
}

/**
 * Get total RIASEC tags count from distribution
 * @param {Object} distribution - RIASEC distribution object
 * @returns {number} Total count
 */
export function getTotalRiasecCount(distribution) {
  return Object.values(distribution).reduce((sum, count) => sum + count, 0);
}

/**
 * Keywords that indicate each RIASEC category
 * Used for dynamic question analysis
 */
export const RIASEC_KEYWORDS = {
  R: [
    "implement", "build", "create", "code", "debug", "fix", "install", "configure",
    "setup", "deploy", "execute", "run", "compile", "hardware", "circuit", "wire",
    "physical", "hands-on", "practical", "tool", "machine", "device", "output",
    "input", "gate", "led", "transistor", "voltage", "current", "binary",
    "server", "network", "system", "architecture", "infrastructure", "cdn",
    "latency", "bandwidth", "cache", "load balancer", "distributed", "cluster",
    "container", "docker", "kubernetes", "cloud", "aws", "azure", "api"
  ],
  I: [
    "analyze", "why", "explain", "compare", "evaluate", "research", "investigate",
    "study", "examine", "complexity", "algorithm", "optimize", "theory", "concept",
    "principle", "understand", "logic", "reason", "calculate", "solve", "proof",
    "hypothesis", "data", "pattern", "time complexity", "space complexity", "big o",
    "approach", "best", "most appropriate", "which", "what is", "how does",
    "trade-off", "performance", "efficiency", "scalability", "security"
  ],
  A: [
    "creative", "innovative", "ui design", "ux design", "user interface", "user experience",
    "visual", "aesthetic", "style", "layout", "color", "graphic", "artistic",
    "imagination", "unique", "original", "prototype", "mockup", "wireframe",
    "animation", "illustration", "branding", "typography"
  ],
  S: [
    "team", "communicate", "collaborate", "present", "discuss", "help", "support",
    "mentor", "teach", "train", "feedback", "listen", "empathy", "interpersonal",
    "customer service", "client meeting", "stakeholder", "conflict", "resolution",
    "teamwork", "cooperation", "relationship", "coaching"
  ],
  E: [
    "manage", "lead", "decide", "strategy", "business", "project", "plan",
    "organize", "delegate", "negotiate", "persuade", "influence", "goal",
    "objective", "budget", "resource", "deadline", "priority", "stakeholder",
    "scale", "growth", "startup", "entrepreneur", "revenue", "profit", "market"
  ],
  C: [
    "organize", "process", "standard", "procedure", "systematic", "document",
    "record", "file", "database", "structure", "format", "template", "compliance",
    "policy", "rule", "regulation", "order", "sequence", "step", "methodology",
    "sdlc", "agile", "scrum", "waterfall", "version control", "documentation"
  ]
};

/**
 * Subject to RIASEC base mapping (used as fallback)
 */
export const SUBJECT_RIASEC_MAPPING = {
  "algorithms": ["I"],
  "data_structures": ["I"],
  "operating_systems": ["R", "I"],
  "programming": ["R"],
  "software_dev": ["R"],
  "software_engineering": ["C"],
  "computer_networks": ["R", "I"],
  "networks": ["R", "I"],
  "communication": ["S"],
  "mathematics": ["I"],
  "math": ["I"],
  "logic": ["I"],
  "electronics": ["R"],
  "digital_logic": ["R"],
  "computer_architecture": ["R", "I"],
  "architecture": ["R", "I"]
};

/**
 * Analyze question text and return matching RIASEC categories
 * @param {string} questionText - The question text to analyze
 * @returns {Array} Array of RIASEC codes based on keyword matches
 */
export function analyzeQuestionForRiasec(questionText) {
  if (!questionText) return [];

  const text = questionText.toLowerCase();
  const matches = [];

  for (const [code, keywords] of Object.entries(RIASEC_KEYWORDS)) {
    const matchCount = keywords.filter(keyword => text.includes(keyword)).length;
    if (matchCount > 0) {
      matches.push({ code, count: matchCount });
    }
  }

  // Sort by match count and take top matches
  matches.sort((a, b) => b.count - a.count);

  // Return codes with matches, max 3
  const result = matches.slice(0, 3).map(m => m.code);

  return result;
}

/**
 * Get default RIASEC categories based on assessment ID or title
 * Used when no question text is available (new question)
 * @param {string} assessmentId - The assessment ID
 * @param {string} title - The assessment title
 * @returns {Array} Array of RIASEC codes
 */
export function getDefaultRiasecForAssessment(assessmentId, title) {
  const key = (assessmentId || title || "").toLowerCase().replace(/[_\s-]+/g, "_");

  for (const [subject, riasec] of Object.entries(SUBJECT_RIASEC_MAPPING)) {
    if (key.includes(subject)) {
      return riasec;
    }
  }

  return ["I"]; // Default to Investigative for academic assessments
}

/**
 * Smart RIASEC assignment - analyzes question text first, falls back to subject default
 * @param {string} questionText - The question text
 * @param {string} assessmentId - The assessment ID
 * @param {string} title - The assessment title
 * @returns {Array} Array of RIASEC codes
 */
export function getSmartRiasecForQuestion(questionText, assessmentId, title) {
  // First try to analyze the question text
  const textBasedRiasec = analyzeQuestionForRiasec(questionText);

  if (textBasedRiasec.length > 0) {
    return textBasedRiasec;
  }

  // Fall back to subject-based default
  return getDefaultRiasecForAssessment(assessmentId, title);
}
