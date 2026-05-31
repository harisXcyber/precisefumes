import { Hero } from '@/components/home/hero'
import { LogoScroll } from '@/components/home/logo-scroll'
import { Storytelling } from '@/components/home/storytelling'
import { Notes } from '@/components/home/notes'
import { Featured } from '@/components/home/featured'
import { CtaBand } from '@/components/home/cta-band'

export default function HomePage() {
  return (
    <>
      <Hero />
      <LogoScroll />
      <Storytelling />
      <Notes />
      <Featured />
      <CtaBand />
    </>
  )
}
