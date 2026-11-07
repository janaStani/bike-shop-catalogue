import sys
from fontTools.ttLib import TTFont
from fontTools.ttLib.tables import otTables as ot

S = 0.8069
src, dst = sys.argv[1], sys.argv[2]
f = TTFont(src)
glyf = f['glyf']; hmtx = f['hmtx']

# glyph outlines
for name in f.getGlyphOrder():
    g = glyf[name]
    if g.isComposite():
        for c in g.components:
            c.x = round(c.x * S)
    elif g.numberOfContours > 0:
        coords = g.coordinates
        for i in range(len(coords)):
            x, y = coords[i]
            coords[i] = (round(x * S), y)
    # hmtx
    adv, lsb = hmtx[name]
    hmtx[name] = (round(adv * S), round(lsb * S))

# gvar deltas
if 'gvar' in f:
    for name, vars_ in f['gvar'].variations.items():
        for tv in vars_:
            tv.coordinates = [None if c is None else (round(c[0] * S), c[1]) for c in tv.coordinates]

# HVAR
if 'HVAR' in f:
    hv = f['HVAR'].table
    for vd in hv.VarStore.VarData:
        vd.Item = [[round(d * S) for d in row] for row in vd.Item]

# GPOS: scale x values recursively
seen = set()
def walk(o):
    if id(o) in seen: return
    seen.add(id(o))
    if isinstance(o, list):
        for i in o: walk(i)
        return
    if hasattr(o, '__dict__') and not isinstance(o, (str, int, float)):
        for k, v in list(o.__dict__.items()):
            if k in ('XAdvance', 'XPlacement', 'XCoordinate') and isinstance(v, int):
                setattr(o, k, round(v * S))
            elif k in ('XAdvDevice','XPlaDevice') and v is not None:
                pass
            else:
                walk(v)
if 'GPOS' in f:
    walk(f['GPOS'].table)

for t in ('hdmx','VDMX','LTSH','fpgm','prep','cvt ','gasp'):
    if t in f: del f[t]

# GDEF variation store (kerning deltas referenced by GPOS device tables)
if 'GDEF' in f and getattr(f['GDEF'].table, 'VarStore', None):
    for vd in f['GDEF'].table.VarStore.VarData:
        vd.Item = [[round(d * S) for d in row] for row in vd.Item]
    print('scaled GDEF VarStore')

# names
fam = 'Bounded Condensed'
for rec in f['name'].names:
    if rec.nameID in (1, 16): rec.string = fam
    elif rec.nameID == 4: rec.string = fam
    elif rec.nameID == 6: rec.string = 'BoundedCondensed-Regular'
    elif rec.nameID == 3: rec.string = 'BoundedCondensed-Regular'
f['OS/2'].xAvgCharWidth = round(f['OS/2'].xAvgCharWidth * S)
f.save(dst)
print('saved', dst)
