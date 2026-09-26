---
permalink: /cv/
title: "Curriculum Vitae"
description: "Curriculum vitae of Junguang Jia, M.A. student in Statistics at Columbia University."
author_profile: true
redirect_from:
  - /resume/
---

{% include base_path %}
{% assign cv_pdf = site.static_files | where: "path", "/files/Junguang_Jia_CV.pdf" | first %}
{% if cv_pdf %}
<p><a href="{{ base_path }}/files/Junguang_Jia_CV.pdf" class="btn btn--inverse"><i class="fas fa-fw fa-file-pdf" aria-hidden="true"></i> Download CV (PDF)</a></p>
{% endif %}

## Education

{% for entry in site.data.education %}
* **{{ entry.institution }}**, {{ entry.dates }}<br>
  {{ entry.degree }}{% if entry.detail %}, {{ entry.detail }}{% endif %}
{% endfor %}

## Research Interests

* Probability theory
* Computational statistics
* Statistical machine learning

## Projects

{% for project in site.data.projects.academic %}
* **{{ project.title }}**{% if project.subtitle %}: {{ project.subtitle }}{% endif %}<br>
  {{ project.meta }}
{% endfor %}
{% for project in site.data.projects.independent %}
* **{{ project.title }}**{% if project.subtitle %}: {{ project.subtitle }}{% endif %}<br>
  {{ project.meta }}
{% endfor %}

See [Research & Projects]({{ base_path }}/research/) for descriptions.

## Technical Skills

* Julia (statistical computing and reproducible experiments)
* TypeScript and JavaScript (Next.js/React, Node.js)
* PostgreSQL

## Contact

* Email: [jj3445@columbia.edu](mailto:jj3445@columbia.edu)
* GitHub: [github.com/junguangjia](https://github.com/junguangjia)
