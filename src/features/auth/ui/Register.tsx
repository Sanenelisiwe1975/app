import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Rocket, GraduationCap, Briefcase, Diamond, Heart } from "lucide-react";
import { audiences } from "@/data/mindsets";

const audienceIcons: Record<string, React.ReactNode> = {
  youth: <Rocket className="w-8 h-8" />,
  university: <GraduationCap className="w-8 h-8" />,
  corporate: <Briefcase className="w-8 h-8" />,
  wealthy: <Diamond className="w-8 h-8" />,
  health: <Heart className="w-8 h-8" />,
};

const audienceColors: Record<string, string> = {
  youth: "from-xhosa-orange to-xhosa-yellow",
  university: "from-xhosa-blue to-xhosa-teal",
  corporate: "from-xhosa-purple to-xhosa-coral",
  wealthy: "from-gold to-gold-dark",
  health: "from-xhosa-red to-xhosa-coral",
};

export default function Register({
  onRegister,
  onNavigate,
}: {
  onRegister: (data: { name: string; surname: string; age: string; location: string; audience: string }) => void;
  onNavigate: (page: string) => void;
}) {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [step, setStep] = useState<"details" | "path">("details");

  const handleContinue = () => {
    if (!name || !surname || !age || !location) return;
    setStep("path");
  };

  const handleSelectPath = (key: string) => {
    onRegister({ name, surname, age, location, audience: key });
  };

  return (
    <div className="page-container pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="text-center mb-8">
          <div className="beadwork-bar w-24 mx-auto mb-6" />
          <h1 className="font-serif text-3xl md:text-4xl font-bold gold-text mb-3">
            Wamkelekile, Future Titan
          </h1>
          <p className="text-muted-foreground text-sm">
            "Imbiza yakho ingakhula uma uqala manje" — Your wealth pot grows if you start now.
          </p>
        </div>

        {step === "details" ? (
          <div className="glass-card p-6 md:p-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="input-premium"
                placeholder="First Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="input-premium"
                placeholder="Surname"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
              />
              <input
                className="input-premium"
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
              <input
                className="input-premium"
                placeholder="Location (e.g., East London, Soweto)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <button
              className="btn-premium w-full mt-4 flex items-center justify-center gap-2"
              onClick={handleContinue}
              disabled={!name || !surname || !age || !location}
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
            <button
              className="btn-outline-premium w-full"
              onClick={() => onNavigate("switch")}
            >
              Load Saved Progress
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-semibold text-center mb-6">Choose Your Path</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(audiences).map(([key, aud]) => (
                <motion.button
                  key={key}
                  onClick={() => handleSelectPath(key)}
                  className="glass-card-hover p-6 text-left group"
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${audienceColors[key]} flex items-center justify-center text-white mb-4 shadow-lg`}>
                    {audienceIcons[key]}
                  </div>
                  <h3 className="font-semibold text-white mb-1">{aud.name}</h3>
                  <p className="text-xs text-muted-foreground">{aud.mindsets.length} mindsets</p>
                  <ArrowRight className="w-4 h-4 text-gold mt-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              ))}
            </div>
            <button
              className="btn-outline-premium w-full mt-4"
              onClick={() => setStep("details")}
            >
              Back
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
