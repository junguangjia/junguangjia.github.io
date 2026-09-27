---
permalink: /teaching/
title: "Teaching"
description: "Teaching by Junguang Jia: teaching assistant positions and course notes."
author_profile: true
---

{% assign positions = site.data.teaching.positions %}
{% assign notes = site.data.teaching.notes %}
{% if positions.size > 0 or notes.size > 0 %}
{% if positions.size > 0 %}
## Teaching Assistant

{% for p in positions %}
<div class="entry">
  <div class="entry__head">
    <h3 class="entry__title">{{ p.course }}{% if p.code %} <span class="entry__subtitle">{{ p.code }}</span>{% endif %}</h3>
    {% if p.term %}<span class="entry__dates">{{ p.term }}</span>{% endif %}
  </div>
  {% capture line %}{% if p.role %}{{ p.role }}{% endif %}{% if p.institution %}{% if p.role %}, {% endif %}{{ p.institution }}{% endif %}{% if p.instructor %}; instructor: {{ p.instructor }}{% endif %}{% endcapture %}
  {% if line != "" %}<p class="entry__meta">{{ line | strip }}</p>{% endif %}
  {% if p.description %}<div class="entry__desc">{{ p.description | markdownify }}</div>{% endif %}
  {% if p.links and p.links.size > 0 %}<p class="entry__links">{% for link in p.links %}<a href="{{ link.url }}">{{ link.label }}</a>{% unless forloop.last %} · {% endunless %}{% endfor %}</p>{% endif %}
</div>
{% endfor %}
{% endif %}
{% if notes.size > 0 %}
## Notes

{% for n in notes %}
<div class="entry">
  <div class="entry__head">
    <h3 class="entry__title">{% if n.url %}<a href="{{ n.url }}">{{ n.title }}</a>{% else %}{{ n.title }}{% endif %}</h3>
    {% if n.date %}<span class="entry__dates">{{ n.date }}</span>{% endif %}
  </div>
  {% if n.course %}<p class="entry__meta">{{ n.course }}</p>{% endif %}
  {% if n.description %}<div class="entry__desc">{{ n.description | markdownify }}</div>{% endif %}
</div>
{% endfor %}
{% endif %}
{% else %}
Teaching assistant positions and course notes will be listed here.
{% endif %}
