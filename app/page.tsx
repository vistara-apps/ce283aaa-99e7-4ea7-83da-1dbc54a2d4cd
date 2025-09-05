"use client";

import { useState, useEffect } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { NavigationBar } from "@/components/NavigationBar";
import { InformationCard } from "@/components/InformationCard";
import { EmergencyButton } from "@/components/EmergencyButton";
import { StateSelector } from "@/components/InputWithLabel";
import { StateGuideViewer } from "@/components/StateGuideViewer";
import { TrustedContactsManager } from "@/components/TrustedContactsManager";
import { Modal } from "@/components/Modal";
import {
  Shield,
  FileText,
  Users,
  AlertTriangle,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { StateGuide, TrustedContact, RecordedIncident } from "@/lib/types";
import { US_STATES, PRICING } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

export default function HomePage() {
  const { setFrameReady } = useMiniKit();
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedGuide, setSelectedGuide] = useState<StateGuide | null>(null);
  const [language, setLanguage] = useState<"en" | "es">("en");
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>([]);
  const [incidents, setIncidents] = useState<RecordedIncident[]>([]);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    setFrameReady();
  }, [setFrameReady]);

  // Mock state guides data
  const stateGuides: StateGuide[] = US_STATES.map((state) => ({
    guideId: `guide_${state.code}`,
    stateName: state.name,
    contentUrl: `/guides/${state.code}.json`,
    language: "en",
    price: PRICING.stateGuide,
    content: {
      whatToSay: [
        "I am exercising my right to remain silent.",
        "I do not consent to any searches.",
        "Am I free to leave?",
        "I would like to speak to a lawyer.",
      ],
      whatNotToSay: [
        "I didn't do anything wrong",
        "You can't do this to me",
        "This is harassment",
      ],
      yourRights: [
        "You have the right to remain silent",
        "You have the right to refuse searches",
        "You have the right to ask if you're free to leave",
        "You have the right to an attorney",
      ],
      emergencyContacts: ["911", "1-800-LEGAL"],
    },
  }));

  const handleGuideSelect = (guide: StateGuide) => {
    setSelectedGuide(guide);
    setIsGuideModalOpen(true);
  };

  const handleIncidentStart = (incident: RecordedIncident) => {
    console.log("Incident started:", incident);
  };

  const handleIncidentStop = (incident: RecordedIncident) => {
    setIncidents((prev) => [...prev, incident]);
    console.log("Incident stopped:", incident);
  };

  const stats = {
    guidesAccessed: incidents.length + Math.floor(Math.random() * 50),
    incidentsRecorded: incidents.length,
    contactsAlerted: incidents.filter((i) => i.alertSent).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-surface to-bg">
      <NavigationBar variant="transparent" />

      <main className="pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <section id="home" className="text-center mb-16">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-2xl">
                  <Shield className="h-12 w-12 text-white" />
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-6">
                Will you see your{" "}
                <span className="text-gradient">RightsGuard</span>
              </h1>

              <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
                Our specialists can with ours guides to an protection people of
                the security, for your business.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="metric-card text-center">
                  <div className="bg-purple-500/20 p-3 rounded-lg w-fit mx-auto mb-4">
                    <FileText className="h-8 w-8 text-purple-400" />
                  </div>
                  <div className="text-3xl font-bold text-text-primary mb-2">
                    {stats.guidesAccessed}
                  </div>
                  <p className="text-text-secondary">Guides Accessed</p>
                </div>

                <div className="metric-card text-center">
                  <div className="bg-blue-500/20 p-3 rounded-lg w-fit mx-auto mb-4">
                    <BarChart3 className="h-8 w-8 text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold text-text-primary mb-2">
                    {stats.incidentsRecorded}
                  </div>
                  <p className="text-text-secondary">Incidents Recorded</p>
                </div>

                <div className="metric-card text-center">
                  <div className="bg-green-500/20 p-3 rounded-lg w-fit mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-green-400" />
                  </div>
                  <div className="text-3xl font-bold text-text-primary mb-2">
                    1,25.7+
                  </div>
                  <p className="text-text-secondary">People Protected</p>
                </div>
              </div>
            </div>
          </section>

          {/* State Guides Section */}
          <section id="guides" className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-text-primary mb-4">
                State-Specific Legal Guides
              </h2>
              <p className="text-text-secondary max-w-2xl mx-auto">
                Get instant access to your rights and what to say during police
                encounters, tailored to your state&apos;s specific laws.
              </p>
            </div>

            <div className="max-w-2xl mx-auto mb-8">
              <StateSelector
                value={selectedState}
                onChange={setSelectedState}
                required
              />
            </div>

            {selectedState && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stateGuides
                  .filter(
                    (guide) =>
                      guide.stateName ===
                      US_STATES.find((s) => s.code === selectedState)?.name,
                  )
                  .map((guide) => (
                    <InformationCard
                      key={guide.guideId}
                      variant="guide"
                      data={guide}
                      onClick={() => handleGuideSelect(guide)}
                    />
                  ))}
              </div>
            )}

            {/* One-page guide preview */}
            <div className="mt-8 max-w-md mx-auto">
              <div className="glass-card p-6">
                <div className="flex items-center mb-4">
                  <FileText className="h-6 w-6 text-purple-400 mr-2" />
                  <h3 className="text-lg font-semibold text-text-primary">
                    One-page guide
                  </h3>
                </div>
                <div className="space-y-2 text-sm text-text-secondary">
                  <p>
                    <strong>State specific user rights</strong>
                  </p>
                  <p className="text-xs text-purple-400">Following advice</p>
                  <p>
                    • Step in over dark of per habitats elite for water dispute,
                    own most you rescue one user if your right high.
                  </p>
                  <p>
                    • Why most time we omit be recording parts a status in a
                    clear (before) ensure person Gals Mette a with four hands
                    used on the right.
                  </p>
                  <p>
                    • <strong>Recording your interactions.</strong>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Emergency Recording Section */}
          <section id="emergency" className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-text-primary mb-4">
                Emergency Recording & Alerts
              </h2>
              <p className="text-text-secondary max-w-2xl mx-auto">
                One-tap recording with automatic location tracking and emergency
                contact alerts.
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <EmergencyButton
                onIncidentStart={handleIncidentStart}
                onIncidentStop={handleIncidentStop}
              />
            </div>

            {/* Recent Incidents */}
            {incidents.length > 0 && (
              <div className="mt-12">
                <h3 className="text-xl font-semibold text-text-primary mb-6 text-center">
                  Recent Incidents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {incidents.slice(-4).map((incident) => (
                    <InformationCard
                      key={incident.incidentId}
                      variant="incidentSummary"
                      data={incident}
                    />
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Trusted Contacts Section */}
          <section id="contacts" className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-text-primary mb-4">
                Emergency Contacts
              </h2>
              <p className="text-text-secondary max-w-2xl mx-auto">
                Set up trusted contacts who will be automatically notified
                during emergencies.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="glass-card p-6 text-center">
                <Users className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {trustedContacts.length} Emergency Contacts
                </h3>
                <p className="text-text-secondary mb-4">
                  Manage your trusted contacts for emergency situations.
                </p>
                <button
                  onClick={() => setIsContactsModalOpen(true)}
                  className="btn-primary"
                >
                  Manage Contacts
                </button>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-text-primary mb-4">
                Simple, Fair Pricing
              </h2>
              <p className="text-text-secondary max-w-2xl mx-auto">
                Pay only for what you need, when you need it.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="glass-card p-6 text-center">
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Per State Guide
                </h3>
                <div className="text-3xl font-bold text-purple-400 mb-4">
                  {formatCurrency(PRICING.stateGuide)}
                </div>
                <p className="text-text-secondary mb-4">
                  One-time purchase per state
                </p>
                <ul className="text-sm text-text-secondary space-y-2">
                  <li>• State-specific legal guidance</li>
                  <li>• Multilingual support</li>
                  <li>• Lifetime access</li>
                </ul>
              </div>

              <div className="glass-card p-6 text-center border-2 border-purple-500">
                <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                  Most Popular
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Monthly Plan
                </h3>
                <div className="text-3xl font-bold text-purple-400 mb-4">
                  {formatCurrency(PRICING.monthlySubscription)}
                </div>
                <p className="text-text-secondary mb-4">Per month</p>
                <ul className="text-sm text-text-secondary space-y-2">
                  <li>• All state guides</li>
                  <li>• Emergency recording</li>
                  <li>• Contact alerts</li>
                  <li>• Priority support</li>
                </ul>
              </div>

              <div className="glass-card p-6 text-center">
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Yearly Plan
                </h3>
                <div className="text-3xl font-bold text-purple-400 mb-4">
                  {formatCurrency(PRICING.yearlySubscription)}
                </div>
                <p className="text-text-secondary mb-4">Per year (save 17%)</p>
                <ul className="text-sm text-text-secondary space-y-2">
                  <li>• Everything in Monthly</li>
                  <li>• 2 months free</li>
                  <li>• Advanced features</li>
                  <li>• Legal consultation credits</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Guide Viewer Modal */}
      {selectedGuide && (
        <Modal
          isOpen={isGuideModalOpen}
          onClose={() => {
            setIsGuideModalOpen(false);
            setSelectedGuide(null);
          }}
          title={`${selectedGuide.stateName} Legal Guide`}
        >
          <StateGuideViewer
            guide={selectedGuide}
            language={language}
            onLanguageChange={setLanguage}
          />
        </Modal>
      )}

      {/* Contacts Manager Modal */}
      <Modal
        isOpen={isContactsModalOpen}
        onClose={() => setIsContactsModalOpen(false)}
        title="Emergency Contacts"
      >
        <TrustedContactsManager
          contacts={trustedContacts}
          onContactsChange={setTrustedContacts}
        />
      </Modal>
    </div>
  );
}
