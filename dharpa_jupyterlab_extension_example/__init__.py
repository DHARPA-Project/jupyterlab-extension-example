import json
import os.path

CURRENT_DIR = os.path.abspath(os.path.dirname(__file__))

with open(os.path.join(CURRENT_DIR, 'labextension', 'package.json')) as fid:
    data = json.load(fid)

__version__ = data['version']

def _jupyter_labextension_paths():
    return [{
        'src': 'labextension',
        'dest': data['name']
    }]
