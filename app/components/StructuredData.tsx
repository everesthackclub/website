import { SOCIALS, CONTACT_EMAIL, FOUNDERS } from "../lib/site";

export default function StructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Everest Hack Club',
    alternateName: 'Everest Hack Club Biratnagar',
    description: 'Student-led coding and technology community in Biratnagar, Nepal',
    url: 'https://everesthackclub.com',
    logo: 'https://everesthackclub.com/Image/logo2.svg',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Biratnagar',
      addressCountry: 'NP',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 26.4525,
      longitude: 87.2718,
    },
    email: CONTACT_EMAIL,
    sameAs: SOCIALS.map((social) => social.href),
    founder: FOUNDERS.map((member) => ({
      '@type': 'Person',
      name: member.name,
    })),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'General Inquiries',
      email: CONTACT_EMAIL,
      availableLanguage: ['en', 'ne'],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
