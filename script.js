// Smooth entrance without hiding or delay problem
gsap.from(".title", { duration: 1, y: -30, opacity: 0 });
gsap.from(".subtitle", { duration: 1, y: -20, opacity: 0, delay: 0.2 });
gsap.from(".desc", { duration: 1, y: 20, opacity: 0, delay: 0.4 });
gsap.from(".get-started", { duration: 0.8, y: 20, opacity: 1, delay: 0.6 }); // 🟢 Fixed: removed scale: 0
gsap.from(".stats", { duration: 1, y: 30, opacity: 0, delay: 0.8 });


// Button Click Event
document.querySelector(".get-started").addEventListener("click", function () {
  window.location.href = "../userdata/index.html";
});
