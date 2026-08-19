/**
 * Long-form drafts — 20 August 2026.
 *
 * Style note: inline code spans inside these template literals close the
 * literal and break the parse. Use bold instead.
 *
 * Carousel note: scripts/instagram-carousel.ts scores paragraphs on standalone
 * digits and penalises ones opening on a back-reference, and it cannot use a
 * table. So each section's strongest paragraph is written to stand alone and
 * carry its own figures rather than leaving them in a table above it.
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
    slug: "macsync-stealer-clickfix-rotating-domains-static-api-key",
    title:
      "A Mac stealer hides behind fake dog trainers and fake AI startups — and the operator left one thing that never rotates",
    excerpt:
      "Microsoft Defender Experts has tied 30-plus domains to MacSync, a macOS stealer delivered by getting people to paste a command into Terminal. It takes the Keychain, SSH keys, AWS credentials and Kubernetes configs. The build token changes every deployment; the API key does not, which is the whole detection.",
    categorySlug: "security",
    tags: [
      "macos",
      "infostealers",
      "clickfix",
      "social-engineering",
      "credentials",
      "threat-intel",
      "detection",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1650661926447-9efb2610f64c${P}`,
    body: `**Microsoft Defender Experts** published infrastructure in **August 2026** linking more than **30** domains to **MacSync**, an information stealer that targets macOS. Microsoft says it observed active data exfiltration rather than beaconing alone, and did not attribute the activity to a named group or give a victim count.

The initial analysis came from **RST Cloud** on **8 May 2026**.

## What it takes

The list is longer than the usual browser-password haul, and it is aimed at people who build things:

- macOS **Keychain** material
- Browser credentials, cookies, **session data** and history
- **SSH keys**
- **AWS credentials**
- **Kubernetes** configurations
- Apple **Notes**
- Files from the usual user directories, plus host and user details

Session cookies and SSH keys are the two that hurt most. A password can be rotated after you notice; a live session cookie is already authenticated, which is the same reason [AmnesiaStealer's browser-session hijacking](/article/session-hijacking-amnesiastealer-chrome-devtools-protocol) mattered more than its credential theft did.

## How it gets there

Nobody is exploiting anything. Someone is asking.

Execution starts in an interactive **zsh** Terminal session — the signature of a **ClickFix** campaign, where a compromised or fake page shows a "fix this" or "verify you are human" step and asks the visitor to copy a command and paste it into Terminal. The victim runs the malware themselves, with their own privileges, having been told it will solve a problem.

Apple has shipped a countermeasure. **macOS 26.4** and later adds paste protection in Terminal, blocks commands arriving through the pasteboard, and scans AppleScript. If your fleet is behind 26.4, that upgrade is a control, not a nice-to-have.

## The domains are the interesting part

The **32** domains Microsoft published are not the usual random strings. They read as ordinary small businesses — a North Carolina cabin rental, a Georgia dog trainer, a Delaware home inspector, a Dayton mould inspector, a New Jersey pet sitter, a San Diego taekwondo school, a Miami PC support shop — mixed with plausible-sounding AI companies whose names end in "agent".

That naming is deliberate and it works on two audiences at once. A person glancing at a URL sees a real-looking local business. An analyst reviewing proxy logs sees a domain that does not look like malware infrastructure and moves on. It is the same reasoning behind [seven million expired domains bought for their reputation](/article/sable-squirrel-seven-million-expired-domains-reputation): the value is in not looking like anything.

## The mistake that makes it findable

Here is the useful part for anyone hunting.

RST Cloud's analysis notes that the hex build token rotates on every deployment — but the **api-key does not**. The operator carefully varies the thing that identifies a build, and reuses the thing that identifies the operator. One static string sits across the whole campaign, which turns "find every sample" into a single search.

The rest of the traffic pattern is similarly consistent:

- Standardised URI paths — **/curl/**, **/dynamic?txd=** and **/gate?buildtxd=**
- macOS user-agent strings and an api-key header
- Exfiltration by HTTP **PUT** with **upload_id**, **chunk_index** and **total_chunks** parameters

On the host, the staging is just as fixed: data is collected under **/tmp/sync*** directories, compressed into **/tmp/osalogging.zip**, split into chunks, uploaded, and the temporary files removed.

## What to do

- **Get to macOS 26.4 or later.** It directly targets the delivery method.
- **Tell people the actual rule: never paste a command into Terminal because a web page asked you to.** No legitimate site does this. This is one sentence and it stops the whole campaign.
- **Alert on Terminal spawning curl or a download, then executing what it fetched.** That sequence has almost no honest use on a developer laptop and it is the entire chain here.
- **Hunt for the static artefacts.** The **/tmp/osalogging.zip** filename and the **/tmp/sync*** staging directories are free detections, and so is a **PUT** carrying **chunk_index**.
- **Correlate AppleScript activity with Keychain access and archive creation**, which is Microsoft's own guidance and catches the collection step rather than the delivery.
- **Treat an infected Mac as a cloud incident.** If AWS credentials and kube configs were on it, rotating the laptop's password is not the remediation.

