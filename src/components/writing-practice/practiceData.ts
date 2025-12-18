export interface PracticeTile {
  id: string;
  title: string;
  description: string;
  question: string;
  questionTitle: string;
}

export const beginnerPractices: PracticeTile[] = [
  {
    id: "about-me",
    title: "About Me",
    description: "Introduce yourself and share your story",
    questionTitle: "About Me",
    question: `Write a short paragraph about yourself. Include:
- Your name and age
- Where you live
- Your hobbies and interests
- Something special about you

Try to write at least 50 words.`,
  },
  {
    id: "my-family",
    title: "My Family",
    description: "Describe your family members",
    questionTitle: "My Family",
    question: `Write about your family. Include:
- Who is in your family?
- What do they like to do?
- What makes your family special?

Write at least 50 words.`,
  },
  {
    id: "my-favorite-place",
    title: "My Favorite Place",
    description: "Describe a place you love",
    questionTitle: "My Favorite Place",
    question: `Write about your favorite place. It could be:
- Your bedroom
- A park
- A vacation spot
- Anywhere special to you

Describe what it looks like and why you like it. Write at least 50 words.`,
  },
  {
    id: "my-dream-day",
    title: "My Dream Day",
    description: "Describe your perfect day",
    questionTitle: "My Dream Day",
    question: `Imagine your perfect day! Write about:
- What would you do?
- Who would you spend it with?
- Where would you go?
- What would make it special?

Write at least 50 words.`,
  },
];

export const intermediatePractices: PracticeTile[] = [
  {
    id: "adventure-story",
    title: "Adventure Story",
    description: "Write an exciting adventure",
    questionTitle: "Adventure Story",
    question: `Write a short adventure story (150-200 words) about:
- A character who goes on an unexpected journey
- Challenges they face
- How they overcome obstacles
- What they learn

Make your story exciting and interesting!`,
  },
  {
    id: "favorite-hobby",
    title: "My Favorite Hobby",
    description: "Explain why you love your hobby",
    questionTitle: "My Favorite Hobby",
    question: `Write about your favorite hobby (150-200 words). Include:
- What the hobby is
- How you started doing it
- Why you enjoy it
- What skills you've learned
- How it makes you feel

Use descriptive language to explain your passion.`,
  },
  {
    id: "special-memory",
    title: "A Special Memory",
    description: "Share an important memory",
    questionTitle: "A Special Memory",
    question: `Write about a special memory (150-200 words). Describe:
- When and where it happened
- Who was with you
- What happened in detail
- Why it's important to you
- How it made you feel

Use past tense and descriptive details.`,
  },
  {
    id: "future-plans",
    title: "My Future Plans",
    description: "Describe your goals and dreams",
    questionTitle: "My Future Plans",
    question: `Write about your plans for the future (150-200 words). Include:
- What you want to do
- Where you want to go
- What you want to learn
- How you plan to achieve your goals

Use future tense and explain your reasons.`,
  },
];

export const advancedPractices: PracticeTile[] = [
  {
    id: "opinion-essay",
    title: "Opinion Essay",
    description: "Express your views on a topic",
    questionTitle: "Opinion Essay: Technology in Education",
    question: `Write an opinion essay (250-300 words) on the topic:

"Do you think technology improves education, or does it create problems for students?"

Your essay should include:
- An introduction stating your opinion
- 2-3 main paragraphs with supporting arguments
- Examples to support your points
- A conclusion that summarizes your position

Use formal language and linking words (however, moreover, therefore, etc.).`,
  },
  {
    id: "descriptive-essay",
    title: "Descriptive Essay",
    description: "Paint a picture with words",
    questionTitle: "Descriptive Essay: A Person Who Influenced You",
    question: `Write a descriptive essay (250-300 words) about a person who has influenced your life. Include:

- Physical description
- Personality traits
- Specific actions or behaviors
- How they influenced you
- The lasting impact they've had

Use vivid adjectives, sensory details, and specific examples. Organize your essay logically.`,
  },
  {
    id: "argumentative-essay",
    title: "Argumentative Essay",
    description: "Build a strong argument",
    questionTitle: "Argumentative Essay: School Uniforms",
    question: `Write an argumentative essay (250-300 words) on:

"Should all schools require students to wear uniforms?"

Your essay should:
- State your position clearly in the introduction
- Provide at least 3 supporting arguments
- Address and refute opposing viewpoints
- Use evidence and logical reasoning
- End with a strong conclusion

Maintain a formal, objective tone throughout.`,
  },
  {
    id: "problem-solution",
    title: "Problem-Solution Essay",
    description: "Analyze problems and propose solutions",
    questionTitle: "Problem-Solution Essay: Environmental Protection",
    question: `Write a problem-solution essay (250-300 words) about:

"What can young people do to help protect the environment?"

Your essay should:
- Identify environmental problems
- Explain why they are important
- Propose practical solutions
- Explain how these solutions can be implemented
- Discuss the benefits of taking action

Use formal language and connect your ideas with appropriate transitions.`,
  },
];

