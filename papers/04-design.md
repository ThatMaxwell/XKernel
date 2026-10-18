# Wallpaper and Quiet

*Paper 4 of 5: design and identity*

---

## I. The design is the absence

Most operating systems are designed by adding things. XKernel is designed by taking things away and then making what's left beautiful.

When an XKernel machine is idle, the screen shows **your wallpaper, blurred.** No clock. No date. No battery icon. No notification badge. No search box. Nothing that asks for your attention.

This isn't minimalism for a screenshot. It's a functional decision: every pixel the host draws is a pixel your Kernels didn't get, and every element that asks for your attention takes some of it away from your work. The empty wallpaper is a promise you can see: **this machine isn't doing anything you didn't ask for.**

---

## II. Principles

1. **Quiet.** XKernel never speaks first. No pop-ups, sounds, tips or "did you know". It answers when asked.
2. **Calm motion.** Animations are soft and quick: tiles glide, focus fades. Nothing bounces for attention. Motion explains what happened. It's never decoration.
3. **The Kernels are the stars.** Tile borders are thin. The gap between tiles is the wallpaper. The host frames the guests, never competes with them.
4. **Keyboard-first, mouse-friendly.** Everything is reachable from the keyboard, and nothing *requires* it.
5. **Honest status.** When something matters (a Kernel can't be saved, a device is busy), XKernel says so, plainly and once.
6. **One file is the truth.** What you see is what `xkernel.conf` says. No hidden settings.

---

## III. The screen

### Idle

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│                                                        │
│               (your wallpaper, blurred)                │
│                                                        │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Working

```
┌────────────────────────────────────────────────────────┐
│ ┌──────────────────────────┐ ┌───────────────────────┐ │
│ │                          │ │                       │ │
│ │        Windows           │ │        Linux          │ │
│ │                          │ │                       │ │
│ │                          │ ├───────────────────────┤ │
│ │                          │ │      OpenIndiana      │ │
│ └──────────────────────────┘ └───────────────────────┘ │
└────────────────────────────────────────────────────────┘
          the gaps are the blurred wallpaper
```

- **Gaps:** the wallpaper shows through, so the whole screen still feels like one calm surface.
- **Focus:** the focused tile gets a thin, quiet border. Unfocused tiles stay fully visible, with no dimming games.
- **Labels:** none by default. A tile is identified by what's in it. Holding the XKernel key briefly shows each Kernel's name over its tile, then fades.

### The shell

`xsh` opens as a small floating panel, centered, over the blurred wallpaper, never inside a tile. It feels like a command palette more than a terminal. Type, act, and it's gone.

```
            ┌──────────────────────────────────┐
            │ › gpu give windows               │
            │   windows now has GPU 0          │
            └──────────────────────────────────┘
```

---

## IV. Motion

| Moment | Motion |
|---|---|
| Kernel starts | Tile fades in from the wallpaper (~200 ms) |
| Kernel closes | Tile dissolves back into the wallpaper |
| Tiles rearrange | Smooth glide to the new layout |
| Focus changes | Border cross-fades |
| Shell opens | Panel fades and rises slightly |
| Save on sleep | Each tile softly blurs into the wallpaper, one by one: your machines going to sleep |
| Resume | The reverse: each tile sharpens out of the blur, exactly as it was |

The save and resume animation is XKernel's signature moment. It shows the promise physically: your machines aren't gone, they're resting in the wallpaper.

---

## V. Typography and color

- **Type:** one clean sans for everything the host shows, and a monospace for `xsh`. The host shows so little text that one family is enough.
- **Color:** XKernel itself has almost no color. The wallpaper provides it. The host's accent is a single, user-chosen color, used only for focus borders and the shell cursor.
- **Dark by default**, because a quiet machine looks like night.

---

## IV½. First boot

XKernel has no welcome screen, no setup wizard and no tour. It speaks exactly once, on the very first boot.

**Sequence:**

1. **Boot:** the X mark fades in at the center, holds for a breath, and fades out.
2. **The words.** Over the blurred wallpaper, centered, thin and white, one line after the other:

   ```
   Welcome.
   You are now inside XKernel.
   ```

3. **Hold** about 2.5 seconds. No sound.
4. **Collapse.** The text pulls inward into the XKernel logo, and only the logo remains.
5. **Fade.** The logo fades out. In its place, smaller, at the bottom of the screen:

   ```
   Press ⊞ + Space to open xsh.
   ```

6. **Gone.** The first time xsh opens, the hint disappears permanently. From then on, every boot ends on pure wallpaper.

**Why:** an empty screen is bold for people who know XKernel and looks like a crash to people who don't. One cold welcome and one breadcrumb, shown once, keeps the silence without leaving anyone lost.

**Tone:** cold and formal, never cute. No exclamation marks. "Inside" is deliberate: you haven't installed something, you've entered it.

---

## V½. Tributes

XKernel's tiles carry no labels and no decoration, with one deliberate exception: **tributes.**

Some operating systems have a story that deserves a nod. When one of them runs as a Kernel, its tile gets a single small, silent mark in the top-right corner, drawn in the same thin style as the focus border. It's never animated, never clickable, never loud.

| Kernel | Mark | Why |
|---|---|---|
| **TempleOS** | ✝ | Terry A. Davis built TempleOS alone over about a decade: kernel, compiler, his own language (HolyC), editor and games. He built it as a temple. The cross honors what he meant it to be. |

**Rules for tributes:**
- A tribute honors a **person's or a community's work**, not a brand.
- It's respectful. Never a joke, never an easter egg.
- One mark per Kernel, small and still.
- New tributes are added sparingly, with the reason written down here.

---

## VI. The mark

XKernel's mark is **an X made of four corner brackets around a diamond**, with a white core at its center.

### How it's used

- **Boot:** the mark appears in the center of the screen for a breath, then fades as your Kernels resume. It's the only time XKernel draws anything decorative.
- **First boot:** the welcome words collapse into the mark (see First boot).
- **Docs and the website:** the mark heads the README, the papers and the release notes.
- **Never in the way:** the mark doesn't live in a corner of your screen.

### Drawing rules

- Solid shapes only. No glow, no gradient, no outline, no shadow.
- On dark backgrounds the brackets are light (`#F2F2F0`) and the core is black. On light backgrounds, the reverse.
- Keep clear space around it of at least a quarter of its width.
- Never rotate, stretch or recolor it with an accent.

---

## VII. Voice

XKernel writes the way it looks:

- Short sentences. No exclamation marks in the UI.
- It says what happened, not how it feels about it: "Windows saved." not "All done! 🎉"
- Error messages say what's wrong and what to do: "GPU 0 is in use by Windows. Give it back with `gpu take windows`."
- Humor lives in the README and the papers, never in the machine.

Which is why the README can say, with a straight face:

> *You can run this beast. me, Maxwell, cant.*

---

## VIII. Kinship with ChangeOS

XKernel shares a philosophy with ChangeOS, its sister project on Android: **silent by default.** ChangeOS boots without sound, removes what you didn't ask for and draws its status as a quiet ring. XKernel is the same idea scaled up to a whole machine: remove everything, then let what's left be calm and fast. The two projects are separate but come from the same taste.
