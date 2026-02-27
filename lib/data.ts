export const stories = [
  {
    id: 'creation',
    title: 'The Creation',
    reference: 'Genesis 1-2',
    description: 'God created the world in six days.',
    icon: 'Earth',
    color: 'bg-green-400',
    scenes: [
      { text: 'In the beginning, God created the heavens and the earth.', image: '🌌' },
      { text: 'God said, "Let there be light," and there was light.', image: '☀️' },
      { text: 'God created the sky, land, and seas.', image: '🌍' },
      { text: 'God made the sun, moon, and stars.', image: '⭐' },
      { text: 'God created the fish and the birds.', image: '🐟' },
      { text: 'God made the animals and the first people, Adam and Eve.', image: '🦁' },
      { text: 'On the seventh day, God rested.', image: '🛌' }
    ],
    memoryVerse: 'In the beginning God created the heavens and the earth. - Genesis 1:1'
  },
  {
    id: 'noah',
    title: "Noah's Ark",
    reference: 'Genesis 6-9',
    description: 'Noah builds a big boat to save his family and the animals.',
    icon: 'Ship',
    color: 'bg-sky-400',
    scenes: [
      { text: 'God told Noah to build a big boat called an ark.', image: '🔨' },
      { text: 'Noah brought his family and two of every animal onto the ark.', image: '🐘' },
      { text: 'It rained for 40 days and 40 nights.', image: '🌧️' },
      { text: 'The ark floated safely on the water.', image: '🚢' },
      { text: 'Noah sent out a dove, and it brought back an olive branch.', image: '🕊️' },
      { text: 'God put a rainbow in the sky as a promise.', image: '🌈' }
    ],
    memoryVerse: 'I have set my rainbow in the clouds, and it will be the sign of the covenant between me and the earth. - Genesis 9:13'
  },
  {
    id: 'david',
    title: 'David & Goliath',
    reference: '1 Samuel 17',
    description: "A young shepherd boy defeats a giant with God's help.",
    icon: 'Shield',
    color: 'bg-yellow-400',
    scenes: [
      { text: 'The Israelites were fighting the Philistines.', image: '⚔️' },
      { text: 'A giant named Goliath challenged them.', image: '👹' },
      { text: 'David, a young shepherd, trusted God to help him.', image: '👦' },
      { text: 'David took five smooth stones and a sling.', image: '🪨' },
      { text: 'David defeated Goliath with one stone.', image: '🎯' },
      { text: 'The Israelites won the battle!', image: '🎉' }
    ],
    memoryVerse: 'The Lord is my strength and my shield; my heart trusts in him, and he helps me. - Psalm 28:7'
  }
];

export const avatars = [
  { id: 'lion', emoji: '🦁', name: 'Lion' },
  { id: 'lamb', emoji: '🐑', name: 'Lamb' },
  { id: 'dove', emoji: '🕊️', name: 'Dove' },
  { id: 'rainbow', emoji: '🌈', name: 'Rainbow' }
];

export const dailyVerses = [
  "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go. - Joshua 1:9",
  "I can do all this through him who gives me strength. - Philippians 4:13",
  "Trust in the Lord with all your heart. - Proverbs 3:5",
  "Rejoice always, pray continually, give thanks in all circumstances. - 1 Thessalonians 5:16-18",
  "The Lord is my shepherd, I lack nothing. - Psalm 23:1"
];

export const quizLevels = [
  {
    id: 1,
    name: 'Level 1: The Basics',
    questions: [
      {
        question: "Who built the ark?",
        options: ["Moses", "David", "Noah", "Abraham"],
        answer: 2
      },
      {
        question: "What did David use to defeat Goliath?",
        options: ["A sword", "A sling and a stone", "A bow and arrow", "A spear"],
        answer: 1
      },
      {
        question: "How many days did God take to create the world?",
        options: ["3", "6", "7", "40"],
        answer: 1
      }
    ]
  },
  {
    id: 2,
    name: 'Level 2: Animals & Miracles',
    questions: [
      {
        question: "What animal brought an olive branch to Noah?",
        options: ["A raven", "A dove", "An eagle", "A sparrow"],
        answer: 1
      },
      {
        question: "Who was swallowed by a big fish?",
        options: ["Peter", "Jonah", "Paul", "John"],
        answer: 1
      },
      {
        question: "What sea did God part for Moses?",
        options: ["The Dead Sea", "The Red Sea", "The Mediterranean Sea", "The Sea of Galilee"],
        answer: 1
      }
    ]
  },
  {
    id: 3,
    name: 'Level 3: Heroes of Faith',
    questions: [
      {
        question: "Who was thrown into the lion's den?",
        options: ["Daniel", "Joseph", "David", "Samson"],
        answer: 0
      },
      {
        question: "Who had a coat of many colors?",
        options: ["Jacob", "Joseph", "Benjamin", "Isaac"],
        answer: 1
      },
      {
        question: "Who was the first man created?",
        options: ["Noah", "Abraham", "Adam", "Moses"],
        answer: 2
      }
    ]
  }
];

