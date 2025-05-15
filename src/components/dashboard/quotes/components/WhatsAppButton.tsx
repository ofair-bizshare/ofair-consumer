
import React from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react"; // Use MessageCircle as a fallback icon

interface WhatsAppButtonProps {
  phoneNumber: string;
  professionalName: string;
  professionalId: string;
  profession?: string;
  onLogReveal: () => void;
}

const getWhatsAppLink = (number: string) => {
  // Normalize to digits only, add country code if missing (assume IL number)
  const raw = number.replace(/\D/g, "");
  const sanitized = raw.length === 10 && raw.startsWith("05") ? `972${raw.slice(1)}` : raw;
  return `https://wa.me/${sanitized}`;
};

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber,
  professionalName,
  professionalId,
  profession,
  onLogReveal,
}) => {
  // Hide if no phone
  if (!phoneNumber) return null;
  const waUrl = getWhatsAppLink(phoneNumber);

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onLogReveal}
      className="block"
    >
      <Button
        variant="outline"
        className="border-green-500 text-green-700 hover:bg-green-100 w-full flex items-center justify-center gap-2"
        type="button"
        tabIndex={0}
      >
        <MessageCircle className="h-4 w-4 text-green-500" />
        שלח WhatsApp
      </Button>
    </a>
  );
};

export default WhatsAppButton;
