interface PageIntroProps {
  title: string;
  description: string;
}

export default function PageIntro({ title, description }: PageIntroProps) {
  return (
    <section className="flex min-h-[42vh] items-center bg-navy-900 px-5 py-20 text-center sm:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="mb-5 text-sm uppercase text-gold-400">
          A2 Meridian Associates
        </p>
        <h1 className="font-heading text-4xl font-bold leading-tight text-white sm:text-5xl">
          {title}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-300">
          {description}
        </p>
      </div>
    </section>
  );
}
