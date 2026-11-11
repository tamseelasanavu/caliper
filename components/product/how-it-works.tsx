const STEPS = [
  {
    title: "Pick your piece",
    body: "Browse vintage letters, journaling frames, cards, phone cases and scrapbooks — every one made to order.",
  },
  {
    title: "Customise it",
    body: "Add names, messages, photos and finishes so the piece is built around your story.",
  },
  {
    title: "Send a DM",
    body: "Your details are copied for you — open Instagram, paste them into a DM and we’ll confirm the rest.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="px-4 md:px-6 py-16 md:py-24">
      <div className="mb-10" data-reveal>
        <h2 className="font-display text-step-head">Three steps to a personalised keepsake</h2>
      </div>

      <ol className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 list-none">
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            data-reveal
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <h3 className="font-display text-step-subhead mb-3">{s.title}</h3>
            <p className="text-step-body text-muted">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
