/** Hub + site monetization blocks — optimized for first sales. */
import { escapeAttr } from "./seo.mjs";

const GITHUB_NEW_ISSUE =
  "https://github.com/rajeevsewbalak31-sketch/Vibe-Code-1000-websites/issues/new";

const DEFAULT = {
  paypal: "https://paypal.me/RajeevSewbalak",
  starterPrice: 49,
  micrositeInquiry: `${GITHUB_NEW_ISSUE}?labels=enhancement`,
  sponsorInquiry: `${GITHUB_NEW_ISSUE}?labels=sponsor`,
  sponsors: [
    {
      name: "Your brand here",
      tagline: "Put your product in front of 100+ tool users",
      href: `${GITHUB_NEW_ISSUE}?labels=sponsor&title=Sponsor%20inquiry`,
      cta: "Claim slot — from €25/wk",
      placeholder: true,
    },
    {
      name: "Sponsor slot #2",
      tagline: "Logo + link above the gallery",
      href: `${GITHUB_NEW_ISSUE}?labels=sponsor&title=Sponsor%20slot%202`,
      cta: "Reserve now",
      placeholder: true,
    },
    {
      name: "Sponsor slot #3",
      tagline: "Featured tool of the week",
      href: `${GITHUB_NEW_ISSUE}?labels=sponsor&title=Sponsor%20slot%203`,
      cta: "Reserve now",
      placeholder: true,
    },
  ],
  microsites: [
    {
      id: "starter",
      name: "Starter",
      price: "€49",
      period: "one-time",
      badge: "Most chosen",
      features: [
        "Live on Vercel in 24 hours",
        "Your name, colors & copy",
        "Listed in the public gallery",
        "PayPal tips built in",
      ],
      ctaPay: "Pay €49 — start now",
      ctaAsk: "Ask a question first",
      highlight: true,
    },
    {
      id: "pro",
      name: "Pro",
      price: "€149",
      period: "one-time",
      badge: null,
      features: [
        "Custom tool logic or layout",
        "SEO + conversion-focused copy",
        "1 revision included",
      ],
      ctaPay: "Pay €149 deposit",
      ctaAsk: "Request Pro",
      highlight: false,
    },
    {
      id: "flagship",
      name: "Flagship",
      price: "€499+",
      period: "project",
      badge: null,
      features: [
        "Next.js app (payments, grids)",
        "Like Buy a Square",
        "Priority delivery",
      ],
      ctaPay: "Book flagship",
      ctaAsk: "Discuss scope",
      highlight: false,
    },
  ],
};

export function getMonetizationConfig(manifest) {
  return {
    ...DEFAULT,
    ...manifest.monetization,
    paypal: manifest.paypal || DEFAULT.paypal,
    starterPrice: manifest.monetization?.starterPrice ?? DEFAULT.starterPrice,
  };
}

function paypalAmountUrl(base, amount) {
  return `${base.replace(/\/$/, "")}/${amount}`;
}

export function tipTierHtml(paypal, amounts) {
  return amounts
    .map(
      (n) =>
        `        <a class="tip-tier" href="${escapeAttr(paypalAmountUrl(paypal, n))}" target="_blank" rel="noopener noreferrer">Tip €${n}</a>`
    )
    .join("\n");
}

export function sponsorsHtml(sponsors) {
  return sponsors
    .map((s) => {
      const cls = s.placeholder ? "sponsor-card sponsor-card--open" : "sponsor-card";
      return `      <a class="${cls}" href="${escapeAttr(s.href)}" target="_blank" rel="noopener noreferrer sponsored">
        <span class="sponsor-label">${s.placeholder ? "Open slot" : "Sponsor"}</span>
        <h3>${escapeAttr(s.name)}</h3>
        <p>${escapeAttr(s.tagline)}</p>
        <span class="sponsor-cta">${escapeAttr(s.cta)} →</span>
      </a>`;
    })
    .join("\n\n");
}

function priceCardHtml(tier, paypal, microInquiry) {
  const cls = tier.highlight ? "price-card price-card--highlight" : "price-card";
  const badge = tier.badge
    ? `<span class="price-badge">${escapeAttr(tier.badge)}</span>`
    : "";
  const feats = tier.features.map((f) => `          <li>${escapeAttr(f)}</li>`).join("\n");
  const payAmount =
    tier.id === "starter" ? 49 : tier.id === "pro" ? 149 : null;
  const payHref = payAmount
    ? paypalAmountUrl(paypal, payAmount)
    : `${microInquiry}&title=${encodeURIComponent(`Micro-site: ${tier.name}`)}`;
  const askHref = `${microInquiry}&title=${encodeURIComponent(`Question: ${tier.name} package`)}&body=${encodeURIComponent("Name:\nEmail:\nWhat I need:\n")}`;
  const payClass = payAmount ? "btn btn--buy price-cta" : "btn btn--paypal price-cta";
  const ctaPay = tier.ctaPay || tier.cta || "Order now";
  const ctaAsk = tier.ctaAsk || "Ask a question";
  return `      <article class="${cls}">
        ${badge}
        <h3>${escapeAttr(tier.name)}</h3>
        <p class="price"><span class="price-amount">${escapeAttr(tier.price)}</span> <span class="price-period">${escapeAttr(tier.period)}</span></p>
        <ul class="price-features">
${feats}
        </ul>
        <div class="price-actions">
          <a class="${payClass}" href="${escapeAttr(payHref)}" target="_blank" rel="noopener noreferrer">${escapeAttr(ctaPay)}</a>
          <a class="btn btn--ghost price-cta-secondary" href="${escapeAttr(askHref)}" target="_blank" rel="noopener noreferrer">${escapeAttr(ctaAsk)}</a>
        </div>
      </article>`;
}

