import type { Metadata } from "next";
import Link from "next/link";
import {
  FiArrowUpRight,
  FiBriefcase,
  FiCheckCircle,
  FiMail,
  FiMapPin,
  FiMessageCircle,
  FiPhone,
  FiTool,
} from "react-icons/fi";

export const metadata: Metadata = {
  title: "Customer Support",
  description:
    "Contact Uniworld for product guidance, security system questions, dealer enquiries, and customer support.",
  alternates: { canonical: "https://uniworld.in/support" },
};

const supportChannels = [
  {
    title: "Call our team",
    description: "Talk directly with Uniworld about products or an existing enquiry.",
    detail: "+91 92040 57803",
    href: "tel:+919204057803",
    action: "Call now",
    icon: FiPhone,
  },
  {
    title: "WhatsApp",
    description: "Send your question, product photo, or details of the issue by chat.",
    detail: "+91 92040 57803",
    href: "https://wa.me/919204057803?text=Hello%20Uniworld%2C%20I%20need%20support%20with%20a%20security%20product.",
    action: "Chat on WhatsApp",
    icon: FiMessageCircle,
  },
  {
    title: "Email support",
    description: "Share the full details of your question and we will get back to you.",
    detail: "info@uniworldvision.com",
    href: "mailto:info@uniworldvision.com?subject=Uniworld%20Support%20Request",
    action: "Write an email",
    icon: FiMail,
  },
];

const supportTopics = [
  {
    title: "Choosing a product",
    description: "Need help comparing cameras, recorders, or accessories? Tell us what you need to secure and where it will be used.",
    href: "/products",
    action: "Browse products",
    icon: FiCheckCircle,
  },
  {
    title: "Product or setup question",
    description: "For help with a product you already have, share its model and a short description or photo of the issue.",
    href: "https://wa.me/917360000121?text=Hello%20Uniworld%2C%20I%20need%20help%20with%20a%20product.",
    action: "Get product help",
    icon: FiTool,
  },
  {
    title: "Dealer and business enquiries",
    description: "Looking to buy in bulk or become a dealer? Send your business and location details to the team.",
    href: "/dealers",
    action: "Dealer information",
    icon: FiBriefcase,
  },
];

export default function SupportPage() {
  return (
    <div className="bg-white">
      <section className="border-b border-gray-200 bg-[#f5f6f7]">
        <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-[1fr_auto] md:items-end md:py-16">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Uniworld customer care</p>
            <h1 className="mt-3 text-3xl font-bold leading-tight text-gray-950 md:text-5xl">
              Support that gets you to the right person.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-600 md:text-base md:leading-7">
              Product guidance, help with an existing system, or a dealer enquiry: choose the best way to reach our team.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex w-fit items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            Send a support request <FiArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 md:py-14" aria-labelledby="contact-support-heading">
        <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Talk to us</p>
            <h2 id="contact-support-heading" className="mt-1 text-2xl font-bold text-gray-950">Choose a support channel</h2>
          </div>
          <p className="text-sm text-gray-500">Contact the Uniworld team directly.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {supportChannels.map(({ title, description, detail, href, action, icon: Icon }) => (
            <article key={title} className="flex min-h-56 flex-col border border-gray-200 bg-white p-5 transition hover:border-primary/50 hover:shadow-md md:p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-orange-50 text-primary">
                <Icon size={19} aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-gray-950">{title}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-gray-600">{description}</p>
              <p className="mt-4 break-words text-sm font-medium text-gray-800">{detail}</p>
              <a
                href={href}
                target={href.startsWith("https://") ? "_blank" : undefined}
                rel={href.startsWith("https://") ? "noopener noreferrer" : undefined}
                className="mt-4 inline-flex w-fit items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark"
              >
                {action} <FiArrowUpRight aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-gray-200 bg-[#f8f9fa]">
        <div className="container mx-auto px-4 py-10 md:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">How can we help?</p>
          <h2 className="mt-1 text-2xl font-bold text-gray-950">Start with what you need</h2>
          <div className="mt-6 divide-y divide-gray-200 border-y border-gray-200">
            {supportTopics.map(({ title, description, href, action, icon: Icon }) => (
              <div key={title} className="grid gap-4 py-5 sm:grid-cols-[1fr_auto] sm:items-center">
                <div className="flex gap-4">
                  <span className="mt-0.5 text-primary"><Icon size={20} aria-hidden="true" /></span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{title}</h3>
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">{description}</p>
                  </div>
                </div>
                {href.startsWith("https://") ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-9 inline-flex w-fit items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark sm:ml-0"
                  >
                    {action} <FiArrowUpRight aria-hidden="true" />
                  </a>
                ) : (
                  <Link href={href} className="ml-9 inline-flex w-fit items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark sm:ml-0">
                    {action} <FiArrowUpRight aria-hidden="true" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto grid gap-8 px-4 py-10 md:grid-cols-2 md:py-14">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Help us help you</p>
          <h2 className="mt-1 text-2xl font-bold text-gray-950">A few details make support easier</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-gray-600">
            <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />Product name or model number</li>
            <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />A short description of what you need help with</li>
            <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />A photo of the product or issue, if useful</li>
          </ul>
        </div>
        <div className="grid gap-4">
          <div className="border border-gray-200 bg-white p-5 md:p-6">
            <div className="flex items-start gap-3">
              <FiMapPin className="mt-1 shrink-0 text-primary" size={20} aria-hidden="true" />
              <div>
                <h2 className="font-semibold text-gray-950">Visit our head office</h2>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Road No. 3, Azad Nagar, Kankarbagh, Patna, Bihar 800020
                </p>
                <a
                  href="https://maps.google.com/?q=Uniworld+Vision+Road+No+3+Azad+Nagar+Kankarbagh+Patna+800020"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark"
                >
                  Open map <FiArrowUpRight aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
          <div className="border border-gray-200 bg-white p-5 md:p-6">
            <div className="flex items-start gap-3">
              <FiMapPin className="mt-1 shrink-0 text-primary" size={20} aria-hidden="true" />
              <div>
                <h2 className="font-semibold text-gray-950">Delhi office</h2>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  39, FIEE Complex, Govindpuri, South East Delhi, Delhi 110020
                </p>
                <a
                  href="https://www.google.com/maps?q=28.5338551,77.2698201"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark"
                >
                  Open map <FiArrowUpRight aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}