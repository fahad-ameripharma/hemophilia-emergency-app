"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Backpack,
  Car,
  CheckCircle2,
  Droplets,
  FileText,
  MapPin,
  Phone,
  Printer,
  Search,
  Shield,
} from "lucide-react";

type TabKey = "dashboard" | "plan" | "kit" | "summary";

type Category = {
  key: string;
  title: string;
  icon: typeof Droplets;
  items: string[];
};

const planningQuestions = [
  "What emergencies are most likely in your area?",
  "How will your family evacuate or leave the home safely?",
  "Where will everyone meet if you are separated?",
  "What is your main evacuation route?",
  "What is your backup route?",
  "What supplies will you take with you?",
  "What do you need to shelter in place?",
  "Do you know your local warning signals and what they mean?",
  "What local services or organizations can help in an emergency?",
  "Have you informed nearby emergency organizations about special needs?",
  "What is the plan for pets?",
  "Who is your out-of-area emergency contact?",
  "Have you practiced the plan with your children?",
  "Is your go-bag ready, assigned, and checked regularly?",
  "Do you know your children's school emergency plan?",
  "Do you know your workplace emergency plan?",
  "Have you discussed emergency planning with your HTC or homecare company?",
];

const priorityItems = [
  "Factor treatment and infusion supplies packed",
  "HTC and backup HTC identified",
  "Medical alert bracelet available",
  "Emergency contact and ICE number saved",
  "Infusion instructions and logs ready",
  "Cash, charger, and transport plan prepared",
];

const categories: Category[] = [
  {
    key: "bleeding",
    title: "Bleeding Disorder Essentials",
    icon: Droplets,
    items: [
      "Medical alert bracelet or necklace",
      "Factor treatment and infusion supplies",
      "Extra factor or supplies as insurance allows",
      "Ice packs in freezer",
      "Emergency cash or transit fare",
      "Important phone numbers in multiple places",
      "Family manual with diagnosis, treatment instructions, maps, and backup HTC",
      "Infusion log",
      "Packed go-bag with factor and supplies",
      "ICE contact programmed into phone",
      "1-800-42-HANDI saved in phone",
      "Backup source for factor and supplies identified",
      "Extended family or friends trained to mix and infuse factor",
    ],
  },
  {
    key: "general",
    title: "General Medical & Safety Supplies",
    icon: Shield,
    items: [
      "Sterile gloves",
      "Sterile dressings",
      "Soap or cleansing agents",
      "Antibiotic towelettes",
      "Antibiotic ointment",
      "Burn ointment",
      "Adhesive bandages",
      "Eye wash solution",
      "Thermometer",
      "Prescription medications",
      "Prescribed medical equipment",
      "Petroleum jelly or lubricant",
      "Non-aspirin pain relievers and hygiene items",
      "Flashlights with extra batteries",
      "Battery-powered or hand-crank radio",
      "Dust masks and work gloves",
      "Plastic garbage bags and ties",
      "Whistle",
      "Face masks",
      "Towelettes or baby wipes",
      "Wrench or pliers for utilities",
      "Plastic sheeting and duct tape",
      "Universal or wind-up phone charger",
      "Matches in a waterproof container",
      "Games and activities for children",
    ],
  },
  {
    key: "food",
    title: "Food & Water",
    icon: Backpack,
    items: [
      "3-day water supply (1 gallon per person per day)",
      "3-day ready-to-eat food supply",
      "High-energy snacks",
      "Comfort or stress foods",
      "Manual can opener",
      "Eating utensils and paper supplies",
    ],
  },
  {
    key: "clothing",
    title: "Clothing & Warmth",
    icon: Backpack,
    items: [
      "Jacket or coat",
      "Long pants",
      "Long-sleeved shirt",
      "Sturdy shoes",
      "Hat and gloves",
      "Sleeping bag or warm blanket",
    ],
  },
  {
    key: "vehicle",
    title: "Vehicle Safety",
    icon: Car,
    items: [
      "Seatbelts checked for everyone",
      "Car seats installed properly",
      "Vehicle first-aid kit and blankets",
      "Emergency info card in child car seat",
      "Emergency info card in wallet",
      "Emergency info card in glove compartment",
      "Adequate fuel in vehicle",
    ],
  },
  {
    key: "documents",
    title: "Money & Documents",
    icon: FileText,
    items: [
      "Cash in small bills",
      "Access to ATM or multiple financial institutions",
      "Social Security card copies",
      "Birth certificate copies",
      "Marriage record copies",
      "Driver's license copies",
      "Insurance policies",
      "Savings and checking details",
      "Current medical information for each family member",
      "Wills or powers of attorney",
      "Waterproof container for documents",
    ],
  },
  {
    key: "misc",
    title: "Miscellaneous",
    icon: AlertTriangle,
    items: [
      "Emergency reference materials or first-aid book",
      "Rain gear",
      "Paper towels",
      "Fire extinguisher",
      "Tent",
      "Compass",
      "Signal flares",
      "Paper and pencils",
      "Medicine dropper",
      "Household chlorine bleach",
    ],
  },
];

