import type { InstagramPost } from "@/lib/types";

/**
 * Local fallback feed. In production this is replaced by the Instagram Basic
 * Display API behind /api/instagram/feed (revalidated hourly).
 */
export const FALLBACK_FEED: InstagramPost[] = [
  {
    id: "1",
    media_url: "/assets/calliper/envelope-wax-seal.jpg",
    permalink: "https://instagram.com/calliper_creations",
    caption: "Vintage letters, sealed the old way.",
    media_type: "image",
  },
  {
    id: "2",
    media_url: "/assets/calliper/studio-1.mp4",
    permalink: "https://instagram.com/calliper_creations",
    caption: "A closer look at the details.",
    media_type: "video",
    poster: "/assets/calliper/letter-new-parents.jpg",
  },
  {
    id: "3",
    media_url: "/assets/calliper/frame-baby-name.webp",
    permalink: "https://instagram.com/calliper_creations",
    caption: "Personalised journaling frames.",
    media_type: "image",
  },
  {
    id: "4",
    media_url: "/assets/calliper/studio-2.mp4",
    permalink: "https://instagram.com/calliper_creations",
    caption: "Ordering made-to-order keepsakes.",
    media_type: "video",
    poster: "/assets/calliper/frame-baby-name.webp",
  },
  {
    id: "5",
    media_url: "/assets/calliper/phone-case-fortuner-2.jpg",
    permalink: "https://instagram.com/calliper_creations",
    caption: "Hand-drawn custom phone cases.",
    media_type: "image",
  },
  {
    id: "6",
    media_url: "/assets/calliper/studio-3.mp4",
    permalink: "https://instagram.com/calliper_creations",
    caption: "From the Calliper Creations studio.",
    media_type: "video",
    poster: "/assets/calliper/gift-bag-twin.jpg",
  },
  {
    id: "7",
    media_url: "/assets/calliper/gift-bag-twin.jpg",
    permalink: "https://instagram.com/calliper_creations",
    caption: "Hand-decorated gift bags.",
    media_type: "image",
  },
  {
    id: "8",
    media_url: "/assets/calliper/journal-peace.jpg",
    permalink: "https://instagram.com/calliper_creations",
    caption: "Scrapbook spreads, page by page.",
    media_type: "image",
  },
];
