const form = document.getElementById("cvForm");
const experienceItems = document.getElementById("experienceItems");
const educationItems = document.getElementById("educationItems");
const projectItems = document.getElementById("projectItems");
const certificationItems = document.getElementById("certificationItems");
const skillsList = document.getElementById("skillsList");
const skillInput = document.getElementById("skillInput");
const languagesInput = document.getElementById("languagesInput");
const btnSave = document.getElementById("btnSave");
const btnLoad = document.getElementById("btnLoad");
const btnReset = document.getElementById("btnReset");
const btnExport = document.getElementById("btnExport");
const btnAddExperience = document.getElementById("btnAddExperience");
const btnAddEducation = document.getElementById("btnAddEducation");
const btnAddProject = document.getElementById("btnAddProject");
const btnAddCertification = document.getElementById("btnAddCertification");

let currentCV = deepCopyCV(defaultCV);
let debounceTimer = null;

function init() {
  attachFormListeners();
  attachButtonListeners();
  loadInitialData();
  renderForm();
  renderPreview(currentCV);
}

function loadInitialData() {
  const stored = loadFromLocalStorage();
  if (stored) {
    currentCV = { ...deepCopyCV(defaultCV), ...stored };
  }
}

function attachFormListeners() {
  form.addEventListener("input", event => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;

    if (target.name.startsWith("personal.")) {
      const key = target.name.split(".")[1];
      currentCV.personal[key] = target.value;
    }

    if (target.name === "languages") {
      currentCV.languages = target.value
        .split(",")
        .map(item => item.trim())
        .filter(Boolean);
    }

    triggerUpdate();
  });

  btnAddExperience.addEventListener("click", () => {
    currentCV.experience.push({
      company: "",
      location: "",
      title: "",
      startDate: "",
      endDate: "",
      bullets: [""],
    });
    renderForm();
    triggerUpdate();
  });

  btnAddEducation.addEventListener("click", () => {
    currentCV.education.push({ degree: "", institution: "", year: "" });
    renderForm();
    triggerUpdate();
  });

  btnAddProject.addEventListener("click", () => {
    currentCV.projects.push({ name: "", description: "", link: "" });
    renderForm();
    triggerUpdate();
  });

  btnAddCertification.addEventListener("click", () => {
    currentCV.certifications.push({ title: "", issuer: "", year: "" });
    renderForm();
    triggerUpdate();
  });

  experienceItems.addEventListener("input", event => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;
    const index = Number(target.dataset.index);
    const field = target.dataset.field;
    if (Number.isNaN(index) || !field) return;

    if (field.startsWith("bullet")) {
      const bulletIndex = Number(target.dataset.bulletIndex);
      currentCV.experience[index].bullets[bulletIndex] = target.value;
    } else {
      currentCV.experience[index][field] = target.value;
    }

    triggerUpdate();
  });

  educationItems.addEventListener("input", event => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    const index = Number(target.dataset.index);
    const field = target.dataset.field;
    if (Number.isNaN(index) || !field) return;
    currentCV.education[index][field] = target.value;
    triggerUpdate();
  });

  projectItems.addEventListener("input", event => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;
    const index = Number(target.dataset.index);
    const field = target.dataset.field;
    if (Number.isNaN(index) || !field) return;
    currentCV.projects[index][field] = target.value;
    triggerUpdate();
  });

  certificationItems.addEventListener("input", event => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    const index = Number(target.dataset.index);
    const field = target.dataset.field;
    if (Number.isNaN(index) || !field) return;
    currentCV.certifications[index][field] = target.value;
    triggerUpdate();
  });

  skillsList.addEventListener("click", event => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) return;
    const index = Number(target.dataset.index);
    if (Number.isNaN(index)) return;
    currentCV.skills.splice(index, 1);
    renderSkills();
    triggerUpdate();
  });

  skillInput.addEventListener("keydown", event => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    const value = skillInput.value.trim();
    if (!value) return;
    currentCV.skills.push(value);
    skillInput.value = "";
    renderSkills();
    triggerUpdate();
  });
}

function attachButtonListeners() {
  btnSave.addEventListener("click", () => {
    saveToLocalStorage(currentCV);
    alert("CV saved locally.");
  });

  btnLoad.addEventListener("click", () => {
    const stored = loadFromLocalStorage();
    if (stored) {
      currentCV = { ...deepCopyCV(defaultCV), ...stored };
      renderForm();
      triggerUpdate(true);
      alert("Loaded saved CV.");
    } else {
      alert("No saved CV found.");
    }
  });

  btnReset.addEventListener("click", () => {
    if (!confirm("Reset the form and preview to default values?")) return;
    currentCV = deepCopyCV(defaultCV);
    clearLocalStorage();
    renderForm();
    triggerUpdate(true);
  });

  btnExport.addEventListener("click", () => {
    const validation = validateCV(currentCV);
    if (!validation.valid) {
      alert(validation.message);
      return;
    }
    exportAsPDF();
  });
}

function renderForm() {
  renderPersonalFields();
  renderExperienceFields();
  renderEducationFields();
  renderProjectFields();
  renderCertificationFields();
  renderSkills();
  renderLanguageField();
}

function renderPersonalFields() {
  Object.entries(currentCV.personal).forEach(([key, value]) => {
    const field = form.querySelector(`[name="personal.${key}"]`);
    if (field) field.value = value;
  });
}

