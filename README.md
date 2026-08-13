# Evergreen Financial Training — Website

The public website for Evergreen Financial Training, a Bellevue organization
focused primarily on multilingual tax filing, review, planning, and education.

**Live site:** https://xiangc06.github.io/evergreen-tax-club/

---

## What this is

Three hand-written HTML pages sharing one stylesheet and one script. No build
step, no framework, no dependencies, no `npm install`. Edit any file in any text
editor and the change is live within a minute of pushing.

| File | Purpose |
|------|---------|
| `index.html` | Home — visitor routes, language band, services, filing process, review offer |
| `about.html` | About — mission, the work, leadership, membership |
| `contact.html` | Contact — details, the three enquiry routes, message form |
| `styles.css` | **All styling for every page.** Change it here, once. |
| `site.js` | Mobile menu, language band, contact form |

The only external resources are three Google Fonts, loaded from a `<link>` in
each page's `<head>`.

## Design direction — "Greenbar"

The site is built on the visual language of accounting ledger paper, which has
been pale green since the 1920s. That is where the green comes from — the
profession's own material, rather than a play on the word "Evergreen." There is
deliberately no tree.

- **Zilla Slab** — display face. Slab serif, the typography of printed forms.
- **Public Sans** — body face. The typeface the US government commissioned for
  federal civic documents, which is fitting for an organization whose work is
  IRS paperwork.
- **IBM Plex Mono** — figures, labels, and line numbers.
- **One accent only** — the oxide red `#9E3B2E`. Use it sparingly; its power
  comes from scarcity. Adding a second accent colour will flatten the design.

Recurring devices, and what each one means:

- **The field block** (`.fields` / `.field`) — the club's legal identity set the
  way a document states its filer. Numbered `1a`, `1b`, `2a` and so on.
- **The ledger** (`.ledger` / `.ledger-row`) — greenbar striped rows, used only
  where content genuinely enumerates. This is the one place stripes appear.
- **The doc rule** (`.doc-rule`) — the thin mono band that frames a page the way
  a printed form's edge does.

## How to edit it

1. Open the `.html` file you want to change for content, or `styles.css` for
   appearance.
2. Page content lives between `<body>` and `</body>`.
3. Commit and push to `main`. GitHub Pages redeploys automatically.

```bash
git add .
git commit -m "Describe your change"
git push
```

Give it 30–60 seconds, then hard-refresh the live site.

### Brand colors

Defined once, as CSS variables at the top of `styles.css`. Change a value there
and every page updates.

| Variable | Value | Used for |
|----------|-------|----------|
| `--paper` | `#FBFAF6` | Page background |
| `--bar` | `#E3EDE3` | Greenbar stripe |
| `--bar-soft` | `#EFF4EC` | Quiet panel fill |
| `--ink` | `#12241A` | Headings, dark bands, footer |
| `--ink-2` | `#35473C` | Body copy |
| `--slate` | `#64756A` | Labels and secondary text |
| `--rule` | `#C6D3C7` | Structural rules |
| `--stamp` | `#9E3B2E` | The single accent — buttons, links, active states |

---

## The language band

The homepage band lists **English and Chinese** — the two languages the club can
actually deliver the free program in.

Keep it that way. Listing a language the club cannot serve is worse than
omitting it: someone sees their language, works up the nerve to contact a
professional organization, and gets turned away. That is not inclusion, it is
advertising followed by a rejection. The "speak another language? ask us" line
beneath the band is what covers everyone else, honestly.

To add a language once a member can genuinely cover it, edit two places in
`index.html`, keeping them in the same order:

1. the `data-lang-stage` JSON attribute
2. the `.lang-chip` buttons directly beneath it

```json
{"language":"한국어","phrase":"무료 세금 지원","lang":"ko"}
```

