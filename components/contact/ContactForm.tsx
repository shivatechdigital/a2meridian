"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import {
  INQUIRY_CATEGORIES,
  INQUIRY_COUNTRIES,
  inquirySchema,
  type InquiryFormData,
} from "@/lib/contact-schema";
import { COMPANY } from "@/lib/constants";

interface Props {
  prefillProduct?: string;
  prefillCountry?: string;
  hsCode?: string | null;
  compact?: boolean;
}

export default function ContactForm({
  prefillProduct = "",
  prefillCountry = "",
  hsCode,
  compact = false,
}: Props) {
  const prefix = useId();
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [serverError, setServerError] = useState("");
  const submitting = useRef(false);
  const controller = useRef<AbortController | null>(null);
  const submission = useRef<{ body: string; key: string } | null>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const country = INQUIRY_COUNTRIES.find((value) => value === prefillCountry);
  const product = prefillProduct.slice(0, 160);
  const categories =
    product && !INQUIRY_CATEGORIES.includes(product)
      ? [product, ...INQUIRY_CATEGORIES]
      : INQUIRY_CATEGORIES;
  const defaults = {
    name: "",
    email: "",
    phone: "",
    company: "",
    country,
    productInterest: product,
    tradeType: "both" as const,
    message: product
      ? `I am interested in ${product}${hsCode ? ` (HS: ${hsCode})` : ""}. Please share pricing, MOQ, documentation, and availability.`
      : "",
    website: "",
  };
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: defaults,
    shouldFocusError: true,
  });

  useEffect(() => () => controller.current?.abort(), []);
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const onSubmit = async (data: InquiryFormData) => {
    if (submitting.current) return;
    submitting.current = true;
    setServerError("");
    setStatus("loading");
    const body = JSON.stringify(data);
    if (submission.current?.body !== body)
      submission.current = { body, key: crypto.randomUUID() };
    const abortController = new AbortController();
    controller.current = abortController;
    const timer = setTimeout(() => abortController.abort(), 30000);
    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": submission.current.key,
        },
        body,
        signal: abortController.signal,
      });
      const result: {
        success?: boolean;
        error?: string;
        fields?: Record<string, string[]>;
      } = await response.json();
      if (!response.ok || result.success !== true) {
        if (result.fields)
          for (const [field, messages] of Object.entries(result.fields)) {
            if (
              [
                "name",
                "email",
                "phone",
                "company",
                "country",
                "productInterest",
                "tradeType",
                "message",
              ].includes(field) &&
              messages?.[0]
            )
              setError(field as keyof InquiryFormData, {
                type: "server",
                message: messages[0],
              });
          }
        const retryAfter = response.headers.get("retry-after");
        setServerError(
          `${result.error || "Your inquiry could not be submitted. Please try again."}${response.status === 429 && retryAfter ? ` Retry after ${retryAfter} seconds.` : ""}`,
        );
        setStatus("error");
      } else {
        setStatus("success");
      }
    } catch {
      setServerError(
        "We could not confirm submission. Your details are still here. Please retry or email our team directly.",
      );
      setStatus("error");
    } finally {
      clearTimeout(timer);
      submitting.current = false;
      controller.current = null;
    }
  };

  const fieldId = (field: keyof InquiryFormData) => `${prefix}-${field}`;
  const attributes = (field: keyof InquiryFormData) => ({
    id: fieldId(field),
    "aria-invalid": Boolean(errors[field]),
    "aria-describedby": errors[field] ? `${fieldId(field)}-error` : undefined,
  });
  const inputClass = (field: keyof FieldErrors<InquiryFormData>) =>
    `min-h-12 w-full min-w-0 rounded-md border bg-white px-3 py-3 text-sm text-navy-900 placeholder:text-gray-400 ${errors[field] ? "border-red-600" : "border-gray-300"}`;
  const label = (
    field: keyof InquiryFormData,
    text: string,
    required = true,
  ) => (
    <label
      htmlFor={fieldId(field)}
      className="mb-2 block text-sm font-semibold text-navy-900"
    >
      {text}
      {required && (
        <span aria-hidden="true" className="text-red-700">
          {" "}
          *
        </span>
      )}
    </label>
  );
  const error = (field: keyof InquiryFormData) =>
    errors[field] && (
      <p
        id={`${fieldId(field)}-error`}
        className="mt-1.5 text-xs leading-5 text-red-700"
      >
        {errors[field]?.message}
      </p>
    );

  return (
    <div
      className={
        compact ? "" : "rounded-lg border border-gray-200 bg-white p-5 sm:p-8"
      }
    >
      {status === "success" ? (
        <div
          ref={successRef}
          tabIndex={-1}
          role="status"
          className="py-12 text-center"
        >
          <CheckCircle2
            className="mx-auto mb-5 size-14 text-emerald-700"
            aria-hidden="true"
          />
          <h2 className="font-heading text-2xl font-bold text-navy-900">
            Inquiry Submitted
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-gray-600">
            Thank you. Your inquiry has been accepted for sending to our team.
            We will review your requirements and follow up.
          </p>
          <button
            type="button"
            onClick={() => {
              reset(defaults);
              submission.current = null;
              setStatus("idle");
            }}
            className="mt-7 rounded-md border border-gray-300 px-5 py-3 text-sm font-semibold text-navy-900 hover:bg-offwhite"
          >
            Send Another Inquiry
          </button>
        </div>
      ) : (
        <>
          {!compact && (
            <>
              <h2 className="font-heading text-2xl font-bold text-navy-900">
                Send Us an Inquiry
              </h2>
              <p className="mb-7 mt-3 text-sm leading-7 text-gray-600">
                Share your product, quantities, destination, and timeline with
                our trade team.
              </p>
            </>
          )}
          <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            aria-label={compact ? "Product inquiry form" : "Trade inquiry form"}
          >
            <fieldset
              disabled={status === "loading"}
              className="space-y-5 disabled:opacity-70"
            >
              <legend className="sr-only">Inquiry details</legend>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  {label("name", "Full Name")}
                  <input
                    type="text"
                    autoComplete="name"
                    required
                    maxLength={100}
                    placeholder="Your name"
                    {...register("name")}
                    {...attributes("name")}
                    className={inputClass("name")}
                  />
                  {error("name")}
                </div>
                <div>
                  {label("email", "Email Address")}
                  <input
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    placeholder="you@company.com"
                    {...register("email")}
                    {...attributes("email")}
                    className={inputClass("email")}
                  />
                  {error("email")}
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  {label("phone", "Phone / WhatsApp")}
                  <input
                    type="tel"
                    autoComplete="tel"
                    required
                    maxLength={20}
                    placeholder="+91 98765 43210"
                    {...register("phone")}
                    {...attributes("phone")}
                    className={inputClass("phone")}
                  />
                  {error("phone")}
                </div>
                <div>
                  {label("company", "Company Name", false)}
                  <input
                    type="text"
                    autoComplete="organization"
                    maxLength={100}
                    placeholder="Company (optional)"
                    {...register("company")}
                    {...attributes("company")}
                    className={inputClass("company")}
                  />
                  {error("company")}
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  {label("country", "Your Country")}
                  <select
                    autoComplete="country-name"
                    required
                    {...register("country")}
                    {...attributes("country")}
                    className={inputClass("country")}
                  >
                    <option value="">Select Country</option>
                    {INQUIRY_COUNTRIES.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                  {error("country")}
                </div>
                <div>
                  {label("productInterest", "Product Interest")}
                  <select
                    required
                    {...register("productInterest")}
                    {...attributes("productInterest")}
                    className={inputClass("productInterest")}
                  >
                    <option value="">Select Product or Category</option>
                    {categories.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                  {error("productInterest")}
                </div>
              </div>
              <fieldset
                aria-describedby={
                  errors.tradeType ? `${fieldId("tradeType")}-error` : undefined
                }
              >
                <legend className="mb-2 text-sm font-semibold text-navy-900">
                  Trade Type{" "}
                  <span aria-hidden="true" className="text-red-700">
                    *
                  </span>
                </legend>
                <div className="grid gap-2 sm:grid-cols-3">
                  {[
                    {
                      value: "import",
                      title: "I Want to Import",
                      detail: "Into my market",
                    },
                    {
                      value: "export",
                      title: "I Want to Export",
                      detail: "From my market",
                    },
                    { value: "both", title: "Both", detail: "Import & export" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="cursor-pointer rounded-md border border-gray-300 px-3 py-3 has-checked:border-gold-600 has-checked:bg-gold-50 has-focus-visible:outline-2 has-focus-visible:outline-gold-600"
                    >
                      <input
                        type="radio"
                        required
                        value={option.value}
                        {...register("tradeType")}
                        className="mr-2 accent-gold-600"
                      />
                      <span className="text-xs font-semibold text-navy-900">
                        {option.title}
                      </span>
                      <span className="mt-1 block text-xs text-gray-600">
                        {option.detail}
                      </span>
                    </label>
                  ))}
                </div>
                {error("tradeType")}
              </fieldset>
              <div>
                {label("message", "Your Message")}
                <textarea
                  rows={5}
                  required
                  maxLength={2000}
                  placeholder="Products, quantities, destination, timeline..."
                  {...register("message")}
                  {...attributes("message")}
                  className={`${inputClass("message")} resize-y`}
                />
                {error("message")}
              </div>
              <div className="hidden" aria-hidden="true">
                <label htmlFor={fieldId("website")}>Website</label>
                <input
                  id={fieldId("website")}
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  {...register("website")}
                />
              </div>
              <p className="text-xs leading-6 text-gray-500">
                Your contact details and message will be used to respond to this
                inquiry. Please do not include sensitive documents.
              </p>
              {serverError && (
                <div
                  role="alert"
                  className="rounded-md border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800"
                >
                  <span className="flex items-start gap-2">
                    <AlertCircle
                      size={18}
                      className="mt-1 shrink-0"
                      aria-hidden="true"
                    />
                    {serverError}
                  </span>
                  <a
                    href={`mailto:${COMPANY.email}`}
                    className="mt-2 inline-block font-semibold underline underline-offset-4"
                  >
                    Email Our Team
                  </a>
                </div>
              )}
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-gold-500 px-6 py-3 font-semibold text-navy-950 hover:bg-gold-400 disabled:cursor-wait disabled:opacity-60 sm:w-auto"
              >
                {status === "loading" ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <Send size={18} aria-hidden="true" />
                )}
                {status === "loading" ? "Sending Inquiry..." : "Send Inquiry"}
              </button>
            </fieldset>
          </form>
        </>
      )}
    </div>
  );
}
