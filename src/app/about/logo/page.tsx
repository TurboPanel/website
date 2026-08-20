import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { MarketingPageShell } from "@/components/marketing/MarketingPageShell";
import {
  MarketingSection,
  MarketingSectionHeader,
} from "@/components/marketing/marketing-primitives";
import { BRAND_COLORS, BRAND_LOGO_VARIANTS } from "@/lib/brand-assets";
import { TURBOPANEL_WORDMARK_STYLE } from "@/lib/wordmark-lockup";
import { wordmarkFont } from "@/lib/wordmark-font";

export const metadata: Metadata = {
  title: "TurboPanel logo",
  description:
    "Official TurboPanel logo downloads and usage guidelines for websites, publications, and product UI.",
};

const DO_NOT = [
  "Do not stretch, skew, or rotate the mark.",
  "Do not recolor the dual-brand mark except by using the provided white or mono variants.",
  "Do not add outlines, drop shadows, gradients, or glow effects to the mark.",
  "Do not place the color mark on busy photography without a clear solid or soft backing.",
  "Do not lock up the mark with other logos closer than the clear-space rule below.",
  "Do not set the full word “TurboPanel” next to the T mark — the mark is the T; visible wordmark letters are “urboPanel”.",
  "Do not use outdated “TP” letter tiles as the product logo.",
] as const;

function DownloadLink({
  href,
  children,
}: Readonly<{ href: string; children: ReactNode }>) {
  return (
    <Link
      href={href}
      download
      className="inline-flex items-center rounded-md border border-[var(--tp-border)] bg-[var(--tp-surface)] px-2.5 py-1.5 text-sm text-[var(--tp-text)] transition-colors hover:border-[var(--tp-accent)] hover:text-[var(--tp-text)]"
    >
      {children}
    </Link>
  );
}

