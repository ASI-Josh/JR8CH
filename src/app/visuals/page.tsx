import { youtubeVisuals } from '@/lib/data';

function VideoCard({ title, videoId }: { title: string, videoId: string }) {
  return (
    <div className="group">
      <div className="aspect-video overflow-hidden rounded-lg border border-border/60 group-hover:border-primary/80 transition-all duration-300">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="transition-transform duration-500 group-hover:scale-105"
        ></iframe>
      </div>
      <h3 className="mt-4 font-headline text-lg tracking-wide">{title}</h3>
    </div>
  );
}

export default function VisualsPage() {
  const visuals = youtubeVisuals;

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-wider">Visuals Gallery</h1>
        <p className="mt-2 text-lg text-muted-foreground">Music videos and live performance visuals.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {visuals.map(video => (
          <VideoCard key={video.id} title={video.title} videoId={video.videoId} />
        ))}
      </div>
    </div>
  );
}
