/* Fieldwork route map. Ported from the approved simplified preview
   (simple-map-v2-20260928). Data: data.js, assembled from data/ by
   rebuild-data.py. Interaction is ordinary pan and zoom only. */
(function () {
  'use strict';
  var el = document.getElementById('map');
  var g = window.FIELD_MAP_DATA;
  if (!window.L || !g) {
    el.innerHTML = '<p class="unavailable">The map could not be loaded.</p>';
    return;
  }

  var ll = function (c) { return [c[1], c[0]]; };
  var colors = {};
  g.trips.forEach(function (t) { colors[t.id] = t.color; });
  var routes = g.routes.features.map(function (f) {
    return { id: f.properties.id, trip: f.properties.trip, mode: f.properties.mode, coords: f.geometry.coordinates };
  });
  var places = g.places.features.map(function (f) {
    var p = f.properties;
    return { name: p.name, region: p.region, trip: p.trip, priority: p.priority, coord: f.geometry.coordinates };
  });

  /* Legend: one entry per trip, in data order. */
  var legend = document.querySelector('.legend');
  var tripList = legend.querySelector('.trip-legend');
  g.trips.forEach(function (t) {
    var li = document.createElement('li');
    li.className = 'key';
    var sw = document.createElement('i');
    sw.className = 'swatch';
    sw.style.setProperty('--c', t.color);
    li.appendChild(sw);
    li.appendChild(document.createTextNode(t.label));
    tripList.appendChild(li);
  });
  legend.hidden = false;

  var map = L.map(el, {
    center: [35, 109], zoom: 4, zoomControl: true, attributionControl: true,
    zoomSnap: 0.1, zoomDelta: 0.5, minZoom: 2.5, maxZoom: 8.5,
    scrollWheelZoom: false, zoomAnimation: false, fadeAnimation: false
  });
  map.attributionControl.setPrefix('<a href="https://leafletjs.com/" target="_blank" rel="noopener">Leaflet</a>');
  map.attributionControl.addAttribution(
    '<a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener">Natural Earth</a> · ' +
    '<a href="https://www.geonames.org/" target="_blank" rel="noopener">GeoNames</a>');

  /* Basemap: Natural Earth land and country boundary lines. */
  L.geoJSON(g.land, { interactive: false, style: { fillColor: '#F9F9F5', fillOpacity: 1, color: '#B8C8CE', weight: 0.75, smoothFactor: 0.2 } }).addTo(map);
  L.geoJSON(g.borders, { interactive: false, style: { color: '#C6D0D3', weight: 0.7, opacity: 0.9, dashArray: null } }).addTo(map);

  /* Two-point flights are drawn as a gentle arc (in projected space). */
  function arc(coords) {
    if (coords.length !== 2) return coords;
    var crs = map.options.crs;
    var p1 = crs.project(L.latLng(ll(coords[0]))), p2 = crs.project(L.latLng(ll(coords[1])));
    var dx = p2.x - p1.x, dy = p2.y - p1.y, out = [];
    for (var i = 0; i <= 60; i++) {
      var t = i / 60, k = Math.sin(Math.PI * t) * 0.17;
      var v = crs.unproject(L.point(p1.x + dx * t - dy * k, p1.y + dy * t + dx * k));
      out.push([v.lng, v.lat]);
    }
    return out;
  }

  /* Routes: white casing under a coloured line; dashed = flight, solid = ground. */
  var routeLines = [];
  routes.forEach(function (r) {
    var coords = (r.mode === 'flight' ? arc(r.coords) : r.coords).map(ll);
    L.polyline(coords, { color: '#fff', opacity: 0.8, weight: 4.5, interactive: false, lineJoin: 'round', lineCap: 'round' }).addTo(map);
    var line = L.polyline(coords, {
      color: colors[r.trip], weight: 2.35, opacity: 0.94, dashArray: r.mode === 'flight' ? '7 6' : null,
      lineJoin: 'round', lineCap: 'round', smoothFactor: 0, interactive: false
    }).addTo(map);
    routeLines.push({ id: r.id, trip: r.trip, mode: r.mode, line: line });
  });

  /* City / site markers and labels. Labels thin out at low zoom and never overlap. */
  var cityLayer = L.layerGroup().addTo(map), countryLayer = L.layerGroup().addTo(map);
  var labels = [];
  var labelSide = {
    'Osaka': 'left', 'Kyoto': 'top', 'Nara': 'bottom', 'Nagoya': 'bottom', 'Tokyo': 'right',
    'Seoul': 'left', 'Incheon': 'left', 'Yeoju': 'left', 'Wonju': 'top', 'Chungju': 'right',
    'Cheonan': 'left', 'Gongju': 'right', 'Boryeong': 'left', 'Pohang': 'top', 'Uljin': 'right',
    'Gyeongju': 'right', 'Daegu': 'left', 'Changnyeong': 'bottom', 'Hadong': 'left',
    'Yanran Inscription': 'left', 'Ulaanbaatar': 'right', 'Zhengzhou': 'left', 'Beijing': 'left',
    'Lanzhou': 'right', 'Chengdu': 'left', 'Chongqing': 'right', 'Guangzhou': 'left', 'Shanghai': 'left'
  };
  var geoLabels = [];
  function geoLabel(text, c, water) {
    var marker = L.marker(ll(c), {
      keyboard: false, interactive: false,
      icon: L.divIcon({ html: '<div class="' + (water ? 'water-label' : 'country-label') + '">' + text + '</div>', className: '', iconSize: [160, 20], iconAnchor: [80, 10] })
    }).addTo(countryLayer);
    geoLabels.push(marker);
    return marker;
  }
  var collisionTimer = null;
  function drawCities() {
    cityLayer.clearLayers();
    countryLayer.clearLayers();
    labels = [];
    geoLabels = [];
    var z = map.getZoom();
    places.forEach(function (p) {
      var color = p.trip ? colors[p.trip] : '#516978';
      var m = L.circleMarker(ll(p.coord), { radius: z > 5.5 ? 3.5 : 2.5, color: '#fff', weight: 1.2, fillColor: color, fillOpacity: 1, interactive: false }).addTo(cityLayer);
      var show = p.priority === 1 || z >= 5.3 || (p.priority === 2 && window.innerWidth > 1250);
      if (p.region === 'korea' && p.name !== 'Seoul') show = z >= 6.3;
      if (p.region === 'japan' && ['Tokyo', 'Nagoya', 'Osaka'].indexOf(p.name) < 0) show = z >= 6.3;
      if (p.name === 'Nagoya' || p.name === 'Osaka') show = z >= 4.8;
      if (show) {
        var dir = labelSide[p.name] || 'right';
        m.bindTooltip(p.name, {
          permanent: true, className: 'city', direction: dir, opacity: 1,
          offset: dir === 'left' ? [-7, 0] : dir === 'top' ? [0, -7] : dir === 'bottom' ? [0, 7] : [7, 0]
        }).openTooltip();
        labels.push({ m: m, p: p });
      }
    });
    if (z < 5.5) {
      geoLabel('CHINA', [104.5, 37.4]);
      geoLabel('MONGOLIA', [98.6, 46.0]);
      geoLabel('JAPAN', [140.0, 40.1]);
      geoLabel('SOUTH KOREA', [127.7, 38.5]);
      geoLabel('RUSSIA', [115, 52.1]);
      geoLabel('Pacific Ocean', [138, 24.7], true);
    }
    clearTimeout(collisionTimer);
    collisionTimer = setTimeout(function () {
      var box = el.getBoundingClientRect(), used = [];
      function hits(r, dx, dy) {
        return used.some(function (s) {
          return !(r.right + dx < s.left || r.left > s.right + dx || r.bottom + dy < s.top || r.top > s.bottom + dy);
        });
      }
      /* City labels, most important first. A label that would run off the side
         of the map switches sides; one that would overlap another is hidden. */
      labels.sort(function (a, b) { return a.p.priority - b.p.priority; }).forEach(function (x) {
        var tip = x.m.getTooltip(), e = tip && tip.getElement();
        if (!e) return;
        var r = e.getBoundingClientRect();
        if (r.right > box.right - 2 || r.left < box.left + 2) {
          var left = r.right > box.right - 2;
          tip.options.direction = left ? 'left' : 'right';
          tip.options.offset = left ? [-7, 0] : [7, 0];
          tip.update();
          r = e.getBoundingClientRect();
        }
        if (hits(r, 5, 3)) e.style.visibility = 'hidden'; else used.push(r);
      });
      /* Country and sea names give way to city labels and to the map edge. */
      geoLabels.forEach(function (marker) {
        var e = marker.getElement(), t = e && e.firstChild;
        if (!t) return;
        var range = document.createRange();
        range.selectNodeContents(t);
        var r = range.getBoundingClientRect();
        var inside = r.left >= box.left && r.right <= box.right && r.top >= box.top && r.bottom <= box.bottom;
        if (!inside || hits(r, 1, 1)) e.style.visibility = 'hidden'; else used.push(r);
      });
    }, 20);
  }

  /* Initial view: all routes, leaving room for the legend at the bottom. On
     very narrow maps the minimum zoom relaxes so the whole extent still fits. */
  var extent = L.latLngBounds([[17.8, 77], [49.8, 142.3]]);
  function fit() {
    var bottom = legend.offsetHeight ? legend.offsetHeight + 30 : 105;
    var tl = L.point(22, 25), br = L.point(25, bottom);
    map.options.minZoom = 0; /* getBoundsZoom clamps to minZoom; measure unclamped */
    var z = map.getBoundsZoom(extent, false, tl.add(br));
    map.setMinZoom(Math.min(2.5, Math.floor(z * 10) / 10));
    map.fitBounds(extent, { paddingTopLeft: tl, paddingBottomRight: br, animate: false });
  }

  map.on('zoomend', drawCities);
  fit();
  drawCities();
  var lastWidth = el.clientWidth, lastHeight = el.clientHeight;
  window.addEventListener('resize', function () {
    if (el.clientWidth === lastWidth && el.clientHeight === lastHeight) return;
    lastWidth = el.clientWidth;
    lastHeight = el.clientHeight;
    map.invalidateSize();
    fit();
    drawCities();
  });
  window.__fieldMap = { map: map, routeLines: routeLines, places: places, ready: true };
}());
