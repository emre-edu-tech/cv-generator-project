# CV Generator Application - Technical Spec (Without Backend)

Specifications for building a pure HTML/CSS/JS CV generator with these features below:

**Important Note:** My main goal was to create an ATS software but because it is a very complex system, I decided to create an ATS Compatible CV Generator application.

## What is an Application Tracking System (ATS)?
ATS automatically scans, sorts and ranks CVs based on how well they match the job requirements. It looks for specific keywords, skills, and job titles.

**Note:** The system's job is to scan the RAW text, and complex formatting often breaks the parsing process.

### Project Development
I have a project idea. I'd like to create an ATS (Applicant Tracking System) compatible CV generator. ATS uses a technology called **resume parsing**. The formatting of a CV should not be complex for the ATS parser. Some of the specifications of an ATS compatible CV should be as follows:
1. CV should have single-column layout.
2. CV layout should not include tables, columns, text boxes and etc.
3. CV should stick with the common fonts like Arial, Calibri, or Times New Roman.
4. CV should have standard sections like **Work Experience**, **Education**, and **Skills**.
5. ATS software reads **.docx** and **.pdf** files most reliably so our application will export the CVs in those formats only.

### Application Features
Since I won't build an ATS, at first I will not need a backend with a database. However, when I decide to build a simple ATS then I can think of creating a **resume parser**.

Roadmap (application will be developed according to phases, do not jump another phase before completing the current one):
1. Phase 1: ATS-Compatible CV Builder
    - Drag-and-drop single-column CV templates (I do not know how I should gather these pre-tested templates)
    - Live-preview + PDF/.docx export
2. Phase 2: ATS Score Checker (I do not know how to start building this feature yet)
    - Paste a job description, CV will get scored (keyword matching, formatting issues)
3. Phase 3: Premium Features (These will be developed after developing the MVP)
    - Simple **Admin Panel** for applications (interview, offer, rejected statuses like a Kanban Board)
    - Auto-fill application forms (Very important but I do not know if it is doable since there are my types of application forms - maybe a browser extension that fills job portal application forms using CV data)

### Best Possible and Quickest To-Do List
Build the simplest possible CV generator at first.
- 3 Templates (Where to find or Shall I build it on my own?)
- Manual text input
- PDF Export

Add these features below if MVP is successful.
- **ATS Score**: Simple keyword overlap calculation - It will be great if it is accurate enough.

### Tech Stack for CV Generator
- For the beginning it should be simple and client-side only.
- Pure HTML/CSS/JS

## Technical Architecture Blueprint
This blueprint can be used to be fed to a coding agent.

### Project Structure (MVP)
```
cv-generator/
├── index.html          # Main layout (sidebar + preview)
├── css/
│   └── styles.css      # Responsive, print-friendly, ATS-safe
├── js/
│   ├── app.js          # Main controller, event binding, state
│   ├── models.js       # Data structure (CV object)
│   ├── templates.js    # HTML templates for different CV styles
│   ├── renderer.js     # Renders CV preview from data + template
│   ├── exporter.js     # PDF export (html2pdf.js? no – use browser print)
│   └── storage.js      # LocalStorage save/load/autosave
└── assets/ (optional)  # Icons, placeholder avatar
```

### Core Data Model (models.js)
These below will be the main fields that should be filled by the user for their CVs. Fields can be changed later.
```javascript
// Single source of truth for the CV
const defaultCV = {
  personal: {
    fullName: "Alex Johnson",
    jobTitle: "Frontend Developer",
    email: "alex@example.com",
    phone: "+1 234 567 890"a
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alex",
    portfolio: "alex.dev",
    summary: "Frontend developer with 5+ years experience..."
  },
  experience: [
    {
      company: "Tech Corp",
      location: "Remote",
      title: "Senior Frontend Dev",
      startDate: "2022-01",
      endDate: "Present",
      bullets: [
        "Built component library used by 10+ teams",
        "Reduced bundle size by 35%"
      ]
    }
  ],
  education: [
    {
      degree: "BSc Computer Science",
      institution: "University of Example",
      year: "2018"
    }
  ],
  skills: ["JavaScript", "React", "CSS", "Git"],
  projects: [
    {
      name: "ATS CV Builder",
      description: "Web app with 2k+ users",
      link: "github.com/..."
    }
  ],
  certifications: [],
  languages: ["English (native)", "Spanish (intermediate)"]
};
```

