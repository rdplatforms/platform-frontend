import type { Card } from '@rdplatforms/types';

/**
 * Generic placeholder content for the template showcase page — not a
 * real card, just enough data (one of everything: catalog, testimonial,
 * hours, badges, skills, a UPI id, a map) so every template's optional
 * sections actually have something to render in the preview, regardless
 * of which fields that particular template uses.
 */
export const SAMPLE_CARD: Card = {
  id: 'sample',
  phone: '+910000000000',
  whatsapp: '+910000000000',
  name: 'Your Name Here',
  title: 'Your Title or Business',
  category: 'Your Category',
  email: 'you@example.com',
  location: 'Your City',
  bio: 'A short line about you or your business goes here — a couple of sentences is plenty.',
  skills: ['Skill One', 'Skill Two', 'Skill Three'],
  badges: [
    { label: 'Verified', tone: 'verified' },
    { label: 'Available Now', tone: 'available' },
  ],
  hours: [{ label: 'Mon - Sat', value: '10:00 AM - 8:00 PM' }],
  upiId: 'yourname@upi',
  catalog: [
    {
      id: 'sample-1',
      name: 'Featured Item',
      price: '₹999',
      description: 'A short description of this product or service.',
    },
    {
      id: 'sample-2',
      name: 'Another Item',
      price: '₹1,499',
      description: 'Another short description.',
    },
  ],
  testimonials: [
    {
      id: 'sample-testimonial',
      authorName: 'A Happy Customer',
      authorRole: 'Client',
      quote: 'This is a placeholder testimonial to show how reviews look on your card.',
      rating: 5,
    },
  ],
  links: [
    { type: 'whatsapp', value: '+910000000000' },
    { type: 'instagram', value: 'yourhandle' },
    { type: 'website', value: 'https://example.com' },
  ],
};
