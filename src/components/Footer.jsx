import { FaGithub, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { HiArrowUp } from "react-icons/hi";
import { profile } from "../data/profile";

export default function Footer() {
  const { github, instagram, whatsapp } = profile.socials;
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>
          © {new Date().getFullYear()} {profile.name}. Dibuat dengan React.
        </p>
        <div className="footer-socials">
          <a href={github} target="_blank" rel="noreferrer" aria-label="GitHub"><FaGithub /></a>
          <a href={instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a>
          <a href={whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp"><FaWhatsapp /></a>
          <a href="#home" aria-label="Kembali ke atas" className="to-top"><HiArrowUp /></a>
        </div>
      </div>
    </footer>
  );
}