### Component Responsibilities
| File | Role | Key Functions |
|------|------|---------------|
| `model.js` | Define default data & validation | `validateCV(cv), deepCopy()` |
| `storage.js` | Persist user progress | `saveToLocalStorage(), loadFromLocalStorage(), autoSave()` |
| `templates.js` | HTML strings for CV layouts | `renderTemplate1(), renderTemplate2()` - single-column ATS-friendly |
| `renderer.js` | Inject template into preview iframe/DOM | `updatePreview(cv, templateId), refresh()` |
| `exporter.js` | Generate PDF via print | `exportAsPDF()` -> triggers `window.print()` with print-optimized CSS |
| `app.js` | Orchestrate UI events, forms, live updates | `init()`, bind input listeners, handle template switching |

### UI Layout
┌─────────────────────────────────────────────┐
│  [Template Selector]  [Save] [Load] [PDF]   │
├─────────────────┬───────────────────────────┤
│                 │                           │
│   EDITOR SIDEBAR│      CV PREVIEW           │
│   (Forms)       │      (live iframe/div)    │
│                 │                           │
│  - Personal     │                           │
│  - Experience   │                           │
│  - Education    │                           │
│  - Skills       │                           │
│  - Projects     │                           │
│  + Add Section  │                           │
│                 │                           │
└─────────────────┴───────────────────────────┘

- **Editor sidebar** uses plain `<input>`, `<textarea>`, and dynamic lists (buttons to add/remove entries inside CV).
- **Preview** updates on every keystroke (debounced - preventing the excessive triggering of the update functions).
- **No authentication** for the beginning (will be added after development of MVP) - all data stays in `localStorage` for now.

### PDF Export Strategy (no libraries - print friendly CSS)
Here main goal will be to create a print-friendly CSS file to support PDF export. I do not need any CSS library for this. Just use vanilla CSS. Then when the user chooses "Save as PDF", CV can be exported using a small JavaScript code. (For now, there is no dependency.)

### LocalStorage Autosave (storage.js)
The code below is just an example. It was added just for reference. As you may see, this is not even a complete script.
```javascript
const STORAGE_KEY = "cv_generator_data";

function autoSave(cv) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cv));
}

function loadFromStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : defaultCV;   // defaultCV is the Core Data Model for a CV in JSON representation
}
```
`autoSave()` will be called after any CV update. (debounced)

### ATS Compatibility Checklist
CV Templates must enforce the following features:
- Single column layout
- Standard headings: `Work Experience`, `Education`, `Skills`
- No tables or graphics in main content
- Font: Arial, Calibri, or Georgia (safe)
- No text boxes or `position: absolute` for content

### Example Template HTML Structure (templates.js)
```javascript
function atsTemplate1(cv) {
  return `
    <div class="cv-container">
      <h1>${cv.personal.fullName}</h1>
      <h2>${cv.personal.jobTitle}</h2>
      <div class="contact">${cv.personal.email} | ${cv.personal.contact}</div>
      <div class="summary">${cv.personal.summary}</div>

      <h3>Work Experience</h3>
      ${cv.experience.map(exp => `
        <div class="job">
          <div><strong>${exp.title}</strong> at ${exp.company}</div>
          <div>${exp.startDate} - ${exp.endDate}</div>
          <ul>${exp.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
        </div>
      `).join('')}

      <h3>Skills</h3>
      <ul>${cv.skills.map(s => `<li>${s}</li>`).join('')}</ul>
    </div>
  `;
}
```