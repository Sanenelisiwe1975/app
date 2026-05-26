import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowRight, Rocket, GraduationCap, Briefcase, Diamond, Heart } from "lucide-react";
import { audiences } from "@/data/mindsets";
import { useUserStore } from "@/shared/stores/userStore";
import { useUiStore } from "@/shared/stores/uiStore";
import { useAudio } from "@/shared/hooks/useAudio";
import type { AudienceKey } from "@/entities";

const AUDIENCE_ICONS: Record<string, React.ReactNode> = {
  youth:      <Rocket        className="w-8 h-8" />,
  university: <GraduationCap className="w-8 h-8" />,
  corporate:  <Briefcase     className="w-8 h-8" />,
  wealthy:    <Diamond       className="w-8 h-8" />,
  health:     <Heart         className="w-8 h-8" />,
};

const AUDIENCE_COLORS: Record<string, string> = {
  youth:      "from-xhosa-orange to-xhosa-yellow",
  university: "from-xhosa-blue to-xhosa-teal",
  corporate:  "from-xhosa-purple to-xhosa-coral",
  wealthy:    "from-gold to-gold-dark",
  health:     "from-xhosa-red to-xhosa-coral",
};

export default function Register() {
  const { t }        = useTranslation();
  const user         = useUserStore((s) => s.user);
  const setUser      = useUserStore((s) => s.setUser);
  const setAudience  = useUserStore((s) => s.setAudience);
  const navigate     = useUiStore((s) => s.navigate);
  const { playDrum } = useAudio();

  const [firstName, setFirstName] = useState("");
  const [surname, setSurname]     = useState("");
  const [age, setAge]             = useState("");
  const [location, setLocation]   = useState("");
  const [step, setStep]           = useState<"details" | "path">("details");

  const handleContinue = () => {
    if (!firstName || !surname || !age || !location) return;
    setStep("path");
  };

  const handleSelectPath = (key: string) => {
    setUser({ name: firstName, surname, age, location, audience: key as AudienceKey, mindset: "" });
    setAudience(key as AudienceKey);
    navigate("mindset");
    playDrum();
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
            {t("register.title")}
          </h1>
          <p className="text-muted-foreground text-sm">
            "Imbiza yakho ingakhula uma uqala manje" — {t("register.subtitle")}
          </p>
        </div>

        {step === "details" ? (
          <div className="glass-card p-6 md:p-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="input-premium"
                placeholder={t("register.firstName")}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                aria-label={t("register.firstName")}
                autoComplete="given-name"
              />
              <input
                className="input-premium"
                placeholder={t("register.surname")}
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                aria-label={t("register.surname")}
                autoComplete="family-name"
              />
              <input
                className="input-premium"
                type="number"
                placeholder={t("register.age")}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                aria-label={t("register.age")}
                min={1}
                max={120}
              />
              <input
                className="input-premium"
                placeholder={t("register.location")}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                aria-label={t("register.location")}
                autoComplete="address-level2"
              />
            </div>
            <button
              type="button"
              className="btn-premium w-full mt-4 flex items-center justify-center gap-2"
              onClick={handleContinue}
              disabled={!firstName || !surname || !age || !location}
            >
              {t("common.continue")} <ArrowRight className="w-4 h-4" />
            </button>
            {user && (
              <button
                type="button"
                className="btn-outline-premium w-full"
                onClick={() => navigate("dashboard")}
              >
                {t("register.loadProgress")}
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-semibold text-center mb-6">
              {t("register.choosePath")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {Object.entries(audiences).map(([key, aud]) => (
                <motion.button
                  key={key}
                  type="button"
                  onClick={() => handleSelectPath(key)}
                  className="glass-card-hover p-6 text-left group touch-manipulation"
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${AUDIENCE_COLORS[key]} flex items-center justify-center text-white mb-4 shadow-lg`}>
                    {AUDIENCE_ICONS[key]}
                  </div>
                  <h3 className="font-semibold text-white mb-1">{aud.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {aud.mindsets.length} {t("register.mindsets")}
                  </p>
                  <ArrowRight className="w-4 h-4 text-gold mt-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              ))}
            </div>
            <button
              type="button"
              className="btn-outline-premium w-full mt-4"
              onClick={() => setStep("details")}
            >
              {t("common.back")}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
