
// Fungsi Carousel
const lintasanKarousel = document.getElementById('carouselTrack');
const slide = document.querySelectorAll('.carousel-slide');
const panahKiri = document.getElementById('arrowLeft');
const panahKanan = document.getElementById('arrowRight');
const tombolPortofolio = document.getElementById('portfolioBtn');

let slideAktual = 0;
let intervalFlipOtomatis;

function perbaruhiKarousel() {
    slide.forEach((carousel, index) => {
        if (index === slideAktual) {
            carousel.classList.add('active');
        } else {
            carousel.classList.remove('active');
        }
    });
}

function slideBerikutnya() {
    slideAktual = (slideAktual + 1) % slide.length;
    perbaruhiKarousel();
}

function mulaiFlipOtomatis() {
    intervalFlipOtomatis = setInterval(slideBerikutnya, 3000);
}

function hentikanFlipOtomatis() {
    clearInterval(intervalFlipOtomatis);
}

// Mulai auto-flip saat halaman dimuat
mulaiFlipOtomatis();

// Hentikan auto-flip saat user klik panah, kemudian mulai ulang setelah 5 detik
panahKiri.addEventListener('click', () => {
    hentikanFlipOtomatis();
    slideAktual = (slideAktual - 1 + slide.length) % slide.length;
    perbaruhiKarousel();
    setTimeout(mulaiFlipOtomatis, 5000);
});

panahKanan.addEventListener('click', () => {
    hentikanFlipOtomatis();
    slideAktual = (slideAktual + 1) % slide.length;
    perbaruhiKarousel();
    setTimeout(mulaiFlipOtomatis, 5000);
});

// Tombol portofolio scroll ke bagian layanan
tombolPortofolio.addEventListener('click', () => {
    const bagianLayanan = document.getElementById('about');
    bagianLayanan.scrollIntoView({ behavior: 'smooth' });
});
