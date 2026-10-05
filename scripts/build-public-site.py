#!/usr/bin/env python3
"""Build publication files without moving legacy source or app document URLs."""
import io, subprocess, sys, tarfile, shutil
from pathlib import Path
root=Path(__file__).resolve().parents[1]
out=Path(sys.argv[1]).resolve()
if out == root or root in out.parents:
 raise SystemExit('Output must be outside the repository.')
if out.exists():
 raise SystemExit('Choose a new, empty output path.')
out.mkdir(parents=True)
archive=subprocess.check_output(['git','archive','HEAD'],cwd=root)
with tarfile.open(fileobj=io.BytesIO(archive)) as tar:
 for entry in tar:
  if entry.name.split('/')[0] in ('website','scripts','.github','Manual','concepts','backup260814') or entry.name.endswith('.md'):
   continue
  tar.extract(entry,out,filter='data')
for item in (root/'website').iterdir():
 if item.name.endswith('.md'): continue
 target=out/item.name
 if item.is_dir(): shutil.copytree(item,target,dirs_exist_ok=True)
 else: shutil.copy2(item,target)
# Old homepage bookmarks continue to the new homepage with the same language.
for page in (out/'home').glob('index*.html'):
 name=page.name
 if (out/name).exists():
  page.write_text('<!doctype html><meta charset="utf-8"><script>location.replace("../'+name+'"+location.search+location.hash)</script>')
print(out)
