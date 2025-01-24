document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();

      navLinks.forEach(function (l) {
        l.classList.remove("active");
      });

      this.classList.add("active");
      const targetSection = document.querySelector(this.getAttribute("href"));

      targetSection.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  });

  function updateActiveLink() {
    const sections = document.querySelectorAll("section");

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (
        window.pageYOffset >= sectionTop &&
        window.pageYOffset < sectionTop + sectionHeight
      ) {
        const sectionId = section.getAttribute("id");

        const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
        navLinks.forEach(function (link) {
          link.classList.remove("active");
        });
        activeLink.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveLink);

  // Tambahkan kode untuk mengatur indikator custom
  const carousel = document.getElementById("carouselExample");
  const indicators = document.querySelectorAll(
    ".carousel-indicators-custom button"
  );

  carousel.addEventListener("slide.bs.carousel", function (event) {
    // Hapus class active dari semua indikator
    indicators.forEach((indicator) => {
      indicator.classList.remove("active");
      indicator.removeAttribute("aria-current");
    });

    // Tambah class active ke indikator yang sesuai
    const slideIndex = event.to;
    indicators[slideIndex].classList.add("active");
    indicators[slideIndex].setAttribute("aria-current", "true");
  });

  // Form handling
  const form = document.getElementById("form-contact");
  const inputs = form.querySelectorAll("input[required], textarea[required]");
  const submitButton = document.getElementById("btn_submit");

  function checkInputs() {
    let allFilled = true;
    inputs.forEach((input) => {
      if (input.value.trim() === "") {
        allFilled = false;
      }
    });
    submitButton.disabled = !allFilled;
  }

  inputs.forEach((input) => {
    input.addEventListener("input", checkInputs);
  });

  // Form submit handler
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const templateParams = {
      from_name: document.getElementById("input1").value,
      email: document.getElementById("input2").value,
      message: document.getElementById("input4").value,
      no_phone: document.getElementById("input3").value,
    };

    emailjs
      .send("service_hz2kxy3", "template_j0lt5sd", templateParams)
      .then(() => {
        Swal.fire({
          title: "Berhasil!",
          text: "Email berhasil terkirim!",
          icon: "success",
          confirmButtonText: "Oke",
        });
        form.reset();
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          title: "Gagal!",
          text: "Gagal mengirim email!",
          icon: "error",
          confirmButtonText: "Oke",
        });
      });
  });
});