export type AdventureNode = {
  id: string;
  text: string;
  image: string;
  choices?: {
    text: string;
    nextNodeId: string;
  }[];
  isEnding?: boolean;
};

export const mosesAdventure: Record<string, AdventureNode> = {
  start: {
    id: 'start',
    text: "You are helping Moses lead the Israelites out of Egypt. You reach the edge of the Red Sea, but Pharaoh's army is chasing right behind you! What should you do?",
    image: "🌊",
    choices: [
      { text: "Trust God and raise Moses' staff", nextNodeId: "part_sea" },
      { text: "Try to build boats quickly", nextNodeId: "build_boats" }
    ]
  },
  build_boats: {
    id: 'build_boats',
    text: "Oh no! There isn't enough wood, and the army is getting too close. We need a miracle!",
    image: "🛶",
    choices: [
      { text: "Pray and ask God for help", nextNodeId: "part_sea" }
    ]
  },
  part_sea: {
    id: 'part_sea',
    text: "Whoosh! A strong wind blows, and God parts the Red Sea! There is a dry path right through the middle of the water. The people start walking.",
    image: "🚶",
    choices: [
      { text: "Hurry across the dry path", nextNodeId: "desert_start" },
      { text: "Stop to pick up seashells", nextNodeId: "seashells" }
    ]
  },
  seashells: {
    id: 'seashells',
    text: "The seashells are pretty, but the Egyptian army is still coming! We can't stop now.",
    image: "🐚",
    choices: [
      { text: "Drop the shells and hurry across", nextNodeId: "desert_start" }
    ]
  },
  desert_start: {
    id: 'desert_start',
    text: "Everyone makes it safely across! Moses lowers his staff, and the water returns, stopping the army. Now you are in the desert. The people are thirsty.",
    image: "🏜️",
    choices: [
      { text: "Complain about being thirsty", nextNodeId: "complain" },
      { text: "Ask God for water", nextNodeId: "water_rock" }
    ]
  },
  complain: {
    id: 'complain',
    text: "Complaining doesn't help. Moses reminds everyone that God will provide for them.",
    image: "😠",
    choices: [
      { text: "Apologize and ask God for water", nextNodeId: "water_rock" }
    ]
  },
  water_rock: {
    id: 'water_rock',
    text: "God tells Moses to strike a rock with his staff. Fresh, cool water gushes out for everyone to drink! You successfully led the people.",
    image: "🚰",
    isEnding: true
  }
};

