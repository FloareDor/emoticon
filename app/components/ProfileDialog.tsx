// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useState } from "react";
import { useToast } from "../hooks/use-toast";

interface ProfileDialogProps {
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

export const ProfileDialog = ({
  name,
  bio,
  imageUrl,
  interests,
  explanation,
  confidence,
  career
}: ProfileDialogProps) => {
  const { toast } = useToast();
  const [isMessaging, setIsMessaging] = useState(false);

  const handleMessage = () => {
    setIsMessaging(true);
    toast({
      title: "Message sent!",
      description: `Your connection request has been sent to ${name}.`,
    });
  };

  return (
    <Dialog>
      <DialogContent className="sm:max-w-[600px] max-h-[100vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <img
              src={imageUrl}
              alt={name}
              className="w-20 h-20 rounded-full object-cover border-2 border-[#4ECDC4]"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/150?text=User";
              }}
            />
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold mb-2">{name}</DialogTitle>
              {career?.current && (
                <p className="text-[#8c52ff] font-medium mb-2">{career.current}</p>
              )}
              <p className="text-gray-600">{bio}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-6 space-y-6 overflow-y-auto flex-1 pr-2">
          {career && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Experience</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {career.experience.map((exp, index) => (
                  <li key={index}>{exp}</li>
                ))}
              </ul>

              <h3 className="font-semibold text-lg mt-4 mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {career.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#E5DEFF] text-[#8c52ff] rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-semibold text-lg mb-2">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-[#E5DEFF] text-[#8c52ff] rounded-full text-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {explanation && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Why we think you'll match</h3>
              <p className="text-gray-600">{explanation}</p>
              {confidence && (
                <p className="text-sm text-[#8c52ff] mt-1">
                  Match confidence: {Math.round(confidence * 100)}%
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end pt-4 border-t">
          <Button
            onClick={handleMessage}
            disabled={isMessaging}
            className="bg-[#8c52ff] text-white hover:bg-[#7440e0]"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            {isMessaging ? "Message Sent" : "Get introduced through Emoticon"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 