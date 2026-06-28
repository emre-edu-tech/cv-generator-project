function atsTemplate(cv) {
  const contact = [
    cv.personal.email,
    cv.personal.phone,
    cv.personal.location,
    cv.personal.linkedin,
    cv.personal.portfolio
  ]
    .filter(Boolean)
    .join(" | ");

  return `
    <div class="cv-preview">
      <section class="cv-header">
        <h1>${escapeHtml(cv.personal.fullName)}</h1>
        <h2>${escapeHtml(cv.personal.jobTitle)}</h2>
        <div class="cv-contact">${escapeHtml(contact)}</div>
      </section>

      ${cv.personal.summary ? `<section class="cv-section cv-summary"><p>${escapeHtml(cv.personal.summary)}</p></section>` : ""}

      <section class="cv-section">
        <h3>Work Experience</h3>
        ${cv.experience.map(exp => `
          <div class="cv-item">
            <p class="cv-item-title">${escapeHtml(exp.title)} — ${escapeHtml(exp.company)}</p>
            <p class="cv-item-meta">${escapeHtml(exp.location)} · ${escapeHtml(formatDateRange(exp.startDate, exp.endDate))}</p>
            ${exp.bullets && exp.bullets.length > 0 ? `<ul>${exp.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : ""}
          </div>
        `).join("")}
      </section>

      <section class="cv-section">
        <h3>Education</h3>
        ${cv.education.map(item => `
          <div class="cv-item">
            <p class="cv-item-title">${escapeHtml(item.degree)}</p>
            <p class="cv-item-meta">${escapeHtml(item.institution)} · ${escapeHtml(item.year)}</p>
          </div>
        `).join("")}
      </section>

      <section class="cv-section">
        <h3>Skills</h3>
        <ul class="cv-chips">
          ${cv.skills.map(skill => `<li>${escapeHtml(skill)}</li>`).join("")}
        </ul>
      </section>

      ${cv.projects && cv.projects.length > 0 ? `
        <section class="cv-section">
          <h3>Projects</h3>
          ${cv.projects.map(project => `
            <div class="cv-item">
              <p class="cv-item-title">${escapeHtml(project.name)}</p>
              <p class="cv-item-meta">${escapeHtml(project.link)}</p>
              <p>${escapeHtml(project.description)}</p>
            </div>
          `).join("")}
        </section>
      ` : ""}

      ${cv.certifications && cv.certifications.length > 0 ? `
        <section class="cv-section">
          <h3>Certifications</h3>
          ${cv.certifications.map(cert => `
            <div class="cv-item">
              <p class="cv-item-title">${escapeHtml(cert.title)}</p>
              <p class="cv-item-meta">${escapeHtml(cert.issuer)} · ${escapeHtml(cert.year)}</p>
            </div>
          `).join("")}
        </section>
      ` : ""}

      ${cv.languages && cv.languages.length > 0 ? `
        <section class="cv-section">
          <h3>Languages</h3>
          <p>${escapeHtml(cv.languages.join(", "))}</p>
        </section>
      ` : ""}
    </div>
  `;
}

function escapeHtml(value) {
  if (!value && value !== 0) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDateRange(start, end) {
  if (!start && !end) return "";
  const startText = start ? start.replace("-", "/") : "";
  const endText = end ? end.replace("-", "/") : "Present";
  return `${startText} — ${endText}`;
}
