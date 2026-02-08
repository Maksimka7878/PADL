import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://padel.moscow";
const SITE_NAME = "Padel Moscow";
const DEFAULT_DESCRIPTION = "Крупнейшее сообщество падел-тенниса в Москве. Находите партнёров, бронируйте корты, участвуйте в турнирах и улучшайте свои навыки.";

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  pathname?: string;
}

export function generateMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  image = "/og-image.png",
  noIndex = false,
  pathname = "",
}: SEOProps = {}): Metadata {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const url = `${SITE_URL}${pathname}`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
      languages: {
        "ru-RU": url,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: "ru_RU",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
      creator: "@padelmoscow",
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    verification: {
      google: "google-verification-code",
      yandex: "yandex-verification-code",
    },
    category: "sports",
    keywords: [
      "падел",
      "padel",
      "падел Москва",
      "падел теннис",
      "корты для падела",
      "найти партнёра для падела",
      "турниры по паделу",
      "обучение паделу",
      "padel Moscow",
      "padel tennis",
    ],
  };
}

// JSON-LD structured data generators
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [
      "https://t.me/padelmoscow",
      "https://vk.com/padelmoscow",
      "https://instagram.com/padelmoscow",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Москва",
      addressCountry: "RU",
    },
    sport: "Padel Tennis",
  };
}

export function generateSportsEventSchema(event: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate || event.startDate,
    location: {
      "@type": "Place",
      name: event.location,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Москва",
        addressCountry: "RU",
      },
    },
    image: event.image || `${SITE_URL}/og-image.png`,
    organizer: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    sport: "Padel Tennis",
  };
}

export function generateLocalBusinessSchema(court: {
  name: string;
  address: string;
  rating?: number;
  reviewCount?: number;
  priceRange?: string;
  openingHours?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: court.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: court.address,
      addressLocality: "Москва",
      addressCountry: "RU",
    },
    aggregateRating: court.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: court.rating,
          reviewCount: court.reviewCount || 0,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
    priceRange: court.priceRange || "₽₽₽",
    openingHours: court.openingHours,
    sport: "Padel Tennis",
  };
}

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