function renderExperienceFields() {
  experienceItems.innerHTML = "";
  currentCV.experience.forEach((item, index) => {
    const container = document.createElement("div");
    container.className = "section-item";
    container.innerHTML = `
      <div class="item-header">
        <h4>Experience ${index + 1}</h4>
        <button type="button" class="remove-item" data-action="remove-experience" data-index="${index}">Remove</button>
      </div>
      <label>Job Title<input data-index="${index}" data-field="title" type="text" value="${item.title}" /></label>
      <label>Company<input data-index="${index}" data-field="company" type="text" value="${item.company}" /></label>
      <label>Location<input data-index="${index}" data-field="location" type="text" value="${item.location}" /></label>
      <label>Start Date<input data-index="${index}" data-field="startDate" type="month" value="${item.startDate}" /></label>
      <label>End Date<input data-index="${index}" data-field="endDate" type="month" value="${item.endDate}" /></label>
      <div class="bullets" data-index="${index}">
        ${item.bullets.map((bullet, bulletIndex) => `
          <label>Bullet ${bulletIndex + 1}
            <input data-index="${index}" data-field="bullet" data-bullet-index="${bulletIndex}" type="text" value="${bullet}" />
          </label>
        `).join("")}
        <button type="button" class="add-item" data-action="add-experience-bullet" data-index="${index}">+ Add bullet</button>
      </div>
    `;
    experienceItems.appendChild(container);
  });

  experienceItems.querySelectorAll("button[data-action='remove-experience']").forEach(button => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);
      currentCV.experience.splice(index, 1);
      renderForm();
      triggerUpdate();
    });
  });

  experienceItems.querySelectorAll("button[data-action='add-experience-bullet']").forEach(button => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);
      currentCV.experience[index].bullets.push("");
      renderForm();
      triggerUpdate();
    });
  });
}

function renderEducationFields() {
  educationItems.innerHTML = "";
  currentCV.education.forEach((item, index) => {
    const container = document.createElement("div");
    container.className = "section-item";
    container.innerHTML = `
      <div class="item-header">
        <h4>Education ${index + 1}</h4>
        <button type="button" class="remove-item" data-action="remove-education" data-index="${index}">Remove</button>
      </div>
      <label>Degree<input data-index="${index}" data-field="degree" type="text" value="${item.degree}" /></label>
      <label>Institution<input data-index="${index}" data-field="institution" type="text" value="${item.institution}" /></label>
      <label>Year<input data-index="${index}" data-field="year" type="text" value="${item.year}" /></label>
    `;
    educationItems.appendChild(container);
  });

  educationItems.querySelectorAll("button[data-action='remove-education']").forEach(button => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);
      currentCV.education.splice(index, 1);
      renderForm();
      triggerUpdate();
    });
  });
}

function renderProjectFields() {
  projectItems.innerHTML = "";
  currentCV.projects.forEach((item, index) => {
    const container = document.createElement("div");
    container.className = "section-item";
    container.innerHTML = `
      <div class="item-header">
        <h4>Project ${index + 1}</h4>
        <button type="button" class="remove-item" data-action="remove-project" data-index="${index}">Remove</button>
      </div>
      <label>Name<input data-index="${index}" data-field="name" type="text" value="${item.name}" /></label>
      <label>Link<input data-index="${index}" data-field="link" type="text" value="${item.link}" /></label>
      <label>Description<textarea data-index="${index}" data-field="description" rows="2">${item.description}</textarea></label>
    `;
    projectItems.appendChild(container);
  });

  projectItems.querySelectorAll("button[data-action='remove-project']").forEach(button => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);
      currentCV.projects.splice(index, 1);
      renderForm();
      triggerUpdate();
    });
  });
}

function renderCertificationFields() {
  certificationItems.innerHTML = "";
  currentCV.certifications.forEach((item, index) => {
    const container = document.createElement("div");
    container.className = "section-item";
    container.innerHTML = `
      <div class="item-header">
        <h4>Certification ${index + 1}</h4>
        <button type="button" class="remove-item" data-action="remove-certification" data-index="${index}">Remove</button>
      </div>
      <label>Title<input data-index="${index}" data-field="title" type="text" value="${item.title}" /></label>
      <label>Issuer<input data-index="${index}" data-field="issuer" type="text" value="${item.issuer}" /></label>
      <label>Year<input data-index="${index}" data-field="year" type="text" value="${item.year}" /></label>
    `;
    certificationItems.appendChild(container);
  });

  certificationItems.querySelectorAll("button[data-action='remove-certification']").forEach(button => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);
      currentCV.certifications.splice(index, 1);
      renderForm();
      triggerUpdate();
    });
  });
}

function renderSkills() {
  skillsList.innerHTML = "";
  currentCV.skills.forEach((skill, index) => {
    const chip = document.createElement("span");
    chip.className = "tag-pill";
    chip.innerHTML = `${skill} <button type="button" data-index="${index}" aria-label="Remove skill">×</button>`;
    skillsList.appendChild(chip);
  });
}

function renderLanguageField() {
  languagesInput.value = currentCV.languages.join(", ");
}

function triggerUpdate(force = false) {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  if (force) {
    updatePreviewAndSave();
    return;
  }
  debounceTimer = window.setTimeout(() => {
    updatePreviewAndSave();
  }, 250);
}

function updatePreviewAndSave() {
  if (!renderPreview) return;
  renderPreview(currentCV);
  saveToLocalStorage(currentCV);
}

function exportAsPDF() {
  const basePath = location.href.substring(0, location.href.lastIndexOf("/") + 1);
  const printWindow = window.open("", "PRINT", "height=800,width=1000");
  if (!printWindow) {
    alert("Unable to open print window. Please allow popups and try again.");
    return;
  }

  const html = `
    <html>
      <head>
        <base href="${basePath}">
        <title>${currentCV.personal.fullName} - CV</title>
        <link rel="stylesheet" href="css/styles.css" />
        <style>body { margin: 0; padding: 24px; }</style>
      </head>
      <body>${atsTemplate(currentCV)}</body>
      <script>
        window.onload = function() {
          window.focus();
          window.print();
          window.close();
        };
      </script>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}

init();
