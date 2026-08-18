/**
 * Long-form drafts — 16–17 August 2026.
 *
 * Style note: inline code spans inside these template literals close the
 * literal and break the parse. Use bold instead.
 *
 * Pass --update to rewrite existing drafts; published articles are skipped.
 */
import { getPayload } from "payload";
import config from "@payload-config";
import type { Article } from "../payload-types";

type Draft = {
  slug: string;
  title: string;
  excerpt: string;
  categorySlug: Article["categorySlug"];
  tags: string[];
  readingMinutes: number;
  coverImageUrl: string;
  body: string;
};

const P = "?w=1600&h=900&fit=crop&crop=entropy&q=80";

const DRAFTS: Draft[] = [
  {
    slug: "session-hijacking-amnesiastealer-chrome-devtools-protocol",
    title:
      "Two campaigns, two operating systems, one idea: stop stealing the password and drive the browser instead",
    excerpt:
      "AmnesiaStealer clones a Mac user's Chromium profile and streams the session back at 3fps. SpecterOps' Windows technique switches on Chrome's debugging protocol inside the running process. Neither needs your credentials, and neither is stopped by MFA.",
    categorySlug: "security",
    tags: [
      "session-hijacking",
      "browsers",
      "macos",
      "windows",
      "mfa",
      "post-exploitation",
    ],
    readingMinutes: 11,
    coverImageUrl: `https://images.unsplash.com/photo-1762330468765-cf931a2af2dc${P}`,
    body: `Two pieces of research landed within days of each other, on different operating systems, from unrelated sources. They arrive at the same place.

**Jamf** documented **AmnesiaStealer**, macOS malware that takes over the victim's browser session and streams it back to the operator.

**SpecterOps** documented a Windows technique that turns on Chrome's own debugging protocol inside a browser that is already running and already logged in.

Neither steals a password. Neither is defeated by multi-factor authentication, because the authentication already happened.

## AmnesiaStealer: drive the Mac's browser remotely

It arrives through a **ClickFix** campaign — a fake GitHub download page serving a password-protected ZIP, with a shell-script loader fetching the payload. Jamf notes the template was previously used for the **Atomic** and **MacSync** infostealers.

The interesting component is **stream_module**. It:

1. **Duplicates the user's browser profile** from any of seven Chromium browsers — Chrome, Edge, Vivaldi, Arc, Opera, Brave, Chromium
2. Launches that copy **headless, with defences weakened**
3. Opens a **WebSocket** back to the operator

The operator then gets **a live screencast at about 3fps**, with keyboard, mouse, scroll, navigation and tab control.

That is not data theft. That is remote desktop, scoped to the browser, inside an already-authenticated session.

It also harvests the conventional things: credentials from **16 Chromium-based browsers**, cryptocurrency wallets, **Apple Notes**, documents and **keychain** data.

## The Windows technique: switch on DevTools in a live process

SpecterOps' **CDP-Enable-BOF** builds on earlier work by DeathFlamingo and Cedric Van Bockhaven. It finds the running Chrome or Edge process, loads the browser's DLL, resolves internal Chromium symbols by byte signature, allocates two small stubs and a context block, installs a temporary remote window procedure, and calls **StartRemoteDebuggingServer** on the browser's UI thread.

The Chrome DevTools Protocol is then live inside a browser the user is sitting in front of.

What that gives an operator, through the companion **CDP-Toolkit**:

- Cookies via **Storage.getCookies** — read from the browser's state, **not from the cookie database on disk**
- History, bookmarks, extensions and saved-password metadata
- **Chromium's own autofill workflow** triggered against a matching origin, then the resulting username and password fields read back
- An offscreen browser target for interactive screencasting, or **HTTP and HTTPS proxied through the victim's authenticated browser**

Requirements, stated plainly by SpecterOps:

> The technique assumes that an operator already has code execution on the Windows host and does not involve exploiting a Chrome or Edge security vulnerability.

Tested against Chrome **147.0.7727.102** and Edge **147.0.3912.98**, x64 Windows only. The byte signatures are version-specific, which is the main friction.

## Why this beats the controls you bought

Every defence in the credential chain assumes the attacker needs to authenticate.

- **MFA** proves who you are at login. This is after login.
- **Conditional access** checks device and location. The device *is* the corporate device and the location *is* the office.
- **Impossible-travel detection** sees nothing, because the requests come from the victim's own machine.
- **Cookie theft protections** are partly sidestepped. Chrome 146 introduced **Device Bound Session Credentials**, binding refresh tokens to hardware keys to stop off-device replay — SpecterOps says their approach can sidestep protections meant to prevent off-device replay by working **through the authenticated browser context itself**. They do not claim to extract the private key. They do not need to. The browser holding the key does the work.

Ordinary cookies are fully exposed.

This is the same conclusion the [passkey research in August reached from a different direction](/article/passkey-attacks-2026-synced-keys-entra-windows-hello): phishing-resistant authentication is a statement about phishing. It does not describe what happens on a host the attacker already owns.

## What Google has already done, and what it did not fix

In **March 2025** Google acknowledged rising abuse and changed remote debugging behaviour from **Chrome 136**: debugging switches are ignored unless paired with a non-standard user data directory.

That closed the easy path — relaunching Chrome with a debugging flag. It does not close this one, which never restarts the browser and never passes a flag.

## Detection

**On Windows**, Sysmon **Event ID 8 (CreateRemoteThread)** and **Event ID 10 (ProcessAccess)** catch injection targeting **chrome.exe** and **msedge.exe**. SpecterOps notes Event 10 is extremely noisy and needs filtering before it is usable.

**On macOS**, look for a Chromium binary launched **headless** with a profile path that is not the user's, and outbound WebSocket connections from a browser process to somewhere that is not a known service.

More generally, the signal is **a browser process behaving like two browsers** — one the user sees, one they do not.

## What actually helps

- **Assume the session, not just the credential, is the asset.** Shorten session lifetimes for privileged applications and require step-up re-authentication for sensitive actions. That is the one control that meaningfully limits a hijacked session.
- **Deploy Device Bound Session Credentials** where you can. It does not stop this technique, but it stops the much more common off-device cookie replay.
- **Alert on browser process injection.** It is a narrow, high-signal detection once Event 10 is filtered.
- **Tell staff the actual ClickFix rule**: never paste a command into a terminal because a web page told you to. Jamf's guidance is exactly that, and it is the entire initial access vector for the macOS half.
- **Stop treating macOS as the safe platform.** AmnesiaStealer is the third infostealer family reusing the same delivery template.`,
  },
  {
    slug: "akira-safe-mode-edr-bypass-encryption-failed-data-gone",
    title:
      "Akira rebooted the machine into Safe Mode to blind the EDR — the encryption still failed, and it did not matter",
    excerpt:
      "Huntress traced a 4 August intrusion from an exposed SonicWall VPN with no MFA to a failed ransomware payload five hours later. The files were already in the attacker's S3 bucket. Defender quarantined akira.exe after the reboot, too late to matter.",
    categorySlug: "security",
    tags: [
      "ransomware",
      "akira",
      "edr",
      "vpn",
      "incident-response",
      "data-extortion",
    ],
    readingMinutes: 10,
    coverImageUrl: `https://images.unsplash.com/photo-1506399441630-774ef431470f${P}`,
    body: `**Huntress** documented an Akira affiliate intrusion on **4 August 2026** that ended in failure — the ransomware would not run — and was still a serious breach.

That gap is the point of writing it up.

## The timeline

| Elapsed | What happened |
| --- | --- |
| 0:00 | Initial access via **exposed SonicWall VPN**, compromised credentials, **no MFA** |
| ~2:00 | RDP to the **domain controller**, Active Directory enumeration |
| — | Files archived with **WinRAR**, uploaded with **s5cmd** to an attacker-controlled **S3 bucket**; **AnyDesk** installed |
| — | Reboot into **Safe Mode with Networking** |
| ~5:00 | **akira.exe** fails to execute |

Five hours from stolen credential to attempted encryption. Two of those hours before they were on the domain controller.

## The Safe Mode trick

Safe Mode with Networking starts Windows with a limited set of drivers and services, which as Huntress puts it generally prevents most third-party software and services from loading.

Your EDR is third-party software.

> the host had no working EDR, and AV was blinded

That window was about **ten minutes**.

The detail that shows this was practised: before rebooting, the attackers **added AnyDesk to the Safe Mode registry** so their remote access survived into the blinded environment. Safe Mode is useless to an intruder who cannot reach the machine once it gets there.

This is not a new technique — ransomware crews have rebooted into Safe Mode for years — but it remains effective because the thing that makes Safe Mode useful for repair is exactly what makes it useful here.

## Why the encryption failed, and why that is the least important part

**akira.exe** failed with **low virtual memory** errors. Then, after the machine rebooted back to normal mode, **Defender's scheduled scan** found and quarantined it — despite real-time protection having been disabled.

So: the ransomware did not run, the endpoint protection eventually did its job, and the incident is still a data breach.

The files were exfiltrated to S3 **before** the Safe Mode reboot. Credentials were taken. Nothing about the encryption failing pulls any of that back.

Double extortion has been standard for years, and this is what it means operationally: **encryption is the optional half.** A crew that steals your data and fails to encrypt anything still has your data, still has a leak site, and still has a negotiation. Recovering from backups answers a question they did not ask.

## The initial access is the part you can actually fix

An internet-exposed VPN, valid credentials, **no MFA**.

That is the same door as [the UNC6671 vishing campaign](/article/unc6671-blackfile-rebrand-vishing-passkey-enrollment), [the SonicWall credential harvesting Volexity tracked](/article/sonicwall-attacks-uta0533-inc-ransomware), and a large share of every ransomware report published this year. It is not a clever attack. It is the absence of one control.

## What to do

- **MFA on every VPN and remote access path**, without exception for service accounts or "temporary" access.
- **Alert on unexpected Safe Mode boots.** A production server rebooting into Safe Mode with Networking is either an emergency or an intrusion, and both warrant a page. The registry write that adds a service to Safe Mode is itself a detection.
- **Watch for s5cmd, rclone and WinRAR on servers.** Bulk archiving followed by an upload utility is the exfiltration stage, and it happened here before anything encrypted.
- **Alert on outbound volume to cloud storage** from hosts that have no business talking to S3.
- **Do not treat a failed encryption as a near miss.** Scope it as a data breach, because that is what it was.

Huntress's conclusion is the one worth carrying: the attackers exfiltrated credentials and files for extortion regardless of the payload failing. **Ransomware success no longer requires ransomware.**`,
  },
  {
    slug: "operation-klonen-commerzbank-30-million-four-days-arrests",
    title:
      "€30 million left German bank accounts in four days — the arrests came almost three years later",
    excerpt:
      "Operation Klonen ended with four arrests in Brazil and three prosecutions in Europe over a 2023 fraud against Commerzbank. The opening was a faulty software update at a payment processor, and R$106 million in assets has been seized.",
    categorySlug: "world",
    tags: [
      "fraud",
      "law-enforcement",
      "banking",
      "brazil",
      "germany",
      "supply-chain",
    ],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1568044852337-9bcc3378fc3c${P}`,
    body: `Brazilian Federal Police and Germany's **BKA** have closed a case that began in **November 2023**, when roughly **€30 million** (about **$34.6 million**) was taken from German online banking accounts over **four days**.

**Four suspects arrested in Brazil** — Rio de Janeiro, Guarulhos, Goiânia, Carapicuíba. **Three charged in Europe**, with prosecutions in Spain and Bulgaria. Assets worth **R$106 million** (about **$22.4 million**) seized.

The operation is called **Klonen**.

## The opening was a software update

The vulnerability was not in the bank. It was introduced by **a faulty software update at a financial institution's payment and transaction-processing system**.

That is a supply-chain failure in the least glamorous possible form: a routine release at a processor, and a window it opened.

Attackers used it to initiate unauthorised withdrawals from customer accounts, then moved the money to Brazil through pass-through accounts, shell companies, payment institutions, virtual-asset platforms and fraudulent payment cards.

**Commerzbank** is the affected institution. Its spokesperson:

> unauthorized direct debits were made from customer accounts. There was no financial loss to customers.

Worth being precise about that sentence. Customers were made whole. The bank absorbed the loss. Neither of those facts means the money was recovered — that is what the seizures are for, three years later.

## Four days

The compression is the part that should worry anyone running payments.

€30 million over four days is roughly €7.5 million a day through a fault introduced by an update. Whatever monitoring existed did not stop it inside that window, and the fault was live long enough to be found, weaponised and drained.

## Why the arrests took three years

Because the money went through pass-through accounts, companies, payment institutions, virtual-asset platforms and fraudulent cards — in that order, across at least four countries.

Each hop is a separate legal request. Brazil, Germany, Spain and Bulgaria each have their own process, and the chain has to be reconstructed in order before anyone can be charged.

One arrested suspect **ran for elected office in 2024** using the proceeds, which is the sort of detail that makes a financial-crime case findable: laundering that ends in visible spending leaves a trail that laundering into more crypto does not.

## Why we are writing up an arrest

Because the enforcement side is under-covered, and the shape of it is informative.

The stories that dominate are breaches. The stories that rarely get written are the ones where it works — and when they are written, they show what actually makes a case: money that has to become spendable, a jurisdiction willing to seize, and years of patient correlation.

Set this against [the White House memo proposing that vetted US companies conduct disruption operations against foreign criminal groups](/article/trump-memo-private-companies-hack-back-transnational-crime). The argument for that memo is that law enforcement is too slow. Klonen took three years and produced arrests, charges in three countries and $22 million in seizures. Slow, and it ended with people in custody rather than with infrastructure that reconstitutes in a week.

Both things are true. Which one you weigh more heavily is the actual policy question.

## What is not established

- **Which processor** shipped the faulty update, and what the fault was. Neither has been named in the reporting we could reach.
- **How much of the €30 million has been recovered**, as opposed to seized pending proceedings.
- **Whether the seven charged are the whole group.** Nothing in the reporting suggests it is closed.

## The lesson for anyone running payments

The bank did nothing wrong that has been reported. Its processor shipped an update, and €30 million moved.

If you run reconciliation, the question this raises is not "are we patched". It is: **would you notice €7.5 million a day of unauthorised direct debits, and how many days would it take?**`,
  },
  {
    slug: "windrelay-ghost-tap-nfc-relay-spynote-android",
    title:
      "The scam ends with the victim tapping their own card against their own phone",
    excerpt:
      "Group-IB's WindRelay pairs a reader on the victim's Android with an emulator at the attacker's terminal, relaying EMV commands over WebSocket in real time. SpyNote installs it silently; the victim is talked into the tap.",
    categorySlug: "gadgets",
    tags: [
      "android",
      "nfc",
      "payment-fraud",
      "malware",
      "social-engineering",
      "banking",
    ],
    readingMinutes: 9,
    coverImageUrl: `https://images.unsplash.com/photo-1509017174183-0b7e0278f1ec${P}`,
    body: `**Group-IB** researchers Alexander Grabko, Konstantinos Angelopoulos, Pavlos Gaitanis and Bruno Bijelić have documented **WindRelay**, Android malware that turns a victim's phone into one half of a live payment-card relay.

The technique is known as **Ghost Tap**. What makes this write-up worth reading is the last step of the social engineering.

## How the relay works

Two components, synchronised over shared command-and-control infrastructure via **WebSocket**:

**The reader** runs on the victim's phone. It talks to a physical payment card over NFC.

**The emulator** runs on the attacker's device, at a real payment terminal, pretending to be that card.

Between them they relay **EMV APDU commands and responses** in real time. The terminal believes it is talking to the card. The card believes it is talking to a terminal. Both are right; they are just several hundred miles apart.

The attacker never touches the card and never appears on the terminal's records as anything other than a normal contactless payment.

## The infection chain, and the part that stands out

1. **Phishing, smishing or vishing** lures the target into sideloading an APK
2. The APK is **personalised with the victim's name** — meaning reconnaissance happened before the call
3. **SpyNote RAT** provides remote access
4. The fraudsters use SpyNote's **Accessibility Service** to silently install and activate the NFC malware — **no user interaction**
5. The victim is then **socially engineered into tapping their physical card against their own infected phone**

Step five is the one to sit with.

Every instinct about card fraud assumes the card has to leave your control, or its details have to be stolen. Here the card never leaves the victim's hand, no card number is exfiltrated, and the fraudulent purchase happens in a shop the victim has never been to — because the victim performed the authenticating action themselves, on their own device, while being told it was something else.

The **Accessibility Service** abuse in step four is the same permission class that made [PROMPTSPY able to navigate an Android UI autonomously](/article/gtig-first-ai-developed-zero-day-promptspy-android). Once granted, it is the most powerful thing on the phone.

## Scale and targeting

**23 samples**, impersonating financial institutions in **Czechia, Slovakia and Slovenia**.

First detected **late August 2025**; samples analysed from **November 2025 through July 2026**. So this has been running for roughly a year in a specific region.

Group-IB does not publish theft figures, and neither will we.

## Two ways to monetise one infection

The report's framing is worth quoting in substance: the RAT-driven remote access can be used to **take out a digital loan**, while the NFC malware enables **physical, card-present purchases**.

One compromise, two channels — one that drains credit the victim did not know they had, one that spends at a till. Card-present transactions also carry weaker fraud protections for the customer in many markets than card-not-present ones do, precisely because a physical tap has historically been strong evidence the cardholder was there.

Here it is evidence of nothing.

## What protects people

- **Never sideload an APK**, whatever the reason given. This is the whole chain's foundation and the only step that is entirely in the user's control.
- **Treat any request to tap your card against your phone as fraud.** There is no legitimate support process that needs this. This is the single most useful sentence to pass on to anyone non-technical.
- **Check what has Accessibility Service permission** — Settings → Accessibility. Anything there can see and control everything on screen.
- **A personalised approach is not proof of legitimacy.** The APK carrying your name means they did homework, not that they are your bank.
- **Turn NFC off when not using it**, on a phone you have any doubts about.

For banks: a contactless transaction relayed this way looks like a normal card-present tap. The detectable signals are behavioural — geography against the customer's phone, terminal patterns, velocity — not anything in the transaction itself.`,
  },
];

const UPDATE = process.argv.includes("--update");
const payload = await getPayload({ config });

for (const draft of DRAFTS) {
  const { docs: clash } = await payload.find({
    collection: "articles",
    where: { slug: { equals: draft.slug } },
    limit: 1,
    depth: 0,
  });

  if (clash.length > 0) {
    const existing = clash[0] as { id: number | string; status: string };
    if (!UPDATE || existing.status === "published") {
      console.log(`skip (${existing.status}): ${draft.slug}`);
      continue;
    }
    await payload.update({ collection: "articles", id: existing.id, data: { ...draft } });
    console.log(`updated: ${draft.slug} (${draft.body.split(/\s+/).length} words)`);
    continue;
  }

  const created = await payload.create({
    collection: "articles",
    data: {
      ...draft,
      author: "Prince Baruwala",
      publishedAt: new Date().toISOString(),
      status: "draft",
      featured: false,
      views: 0,
    },
  });

  console.log(
    `drafted: ${draft.slug} (id ${created.id}, ${draft.categorySlug}, ${draft.body.split(/\s+/).length} words)`,
  );
}

process.exit(0);
