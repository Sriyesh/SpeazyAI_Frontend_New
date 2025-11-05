import { ClassData } from "./types";

const gradients = [
  "linear-gradient(135deg, #34d399, #10b981)",
  "linear-gradient(135deg, #3b82f6, #2563eb)",
  "linear-gradient(135deg, #a855f7, #7e22ce)",
  "linear-gradient(135deg, #f97316, #ea580c)",
  "linear-gradient(135deg, #facc15, #eab308)",
  "linear-gradient(135deg, #ec4899, #db2777)",
  "linear-gradient(135deg, #14b8a6, #0d9488)",
  "linear-gradient(135deg, #8b5cf6, #6d28d9)",
  "linear-gradient(135deg, #ef4444, #dc2626)",
  "linear-gradient(135deg, #0ea5e9, #0284c7)",
  "linear-gradient(135deg, #22c55e, #16a34a)",
  "linear-gradient(135deg, #6366f1, #4338ca)",
];

const chapterColors = [
  "#FFF9C4", // Pastel Yellow
  "#B3E5FC", // Light Blue
  "#C8E6C9", // Mint Green
  "#E1BEE7", // Lavender
  "#FFCCBC", // Peach
  "#F8BBD0", // Pink
  "#FFE0B2", // Light Orange
  "#B2DFDB", // Teal
  "#D1C4E9", // Light Purple
  "#DCEDC8", // Light Green
  "#FFE082", // Gold
  "#BCAAA4", // Taupe
  "#CFD8DC", // Blue Gray
  "#FFF59D", // Lemon
  "#A5D6A7", // Sage
  "#CE93D8", // Orchid
  "#80CBC4", // Aqua
  "#FFAB91", // Coral
  "#F48FB1", // Rose
  "#81C784", // Grass
];

const chapterEmojis = [
  "📚",
  "✨",
  "🎨",
  "🌟",
  "🎯",
  "💡",
  "🚀",
  "🌈",
  "⭐",
  "🎪",
  "🎭",
  "🎨",
  "🎯",
  "💫",
  "🌺",
  "🎵",
  "🎪",
  "🌸",
  "🎨",
  "🎯",
];

const chapterTitles = {
  1: ["My Family", "Fun at School", "Animals I Love", "Colors and Shapes"],
  2: [
    "The Magic Garden",
    "My Best Friend",
    "Days of the Week",
    "Favorite Foods",
    "Seasons Change",
    "Bedtime Stories",
  ],
  3: [
    "Adventure Stories",
    "Ocean Wonders",
    "Space Journey",
    "Dinosaur World",
    "Fairy Tales",
    "Nature Walks",
    "Weather Patterns",
    "Community Helpers",
  ],
  4: [
    "The Lost Treasure",
    "Friendship Tales",
    "Historical Heroes",
    "Science Experiments",
    "World Geography",
    "Music and Art",
    "Sports Adventures",
    "Cultural Festivals",
    "Environmental Care",
    "Technology Today",
  ],
  5: [
    "Ancient Civilizations",
    "Mathematical Puzzles",
    "Literary Classics",
    "Scientific Discoveries",
    "Global Cultures",
    "Creative Writing",
    "Engineering Marvels",
    "Artistic Movements",
    "Economic Principles",
    "Health and Wellness",
    "Digital Literacy",
    "Critical Thinking",
  ],
};

const simpleContent = [
  "My family is very special to me. I have a mom, dad, and a little sister. We love to play games together. Every Sunday, we go to the park.",
  "I love going to school every day. My teacher is very kind and funny. I have many friends in my class. We learn new things and play together.",
  "Animals are amazing creatures! I like cats because they are soft and cuddly. Dogs are friendly and love to play. Birds can fly high in the sky.",
  "Colors make the world beautiful. Red is the color of apples and roses. The sky is blue and the grass is green. Shapes are everywhere we look!",
];

