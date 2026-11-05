import { useState } from "react";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";
import { FaGithub, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { HiOutlinePaperAirplane } from "react-icons/hi";
import { emailConfig, profile } from "../data/profile";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const EMPTY = { name: "", email: "", phone: "", message: "" };

const swalTheme = {
  background: "#11112a",
  color: "#e7e7f5",
  confirmButtonColor: "#7c5cff",
};

const channels = [
  { label: "WhatsApp", href: profile.socials.whatsapp, icon: FaWhatsapp, note: "Respon paling cepat" },
  { label: "Instagram", href: profile.socials.instagram, icon: FaInstagram, note: "@daffa_alfathir_" },
  { label: "GitHub", href: profile.socials.github, icon: FaGithub, note: "@dapakyuu" },
];

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [sending, setSending] = useState(false);

  const canSubmit = Object.values(form).every((v) => v.trim() !== "") && !sending;

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSending(true);
    try {
      await emailjs.send(
        emailConfig.serviceId,
        emailConfig.templateId,
        {
          from_name: form.name,
          email: form.email,
          no_phone: form.phone,
          message: form.message,
        },
        { publicKey: emailConfig.publicKey },
      );
      Swal.fire({ ...swalTheme, title: "Berhasil!", text: "Pesan kamu sudah terkirim.", icon: "success", confirmButtonText: "Oke" });
      setForm(EMPTY);
    } catch (err) {
      console.error(err);
      Swal.fire({ ...swalTheme, title: "Gagal!", text: "Pesan gagal dikirim, coba lagi atau hubungi via WhatsApp.", icon: "error", confirmButtonText: "Oke" });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        <SectionHeading
          eyebrow="Kontak"
          title="Mari bekerja sama"
          subtitle="Punya ide project, tawaran kerja, atau sekadar ingin menyapa? Kirim pesan di bawah ini."
        />

        <div className="contact-grid">
          <Reveal as="form" className="contact-form glass" onSubmit={onSubmit}>
            <div className="field-row">
              <label className="field">
                <span>Nama</span>
                <input name="name" value={form.name} onChange={onChange} placeholder="Nama kamu" required />
              </label>
              <label className="field">
                <span>Email</span>
                <input type="email" name="email" value={form.email} onChange={onChange} placeholder="nama@email.com" required />
              </label>
            </div>
            <label className="field">
              <span>No. Telepon</span>
              <input type="tel" name="phone" value={form.phone} onChange={onChange} placeholder="08xxxxxxxxxx" inputMode="tel" required />
            </label>
            <label className="field">
              <span>Pesan</span>
              <textarea name="message" rows={5} value={form.message} onChange={onChange} placeholder="Tulis pesanmu di sini..." required />
            </label>
            <button type="submit" className="btn btn-primary btn-block" disabled={!canSubmit}>
              {sending ? (
                <>
                  <span className="spinner" /> Mengirim...
                </>
              ) : (
                <>
                  <HiOutlinePaperAirplane className="rotate-45" /> Kirim Pesan
                </>
              )}
            </button>
          </Reveal>

          <div className="contact-side">
            {channels.map(({ label, href, icon: Icon, note }, i) => (
              <Reveal key={label} delay={i * 100}>
                <a href={href} target="_blank" rel="noreferrer" className={`channel glass channel-${label.toLowerCase()}`}>
                  <span className="channel-icon">
                    <Icon />
                  </span>
                  <span>
                    <strong>{label}</strong>
                    <small>{note}</small>
                  </span>
                </a>
              </Reveal>
            ))}
            <Reveal delay={300} className="contact-art">
              <img src="assets/contact-img.svg" alt="" className="float" loading="lazy" />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