export const noahAdventure: Record<string, AdventureNode> = {
  start: {
    id: 'start',
    text: "God has asked Noah to build a giant boat called an Ark because a big flood is coming. What should you do first?",
    image: "🌧️",
    choices: [
      { text: "Start gathering wood", nextNodeId: "build_ark" },
      { text: "Wait for it to rain", nextNodeId: "wait_rain" }
    ]
  },
  wait_rain: {
    id: 'wait_rain',
    text: "If you wait, the Ark won't be ready in time! God said to start now.",
    image: "⏳",
    choices: [
      { text: "Okay, let's start building!", nextNodeId: "build_ark" }
    ]
  },
  build_ark: {
    id: 'build_ark',
    text: "You and Noah work hard to build the Ark. It's huge! Now it's time to gather the animals. How should they come in?",
    image: "🔨",
    choices: [
      { text: "One by one", nextNodeId: "one_by_one" },
      { text: "Two by two", nextNodeId: "two_by_two" }
    ]
  },
  one_by_one: {
    id: 'one_by_one',
    text: "God commanded the animals to come in pairs (two by two) so they have a friend!",
    image: "🐘",
    choices: [
      { text: "Bring them in two by two", nextNodeId: "two_by_two" }
    ]
  },
  two_by_two: {
    id: 'two_by_two',
    text: "The animals march in two by two: lions, monkeys, elephants, and more! Then it starts raining. It rains for 40 days.",
    image: "🦁",
    choices: [
      { text: "Wait patiently inside", nextNodeId: "wait_inside" }
    ]
  },
  wait_inside: {
    id: 'wait_inside',
    text: "The rain finally stops! Noah wants to see if the land is dry. What bird should he send out?",
    image: "🚢",
    choices: [
      { text: "A dove", nextNodeId: "send_dove" },
      { text: "A penguin", nextNodeId: "send_penguin" }
    ]
  },
  send_penguin: {
    id: 'send_penguin',
    text: "Penguins love water, but they can't fly very far to find dry land!",
    image: "🐧",
    choices: [
      { text: "Send a dove instead", nextNodeId: "send_dove" }
    ]
  },
  send_dove: {
    id: 'send_dove',
    text: "The dove flies away and comes back with an olive leaf! The land is drying! God puts a beautiful rainbow in the sky as a promise.",
    image: "🌈",
    isEnding: true
  }
};

export const davidAdventure: Record<string, AdventureNode> = {
  start: {
    id: 'start',
    text: "You are with David, a young shepherd boy. A giant named Goliath is challenging the Israelite army, and everyone is scared. What should David do?",
    image: "👦",
    choices: [
      { text: "Run away and hide", nextNodeId: "run_away" },
      { text: "Trust God and volunteer to fight", nextNodeId: "volunteer" }
    ]
  },
  run_away: {
    id: 'run_away',
    text: "David knows God is with him. He doesn't need to be afraid!",
    image: "🏃",
    choices: [
      { text: "Go back and volunteer", nextNodeId: "volunteer" }
    ]
  },
  volunteer: {
    id: 'volunteer',
    text: "David tells King Saul he will fight Goliath. King Saul offers David his heavy armor. Should David wear it?",
    image: "👑",
    choices: [
      { text: "Yes, it will protect him", nextNodeId: "wear_armor" },
      { text: "No, it's too heavy", nextNodeId: "no_armor" }
    ]
  },
  wear_armor: {
    id: 'wear_armor',
    text: "The armor is way too big and heavy! David can barely walk.",
    image: "🛡️",
    choices: [
      { text: "Take off the armor", nextNodeId: "no_armor" }
    ]
  },
  no_armor: {
    id: 'no_armor',
    text: "David takes off the armor. He decides to use his own weapons. What does he pick up from the stream?",
    image: "💧",
    choices: [
      { text: "5 smooth stones", nextNodeId: "pick_stones" },
      { text: "A big stick", nextNodeId: "pick_stick" }
    ]
  },
  pick_stick: {
    id: 'pick_stick',
    text: "A stick won't reach the giant! David needs something he can throw with his sling.",
    image: "🪵",
    choices: [
      { text: "Pick up 5 smooth stones", nextNodeId: "pick_stones" }
    ]
  },
  pick_stones: {
    id: 'pick_stones',
    text: "David takes his sling and the stones. He runs toward Goliath, trusting completely in God. He swings his sling...",
    image: "🪨",
    choices: [
      { text: "Let the stone fly!", nextNodeId: "victory" }
    ]
  },
  victory: {
    id: 'victory',
    text: "The stone hits Goliath, and the giant falls down! David wins the battle because God was with him. You are a hero!",
    image: "🏆",
    isEnding: true
  }
};

export type AdventureLevel = {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  data: Record<string, AdventureNode>;
};

export const adventureLevels: AdventureLevel[] = [
  {
    id: 'noah',
    title: "Level 1: Noah's Ark",
    description: "Help Noah build the ark and gather the animals.",
    icon: "🚢",
    color: "bg-sky-400",
    data: noahAdventure
  },
  {
    id: 'moses',
    title: "Level 2: The Red Sea",
    description: "Lead the Israelites to safety across the sea.",
    icon: "🌊",
    color: "bg-orange-400",
    data: mosesAdventure
  },
  {
    id: 'david',
    title: "Level 3: David & Goliath",
    description: "Face the giant with faith and a sling.",
    icon: "🪨",
    color: "bg-yellow-400",
    data: davidAdventure
  }
];
