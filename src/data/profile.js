export const profile = {
  name: "Daffa Al-Fathir Ismail",
  shortName: "Daffa",
  title: "Computer Engineering Undergraduate",
  roles: [
    "Web Developer",
    "Machine Learning Developer",
    "Mobile App Developer",
  ],
  university: "Universitas Pendidikan Indonesia — Kampus Cibiru",
  degree: "S1 Teknik Komputer",
  gpa: "3.95",
  summary: [
    "Lulusan Teknik Komputer dari Universitas Pendidikan Indonesia (UPI) Kampus Cibiru dengan keahlian di bidang pengembangan web dan Machine Learning.",
    "Saya menyelesaikan program Studi Independen ASAH by Dicoding di bidang Machine Learning dan meraih penghargaan Best Capstone Project. Saya mempunyai kemampuan dalam bidang jaringan yang ditandai dengan sertifikat MTCNA dari MikroTik. Saya terlibat dalam berbagai project yang mengasah kemampuan teknis dan pemecahan masalah, dan siap berkontribusi dengan semangat belajar yang tinggi, kemampuan beradaptasi, serta dedikasi untuk memberikan hasil terbaik.",
  ],
  languages: ["Bahasa Indonesia", "English", "日本語 (Jepang)"],
  socials: {
    github: "https://github.com/dapakyuu",
    linkedin: "https://www.linkedin.com/in/daffa-al-fathir-ismail/",
    instagram: "https://instagram.com/daffa_alfathir_",
    // Format wa.me wajib kode negara tanpa "0" di depan (62...)
    whatsapp: "https://wa.me/6289636733777",
  },
  // File CV di public/cv. Ganti file-nya dengan nama yang sama untuk memperbarui CV.
  cv: [
    {
      label: "CV Kreatif",
      href: "cv/CV_Daffa_Al-Fathir_Ismail.pdf",
    },
    {
      label: "CV ATS",
      href: "cv/CV_ATS_Daffa_Al-Fathir_Ismail.pdf",
    },
  ],
};

/**
 * Kartu keahlian. Gunakan `image` (gambar di public/assets) atau `icon`
 * (nama ikon di src/components/Skills.jsx).
 */
export const skills = [
  {
    title: "Web Development",
    image: "assets/web_development.png",
    description:
      "Membangun website dinamis dengan integrasi berbagai teknologi backend dan frontend, serta menghubungkannya dengan database.",
    tools: [
      "HTML",
      "CSS",
      "JavaScript",
      "PHP",
      "Laravel",
      "RESTful API",
      "React",
      "MySQL",
      "PostgreSQL",
    ],
  },
  {
    title: "Machine Learning & AI",
    icon: "ml",
    description:
      "Mengembangkan model Machine Learning dan mengintegrasikan komponen AI seperti LLM serta analisis multimodal.",
    tools: [
      "Python",
      "Machine Learning",
      "LLM",
      "Pengolahan Data",
      "Analisis Data",
    ],
  },
  {
    title: "Mobile App Development",
    image: "assets/mobile_development.png",
    description:
      "Mengembangkan aplikasi mobile lintas platform dengan Flutter yang terhubung ke layanan backend.",
    tools: ["Flutter", "Dart", "Java"],
  },
  {
    title: "Game & Jaringan",
    image: "assets/game-dev.png",
    description:
      "Merancang game 2D dengan Godot Engine, serta tersertifikasi MTCNA di bidang jaringan komputer.",
    tools: ["Godot Engine", "MikroTik", "Networking"],
  },
];

export const emailConfig = {
  serviceId: "service_hz2kxy3",
  templateId: "template_j0lt5sd",
  publicKey: "31vPwCJgMopMGqCQT",
};
