<p align="center"><img src="assets/logo.svg" width="96" alt="XKernel"></p>

<h1 align="center">XKernel</h1>

<p align="center"><b>Your whole machine, as a multi-VM.</b><br>
Every operating system you use, side by side, at full speed, over your blurred wallpaper. Nothing else.</p>

<p align="center"><i>XKernel, open.</i></p>

<p align="center">
  <a href="https://thatmaxwell.github.io/XKernel/">Website</a> ·
  <a href="https://thatmaxwell.github.io/XKernel/demo/">Showcase</a> ·
  <a href="PLAN.md">Plan</a> ·
  <a href="papers/01-manifesto.md">Manifesto</a>
</p>

> You can run this beast. me, Maxwell, cant.

---

## What it is

XKernel is a Linux-based host that does almost nothing, on purpose. You boot into your wallpaper, blurred. No bar, no dock, no app drawer, no assistant. Every operating system you use runs as a **Kernel**: a full OS on real hardware through KVM, shown as a tile, arranged like Hyprland.

- **Equal rank.** Windows, Linux, the BSDs, illumos, Haiku: no main OS, just guests in an almost empty house.
- **Fast.** Real GPUs for guests (VFIO passthrough, SR-IOV) and zero-copy frames (Looking Glass). The host only draws a wallpaper. Target: close to 120 fps inside a Kernel.
- **Always there.** Kernels save and resume automatically. You don't boot your operating systems, you continue them.
- **One shell, xsh.** Only for shaping XKernel and quick actions. Your computing happens inside your Kernels.

Not macOS or iOS: Apple's license only allows macOS on Apple hardware.

## Status

**Planning. Stage 0.** Nothing runs on hardware yet. What exists today:

- [The plan](PLAN.md), the single source of truth.
- [Five papers](papers/): manifesto, architecture, the 120 fps path, design, roadmap.
- [A browser showcase](demo/) that boots real operating systems (Buildroot Linux, KolibriOS, FreeDOS, Tiny Core, Damn Small Linux, HelenOS) in tiles, with sleep and resume. It runs on [v86](https://github.com/copy/v86). XKernel will run on KVM.

## The papers

| | Paper | About |
|---|---|---|
| I | [XKernel, Open](papers/01-manifesto.md) | Why your machine should be almost empty |
| II | [The Shape of an Empty House](papers/02-architecture.md) | Linux + KVM, xvmd, xcomp, xsh, xkernel.conf |
| III | [One Hundred and Twenty](papers/03-120fps.md) | How a VM gets near 120 fps, and the limits |
| IV | [Wallpaper and Quiet](papers/04-design.md) | Design, motion, voice, tributes, the mark |
| V | [From a Pi to the Beast](papers/05-roadmap.md) | Stages 0 to 10 |

## Built on

Linux · KVM · VFIO · QEMU · Looking Glass · Hyprland. XKernel is built by forking and patching open source, never hard-forking, and everything it adds is open too.

## Run the showcase locally

```bash
python -m http.server 8080
```

Then open http://localhost:8080/demo/.

## License

[Apache-2.0](LICENSE). Future kernel patches will be GPL-2.0, as Linux requires. Third-party software in the showcase is listed in [NOTICE](NOTICE).

