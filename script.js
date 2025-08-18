// ===== اسکرول نرم برای لینک‌ها =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== افکت دکمه‌ها =====
document.querySelectorAll('.menu a, .btn').forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    btn.style.color = '#FF6347';
    btn.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
    btn.style.transform = 'translateY(-3px)';
    btn.style.transition = 'all 0.3s ease';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.color = '';
    btn.style.boxShadow = '';
    btn.style.transform = '';
  });
});

// ===== منوی ثابت هنگام اسکرول =====
const header = document.querySelector('header');
const stickyOffset = header.offsetTop;

window.addEventListener('scroll', () => {
  if (window.pageYOffset > stickyOffset) {
    header.classList.add('sticky');
  } else {
    header.classList.remove('sticky');
  }
});

// ===== انیمیشن بخش‌ها =====
const sections = document.querySelectorAll('section, .hero');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
    }
  });
}, { threshold: 0.2 });

sections.forEach(section => observer.observe(section));
