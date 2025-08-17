// اسکرول نرم برای لینک‌ها
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// افکت تغییر رنگ دکمه‌ها هنگام هاور (JS برای تمرین)
document.querySelectorAll('.menu a').forEach(btn => {
  btn.addEventListener('mouseenter', () => btn.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)');
  btn.addEventListener('mouseleave', () => btn.style.boxShadow = 'none');
});
