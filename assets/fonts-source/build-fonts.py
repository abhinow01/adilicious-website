"""Builds the WOFF2 subsets in src/app/fonts/ from the originals in this folder."""
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont

HERE = Path(__file__).parent
OUT = HERE.parent.parent / 'src' / 'app' / 'fonts'
FACES = ['HelveticaNeueLight.otf', 'HelveticaNeueRoman.otf', 'HelveticaNeueItalic.ttf',
         'HelveticaNeueMedium.otf', 'HelveticaNeueBold.otf', 'HelveticaNeueBlack.otf']
# Latin (incl. extended), combining marks, punctuation, currency (₹ €), letterlike (№ ™),
# arrows, maths, geometric shapes and misc symbols.
RANGES = ('U+0000-024F,U+0300-036F,U+1E00-1EFF,U+2000-206F,U+2070-209F,U+20A0-20CF,'
          'U+2100-214F,U+2190-21FF,U+2200-22FF,U+25A0-25FF,U+2600-26FF,U+FB01-FB02')

for name in FACES:
    font = TTFont(HERE / name)
    opts = subset.Options()
    opts.flavor = 'woff2'
    opts.layout_features = ['*']
    opts.name_IDs = ['*']
    opts.notdef_outline = True
    opts.hinting = True
    sub = subset.Subsetter(opts)
    sub.populate(unicodes=subset.parse_unicodes(RANGES))
    sub.subset(font)
    font.flavor = 'woff2'
    target = OUT / (Path(name).stem + '.woff2')
    font.save(target)
    print(f'{target.name}: {target.stat().st_size // 1024} KB')
