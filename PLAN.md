# XKernel: Design Plan

> Read this file first if you are a person or an AI starting work on XKernel.
> It holds the whole vision in one place. The papers in `papers/` explain the why in depth.

## One line

**XKernel turns your whole machine into a multi-VM host.** Every OS you use runs side by side in tiles over a blurred wallpaper, with nothing else in the way.

Tagline: **"XKernel, open."**
Former name: MultiVM.
License: open source (GPL-2.0 for kernel work, as Linux requires; permissive where we can for our own userland).

## What the user sees

- **Your wallpaper, blurred.** There's no top bar, no dock, no app drawer, no desktop environment and no assistant.
- **Tiles.** Each tile is a running operating system, which XKernel calls a "Kernel": Windows in one, Linux in another, Solaris (OpenIndiana) in a third. Tiles work like Hyprland: they tile automatically and are fully keyboard-driven.
- **The XKernel shell.** A small custom shell, not bash. It isn't for general computing; your OSes are for that. It only does two things:
  - customizing XKernel (looks, layout, behavior)
  - quick actions (start, pause, save or kill a Kernel, move tiles, assign GPUs)
- **Instant everything.** Kernels save their state automatically. Sleep and shutdown are fast. When you come back, every OS is exactly where you left it.

## Target: smooth, up to 120 fps inside VMs

The host is almost nothing, so nearly all the hardware goes to the guests. Speed comes from giving guests real hardware, not emulated hardware (see Paper 3).

## Stack (Fork Arc: build on what already exists)

| Layer | Base | Notes |
|---|---|---|
| Kernel | Linux (upstream LTS) + XKernel patch stack | Keep a small patch stack and rebase each release. Never hard-fork. |
| Hypervisor | KVM (in-kernel) | Already production-grade. |
| VM runner | QEMU first; crosvm or Cloud Hypervisor later | QEMU has the widest device and GPU support. |
| Compositor / UI | Fork of Hyprland (BSD-3) | Tiles hold VM displays; blurred wallpaper. |
| VM display | Looking Glass (KVMFR shared memory) for GPU-backed guests; virtio-gpu / SPICE for light guests | Near-zero-copy frames. |
| GPU sharing | VFIO passthrough; SR-IOV where supported (e.g. newer Intel graphics) | This is the 120 fps path. |
| Shell | `xsh`, custom | A small language for config and quick actions. |
| Config | One declarative file (`xkernel.conf`) | Inspired by NixOS. The whole machine is described in one file. |

## Out of scope

- **macOS and iOS guests.** Apple's license only allows macOS on Apple hardware, and iOS can't legally be virtualized. A connected iPhone may appear as a *mirrored* tile through an open AirPlay receiver such as UxPlay. That's screen mirroring, not virtualization.
- **Being a general desktop.** If you want to browse, you do it inside a Kernel.

## Hardware

| | Minimum (it works) | Recommended (the beast) |
|---|---|---|
| CPU | VT-x/AMD-V + IOMMU (VT-d/AMD-Vi), 6 cores | 12+ cores |
| RAM | 16 GB | 64 GB |
| GPU | Integrated, virtio-gpu only (no 120 fps) | SR-IOV-capable GPU, or 2+ GPUs for passthrough |
| Disk | SSD | NVMe |
| Dev board | Raspberry Pi 5 (arm64, KVM) | — |

## Stages

1. **Boot.** A minimal Linux with the XKernel patch stack boots on a Pi 5 and on x86.
2. **One Kernel.** One VM runs fullscreen through QEMU/KVM.
3. **Tiles.** The Hyprland fork shows several VMs as tiles over the blurred wallpaper.
4. **xsh.** The custom shell for config and quick actions.
5. **Save/resume.** Kernels auto-save and restore. Sleep and shutdown are instant.
6. **Speed.** VFIO and SR-IOV with Looking Glass, chasing 120 fps.
7. **xkernel.conf.** The whole machine described in one declarative file.
8. **1.0, "XKernel, open."**

Full detail is in [papers/05-roadmap.md](papers/05-roadmap.md).

## Identity

- **Logo:** the X mark (`assets/logo.svg`): four bracket corners around a diamond with a white core. It's the logo the first-boot welcome collapses into.
- **Tone:** silent, calm, sleek. Never loud.
- **README must include:** "You can run this beast. me, Maxwell, cant."

## Related

ChangeOS (Android) is a sister project. It ends its roadmap at 7.0 "X". XKernel is separate and comes after ChangeOS.
