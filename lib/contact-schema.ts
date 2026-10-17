import { z } from "zod";

export const INQUIRY_COUNTRIES = [
  "India",
  "United Arab Emirates",
  "Saudi Arabia",
  "United States",
  "United Kingdom",
  "Germany",
  "Singapore",
  "China",
  "Thailand",
  "Australia",
  "South Africa",
  "Brazil",
  "Netherlands",
  "Qatar",
  "Oman",
  "Malaysia",
  "Vietnam",
  "Kenya",
  "South Korea",
  "Other",
] as const;
export const INQUIRY_CATEGORIES = [
  "Agriculture (Rice, Spices, Pulses)",
  "Textiles & Yarn",
  "Chemicals & Dyes",
  "Machinery & Auto Parts",
  "Food & Beverages",
  "Minerals & Ores",
  "Electronics",
  "Petroleum Products",
  "Other",
];
const singleLine = (maximum: number) =>
  z
    .string()
    .trim()
    .max(maximum, "This value is too long")
    .refine(
      (value) => !/[\r\n\u0000]/.test(value),
      "Enter a single-line value",
    );

export const inquirySchema = z
  .object({
    name: singleLine(100).refine(
      (value) => value.length >= 2,
      "Name must be at least 2 characters",
    ),
    email: z
      .string()
      .trim()
      .max(254)
      .email("Please enter a valid email address"),
    phone: z
      .string()
      .trim()
      .min(7, "Phone number is too short")
      .max(20, "Phone number is too long")
      .regex(/^\+?[0-9() .-]+$/, "Please enter a valid phone number")
      .refine((value) => {
        const digits = value.replace(/\D/g, "");
        return digits.length >= 7 && digits.length <= 15;
      }, "Enter a phone number with 7 to 15 digits"),
    company: singleLine(100).optional(),
    country: z.enum(INQUIRY_COUNTRIES, { error: "Please select your country" }),
    productInterest: singleLine(160).refine(
      (value) => value.length > 0,
      "Please select a product or category",
    ),
    tradeType: z.enum(["import", "export", "both"], {
      error: "Please select a trade type",
    }),
    message: z
      .string()
      .trim()
      .min(10, "Message must be at least 10 characters")
      .max(2000, "Message is too long")
      .refine(
        (value) => !value.includes("\u0000"),
        "Message contains an invalid character",
      ),
    website: z.string().max(200).optional(),
  })
  .strict();

export type InquiryFormData = z.infer<typeof inquirySchema>;
