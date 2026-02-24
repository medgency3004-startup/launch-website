import { PhoneIcon, EnvelopeIcon, MapPinIcon } from "@heroicons/react/24/outline";

const USEFUL_LINKS = ["Home", "Hospital", "Emergency", "About Us"];
const SERVICES = ["Blood Donation", "Scheduled Delivery", "Emergency SOS", "24/7 Support"];

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/_medgency_?igsh=MWNqdDB6N2t1MDF0eA%3D%3D&utm_source=qr",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.5-2a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/medgency1/",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 8.98h4v12H3v-12zm7 0h3.8v1.65h.05c.53-1 1.82-2.06 3.75-2.06 4.01 0 4.75 2.64 4.75 6.08v6.33h-4v-5.61c0-1.34-.02-3.06-1.87-3.06-1.88 0-2.17 1.47-2.17 2.96v5.71h-4v-12z" />
      </svg>
    ),
  },
  {
    label: "Gmail",
    href: "mailto:medgency.info@gmail.com",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm-1.4 3.25-6.6 4.95-6.6-4.95V6l6.6 4.95L18.6 6v1.25z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#0B2C3D] text-white w-full">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div className="space-y-6">
          <h2 className="text-2xl font-normal tracking-wide text-[#92DCE5]">MEDGENCY</h2>
          <p className="text-2xl font-semibold leading-snug">
            Life-saving connections,
            <br />
            one click away.
          </p>
          <p className="text-sm text-gray-300">Your Need Our Responsibility</p>
          <div className="flex gap-4">
            {SOCIAL_LINKS.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-8 h-8 bg-white text-[#0B2C3D] rounded-md flex items-center justify-center"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Useful Links */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold underline underline-offset-4">Useful links</h3>
          <ul className="space-y-3 text-sm">
            {USEFUL_LINKS.map((link) => (
              <li
                key={link}
                className="underline underline-offset-4 cursor-pointer hover:text-red-500 transition-colors"
              >
                {link}
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold underline underline-offset-4">Services</h3>
          <ul className="space-y-3 text-sm">
            {SERVICES.map((service) => (
              <li
                key={service}
                className="underline underline-offset-4 cursor-pointer hover:text-red-500 transition-colors"
              >
                {service}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Contact bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-12">
        <div className="bg-white text-[#0B2C3D] rounded-2xl grid grid-cols-1 md:grid-cols-3 overflow-hidden">
          <div className="flex items-center gap-4 p-6 border-b md:border-b-0 md:border-r">
            <PhoneIcon className="w-6 h-6" />
            <div>
              <p className="text-xs">Need Help? Call us.</p>
              <p className="font-normal">+91 6355841543</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 border-b md:border-b-0 md:border-r">
            <EnvelopeIcon className="w-6 h-6" />
            <p className="font-semibold">medgency.info@gmail.com</p>
          </div>
          <div className="flex items-center gap-4 p-6">
            <MapPinIcon className="w-6 h-6" />
            <p className="font-semibold text-sm">SRM, Kattankulathur, Tamil Nadu – 603203</p>
          </div>
        </div>
      </div>
    </footer>
  );
}