export default function Footer() {
  return (
    <footer className="bg-[#062C3F] text-white px-12 py-16 flex justify-between">
      <div>
        <h3 className="text-xl font-semibold">MEDGENCY</h3>
        <p className="mt-2 text-sm">
          Life-saving connections, one click away.
        </p>
      </div>

      <div className="flex gap-24">
        <div className="flex flex-col gap-2">
          <h4 className="font-semibold mb-2">Useful links</h4>
          <span>Home</span>
          <span>Hospital</span>
          <span className="text-red-400">Emergency</span>
          <span>About Us</span>
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="font-semibold mb-2">Services</h4>
          <span>Blood Donation</span>
          <span>Scheduled Delivery</span>
          <span className="text-red-400">Emergency SOS</span>
          <span>24/7 Support</span>
        </div>
      </div>
    </footer>
  );
}
