#!/usr/bin/env python3
"""Assemble the self-hosted browser data from the versioned GeoJSON inputs."""
from pathlib import Path
import json

root = Path(__file__).resolve().parent
inputs = {
    'land': 'land.geojson',
    'borders': 'borders.geojson',
    'places': 'places.geojson',
    'traces': 'china-traces.geojson',
    'labels': 'context-labels.json',
}
data = {key: json.loads((root / 'data' / name).read_text(encoding='utf-8'))
        for key, name in inputs.items()}
for key in ('land', 'borders', 'places', 'traces'):
    assert data[key]['type'] == 'FeatureCollection', f'Invalid {key} GeoJSON'
    assert data[key]['features'], f'Empty {key} data'
(root / 'data.js').write_text(
    'window.ATLAS_DATA=' + json.dumps(data, ensure_ascii=True, separators=(',', ':')) + ';\n',
    encoding='utf-8',
)
print('Rebuilt data.js from local data files.')
