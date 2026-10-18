# XKernel, Open

*Paper 1 of 5: the manifesto*

*Maxwell*

---

## I. The machine you were promised

At some point, computers stopped being yours.

It didn't happen in one moment. It happened one feature at a time. A bar appeared at the top of the screen, then one at the bottom. A search box started searching the internet instead of your files. An assistant arrived uninvited and moved into the corner. A news feed came along with the weather. Each of these things was small, each was defended as a convenience, and each one took a little of the machine away from you.

Today, a new computer spends a large share of its life on itself: indexing, syncing, recommending, updating, phoning home. Fans spin up while you're doing nothing. Your RAM fills with things you never opened. You bought the hardware, but someone else is using it.

XKernel starts from a simple question:

**What if the operating system did almost nothing?**

Not nothing useful. It would do the few things only it can do, and do them extremely well. It would hold your machines, share the hardware fairly and quickly, and then get out of the way.

## II. Every OS is good at something

Here's an honest observation from anyone who has used more than one operating system: none of them is the best at everything, and all of them are the best at something.

Windows runs the games, and the one piece of software your school or job insists on. Linux runs the developer tools, the servers and the freedom. The BSDs and illumos are clean, careful systems with decades of engineering in them, still used by people who know exactly why. Each one is a different answer to the same question, and each answer is good in its own way.

But the normal way to use computers forces you to pick one. You dual-boot, rebooting and losing your place every time. Or you run the others in a virtual machine, a slow window inside your "real" OS, sharing the GPU through a straw while the host's desktop, search indexer and assistant chew through the resources around it.

Both options treat every OS except one as a guest in someone else's house.

XKernel doesn't have a main OS. **Every OS is a guest of equal rank in a house that is almost empty.**

## III. What XKernel is

When you turn on an XKernel machine, you see your wallpaper, softly blurred. That's it. No bar, no dock, no app drawer, no icons, no clock in the corner, no assistant.

Then you open your machines. XKernel calls each one a **Kernel**, because that's what it is: a whole operating system with its own kernel, running on real hardware through Linux's KVM. They appear as tiles, arranged automatically the way a tiling window manager like Hyprland arranges windows. Windows on the left, Linux on the right, OpenIndiana in the corner because you felt like it. Move between them with the keyboard. Make one fullscreen. Stack them. Rearrange them.

When you need to talk to XKernel itself, you open the **XKernel shell**. It's not bash, and it's not a general-purpose terminal. You don't do your computing in it, because your computing happens inside your Kernels. The shell exists for exactly two things: shaping how XKernel looks and behaves, and quick actions like start this, pause that, save everything, give this Kernel the GPU.

And then there's the part that feels like magic: **your machines are always there.** Close the lid, and every Kernel is saved. Shut down, and every Kernel is saved. Turn the machine back on, and they're exactly where you left them, mid-sentence, mid-compile, mid-game. You don't boot your operating systems anymore. You continue them.

## IV. Why "almost nothing" is fast

Here is the core technical bet of XKernel, in one sentence:

**A virtual machine isn't slow because virtualization is slow. It's slow because it's starved.**

Modern CPUs run guest code at essentially native speed. Hardware virtualization (Intel VT-x, AMD-V, Arm's virtualization extensions) has been mature for over fifteen years. Linux's KVM is the same technology that runs much of the world's cloud computing. The CPU part of a VM is a solved problem.

What makes VMs feel slow is everything around the CPU: an emulated graphics card drawing frames in software, a host desktop competing for the same resources, a host OS that treats the VM as just another app to be scheduled behind its search indexer.

XKernel attacks both sides:

1. **Give guests real hardware.** Graphics go straight to a real GPU through passthrough (VFIO) or GPU sharing (SR-IOV), with frames carried into your tiles through shared memory (Looking Glass) instead of being copied and re-encoded. That's how a VM gets close to 120 frames per second. Paper 3 covers it in detail.
2. **Make the host nearly weightless.** No desktop environment, no background services you didn't ask for, no assistant. The only thing the host draws is a blurred wallpaper and tile borders. Nearly every cycle and every byte goes to your Kernels.

The fastest host is the one that isn't doing anything.

## V. Why we fork instead of starting over

The first version of this idea was called MultiVM, and it had no answer to the obvious question: how?

Writing a kernel from scratch is a lifetime of work before you even reach the interesting part. You'd spend years writing drivers for disks, network cards, USB, power management and a thousand chipsets, just to boot. A from-scratch kernel would still be learning to boot by the time XKernel should be shipping.

The answer was always there: **the Linux kernel is open source.** Anyone can take it, study it, change it and share the result. KVM, the engine that runs virtual machines at native speed, is already inside it. Hyprland, a beautiful tiling compositor, is open source too. So are QEMU and Looking Glass. The pieces of XKernel already exist, built by thousands of people over decades.

XKernel is built the way most great open source is built: by standing on what exists and adding what's missing. We call this the **Fork Arc**. The rule that keeps it honest is to **never hard-fork.** XKernel's changes live as a small, clean stack of patches on top of upstream Linux, rebased with every release. That way every security fix and every new driver the Linux community ships flows into XKernel for free. We take a lot from open source, so we stay compatible with it and give back.

That's also why XKernel is open, and always will be. It's built from open software, it exists because of open software, and it would be wrong to close it.

## VI. What XKernel is not

Saying no matters as much as saying yes.

- **XKernel is not a desktop.** If you want a browser, open a Kernel. The host stays empty on purpose.
- **XKernel doesn't run macOS or iOS.** Apple's license only allows macOS on Apple hardware, and iOS can't legally be virtualized. We respect that. A connected iPhone can still show up as a mirrored tile through open AirPlay receivers, but that's mirroring, not virtualization, and we'll always say so.
- **XKernel is not a security product first.** Qubes OS already does compartmentalization for security, and does it well. XKernel's first priorities are freedom, speed and calm. Isolation comes as a side effect.
- **XKernel isn't for every computer.** It wants real virtualization hardware, plenty of RAM and, for the full experience, a GPU it can share or hand over.

That last point is personal. The README will say it plainly:

> *You can run this beast. me, Maxwell, cant.*

Plenty of good open source started on hardware that couldn't run it. The person writing it is building it anyway, starting on a Raspberry Pi, for the machine they don't have yet and for everyone who does.

## VII. The mark

XKernel's mark is an X made of four corner brackets around a diamond, with a white core at its center. Four corners, like the tiles of a screen. In the middle, the one thing they all stand on.

## VIII. Open

So here is the promise, as short as we can make it.

Your machine belongs to you. Every operating system you love can run on it at the same time, at full speed, side by side, and stay exactly where you left it. Between them there's nothing but your wallpaper and some quiet.

**XKernel, open.**
