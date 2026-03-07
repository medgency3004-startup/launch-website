import Image from "next/image";
import clarityIcon from "@/assets/images/computer.png";
import patientIcon from "@/assets/images/patient.png";
import thumbsUp from "@/assets/icons/thumbsup.png";

const REASONS = [
    { icon: clarityIcon, label: "Clarity over complexity" },
    { icon: thumbsUp, label: "One-search convenience" },
    { icon: patientIcon, label: "Patient-first, not provider-first" },
];

export function WhyChooseUs() {
    return (
        <section className="px-4 sm:px-8 md:px-12 py-16 sm:py-24 text-center bg-[#F9FAFB]">
            <h2 className="text-4xl font-serif text-[#0B2C3D] mb-16">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 max-w-6xl mx-auto">
                {REASONS.map(({ icon, label }) => (
                    <div
                        key={label}
                        className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
                    >
                        <Image src={icon} alt={label} className="mb-6 h-12 w-auto" />
                        <p className="text-lg font-bold text-[#0B2C3D]">{label}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}