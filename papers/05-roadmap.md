# From a Pi to the Beast

*Paper 5 of 5: roadmap*

---

## How to read this roadmap

XKernel is built in **stages**. Each stage ends with something that runs, that you can demo, and that the next stage builds on. No stage depends on hardware the project doesn't have yet. The early stages run on a **Raspberry Pi 5** and any x86 PC with virtualization.

Each stage lists:
- **Goal:** what's true at the end
- **Work:** the main tasks
- **Done when:** the demo that proves it

---

## Stage 0: The workshop

**Goal:** a place to build and break kernels safely.

**Work:**
- Set up a Raspberry Pi 5 (4 GB minimum, 8 GB preferred) with a spare SD card or NVMe.
- Set up a cross-compiling build on the main computer, or CI (GitHub Actions) that builds arm64 and x86_64 kernels.
- Create the repositories: `xkernel` (patch stack and build), `xcomp` (Hyprland fork), `xvmd`, `xsh`, `papers`.

**Done when:** a stock upstream LTS kernel, built by our own scripts, boots on the Pi.

---

## Stage 1: Our kernel boots

**Goal:** XKernel's kernel exists.

**Work:**
- Start the patch stack, empty at first, as numbered patches on top of upstream LTS.
- Create a minimal kernel config: KVM, VFIO, virtio, the needed GPU/display drivers, the needed storage. Drop the rest.
- Make a tiny init that boots straight to a prompt.
- Measure boot time and memory use.

**Done when:** an XKernel-config kernel boots on the Pi and on an x86 machine, with KVM available (`/dev/kvm` exists).

---

## Stage 2: One Kernel

**Goal:** one guest OS runs on XKernel.

**Work:**
- Write the first `xvmd`: start a QEMU/KVM guest from a simple definition file and stop it cleanly.
- Boot a Linux guest (arm64 on the Pi, x86_64 on PC).
- Show the guest's display fullscreen through virtio-gpu.
- Get keyboard and mouse into the guest.

**Done when:** you power on, and a Linux guest appears fullscreen and is usable.

---

## Stage 3: Tiles

**Goal:** the XKernel look.

**Work:**
- Fork Hyprland into `xcomp`. Strip bars, launchers and widgets.
- Draw the wallpaper, blurred once and cached.
- Show each Kernel's display as a tile surface.
- Add focus, keyboard tiling controls and the reserved escape key that always returns control to XKernel.

**Done when:** two or more Kernels run side by side in tiles over the blurred wallpaper, and you can move between them with the keyboard.

---

## Stage 4: xsh

**Goal:** you can talk to XKernel.

**Work:**
- Write the `xsh` language and its floating panel.
- Look commands: wallpaper, blur, gaps, borders, accent.
- Quick actions: start, pause, stop, save, focus, new Kernel.
- Add `config save`, which writes changes back to a config file.

**Done when:** you can change the look and manage Kernels without touching anything but `xsh`.

---

## Stage 5: Always there

**Goal:** save and resume.

**Work:**
- `xvmd` saves every Kernel's state on sleep and shutdown, and restores it at boot.
- Faster snapshots: compression, incremental saves, NVMe-friendly writes.
- Add the signature animation: tiles blur into the wallpaper on save and sharpen back on resume.
- Make XKernel say clearly when a Kernel can't be saved safely.

**Done when:** you shut down mid-task, power on, and every Kernel continues where it was.

---

## Stage 6: Windows

**Goal:** the most-requested guest works well.

**Work:**
- UEFI firmware (OVMF), virtual TPM and Secure Boot settings for Windows 11.
- A virtio driver install flow (storage, network, display).
- A guest agent for clean shutdown and sleep.

**Done when:** a Windows Kernel installs, runs in a tile, and survives save and resume. Users bring their own Windows license.

---

## Stage 7: Speed

**Goal:** the 120 fps path (Paper 3).

**Work:**
- VFIO passthrough: detect IOMMU groups, bind and unbind GPUs, refuse unsafe setups.
- Integrate Looking Glass into `xcomp`, so passed-through frames land in tiles.
- SR-IOV: detect capable GPUs and assign slices to Kernels.
- Venus/virgl for light Kernels.
- Tuning: CPU pinning, host isolation, huge pages.
- Direct scanout for fullscreen Kernels.
- Publish benchmarks: bare metal versus XKernel.

**Done when:** a game in a GPU-backed Kernel runs at frame times close to bare metal, with measured numbers published.

*This is the stage that needs "the beast": a machine with an IOMMU, plenty of RAM and a shareable or second GPU.*

---

## Stage 8: The machine in one file

**Goal:** `xkernel.conf`.

**Work:**
- A declarative format for look, Kernels, devices and GPUs.
- Apply a config: XKernel reshapes itself to match the file.
- Validate it: clear errors before anything changes.
- Copy a config to another machine and get the same setup back.

**Done when:** your whole XKernel machine is one file you can back up, share and restore.

---

## Stage 9: More Kernels

**Goal:** the "run anything" promise.

**Work:**
- Test and document guests: Linux distros, FreeBSD, OpenBSD, OpenIndiana (illumos), Haiku and others.
- A light VMM option (crosvm or Cloud Hypervisor) for guests that don't need QEMU.
- Mirrored tiles: show a connected phone's screen through open mirroring tools (for example an AirPlay receiver like UxPlay for iPhone, and scrcpy for Android), clearly labeled as mirroring.

**Done when:** a documented, tested list of guest OSes runs as Kernels.

---

## Stage 10: XKernel, open, 1.0

**Goal:** a release strangers can install.

**Work:**
- An installer.
- Documentation: install, hardware guide, `xsh` reference, `xkernel.conf` reference.
- Release notes and the README with its honest line.
- Security review of `xvmd` and the device assignment paths.
- Licenses verified for every component; credits for every upstream project.

**Done when:** someone you've never met installs XKernel and runs two operating systems side by side.

---

## Rules for the whole journey

1. **Never hard-fork Linux.** Patch stack, rebase each release, upstream what we can.
2. **Every stage must run.** No stage is "just infrastructure" with nothing to show.
3. **Measure, then claim.** Numbers before adjectives.
4. **Be honest about limits.** Say what doesn't work, especially about hardware.
5. **Stay quiet.** No feature that makes the host loud gets in.
6. **Stay open.** Built from open source, given back as open source.

---

## Where it starts

It starts with a $60 board on a desk, a kernel that boots, and a line in a README:

> *You can run this beast. me, Maxwell, cant.*

Not yet.
