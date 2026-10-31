# Font sources

The site serves only the six faces the design uses, as WOFF2 subsets in `src/app/fonts/`.
These originals are not served or bundled; they are kept here to regenerate the subsets.

Regenerate (e.g. after adding a weight, or if a character renders in a fallback font):

```bash
pip install fonttools brotli
python3 assets/fonts-source/build-fonts.py
```

Then add/remove faces in `src/app/layout.js` to match.

Note: Helvetica Neue is a commercial typeface. Make sure your licence covers web use.
