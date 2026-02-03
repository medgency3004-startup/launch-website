import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

export default function Footer() {
  return (
    <footer className="bg-[#0B2C3D] text-white w-full">
      {/* TOP SECTION */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* LEFT BRAND */}
        <div className="space-y-6">
          <h2 className="text-2xl font-normal tracking-wide text-[#92DCE5]">
            MEDGENCY
          </h2>

          <p className="text-2xl font-semibold leading-snug">
            Life- saving connections,
            <br />
            one click away.
          </p>

          <p className="text-sm text-gray-300">
            Your Need Our Responsibility
          </p>

          {/* SOCIAL ICONS */}
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-white text-[#0B2C3D] rounded-md flex items-center justify-center">
              f
            </div>
            <div className="w-8 h-8 bg-white text-[#0B2C3D] rounded-md flex items-center justify-center">
              in
            </div>
            <div className="w-8 h-8 bg-white text-[#0B2C3D] rounded-md flex items-center justify-center">
              ⧉
            </div>
          </div>
        </div>

        {/* USEFUL LINKS */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold underline underline-offset-4">
            Useful links
          </h3>
          <ul className="space-y-3 text-sm">
  <li className="underline underline-offset-4 cursor-pointer text-white hover:text-red-500 transition-colors">
    Home
  </li>
  <li className="underline underline-offset-4 cursor-pointer text-white hover:text-red-500 transition-colors">
    Hospital
  </li>
  <li className="underline underline-offset-4 cursor-pointer text-white hover:text-red-500 transition-colors">
    Emergency
  </li>
  <li className="underline underline-offset-4 cursor-pointer text-white hover:text-red-500 transition-colors">
    About Us
  </li>
</ul>

        </div>

        {/* SERVICES */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold underline underline-offset-4">
            Services
          </h3>

          <ul className="space-y-3 text-sm">
  <li className="underline underline-offset-4 cursor-pointer text-white hover:text-red-500 transition-colors">
    Blood Donation
  </li>
  <li className="underline underline-offset-4 cursor-pointer text-white hover:text-red-500 transition-colors">
    Scheduled Delivery
  </li>
  <li className="underline underline-offset-4 cursor-pointer text-white hover:text-red-500 transition-colors">
    Emergency SOS
  </li>
  <li className="underline underline-offset-4 cursor-pointer text-white hover:text-red-500 transition-colors">
    24/7 Support
  </li>
</ul>

        </div>
      </div>

      {/* BOTTOM CONTACT BAR */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-12">
        <div className="bg-white text-[#0B2C3D] rounded-2xl grid grid-cols-1 md:grid-cols-3 overflow-hidden">
          {/* CALL */}
          <div className="flex items-center gap-4 p-6 border-b md:border-b-0 md:border-r">
            <PhoneIcon className="w-6 h-6" />
            <div>
              <p className="text-xs">Need Help? Call us.</p>
              <p className="font-normal">+91 99999 99999</p>
            </div>
            <button className="ml-auto bg-[#0B2C3D] text-white px-4 py-2 rounded-md text-sm">
              Make Appointment
            </button>
          </div>

          {/* EMAIL */}
          <div className="flex items-center gap-4 p-6 border-b md:border-b-0 md:border-r">
            <EnvelopeIcon className="w-6 h-6" />
            <p className="font-semibold">
              medgency@gmail.com
            </p>
          </div>

          {/* ADDRESS */}
          <div className="flex items-center gap-4 p-6">
            <MapPinIcon className="w-6 h-6" />
            <p className="font-semibold text-sm">
              SRM, Kattankulathur, Tamil Nadu – 603202
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
