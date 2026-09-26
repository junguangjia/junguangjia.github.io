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
  {{ entry.degree }}{% if entry.detail %}, {{ entry.detail }}{% endif %}{% if entry.note %}<br>
  {{ entry.note }}{% endif %}
{% endfor %}

## Research Interests

* Probability theory
* Computational statistics
* Statistical machine learning

## Selected Coursework

**Ph.D.-level coursework, Columbia University**

* Computational Statistics (STAT GR6104)
* Probabilistic Models and Machine Learning (STCS GR6701), in progress
* Optimization I (IEOR E6613), in progress

**Advanced statistics, Columbia University**

* Honors Probability Theory
* Honors Statistical Inference
* Honors Linear Regression Models
* Bayesian Statistics
* Stochastic Processes – Applications I
* Time Series Analysis
* Unsupervised Learning, in progress

**Mathematics, UC San Diego**

* Introduction to Analysis II

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

## Work Experience

{% for job in site.data.experience %}
* **{{ job.organization }}**, {{ job.location }}, {{ job.dates }}<br>
  {{ job.role }}
{% for bullet in job.bullets %}
  * {{ bullet }}
{% endfor %}
{% endfor %}

## Technical Skills

* **Programming:** Python, R, SQL, Julia, TypeScript
* **Web and data:** React, Next.js, Node.js, PostgreSQL, Apache Spark
* **Cloud and DevOps:** AWS (database services), Docker, Linux, GitHub Actions
* **Tools:** Git, Tableau, LaTeX

## Contact

* Email: [junguang.jia@columbia.edu](mailto:junguang.jia@columbia.edu)
* GitHub: [github.com/junguangjia](https://github.com/junguangjia)
