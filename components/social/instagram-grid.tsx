import Image from "next/image";
import type { InstagramPost } from "@/lib/types";

export function InstagramGrid({
  posts,
  storeName,
  instagramHandle,
}: {
  posts: InstagramPost[];
  storeName: string;
  instagramHandle: string;
}) {
  const instagramUrl = `https://www.instagram.com/${instagramHandle}`;

  return (
    <section className="px-4 md:px-6 py-16 md:py-24" id="instagram">
      <div className="mb-10" data-reveal>
        <h2 className="font-display text-step-head">
          From the {storeName} studio
        </h2>
      </div>

      {posts.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-step-lead text-muted">
            Nothing to see yet — follow{" "}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-shift"
            >
              @{instagramHandle}
            </a>{" "}
            for updates.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {posts.map((post, i) => {
            const isVideo = post.media_type === "video";
            return (
              <a
                key={post.id}
                href={post.permalink || instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden bg-surface"
                data-reveal
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                {isVideo ? (
                  <video
                    src={post.media_url}
                    poster={post.poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="img-breathe h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src={post.media_url}
                    alt={post.caption || `${storeName} Instagram post`}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                    className="img-breathe object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-ground/10 group-hover:bg-ground/50 transition-colors" />
                {isVideo && (
                  <span className="absolute top-3 right-3 text-step-small uppercase tracking-[0.18em] bg-ground/70 px-2 py-1">
                    Video
                  </span>
                )}
                <p className="ig-caption absolute inset-x-0 bottom-0 translate-y-2 p-4 pt-10 text-step-small opacity-0 transition-[transform,opacity] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                  {post.caption}
                </p>
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
}
