# XKernel showcase

A browser demo of XKernel: real operating systems tiled over a blurred wallpaper.

```bash
python -m http.server 8080 --directory demo
```

Then open http://localhost:8080.

- **Real kernels:** Buildroot Linux, Tiny Core Linux, Damn Small Linux, KolibriOS, FreeDOS and HelenOS boot in the browser through [v86](https://github.com/copy/v86), an open-source x86 emulator (BSD-2, see `v86/LICENSE`). Real XKernel runs guests on hardware through KVM. v86 is the closest a web page can get.
- **Mock tiles:** Windows (bring your own license), TempleOS, OpenIndiana, Haiku, the BSDs, ReactOS, SerenityOS and any Linux distro name. They're drawn, not emulated.
- **Always there:** `sleep` saves every real machine's full state to IndexedDB. Reload the page and everything continues where it was.
- **Images:** `images/` holds small open-source OS images from v86's public image set. Each OS keeps its own license.

Keys: Ctrl+Space opens xsh, Alt+arrows moves focus, Alt+Shift+arrows swaps, Alt+F toggles fullscreen, Alt+Q closes, Alt+drag swaps tiles, and holding Alt shows names.
