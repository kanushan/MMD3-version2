const slides = document.querySelectorAll('.slide');
    const fills = document.querySelectorAll('.fill');
    let current = 0;

    function nextSlide() {
      fills[current].style.width = '0%';
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
      setTimeout(() => animateFill(), 100);
    }

    function animateFill() {
      fills[current].style.width = '100%';
      setTimeout(() => {
        fills[current].style.transition = 'none';
        fills[current].style.width = '0%';
        void fills[current].offsetWidth;
        fills[current].style.transition = 'width 5s linear';
        nextSlide();
      }, 5000);
    }

    animateFill(); // start on load


// const slides = document.querySelectorAll('.slide');
// const fills = document.querySelectorAll('.fill');
// let current = 0;
// const duration = 5000;

// function showSlide(index) {
//   slides.forEach((s, i) => s.classList.toggle('active', i === index));
//   fills.forEach((f, i) => f.style.width = i === index ? '100%' : '0%');
// }

// function nextSlide() {
//   current = (current + 1) % slides.length;
//   showSlide(current);
// }

// function startSlideshow() {
//   showSlide(current);
//   setInterval(() => {
//     nextSlide();
//   }, duration);
// }

// startSlideshow();
