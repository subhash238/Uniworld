import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BadgeCheck,
  Boxes,
  Building2,
  Cable,
  Camera,
  Check,
  Cpu,
  Eye,
  Factory,
  Globe2,
  Handshake,
  HardDrive,
  Headset,
  MonitorSmartphone,
  Network,
  Server,
  ShieldCheck,
  Sparkles,
  Target,
  Truck,
  Users,
  Wifi,
} from "lucide-react";
import { contactDetails } from "@/lib/contactDetails";

export const metadata = {
  title: "About Us",
  description:
    "Uniworld Vision Pvt. Ltd. — manufacturing and distributing CCTV cameras, recorders and surveillance products across Eastern India since 2009.",
  alternates: { canonical: "https://uniworld.in/about" },
};

const stats = [
  { number: "16+", label: "Years in security" },
  { number: "5+", label: "Regions served" },
  { number: "1,000+", label: "Products delivered" },
  { number: "24/7", label: "Technical support" },
];

const story = [
  "Since 2009, Uniworld Vision Pvt. Ltd. has stood for one thing: reliable security, honestly delivered. What began as a regional distribution business in Patna has grown into a security technology company serving Bihar, Jharkhand, West Bengal, Odisha and Nepal.",
  "Along the way we became trusted distribution partners for globally recognized brands — CP PLUS, Dahua Technology and Hikvision — before launching our own UNIWORLD line of cameras, recorders and networking products in 2023.",
  "Today we work alongside dealers, system integrators, enterprises and end users — pairing the right product with honest advice, and backing every sale with responsive technical support.",
  "Our growth has never come from pushing boxes. It comes from standing behind them — helping a dealer pick the right camera for a site, walking an installer through a tricky setup, and being reachable when something goes wrong at 9 PM on a Sunday.",
  "From a single Patna office to a multi-state network with our own manufacturing brand, every step has been built the same way: real products, fair prices and support you can count on. That is what keeps our partners — and their customers — coming back.",
];

const storyHighlights = [
  "Authorized distributor for CP PLUS, Dahua and Hikvision",
  "Own manufacturing brand — UNIWORLD cameras, recorders and accessories",
  "Dealer and system-integrator network across Eastern India and Nepal",
  "Technical guidance and after-sales support on every order",
];

const milestones = [
  { year: "2009", title: "Foundation", description: "Uniworld Vision is established in Patna with a simple promise: dependable security backed by exceptional service." },
  { year: "2012", title: "CP PLUS Partnership", description: "We join the CP PLUS distribution family, bringing India's leading surveillance brand to Eastern India." },
  { year: "2014", title: "Dahua Technology", description: "Our portfolio grows with Dahua's advanced surveillance range across the region." },
  { year: "2016", title: "Market Leadership", description: "Recognized as one of Bihar's leading CCTV distribution partners." },
  { year: "2019", title: "Hikvision Partnership", description: "Hikvision joins our lineup — more choice, more capability for every project." },
  { year: "2020", title: "Jharkhand Expansion", description: "A new branch brings product availability and technical support closer to dealers." },
  { year: "2023", title: "UNIWORLD Brand Launch", description: "We start manufacturing cameras, recorders and accessories under our own brand." },
  { year: "2024", title: "Rapid Growth", description: "Among the fastest-growing CCTV companies across Bihar and Jharkhand." },
];

const brands = [
  { name: "CP PLUS", role: "Authorized distributor since 2012" },
  { name: "Dahua", role: "Distribution partner since 2014" },
  { name: "Hikvision", role: "Partner since 2019" },
  { name: "UNIWORLD", role: "Our own manufacturing brand" },
];