function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="card card-padding">
      <div className="stat-value">{value}</div>
      <div className="small" style={{ fontWeight: 700, marginTop: 4 }}>{label}</div>
      <div className="small muted" style={{ marginTop: 6 }}>{hint}</div>
    </div>
  );
}

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button className={`tab${active ? " active" : ""}`} onClick={onClick} type="button">
      {label}
    </button>
  );
}

export default function Page() {
  const allItems = useMemo(
    () => categories.flatMap((category) => category.items.map((item) => ({ category: category.title, item }))),
    []
  );

  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState({
    householdName: "",
    contactName: "",
    contactPhone: "",
    meetingPoint: "",
    evacuationRoute: "",
    backupRoute: "",
    htc: "",
    htcPhone: "",
    backupHTC: "",
    notes: "",
  });

  const filteredCategories = useMemo(() => {
    if (!query.trim()) return categories;
    const q = query.toLowerCase();

    return categories
      .map((category) => ({
        ...category,
        items: category.items.filter(
          (item) => item.toLowerCase().includes(q) || category.title.toLowerCase().includes(q)
        ),
      }))
      .filter((category) => category.items.length > 0);
  }, [query]);

  const completedCount = Object.values(checked).filter(Boolean).length;
  const progress = Math.round((completedCount / allItems.length) * 100);
  const answeredPlanning = Object.values(answers).filter((value) => value.trim().length > 0).length;

  function toggleItem(key: string) {
    setChecked((current) => ({ ...current, [key]: !current[key] }));
  }

  function updateFamily<K extends keyof typeof family>(key: K, value: string) {
    setFamily((current) => ({ ...current, [key]: value }));
  }

  function updateAnswer(index: number, value: string) {
    setAnswers((current) => ({ ...current, [index]: value }));
  }

  return (
    <main className="page">
      <div className="container stack">
        <section className="hero">
          <div className="card card-padding">
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div>
                <div className="badge">
                  <Droplets size={16} /> Bleeding Disorder Emergency Planner
                </div>
                <h1 className="title">Family Emergency Kit &amp; Preparedness App</h1>
                <p className="subtitle">
                  Prototype based on the CDC checklist for hemophilia families. It helps organize emergency planning,
                  track your go-bag, and keep treatment contacts and instructions in one place.
                </p>
              </div>
              <button className="btn" type="button" onClick={() => window.print()}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <Printer size={16} /> Print Summary
                </span>
              </button>
            </div>

            <div className="stats">
              <StatCard
                label="Checklist progress"
                value={`${progress}%`}
                hint={`${completedCount} of ${allItems.length} items completed`}
              />
              <StatCard
                label="Planning questions answered"
                value={String(answeredPlanning)}
                hint={`${planningQuestions.length} recommended prompts`}
              />
              <StatCard
                label="Priority focus"
                value="Factor + go-bag"
                hint="Keep treatment, instructions, and contacts ready to grab"
              />
            </div>

            <div className="progress-shell">
              <div className="progress-bar" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <aside className="card card-padding alert">
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <AlertTriangle size={18} />
              <div>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Important</div>
                <div className="subtitle" style={{ maxWidth: "none", color: "#78350f" }}>
                  This prototype is an organizational tool and not medical advice. In an emergency, follow instructions
                  from your hemophilia treatment center, physician, and local emergency services.
                </div>
              </div>
            </div>
          </aside>
        </section>

        <nav className="tabs" aria-label="Main sections">
          <TabButton active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} label="Dashboard" />
          <TabButton active={activeTab === "plan"} onClick={() => setActiveTab("plan")} label="Emergency Plan" />
          <TabButton active={activeTab === "kit"} onClick={() => setActiveTab("kit")} label="Kit Checklist" />
          <TabButton active={activeTab === "summary"} onClick={() => setActiveTab("summary")} label="Print View" />
        </nav>

        {activeTab === "dashboard" && (
          <section className="grid-main">
            <div className="card card-padding">
              <h2 className="section-title">Top priorities</h2>
              <p className="section-desc">Start with the highest-risk items for bleeding disorder preparedness.</p>
              <div className="priority-grid" style={{ marginTop: 20 }}>
                {priorityItems.map((item, index) => {
                  const key = `priority-${index}`;
                  return (
                    <label className="priority-item" key={key}>
                      <input
                        className="checkbox"
                        type="checkbox"
                        checked={Boolean(checked[key])}
                        onChange={() => toggleItem(key)}
                      />
                      <span>{item}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <aside className="card card-padding">
              <h2 className="section-title">Quick contacts</h2>
              <p className="section-desc">Keep these visible and ready.</p>
              <div style={{ marginTop: 20, display: "grid", gap: 16 }}>
                <div>
                  <label className="label">Out-of-area contact</label>
                  <input
                    className="input"
                    placeholder="Name"
                    value={family.contactName}
                    onChange={(event) => updateFamily("contactName", event.target.value)}
                  />
                  <div style={{ height: 10 }} />
                  <input
                    className="input"
                    placeholder="Phone"
                    value={family.contactPhone}
                    onChange={(event) => updateFamily("contactPhone", event.target.value)}
                  />
                </div>
                <div>
                  <label className="label">Hemophilia Treatment Center</label>
                  <input
                    className="input"
                    placeholder="Primary HTC"
                    value={family.htc}
                    onChange={(event) => updateFamily("htc", event.target.value)}
                  />
                  <div style={{ height: 10 }} />
                  <input
                    className="input"
                    placeholder="HTC phone"
                    value={family.htcPhone}
                    onChange={(event) => updateFamily("htcPhone", event.target.value)}
                  />
                  <div style={{ height: 10 }} />
                  <input
                    className="input"
                    placeholder="Backup HTC"
                    value={family.backupHTC}
                    onChange={(event) => updateFamily("backupHTC", event.target.value)}
                  />
                </div>
                <div className="note-box" style={{ padding: 16, background: "#f8fafc" }}>
                  <div className="small muted" style={{ lineHeight: 1.7 }}>
                    Save the emergency contact under <strong>ICE</strong> in your phone and keep important numbers in
                    multiple locations.
                  </div>
                </div>
              </div>
            </aside>
          </section>
        )}

        {activeTab === "plan" && (
          <section className="grid-3">
            <div className="card card-padding">
              <h2 className="section-title">Family details</h2>
              <p className="section-desc">Basic information to make your plan usable fast.</p>
              <div style={{ marginTop: 20, display: "grid", gap: 12 }}>
                <input
                  className="input"
                  placeholder="Household or family name"
                  value={family.householdName}
                  onChange={(event) => updateFamily("householdName", event.target.value)}
                />
                <input
                  className="input"
                  placeholder="Meeting point"
                  value={family.meetingPoint}
                  onChange={(event) => updateFamily("meetingPoint", event.target.value)}
                />
                <input
                  className="input"
                  placeholder="Primary evacuation route"
                  value={family.evacuationRoute}
                  onChange={(event) => updateFamily("evacuationRoute", event.target.value)}
                />
                <input
                  className="input"
                  placeholder="Backup route"
                  value={family.backupRoute}
                  onChange={(event) => updateFamily("backupRoute", event.target.value)}
                />
                <textarea
                  className="textarea"
                  placeholder="Extra notes, pet plan, school or work plan, local warning signals..."
                  value={family.notes}
                  onChange={(event) => updateFamily("notes", event.target.value)}
                />
              </div>
            </div>

            <div className="card card-padding" style={{ gridColumn: "span 2" }}>
              <h2 className="section-title">Emergency planning prompts</h2>
              <p className="section-desc">Based on the CDC family emergency checklist.</p>
              <div className="scroll" style={{ marginTop: 20 }}>
                <div className="stack" style={{ gap: 16 }}>
                  {planningQuestions.map((question, index) => (
                    <div className="question-card" key={question}>
                      <div className="question-title">
                        <span className="question-number">{index + 1}</span>
                        {question}
                      </div>
                      <textarea
                        className="textarea"
                        style={{ marginTop: 14, minHeight: 96 }}
                        placeholder="Add your answer here"
                        value={answers[index] ?? ""}
                        onChange={(event) => updateAnswer(index, event.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === "kit" && (
          <section className="card card-padding">
            <div className="toolbar">
              <div>
                <h2 className="section-title">Emergency kit checklist</h2>
                <p className="section-desc">Track what is packed, replaced, or still missing.</p>
              </div>
              <div style={{ minWidth: 260, width: 320, maxWidth: "100%", position: "relative" }}>
                <Search size={16} style={{ position: "absolute", left: 14, top: 14, color: "#64748b" }} />
                <input
                  className="search"
                  style={{ paddingLeft: 40 }}
                  placeholder="Search items"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
            </div>

            <div className="stack" style={{ marginTop: 24 }}>
              {filteredCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <div className="category-box" key={category.key}>
                    <div className="category-head">
                      <div className="icon-shell">
                        <Icon size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 20 }}>{category.title}</div>
                        <div className="small muted">{category.items.length} items</div>
                      </div>
                    </div>

                    <div className="check-grid">
                      {category.items.map((item) => {
                        const key = `${category.key}-${item}`;
                        const isDone = Boolean(checked[key]);
                        return (
                          <button
                            className={`check-item${isDone ? " done" : ""}`}
                            key={key}
                            type="button"
                            onClick={() => toggleItem(key)}
                          >
                            <span aria-hidden="true" style={{ marginTop: 1 }}>
                              {isDone ? <CheckCircle2 size={20} /> : <span className="checkbox" style={{ display: "block", border: "1px solid #94a3b8", borderRadius: 999 }} />}
                            </span>
                            <span style={{ textAlign: "left", lineHeight: 1.6 }}>{item}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {filteredCategories.length === 0 && <div className="card card-padding empty">No checklist items matched your search.</div>}
            </div>
          </section>
        )}

        {activeTab === "summary" && (
          <section className="card card-padding stack">
            <div>
              <h2 className="section-title">Printable emergency summary</h2>
              <p className="section-desc">Use this page for a quick review or to print for your go-bag.</p>
            </div>

            <div className="summary-grid">
              <div className="summary-item">
                <div className="small muted" style={{ fontWeight: 700 }}>Family / Household</div>
                <div className="stack small" style={{ gap: 8, marginTop: 12 }}>
                  <div><strong>Name:</strong> {family.householdName || "—"}</div>
                  <div><strong>Meeting point:</strong> {family.meetingPoint || "—"}</div>
                  <div><strong>Main route:</strong> {family.evacuationRoute || "—"}</div>
                  <div><strong>Backup route:</strong> {family.backupRoute || "—"}</div>
                </div>
              </div>
              <div className="summary-item">
                <div className="small muted" style={{ fontWeight: 700 }}>Emergency Contacts</div>
                <div className="stack small" style={{ gap: 8, marginTop: 12 }}>
                  <div><strong>Out-of-area contact:</strong> {family.contactName || "—"}</div>
                  <div><strong>Phone:</strong> {family.contactPhone || "—"}</div>
                  <div><strong>Primary HTC:</strong> {family.htc || "—"}</div>
                  <div><strong>HTC phone:</strong> {family.htcPhone || "—"}</div>
                  <div><strong>Backup HTC:</strong> {family.backupHTC || "—"}</div>
                </div>
              </div>
            </div>

            <div className="divider" />

            <div>
              <h3 style={{ margin: 0, fontSize: 22 }}>Notes</h3>
              <p className="small" style={{ lineHeight: 1.8, whiteSpace: "pre-wrap", marginTop: 12 }}>
                {family.notes || "No notes added yet."}
              </p>
            </div>

            <div className="divider" />

            <div>
              <h3 style={{ margin: 0, fontSize: 22 }}>Planning answers</h3>
              <div className="stack" style={{ marginTop: 16, gap: 12 }}>
                {planningQuestions.map((question, index) => (
                  <div className="summary-item" key={question}>
                    <div style={{ fontWeight: 700 }}>
                      {index + 1}. {question}
                    </div>
                    <div className="small" style={{ lineHeight: 1.7, marginTop: 8, whiteSpace: "pre-wrap" }}>
                      {answers[index] || "Not answered yet."}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="footer-grid">
          <div className="quick-tip card">
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700 }}>
              <Phone size={18} /> Communication plan
            </div>
            <p className="section-desc">Identify an out-of-area contact and keep important numbers in multiple locations.</p>
          </div>
          <div className="quick-tip card">
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700 }}>
              <MapPin size={18} /> Evacuation plan
            </div>
            <p className="section-desc">Set meeting points, main and backup routes, and a plan for pets, school, and work.</p>
          </div>
          <div className="quick-tip card">
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700 }}>
              <Backpack size={18} /> Go-bag readiness
            </div>
            <p className="section-desc">Keep factor, supplies, documents, food, water, clothing, and chargers packed and rotated.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
