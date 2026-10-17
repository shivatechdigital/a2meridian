import ScrollReveal from "@/components/shared/ScrollReveal";
import TextReveal from "@/components/shared/TextReveal";

interface SectionTitleProps {
  subtitle?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
}

export default function SectionTitle({
  subtitle,
  title,
  description,
  align = "center",
  light = false,
}: SectionTitleProps) {
  return (
    <ScrollReveal
      className={`mb-10 ${align === "center" ? "text-center" : "text-left"}`}
    >
      {subtitle && (
        <span className="mb-3 inline-block text-sm font-semibold uppercase text-gold-500">
          {subtitle}
        </span>
      )}
      <TextReveal
        text={title}
        className={`font-heading text-3xl font-bold leading-tight ${light ? "text-white" : "text-navy-900"}`}
      />
      {description && (
        <p
          className={`mt-4 max-w-2xl text-base leading-7 ${align === "center" ? "mx-auto" : ""} ${light ? "text-gray-300" : "text-gray-600"}`}
        >
          {description}
        </p>
      )}
      <div
        aria-hidden="true"
        className={`mt-6 h-1 w-16 rounded-full bg-gold-500 ${align === "center" ? "mx-auto" : ""}`}
      />
    </ScrollReveal>
  );
}
