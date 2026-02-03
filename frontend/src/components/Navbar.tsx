import Image from "next/image";
import logo from "../../assets/images/logo.png";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <Image src={logo} alt="Medgency" height={28} />
      </div>

      <div className="nav-right">
        <a href="#">About Us</a>
        <a href="#">Help</a>
        <button className="btn-outline">Login</button>
        <button className="btn-primary">Sign-up</button>
      </div>
    </nav>
  );
}
