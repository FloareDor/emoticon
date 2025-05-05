import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Define the user type
interface User {
  id: string;
  name: string;
  bio: string;
  imageUrl: string;
  interests: string[];
  personality?: string;
  career?: {
    current: string;
    experience: string[];
    skills: string[];
  };
  mutuals?: string[];
}

// Mock user database
const mockUsers = [
  {
    id: "1",
    name: "Sarah Chen",
    interests: ["Machine Learning", "Data Science", "Hiking", "Photography", "Reading"],
    personality: "Analytical, Creative, Introverted",
    bio: "Data scientist passionate about AI and outdoor adventures. Always looking to learn new things and connect with like-minded individuals.",
    career: {
      current: "Senior Data Scientist at TechCorp",
      experience: ["Data Analyst at DataCo", "ML Engineer at AIStartup"],
      skills: ["Python", "TensorFlow", "SQL", "Data Visualization"]
    },
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
  },
  {
    id: "2",
    name: "Michael Rodriguez",
    interests: ["Software Development", "Gaming", "Music Production", "Basketball", "Travel"],
    personality: "Extroverted, Tech-savvy, Competitive",
    bio: "Full-stack developer with a passion for gaming and music. Love exploring new technologies and meeting people from different backgrounds.",
    career: {
      current: "Lead Developer at DevHub",
      experience: ["Software Engineer at TechGiant", "Web Developer at StartupX"],
      skills: ["JavaScript", "React", "Node.js", "AWS"]
    },
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
  },
  {
    id: "3",
    name: "Emily Johnson",
    interests: ["UX Design", "Art", "Yoga", "Cooking", "Sustainability"],
    personality: "Creative, Empathetic, Detail-oriented",
    bio: "UX designer with a background in fine arts. Passionate about creating beautiful, functional interfaces and living sustainably.",
    career: {
      current: "Senior UX Designer at DesignCo",
      experience: ["UI Designer at WebAgency", "Graphic Designer at CreativeStudio"],
      skills: ["Figma", "Adobe Creative Suite", "User Research", "Prototyping"]
    },
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop"
  },
  {
    id: "4",
    name: "David Kim",
    interests: ["Product Management", "Startups", "Tennis", "Reading", "Public Speaking"],
    personality: "Leadership, Strategic, Outgoing",
    bio: "Product manager with a passion for building innovative solutions. Love connecting with entrepreneurs and sharing knowledge.",
    career: {
      current: "Product Manager at TechStartup",
      experience: ["Associate PM at BigTech", "Business Analyst at ConsultCo"],
      skills: ["Product Strategy", "Agile", "Data Analysis", "Stakeholder Management"]
    },
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
  },
  {
    id: "5",
    name: "Lisa Patel",
    interests: ["Marketing", "Social Media", "Dancing", "Travel", "Photography"],
    personality: "Creative, Social, Adaptable",
    bio: "Digital marketing specialist with a love for travel and photography. Always excited to meet new people and share stories.",
    career: {
      current: "Marketing Manager at BrandCo",
      experience: ["Social Media Manager at AgencyX", "Content Strategist at MediaCo"],
      skills: ["Social Media Marketing", "Content Creation", "Analytics", "Brand Strategy"]
    },
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop"
  },
  {
    id: "6",
    name: "James Wilson",
    interests: ["Cybersecurity", "Ethical Hacking", "Chess", "Rock Climbing", "Podcasting"],
    personality: "Analytical, Strategic, Reserved",
    bio: "Cybersecurity expert with a passion for ethical hacking and rock climbing. Enjoy solving complex problems and sharing knowledge through podcasting.",
    career: {
      current: "Security Engineer at SecureTech",
      experience: ["Security Analyst at CyberCo", "IT Consultant at TechConsult"],
      skills: ["Network Security", "Penetration Testing", "Incident Response", "Security Auditing"]
    },
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop"
  }
];

