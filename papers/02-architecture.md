# The Shape of an Empty House

*Paper 2 of 5: architecture*

---

## Summary

XKernel is five layers, and almost all of them already exist as open source:

```
 ┌──────────────────────────────────────────────────────────┐
 │  Kernels (guests): Windows · Linux · OpenIndiana · ...   │
 ├──────────────────────────────────────────────────────────┤
 │  xsh: the XKernel shell (config + quick actions)         │
 │  xkernel.conf: the whole machine in one file             │
 ├──────────────────────────────────────────────────────────┤
 │  xcomp: tiling compositor (Hyprland fork)                │
 │     blurred wallpaper · tiles · VM display surfaces      │
 ├──────────────────────────────────────────────────────────┤
 │  xvmd: Kernel manager daemon                             │
 │     QEMU/KVM processes · save/resume · device assignment │
 ├──────────────────────────────────────────────────────────┤
 │  Linux + KVM + VFIO  (upstream LTS + XKernel patches)    │
 └──────────────────────────────────────────────────────────┘
                     hardware
```

This paper walks through each layer from the bottom up and explains what we take, what we change, and why.

---

## 1. The base: Linux, KVM and VFIO

### What we take

- **Linux, upstream LTS.** Long-term-support kernels get security fixes for years, which is what a machine-wide host needs.
- **KVM.** The kernel's built-in hypervisor. It turns Linux into a type-1-style hypervisor: guest code runs directly on the CPU using hardware virtualization (VT-x/AMD-V on x86, the virtualization extensions on arm64).
- **VFIO.** The framework that lets a userspace program safely hand a whole physical device (a GPU, a USB controller, an NVMe drive) to a guest, isolated by the IOMMU.

### What we change

XKernel's kernel is **upstream plus a patch stack**, never a hard fork. The patch stack exists to make the host weightless and the guests fast:

1. **A minimal config.** Drivers and features the host never uses are compiled out. The host doesn't need sound mixing, printing, Bluetooth audio or a hundred filesystems. Every unneeded driver is attack surface and boot time.
2. **Scheduling that favors guests.** Guest vCPU threads get priority, and the host's own few processes are pinned out of the way. Much of this is possible with standard tools (cgroups, CPU isolation, `isolcpus`/`nohz_full`-style tuning). Patches are only for what configuration can't do.
3. **Low-latency defaults.** Timer and preemption settings tuned for interactive guests rather than server throughput.
4. **Boot speed.** A tiny init path. XKernel should go from power button to your blurred wallpaper in seconds.

**Rule:** if something can be done with configuration, it isn't a patch. Every patch is a maintenance cost paid at every rebase.

### Rebasing

Each upstream LTS point release gets rebased onto. The patch stack lives in its own repository as a series of numbered patches with a short explanation each, so anyone can read exactly how XKernel differs from Linux. A good patch is eventually sent upstream. The best patch stack is one that keeps shrinking.

---

## 2. xvmd: the Kernel manager

`xvmd` is the heart of XKernel's userland: a small daemon that owns every Kernel's lifecycle.

### Responsibilities