export function pricingHtml(microsites, paypal, microInquiry) {
  return microsites.map((t) => priceCardHtml(t, paypal, microInquiry)).join("\n\n");
}

export function hubMonetizationHtml(manifest) {
  const m = getMonetizationConfig(manifest);
  const microInquiry = m.micrositeInquiry || DEFAULT.micrositeInquiry;
  const starterPay = paypalAmountUrl(m.paypal, m.starterPrice);

  return `    <section class="pricing pricing--primary" id="get-a-site" aria-labelledby="pricing-heading">
      <div class="pricing-hero">
        <p class="pricing-eyebrow">Done-for-you · Live in 24 hours</p>
        <h2 id="pricing-heading" class="section-title">Get your own website</h2>
        <p class="section-lead pricing-lead">I build and deploy a branded mini-site for you — same system behind 100 live tools. <strong>Starting at €49.</strong> No code required on your side.</p>
        <ul class="trust-bar" aria-label="Why order">
          <li><span class="trust-num">100</span> websites built</li>
          <li><span class="trust-num">24h</span> turnaround</li>
          <li><span class="trust-num">€49</span> to start</li>
        </ul>
        <a class="btn btn--buy btn--lg pricing-jump-cta" href="${escapeAttr(starterPay)}" target="_blank" rel="noopener noreferrer">Pay €49 on PayPal — fastest start</a>
      </div>
      <div class="pricing-grid">
${pricingHtml(m.microsites, m.paypal, microInquiry)}
      </div>
      <div class="lead-capture" id="contact">
        <h3 class="lead-title">Not ready to pay yet? Tell me what you need.</h3>
        <p class="lead-sub">I reply within 24 hours. Or pay €49 above to skip the queue.</p>
        <form class="lead-form" id="lead-form" action="#" method="get">
          <div class="lead-row">
            <label class="lead-label">Name <input class="lead-input" name="name" type="text" required autocomplete="name" placeholder="Your name" /></label>
            <label class="lead-label">Email <input class="lead-input" name="email" type="email" required autocomplete="email" placeholder="you@email.com" /></label>
          </div>
          <label class="lead-label">Package
            <select class="lead-input" name="package" required>
              <option value="Starter (€49)">Starter — €49 (24h delivery)</option>
              <option value="Pro (€149)">Pro — €149</option>
              <option value="Flagship (€499+)">Flagship — €499+</option>
              <option value="Sponsor">Sponsor slot</option>
            </select>
          </label>
          <label class="lead-label">What should the site do?
            <textarea class="lead-input lead-textarea" name="message" required rows="3" placeholder="e.g. booking tool for my barbershop, brand colors #112233…"></textarea>
          </label>
          <div class="lead-actions">
            <button type="submit" class="btn btn--buy">Send my request</button>
            <a class="btn btn--paypal" href="${escapeAttr(starterPay)}" target="_blank" rel="noopener noreferrer">Pay €49 now instead</a>
          </div>
        </form>
        <p class="lead-fine">PayPal: <a href="${escapeAttr(m.paypal)}" target="_blank" rel="noopener noreferrer">paypal.me/RajeevSewbalak</a> · Tips welcome on free tools</p>
      </div>
      <p class="pricing-proof">Proof it works: <a href="https://001-buy-a-square.vercel.app" target="_blank" rel="noopener">Buy a Square</a> earns per click — your site can too.</p>
    </section>

    <section class="sponsors" id="sponsors" aria-labelledby="sponsors-heading">
      <div class="section-head">
        <h2 id="sponsors-heading" class="section-title">Sponsor the gallery</h2>
        <p class="section-lead">Put your brand in front of everyone browsing 100 tools.</p>
      </div>
      <div class="sponsor-grid">
${sponsorsHtml(m.sponsors)}
      </div>
    </section>

    <section class="support support--compact" id="support" aria-labelledby="support-heading">
      <h2 id="support-heading" class="section-title">Support free tools</h2>
      <p class="section-lead">Tips keep the gallery free. Want your own site? <a href="#get-a-site">Order from €49 ↑</a></p>
      <div class="tip-tiers" role="group" aria-label="PayPal tip amounts">
${tipTierHtml(m.paypal, m.tipPresets || [5, 10, 25])}
        <a class="tip-tier tip-tier--custom" href="${escapeAttr(m.paypal)}" target="_blank" rel="noopener noreferrer">Custom tip</a>
      </div>
    </section>`;
}

/** Site footer — lead with micro-site sale, then tips. */
export function siteMonetizationFooter(paypal, hubUrl) {
  const starterPay = paypalAmountUrl(paypal, 49);
  const contact = `${hubUrl}#contact`;
  return `    <footer class="tip-jar">
      <p class="tip-upsell"><a class="tip-upsell-link" href="${escapeAttr(hubUrl)}#get-a-site"><strong>Get your own website — from €49</strong></a> · 24h delivery</p>
      <div class="tip-chips">
        <a class="tip-chip tip-chip--buy" href="${escapeAttr(starterPay)}" target="_blank" rel="noopener noreferrer">Order €49</a>
        <a class="tip-chip" href="${escapeAttr(paypalAmountUrl(paypal, 5))}" target="_blank" rel="noopener noreferrer">Tip €5</a>
        <a class="tip-chip tip-chip--main" href="${escapeAttr(paypal)}" target="_blank" rel="noopener noreferrer">PayPal</a>
      </div>
      <p class="hub-wrap"><a class="hub-link" href="${escapeAttr(contact)}">Free quote</a> · <a class="hub-link" href="${escapeAttr(hubUrl)}">All tools</a></p>
    </footer>`;
}
