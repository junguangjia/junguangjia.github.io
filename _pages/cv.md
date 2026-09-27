---
permalink: /cv/
title: "CV"
description: "Curriculum vitae of Junguang Jia, M.A. student in Statistics at Columbia University."
author_profile: true
cv_updated: "Sep. 2026"
redirect_from:
  - /resume/
---

{% include base_path %}
{% comment %}
  The fragment asks the browser's PDF viewer to hide its page-thumbnail
  sidebar (navpanes=0 in Chrome and Edge, pagemode=none in Firefox) and to fit
  the page to the frame width (view=FitH).
{% endcomment %}
{% assign cv_pdf = site.static_files | where: "path", "/files/Junguang_Jia_CV.pdf" | first %}
{% if cv_pdf %}
<p class="cv-download"><a href="{{ base_path }}/files/Junguang_Jia_CV.pdf">Download CV here (Last update: {{ page.cv_updated }})</a></p>

<div class="cv-embed">
  <iframe src="{{ base_path }}/files/Junguang_Jia_CV.pdf#navpanes=0&amp;pagemode=none&amp;view=FitH" title="CV of Junguang Jia (PDF)" loading="lazy"></iframe>
</div>
{% endif %}
