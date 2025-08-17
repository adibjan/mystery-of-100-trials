document.getElementById('contactForm')?.addEventListener('submit', function(e){
  e.preventDefault();
  alert('پیام شما ارسال شد! (این فقط شبیه‌سازی است)');
  this.reset();
});
