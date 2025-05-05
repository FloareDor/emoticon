// import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Dialog } from "./ui/dialog";
import { DialogTrigger } from "./ui/dialog";
import { ProfileDialog } from "./ProfileDialog";
import { useState } from "react";

interface PersonCardProps {
  name: string;
  bio: string;
  imageUrl: string;
  interests: string[];
  explanation?: string;
  confidence?: number;
  career?: {
    current: string;
    experience: string[];
    skills: string[];
  };
}

export const PersonCard = ({
  name,
  bio,
  imageUrl,
  interests,
  explanation,
  confidence,
  career
}: PersonCardProps) => {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <Dialog>
      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-[#8c52ff]/10 h-full flex flex-col">
        <div className="flex items-start gap-4 flex-grow">
          <img
            src={imageUrl}
            alt={name}
            className="w-16 h-16 rounded-full object-cover border-2 border-[#4ECDC4] bg-[#E5DEFF]"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://via.placeholder.com/150?text=User";
            }}
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-poppins font-bold text-lg text-[#2D3748]">{name}</h3>
              {isConnected && (
                <span className="text-xs bg-[#E5DEFF] text-[#8c52ff] px-2 py-0.5 rounded-full">
                  Connected
                </span>
              )}
            </div>
            <div className="mt-1">
              <p className="text-sm text-[#8c52ff] font-medium">
                {career?.current || "Looking for opportunities"}
              </p>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                {bio}
              </p>
            </div>
            {explanation && (
              <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-800">{explanation}</p>
                {confidence !== undefined && (
                  <div className="mt-2">
                    <div className="w-full bg-purple-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${confidence * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-purple-600 mt-1">
                      Match confidence: {Math.round(confidence * 100)}%
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap gap-2 overflow-x-auto scrollbar-hide">
            {interests.slice(0, 3).map((interest, index) => (
              <span
                key={index}
                className="text-xs bg-[#E5DEFF] text-[#8c52ff] px-2 py-1 rounded-full"
              >
                {interest}
              </span>
            ))}
            {interests.length > 3 && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                +{interests.length - 3}
              </span>
            )}
          </div>
        </div>

        <DialogTrigger asChild>
          <button
            className="mt-4 w-full bg-[#8c52ff] text-white rounded-lg py-2 px-4 hover:bg-[#7440e0] transition-colors"
            onClick={() => !isConnected && setIsConnected(true)}
          >
            Connect
          </button>
        </DialogTrigger>
      </div>
      <ProfileDialog
        name={name}
        bio={bio}
        imageUrl={imageUrl}
        interests={interests}
        explanation={explanation}
        confidence={confidence}
        career={career}
      />
    </Dialog>
  );
}; 