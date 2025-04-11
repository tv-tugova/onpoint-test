import "./styles/main.css";
import "./styles/fixedNav.css";

document.addEventListener("DOMContentLoaded", () => {
  const sliderWrapper = document.querySelector(".slider-wrapper");
  const slides = document.querySelectorAll(".slide");

  let currentSlide = 0;
  const totalSlides = slides.length;
  let slideWidth = slides[0].offsetWidth;

  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let isDragging = false;

  // Задание координаты слайда
  function setSliderPosition() {
    sliderWrapper.style.transform = `translateX(${currentTranslate}px)`;
  }

  // Переход к конкретному слайду
  function goToSlide(index) {
    slideWidth = slides[0].offsetWidth; // пересчет всегда
    currentSlide = Math.max(0, Math.min(index, totalSlides - 1));
    currentTranslate = -slideWidth * currentSlide;
    prevTranslate = currentTranslate;
    setSliderPosition();
  }

  function getPositionX(event) {
    return event.type.includes("mouse")
      ? event.pageX
      : event.touches[0].clientX;
  }

  // Начало свайпа
  function touchStart() {
    return (event) => {
      isDragging = true;
      startX = getPositionX(event);
    };
  }

  // Обработка перемещения
  function touchMove(event) {
    if (!isDragging) return;
    const currentPosition = getPositionX(event);
    const deltaX = currentPosition - startX;
    currentTranslate = prevTranslate + deltaX;
    const maxTranslate = 0;
    const minTranslate = -slideWidth * (totalSlides - 1);
    currentTranslate = Math.min(
      maxTranslate,
      Math.max(currentTranslate, minTranslate),
    );

    setSliderPosition();
  }

  // Завершение свайпа
  function touchEnd() {
    isDragging = false;
    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -100 && currentSlide < totalSlides - 1) currentSlide += 1;
    if (movedBy > 100 && currentSlide > 0) currentSlide -= 1;

    goToSlide(currentSlide);
  }

  // Сенсор
  sliderWrapper.addEventListener("touchstart", touchStart());
  sliderWrapper.addEventListener("touchmove", touchMove);
  sliderWrapper.addEventListener("touchend", touchEnd);

  // Мышь
  sliderWrapper.addEventListener("mousedown", touchStart());
  sliderWrapper.addEventListener("mousemove", touchMove);
  sliderWrapper.addEventListener("mouseup", touchEnd);
  sliderWrapper.addEventListener("mouseleave", () => {
    if (isDragging) touchEnd();
  });

  // Инициализация первого слайда
  goToSlide(0);
});
