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

// Speech data organized by class
const speechesByClass: Record<number, Array<{ title: string; content: string }>> = {
  1: [
    {
      title: "Speech 1: My School",
      content: "Good morning teachers and my dear friends.\nMy school is very beautiful.\nMy teachers teach me good things.\nI love my school very much.\nThank you.",
    },
    {
      title: "Speech 2: My Mother",
      content: "Good morning everyone.\nMy mother loves me a lot.\nShe takes care of me every day.\nShe helps me study and play.\nI love my mother very much.\nThank you.",
    },
    {
      title: "Speech 3: My Favourite Animal",
      content: "Good morning teachers and friends.\nMy favourite animal is a dog.\nA dog is very friendly.\nIt guards our house.\nI like dogs very much.\nThank you.",
    },
    {
      title: "Speech 4: Save Trees",
      content: "Good morning everyone.\nTrees give us fresh air.\nTrees give us fruits and shade.\nWe should not cut trees.\nLet us plant more trees.\nThank you.",
    },
    {
      title: "Speech 5: My Best Friend",
      content: "Good morning teachers and my dear friends.\nMy best friend is very kind.\nWe play and study together.\nMy friend helps me every day.\nI love my best friend.\nThank you.",
    },
  ],
  2: [
    {
      title: "Speech 1: Cleanliness",
      content: "Good morning respected teachers and my dear friends.\nCleanliness is a good habit.\nWe should keep our home, school, and classroom clean.\nA clean place keeps us healthy and happy.\nWe should throw waste in the dustbin.\nCleanliness makes our country beautiful.\nThank you.",
    },
    {
      title: "Speech 2: Importance of Sharing",
      content: "Good morning everyone.\nSharing is a good habit.\nWe should share our food, toys, and books with others.\nSharing makes everyone feel happy.\nWhen we share, we make good friends.\nSharing shows love and kindness.\nThank you.",
    },
    {
      title: "Speech 3: Good Manners",
      content: "Good morning teachers and friends.\nGood manners make us good children.\nWe should say \"please\", \"sorry\", and \"thank you\".\nWe should respect our elders and teachers.\nGood manners help us make many friends.\nWe should practice good manners every day.\nThank you.",
    },
    {
      title: "Speech 4: Importance of Exercise",
      content: "Good morning everyone.\nExercise keeps our body healthy and strong.\nWe should play games and run every day.\nExercise makes us active and happy.\nIt helps us grow well and stay fit.\nWe should exercise daily.\nThank you.",
    },
    {
      title: "Speech 5: Love for Nature",
      content: "Good morning respected teachers and my dear friends.\nNature is very beautiful.\nIt gives us air, water, trees, and animals.\nWe should protect nature and keep it clean.\nWe should not harm plants and animals.\nLet us love and care for nature.\nThank you.",
    },
  ],
  3: [
    {
      title: "Speech 1: Importance of Time",
      content: "Good morning respected teachers and my dear friends.\nTime is very precious in our life.\nEvery minute is important and should be used wisely.\nWhen we follow a timetable, we can finish our work on time.\nGood use of time helps us become successful students.\nWe should never waste time and always be punctual.\nThank you.",
    },
    {
      title: "Speech 2: Helping Others",
      content: "Good morning everyone.\nHelping others is a noble habit.\nWhen we help people, we spread kindness and happiness.\nWe can help our parents at home and teachers at school.\nHelping others makes us feel proud and confident.\nA small help can make a big difference.\nThank you.",
    },
    {
      title: "Speech 3: Importance of Reading",
      content: "Good morning teachers and friends.\nReading is a very good habit for children.\nBooks give us knowledge and improve our imagination.\nReading daily helps us learn new words and ideas.\nIt also improves our speaking and writing skills.\nWe should read storybooks and textbooks every day.\nThank you.",
    },
    {
      title: "Speech 4: Safety Rules",
      content: "Good morning respected teachers and my dear friends.\nSafety rules help protect us from danger.\nWe should follow traffic rules while crossing the road.\nWe should not play with fire or sharp objects.\nSafety rules keep us safe at home, school, and outside.\nFollowing rules makes us responsible children.\nThank you.",
    },
    {
      title: "Speech 5: Importance of Honesty",
      content: "Good morning everyone.\nHonesty is a great virtue.\nAn honest person always speaks the truth.\nHonesty builds trust and good character.\nWe should be honest with our parents, teachers, and friends.\nHonesty makes us strong and respected.\nThank you.",
    },
  ],
  4: [
    {
      title: "Speech 1: Importance of Discipline",
      content: "Good morning respected teachers and my dear friends.\nDiscipline plays an important role in our daily life.\nIt teaches us to follow rules and manage our time properly.\nA disciplined student listens carefully in class and completes work on time.\nDiscipline helps us achieve our goals and become successful in life.\nWe should practice discipline at home, in school, and everywhere.\nThank you.",
    },
    {
      title: "Speech 2: Role of Teachers in Our Life",
      content: "Good morning everyone.\nTeachers are the builders of our future.\nThey guide us with knowledge, patience, and care.\nTeachers help us discover our talents and correct our mistakes.\nWithout teachers, learning would be incomplete.\nWe should always respect and be grateful to our teachers.\nThank you.",
    },
    {
      title: "Speech 3: Importance of Teamwork",
      content: "Good morning respected teachers and friends.\nTeamwork means working together to achieve a common goal.\nWhen we work as a team, we learn to share ideas and responsibilities.\nTeamwork teaches us cooperation, patience, and respect for others.\nIn games and group activities, teamwork helps us succeed.\nTogether, we can achieve more than working alone.\nThank you.",
    },
    {
      title: "Speech 4: Science in Everyday Life",
      content: "Good morning everyone.\nScience plays a major role in our everyday life.\nIt helps us understand the world around us.\nElectricity, machines, and communication are gifts of science.\nScience makes our life easier, faster, and more comfortable.\nWe should use science wisely for the good of humanity.\nThank you.",
    },
    {
      title: "Speech 5: Responsibility of Children",
      content: "Good morning respected teachers and my dear friends.\nChildren have many responsibilities at home and in school.\nWe should complete our homework on time and follow school rules.\nWe should help our parents and respect elders.\nBeing responsible makes us independent and trustworthy.\nLet us try to be responsible citizens of tomorrow.\nThank you.",
    },
  ],
  5: [
    {
      title: "Speech 1: Importance of Leadership",
      content: "Good morning respected teachers and my dear friends.\nLeadership is the quality of guiding, motivating, and inspiring others in the right direction.\nA good leader listens to others, respects different opinions, and makes fair decisions.\nLeadership is not about giving orders, but about taking responsibility and helping everyone succeed.\nStudents can show leadership by being disciplined, honest, and supportive of their classmates.\nTrue leadership helps build unity, confidence, and teamwork.\nWe should all try to develop leadership qualities in our daily life.\nThank you.",
    },
    {
      title: "Speech 2: Digital Technology in Education",
      content: "Good morning everyone.\nDigital technology has brought a great change in the field of education.\nSmart classrooms, online lessons, and educational apps make learning more interactive and interesting.\nTechnology allows students to learn at their own pace and explore new topics easily.\nHowever, excessive use of digital devices can affect our health and concentration.\nTherefore, we should use technology carefully and for positive learning purposes.\nWhen used wisely, technology becomes a powerful support for education.\nThank you.",
    },
    {
      title: "Speech 3: Importance of Environmental Conservation",
      content: "Good morning respected teachers and friends.\nEnvironmental conservation means protecting nature and using natural resources responsibly.\nPollution, deforestation, and climate change are serious threats to our planet.\nIf we harm nature, we also harm our own future.\nStudents can help by saving water, avoiding plastic, and planting trees.\nSmall actions taken every day can bring big changes in the long run.\nProtecting the environment is our shared responsibility.\nThank you.",
    },
    {
      title: "Speech 4: Value of Hard Work",
      content: "Good morning everyone.\nHard work is one of the most important qualities for success.\nIt teaches us discipline, patience, and the habit of never giving up.\nPeople who work hard learn from their failures and keep improving themselves.\nHard work is more important than luck or talent.\nWith determination and effort, even difficult goals can be achieved.\nTherefore, we should always believe in the power of hard work.\nThank you.",
    },
    {
      title: "Speech 5: Importance of Self-Confidence",
      content: "Good morning respected teachers and my dear friends.\nSelf-confidence means trusting our own abilities and strengths.\nIt helps us speak clearly, take decisions, and face challenges bravely.\nSelf-confidence grows when we practice regularly and learn from our mistakes.\nConfident students are not afraid to try new things and ask questions.\nBelieving in ourselves helps us overcome fear and achieve success.\nLet us build self-confidence and move forward with courage.\nThank you.",
    },
  ],
  6: [
    {
      title: "Speech 1: Importance of Critical Thinking",
      content: "Good morning respected teachers and my dear friends.\nCritical thinking is the ability to think carefully, logically, and independently.\nIt helps us understand situations clearly instead of believing everything we hear or read.\nA critical thinker asks questions, examines facts, and looks at problems from different angles.\nIn school, critical thinking helps us solve problems, understand lessons better, and make wise choices.\nThis skill also prepares us to face real-life challenges with confidence and clarity.\nBy practicing critical thinking every day, we become smarter and more responsible individuals.\nThank you.",
    },
    {
      title: "Speech 2: Role of Youth in Nation Building",
      content: "Good morning everyone.\nThe youth are the backbone of a nation and the builders of its future.\nYoung people have energy, creativity, and the power to bring positive change.\nThrough education, discipline, and hard work, students can help in the progress of the country.\nThe youth can serve the nation by being honest citizens and respecting laws and values.\nWhen young minds work with dedication and responsibility, the nation becomes strong and successful.\nLet us use our strength and knowledge to build a better and brighter future.\nThank you.",
    },
    {
      title: "Speech 3: Importance of Health and Hygiene",
      content: "Good morning respected teachers and friends.\nHealth is our greatest wealth and plays an important role in our life.\nGood health allows us to study well, play actively, and enjoy life happily.\nHygiene means keeping ourselves and our surroundings clean and safe.\nSimple habits like bathing daily, washing hands, and eating nutritious food keep us healthy.\nPoor hygiene can cause illness and weaken our body.\nBy maintaining health and hygiene, we can lead a long and active life.\nThank you.",
    },
    {
      title: "Speech 4: Power of Communication",
      content: "Good morning everyone.\nCommunication is the process of sharing thoughts, feelings, and ideas with others.\nGood communication helps us express ourselves clearly and confidently.\nListening patiently is an important part of effective communication.\nStrong communication skills help build friendships and solve problems peacefully.\nIn today's world, good communication is needed in studies, teamwork, and leadership.\nBy practicing respectful and clear communication, we can succeed in many areas of life.\nThank you.",
    },
    {
      title: "Speech 5: Importance of Equality",
      content: "Good morning respected teachers and my dear friends.\nEquality means giving everyone the same respect, rights, and opportunities.\nEvery person is special and deserves to be treated fairly.\nEquality helps remove discrimination and builds harmony in society.\nWhen people are treated equally, they feel confident and valued.\nAs students, we should support fairness and stand against injustice.\nEquality helps create a peaceful, united, and strong society.\nThank you.",
    },
  ],
  7: [
    {
      title: "Speech 1: Importance of Emotional Intelligence",
      content: "Good morning respected teachers and my dear friends.\nEmotional intelligence is the ability to understand, manage, and express our emotions in a healthy manner. It also helps us recognize the feelings of others and respond with empathy and sensitivity. In our daily life, we face situations that may cause stress, anger, or disappointment. Emotional intelligence allows us to stay calm and handle such situations wisely instead of reacting impulsively.\nFor students, emotional intelligence is especially important. It helps us cope with exam pressure, resolve conflicts with friends, and communicate effectively with teachers. A student who understands emotions can work better in teams and maintain positive relationships. Emotional intelligence also develops self-confidence, patience, and emotional balance.\nIn today's competitive world, success is not determined only by intelligence but also by emotional strength. By practicing self-awareness, empathy, and self-control, we can develop emotional intelligence and become responsible and confident individuals.\nThank you.",
    },
    {
      title: "Speech 2: Impact of Social Media on Students",
      content: "Good morning respected teachers and friends.\nSocial media has become an influential part of students' lives in the modern world. It allows us to stay connected with friends, share ideas, and access information quickly. Educational videos, online discussions, and digital platforms can support learning and creativity. When used correctly, social media can enhance knowledge and awareness.\nHowever, excessive use of social media can have negative effects on students. It often distracts us from studies and reduces our ability to concentrate for long periods. Spending too much time online may also affect mental health by creating stress, anxiety, or unrealistic comparisons. In addition, overuse of social media can reduce physical activity and face-to-face communication.\nTherefore, it is important for students to maintain a healthy balance between online and offline life. Social media should be used wisely, responsibly, and mainly for positive purposes. Self-discipline is the key to using technology effectively.\nThank you.",
    },
    {
      title: "Speech 3: Importance of Scientific Temper",
      content: "Good morning respected teachers and my dear friends.\nScientific temper refers to a way of thinking that encourages curiosity, logical reasoning, and a search for truth based on evidence. It teaches us to ask questions, observe carefully, and think critically rather than believing everything blindly. Scientific temper helps us understand natural phenomena and solve problems systematically.\nIn our daily life, scientific thinking helps us make informed decisions and avoid superstitions. It encourages innovation, creativity, and open-mindedness. Students who develop scientific temper learn to analyze situations and accept facts even when they challenge personal beliefs.\nIn a rapidly advancing world, scientific temper is essential for progress and development. It prepares students to face future challenges with confidence and intelligence. By reading, experimenting, observing, and questioning, we can strengthen our scientific thinking. Developing scientific temper makes us responsible, rational, and forward-thinking citizens.\nThank you.",
    },
    {
      title: "Speech 4: Value of Perseverance",
      content: "Good morning respected teachers and friends.\nPerseverance is the quality of continuing efforts despite difficulties, failures, and obstacles. It teaches us that success is not achieved instantly but through consistent hard work and determination. Many great leaders, scientists, and achievers faced failures before reaching their goals. Their perseverance helped them overcome challenges.\nFor students, perseverance is extremely important. Academic life involves challenges such as difficult subjects, exams, and competition. Instead of giving up, perseverance encourages us to learn from mistakes and improve ourselves. It builds patience, discipline, and mental strength.\nPerseverance also helps us develop confidence and resilience. When we continue trying despite setbacks, we become stronger and more capable. Success achieved through perseverance is long-lasting and meaningful. Therefore, we should practice perseverance in our studies and everyday life to achieve our dreams.\nThank you.",
    },
    {
      title: "Speech 5: Importance of Cultural Diversity",
      content: "Good morning respected teachers and my dear friends.\nCultural diversity refers to the existence of different cultures, traditions, languages, and beliefs within a society. It enriches our lives by exposing us to new ideas, customs, and perspectives. Cultural diversity teaches us respect, tolerance, and understanding towards others.\nIndia is a perfect example of cultural diversity, where people from different backgrounds live together peacefully. This diversity strengthens our nation and promotes unity. When we respect different cultures, we create harmony and mutual respect. Cultural diversity also helps students develop open-mindedness and global awareness.\nIn today's interconnected world, understanding and respecting diversity is essential. It helps us become responsible global citizens who value equality and cooperation. By celebrating cultural diversity, we promote peace and strengthen social bonds. Let us respect all cultures and learn from one another.\nThank you.",
    },
  ],
  8: [
    {
      title: "Speech 1: Importance of Ethical Values in Modern Society",
      content: "Good morning respected teachers and my dear friends.\nEthical values form the foundation of a strong and meaningful society. Values such as honesty, integrity, respect, and responsibility guide our actions and decisions. In today's fast-paced and competitive world, people often prioritize success over morality, which leads to dishonesty and injustice. Ethical values remind us that true success lies in doing what is right, even when no one is watching.\nFor students, ethical values play a crucial role in shaping character. They help us distinguish between right and wrong and encourage fair behavior in academics and personal life. Ethical conduct builds trust, strengthens relationships, and promotes harmony in society. Without ethics, progress loses its purpose and direction.\nAs future citizens, students must uphold ethical principles in every aspect of life. By practicing kindness, fairness, and responsibility, we contribute to a just and balanced society. Ethical values are not just lessons to be learned but habits to be practiced daily. They help create a world based on trust, peace, and mutual respect.\nThank you.",
    },
    {
      title: "Speech 2: Artificial Intelligence and Its Impact on the Future",
      content: "Good morning respected teachers and friends.\nArtificial Intelligence, commonly known as AI, is one of the most powerful technological advancements of the modern era. It enables machines to think, learn, and make decisions similar to humans. AI is already transforming fields such as healthcare, education, transportation, and communication. From virtual assistants to intelligent machines, its influence is growing rapidly.\nAI improves efficiency, accuracy, and productivity by reducing human effort and minimizing errors. In education, it supports personalized learning, while in medicine, it assists in early diagnosis and treatment. However, excessive dependence on AI raises concerns such as job displacement, data privacy, and ethical misuse.\nTherefore, it is essential to use artificial intelligence responsibly and thoughtfully. Humans must remain in control of technology rather than becoming dependent on it. AI should be viewed as a tool to support human intelligence, not replace it. With proper guidance and ethical use, artificial intelligence can contribute significantly to the progress and well-being of society.\nThank you.",
    },
    {
      title: "Speech 3: Importance of Mental Health Awareness",
      content: "Good morning respected teachers and my dear friends.\nMental health is as important as physical health, yet it is often ignored or misunderstood. Mental health refers to our emotional, psychological, and social well-being. It affects how we think, feel, and respond to situations in daily life. Stress, anxiety, and pressure from academics can negatively affect students if not addressed properly.\nMental health awareness helps people understand that seeking help is not a weakness but a sign of strength. When students are mentally healthy, they can concentrate better, make informed decisions, and maintain positive relationships. Ignoring mental health issues may lead to serious consequences such as depression and emotional imbalance.\nSchools and families must encourage open communication and emotional support. Practicing self-care, maintaining a balanced routine, and expressing emotions are essential steps towards mental well-being. By spreading awareness and removing stigma, we create a supportive and compassionate environment. Mental health awareness empowers individuals to lead healthier, happier, and more productive lives.\nThank you.",
    },
    {
      title: "Speech 4: Role of Education in Social Transformation",
      content: "Good morning respected teachers and friends.\nEducation is a powerful instrument of social transformation. It empowers individuals with knowledge, critical thinking, and awareness. Education not only improves personal growth but also contributes to the development of society. An educated society is more progressive, tolerant, and responsible.\nThrough education, people learn about equality, justice, and human rights. It helps eliminate social evils such as discrimination, poverty, and ignorance. Education encourages individuals to question unfair practices and work towards positive change. It also plays a significant role in economic development by creating skilled and responsible citizens.\nFor students, education builds confidence, creativity, and leadership skills. It prepares us to face challenges and contribute meaningfully to society. Education transforms individuals into informed citizens who can shape a better future. Therefore, education should be accessible to all, as it is the key to social progress and national development.\nThank you.",
    },
    {
      title: "Speech 5: Responsibility of Youth in Protecting Democracy",
      content: "Good morning respected teachers and my dear friends.\nDemocracy is a system of governance that depends on active and responsible citizens. The youth play a vital role in protecting and strengthening democracy. Young people possess energy, awareness, and the power to influence change. Their participation ensures that democratic values remain strong and meaningful.\nThe responsibility of youth includes staying informed, respecting the constitution, and participating in civic activities. Voting responsibly, expressing opinions peacefully, and respecting diversity are essential duties in a democracy. Youth must also stand against corruption, injustice, and discrimination.\nIn the digital age, young people have greater access to information and platforms to express their views. This power should be used wisely and ethically. By promoting unity, tolerance, and democratic values, youth can shape a fair and inclusive society. Protecting democracy is not only a right but also a responsibility of every young citizen.\nThank you.",
    },
  ],
  9: [
    {
      title: "Speech 1: Importance of Critical Media Literacy",
      content: "Good morning respected teachers and my dear friends.\nIn today's digital age, media plays a powerful role in shaping opinions and influencing decisions. Critical media literacy is the ability to analyze, evaluate, and interpret information presented through newspapers, television, and social media. Not everything we see or hear is accurate or unbiased, and accepting information blindly can lead to misinformation and misunderstanding.\nCritical media literacy encourages individuals to question sources, verify facts, and recognize hidden agendas. For students, this skill is essential, as young minds are highly influenced by online content. Developing media literacy helps us distinguish between facts and opinions and prevents the spread of false information.\nIn a democratic society, informed citizens make responsible decisions. Media literacy strengthens independent thinking and protects people from manipulation. By learning to think critically, students become more aware, responsible, and confident in expressing their views. In an era dominated by digital content, critical media literacy is not optional but necessary for intellectual growth and responsible citizenship.\nThank you.",
    },
    {
      title: "Speech 2: Climate Change and Human Responsibility",
      content: "Good morning respected teachers and friends.\nClimate change is one of the most serious challenges facing humanity today. Rising temperatures, melting glaciers, extreme weather conditions, and loss of biodiversity are clear signs of environmental imbalance. Human activities such as deforestation, excessive industrialization, and pollution are major contributors to climate change.\nClimate change does not affect only nature but also human life. It threatens food security, water availability, and public health. As responsible individuals, we must understand that protecting the environment is not just the duty of governments but of every citizen. Small actions like conserving energy, reducing waste, and using eco-friendly products can create a significant impact.\nStudents play a crucial role in spreading awareness and promoting sustainable practices. Education helps us understand environmental issues and develop solutions. By adopting responsible habits and encouraging others, we can help slow down climate change. Protecting the planet today ensures a safer and healthier future for generations to come.\nThank you.",
    },
    {
      title: "Speech 3: Importance of Moral Courage in Society",
      content: "Good morning respected teachers and my dear friends.\nMoral courage is the strength to stand up for what is right, even when it is difficult or unpopular. It involves speaking the truth, resisting injustice, and acting according to ethical principles despite fear or pressure. In society, moral courage is essential for maintaining justice and integrity.\nMany social problems exist because people remain silent instead of taking a stand. Moral courage encourages individuals to challenge discrimination, corruption, and unfair practices. It helps build a society based on honesty, equality, and respect. For students, moral courage begins with simple actions such as admitting mistakes, supporting others, and standing against bullying.\nDeveloping moral courage requires strong values, self-confidence, and empathy. It may not always bring immediate rewards, but it earns long-term respect and trust. A society where individuals act with moral courage becomes stronger and more united. Therefore, we must cultivate this quality to become responsible citizens and ethical leaders of tomorrow.\nThank you.",
    },
    {
      title: "Speech 4: Role of Education in Developing Global Citizenship",
      content: "Good morning respected teachers and friends.\nIn an increasingly interconnected world, education plays a vital role in developing global citizenship. Global citizenship refers to understanding global issues, respecting cultural diversity, and recognizing our shared responsibility towards humanity. Education broadens our perspective and helps us see beyond national boundaries.\nThrough education, students learn about global challenges such as poverty, inequality, climate change, and human rights. It encourages empathy, cooperation, and peaceful coexistence. An educated global citizen respects differences and works towards collective progress rather than personal gain.\nEducation also promotes critical thinking and ethical awareness, enabling students to evaluate global problems and contribute meaningful solutions. In a world influenced by technology and globalization, students must be prepared to collaborate with people from diverse backgrounds. Education equips us with the knowledge and values needed to build a peaceful and sustainable world. By becoming informed global citizens, we contribute to international understanding and shared human progress.\nThank you.",
    },
    {
      title: "Speech 5: Importance of Self-Discipline in Achieving Success",
      content: "Good morning respected teachers and my dear friends.\nSelf-discipline is the ability to control one's actions, emotions, and habits to achieve long-term goals. It is a key factor in personal growth and success. Talent and intelligence alone are not enough without discipline and consistency.\nFor students, self-discipline helps manage time effectively, maintain focus, and overcome distractions. It encourages regular study habits, healthy routines, and responsible behavior. Self-discipline also builds resilience, enabling individuals to stay committed even during challenging situations.\nIn life, disciplined individuals are more likely to achieve their goals because they remain determined and organized. Self-discipline teaches patience, perseverance, and self-control. By practicing discipline daily, students develop confidence and independence. Ultimately, self-discipline transforms dreams into achievable goals and plays a crucial role in long-term success.\nThank you.",
    },
  ],
  10: [
    {
      title: "Speech 1: Ethical Leadership in the Modern World",
      content: "Good morning respected teachers and my dear friends.\nEthical leadership is the cornerstone of a just, progressive, and sustainable society. True leadership is not defined by authority, position, or power, but by integrity, accountability, and moral responsibility. In the modern world, where rapid technological growth and intense competition often challenge ethical principles, the need for ethical leadership has become more urgent than ever.\nEthical leaders lead by example. They make fair and transparent decisions, respect diverse perspectives, and place collective welfare above personal benefit. Such leaders inspire trust and confidence among people. History has shown that societies flourish under leaders who uphold values such as honesty, compassion, and justice. In contrast, unethical leadership leads to corruption, inequality, and social unrest.\nFor students, ethical leadership begins with everyday actions—standing up against unfairness, respecting rules, accepting responsibility, and showing empathy towards others. These small habits gradually shape strong character and moral courage. Ethical leadership also encourages accountability and the willingness to admit mistakes, which are essential qualities of a responsible individual.\nIn a world facing global challenges such as climate change, social inequality, and political conflict, ethical leadership provides direction and hope. It promotes cooperation, peace, and sustainable development. Therefore, nurturing ethical leadership among young people is essential for building a future that is not only successful but also fair, humane, and inclusive.\nThank you.",
    },
    {
      title: "Speech 2: Artificial Intelligence: Progress or Threat?",
      content: "Good morning respected teachers and friends.\nArtificial Intelligence, or AI, is one of the most revolutionary technological advancements of the modern era. It has transformed industries such as healthcare, education, finance, and transportation by increasing efficiency, accuracy, and productivity. Intelligent systems now assist doctors in diagnosis, personalize education, and automate complex processes that once required human effort.\nHowever, alongside its benefits, artificial intelligence presents serious challenges and ethical concerns. Increased automation may result in job displacement, creating economic uncertainty. Issues related to data privacy, surveillance, and misuse of information have raised global concerns. When machines make decisions without sufficient human oversight, the risk of bias and inequality increases.\nThe debate surrounding artificial intelligence is not about rejecting technology but about managing it responsibly. AI should function as a supportive tool that enhances human intelligence rather than replacing it. Governments and institutions must establish ethical guidelines to ensure transparency, fairness, and accountability in AI development.\nFor students, understanding artificial intelligence is essential, as they are the future innovators and decision-makers. Developing technical knowledge along with ethical awareness will help them use technology wisely. If guided responsibly, artificial intelligence can become a powerful force for progress, innovation, and social well-being rather than a threat to humanity.\nThank you.",
    },
    {
      title: "Speech 3: Climate Crisis and the Need for Collective Action",
      content: "Good morning respected teachers and my dear friends.\nThe climate crisis is one of the most urgent and complex challenges facing humanity today. Rising global temperatures, extreme weather conditions, melting glaciers, and declining biodiversity clearly indicate environmental imbalance. These changes are largely caused by human activities such as deforestation, industrial pollution, and excessive exploitation of natural resources.\nThe effects of climate change extend beyond the environment. They threaten food security, water availability, public health, and economic stability. Vulnerable communities often suffer the most, highlighting the issue of climate injustice. Addressing this crisis requires collective action rather than individual effort alone. Governments, industries, and citizens must work together to reduce environmental damage.\nStudents play a crucial role in shaping a sustainable future. By spreading awareness, adopting eco-friendly habits, and supporting environmental initiatives, young people can drive meaningful change. Simple actions such as conserving energy, reducing waste, and choosing sustainable alternatives can create long-term impact.\nEducation empowers individuals to understand environmental challenges and seek innovative solutions. The climate crisis is not a distant problem but a present responsibility. By acting responsibly today, we can protect the planet and ensure a safe, healthy, and sustainable future for generations to come.\nThank you.",
    },
    {
      title: "Speech 4: Power of Education in Shaping Social Equality",
      content: "Good morning respected teachers and friends.\nEducation is one of the most powerful instruments for achieving social equality and justice. It empowers individuals with knowledge, skills, and awareness, enabling them to overcome barriers of poverty, discrimination, and ignorance. An educated society is more inclusive, progressive, and capable of meaningful development.\nEducation provides equal opportunities by allowing individuals to improve their socio-economic status and participate actively in society. It challenges stereotypes, encourages critical thinking, and promotes social awareness. Through education, people learn about their rights, responsibilities, and the importance of equality.\nFor students, education extends beyond academic learning. It instills values such as empathy, tolerance, respect, and responsibility. Quality education nurtures leadership, creativity, and innovation. It strengthens democracy by producing informed and responsible citizens who contribute positively to society.\nHowever, for education to truly promote equality, it must be accessible and inclusive. Every child, regardless of background, deserves quality education. When education reaches all sections of society, it bridges social gaps and promotes harmony. Thus, education remains a vital force in shaping a fair, just, and equitable world.\nThank you.",
    },
    {
      title: "Speech 5: Importance of Mental Resilience in a Competitive World",
      content: "Good morning respected teachers and my dear friends.\nIn today's highly competitive and fast-paced world, mental resilience has become an essential quality for success and well-being. Mental resilience refers to the ability to adapt, recover, and grow stronger in the face of stress, failure, and uncertainty. It allows individuals to remain focused and hopeful even during difficult situations.\nStudents often face academic pressure, societal expectations, and constant comparison. Without mental resilience, these challenges can lead to anxiety, low self-esteem, and emotional exhaustion. Resilient individuals view setbacks as learning opportunities rather than failures. They develop the strength to persevere despite obstacles.\nMental resilience is built through self-discipline, emotional awareness, and a positive mindset. Maintaining balance between studies, rest, and recreation is equally important. Seeking support from family, teachers, or friends strengthens emotional stability.\nResilience does not mean avoiding difficulties but facing them with courage and determination. In the long run, mental resilience builds confidence, independence, and emotional strength. By nurturing resilience, students prepare themselves not only for academic success but also for life's uncertainties. Mental resilience is the foundation of long-term achievement and personal growth.\nThank you.",
    },
  ],
  11: [
    {
      title: "Speech 1: The Relevance of Moral Philosophy in Contemporary Society",
      content: "Good morning respected teachers and my dear friends.\nIn an era dominated by rapid technological advancement and material success, moral philosophy continues to hold immense relevance. Moral philosophy helps individuals reflect on concepts such as right and wrong, justice, responsibility, and human dignity. It provides a framework for ethical decision-making in both personal and public life.\nModern society faces complex moral dilemmas, including corruption, social inequality, misuse of technology, and environmental degradation. These issues cannot be addressed through laws and regulations alone. Moral philosophy encourages individuals to think deeply, evaluate consequences, and act with integrity. It reminds us that progress without ethics can lead to destruction rather than development.\nFor students, moral philosophy plays a crucial role in character formation. It helps young minds develop empathy, self-awareness, and moral courage. By understanding ethical theories and moral values, students learn to question unjust practices and stand up for truth even in difficult situations. Moral reasoning strengthens independent thinking and prevents blind conformity.\nIn leadership, governance, and professional life, ethical decision-making is essential for long-term trust and stability. Societies that prioritize moral values promote peace, cooperation, and mutual respect. Moral philosophy does not provide fixed answers but equips individuals with the ability to think ethically and responsibly.\nIn conclusion, moral philosophy remains a guiding force in navigating the complexities of modern life. By nurturing ethical thinking, students can contribute to building a society that values humanity, justice, and moral responsibility over mere success.\nThank you.",
    },
    {
      title: "Speech 2: Artificial Intelligence and the Future of Human Employment",
      content: "Good morning respected teachers and friends.\nArtificial Intelligence has revolutionized the modern world by automating tasks and enhancing efficiency across various industries. While AI has brought remarkable progress, it has also raised serious concerns regarding the future of human employment. Machines capable of learning and decision-making are gradually replacing traditional jobs, particularly in manufacturing and data-based sectors.\nThe fear of unemployment due to automation is a genuine concern. Many routine and repetitive jobs are being replaced by intelligent systems, leading to workforce displacement. However, history shows that technological advancement also creates new opportunities. AI demands skilled professionals in fields such as programming, data analysis, ethics, and system management.\nThe real challenge lies in adaptation. Education systems must evolve to equip students with critical thinking, creativity, and problem-solving skills—qualities that machines cannot easily replicate. Human intelligence, emotional understanding, and ethical judgment remain irreplaceable. Instead of competing with machines, humans must learn to collaborate with technology.\nFor students, this shift highlights the importance of continuous learning and adaptability. Embracing innovation while maintaining ethical responsibility is essential. Governments and institutions must also ensure fair transitions by providing skill development and employment support.\nIn conclusion, artificial intelligence is not the end of human employment but a transformation of it. With proper planning, education, and ethical governance, AI can enhance human potential rather than diminish it.\nThank you.",
    },
    {
      title: "Speech 3: Freedom of Expression in a Democratic Society",
      content: "Good morning respected teachers and my dear friends.\nFreedom of expression is one of the fundamental pillars of a democratic society. It allows individuals to express ideas, opinions, and beliefs without fear of oppression. This freedom encourages dialogue, debate, and intellectual growth, which are essential for social progress.\nIn a democracy, freedom of expression ensures accountability and transparency. It enables citizens to question authority, expose injustice, and participate actively in public discourse. Without this freedom, democracy becomes hollow and authoritarian. However, freedom of expression must be exercised responsibly, as misuse can lead to misinformation, hatred, and social division.\nIn the digital age, social media has amplified voices but also increased the spread of false narratives. Therefore, critical thinking and ethical responsibility are crucial. Expression should promote understanding, not conflict. Respect for diverse perspectives strengthens democratic values and social harmony.\nFor students, freedom of expression nurtures confidence, creativity, and independent thought. Educational institutions should encourage respectful debate and open discussion. This prepares young people to become informed citizens who value both rights and responsibilities.\nIn conclusion, freedom of expression is not merely a right but a responsibility. When exercised with integrity and respect, it strengthens democracy and fosters a culture of dialogue, tolerance, and progress.\nThank you.",
    },
    {
      title: "Speech 4: The Philosophy of Sustainable Development",
      content: "Good morning respected teachers and friends.\nSustainable development is a philosophy that seeks to balance economic growth, environmental protection, and social well-being. It emphasizes meeting present needs without compromising the ability of future generations to meet their own needs. In a world facing climate change, resource depletion, and inequality, sustainable development has become a necessity rather than a choice.\nEconomic progress without environmental responsibility leads to irreversible damage. Deforestation, pollution, and excessive consumption threaten ecological balance. Sustainable development encourages responsible resource management and renewable alternatives. It also promotes social equity by ensuring fair access to opportunities and resources.\nEducation plays a crucial role in promoting sustainability. Students must be made aware of environmental ethics, conservation practices, and responsible citizenship. Sustainable development is not limited to policies but requires individual commitment and collective action.\nBy adopting sustainable practices, societies can achieve long-term stability and resilience. Sustainable development represents a shift in mindset—from exploitation to preservation. As future leaders, students must embrace this philosophy to ensure a balanced and harmonious future for humanity.\nThank you.",
    },
    {
      title: "Speech 5: The Role of Critical Thinking in Higher Education",
      content: "Good morning respected teachers and my dear friends.\nCritical thinking is one of the most valuable skills developed through higher education. It involves analyzing information objectively, questioning assumptions, and forming reasoned conclusions. In an age of information overload, critical thinking helps distinguish facts from opinions and truth from misinformation.\nHigher education should not focus solely on memorization but on developing intellectual independence. Critical thinking encourages students to evaluate multiple perspectives and engage in meaningful discussions. It enhances problem-solving abilities and prepares individuals for complex real-world challenges.\nFor students, critical thinking fosters creativity, confidence, and adaptability. It empowers them to make informed decisions and contribute innovatively to society. In professional life, employers value individuals who can think analytically and respond thoughtfully to challenges.\nIn conclusion, critical thinking is essential for academic excellence and responsible citizenship. By cultivating this skill, education transforms learners into thinkers and innovators. Critical thinking is not merely an academic tool but a lifelong asset in an ever-changing world.\nThank you.",
    },
  ],
  12: [
    {
      title: "Speech 1: The Ethical Implications of Technological Advancement",
      content: "Good morning respected teachers, esteemed judges, and my dear friends.\nTechnological advancement has undeniably transformed human civilization, redefining the way we communicate, learn, work, and govern. From artificial intelligence and genetic engineering to data-driven governance, technology has enhanced efficiency and expanded human capability. However, alongside these remarkable benefits arise profound ethical implications that demand careful reflection and responsible action.\nOne of the most significant ethical concerns surrounding technology is the question of accountability. When machines make decisions—whether in medical diagnoses, judicial predictions, or financial systems—determining responsibility becomes complex. Issues such as data privacy, surveillance, algorithmic bias, and misuse of personal information challenge fundamental human rights. Technology, if left unchecked, risks prioritizing efficiency over empathy and profit over people.\nEthical dilemmas also arise when innovation outpaces moral reasoning. Scientific capability does not automatically justify moral legitimacy. The ability to do something does not always mean it should be done. Ethical frameworks are essential to ensure that technological progress aligns with human values such as dignity, fairness, and justice.\nFor students, understanding the ethical dimension of technology is crucial. As future innovators, policymakers, and leaders, young minds must balance ambition with responsibility. Ethical awareness fosters critical thinking, compassion, and long-term vision. It encourages innovation that serves humanity rather than exploits it.\nIn conclusion, technology is neither inherently good nor evil; it is a reflection of human intent. Ethical reasoning must guide technological advancement to ensure inclusive, humane, and sustainable progress. A future shaped by ethical technology will not only be advanced but also just and equitable.\nThank you.",
    },
    {
      title: "Speech 2: Democracy in the Age of Polarization and Misinformation",
      content: "Good morning respected teachers and friends.\nDemocracy thrives on informed participation, rational discourse, and mutual respect. However, in the contemporary world, democracy faces unprecedented challenges due to political polarization, misinformation, and digital manipulation. The rapid spread of information through social media has amplified voices but has also distorted truth.\nMisinformation erodes public trust and weakens democratic institutions. When citizens base opinions on false narratives, democracy becomes vulnerable to manipulation. Polarization further deepens divisions, reducing dialogue to hostility and disagreement to intolerance. Instead of collective problem-solving, societies risk descending into ideological extremism.\nDemocracy demands not only rights but also responsibilities. Freedom of expression must be balanced with factual accuracy and ethical communication. Critical thinking is essential to evaluate sources, question narratives, and resist emotional manipulation. Without an informed and vigilant citizenry, democratic systems lose credibility and effectiveness.\nStudents play a vital role in preserving democratic values. Education equips young people with analytical skills, civic awareness, and ethical judgment. By engaging in respectful debate and responsible digital behavior, students can counter misinformation and promote democratic resilience.\nIn conclusion, democracy in the modern age requires conscious effort. It must be protected through education, ethical media consumption, and civic responsibility. Democracy is not merely a system of governance; it is a collective commitment to truth, justice, and inclusive dialogue.\nThank you.",
    },
    {
      title: "Speech 3: Existential Anxiety and the Modern Human Condition",
      content: "Good morning respected teachers and my dear friends.\nDespite unprecedented technological progress and material comfort, modern humanity faces a growing sense of existential anxiety. Existential anxiety refers to the deep uncertainty about purpose, identity, and meaning in life. In a fast-paced world driven by competition, productivity, and comparison, individuals often struggle to find inner fulfillment.\nThe modern lifestyle emphasizes external achievement while neglecting internal well-being. Constant exposure to social expectations and digital validation intensifies feelings of inadequacy and isolation. Many individuals question their relevance, direction, and authenticity in a world that values speed over reflection.\nPhilosophers have long argued that meaning is not discovered but created. Existential thought encourages individuals to accept responsibility for their choices and shape their own purpose. This perspective empowers individuals to find meaning through values, relationships, creativity, and contribution to society.\nFor students, addressing existential anxiety requires self-awareness and balance. Education should not only prepare individuals for careers but also for thoughtful living. Reflection, emotional resilience, and ethical clarity help individuals navigate uncertainty with confidence.\nIn conclusion, existential anxiety is not a weakness but an invitation to introspection. By confronting uncertainty with courage and purpose, individuals can transform anxiety into self-discovery and growth. A meaningful life is built not by external validation but by conscious choices and inner integrity.\nThank you.",
    },
    {
      title: "Speech 4: Education as a Catalyst for Global Justice",
      content: "Good morning respected teachers and friends.\nEducation has long been recognized as a powerful catalyst for social transformation. Beyond economic development, education plays a crucial role in promoting global justice by fostering equality, awareness, and ethical responsibility. In a world marked by inequality, conflict, and injustice, education serves as a unifying force.\nGlobal justice demands equitable access to resources, opportunities, and rights. Education empowers marginalized communities by providing knowledge and critical awareness. It challenges systemic oppression and equips individuals to question injustice. An educated population is more likely to advocate for fairness, inclusivity, and human rights.\nEducation also promotes intercultural understanding and global citizenship. By learning about diverse cultures, histories, and perspectives, students develop empathy and respect. This awareness reduces prejudice and fosters international cooperation. Education thus becomes a bridge between societies rather than a divider.\nFor students, education is both a privilege and a responsibility. Knowledge must be used ethically to uplift others and address global challenges such as poverty, inequality, and environmental degradation. Education transforms passive learners into active contributors to justice.\nIn conclusion, education is not merely a means of personal advancement but a moral force capable of shaping a fairer world. By nurturing informed, ethical, and compassionate individuals, education lays the foundation for global justice and sustainable peace.\nThank you.",
    },
    {
      title: "Speech 5: The Philosophy of Human Resilience in an Uncertain World",
      content: "Good morning respected teachers and my dear friends.\nHuman resilience is the capacity to endure, adapt, and grow in the face of adversity. In an increasingly uncertain world marked by global crises, economic instability, and social change, resilience has become an essential human virtue. It is not merely the ability to survive hardship but to transform challenges into opportunities for growth.\nResilience is deeply rooted in mindset and perspective. While external circumstances may be uncontrollable, the internal response determines outcomes. Philosophers and psychologists alike emphasize that resilience emerges from meaning, self-awareness, and emotional strength. Individuals who find purpose in adversity develop the ability to persevere without losing hope.\nFor students, resilience is particularly important. Academic pressure, societal expectations, and future uncertainty often create stress and self-doubt. Resilient students view failure as feedback rather than defeat. They cultivate adaptability, patience, and determination—qualities that extend far beyond academic success.\nResilience is also collective. Communities that support one another recover faster from crises. Compassion, cooperation, and shared responsibility strengthen social resilience. In this sense, resilience is both personal and social.\nIn conclusion, resilience is not the absence of struggle but the mastery of response. In an uncertain world, resilience equips individuals with courage, adaptability, and purpose. By cultivating resilience, humanity can navigate uncertainty with dignity and hope, transforming adversity into a pathway for progress.\nThank you.",
    },
  ],
};

export const generateClassesData = (): ClassData[] => {
  const classes: ClassData[] = [];

  for (let i = 1; i <= 12; i++) {
    const speeches = speechesByClass[i] || [];
    const chapters = speeches.map((speech, index) => {
      // Split content into pages for longer speeches (3+ paragraphs)
      const paragraphs = speech.content.split("\n\n");
      let pages: string[];
      
      if (paragraphs.length >= 3) {
        // For longer speeches, split into multiple pages
        const midPoint = Math.ceil(paragraphs.length / 2);
        pages = [
          paragraphs.slice(0, midPoint).join("\n\n"),
          paragraphs.slice(midPoint).join("\n\n"),
        ];
      } else {
        // For shorter speeches, single page
        pages = [speech.content];
      }

      return {
        id: `ch${index + 1}`,
        title: speech.title,
        content: speech.content,
        pages,
        color: chapterColors[index % chapterColors.length],
        emoji: chapterEmojis[index % chapterEmojis.length],
      };
    });

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