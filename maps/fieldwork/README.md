# ArtVenn — East Asia Field Atlas

A static, self-hosted Leaflet 1.9.4 map for Junguang Jia's academic website. The map uses real vector geography; no generative map imagery, map tiles, keys, account, backend or runtime geocoding are required.

## Install / embed

Copy this complete folder to `maps/fieldwork/` in the website repository. Open `index.html` directly or serve the folder over HTTP. Use the included Jekyll include and height listener (delivered alongside the folder) to embed it responsively. A plain iframe also works:

```html
<iframe src="/maps/fieldwork/" title="ArtVenn field atlas — East Asia" loading="lazy" allow="fullscreen" style="width:100%;height:880px;border:1px solid #dce4e4"></iframe>
```

## Evidence and interpretation

- China: 15 sketch segments from `route_traces_pixels.json`, affine-registered to approximate city-label control points in Web Mercator and converted to longitude/latitude. These are schematic reconstructions, not GPS tracks. The original stroke-color groups have no confirmed transport meaning. No navigation snapping or invented intermediate stops were applied.
- Mongolia: Ulaanbaatar plus the owner-supplied Yanran Inscription location, rounded for public display. The line indicates an endpoint connection only.
- South Korea: the supplied 17 inscription entries grouped into 13 city/county areas. Regional gazetteer markers are not exact monuments or museum holding locations. Individual visits and order are unconfirmed. No circuit is invented.
- Japan: five explicitly named visited cities. Geographic connectors do not claim travel order or transport mode.
- The screenshot's 210-city number refers to China only, and is not calculated from map markers. There is no global visited-city total in this atlas.
- Nearby China basemap town labels are geographic context only, not a new visit inventory.

## Data / sources

- `data/land.geojson`: Natural Earth 10m Land, clipped to [24,-28,179.9,80], simplified at 0.005 degrees preserving topology, rounded to five decimal places. The 10m label is cartographic scale 1:10 million, not 10-meter accuracy.
- `data/borders.geojson`: Natural Earth 50m Admin 0 Boundary Lines Land, similarly clipped and simplified at 0.003 degrees. Borders are contextual and do not express a position on sovereignty.
- `data/places.geojson`: selected place anchors from Natural Earth and GeoNames, plus owner-supplied monument coordinates. Point-level provenance is stored in each feature.
- `data/china-traces.geojson`: reconstructed paths with explicit uncertainty properties.
- `audit/georeferencing.json`: transform, approximate controls and registration residuals. These residuals are not GPS accuracy estimates.
- `audit/sources.json`: source URLs and input download checksums.
- `data.js`: assembled runtime copy. When updating data, run `python3 rebuild-data.py` to regenerate it from the versioned GeoJSON files rather than maintaining conflicting versions.

Natural Earth data are public domain: https://www.naturalearthdata.com/about/terms-of-use/
GeoNames data are CC BY 4.0: https://download.geonames.org/export/dump/readme.txt
Leaflet is BSD-2-Clause; see `vendor/LEAFLET-LICENSE.txt`.

## Scope / maintenance

All map text is English. Existing non-English Miscellaneous pages share this English map as a deliberate fallback. Keep the existing website videos, profile and academic content unchanged. Do not re-introduce the earlier generated map as geographic evidence. Do not claim the entire country's area was surveyed because it appears in the background.

The map intentionally stops at overview/regional zooms. To publish detailed routes, replace approximate trace geometry with verified GPX/GeoJSON records. To publish site locations, resolve actual visited venues rather than geocoding the artifact title alone.
