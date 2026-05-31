import type { Metadata } from "next"
import { AboutHero } from "@/components/about/about-hero"
import { Values } from "@/components/about/values"
import { Craft } from "@/components/about/craft"
import { CtaBand } from "@/components/home/cta-band"

export const metadata: Metadata = {
  title: "About · Precise Fumes",
  description:
    "The philosophy behind Precise Fumes — restraint, measure, patience, and permanence in every composition.",
}

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <Values />
      <Craft />
      <CtaBand />
    </main>
  )
}
