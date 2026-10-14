import { useMemo, useState } from "react";
import {
  ArrowRight, BookOpen, BrainCircuit, BriefcaseBusiness, Check,
  CheckCircle2, ChevronDown, CircleHelp, Clock3, Code2, Compass,
  Flame, GraduationCap, LayoutDashboard, Lightbulb, ListChecks,
  Menu, Search, Sparkles, Target, TrendingUp, UserRound, Upload, X
} from "lucide-react";

const ROLE_SKILLS = {
  "Frontend Developer": [
    { name: "HTML & CSS", level: "Foundation", resource: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content" },
    { name: "JavaScript", level: "Foundation", resource: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" },
    { name: "React.js", level: "Core", resource: "https://react.dev/learn" },
    { name: "Git & GitHub", level: "Core", resource: "https://docs.github.com/en/get-started" },
    { name: "REST APIs", level: "Core", resource: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch" },
    { name: "Responsive Design", level: "Practice", resource: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design" }
  ],
  "Backend Developer": [
    { name: "Programming Fundamentals", level: "Foundation", resource: "https://developer.mozilla.org/en-US/docs/Learn_web_development" },
    { name: "Node.js", level: "Core", resource: "https://nodejs.org/en/learn" },
    { name: "REST APIs", level: "Core", resource: "https://developer.mozilla.org/en-US/docs/Web/HTTP" },
    { name: "Databases", level: "Core", resource: "https://www.mongodb.com/docs/" },
    { name: "Git & GitHub", level: "Core", resource: "https://docs.github.com/en/get-started" },
    { name: "Authentication", level: "Practice", resource: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication" }
  ],
  "Full Stack Developer": [
    { name: "HTML & CSS", level: "Foundation", resource: "https://developer.mozilla.org/en-US/docs/Learn_web_development" },
    { name: "JavaScript", level: "Foundation", resource: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" },
    { name: "React.js", level: "Core", resource: "https://react.dev/learn" },
    { name: "Node.js & Express", level: "Core", resource: "https://expressjs.com/" },
    { name: "Databases", level: "Core", resource: "https://www.mongodb.com/docs/" },
    { name: "Git & GitHub", level: "Practice", resource: "https://docs.github.com/en/get-started" }
  ],
  "Data Analyst": [
    { name: "Excel / Spreadsheets", level: "Foundation", resource: "https://support.microsoft.com/excel" },
    { name: "SQL", level: "Core", resource: "https://www.w3schools.com/sql/" },
    { name: "Python", level: "Core", resource: "https://docs.python.org/3/tutorial/" },
    { name: "Data Visualization", level: "Core", resource: "https://matplotlib.org/stable/tutorials/" },
    { name: "Statistics", level: "Foundation", resource: "https://www.khanacademy.org/math/statistics-probability" },
    { name: "Portfolio Projects", level: "Practice", resource: "https://github.com/" }
  ],
  "UI/UX Designer": [
    { name: "Design Principles", level: "Foundation", resource: "https://www.nngroup.com/articles/" },
    { name: "Figma", level: "Core", resource: "https://help.figma.com/" },
    { name: "Wireframing", level: "Core", resource: "https://www.figma.com/resource-library/" },
    { name: "Prototyping", level: "Core", resource: "https://help.figma.com/" },
    { name: "User Research", level: "Practice", resource: "https://www.nngroup.com/articles/user-research-methods/" },
    { name: "Portfolio Case Study", level: "Practice", resource: "https://www.behance.net/" }
  ]
};

const INITIAL_SKILLS = ["HTML & CSS", "JavaScript"];
const DEFAULT_GOAL = "Frontend Developer";

function buildRoadmap(role, currentSkills, hours) {
  const missing = ROLE_SKILLS[role].filter((skill) => !currentSkills.includes(skill.name));
  const topics = missing.length ? missing : ROLE_SKILLS[role];
  const weeks = Math.max(2, Math.min(12, Math.ceil(topics.length * 1.3)));
  return topics.map((skill, index) => ({
    ...skill,
    week: Math.min(weeks, Math.floor((index * weeks) / topics.length) + 1),
    task: `Learn ${skill.name} and complete one small practice exercise.`,
    estimate: `${Math.max(2, Math.round(6 / Math.max(1, hours / 3)))} hrs`,
    done: false
  }));
}

function App() {
  const [active, setActive] = useState("Overview");
  const [name, setName] = useState("Alex Student");
  const [education, setEducation] = useState("Computer Engineering Student");
  const [role, setRole] = useState(DEFAULT_GOAL);
  const [hours, setHours] = useState("6");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [bio, setBio] = useState("Curious learner focused on building practical projects and growing my career in tech.");
  const [learningStyle, setLearningStyle] = useState("Hands-on");
  const [experienceLevel, setExperienceLevel] = useState("Beginner");
  const [interests, setInterests] = useState("Web development, product thinking, design, collaboration");
  const [skills, setSkills] = useState(INITIAL_SKILLS);
  const [skillInput, setSkillInput] = useState("");
  const [generated, setGenerated] = useState(false);
  const [tasks, setTasks] = useState(() => buildRoadmap(DEFAULT_GOAL, INITIAL_SKILLS, 6));
  const [query, setQuery] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false);
  const [profileDraft, setProfileDraft] = useState({
    name: "Alex Student",
    education: "Computer Engineering Student",
    role: DEFAULT_GOAL,
    hours: "6",
    bio: "Curious learner focused on building practical projects and growing my career in tech.",
    learningStyle: "Hands-on",
    experienceLevel: "Beginner",
    interests: "Web development, product thinking, design, collaboration",
    photo: ""
  });
  const [profilePhotoError, setProfilePhotoError] = useState("");

  const targetSkills = ROLE_SKILLS[role];
  const missingSkills = targetSkills.filter((skill) => !skills.includes(skill.name));
  const matchedSkills = targetSkills.filter((skill) => skills.includes(skill.name));
  const completedCount = tasks.filter((task) => task.done).length;
  const progress = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;
  const filteredTasks = useMemo(
    () => tasks.filter((task) => `${task.name} ${task.task}`.toLowerCase().includes(query.toLowerCase())),
    [tasks, query]
  );

  function addSkill(event) {
    if (event) {
      event.preventDefault();
    }
    const value = skillInput.trim();
    if (value && !skills.some((skill) => skill.toLowerCase() === value.toLowerCase())) {
      setSkills((previous) => [...previous, value]);
    }
    setSkillInput("");
  }

  function openProfileEditor() {
    setProfileDraft({
      name,
      education,
      role,
      hours,
      bio,
      learningStyle,
      experienceLevel,
      interests,
      photo: profilePhoto
    });
    setProfilePhotoError("");
    setIsProfileEditorOpen(true);
  }

  function selectProfilePhoto(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    setProfilePhotoError("");

    if (!file) {
      return;
    }
    if (!file.type.startsWith("image/")) {
      setProfilePhotoError("Choose an image file to use as your profile photo.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setProfilePhotoError("Choose an image smaller than 5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setProfilePhotoError("The selected photo could not be read. Try another image.");
        return;
      }
      setProfileDraft((previous) => ({ ...previous, photo: reader.result }));
    };
    reader.onerror = () => setProfilePhotoError("The selected photo could not be read. Try another image.");
    reader.readAsDataURL(file);
  }

  function saveProfile(event) {
    event.preventDefault();
    const nextName = profileDraft.name.trim() || "Your profile";
    const nextRole = profileDraft.role || DEFAULT_GOAL;
    const nextHours = profileDraft.hours || "6";
    const nextBio = profileDraft.bio.trim() || "Ambitious learner building a strong foundation in tech.";
    const nextLearningStyle = profileDraft.learningStyle || "Hands-on";
    const nextExperienceLevel = profileDraft.experienceLevel || "Beginner";
    const nextInterests = profileDraft.interests.trim() || "Technology, learning, growth";

    setName(nextName);
    setEducation(profileDraft.education.trim() || "Career-focused learner");
    setRole(nextRole);
    setHours(nextHours);
    setBio(nextBio);
    setLearningStyle(nextLearningStyle);
    setExperienceLevel(nextExperienceLevel);
    setInterests(nextInterests);
    setProfilePhoto(profileDraft.photo);
    setTasks(buildRoadmap(nextRole, skills, Number(nextHours) || 3));
    setGenerated(true);
    setIsProfileEditorOpen(false);
    setActive("Overview");
  }

  function toggleSkill(skillName) {
    setSkills((previous) =>
      previous.includes(skillName)
        ? previous.filter((skill) => skill !== skillName)
        : [...previous, skillName]
    );
  }

  function generateRoadmap(event) {
    event.preventDefault();
    setTasks(buildRoadmap(role, skills, Number(hours) || 3));
    setGenerated(true);
    setActive("Roadmap");
  }

  function toggleTask(skillName) {
    setTasks((previous) => previous.map((task) =>
      task.name === skillName ? { ...task, done: !task.done } : task
    ));
  }

  const navItems = [
    { name: "Overview", icon: LayoutDashboard },
    { name: "My Skills", icon: BrainCircuit },
    { name: "Roadmap", icon: Compass },
    { name: "Resources", icon: BookOpen }
  ];

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><Sparkles size={21} /></div>
          <div><strong>PathPilot</strong><span>CAREER COMPANION</span></div>
          <button className="icon-button close-menu" onClick={() => setMobileMenu(false)} aria-label="Close menu"><X size={19} /></button>
        </div>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="nav-list">
          {navItems.map(({ name: item, icon: Icon }) => (
            <button key={item} type="button" className={`nav-item ${active === item ? "active" : ""}`} aria-current={active === item ? "page" : undefined} onClick={() => { setActive(item); setMobileMenu(false); }}>
              <Icon size={18} /><span>{item}</span>{item === "Roadmap" && <span className="nav-count">{tasks.length}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon"><Lightbulb size={18} /></div>
            <strong>Small steps add up.</strong>
            <p>Build a habit of learning a little every day.</p>
          </div>
          <button type="button" className="profile-mini" onClick={openProfileEditor} aria-label="Edit profile">
            <div className="avatar">{profilePhoto ? <img src={profilePhoto} alt="" /> : (name.trim()[0] || "A").toUpperCase()}</div>
            <div className="profile-mini-text"><strong>{name || "Your profile"}</strong><span>{education || "Student account"}</span></div>
            <ChevronDown size={16} className="muted" />
          </button>
        </div>
      </aside>
      {mobileMenu && <button type="button" className="sidebar-backdrop" onClick={() => setMobileMenu(false)} aria-label="Close navigation menu" />}

      <main className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-menu-button" onClick={() => setMobileMenu(true)} aria-label="Open menu"><Menu size={20} /></button>
          <div className="breadcrumb">Workspace <span>/</span> <strong>{active}</strong></div>
          <div className="topbar-right"><span className="status-dot"></span><span className="saved-label">Your progress is saved in this session</span><div className="top-avatar">{profilePhoto ? <img src={profilePhoto} alt="" /> : (name.trim()[0] || "A").toUpperCase()}</div></div>
        </header>

        <div className="page-content">
          {active === "Overview" && (
            <>
              <section className="welcome-row">
                <div>
                  <div className="eyebrow"><Sparkles size={14} /> YOUR PERSONAL CAREER SPACE</div>
                  <h1>Build your next chapter{name ? `, ${name.split(" ")[0]}` : ""}.</h1>
                  <p className="subtitle">Know your strengths, close your skill gaps, and take the next step toward your career.</p>
                </div>
                <div className="welcome-actions">
                  <button type="button" className="secondary-button" onClick={openProfileEditor}>Edit profile</button>
                  <button className="primary-button" onClick={() => setActive("My Skills")}>Build my roadmap <ArrowRight size={17} /></button>
                </div>
              </section>

              <section className="hero-card">
                <div className="hero-copy">
                  <span className="hero-pill"><Sparkles size={13} /> YOUR CAREER PLAN</span>
                  <h2>Turn your goal into<br />a plan you can follow.</h2>
                  <p>{bio}</p>
                  <button className="hero-button" onClick={() => setActive("My Skills")}>Personalize my plan <ArrowRight size={16} /></button>
                </div>
                <div className="hero-art" aria-hidden="true">
                  <div className="orbit orbit-one"></div><div className="orbit orbit-two"></div>
                  <div className="art-card art-card-top"><div className="art-card-icon purple"><Target size={18} /></div><div><b>Career goal</b><span>{role}</span></div><CheckCircle2 size={18} className="art-check" /></div>
                  <div className="art-card art-card-bottom"><div className="art-card-icon green"><TrendingUp size={18} /></div><div><b>Keep moving</b><span>{progress}% roadmap complete</span></div><div className="mini-bars"><i></i><i></i><i></i><i></i><i></i></div></div>
                  <div className="floating-star"><Sparkles size={22} /></div>
                </div>
              </section>

              <section className="profile-highlights">
                <div className="highlight-card panel"><span className="highlight-label">Learning style</span><strong>{learningStyle}</strong></div>
                <div className="highlight-card panel"><span className="highlight-label">Current level</span><strong>{experienceLevel}</strong></div>
                <div className="highlight-card panel highlight-wide"><span className="highlight-label">Interests</span><strong>{interests}</strong></div>
              </section>

              <section className="stats-grid">
                <StatCard icon={Target} label="Target role" value={role} note="Your current career goal" tone="purple" />
                <StatCard icon={BrainCircuit} label="Skills you have" value={matchedSkills.length} note="Matching skills in this role" tone="blue" />
                <StatCard icon={ListChecks} label="Skills to explore" value={missingSkills.length} note="Potential learning areas" tone="orange" />
                <StatCard icon={Flame} label="Roadmap progress" value={`${progress}%`} note={`${completedCount} of ${tasks.length} tasks completed`} tone="green" />
              </section>

              <div className="content-grid">
                <section className="panel">
                  <div className="panel-heading"><div><h3>Your skill snapshot</h3><p>Skills compared with your target role</p></div><button className="text-button" onClick={() => setActive("My Skills")}>Edit skills <ArrowRight size={14} /></button></div>
                  <div className="skill-summary">
                    <div className="summary-ring" style={{ "--progress": `${Math.round((matchedSkills.length / Math.max(1, targetSkills.length)) * 100)}%` }}><div><strong>{Math.round((matchedSkills.length / Math.max(1, targetSkills.length)) * 100)}%</strong><span>matched</span></div></div>
                    <div className="summary-legend"><div><i className="legend-dot dot-purple"></i><span>Skills you have</span><strong>{matchedSkills.length}</strong></div><div><i className="legend-dot dot-gray"></i><span>Skills to learn</span><strong>{missingSkills.length}</strong></div><p>This is a planning estimate, not a formal assessment.</p></div>
                  </div>
                  <div className="skill-chip-list">{targetSkills.map((skill) => <span key={skill.name} className={`skill-chip ${skills.includes(skill.name) ? "chip-done" : ""}`}>{skills.includes(skill.name) && <Check size={12} />}{skill.name}</span>)}</div>
                </section>

                <section className="panel next-panel">
                  <div className="panel-heading"><div><h3>Next best steps</h3><p>Keep your momentum going</p></div><div className="heading-icon"><Lightbulb size={18} /></div></div>
                  {(tasks.filter((task) => !task.done).slice(0, 3)).map((task, index) => (
                    <div className="next-step" key={task.name}><div className="step-number">{String(index + 1).padStart(2, "0")}</div><div className="step-text"><strong>{task.name}</strong><span>{task.task}</span></div><button className="round-arrow" onClick={() => setActive("Roadmap")} aria-label={`Open ${task.name}`}><ArrowRight size={15} /></button></div>
                  ))}
                  {tasks.every((task) => task.done) && <p className="all-done"><CheckCircle2 size={17} /> Great work — all current roadmap tasks are complete.</p>}
                  <button className="full-width-button" onClick={() => setActive("Roadmap")}>View full roadmap <ArrowRight size={15} /></button>
                </section>
              </div>
            </>
          )}

          {active === "My Skills" && (
            <>
              <PageHeading eyebrow="YOUR STARTING POINT" title="Map your current skills." description="Tell us what you already know and where you want to go. Your roadmap will adapt to your choices." />
              <form className="panel form-panel" onSubmit={generateRoadmap}>
                <div className="form-section-title"><span className="form-icon"><UserRound size={18} /></span><div><h3>Your profile</h3><p>A little context helps personalize your plan.</p></div></div>
                <div className="form-grid">
                  <label>Full name<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" /></label>
                  <label>Education / current stage<input value={education} onChange={(e) => setEducation(e.target.value)} placeholder="e.g. Computer Engineering student" /></label>
                  <label className="full-field">Career bio<textarea rows="3" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us a little about your goals and motivation." /></label>
                  <label>Preferred learning style<select value={learningStyle} onChange={(e) => setLearningStyle(e.target.value)}><option>Hands-on</option><option>Structured</option><option>Visual</option><option>Self-paced</option></select></label>
                  <label>Current experience level<select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label>
                  <label className="full-field">Career interests<textarea rows="2" value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="e.g. Web development, product design, data storytelling" /></label>
                  <label className="full-field">Target career role<select value={role} onChange={(e) => setRole(e.target.value)}>{Object.keys(ROLE_SKILLS).map((item) => <option key={item}>{item}</option>)}</select></label>
                  <label className="full-field">Time available each week<select value={hours} onChange={(e) => setHours(e.target.value)}><option value="3">3 hours / week</option><option value="6">6 hours / week</option><option value="10">10 hours / week</option><option value="15">15 hours / week</option></select></label>
                </div>
                <div className="form-divider"></div>
                <div className="form-section-title"><span className="form-icon blue-icon"><BrainCircuit size={18} /></span><div><h3>Skills I already have</h3><p>Select the skills you feel comfortable with. You can change these later.</p></div></div>
                <div className="selectable-skills">{[...new Set(Object.values(ROLE_SKILLS).flat().map((s) => s.name))].map((skill) => <button type="button" key={skill} className={`select-skill ${skills.includes(skill) ? "selected" : ""}`} onClick={() => toggleSkill(skill)}>{skills.includes(skill) && <Check size={14} />}{skill}</button>)}</div>
                <div className="add-skill-form"><input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(e); } }} placeholder="Add another skill (e.g. Java, Canva)" /><button type="button" className="secondary-button" onClick={addSkill}>Add skill</button></div>
                <div className="form-footer"><span><CircleHelp size={15} /> Be honest — this is a learning plan, not a test.</span><button className="primary-button" type="submit"><Sparkles size={16} /> Generate my roadmap <ArrowRight size={16} /></button></div>
              </form>
            </>
          )}

          {active === "Roadmap" && (
            <>
              <PageHeading eyebrow="YOUR LEARNING JOURNEY" title="A roadmap built around you." description={`A practical starting plan for ${role}. Mark tasks complete as you learn; adjust the plan whenever your goals change.`} />
              <section className="roadmap-overview panel">
                <div className="roadmap-progress-copy"><div className="large-icon"><GraduationCap size={23} /></div><div><span className="muted-label">OVERALL PROGRESS</span><h3>{progress}% complete</h3><p>{completedCount} completed · {tasks.length - completedCount} remaining</p></div></div>
                <div className="progress-track"><span style={{ width: `${progress}%` }}></span></div>
                <div className="progress-bottom"><span><Clock3 size={14} /> About {tasks.filter((t) => !t.done).length * 4} learning hours remaining (estimate)</span><span>{role}</span></div>
              </section>
              <div className="roadmap-toolbar"><div className="search-box"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search roadmap tasks..." /></div><button className="secondary-button" onClick={generateRoadmap}><Sparkles size={15} /> Refresh roadmap</button></div>
              <section className="roadmap-list">
                {filteredTasks.map((task) => (
                  <article className={`roadmap-task panel ${task.done ? "task-complete" : ""}`} key={task.name}>
                    <button className={`task-check ${task.done ? "checked" : ""}`} onClick={() => toggleTask(task.name)} aria-label={task.done ? "Mark incomplete" : "Mark complete"}>{task.done && <Check size={16} />}</button>
                    <div className="task-main"><div className="task-meta"><span className="week-label">WEEK {task.week}</span><span className={`level-label ${task.level.toLowerCase()}`}>{task.level}</span></div><h3>{task.name}</h3><p>{task.task}</p><a href={task.resource} target="_blank" rel="noreferrer" className="resource-link"><BookOpen size={14} /> Open learning resource <ArrowRight size={13} /></a></div>
                    <div className="task-time"><Clock3 size={15} /> {task.estimate}</div>
                  </article>
                ))}
                {filteredTasks.length === 0 && <div className="empty-state panel"><Search size={24} /><strong>No matching tasks</strong><span>Try another search term.</span></div>}
              </section>
              <p className="disclaimer">This starter roadmap is generated from a built-in skill list. It is not an AI-generated or guaranteed job-placement plan yet.</p>
            </>
          )}

          {active === "Resources" && (
            <>
              <PageHeading eyebrow="LEARN & PRACTISE" title="Your learning library." description="Official documentation and beginner-friendly resources connected to your target career." />
              <div className="resource-grid">{targetSkills.map((skill) => <article className="resource-card panel" key={skill.name}><div className="resource-card-icon"><BookOpen size={20} /></div><span className="resource-level">{skill.level}</span><h3>{skill.name}</h3><p>Use this resource to study the basics, practise, and build confidence.</p><a className="resource-link" href={skill.resource} target="_blank" rel="noreferrer">Open resource <ArrowRight size={14} /></a></article>)}</div>
            </>
          )}

          <footer className="page-footer"><span>© 2026 PathPilot</span><span>Made for steady progress, not perfection.</span><span><span className="footer-dot"></span> Prototype mode</span></footer>
        </div>
      </main>

      {isProfileEditorOpen && (
        <div className="profile-modal-backdrop" onClick={() => setIsProfileEditorOpen(false)}>
          <div className="profile-modal panel" onClick={(event) => event.stopPropagation()}>
            <div className="panel-heading profile-modal-header">
              <div>
                <div className="eyebrow"><UserRound size={14} /> YOUR PROFILE</div>
                <h3>Edit your details</h3>
              </div>
              <button type="button" className="icon-button" onClick={() => setIsProfileEditorOpen(false)} aria-label="Close profile editor"><X size={18} /></button>
            </div>

            <form onSubmit={saveProfile} className="profile-editor-form">
              <div className="profile-photo-editor">
                <div className="profile-photo-preview">
                  {profileDraft.photo ? <img src={profileDraft.photo} alt="Selected profile" /> : (profileDraft.name.trim()[0] || "A").toUpperCase()}
                </div>
                <div className="profile-photo-controls">
                  <strong>Profile photo</strong>
                  <span>Choose an image up to 5 MB.</span>
                  <div className="profile-photo-actions">
                    <label className="secondary-button photo-upload-button">
                      <Upload size={15} /> Choose photo
                      <input type="file" accept="image/*" onChange={selectProfilePhoto} />
                    </label>
                    {profileDraft.photo && <button type="button" className="secondary-button" onClick={() => setProfileDraft((previous) => ({ ...previous, photo: "" }))}>Remove photo</button>}
                  </div>
                  {profilePhotoError && <span className="profile-photo-error" role="alert">{profilePhotoError}</span>}
                </div>
              </div>
              <div className="profile-grid">
                <label className="profile-field">
                  <span>Full name</span>
                  <input value={profileDraft.name} onChange={(event) => setProfileDraft((previous) => ({ ...previous, name: event.target.value }))} placeholder="Enter your name" />
                </label>
                <label className="profile-field">
                  <span>Education / stage</span>
                  <input value={profileDraft.education} onChange={(event) => setProfileDraft((previous) => ({ ...previous, education: event.target.value }))} placeholder="e.g. Computer Engineering student" />
                </label>
                <label className="profile-field full-width">
                  <span>Career bio</span>
                  <textarea rows="3" value={profileDraft.bio} onChange={(event) => setProfileDraft((previous) => ({ ...previous, bio: event.target.value }))} placeholder="Tell us a little about your goals and motivation." />
                </label>
                <label className="profile-field">
                  <span>Preferred learning style</span>
                  <select value={profileDraft.learningStyle} onChange={(event) => setProfileDraft((previous) => ({ ...previous, learningStyle: event.target.value }))}>
                    <option>Hands-on</option>
                    <option>Structured</option>
                    <option>Visual</option>
                    <option>Self-paced</option>
                  </select>
                </label>
                <label className="profile-field">
                  <span>Current experience level</span>
                  <select value={profileDraft.experienceLevel} onChange={(event) => setProfileDraft((previous) => ({ ...previous, experienceLevel: event.target.value }))}>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </label>
                <label className="profile-field full-width">
                  <span>Career interests</span>
                  <textarea rows="2" value={profileDraft.interests} onChange={(event) => setProfileDraft((previous) => ({ ...previous, interests: event.target.value }))} placeholder="e.g. Web development, product design, data storytelling" />
                </label>
                <label className="profile-field full-width">
                  <span>Target career role</span>
                  <select value={profileDraft.role} onChange={(event) => setProfileDraft((previous) => ({ ...previous, role: event.target.value }))}>
                    {Object.keys(ROLE_SKILLS).map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
                <label className="profile-field full-width">
                  <span>Time available each week</span>
                  <select value={profileDraft.hours} onChange={(event) => setProfileDraft((previous) => ({ ...previous, hours: event.target.value }))}>
                    <option value="3">3 hours / week</option>
                    <option value="6">6 hours / week</option>
                    <option value="10">10 hours / week</option>
                    <option value="15">15 hours / week</option>
                  </select>
                </label>
              </div>
              <div className="profile-editor-actions">
                <button type="button" className="secondary-button" onClick={() => setIsProfileEditorOpen(false)}>Cancel</button>
                <button type="submit" className="primary-button">Save profile</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, note, tone }) {
  return <div className="stat-card panel"><div className={`stat-icon ${tone}`}><Icon size={19} /></div><span className="stat-label">{label}</span><strong className={`stat-value ${String(value).length > 17 ? "small-value" : ""}`}>{value}</strong><span className="stat-note">{note}</span></div>;
}

function PageHeading({ eyebrow, title, description }) {
  return <section className="page-heading"><div className="eyebrow"><Sparkles size={14} /> {eyebrow}</div><h1>{title}</h1><p>{description}</p></section>;
}

export default App;
