function renderPreview(cv) {
  const preview = document.getElementById("previewContainer");
  if (!preview) return;
  const template = atsTemplate(cv);
  preview.innerHTML = template;
}
