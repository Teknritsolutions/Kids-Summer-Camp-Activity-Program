window.Campora = {};
Campora.seed = {
  profile: {
    name: "Alex Morgan",
    email: "alex@example.com",
    phone: "555-0100",
  },
  camp: { name: "Campora", email: "hello@example.com", notifications: true },
  children: [
    { id: "c1", name: "Jamie Morgan", age: 9, interests: "Arts, Nature" },
    { id: "c2", name: "Rowan Morgan", age: 11, interests: "Swimming, Coding" },
    { id: "c3", name: "Quinn Morgan", age: 14, interests: "Coding, Nature" },
  ],
  programs: [
    {
      id: "sports",
      name: "All-Star Sports Club",
      category: "Sports",
      ageMin: 7,
      ageMax: 12,
      price: 245,
      duration: "Full day",
      capacity: 20,
      image: "sports.webp",
      description:
        "Team up, try something new, and discover the joy of moving. Friendly games build coordination, confidence, and a wonderful sense of belonging.",
      mentor: "Jordan Ellis",
      area: "Meadow field",
      outcomes: [
        "Practice ball skills and coordination",
        "Learn fair play and teamwork",
        "Try soccer, relay races, and field games",
      ],
    },
    {
      id: "arts",
      name: "Little Makers Studio",
      category: "Arts",
      ageMin: 4,
      ageMax: 12,
      price: 185,
      duration: "Half day",
      capacity: 16,
      image: "arts.webp",
      description:
        "Big ideas begin with little hands. Explore painting, clay, printmaking, and playful design in a studio where every creation tells a story.",
      mentor: "Riley Chen",
      area: "Creative studio",
      outcomes: [
        "Experiment with color and texture",
        "Make an original clay sculpture",
        "Share creative ideas with friends",
      ],
    },
    {
      id: "coding",
      name: "Robots & Bright Ideas",
      category: "Coding",
      ageMin: 10,
      ageMax: 16,
      price: 245,
      duration: "Full day",
      capacity: 12,
      image: "coding.webp",
      description:
        "Turn curiosity into clever creations. Build a simple robot, explore beginner coding, and solve hands-on challenges with a supportive mentor.",
      mentor: "Taylor Brooks",
      area: "Discovery lab",
      outcomes: [
        "Understand simple coding sequences",
        "Build and test a moving robot",
        "Solve a design challenge as a team",
      ],
    },
    {
      id: "swimming",
      name: "Splash & Confidence",
      category: "Swimming",
      ageMin: 7,
      ageMax: 12,
      price: 245,
      duration: "Full day",
      capacity: 12,
      image: "swimming.webp",
      description:
        "Make a splash at your own pace. Small-group lessons combine water confidence, fundamental technique, and supervised pool games.",
      mentor: "Sam Rivera",
      area: "Camp pool",
      outcomes: [
        "Build confidence in shallow water",
        "Practice floating and basic strokes",
        "Learn pool rules and water awareness",
      ],
    },
    {
      id: "nature",
      name: "Wild Wonder Explorers",
      category: "Nature",
      ageMin: 4,
      ageMax: 16,
      price: 185,
      duration: "Half day",
      capacity: 18,
      image: "nature.webp",
      description:
        "Follow a trail of questions into the great outdoors. Discover plants, spot tiny creatures, and learn to care for the natural world.",
      mentor: "Casey Moore",
      area: "Woodland trail",
      outcomes: [
        "Identify common leaves and plants",
        "Keep a nature observation journal",
        "Practice caring for outdoor spaces",
      ],
    },
  ],
  sessions: [],
  enrollments: [
    {
      id: "EN-1001",
      childId: "c1",
      programId: "arts",
      sessionId: "arts-1",
      status: "Confirmed",
      paid: true,
      amount: 185,
      created: "2027-01-12",
    },
    {
      id: "EN-1002",
      childId: "c1",
      programId: "sports",
      sessionId: "sports-2",
      status: "Confirmed",
      paid: true,
      amount: 245,
      created: "2027-02-05",
    },
    {
      id: "EN-1003",
      childId: "c2",
      programId: "swimming",
      sessionId: "swimming-1",
      status: "Confirmed",
      paid: true,
      amount: 245,
      created: "2027-02-16",
    },
    {
      id: "EN-1004",
      childId: "c2",
      programId: "coding",
      sessionId: "coding-2",
      status: "Pending",
      paid: false,
      amount: 245,
      created: "2027-03-08",
    },
    {
      id: "EN-1005",
      childId: "c3",
      programId: "nature",
      sessionId: "nature-3",
      status: "Pending",
      paid: false,
      amount: 185,
      created: "2027-03-19",
    },
    {
      id: "EN-1006",
      childId: "c3",
      programId: "coding",
      sessionId: "coding-1",
      status: "Waitlisted",
      paid: false,
      amount: 245,
      created: "2027-04-03",
    },
    {
      id: "EN-1007",
      childId: "c1",
      programId: "nature",
      sessionId: "nature-3",
      status: "Cancelled",
      paid: false,
      amount: 185,
      created: "2027-04-08",
    },
  ],
  notifications: [
    {
      id: "n1",
      title: "A little preparation, a lot of adventure",
      body: "Bring a labeled water bottle, a sun hat, and comfortable shoes. This is sample camp guidance.",
      read: false,
    },
  ],
  messages: [
    {
      id: "m1",
      name: "Avery Parker",
      email: "avery@example.com",
      subject: "Trying camp for the first time",
      body: "Which half-day program would you recommend for a curious seven-year-old?",
      read: false,
    },
  ],
  posts: [
    {
      id: "first-day",
      title: "Little steps to a wonderful first day",
      category: "Parenting Tips",
      image: "nature.webp",
      intro:
        "A calm morning and a familiar routine can help your child feel ready for a new adventure.",
      tips: [
        "Pack a bag together the evening before.",
        "Talk about one activity your child looks forward to.",
        "Keep your goodbye warm, simple, and reassuring.",
      ],
    },
    {
      id: "creative",
      title: "Make room for a little creative mess",
      category: "Creative Activities",
      image: "arts.webp",
      intro:
        "Open-ended making gives children space to experiment, make choices, and tell their own stories.",
      tips: [
        "Offer a small selection of materials.",
        "Ask about the process instead of the finished result.",
        "Leave time for children to change their minds.",
      ],
    },
    {
      id: "outdoors",
      title: "The big lessons in small outdoor discoveries",
      category: "Outdoor Learning",
      image: "sports.webp",
      intro:
        "A leaf, a bird call, or an interesting stone can become the beginning of a whole afternoon of learning.",
      tips: [
        "Let children set the pace of a short walk.",
        "Make a sketch instead of collecting living things.",
        "Ask what they notice before offering an explanation.",
      ],
    },
    {
      id: "water",
      title: "A thoughtful approach to water confidence",
      category: "Safety",
      image: "swimming.webp",
      intro:
        "Clear routines and attentive adult supervision help make water activities more comfortable.",
      tips: [
        "Discuss the camp swimming plan with the team.",
        "Share your child’s swimming experience in advance.",
        "Follow instructor guidance and posted pool rules.",
      ],
    },
    {
      id: "friendship",
      title: "Finding your people through play",
      category: "Camp Life",
      image: "coding.webp",
      intro:
        "Shared challenges give children natural opportunities to listen, collaborate, and build friendships.",
      tips: [
        "Choose cooperative activities.",
        "Celebrate small acts of kindness.",
        "Give friendships time to develop.",
      ],
    },
    {
      id: "summer",
      title: "A new season of possibilities",
      category: "Announcements",
      image: "nature.webp",
      intro:
        "Our illustrative summer schedule is ready to explore. Find a weekly rhythm that works for your family.",
      tips: [
        "Compare half-day and full-day options.",
        "Check age eligibility before enrolling.",
        "Review sample dates and session availability.",
      ],
    },
  ],
};
for (const p of Campora.seed.programs) {
  for (let i = 1; i <= 3; i++)
    Campora.seed.sessions.push({
      id: `${p.id}-${i}`,
      programId: p.id,
      date: `2027-06-${String(7 + (i - 1) * 7).padStart(2, "0")}`,
      time: p.duration === "Half day" ? "09:00–12:00" : "09:00–16:00",
      capacity: p.capacity,
      instructor: p.mentor,
    });
}
const articleSections = {
  "first-day": [
    [
      "Make the unfamiliar feel familiar.",
      "A new place brings new questions. Walk through the sample daily routine together, talk about arrival and pickup, and let your child choose a small practical task such as filling their water bottle. A little ownership can turn anticipation into readiness.",
    ],
    [
      "Leave room for their own story.",
      "Some children share every detail on the way home; others need quiet first. Ask what surprised them, who helped them, or what they might like to try tomorrow. Celebrate the effort of beginning rather than expecting a perfect first day.",
    ],
  ],
  creative: [
    [
      "Let the materials start the conversation.",
      "A few colors, a piece of clay, or a cardboard box can invite more ideas than a finished example. Offer manageable choices and allow children to decide what their creation should become. Their process is part of the discovery.",
    ],
    [
      "A studio for trying again.",
      "Paint mixes into unexpected colors and paper structures sometimes fall down. Keep extra materials nearby and model curiosity about what happened. A changed plan can become a proud part of the finished story.",
    ],
  ],
  outdoors: [
    [
      "Slow down enough to notice.",
      "Choose a short route and let the group pause. A trail does not need to be long to feel full of possibility. Comparing leaf shapes, listening for birds, and noticing shadows turn a familiar space into a place for questions.",
    ],
    [
      "Take a memory, leave a habitat.",
      "Sketch a discovery or describe it in a journal instead of removing living things. Talk about staying on appropriate paths and giving wildlife space. Outdoor learning is also a chance to practice care for the places we enjoy.",
    ],
  ],
  water: [
    [
      "Start with a conversation.",
      "Tell your actual camp provider about your child’s swimming experience and comfort around water. Ask how groups are organized and which activities are planned. A shared understanding helps families know what to expect.",
    ],
    [
      "Progress at a comfortable pace.",
      "Confidence can grow through small, instructor-guided steps. A child may begin by practicing simple movements in shallow water before moving to a new skill. Follow qualified guidance and actual facility rules for every water activity.",
    ],
  ],
  friendship: [
    [
      "Give collaboration a shared purpose.",
      "Building something together creates a natural reason to ask questions, share materials, and listen. Offer a challenge that welcomes different roles so children can contribute in ways that feel comfortable.",
    ],
    [
      "Small invitations matter.",
      "An invitation to join a game or help carry supplies can be the beginning of a connection. Encourage kindness without forcing a friendship. A familiar group rhythm leaves space for trust to grow over several days.",
    ],
  ],
  summer: [
    [
      "Choose a rhythm before a long list.",
      "Our illustrative season has three weekly starts in June 2027. Look at your family’s schedule, compare program durations, and choose one interest to explore first. There is no need to fill every hour.",
    ],
    [
      "Explore before confirming.",
      "The demo catalog shows sample ages, weekly fees, and available seats. Open a program to see its outcomes and session options. In a real camp service, confirm operational dates and policies directly with the provider before making plans.",
    ],
  ],
};
for (const post of Campora.seed.posts) post.sections = articleSections[post.id];
Campora.load = () => {
  try {
    const saved = JSON.parse(localStorage.getItem("campora-demo-v1"));
    if (saved?.programs && saved?.enrollments) {
      saved.posts = structuredClone(Campora.seed.posts);
      return saved;
    }
  } catch {}
  return structuredClone(Campora.seed);
};
Campora.state = Campora.load();
Campora.save = () =>
  localStorage.setItem("campora-demo-v1", JSON.stringify(Campora.state));
Campora.money = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
Campora.escape = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
Campora.available = (session) =>
  session.capacity -
  Campora.state.enrollments.filter(
    (e) => e.sessionId === session.id && e.status !== "Cancelled",
  ).length;
Campora.date = (date) =>
  new Date(date + "T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