interface MatchResult {
  id: string;
  name: string;
  confidence: number;
  explanation: string;
  photo: string;
  interests?: string[];
  career?: {
    current: string;
    experience: string[];
    skills: string[];
  };
  bio: string;
}

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    console.log('Search query received:', query);

    // If query is "featured", return the first 6 profiles without searching
    if (query === "featured") {
      return NextResponse.json({
        matches: mockUsers.map(user => ({
          id: user.id,
          name: user.name,
          bio: user.bio,
          imageUrl: user.photo,
          interests: user.interests,
          currentRole: user.career.current,
          experience: user.career.experience,
          skills: user.career.skills,
          personality: user.personality
        }))
      });
    }

    // For regular searches, use the Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      You are a matchmaking assistant. Given a user's search query, find the best matches from the following user profiles.
      Consider interest alignment, personality compatibility, and career relevance.
      Return ONLY a JSON array of matches, where each match has:
      - id: the user's ID
      - name: the user's name
      - confidence: a number between 0 and 1 indicating match quality
      - explanation: a brief explanation of why this is a good match
      - photo: the user's photo URL
      - career: the user's career information
      - interests: the user's interests
      - bio: the user's bio

      User profiles:
      ${JSON.stringify(mockUsers, null, 2)}

      Search query: "${query}"

      Return ONLY the JSON array, nothing else.
    `;

    console.log('Sending prompt to Gemini API');
    
    // Generate response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Raw response from Gemini:', text);
    
    // Try to extract JSON from the response
    let jsonStr = text;
    
    // If the response contains markdown code blocks, extract the JSON
    if (text.includes('```json')) {
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        jsonStr = jsonMatch[1].trim();
      }
    } else if (text.includes('```')) {
      const jsonMatch = text.match(/```\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        jsonStr = jsonMatch[1].trim();
      }
    }
    
    console.log('Extracted JSON string:', jsonStr);
    
    // Parse the response
    let matches;
    try {
      matches = JSON.parse(jsonStr);
      console.log('Successfully parsed JSON:', matches);
      
      // Enhance matches with additional user information
      matches = matches.map((match: any) => {
        const userInfo = mockUsers.find(user => user.id === match.id);
        return {
          ...match,
          photo: userInfo?.photo,
          interests: userInfo?.interests || [],
          career: userInfo ? {
            current: userInfo.career.current,
            experience: userInfo.career.experience,
            skills: userInfo.career.skills
          } : undefined,
          bio: userInfo?.bio || "No bio available"
        };
      });
      
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      
      // Fallback: Create a simple match based on the query
      matches = mockUsers
        .filter(user => {
          const queryLower = query.toLowerCase();
          return (
            user.interests.some(interest => queryLower.includes(interest.toLowerCase())) ||
            (user.personality && user.personality.toLowerCase().includes(queryLower)) ||
            user.bio.toLowerCase().includes(queryLower) ||
            user.career.current.toLowerCase().includes(queryLower) ||
            user.career.skills.some(skill => queryLower.includes(skill.toLowerCase()))
          );
        })
        .map(user => ({
          id: user.id,
          name: user.name,
          confidence: 0.7,
          explanation: `${user.name} is into ${user.interests.join(', ')}, which seems to align with what you're looking for. They're ${user.personality || 'friendly'} and currently work as ${user.career.current}. You might connect over shared interests!`,
          photo: user.photo,
          interests: user.interests,
          career: user.career,
          bio: user.bio || "No bio available"
        }));
      
      console.log('Using fallback matches:', matches);
    }

    // Filter and sort matches
    const filteredMatches = matches
      .sort((a: any, b: any) => b.confidence - a.confidence)  // Sort by confidence
      .filter((match: any, index: number) => {
        // Always keep first 3 matches
        if (index < 3) return true;
        // For matches beyond first 3, only keep if confidence > 0.3
        return match.confidence > 0.3;
      });
    
    console.log('Final filtered matches:', filteredMatches);

    // If we have no matches, return an empty array instead of an error
    if (filteredMatches.length === 0) {
      return NextResponse.json({ matches: [] });
    }

    return NextResponse.json({ matches: filteredMatches });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to process search query' },
      { status: 500 }
    );
  }
} 