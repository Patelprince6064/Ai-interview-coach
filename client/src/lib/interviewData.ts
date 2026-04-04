export type QuestionType = 'behavioral' | 'technical' | 'situational';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  text: string;
  type: QuestionType;
  difficulty: Difficulty;
  hints: string[];
}

export interface Role {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  tags: string[];
  duration: number;
  questions: Question[];
}

export const ROLES: Role[] = [
  {
    id: 'swe', emoji: '💻', title: 'Software Engineer',
    desc: 'Frontend, backend, and full-stack engineering positions',
    tags: ['Technical', 'Behavioral'], duration: 45,
    questions: [
      { text: "Tell me about the most technically challenging project you've worked on. How did you approach it and what was the outcome?", type: 'behavioral', difficulty: 'medium', hints: ['Use the STAR method', 'Mention specific technologies', 'Quantify the impact'] },
      { text: "How do you handle technical debt in a fast-moving team with tight deadlines?", type: 'situational', difficulty: 'medium', hints: ['Balance velocity vs health', 'Give a concrete example', 'Mention prioritization'] },
      { text: "Describe a time you had to learn a new technology quickly. What was your approach?", type: 'behavioral', difficulty: 'easy', hints: ['Show curiosity', 'Mention resources used', 'Share the outcome'] },
      { text: "Walk me through how you approach code reviews — as both author and reviewer.", type: 'technical', difficulty: 'easy', hints: ['Cover what you look for', 'Mention collaboration tone', 'Give a real example'] },
      { text: "Tell me about a time you disagreed with a technical decision. How did you handle it?", type: 'behavioral', difficulty: 'hard', hints: ['Stay professional', 'Show you can advocate and adapt', 'Mention the outcome'] },
    ],
  },
  {
    id: 'pm', emoji: '🗺️', title: 'Product Manager',
    desc: 'Product strategy, roadmap, and cross-functional leadership',
    tags: ['Strategy', 'Leadership'], duration: 45,
    questions: [
      { text: "How do you prioritize features when you have more requests than your team has capacity?", type: 'situational', difficulty: 'medium', hints: ['Mention RICE/ICE/MoSCoW', 'Talk about stakeholder alignment', 'Show data-driven thinking'] },
      { text: "Tell me about a product you launched. What was the outcome and what would you do differently?", type: 'behavioral', difficulty: 'medium', hints: ['Mention success metrics', 'Be honest about learnings', 'Show ownership'] },
      { text: "How do you define success metrics for a brand-new feature with no historical data?", type: 'technical', difficulty: 'hard', hints: ['Connect to business goals', 'Leading vs lagging indicators', 'Talk about experimentation'] },
      { text: "Describe how you handle conflict between engineering, design, and business stakeholders.", type: 'situational', difficulty: 'hard', hints: ['Show empathy for all sides', 'Give a concrete example', 'Emphasize communication'] },
      { text: "Walk me through how you would improve our core product if you joined next week.", type: 'situational', difficulty: 'hard', hints: ['Show research', 'Start with user problems', 'Be specific but humble'] },
    ],
  },
  {
    id: 'ds', emoji: '📊', title: 'Data Scientist',
    desc: 'ML, statistics, data analysis, and model deployment',
    tags: ['Technical', 'Analytical'], duration: 45,
    questions: [
      { text: "Walk me through your full process for building and deploying a machine learning model from data to production.", type: 'technical', difficulty: 'hard', hints: ['Cover data, modeling, evaluation', 'Mention monitoring and retraining', 'Be specific about tools'] },
      { text: "How do you communicate complex statistical findings to non-technical stakeholders?", type: 'behavioral', difficulty: 'medium', hints: ['Use analogies and visuals', 'Focus on business impact', 'Give an example'] },
      { text: "Tell me about a time your model underperformed in production. What did you do?", type: 'behavioral', difficulty: 'hard', hints: ['Show debugging process', 'Mention monitoring', 'Describe the fix and learnings'] },
      { text: "How do you decide between a simple linear model and a complex neural network?", type: 'technical', difficulty: 'medium', hints: ['Discuss interpretability vs accuracy', 'Consider data size and compute', 'Give real trade-offs'] },
      { text: "Describe a data project where the results surprised you or challenged your assumptions.", type: 'behavioral', difficulty: 'medium', hints: ['Show intellectual honesty', 'Describe the pivot', 'Mention what you learned'] },
    ],
  },
  {
    id: 'ux', emoji: '🎨', title: 'UX Designer',
    desc: 'User research, interaction design, and prototyping',
    tags: ['Design', 'Research'], duration: 45,
    questions: [
      { text: "Walk me through your design process from initial research to final developer handoff.", type: 'behavioral', difficulty: 'medium', hints: ['Cover discovery, definition, ideation, testing', 'Mention tools: Figma, Miro', 'Show iteration'] },
      { text: "Tell me about a time you had to push back on a stakeholder's design request.", type: 'situational', difficulty: 'hard', hints: ['Stay user-centered', 'Use data from research', 'Show diplomacy'] },
      { text: "How do you balance aesthetics and usability when they seem to conflict?", type: 'situational', difficulty: 'medium', hints: ['Give a concrete trade-off example', 'Mention usability testing', 'Show hierarchy of priorities'] },
      { text: "Describe how you've used user research to significantly change the direction of a product.", type: 'behavioral', difficulty: 'hard', hints: ['Show research methods', 'Quantify the change', 'Mention stakeholder buy-in'] },
      { text: "How do you design for accessibility and what does that look like in practice?", type: 'technical', difficulty: 'medium', hints: ['Mention WCAG guidelines', 'Give specific examples', 'Talk about testing with real users'] },
    ],
  },
  {
    id: 'mkt', emoji: '📣', title: 'Marketing Manager',
    desc: 'Brand strategy, campaigns, and growth marketing',
    tags: ['Strategy', 'Creative'], duration: 45,
    questions: [
      { text: "Describe a marketing campaign you owned end-to-end. What were the results?", type: 'behavioral', difficulty: 'medium', hints: ['Lead with goal and strategy', 'Quantify results (CTR, conversions, ROI)', 'Mention learnings'] },
      { text: "How do you allocate a limited marketing budget across channels?", type: 'situational', difficulty: 'hard', hints: ['Show data-driven approach', 'Mention testing and optimization', 'Balance acquisition and retention'] },
      { text: "Tell me about a time a campaign underperformed. How did you respond?", type: 'behavioral', difficulty: 'medium', hints: ['Show accountability', 'Describe how you diagnosed the issue', 'Mention what changed'] },
      { text: "How do you measure brand awareness and its impact on business outcomes?", type: 'technical', difficulty: 'hard', hints: ['Qualitative + quantitative metrics', 'Attribution challenges', 'Give examples of proxies'] },
      { text: "Walk me through how you would launch a new product in a competitive market.", type: 'situational', difficulty: 'hard', hints: ['Start with positioning and ICP', 'Cover pre-launch and post-launch', 'Mention cross-functional alignment'] },
    ],
  },
  {
    id: 'sales', emoji: '💼', title: 'Sales Representative',
    desc: 'B2B/B2C sales, account management, and pipeline management',
    tags: ['Persuasion', 'Strategy'], duration: 45,
    questions: [
      { text: "Tell me about your most challenging sales deal. How did you close it?", type: 'behavioral', difficulty: 'hard', hints: ['Show persistence and creativity', 'Mention objection handling', 'Quantify the outcome'] },
      { text: "How do you qualify prospects early in the sales process?", type: 'technical', difficulty: 'medium', hints: ['Mention BANT, MEDDIC, or similar', 'Talk about discovery questions', 'Show focus on high-value leads'] },
      { text: "Describe how you handle a prospect who goes cold after initial interest.", type: 'situational', difficulty: 'medium', hints: ['Multi-channel follow-up', 'Add value not just pings', 'Give a real example'] },
      { text: "What's your approach to building long-term relationships with key accounts?", type: 'behavioral', difficulty: 'easy', hints: ['Proactive communication', 'Account mapping', 'Understand their business goals'] },
      { text: "Tell me about a time you lost a deal you expected to win. What did you learn?", type: 'behavioral', difficulty: 'hard', hints: ['Show self-awareness', 'Describe the post-mortem', 'Mention what changed in your process'] },
    ],
  },
];
