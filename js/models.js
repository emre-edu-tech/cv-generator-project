const defaultCV = {
  personal: {
    fullName: "Alex Johnson",
    jobTitle: "Frontend Developer",
    email: "alex@example.com",
    phone: "+1 234 567 890",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alex",
    portfolio: "alex.dev",
    summary: "Frontend developer with 5+ years of experience building accessible and maintainable web applications."
  },
  experience: [
    {
      company: "Tech Corp",
      location: "Remote",
      title: "Senior Frontend Developer",
      startDate: "2022-01",
      endDate: "Present",
      bullets: [
        "Built a reusable component library for the product team.",
        "Improved page load times by 30% through performance optimizations."
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
  skills: ["JavaScript", "HTML", "CSS", "React", "Git"],
  projects: [
    {
      name: "ATS CV Builder",
      description: "Created an ATS-friendly resume builder with live preview and PDF export.",
      link: "github.com/example/cv-builder"
    }
  ],
  certifications: [
    {
      title: "Certified Frontend Developer",
      issuer: "Online Academy",
      year: "2024"
    }
  ],
  languages: ["English (native)", "Spanish (intermediate)"]
};

function deepCopyCV(cv) {
  return JSON.parse(JSON.stringify(cv));
}

function validateCV(cv) {
  if (!cv.personal || !cv.personal.fullName) {
    return { valid: false, message: "Please add your full name." };
  }
  if (!cv.personal.email) {
    return { valid: false, message: "Please add your email address." };
  }
  return { valid: true, message: "OK" };
}