const productRanges = [
  { icon: Camera, title: "IP CCTV Cameras" },
  { icon: MonitorSmartphone, title: "HD Analog Cameras" },
  { icon: Cpu, title: "AI Smart Cameras" },
  { icon: Wifi, title: "Wi-Fi Cameras" },
  { icon: Camera, title: "PTZ & Speed Domes" },
  { icon: Camera, title: "4G Solar Cameras" },
  { icon: Server, title: "DVR & NVR" },
  { icon: Network, title: "PoE Switches" },
  { icon: Cable, title: "CAT6 Cables" },
  { icon: HardDrive, title: "Surveillance HDD" },
  { icon: Boxes, title: "Accessories" },
  { icon: ShieldCheck, title: "Security Products" },
];

const strengths = [
  { icon: Factory, title: "Manufacturing excellence", description: "Modern production with strict quality control at every stage." },
  { icon: Boxes, title: "Complete product range", description: "Cameras, recorders, networking and accessories — everything under one roof." },
  { icon: Truck, title: "Strong distribution", description: "A dealer network that keeps products available and moving across multiple states." },
  { icon: ShieldCheck, title: "Quality assurance", description: "Every product is tested for consistent performance and durability." },
  { icon: Cpu, title: "Innovation", description: "AI surveillance, cloud connectivity and smart monitoring for tomorrow's needs." },
  { icon: Headset, title: "Dedicated support", description: "Real technical guidance and responsive after-sales service on every order." },
];

const missionStatement =
  "To make reliable security reachable for everyone — from a single shop counter in a small town to the largest institutions in the region — by manufacturing quality products, backing them with honest service, and growing the dealers and partners who deliver them.";

const missionPillars = [
  {
    title: "Manufacture products that earn trust",
    description:
      "Every UNIWORLD camera, recorder and networking product is built and tested for real conditions — power cuts, dust, heat and long hours — so customers get equipment that simply works, day after day.",
  },
  {
    title: "Keep advanced security affordable",
    description:
      "Good surveillance should not be a luxury. We keep modern technology — IP cameras, AI-ready NVRs, PoE systems — priced so a small shop can protect itself as confidently as a large enterprise.",
  },
  {
    title: "Grow with our dealers and partners",
    description:
      "Our dealer network across Eastern India and Nepal is the heart of Uniworld. We support partners with fair pricing, ready stock, product training and marketing help — when they grow, we grow.",
  },
  {
    title: "Stand behind every product we sell",
    description:
      "A security product is only as good as the support behind it. Our team answers calls, guides installations and resolves warranty issues quickly — so customers and installers are never left stranded.",
  },
  {
    title: "Build safer homes, businesses and communities",
    description:
      "Behind every camera is something worth protecting — a family's home, a worker's livelihood, a school's children. That purpose drives every decision we make, from product design to the last service call.",
  },
];

const values = [
  { icon: Handshake, title: "Integrity" },
  { icon: ShieldCheck, title: "Quality" },
  { icon: Sparkles, title: "Innovation" },
  { icon: Users, title: "Customer focus" },
  { icon: BadgeCheck, title: "Reliability" },
];

