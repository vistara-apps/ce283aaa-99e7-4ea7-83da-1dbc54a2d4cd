"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Globe, Shield, Phone } from "lucide-react";
import { StateGuide } from "@/lib/types";
import { EMERGENCY_PHRASES } from "@/lib/constants";

interface StateGuideViewerProps {
  guide: StateGuide;
  language: "en" | "es";
  onLanguageChange: (lang: "en" | "es") => void;
}

export function StateGuideViewer({
  guide,
  language,
  onLanguageChange,
}: StateGuideViewerProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "rights",
  ]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section],
    );
  };

  const phrases = EMERGENCY_PHRASES[language];

  const sections = [
    {
      id: "rights",
      title: language === "en" ? "Your Rights" : "Tus Derechos",
      icon: Shield,
      content: guide.content.yourRights,
      color: "text-green-400",
    },
    {
      id: "say",
      title: language === "en" ? "What TO Say" : "Qué DECIR",
      icon: Phone,
      content: phrases.polite,
      color: "text-blue-400",
    },
    {
      id: "avoid",
      title: language === "en" ? "What NOT to Say" : "Qué NO Decir",
      icon: Phone,
      content: phrases.avoid,
      color: "text-red-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-text-primary">
            {guide.stateName} Legal Guide
          </h1>
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-text-secondary" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as "en" | "es")}
              className="bg-surface border border-gray-600 rounded-lg px-3 py-1 text-sm text-text-primary"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>
        </div>

        <p className="text-text-secondary">
          {language === "en"
            ? "Quick reference guide for police interactions in your state."
            : "Guía de referencia rápida para interacciones policiales en tu estado."}
        </p>
      </div>

      {/* Sections */}
      {sections.map((section) => (
        <div key={section.id} className="glass-card">
          <button
            onClick={() => toggleSection(section.id)}
            className="w-full p-6 flex items-center justify-between hover:bg-surface/50 transition-colors duration-200"
          >
            <div className="flex items-center space-x-3">
              <section.icon className={`h-6 w-6 ${section.color}`} />
              <h2 className="text-lg font-semibold text-text-primary">
                {section.title}
              </h2>
            </div>
            {expandedSections.includes(section.id) ? (
              <ChevronUp className="h-5 w-5 text-text-secondary" />
            ) : (
              <ChevronDown className="h-5 w-5 text-text-secondary" />
            )}
          </button>

          {expandedSections.includes(section.id) && (
            <div className="px-6 pb-6">
              <ul className="space-y-3">
                {section.content.map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        section.id === "rights"
                          ? "bg-green-400"
                          : section.id === "say"
                            ? "bg-blue-400"
                            : "bg-red-400"
                      }`}
                    />
                    <span className="text-text-secondary flex-1">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}

      {/* Emergency Contacts */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
          <Phone className="h-5 w-5 text-yellow-400 mr-2" />
          {language === "en" ? "Emergency Contacts" : "Contactos de Emergencia"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-surface/50 p-4 rounded-lg">
            <p className="text-sm text-text-secondary mb-1">
              {language === "en"
                ? "Emergency Services"
                : "Servicios de Emergencia"}
            </p>
            <p className="text-xl font-bold text-text-primary">911</p>
          </div>
          <div className="bg-surface/50 p-4 rounded-lg">
            <p className="text-sm text-text-secondary mb-1">
              {language === "en" ? "Legal Aid Hotline" : "Línea de Ayuda Legal"}
            </p>
            <p className="text-xl font-bold text-text-primary">1-800-LEGAL</p>
          </div>
        </div>
      </div>
    </div>
  );
}
