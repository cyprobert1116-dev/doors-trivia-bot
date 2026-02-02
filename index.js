if (process.env.RENDER_INSTANCE_ID !== "0") {
  console.log("Not primary instance, exiting.");
  process.exit(0);
}
global.BOT_RUNNING = true;

const { Client, GatewayIntentBits } = require("discord.js");
const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

/* =======================
   PUT YOUR TOKEN HERE
======================= */
client.login(process.env.TOKEN);

/* =======================
   LOAD / SAVE DATA (AUTO-CREATE)
======================= */
const DATA_FILE = "./data.json";

let data = {
  credits: {},
  correctHistory: {},
  totalCorrect: {}
};

if (fs.existsSync(DATA_FILE)) {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    if (raw.trim().length > 0) {
      data = JSON.parse(raw);
    }
  } catch (err) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  }
} else {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}
} else {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Save helper
function saveData() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

/* =======================
   QUESTIONS
======================= */
const questions = [
  {
    question: "What is the entity most featured in chase scenes?",
    answer: "seek"
  },
  {
    question: "How much gold does the skeleton key cost in Jeff's shop?",
    answer: "300"
  },
  {
    question: "What is the first badge you earn?",
    answer: "welcome"
  },
  {
    question: "what object does the groundskeeper wield?",
    answer: "scythe"
  },
  {
    question: "How many knobs do basic shakelight skins cost?",
    answer: "799"
  },
  {
    question: "which bundle has the most skins included?",
    answer: "tower heroes"
  },
  {
    question: "what subfloor was the first?",
    answer: "rooms"
  },
  {
    question: "What is the third floor type besides floors and subfloors?",
    answer: "visions"
  },
  {
    question: "Whoever smelt it...",
    answer: "dealt it"
  },
  {
    question: "what badge gives you the tower heroes skin, the fractured skeleton key?",
    answer: "300"
  },
  {
    question: "how many points do you need in 1 battle mode round for the high roller badge?",
    answer: "5000"
  },
  {
    question: "what is the badge name for crucifying ambush?",
    answer: "unbound"
  },
  {
    question: "you will earn the D'oh! badge for eating a...",
    answer: "donut"
  },
  {
    question: "what event was the backdoor made for?",
    answer: "the hunt"
  },
  {
    question: "who is the creator of the game?",
    answer: "lsplash"
  },
  {
    question: "how many presents do you need to collect in a solo run of cringle's workshop?",
    answer: "12"
  },
  {
    question: "what are the entities in houses of the halloween event called?",
    answer: "treaters"
  },
  {
    question: "you finally turn...",
    answer: "green"
  },
  {
    question: "name the exact name of the red glitched ambushed spawned by a glitch fragment",
    answer: "ar0xmbush"
  },
  {
    question: "what is the entity-related doors code that has been working for years?",
    answer: "screechsucks"
  },
  {
    question: "how much stardust do subfloors usually cost to enter?",
    answer: "10"
  },
  {
    question: "what badge you you now earn when entering the rooms for the first time?",
    answer: "roomy"
  },
  {
    question: "what was sally once known as?",
    answer: "window"
  },
  {
    question: "a rock and a...",
    answer: "hard place"
  },
  {
    question: "what is the badge name for crucifying a-120?",
    answer: "grin reaper"
  },
  {
    question: "what is the first entity you can die to in SUPER HARD MODE!!!?",
    answer: "evil key"
  },
  {
    question: "the winning theme for the daily runs is also the theme of the doors collab with...",
    answer: "untitled tag game"
  },
  {
    question: "the modifier to return doors to release version is...",
    answer: "hotel-"
  },
  {
    question: "whats the largest amount of stadust you can buy at once with robux?",
    answer: "350"
  },
  {
    question: "how many robux does 16,000 knobs cost you?",
    answer: "1799"
  },
  {
    question: "what is the quote said in the description of the retro screech lighter skin?",
    answer: "hey man"
  },
  {
    question: "the daily shop rotation usually holds _ skins at a time",
    answer: "8"
  },
  {
    question: "the description of color camo recolors of skins is...",
    answer: "practically visible"
  },
  {
    question: "the winner of the first skin contest besides the job application crucifix was the _____ crucifix",
    answer: "moonlight dagger"
  },
  {
    question: "the _____ will be here in 600 seconds. run.",
    answer: "drakobloxxers"
  },
  {
    question: "what item turns you green?",
    answer: "gween soda"
  },
  {
    question: "how many items will louie drop after being crucified?",
    answer: "4"
  },
  {
    question: "how many chromas do kitty bundle item skins have?",
    answer: "9"
  },
  {
    question: "the first battle mode exclusive item to get item skins was the...",
    answer: "golden blaster"
  },
  {
    question: "what modifier makes giggles immune to light?",
    answer: "dripped out"
  },
  {
    question: "what does grampy usually refer to the player as?",
    answer: "hoss"
  },
  {
    question: "what does grampy refer to sally as?",
    answer: "princess"
  },
  {
    question: "?",
    answer: "300"
  },
  {
    question: "what ambush modifier was removed after being buggy for a long time?",
    answer: "again and again and again"
  },
  {
    question: "?",
    answer: "300"
  },
  {
    question: "what seek modifier was removed for making the game easier rather than harder?",
    answer: "you really can run"
  },
  {
    question: "what modifier makes you slower once you have lower health?",
    answer: "injuries"
  },
  {
    question: "what is the first entity to remove max health?",
    answer: "sally"
  },
  {
    question: "what is rush's intelligence level?",
    answer: "low"
  },
  {
    question: "How much damage exactly does rush actually do?",
    answer: "125"
  },
  {
    question: "How much damage does a-90 do?",
    answer: "90"
  },
  {
    question: "timothy's bite can be fatal when the _____ modifier is active",
    answer: "itchy"
  },
  {
    question: "what vegetable-y entity will the groundskeeper assist you with killing?",
    answer: "mandrake"
  },
  {
    question: "does curious light suck?",
    answer: "yes"
  },
  {
    question: "the leaves of the trees that warn you before the eyestalk chase are what color?",
    answer: "orange"
  },
  {
    question: "the backdoor's keys are the color...",
    answer: "yellow"
  },
  {
    question: "a painting of a crescent moon can be found in the outdoors with the title...",
    answer: "her"
  },
  {
    question: "the groundskeeper often resides in an...",
    answer: "outhouse"
  },
  {
    question: "what main body part was groundskeeper missing when he was teased years ago?",
    answer: "legs"
  },
  {
    question: "how many petals are needed to create a lotus flower?",
    answer: "8"
  },
  {
    question: "what does cringle make all of his presents out of?",
    answer: "coal"
  },
  {
    question: "the first buddy to be added was the...",
    answer: "pupkin"
  },
  {
    question: "what color does the sinister G chroma make your item skin?",
    answer: "gold"
  },
  {
    question: "How much gold does the crucifix cost in Jeff's shop?",
    answer: "500"
  },
  {
    question: "what entity can you see grampy preparing as food?",
    answer: "monument"
  },
  {
    question: "How much gold does the bulklight cost in Jeff's shop?",
    answer: "300"
  },
  {
    question: "How much gold does the bandage pack cost in Jeff's shop?",
    answer: "100"
  },
  {
    question: "How much gold do the shears cost in Jeff's shop?",
    answer: "300"
  },
  {
    question: "How much gold does the multitool cost in Jeff's shop?",
    answer: "500"
  },
  {
    question: "How much gold does the skeleton key cost in Jeff's shop?",
    answer: "300"
  },
  {
    question: "el goblino will become worried if you show him a...",
    answer: "crucifix"
  },
  {
    question: "how many vials of starlight can you hold at once?",
    answer: "5"
  },
  {
    question: "what is the largest amount of smoothies you can hold?",
    answer: "6"
  },
  {
    question: "what badge do you earn by sticking a lockpick into a generator?",
    answer: "improvise"
  },
  {
    question: "How many knobs does the bulklight cost in the mines pre-run shop?",
    answer: "150"
  },
  {
    question: "How many knobs do 2 lockpicks cost in the mines pre-run shop?",
    answer: "300"
  },
  {
    question: "How many knobs does the bandage pack cost in the mines pre-run shop?",
    answer: "100"
  },
  {
    question: "How many knobs does the straplight cost in the mines pre-run shop?",
    answer: "100"
  },
  {
    question: "How much gold does the skeleton key cost in Jeff's shop?",
    answer: "300"
  },
  {
    question: "How much gold does the skeleton key cost in Jeff's shop?",
    answer: "300"
  },
  {
    question: "How much gold does the skeleton key cost in Jeff's shop?",
    answer: "300"
  },
  {
    question: "How much gold does the skeleton key cost in Jeff's shop?",
    answer: "300"
  },
  {
    question: "How much gold does the skeleton key cost in Jeff's shop?",
    answer: "300"
  },
  {
    question: "How much gold does the skeleton key cost in Jeff's shop?",
    answer: "300"
  },
  {
    question: "How much gold does the skeleton key cost in Jeff's shop?",
    answer: "300"
  },
  {
    question: "How much gold does the skeleton key cost in Jeff's shop?",
    answer: "300"
  },
  {
    question: "How much gold does the skeleton key cost in Jeff's shop?",
    answer: "300"
  },
  {
    question: "How much gold does the skeleton key cost in Jeff's shop?",
    answer: "300"
  }
];

/* =======================
   HELPERS
======================= */
function getRandomQuestion() {
  return questions[Math.floor(Math.random() * questions.length)];
}

function cleanHistory(userId) {
  const now = Date.now();
  if (!data.correctHistory[userId]) data.correctHistory[userId] = [];
  data.correctHistory[userId] = data.correctHistory[userId].filter(
    t => now - t < 24 * 60 * 60 * 1000
  );
}

/* =======================
   RECENT ACTIVITY TRACKER
======================= */
const recentActivity = {}; // channelId -> { userId: timestamp }
const ACTIVITY_WINDOW = 30 * 1000; // 30 seconds

function playersAttempting(channel) {
  const now = Date.now();
  const channelActivity = recentActivity[channel.id] || {};
  let count = 0;
  for (const userId in channelActivity) {
    if (now - channelActivity[userId] <= ACTIVITY_WINDOW) count++;
  }
  return count;
}

/* =======================
   TRIVIA LOOP
======================= */
let triviaRunning = false;

async function askQuestion(channel) {
  const q = getRandomQuestion();
  await channel.send(`🧠 **Trivia Question:** ${q.question}`);

  const filter = msg =>
    msg.content.toLowerCase() === q.answer.toLowerCase();

  try {
    const collected = await channel.awaitMessages({
      filter,
      max: 1,
      time: 15000
    });

    const winner = collected.first().author;
    const userId = winner.id;

    if (!data.credits[userId]) data.credits[userId] = 0;
    if (!data.totalCorrect[userId]) data.totalCorrect[userId] = 0;

    cleanHistory(userId);

    const answeredToday = data.correctHistory[userId].length;
    const players = playersAttempting(channel);

    // ====== REWARD LOGIC ======
    let earned = 0;

    if (answeredToday < 40) { // new daily limit
      if (players <= 1) earned = 25;     // solo
      else if (players === 2) earned = 40; // duo
      else if (players === 3) earned = 55; // trio
      else earned = 75;                    // 4+ active users
    } else {
      earned = 10; // flat after limit reached
    }

    data.credits[userId] += earned;
    data.correctHistory[userId].push(Date.now());
    data.totalCorrect[userId] += 1;

    saveData();

    if (earned === 10) {
      await channel.send(
        `✅ **${winner.username} got it right!**  
🚫 Daily limit reached (40 questions) — only earned 10 credits.
💳 +10 credits (Total: ${data.credits[userId]})`
      );
    } else {
      await channel.send(
        `✅ **${winner.username} got it right!**  
💳 +${earned} credits (Total: ${data.credits[userId]})`
      );
    }

    askQuestion(channel);

  } catch {
    triviaRunning = false;
    channel.send("⏰ No one answered in time. Trivia stopped.");
  }
}

/* =======================
   EVENTS
======================= */
client.once("ready", () => {
  console.log(`${client.user.tag} is online!`);
});

client.on("messageCreate", async message => {
  if (message.author.bot) return;

  // Record recent activity for scaling
  if (!recentActivity[message.channel.id]) recentActivity[message.channel.id] = {};
  recentActivity[message.channel.id][message.author.id] = Date.now();

  // ====== START TRIVIA ======
  if (message.content === "!trivia") {
    if (triviaRunning) {
      message.reply("Trivia is already running!");
      return;
    }
    triviaRunning = true;
    message.channel.send("🎮 Trivia started!");
    askQuestion(message.channel);
  }

  // ====== CHECK CREDITS ======
  if (message.content === "!credits") {
    const userId = message.author.id;
    if (!data.credits[userId]) data.credits[userId] = 0;

    message.reply(
      `💳 **You have ${data.credits[userId]} credits.**  
✨ Wyst will give you 10,000 stardust (store currency) for every **10,000 stardust** you earn.`
    );
  }

  // ====== LEADERBOARD ======
  if (message.content === "!trivialb") {
    const sorted = Object.entries(data.totalCorrect)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    if (sorted.length === 0) {
      message.reply("No trivia data yet.");
      return;
    }

    let text = "🏆 **Trivia Leaderboard**\n";
    for (let i = 0; i < sorted.length; i++) {
      const user = await client.users.fetch(sorted[i][0]);
      text += `${i + 1}. **${user.username}** — ${sorted[i][1]} correct\n`;
    }
    message.channel.send(text);
  }
});
