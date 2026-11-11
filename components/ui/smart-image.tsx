import Image from "next/image";

export function SmartImage({
  src,
  alt,
  fill,
  sizes,
  className,
  priority,
}: {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  priority?: boolean;
}) {
  if (/^https?:\/\//i.test(src)) {
    const classes = fill
      ? `${className ?? ""} absolute inset-0 h-full w-full`.trim()
      : className;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={classes}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      className={className}
      priority={priority}
    />
  );
}
