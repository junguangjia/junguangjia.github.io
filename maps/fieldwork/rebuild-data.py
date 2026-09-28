#!/usr/bin/env python3
"""Assemble data.js (the map's runtime data) from the versioned files in data/.

Run after editing any file in data/:  python3 rebuild-data.py
"""
from pathlib import Path
import json

root = Path(__file__).resolve().parent
inputs = {
    'land': 'land.geojson',        # Natural Earth 10m land (basemap)
    'borders': 'borders.geojson',  # Natural Earth 50m country boundary lines (basemap)
    'trips': 'trips.json',         # one entry per trip: id, legend label, colour
    'routes': 'routes.geojson',    # schematic routes (LineStrings), mode = ground | flight
    'places': 'places.geojson',    # city / site markers (Points)
}
data = {key: json.loads((root / 'data' / name).read_text(encoding='utf-8'))
        for key, name in inputs.items()}

for key in ('land', 'borders', 'routes', 'places'):
    assert data[key]['type'] == 'FeatureCollection', f'Invalid {key} GeoJSON'
    assert data[key]['features'], f'Empty {key} data'

trip_ids = [t['id'] for t in data['trips']]
assert len(trip_ids) == len(set(trip_ids)), 'Duplicate trip id'
for f in data['routes']['features']:
    p = f['properties']
    assert f['geometry']['type'] == 'LineString', p['id']
    assert p['trip'] in trip_ids, f"Unknown trip in route {p['id']}"
    assert p['mode'] in ('ground', 'flight'), f"Unknown mode in route {p['id']}"
for f in data['places']['features']:
    p = f['properties']
    assert f['geometry']['type'] == 'Point', p['name']
    assert p['trip'] is None or p['trip'] in trip_ids, f"Unknown trip at {p['name']}"

(root / 'data.js').write_text(
    'window.FIELD_MAP_DATA=' + json.dumps(data, ensure_ascii=True, separators=(',', ':')) + ';\n',
    encoding='utf-8',
)
print('Rebuilt data.js from data/.')