function LogoVariantBlock({
  variant,
}: Readonly<{ variant: (typeof BRAND_LOGO_VARIANTS)[number] }>) {
  const previewBox =
    variant.previewAspect === "square"
      ? "aspect-square max-w-[200px]"
      : "aspect-[628/370] max-w-[280px]";

  return (
    <article
      id={variant.id}
      className="border-t border-[var(--tp-border)] pt-10 first:border-t-0 first:pt-0"
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-[var(--tp-text)]">
            {variant.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--tp-text-muted)] sm:text-base">
            {variant.description}
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {variant.assets.map((asset) => (
              <li key={asset.href}>
                <DownloadLink href={asset.href}>{asset.label}</DownloadLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-wrap gap-4">
          <div
            className={`flex w-full items-center justify-center rounded-xl border border-[var(--tp-border)] bg-[var(--tp-surface)] p-8 ${previewBox}`}
          >
            <img
              src={variant.previewSrc}
              alt=""
              className="h-full w-full object-contain"
            />
          </div>
          <div
            className={`flex w-full items-center justify-center rounded-xl border border-[var(--tp-border)] bg-[#0b1220] p-8 ${previewBox}`}
          >
            <img
              src={
                variant.id === "square"
                  ? "/brand/turbopanel-logo-square-white.svg"
                  : "/brand/turbopanel-logo-white.svg"
              }
              alt=""
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      </div>
    </article>
  );
}

export default function AboutLogoPage() {
  return (
    <MarketingPageShell active="overview">
      <MarketingHero
        eyebrow="Brand"
        title="Graphics & logos"
        description="When you need the official TurboPanel logo for a website or publication, use one of the downloads below. Please use logos in accordance with these guidelines."
      />

      <MarketingSection id="downloads">
        <MarketingSectionHeader
          eyebrow="Downloads"
          title="TurboPanel logos"
          description="Vector SVG is preferred. PNG sizes are provided for places that need a raster file. White and mono SVGs are for dark and single-color contexts."
        />
        <div className="space-y-10">
          {BRAND_LOGO_VARIANTS.map((variant) => (
            <LogoVariantBlock key={variant.id} variant={variant} />
          ))}
        </div>
      </MarketingSection>

      <MarketingSection id="colors" variant="band">
        <MarketingSectionHeader
          eyebrow="Color"
          title="Brand colors"
          description="The mark pairs TurboPanel green (acceleration) with blue (the T). Keep both when using the color logo."
        />
        <ul className="grid gap-4 sm:grid-cols-2">
          {BRAND_COLORS.map((color) => (
            <li
              key={color.hex}
              className="flex gap-4 rounded-xl border border-[var(--tp-border)] bg-[var(--tp-surface)] p-4"
            >
              <span
                className="h-14 w-14 shrink-0 rounded-lg border border-[var(--tp-border)]"
                style={{ backgroundColor: color.hex }}
                aria-hidden
              />
              <div>
                <p className="font-semibold text-[var(--tp-text)]">
                  {color.name}
                </p>
                <p className="mt-0.5 font-mono text-sm text-[var(--tp-text-muted)]">
                  {color.hex}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--tp-text-muted)]">
                  {color.role}
                </p>
                <p className="mt-1 font-mono text-xs text-[var(--tp-text-muted)]">
                  {color.token}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </MarketingSection>

      <MarketingSection id="usage">
        <MarketingSectionHeader
          eyebrow="Usage"
          title="Clear space & sizing"
          description="Give the mark room to breathe and keep it legible at small sizes."
        />
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="text-base font-semibold text-[var(--tp-text)]">
              Clear space
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--tp-text-muted)] sm:text-base">
              Downloadable SVGs are ink-tight (no embedded pad). Keep empty space
              around the mark at least as tall as the green acceleration bars —
              apply that margin in layout, not by editing the file. Do not let
              other logos, type, or UI chrome collide with that margin.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-[var(--tp-text)]">
              Minimum size
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--tp-text-muted)] sm:text-base">
              Standard mark: at least <span className="font-mono">24px</span>{" "}
              tall on screen, <span className="font-mono">0.5&quot;</span> in
              print. Square mark: at least{" "}
              <span className="font-mono">24×24px</span> on screen. Prefer SVG
              whenever possible.
            </p>
          </div>
        </div>
        <div className="mt-10">
          <h3 className="text-base font-semibold text-[var(--tp-text)]">
            Wordmark
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--tp-text-muted)] sm:text-base">
            In prose the product name is one word with a capital T and P:{" "}
            <strong className="font-semibold text-[var(--tp-text)]">
              TurboPanel
            </strong>
            — never “Turbo Panel”, “turboPanel”, or “TP Panel”. In site chrome,
            the T mark supplies the leading T and the{" "}
            <span
              className={`${wordmarkFont.className} tracking-tight text-[var(--tp-text)]`}
              style={{
                display: "inline-block",
                transform: `skewX(${TURBOPANEL_WORDMARK_STYLE.skew})`,
                transformOrigin: "left bottom",
              }}
            >
              urboPanel
            </span>{" "}
            wordmark tucks under the blue crossbar in{" "}
            <strong className="font-semibold text-[var(--tp-text)]">
              Plus Jakarta Sans ExtraBold Italic
            </strong>
            {" "}
            (weight 800, native italic plus light CSS skew to the T’s ~22° lean;
            baseline aligned to the T stem tip). Never render “TurboPanel” beside
            the mark. The mark may appear alone when space is tight.
          </p>
        </div>
      </MarketingSection>

      <MarketingSection id="do-not" variant="muted">
        <MarketingSectionHeader
          eyebrow="Don't"
          title="Incorrect use"
          description="These patterns weaken recognition and break the dual-brand system."
        />
        <ul className="space-y-3">
          {DO_NOT.map((rule) => (
            <li
              key={rule}
              className="flex gap-3 text-sm leading-relaxed text-[var(--tp-text-muted)] sm:text-base"
            >
              <span
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--tp-text-muted)]"
                aria-hidden
              />
              {rule}
            </li>
          ))}
        </ul>
      </MarketingSection>

      <MarketingSection>
        <p className="max-w-2xl text-sm leading-relaxed text-[var(--tp-text-muted)]">
          Open-source licenses do not grant trademark rights. Questions about
          trademark use or partnership lockups can go through the usual TurboPanel
          contact channels. Policy:{' '}
          <Link href="/open-source" className="text-[var(--tp-accent)] hover:underline">
            Open source
          </Link>
          . Product UI tokens stay in{' '}
          <span className="font-mono">ui/src/lib/theme.ts</span>; marketing
          tokens in{' '}
          <span className="font-mono">website/src/app/globals.css</span>.
        </p>
      </MarketingSection>
    </MarketingPageShell>
  );
}