const moderateContent = [
  "The garden behind my grandmother's house is like a magical kingdom. Colorful flowers bloom in every corner, and butterflies dance from petal to petal. Big trees provide cool shade on hot summer days. I help grandma water the plants every morning. We also grow vegetables like tomatoes and carrots. Sometimes we find ladybugs and friendly caterpillars. The garden smells sweet and fresh, especially after it rains.",
  "My best friend Emma lives next door to my house. We go to the same school and sit together in class. Every day after homework, we meet at the playground. We love to swing high and slide down the big yellow slide. On weekends, we have sleepovers and tell funny stories. Emma shares her toys with me, and I share mine with her. Having a best friend makes every day more fun and special.",
];

const advancedContent = [
  "Throughout human history, ancient civilizations have shaped the world we live in today. The Egyptians built magnificent pyramids that still stand after thousands of years, demonstrating their advanced understanding of mathematics and engineering. The Romans developed sophisticated systems of government and law that influence modern democracy. In Asia, Chinese dynasties made groundbreaking inventions like paper, printing, and gunpowder. The Mayan civilization created accurate calendars and built impressive cities in the jungles of Central America. By studying these ancient cultures, we learn valuable lessons about innovation, organization, and the resilience of human societies. Each civilization faced unique challenges based on their geography and resources, yet they all found creative solutions that allowed them to thrive. Understanding our shared past helps us appreciate the diverse contributions of different cultures and reminds us that progress builds upon the achievements of those who came before us.",
  "Scientific discoveries have revolutionized the way we understand and interact with the world. When Isaac Newton observed an apple falling from a tree, it led to his groundbreaking theory of gravity, which explains how objects attract each other and how planets orbit the sun. Marie Curie's research on radioactivity opened new frontiers in medicine and energy production, though she paid a high price for her dedication to science. The discovery of DNA's structure by Watson and Crick revealed the blueprint of life itself, enabling advances in medicine and genetics. More recently, scientists have explored quantum mechanics, which describes the strange behavior of particles at the atomic level and has led to technologies like computers and lasers. Each discovery builds upon previous knowledge, demonstrating that science is a collaborative effort spanning generations and cultures. These breakthroughs remind us that curiosity, careful observation, and rigorous testing are essential tools for understanding the mysteries of our universe.",
];

export const generateClassesData = (): ClassData[] => {
  const classes: ClassData[] = [];

  for (let i = 1; i <= 12; i++) {
    const chapterCount =
      i === 1 ? 4 : i === 2 ? 6 : i === 3 ? 8 : Math.min(10 + (i - 4) * 2, 20);
    const chapters = [];

    for (let j = 0; j < chapterCount; j++) {
      let content: string;
      let pages: string[];

      if (i <= 3) {
        content =
          chapterTitles[i as keyof typeof chapterTitles]?.[j]
            ? simpleContent[j % simpleContent.length]
            : simpleContent[0];
        pages = [content];
      } else if (i <= 6) {
        content = moderateContent[j % moderateContent.length];
        pages = [content];
      } else {
        content = advancedContent[j % advancedContent.length];
        const sentences = content.split(". ");
        const midPoint = Math.ceil(sentences.length / 2);
        pages = [
          sentences.slice(0, midPoint).join(". ") + ".",
          sentences.slice(midPoint).join(". "),
        ];
      }

      const title =
        i <= 5
          ? chapterTitles[i as keyof typeof chapterTitles]?.[j] ||
            `Chapter ${j + 1}`
          : `Chapter ${j + 1}: ${["Introduction", "Development", "Analysis", "Application", "Synthesis", "Evaluation", "Reflection", "Integration", "Innovation", "Mastery"][j % 10]}`;

      chapters.push({
        id: `ch${j + 1}`,
        title,
        content,
        pages,
        color: chapterColors[j % chapterColors.length],
        emoji: chapterEmojis[j % chapterEmojis.length],
      });
    }

    classes.push({
      id: `class-${i}`,
      title: `Class ${i}`,
      description:
        i <= 3
          ? `Fun learning for young minds`
          : i <= 6
            ? `Building strong foundations`
            : i <= 9
              ? `Advanced skill development`
              : `Mastering complex concepts`,
      ageGroup: `${4 + i}-${5 + i} years`,
      gradient: gradients[i - 1],
      chapters,
    });
  }

  return classes;
};
