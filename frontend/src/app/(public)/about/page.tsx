import Link from "next/link";
import {
  Building2,
  Camera,
  Cable,
  HardDrive,
  ShieldCheck,
  Server,
  Wifi,
  Cpu,
  Network,
  MonitorSmartphone,
  Factory,
  Truck,
  Headset,
  Boxes,
  Eye,
  Target,
  BadgeCheck,
  Sparkles,
  Handshake,
} from "lucide-react";
export default function AboutPage() {
  return (
    <main className="bg-white">
      {/* ================= HERO ================= */}

      <section className="relative overflow-hidden bg-primary from-[#0B3D91] via-[#0F4C81] to-slate-900 text-white">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10" />

        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center lg:px-8">
          <span className="mb-5 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium backdrop-blur">
            Established in 2009
          </span>

          <h1 className="max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl">
            Securing Tomorrow,
            <span className="block text-white">Today</span>
          </h1>

          <p className="mt-8 max-w-3xl text-lg leading-8 text-blue-100 md:text-xl">
            Uniworld Vision Pvt. Ltd. is one of Eastern India's fastest-growing
            manufacturers and distributors of CCTV surveillance systems,
            networking products, and security accessories.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className="rounded-xl bg-white px-8 py-4 font-semibold text-[#0B3D91] transition hover:scale-105"
            >
              Explore Products
            </Link>

            <Link
              href="/contact"
              className="rounded-xl border border-white/30 px-8 py-4 font-semibold transition hover:bg-white hover:text-[#0B3D91]"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}

      <section className="py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="font-semibold uppercase tracking-widest text-blue-600">
              About Uniworld Vision
            </span>

            <h2 className="mt-3 text-4xl font-bold text-slate-900">
              Building Trust Through Intelligent Security Solutions
            </h2>

            <p className="mt-8 text-lg leading-8 text-slate-600">
              Since <strong>2009</strong>, Uniworld Vision Pvt. Ltd. has been
              committed to delivering reliable, innovative, and cost-effective
              security solutions that protect homes, businesses, industries,
              educational institutions, healthcare facilities, and public
              infrastructure.
            </p>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              What started as a regional distributor has evolved into one of
              Eastern India's most trusted security technology companies with a
              strong presence across Bihar, Jharkhand, West Bengal, Odisha,
              Nepal, and other parts of Eastern India.
            </p>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Today, we proudly manufacture CCTV cameras and surveillance
              products under the
              <span className="font-semibold text-slate-900">
                {" "}
                UNIWORLD
              </span>{" "}
              brand while distributing products from globally recognized
              security brands.
            </p>
          </div>

          {/* Right Side */}

          <div className="relative">
            <div className="overflow-hidden rounded-3xl shadow-2xl">
              <img
                src="/about/company.jpeg"
                alt="Uniworld Vision"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="absolute -bottom-0 -left-0 rounded-2xl bg-white p-6 shadow-xl">
              <h3 className="text-4xl font-bold text-blue-700">16+</h3>

              <p className="mt-2 text-sm font-medium text-slate-600">
                Years of Industry Experience
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* ================= OUR JOURNEY ================= */}

      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="font-semibold uppercase tracking-widest text-blue-600">
              Our Journey
            </span>

            <h2 className="mt-3 text-4xl font-bold text-slate-900">
              A Legacy of Growth & Innovation
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Since 2009, Uniworld Vision has continuously evolved by embracing
              innovation, building strong partnerships, and delivering reliable
              security solutions across Eastern India.
            </p>
          </div>

          {/* Timeline */}

          <div className="relative mx-auto mt-20 max-w-5xl">
            {/* Center Line */}

            <div className="absolute left-4 top-0 h-full w-1 rounded bg-blue-200 md:left-1/2 md:-translate-x-1/2" />

            {[
              {
                year: "2009",
                title: "Foundation",
                description:
                  "Uniworld Vision was established with the vision of delivering dependable security solutions backed by quality products and exceptional customer service.",
              },
              {
                year: "2012",
                title: "CP PLUS Partnership",
                description:
                  "Expanded our surveillance portfolio by becoming a trusted distribution partner of CP PLUS.",
              },
              {
                year: "2014",
                title: "Dahua Technology",
                description:
                  "Partnered with Dahua Technology to provide advanced surveillance solutions across Eastern India.",
              },
              {
                year: "2016",
                title: "Market Leadership",
                description:
                  "Recognized as one of Bihar's leading CCTV distribution partners through continuous growth and customer trust.",
              },
              {
                year: "2019",
                title: "Hikvision Partnership",
                description:
                  "Added Hikvision products to our portfolio, offering customers even more advanced and reliable security solutions.",
              },
              {
                year: "2020",
                title: "Jharkhand Expansion",
                description:
                  "Opened our Jharkhand branch to improve product availability and technical support.",
              },
              {
                year: "2023",
                title: "Launch of UNIWORLD Brand",
                description:
                  "Started manufacturing CCTV cameras, recorders, networking products, and surveillance accessories under our own UNIWORLD brand.",
              },
              {
                year: "2024",
                title: "Rapid Growth",
                description:
                  "Became one of the fastest-growing CCTV companies across Bihar and Jharkhand while expanding throughout Eastern India.",
              },
            ].map((item, index) => (
              <div
                key={item.year}
                className={`relative mb-14 flex md:items-center ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Card */}

                <div className="ml-14 w-full md:ml-0 md:w-1/2 md:px-10">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <span className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                      {item.year}
                    </span>

                    <h3 className="mt-2 text-2xl font-bold text-slate-900">
                      {item.title}
                    </h3>

                    <p className="mt-4 leading-7 text-slate-600">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Dot */}

                <div className="absolute left-4 flex h-8 w-8 items-center justify-center rounded-full border-4 border-blue-600 bg-white md:left-1/2 md:-translate-x-1/2">
                  <div className="h-3 w-3 rounded-full bg-blue-600" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ================= WHO WE ARE ================= */}

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Left */}

            <div>
              <span className="font-semibold uppercase tracking-widest text-blue-600">
                Who We Are
              </span>

              <h2 className="mt-3 text-4xl font-bold text-slate-900">
                Complete Security Solutions Under One Roof
              </h2>

              <p className="mt-8 text-lg leading-8 text-slate-600">
                Uniworld Vision Pvt. Ltd. specializes in the manufacturing and
                distribution of CCTV surveillance systems, networking products,
                and security accessories.
              </p>

              <p className="mt-6 text-lg leading-8 text-slate-600">
                Our solutions are trusted across residential, commercial,
                industrial, educational, healthcare, banking, hospitality,
                retail, and government sectors.
              </p>

              <p className="mt-6 text-lg leading-8 text-slate-600">
                Our experienced team works closely with dealers, distributors,
                system integrators, and end users to deliver reliable products
                backed by responsive technical and after-sales support.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                  <ShieldCheck className="text-blue-600" />
                  <span className="font-medium">Trusted Since 2009</span>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                  <Building2 className="text-blue-600" />
                  <span className="font-medium">Manufacturing Excellence</span>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                  <Network className="text-blue-600" />
                  <span className="font-medium">
                    Strong Distribution Network
                  </span>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                  <BadgeCheck className="text-blue-600" />
                  <span className="font-medium">Quality Assured Products</span>
                </div>
              </div>
            </div>

            {/* Right */}

            <div className="overflow-hidden rounded-3xl shadow-2xl">
              <img
                src="/about/team.jpg"
                alt="Uniworld Team"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= PRODUCTS ================= */}

      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="font-semibold uppercase tracking-widest text-blue-600">
              Our Products
            </span>

            <h2 className="mt-3 text-4xl font-bold text-slate-900">
              Complete Surveillance & Networking Portfolio
            </h2>

            <p className="mt-6 text-lg text-slate-600">
              We manufacture and distribute a comprehensive range of CCTV,
              networking, and security products designed for long-term
              performance and reliability.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Camera,
                title: "IP CCTV Cameras",
              },
              {
                icon: MonitorSmartphone,
                title: "HD Analog Cameras",
              },
              {
                icon: Cpu,
                title: "AI Smart Cameras",
              },
              {
                icon: Wifi,
                title: "Wi-Fi Cameras",
              },
              {
                icon: Camera,
                title: "PTZ Cameras",
              },
              {
                icon: Camera,
                title: "4G Solar Cameras",
              },
              {
                icon: Server,
                title: "DVR & NVR",
              },
              {
                icon: Network,
                title: "PoE Switches",
              },
              {
                icon: Cable,
                title: "CAT6 Cables",
              },
              {
                icon: HardDrive,
                title: "Surveillance HDD",
              },
              {
                icon: Boxes,
                title: "Accessories",
              },
              {
                icon: ShieldCheck,
                title: "Security Products",
              },
            ].map((product) => (
              <div
                key={product.title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-2 hover:border-blue-600 hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-700 transition group-hover:bg-blue-600 group-hover:text-white">
                  <product.icon size={28} />
                </div>

                <h3 className="mt-6 text-lg font-semibold text-slate-900">
                  {product.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ================= WHY CHOOSE US ================= */}

      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="font-semibold uppercase tracking-widest text-blue-600">
              Why Choose Us
            </span>

            <h2 className="mt-3 text-4xl font-bold text-slate-900">
              Trusted Security Partner Across Eastern India
            </h2>

            <p className="mt-6 text-lg text-slate-600">
              We combine manufacturing excellence, innovative technology, and
              dependable customer support to deliver complete surveillance
              solutions that businesses trust.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {[
              {
                icon: Factory,
                title: "Manufacturing Excellence",
                description:
                  "Products manufactured using modern technology with strict quality standards.",
              },
              {
                icon: Boxes,
                title: "Complete Product Range",
                description:
                  "Everything from CCTV cameras to networking equipment under one roof.",
              },
              {
                icon: Truck,
                title: "Strong Distribution Network",
                description:
                  "Reliable dealer network ensuring fast product availability across multiple states.",
              },
              {
                icon: ShieldCheck,
                title: "Quality Assurance",
                description:
                  "Every product is tested to deliver consistent performance and durability.",
              },
              {
                icon: Cpu,
                title: "Innovation",
                description:
                  "AI surveillance, cloud connectivity, smart monitoring, and future-ready solutions.",
              },
              {
                icon: Headset,
                title: "Dedicated Support",
                description:
                  "Professional technical guidance and responsive after-sales service for every customer.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group rounded-3xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:border-blue-600 hover:shadow-2xl"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 transition-all group-hover:bg-blue-600 group-hover:text-white">
                  <item.icon size={30} />
                </div>

                <h3 className="mt-6 text-2xl font-semibold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= VISION & MISSION ================= */}

      <section className="bg-slate-50 py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2 lg:px-8">
          <div className="rounded-3xl bg-white p-10 shadow-lg">
            <Eye className="text-blue-600" size={42} />

            <h2 className="mt-6 text-3xl font-bold text-slate-900">
              Our Vision
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              To become one of India's most trusted security technology brands
              by delivering innovative products, reliable solutions, and
              exceptional customer experiences.
            </p>
          </div>

          <div className="rounded-3xl bg-primary p-10 text-white shadow-xl">
            <Target size={42} />

            <h2 className="mt-6 text-3xl font-bold">Our Mission</h2>

            <ul className="mt-8 space-y-4">
              {[
                "Manufacture high-quality surveillance products.",
                "Deliver reliable and affordable security solutions.",
                "Support dealers and business partners.",
                "Continuously innovate with emerging technologies.",
                "Help create safer homes, businesses, and communities.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <BadgeCheck className="mt-1 shrink-0 text-blue-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ================= CORE VALUES ================= */}

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <span className="font-semibold uppercase tracking-widest text-blue-600">
              Core Values
            </span>

            <h2 className="mt-3 text-4xl font-bold text-slate-900">
              The Principles That Drive Us
            </h2>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-5">
            {[
              {
                icon: Handshake,
                title: "Integrity",
              },
              {
                icon: ShieldCheck,
                title: "Quality",
              },
              {
                icon: Sparkles,
                title: "Innovation",
              },
              {
                icon: BadgeCheck,
                title: "Customer Focus",
              },
              {
                icon: Target,
                title: "Reliability",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group rounded-3xl border border-slate-200 bg-white p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:border-blue-600 hover:shadow-xl"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-700 transition-all group-hover:bg-blue-600 group-hover:text-white">
                  <item.icon size={28} />
                </div>

                <h3 className="mt-6 text-xl font-semibold text-slate-900">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ================= OUR STRENGTHS ================= */}

      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <span className="font-semibold uppercase tracking-widest text-blue-600">
              Our Strengths
            </span>

            <h2 className="mt-3 text-4xl font-bold text-slate-900">
              What Makes Uniworld Vision Different
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              More than a manufacturer, we are a trusted technology partner
              delivering dependable surveillance and networking solutions backed
              by quality, innovation, and customer-first service.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                number: "16+",
                title: "Years of Experience",
                desc: "Delivering trusted security solutions since 2009.",
              },
              {
                number: "5+",
                title: "Regions Served",
                desc: "Strong presence across Eastern India & Nepal.",
              },
              {
                number: "100%",
                title: "Quality Focus",
                desc: "Every product undergoes strict quality testing.",
              },
              {
                number: "24/7",
                title: "Technical Support",
                desc: "Reliable assistance for dealers and customers.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <h3 className="text-5xl font-extrabold text-blue-700">
                  {item.number}
                </h3>

                <h4 className="mt-5 text-xl font-semibold text-slate-900">
                  {item.title}
                </h4>

                <p className="mt-4 leading-7 text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {[
              "Manufacturer of CCTV products under the UNIWORLD brand",
              "Complete CCTV, networking & security product portfolio",
              "Strong dealer and distributor network",
              "Presence across Bihar, Jharkhand, West Bengal, Odisha & Nepal",
              "Experienced technical & after-sales support team",
              "Committed to innovation, reliability & customer satisfaction",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl bg-white p-5 shadow-sm"
              >
                <div className="mt-1 h-3 w-3 rounded-full bg-blue-600" />
                <p className="text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}

      <section className="relative overflow-hidden bg-primary from-[#0B3D91] via-[#0F4C81] to-slate-900 py-24 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-[radial-gradient(circle_at_top_right,white,transparent_60%)]" />
        </div>

        <div className="relative mx-auto max-w-5xl px-6 text-center lg:px-8">
          <span className="rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium backdrop-blur">
            Building a Safer Future
          </span>

          <h2 className="mt-8 text-4xl font-bold md:text-5xl">
            Protect What Matters Most
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-blue-100">
            For more than 16 years, Uniworld Vision Pvt. Ltd. has helped secure
            homes, businesses, industries, institutions, and communities through
            trusted surveillance technology.
          </p>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-blue-100">
            As technology evolves, we continue to innovate, expand, and deliver
            intelligent security solutions that create safer environments and
            build lasting confidence among our customers and partners.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-5">
            <Link
              href="/products"
              className="rounded-xl bg-white px-8 py-4 font-semibold text-[#0F4C81] transition hover:scale-105"
            >
              Explore Products
            </Link>

            <Link
              href="/contact"
              className="rounded-xl border border-white/30 px-8 py-4 font-semibold transition hover:bg-white hover:text-[#0F4C81]"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