- **Start and stop Kernels.** Each Kernel is a QEMU process backed by KVM. Later, a lighter VMM (crosvm or Cloud Hypervisor) can be offered for guests that don't need QEMU's wide device support.
- **Hold each Kernel's definition:** CPUs, RAM, disks, which GPU (or GPU slice) it gets, which USB devices, which display path. Definitions come from `xkernel.conf`.
- **Assign devices.** Bind devices to VFIO, hand them to guests, take them back on shutdown, and refuse unsafe combinations (two guests can't own one GPU).
- **Save and resume.** Every Kernel is saved on lid-close, sleep and shutdown, and restored at boot. See section 5.
- **Expose a small API** over a Unix socket. Both `xcomp` and `xsh` talk to `xvmd` through it, and nothing else does.

### Why QEMU first

QEMU is the most compatible VM runner there is. It handles Windows guests, firmware (OVMF/UEFI), TPM emulation for Windows 11, virtio devices, VFIO passthrough and Looking Glass's shared memory device. Starting with QEMU means XKernel works early. Lighter VMMs come later, for speed and a smaller attack surface on the guests that suit them.

---

## 3. xcomp: the compositor

`xcomp` is a fork of **Hyprland** (BSD-3-Clause), a Wayland compositor known for smooth animation and dynamic tiling.

### What changes from Hyprland

| Hyprland | xcomp |
|---|---|
| Tiles hold app windows | Tiles hold **Kernel displays** |
| Bars, launchers, widgets | **Nothing.** Wallpaper only |
| Wallpaper is optional | Wallpaper is the identity: **blurred**, always |
| Config file | Reads `xkernel.conf`, controlled by `xsh` |

### Kernel display surfaces

Each tile is a surface showing one Kernel's screen. Where the frames come from depends on the Kernel's graphics path:

- **GPU-backed Kernels** (passthrough or SR-IOV): the guest renders on real GPU hardware. Frames reach `xcomp` through **Looking Glass**, which uses a shared-memory region (KVMFR) between guest and host, so frames aren't re-encoded or sent over a network protocol. `xcomp` imports them as textures and composites them into the tile.
- **Light Kernels** (no dedicated GPU): the guest uses **virtio-gpu**. With virgl or Venus, OpenGL and Vulkan calls can be forwarded to the host GPU. Good enough for desktops and terminals, not for 120 fps games.
- **Mirrored devices** (like an iPhone through an open AirPlay receiver such as UxPlay): shown as a tile, labeled clearly as mirroring.

### Input

The focused tile owns the keyboard and mouse. A reserved key combination always returns control to XKernel, so a guest can never trap you. Input reaches GPU-backed Kernels through virtio input devices or Looking Glass's input channel.

### The blur

The wallpaper is blurred once and cached, not re-blurred every frame. Only the tile borders and focus animation update. The host's own GPU cost should round to zero.

---

## 4. xsh: the shell

`xsh` is a small, purpose-built shell. It isn't bash and doesn't try to be one.

### Philosophy

You don't do your computing in xsh. You do it in your Kernels. xsh controls the house, not what happens in the rooms.

### Two jobs

**Customizing:**
```
look blur 24
look gap 10
look border accent #ffffff 1
wallpaper ~/walls/night.png
```

**Quick actions:**
```
start windows
pause linux
save all
gpu give windows
tile focus left
kernel new openindiana --ram 8G --cpus 4
```

### Design notes

- Readable verbs, no flags soup.
- Every command maps to one `xvmd` or `xcomp` API call. xsh holds no hidden state.
- Every change made in xsh can be written back to `xkernel.conf` (`config save`), so the file always describes the machine.

---

## 5. Save and resume

"Your machines are always there" is a promise, and it's built on KVM and QEMU's ability to save a running guest's full state (CPU registers, device state and RAM) to disk and restore it later.

### The normal case

On lid-close, sleep or shutdown, `xvmd`:
1. Pauses every Kernel.
2. Writes each Kernel's state to NVMe. With 32 GB of guest RAM this is gigabytes, which is why XKernel wants fast storage and a compressed or incremental snapshot format.
3. Powers down.

At boot, it restores every Kernel and they continue mid-sentence.

### The hard case: passed-through GPUs

A physical GPU's internal state can't be saved and restored by the hypervisor, because the hypervisor doesn't understand it. That's why live migration of GPU passthrough VMs is hard everywhere. XKernel's options, in order of preference:

1. **Ask the guest to sleep first.** Trigger a guest-side suspend (S3/S4) through the guest agent, so the guest's own driver saves the GPU state, then snapshot.
2. **Use SR-IOV slices** where the hardware and driver support state handling.
3. **Be honest.** If a Kernel can't be saved safely, `xsh` says so before shutdown, rather than silently losing work.

Silence is the brand, but never at the cost of lying.

---

## 6. xkernel.conf: the machine in one file

Inspired by NixOS, the whole machine is described in a single declarative file:

```
look {
  wallpaper = "~/walls/night.png"
  blur = 24
  gap = 10
}

kernel windows {
  ram = 16G
  cpus = 6
  gpu = "passthrough:0000:03:00.0"
  display = "looking-glass"
  disk = "/kernels/windows.qcow2"
  autostart = true
}

kernel linux {
  ram = 8G
  cpus = 4
  gpu = "virtio"
  disk = "/kernels/arch.qcow2"
}
```

Copy this file to another XKernel machine (with matching hardware) and you get the same machine back.

---

## 7. Security model

XKernel isn't primarily a security product, but its shape makes it naturally strong:

- The host runs almost nothing, so there's little to attack.
- Kernels are isolated by hardware virtualization and the IOMMU.
- `xvmd`'s socket is the only control path, and only the local user can reach it.
- Passing a device to a guest gives the guest that device. That's an explicit choice in `xkernel.conf`, never automatic.

---

## 8. What's ours and what's borrowed

| Component | Origin | License (expected) |
|---|---|---|
| Linux, KVM, VFIO | Upstream Linux | GPL-2.0 |
| XKernel kernel patches | **Ours** | GPL-2.0 (required) |
| QEMU | Upstream | GPL-2.0 |
| Looking Glass | Upstream | GPL-2.0 |
| xcomp | Fork of Hyprland | BSD-3-Clause base |
| xvmd, xsh, xkernel.conf | **Ours** | To be chosen; permissive preferred |

Confirm every license before shipping. This table is a plan, not legal advice.

Everything we didn't write, we credit. Everything we did write, we open.
