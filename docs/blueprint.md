# **App Name**: JR8CH Hub

## Core Features:

- Homepage Visualizer: WebGL visualizer synced to the latest single's BPM for a dynamic hero section using Three.js and React Three Fiber, pulling BPM and key data from Firestore. Consider using Tone.js or AudioContext for real-time reactive effects. Keep CPU budget low by limiting particle count (~4-6k).
- Music Archive: Display of all music releases, filterable and searchable, pulling metadata from Firestore via Next.js Route Handlers (app/api/*) to ensure clean API separation. Smart links to streaming and purchase options. Implement ISR (Incremental Static Regeneration) for /music to keep Firestore reads minimal and performance high.
- Visuals Gallery: Display of YouTube videos in a grid layout, automatically fetched via the YouTube API. Optional live visual overlay.
- Campaign Timeline: Displays active campaigns as timeline cards, pulling data from Firestore via Next.js Route Handlers to show release phases and content tasks. Implement ISR for /campaigns.
- AI Sound Explainer: Embedded chat assistant using an AI tool (Gemini/Genkit) that explains JR8CH's sound and releases to visitors. Inject release context (release_id, genre, LUFS, BPM, key) into prompt metadata. Add a minimal usage cap / timeout to prevent unnecessary Firebase billing from AI calls. Keep this as a sidebar or modal chat.
- Event Integration: Integrates with Songkick/Bandsintown to display upcoming tour dates and allow users to RSVP or purchase tickets.
- Email Capture: Allows users to sign up for email updates, integrating with Mailchimp or ConvertKit to manage subscriptions.
- Analytics Wrapper: Set up Meta Pixel, GA4, and CAPI inside a reusable <AnalyticsProvider> component.

## Style Guidelines:

- Primary color: Electric violet (#8A2BE2) for futuristic aggression and unique visual identity. Use functional tokens in tailwind.config.js: colors: { base: '#0A0A0A', accent: '#B355FF', light: '#E8E8E8', sub: '#505050' }.
- Background color: Matte black (#121212) to provide a deep contrast base. Use functional tokens in tailwind.config.js: colors: { base: '#0A0A0A', accent: '#B355FF', light: '#E8E8E8', sub: '#505050' }.
- Accent color: Cold white (#F0F8FF) for highlights and key interactive elements, providing surgical clarity. Use functional tokens in tailwind.config.js: colors: { base: '#0A0A0A', accent: '#B355FF', light: '#E8E8E8', sub: '#505050' }.
- Headline font: 'Eurostile Extended' sans-serif, for a techy, futuristic look. Use functional tokens in tailwind.config.js: fontFamily: { display: ['"Eurostile Extended"', 'sans-serif'], body: ['Inter', 'sans-serif'] }.
- Body font: 'Inter' sans-serif, providing modern clarity. Use functional tokens in tailwind.config.js: fontFamily: { display: ['"Eurostile Extended"', 'sans-serif'], body: ['Inter', 'sans-serif'] }.
- Lucide or custom SVG icon set, simple line art, for social media links. Implement Lucide icons for social buttons, with accessible labels.
- Subtle parallax and stutter transitions for a kinetic effect mirroring DnB energy. Use Framer Motion for stutter / parallax transitions. Tailwind config: enable motion-safe utilities for performance-friendly animations.
- Maintain WCAG 2.1 AA contrast (especially violet accents on dark background).