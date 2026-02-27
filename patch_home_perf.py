from pathlib import Path

path = Path("src/app/pages/home.tsx")
s = path.read_text(encoding="utf-8")

# Gate SunRays
s = s.replace("      <SunRays />", "      {allowFunAnimations ? <SunRays /> : null}")

old_xp = """      {/* XP tap page-darkening overlay */}
      {xpTaps.length > 0 && (
        <div className="fixed inset-0 pointer-events-none xp-page-darken" style={{ zIndex: 40 }} />
      )}"""
new_xp = """      {/* XP tap page-darkening overlay */}
      {allowFunAnimations && xpTaps.length > 0 && (
        <div className="fixed inset-0 pointer-events-none xp-page-darken" style={{ zIndex: 40 }} />
      )}"""
if old_xp in s:
  s = s.replace(old_xp, new_xp)
else:
  print("WARNING: XP overlay block not matched; skipping.")

old_cam = """      {/* Camera screen flash overlays - full screen */}
      {cameraFlashes.map(fid => (
        <div key={fid} className="fixed inset-0 pointer-events-none camera-screen-flash" style={{ zIndex: 9999 }} />
      ))}"""
new_cam = """      {/* Camera screen flash overlays - full screen */}
      {allowFunAnimations ? cameraFlashes.map(fid => (
        <div key={fid} className="fixed inset-0 pointer-events-none camera-screen-flash" style={{ zIndex: 9999 }} />
      )) : null}"""
if old_cam in s:
  s = s.replace(old_cam, new_cam)
else:
  print("WARNING: Camera overlay block not matched; skipping.")

path.write_text(s, encoding="utf-8")
print("Patched", path)
