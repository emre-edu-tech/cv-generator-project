# CV Generator Application

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