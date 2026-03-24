import HomepageVisualizer from "@/components/homepage-visualizer";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <section>
        <HomepageVisualizer />
      </section>

      <section className="relative py-16 md:py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(240,248,255,0.08),_transparent_60%)]" />
        <div className="container grid gap-10 md:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full border border-border/60 bg-card/50 px-4 py-2 text-sm uppercase tracking-[0.3em] text-muted-foreground">
              <Image
                src="/images/brand/jr8ch-logo.png"
                alt="JR8CH logo"
                width={72}
                height={28}
                className="h-5 w-auto"
              />
              Artist profile
            </div>
            <h2 className="font-headline text-3xl md:text-5xl font-bold tracking-wide">
              Meet JR8CH
            </h2>
            <p className="text-lg text-muted-foreground">
              JR8CH crafts kinetic drum and bass built for late-night systems
              - tight drums, engineered low-end, and cinematic textures. Follow
              the project for new releases, tour dates, and behind-the-scenes
              studio notes.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/music">Listen now</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/events">Tour dates</Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-border/60 shadow-lg">
              <Image
                src="/images/artist/jr8ch-profile.png"
                alt="JR8CH portrait"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
                priority
              />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-border/60 shadow-lg">
              <Image
                src="/images/artist/jr8ch-profile-2.png"
                alt="JR8CH studio portrait"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container grid gap-10 md:grid-cols-[1.2fr_0.8fr] items-center">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border/60 shadow-2xl">
            <Image
              src="/images/artist/jr8ch-studio.png"
              alt="JR8CH in the studio"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          </div>
          <div className="space-y-5">
            <h3 className="font-headline text-2xl md:text-4xl font-bold tracking-wide">
              Inside the studio
            </h3>
            <p className="text-base md:text-lg text-muted-foreground">
              From sketch to master, every track is tuned for clarity and
              impact. Expect breakdowns of sound design, plug-in chains, and
              mix decisions as the catalogue grows.
            </p>
            <Button asChild variant="secondary">
              <Link href="/campaigns">Project updates</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