## What is not established

- **Who runs it.** Microsoft named no actor.
- **How many are affected.** No victim count was published.
- **Whether the domain list is complete.** It is what Microsoft could tie together, and the naming scheme is trivially extensible.
- **Whether the api-key stays static.** It has so far. Publishing that fact is usually how it stops being true.`,
  },
  {
    slug: "city-forum-salesforce-servicenow-guest-scraping-reco",
    title:
      "One machine in Germany has been quietly reading company support portals since March 2025",
    excerpt:
      "Reco has tracked a single IP walking Salesforce and ServiceNow customer portals across telecoms, banks, software vendors and government. No exploit was involved: the guest user on those public sites could already read more than the site needed to show. One target logged over 560,000 events from that one address.",
    categorySlug: "security",
    tags: [
      "salesforce",
      "servicenow",
      "saas",
      "data-scraping",
      "misconfiguration",
      "threat-intel",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1772910207026-c37ae90a9085${P}`,
    body: `Security firm **Reco** has published research on a campaign it calls **City Forum**, after a domain tied to the single IP address behind it — **158.220.87.79**, hosted on the German VPS provider **Contabo**.

Passive DNS puts that domain on that address since at least **March 2025**, with no migration since. Reco has not attributed the activity to a named group.

## What it is doing

Reading customer portals. Methodically, for over a year.

The targets span telecoms, banking and financial services, enterprise software vendors — including security and data-privacy companies — and public sector bodies. Reco has not named individual organisations. At one target, the platform logged more than **560,000** events from that single address.

## There is no exploit here

This is the part that makes it worth reading, and the part that makes it hard to fix.

Both **Salesforce** and **ServiceNow** let you publish a site that unauthenticated visitors can use — a support portal, a knowledge base, a case tracker. Both do it by giving anonymous visitors a **guest user** identity with a permission set. The attacker is not defeating that model. It is using it, exactly as configured, and reading everything the guest profile was granted.

Reco's own summary of the root cause is the sentence to keep: a guest identity granted more access than the site actually needed in order to serve the public.

## How the requests look

The tooling is a compiled **Go** program, identifiable because it never changed the default Go net/http user agent — an operator hygiene failure of the same kind as a static API key left across a whole malware campaign, and just as useful to a defender.

On Salesforce it worked through both the older **Aura** framework and the newer **Lightning Web Runtime** sites via the UI-API, and it walked API versions **v56.0 through v66.0** in sequence — trying each one in turn, because an object locked down in a recent version is sometimes still reachable through an older one. That is a deliberate technique, not scanning noise.

On ServiceNow it went at the Service Portal search endpoint, **POST /api/now/sp/search**, which is barely documented publicly. Somebody read the platform rather than a tutorial.

## Why a year passed

Because none of it is an attack, in the sense that anything would alert on.

Every request is a well-formed, authorised query from a visitor the site was built to serve. There is no failed login, no injection string, no malformed input. The only signals available are volume and shape — one address, over a long period, sequentially enumerating API versions — and those live in platform event logs that most organisations never look at, if they have them enabled at all.

The parallel is [the Entra directory records offered for sale last week](/article/thehatman-azure-entra-directory-36-million-records-claim), where the underlying complaint was also that ordinary authenticated users could enumerate far more of the directory than anyone intended. Same failure, different tenant setting.

## What to do

If you run a public Salesforce or ServiceNow site, these are concrete and doable this week.

- **Audit the guest user profile itself.** List every object and field it can read, then ask what the public page actually renders. Everything else is a finding.
- **Assume old API versions are in scope.** The v56-to-v66 walk exists because sharing rules are not always enforced identically across versions. Testing your protections on the current version only is testing the wrong thing.
- **Look at your platform event logs for one address doing a lot.** Salesforce Event Monitoring and ServiceNow's request logs both hold this. 560,000 events from a single IP is not subtle if anybody is looking.
- **Watch for default library user agents.** Go net/http, python-requests and curl have no business driving a customer portal at volume.
- **Rate-limit the search endpoints**, particularly ServiceNow's Service Portal search, which is designed to return matches across content.

## What is not established

- **Who is behind it.** Reco explicitly does not attribute.
- **Which organisations were scraped.** None have been named.
- **What was taken in total.** Reco reports the technique and the traffic, not an inventory.
- **Whether the data has been sold or used.** No listing has been tied to this campaign.
- **Whether it has stopped.** Reco reports the infrastructure as still active, with traffic climbing.`,
  },
  {
    slug: "mlflow-cve-2026-64849-ssrf-redirect-dns-rebinding",
    title:
      "MLflow validated the URL, then followed a redirect and looked it up again — scanning began within hours",
    excerpt:
      "CVE-2026-64849 is an unauthenticated SSRF in MLflow's webhook test endpoint, CVSS 9.3, fixed in 3.15.0. The check on the destination was real; it just was not pinned, so a redirect or a second DNS answer walked straight past it into cloud metadata. watchTowr saw exploitation attempts the same day the CVE was assigned.",
    categorySlug: "ai",
    tags: [
      "mlflow",
      "ssrf",
      "vulnerabilities",
      "cloud",
      "credentials",
      "ai-infrastructure",
      "patching",
    ],
    readingMinutes: 8,
    coverImageUrl: `https://images.unsplash.com/photo-1765894359240-49b82f93b91a${P}`,
    body: `**CVE-2026-64849** is an unauthenticated **server-side request forgery** flaw in **MLflow**, the open-source platform for tracking machine-learning experiments and registering models. It carries a **CVSS 9.3** and is fixed in **MLflow 3.15.0**.

**watchTowr** reported exploitation attempts against internet-facing instances within hours of the CVE being assigned on **17 August 2026**.

## The endpoint

A default MLflow Tracking Server exposes **POST /api/2.0/mlflow/webhooks/{id}/test** without authentication. It exists so you can check that a model-registry webhook is wired up correctly: MLflow calls the URL and hands you back the status and body it got.

That last part is what turns an SSRF into a full-read one. Many SSRFs are blind — you can make the server issue a request but cannot see the answer. This one returns the response.

## The bug is not a missing check

MLflow does validate the webhook URL. There is a function for it. The problem is what happens after.

Per the GitHub advisory, the validated address is never **pinned**. MLflow checks the destination, then makes the request following HTTP redirects, and re-resolves the hostname when it does. So a name that passed validation can answer differently a moment later — either because the first server replies with a redirect to somewhere internal, or because the DNS record itself now returns an internal address. That second variant is **DNS rebinding**, and it has been a known SSRF bypass for years.

This is a time-of-check-to-time-of-use bug wearing network clothing. The check was true when it ran. Nothing kept it true.

It also bypassed an earlier mitigation, which is the detail worth keeping: this is at least the second attempt at closing this hole in this component — the same shape as [N-able's incomplete patch](/article/n-able-n-central-incomplete-patch-cve-2026-18577) and [ShieldBreak going round Microsoft's Defender fix](/article/shieldbreak-cve-2026-69414-defender-patch-bypass-cfapi).

## What attackers are going for

Cloud metadata.

Every major cloud runs a metadata service on a fixed internal address that any process on the instance can query, and on many configurations it will hand out the instance's role credentials to anyone who asks. An unauthenticated full-read SSRF on a cloud-hosted box is a direct line to it, which is why watchTowr describes the observed activity as extraction of credentials and secrets rather than reconnaissance.

Note what that means for blast radius. The prize is not your experiment tracking data. It is whatever the instance's IAM role can do, which on an ML platform is frequently a large S3 bucket of training data and a model registry.

## Why MLflow specifically

Because of who installs it and how.

MLflow is developer infrastructure that data teams stand up themselves, often outside whatever process governs production services — no authentication in front of it, because it is "internal", on a cloud host, because that is where the GPUs are. The result is a class of software with the exposure profile of a production service and the operational care of a notebook. We made the same point about [Langflow's unauthenticated RCE](/article/langflow-rce-cve-2026-9198-ai-tooling-attack-surface) and [the Odysseus AI workspace at CVSS 9.9](/article/odysseus-ai-workspace-rce-cvss-9-9).

The **hours** between CVE assignment and mass scanning is the other half of it. There is no useful window in which to schedule a maintenance slot.

## What to do

- **Upgrade to 3.15.0 or later.** Nothing else fixes it.
- **Take MLflow off the public internet.** It ships with no authentication and was never designed to face the world.
- **Assume the instance role is compromised if you were exposed.** Rotate its credentials and read its CloudTrail or equivalent for the exposure window — do not wait for confirmation you were hit.
- **Require IMDSv2, or the equivalent hop-limited metadata policy on your cloud.** It does not fix the SSRF and it does defeat the most valuable thing to do with one.
- **Search access logs for requests to the webhook test path.** It is a specific URL with a legitimate but rare use, so hits are worth reading individually.

## What is not established

- **How many instances were compromised.** watchTowr reports honeypot telemetry and scanning, not a count of successful intrusions.
- **Who is scanning.** No actor has been named, and indiscriminate scanning after a CVE rarely maps to one.
- **What has been taken.** Credential theft is the observed objective; no victim has disclosed an outcome.`,
  },
  {
    slug: "gitlab-cve-2026-19478-graphql-directive-delete-public-projects",
    title:
      "An unauthenticated GraphQL directive could delete public projects — GitLab shipped the fix off-schedule",
    excerpt:
      "CVE-2026-19478 is a CVSS 9.4 in GitLab CE and EE: under certain conditions an unauthenticated user could modify or delete public projects and user data through a GraphQL directive. Patches landed on 17 August outside the normal release train. GitLab.com is already covered; self-hosted is not.",
    categorySlug: "security",
    tags: [
      "gitlab",
      "graphql",
      "vulnerabilities",
      "patching",
      "developer-tools",
      "self-hosted",
    ],
    readingMinutes: 7,
    coverImageUrl: `https://images.unsplash.com/photo-1779444480588-77001f36871b${P}`,
    body: `**CVE-2026-19478** is rated **CVSS 9.4** and affects both **GitLab Community Edition** and **Enterprise Edition**. GitLab's own description is that under certain conditions an unauthenticated user could remotely modify or delete public projects and user data through a GraphQL directive.

Patches shipped on **17 August 2026**, outside the normal release schedule. GitLab.com and GitLab Dedicated were already covered.

## Fixed in

| Affected | Upgrade to |
| --- | --- |
| 18.2 – 18.11.10 | **18.11.11** |
| 19.0 before 19.0.8 | **19.0.8** |
| 19.1 before 19.1.6 | **19.1.6** |
| 19.2 before 19.2.4 | **19.2.4** |

An unscheduled release at **CVSS 9.4** is GitLab telling you the severity in the only language that is hard to misread. The regular patch train exists precisely so this does not have to happen.

## Why deletion is a different problem

Most critical bugs are about someone reading what they should not, or running code they should not. This one is about destruction, and destruction has a property the others do not: **there is no window in which to detect it and prevent the harm**. By the time it is in your logs it has already happened.

For a self-hosted GitLab that means the recovery question is not "what did they see" but "do we have a restore". Repository history usually survives in developers' clones. Everything wrapped around it — issues, merge requests, review history, CI configuration, wiki, releases — lives only in the instance.

The second flaw patched alongside is **CVE-2026-19650**, **CVSS 7.1**: a cross-site request forgery weakness in GraphQL multiplex query handling that GitLab says could have allowed an unauthenticated user to execute mutations through **GET** requests, due to improper request validation. It needs user interaction, so it is the lesser of the two — but a state-changing mutation reachable by GET is exactly the thing a link in a chat message can trigger.

## GraphQL keeps producing these

Not because GraphQL is insecure, but because of where the authorisation lives.

A REST API tends to check permissions per endpoint, and an endpoint is a thing you can enumerate and test. A GraphQL API takes one arbitrary query describing what the caller wants, and the checks have to hold across every path through the schema — including directives, aliases, and multiplexed batches of queries in one request. Both flaws here are in that seam: one in directive handling, one in multiplex handling. Neither is in the resolvers people actually review.

## Nobody has exploited it yet

As of **18 August 2026** GitLab reported no known exploitation and no public exploit code.

That is not reassurance so much as a countdown. GitLab publishes technical detail roughly **90 days** after the patch, which puts disclosure around **mid-November 2026** — and in practice, a well-resourced attacker diffs the patch commits within days, not months. Self-hosted GitLab is also a high-value target by definition: it holds source, deploy keys and CI credentials, which is why [the CI secrets problem](/article/claude-code-gemini-cli-ci-secrets-novee-black-hat) and [the Mozilla signing key left in a private repo](/article/mozilla-linux-signing-key-revoked-private-repo) both started somewhere like it.

## What to do

- **Patch now if you self-host.** GitLab.com and Dedicated are done; nothing else is.
- **Check whether your instance is reachable without authentication.** The precondition involves public projects and unauthenticated access, so an instance that is not exposed is in a very different position from one that is.
- **Verify your backups actually restore.** Not that they exist — that a restore has been performed. A destructive bug is the case where an untested backup is discovered to be no backup.
- **Review who can make projects public.** Public visibility on a self-hosted instance is often a default nobody revisited.
- **Do not wait for the disclosure date.** The 90-day clock protects unpatched users from a published write-up. It does not protect them from anyone reading the diff.

## What is not established

- **The exact conditions required.** GitLab says "under certain conditions" and has not elaborated, which is deliberate while instances are unpatched.
- **Whether it has been exploited.** None reported at the time of writing, which is a statement about what is known, not about what happened.
- **How many self-hosted instances are exposed.** No count has been published.`,
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