The `lang` value is the [BCP 47](https://www.w3.org/International/articles/language-tags/)
code. Screen readers use it to switch pronunciation, so it must be right.

> Non-Latin scripts render through the `--intl` font stack in `styles.css`.
> Zilla Slab and IBM Plex Mono carry no CJK, Devanagari, or Thai glyphs, so any
> new script needs a face in that stack that covers it.

## The logo

`images/logo-shield.svg` is a vector rebuild of the club's original shield
mark — the tree over furrowed fields above a curling wave.

The original was recovered from the Internet Archive's capture of the old
`evergreentaxclub.org` (the site itself is gone), as a 634 × 148 PNG. This is a
redraw from that reference, not a trace: proportions and detail are close but
not identical, and it can be refined at any time. The source PNG is worth
keeping if a more exact match is ever wanted.

The mark is **inlined** into each page rather than loaded with `<img>`, which
is what allows two things:

- **`currentColor`** — the shield takes the colour of whatever it sits in. Dark
  ink in the header, paper white in the footer, from the same markup.
- **`--logo-bg`** — the curl inside the wave is carved out in the colour of the
  surrounding background. `.brand-logo` sets it to `--paper`; `.site-foot
  .brand-logo` overrides it to `--ink`. Without this the curl would disappear
  on the dark footer.

An `<img src="logo-shield.svg">` would break both — an SVG loaded that way
cannot see the page's CSS.

Each inlined copy uses a unique `clipPath` id (`etc-sh-1` … `etc-sh-6`), since
duplicate ids on one page are invalid and can cause the clip to be applied from
the wrong element.

`images/favicon.svg` is the same artwork with the colours hard-coded, because a
favicon is loaded outside the page and inherits nothing from it. **If you change
the logo, change both files.**

## Images

The three images are placeholder illustrations drawn in the site's own visual
language — flat vector, greenbar palette, no faces. They are deliberately
illustrations rather than stock photography: nothing on the page pretends to be
a photograph of this club that does not exist.

| File | Used on | Shape |
|------|---------|-------|
| `images/placeholder-review.svg` | `index.html` — member benefit | Square |
| `images/placeholder-gathering.svg` | `index.html` — about preview | Portrait 3:4 |
| `images/placeholder-education.svg` | `about.html` — the work | Portrait 3:4 |

Being SVG, they are a few kilobytes each, stay sharp on any display, and load
with no external request.

### Swapping in real photographs

Change the `src` and rewrite the `alt`. Nothing else moves — `.ph-img` handles
the framing and `.ph-square` / `.ph-portrait` hold the shape.

```html
<!-- before -->
<img class="ph-img ph-square" src="images/placeholder-review.svg"
     alt="Illustration of a tax return under review with one line flagged">

<!-- after -->
<img class="ph-img ph-square" src="images/review-session.jpg"
     alt="A club member reviewing a printed tax return with a client">
```

Supply photos at roughly **1200 × 1200 px** for the square slot and
**900 × 1200 px** for the portrait slots. They are cropped with `object-fit:
cover`, so keep the subject near the centre.

Always write real `alt` text describing what the photo shows. Screen readers and
search engines both depend on it.

## What is deliberately not on this site

The club's **EIN has been removed** from every page at the club's request, to
reduce exposure to business identity fraud.

Do not add it back without asking first. If a donor needs it for a deduction,
send it to them directly.

The site also carries no street address, no phone numbers, and no individual
email addresses — only the club's shared inbox. Keep it that way.

## How it's hosted

GitHub Pages, serving the `main` branch from the repository root.

Settings → Pages → Source: `Deploy from a branch` → `main` / `/ (root)`

There is no server. GitHub serves these files as static documents. **This means
the site cannot run server-side code** — no Python, no PHP, no databases, no
form processing, no APIs. Anything requiring a backend must be hosted elsewhere
(Render, Railway, Fly.io, Vercel) and linked to from here.

---

## Transferring this site to another GitHub account

The repository is fully transferable. History, code, and settings move intact.

### Steps

1. Go to **Settings → General → Danger Zone → Transfer ownership**
2. Enter the destination account or organization name
3. Confirm by typing the repository name
4. The recipient accepts the transfer via emailed invitation

### Important: the URL will change

GitHub Pages URLs are derived from the account name. After transfer:

```
https://xiangc06.github.io/evergreen-tax-club/     (old — stops working)
https://NEWOWNER.github.io/evergreen-tax-club/     (new)
```

GitHub redirects the *repository* URL after a transfer, but **not** the Pages
site. Any existing links, business cards, or search engine results pointing at
the old address will break.

### How to avoid the URL changing

Register a custom domain (for example `evergreentaxclub.org`, roughly $12/year)
and point it at GitHub Pages. The public address then belongs to the club, not
to any individual's GitHub account, and survives any number of transfers.

1. Buy the domain from any registrar
2. At the registrar, add DNS records:
   - Four `A` records for the apex domain pointing to `185.199.108.153`,
     `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - One `CNAME` record for `www` pointing to `NEWOWNER.github.io`
3. In the repo: Settings → Pages → Custom domain → enter the domain → Save
4. Wait for the DNS check to pass, then tick **Enforce HTTPS**

This also means the club is never locked out of its own website if the person
holding the GitHub account becomes unavailable — which is the main reason to do
it for an organization rather than an individual.

### Recommended for an organization

Rather than transferring between personal accounts, create a **GitHub
Organization** for the club (free) and transfer the repository there. Multiple
people can then hold admin access, and ownership is not tied to one individual's
personal account.

---

## How the contact form works

There is no server behind this site, so the form cannot post anywhere. Instead
it composes a pre-filled email in the visitor's own mail app, carrying across
everything they typed. Nothing is stored on the site.

To collect messages directly instead — so a visitor without a configured mail
app can still reach you — sign up for a hosted form service (Formspree and
Netlify Forms both have free tiers), point the `<form action="...">` at it, then
delete the `data-mailto-form` attribute and its handler at the bottom of
`site.js`.

## Fixed in the redesign

For reference, the previous version of this site had these defects:

- The contact form silently discarded messages — the inputs were not in a
  `<form>` and the button was a bare `mailto:` link that ignored them.
- About and Contact had no mobile navigation at all; the header nav was hidden
  below 860px with no button to reveal it.
- The CSS was copy-pasted into all three pages and had already drifted.

## Accessibility notes

Worth preserving if you change things:

- The language band stops cycling for visitors who have asked for reduced
  motion, and pauses on hover and keyboard focus.
- Language chips are real `<button>` elements, so they are keyboard reachable.
- Focus outlines are visible throughout — do not remove the `:focus-visible`
  rule in `styles.css`.
- Non-Latin scripts need `--intl` in their font stack. Zilla Slab and IBM Plex
  Mono carry no CJK or Devanagari glyphs.

## Contact

EvergreenTaxClub@gmail.com
