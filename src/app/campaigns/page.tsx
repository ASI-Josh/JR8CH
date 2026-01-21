import { campaignTimeline } from '@/lib/data';
import { CalendarCheck } from 'lucide-react';

export default function CampaignsPage() {
  const timeline = campaignTimeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-wider">Campaign Timeline</h1>
        <p className="mt-2 text-lg text-muted-foreground">Active and upcoming release campaigns.</p>
      </div>

      <div className="relative max-w-2xl mx-auto">
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-border"></div>
        {timeline.map((item, index) => (
          <div key={item.id} className={`mb-8 flex justify-between items-center w-full ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
            <div className="order-1 w-5/12"></div>
            <div className="z-10 flex items-center order-1 bg-primary shadow-xl w-10 h-10 rounded-full">
              <CalendarCheck className="h-5 w-5 text-primary-foreground mx-auto" />
            </div>
            <div className={`order-1 rounded-lg border border-border/60 bg-card shadow-md w-5/12 px-6 py-4 transition-all hover:border-primary/60 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
              <p className="mb-2 text-sm font-medium text-primary">{new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <h3 className="mb-2 font-bold font-headline text-lg">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
