import { tourDates } from '@/lib/data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

export default function EventsPage() {
  const upcomingEvents = tourDates.filter(event => new Date(event.date) >= new Date())
    .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-wider">Tour Dates</h1>
        <p className="mt-2 text-lg text-muted-foreground">Catch JR8CH live.</p>
      </div>
      
      <div className="max-w-3xl mx-auto space-y-4">
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map(event => (
            <Card key={event.id} className="flex flex-col sm:flex-row items-center justify-between p-4 transition-all hover:shadow-primary/20 hover:shadow-lg hover:border-primary/60">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="text-center w-20 flex-shrink-0">
                  <p className="font-bold text-lg text-primary">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</p>
                  <p className="font-headline text-3xl font-bold">{new Date(event.date).toLocaleDateString('en-US', { day: '2-digit' })}</p>
                </div>
                <div className="border-l pl-4 flex-grow">
                  <h3 className="font-headline text-xl font-bold">{event.venue}</h3>
                  <p className="text-muted-foreground flex items-center gap-1"><MapPin size={14} />{event.city}</p>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
                {event.status === 'Sold Out' ? (
                  <Button variant="destructive" disabled>Sold Out</Button>
                ) : (
                  <Button asChild>
                    <Link href={event.ticketUrl}>Tickets</Link>
                  </Button>
                )}
              </div>
            </Card>
          ))
        ) : (
          <Card className="text-center p-8">
            <p className="text-muted-foreground">No upcoming tour dates. Check back soon!</p>
          </Card>
        )}
      </div>
    </div>
  );
}
