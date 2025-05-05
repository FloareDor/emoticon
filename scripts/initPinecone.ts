import { indexUser } from '../utils/simplePinecone';

// Mock user database - same as in route.ts
const mockUsers = [
  {
    id: 1,
    name: "Sarah Chen",
    interests: ["neuroscience", "coffee", "hiking"],
    personality: "extroverted",
    bio: "Neuroscience researcher by day, coffee enthusiast by night. Always up for a good conversation about brain science or a morning coffee run!",
    mutuals: ["Alex", "Jordan", "Taylor"],
    career: {
      current: "Research Scientist at Stanford Neuroscience Institute",
      experience: [
        "PhD in Neuroscience from MIT (2018-2023)",
        "Research Assistant at Harvard Medical School (2016-2018)",
        "Published 5 papers on cognitive function and memory formation"
      ],
      skills: ["fMRI analysis", "Python", "R", "Data visualization", "Public speaking"]
    },
    photo: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  // ... other mock users ...
];

async function initializePinecone() {
  console.log('Starting Pinecone initialization...');
  
  try {
    // Index each user
    for (const user of mockUsers) {
      console.log(`Indexing user: ${user.name}`);
      await indexUser(user);
    }
    
    console.log('Pinecone initialization completed successfully!');
  } catch (error) {
    console.error('Error initializing Pinecone:', error);
  }
}

// Run the initialization
initializePinecone(); 