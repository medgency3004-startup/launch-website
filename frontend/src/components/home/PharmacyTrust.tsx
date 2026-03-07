import Image from "next/image";
import tata1mg from "@/assets/images/tata1mg.png";
import pharmeasy from "@/assets/images/pharmeasy.png";

export function PharmacyTrust() {
    return (
        <section className="px-4 sm:px-8 md:px-12 py-12 sm:py-16 text-center border-b border-gray-100">
            <p className="text-[#0B2C3D] text-lg mb-8 opacity-70">
                Compare across popular pharmacies nationwide
            </p>
            <div className="grid grid-cols-5 gap-6 sm:gap-10 items-center justify-items-center grayscale opacity-60">
                <Image src="/logos/truemeds.svg" alt="Truemeds" className="h-8 sm:h-10 w-auto" width={80} height={32} />
                <Image src={pharmeasy} alt="PharmEasy" className="h-8 sm:h-10 w-auto" />
                <Image src={tata1mg} alt="Tata 1mg" className="h-8 sm:h-10 w-auto" />
                <Image src="/logos/medkart.svg" alt="Medkart" className="h-8 sm:h-10 w-auto" width={80} height={32} />
                <Image src="/logos/apollo.svg" alt="Apollo Pharmacy" className="h-8 sm:h-10 w-auto" width={80} height={32} />
            </div>
        </section>
    );
}