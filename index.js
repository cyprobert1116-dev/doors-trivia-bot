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

// Auto-create or load
if (fs.existsSync(DATA_FILE)) {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    if (raw.trim().length > 0) data = JSON.parse(raw);
    else fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch {
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