const regions = ["Bihar", "Jharkhand", "West Bengal", "Odisha", "Nepal"];
const sectors = ["Residential", "Commercial", "Industrial", "Education", "Healthcare", "Banking", "Hospitality", "Retail", "Government"];

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#101d33] text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(49,76,116,0.9),transparent_60%)]" />
        <div className="pointer-events-none absolute -right-24 top-1/2 hidden h-[420px] w-[420px] -translate-y-1/2 rounded-full border border-white/10 lg:block" />
        <div className="pointer-events-none absolute -right-8 top-1/2 hidden h-[280px] w-[280px] -translate-y-1/2 rounded-full border border-white/10 lg:block" />
        <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-16">
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="transition hover:text-white">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="text-slate-200">About us</span>
          </nav>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff9c54]">Uniworld Vision Pvt. Ltd.</p>
          <h1 className="mt-3 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Securing what matters, <span className="text-[#ff9c54]">since 2009.</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
            From a Patna distribution desk to an Eastern India security company with its own manufacturing brand — Uniworld delivers cameras, recorders and support you can actually rely on.
          </p>
          <div className="mt-8 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/15 bg-white/10 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-[#101d33]/80 px-5 py-4 backdrop-blur">
                <p className="text-2xl font-extrabold text-[#ff9c54] sm:text-3xl">{stat.number}</p>
                <p className="mt-1 text-xs font-medium text-slate-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="relative overflow-hidden bg-[#101d33] py-14 text-white md:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(227,30,36,0.18),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(49,76,116,0.6),transparent_50%)]" />
        <div className="pointer-events-none absolute left-8 top-10 h-24 w-24 opacity-30" style={{ backgroundImage: "radial-gradient(#ff9c54 2px, transparent 2px)", backgroundSize: "12px 12px" }} />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#ff9c54]"><span className="h-px w-10 bg-[#ff9c54]" />Our story</p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">Built on trust,<br />grown on <span className="text-[#ff9c54]">performance</span></h2>
            <div className="mt-5 space-y-4 text-[15px] leading-7 text-slate-300">
              {story.map((paragraph, index) => (
                <p key={paragraph.slice(0, 20)} className={index === 0 ? "border-l-2 border-[#ff9c54] pl-4 text-base font-medium leading-7 text-white" : undefined}>{paragraph}</p>
              ))}
            </div>
            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {storyHighlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2.5 rounded-lg border border-white/15 bg-white/[0.06] px-3.5 py-3 text-[13px] font-medium leading-5 text-slate-200 backdrop-blur-sm">
                  <Check size={15} className="mt-0.5 shrink-0 text-[#ff9c54]" aria-hidden="true" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#e31e24] px-5 text-sm font-bold text-white shadow-[0_10px_25px_-8px_rgba(227,30,36,0.6)] transition hover:-translate-y-0.5 hover:bg-[#c9181d]">Explore products <ArrowRight size={16} aria-hidden="true" /></Link>
              <Link href="/dealers" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/30 px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white hover:text-[#101d33]">Become a dealer</Link>
            </div>
          </div>
          <figure className="relative">
            <div className="pointer-events-none absolute -inset-3 rounded-3xl bg-gradient-to-br from-[#ff9c54]/25 via-transparent to-[#e31e24]/25 blur-xl" />
            <div className="relative overflow-hidden rounded-2xl bg-white p-2.5 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] ring-1 ring-white/20">
              <Image src="/about/company-journey.png" alt="Uniworld Vision journey of growth" width={800} height={560} priority sizes="(max-width: 1024px) 90vw, 520px" className="mx-auto h-auto w-full rounded-xl object-cover" />
            </div>
            <div className="absolute -bottom-5 left-6 rounded-xl bg-[#e31e24] px-4 py-2.5 text-white shadow-lg">
              <p className="text-lg font-extrabold leading-none">2009</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/85">Est. Patna</p>
            </div>
            <figcaption className="sr-only">Our journey of growth — people, partnerships, a safer tomorrow.</figcaption>
          </figure>
        </div>
      </section>

      {/* How we work */}
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e31e24]">How we work</p>
          <h2 className="mt-2 text-2xl font-bold text-[#1b2a4a] sm:text-3xl">From first call to long-term support</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Security isn't a one-time sale for us — it's a relationship. Here's how we work with every dealer, integrator and customer.</p>
          <ol className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              { step: "01", title: "Consult & recommend", text: "We listen first. Site type, coverage goals and budget decide the product mix — not what's sitting in our warehouse. You get honest advice on cameras, recorders, storage and networking that actually fits the job." },
              { step: "02", title: "Supply & support", text: "Stock that's actually available, delivered on time through our dealer network. Our team helps installers with setup, configuration and on-site questions so projects go live without drama." },
              { step: "03", title: "Stay & service", text: "After the sale we stay reachable — warranty help, replacements, firmware updates and technical guidance. That's how one-time buyers become long-term partners." },
            ].map((item) => (
              <li key={item.step} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
                <span className="absolute -right-2 -top-4 text-7xl font-extrabold text-[#e31e24]/[0.07]">{item.step}</span>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#e31e24]/10 text-sm font-extrabold text-[#e31e24]">{item.step}</span>
                <h3 className="mt-4 text-base font-bold text-[#1b2a4a]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Journey timeline */}
      <section className="border-y border-slate-100 bg-[#f7f9fc] py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e31e24]">Our journey</p>
          <h2 className="mt-2 text-2xl font-bold text-[#1b2a4a] sm:text-3xl">A legacy of growth &amp; innovation</h2>
          <ol className="relative mt-8 space-y-6 border-l-2 border-slate-200 pl-6 sm:pl-8 lg:grid lg:grid-cols-2 lg:gap-x-12 lg:space-y-0 lg:gap-y-10">
            {milestones.map((item) => (
              <li key={item.year} className="relative">
                <span className="absolute -left-[35px] top-1 h-4 w-4 rounded-full border-4 border-[#f7f9fc] bg-[#e31e24] sm:-left-[42px]" />
                <div className="rounded-xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-[#e31e24]/10 px-3 py-1 text-xs font-bold text-[#e31e24]">{item.year}</span>
                    <h3 className="text-base font-bold text-[#1b2a4a]">{item.title}</h3>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Brand partners */}
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e31e24]">Partnerships</p>
          <h2 className="mt-2 text-2xl font-bold text-[#1b2a4a] sm:text-3xl">Backed by the brands the industry trusts</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {brands.map((brand) => (
              <div key={brand.name} className="rounded-xl border border-slate-200 bg-white p-6 text-center transition hover:border-[#e31e24]/40 hover:shadow-md">
                <p className={`text-xl font-extrabold tracking-tight ${brand.name === "UNIWORLD" ? "text-[#e31e24]" : "text-[#1b2a4a]"}`}>{brand.name}</p>
                <p className="mt-2 text-xs leading-5 text-slate-500">{brand.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section className="border-y border-slate-100 bg-[#f7f9fc] py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e31e24]">Products &amp; presence</p>
              <h2 className="mt-2 text-2xl font-bold text-[#1b2a4a] sm:text-3xl">A complete security portfolio</h2>
            </div>
            <Link href="/products" className="inline-flex items-center gap-2 text-sm font-bold text-[#e31e24] hover:underline">Explore products <ArrowUpRight size={16} aria-hidden="true" /></Link>
          </div>
          <ul className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
            {productRanges.map((product) => (
              <li key={product.title} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3.5 transition hover:border-[#e31e24]/40 hover:shadow-sm">
                <product.icon size={20} className="shrink-0 text-[#e31e24]" aria-hidden="true" />
                <span className="text-sm font-semibold text-[#1b2a4a]">{product.title}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="flex items-center gap-2.5">
                <Globe2 size={18} className="text-[#e31e24]" aria-hidden="true" />
                <h3 className="text-sm font-bold text-[#1b2a4a]">Where we work</h3>
              </div>
              <ul className="mt-3 flex flex-wrap gap-2">
                {regions.map((region) => <li key={region} className="rounded-full border border-slate-200 bg-[#f7f9fc] px-3 py-1.5 text-xs font-medium text-slate-600">{region}</li>)}
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="flex items-center gap-2.5">
                <Building2 size={18} className="text-[#e31e24]" aria-hidden="true" />
                <h3 className="text-sm font-bold text-[#1b2a4a]">Who we support</h3>
              </div>
              <ul className="mt-3 flex flex-wrap gap-2">
                {sectors.map((sector) => <li key={sector} className="rounded-full border border-slate-200 bg-[#f7f9fc] px-3 py-1.5 text-xs font-medium text-slate-600">{sector}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Uniworld + vision/mission */}
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e31e24]">Why Uniworld</p>
          <h2 className="mt-2 text-2xl font-bold text-[#1b2a4a] sm:text-3xl">Products, partnerships and people</h2>
          <ul className="mt-6 grid gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {strengths.map((item) => (
              <li key={item.title} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e31e24]/10 text-[#e31e24]">
                  <item.icon size={21} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-[#1b2a4a]">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e31e24]/10 text-[#e31e24]"><Eye size={22} aria-hidden="true" /></span>
              <h3 className="text-lg font-bold text-[#1b2a4a]">Our vision</h3>
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">To become one of India's most trusted security technology brands — the name people reach for when they need protection they never have to second-guess. A brand known not just for the products it sells, but for the partners it builds and the promises it keeps.</p>
          </div>

          <ul className="mt-6 flex flex-wrap gap-2.5">
            {values.map((value) => (
              <li key={value.title} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                <value.icon size={16} className="text-[#e31e24]" aria-hidden="true" />{value.title}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Mission */}
      <section className="relative overflow-hidden bg-[#101d33] py-12 text-white md:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(227,30,36,0.18),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(49,76,116,0.55),transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-3xl">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#ff9c54]"><Target size={15} aria-hidden="true" />Our mission</p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">What drives us, <span className="text-[#ff9c54]">every single day</span></h2>
            <p className="mt-5 border-l-2 border-[#ff9c54]/60 pl-5 text-base leading-8 text-slate-200 sm:text-lg">{missionStatement}</p>
          </div>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {missionPillars.map((pillar, index) => (
              <li key={pillar.title} className={`group rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur transition hover:border-[#ff9c54]/40 hover:bg-white/[0.09] ${index === missionPillars.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""}`}>
                <span className="text-sm font-extrabold tracking-widest text-[#ff9c54]/80">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-lg font-bold leading-snug">{pillar.title}</h3>
                <p className="mt-2.5 text-sm leading-7 text-slate-300">{pillar.description}</p>
              </li>
            ))}
            <li className="flex flex-col justify-center rounded-2xl border border-[#e31e24]/40 bg-[#e31e24]/10 p-6">
              <p className="text-lg font-bold leading-snug">"When a Uniworld camera goes up somewhere, someone sleeps easier."</p>
              <p className="mt-3 text-sm font-medium text-[#ff9c54]">— The promise we work by</p>
            </li>
          </ol>
        </div>
      </section>

      {/* Offices strip */}
      <section className="border-y border-slate-100 bg-[#f7f9fc] py-10 md:py-12">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e31e24]">Our offices</p>
          <h2 className="mt-2 text-2xl font-bold text-[#1b2a4a] sm:text-3xl">Come say hello</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {contactDetails.offices.map((office) => (
              <div key={office.name} className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e31e24]/10 text-[#e31e24]"><Building2 size={20} aria-hidden="true" /></span>
                <div>
                  <h3 className="font-bold text-[#1b2a4a]">{office.name}</h3>
                  <address className="mt-1.5 text-sm not-italic leading-6 text-slate-600">{office.address}</address>
                  <a href={office.mapsHref} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-[#e31e24] hover:underline">Open map <ArrowUpRight size={14} aria-hidden="true" /></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 md:py-14">
        <div className="relative overflow-hidden rounded-2xl bg-[#101d33] p-7 text-white sm:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(227,30,36,0.25),transparent_55%)]" />
          <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff9c54]"><Award size={14} className="mr-1.5 inline" aria-hidden="true" />Building a safer future</p>
              <h2 className="mt-3 text-2xl font-bold sm:text-3xl">Protect what matters most</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">Homes, businesses, institutions — tell us what you need to secure and our team will guide you to the right products and partners.</p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:shrink-0">
              <Link href="/products" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#e31e24] px-6 text-sm font-bold text-white transition hover:bg-[#c9181d]">Explore products <ArrowRight size={16} aria-hidden="true" /></Link>
              <Link href="/contact" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/30 px-6 text-sm font-bold transition hover:bg-white hover:text-[#101d33]">Talk to our team</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
