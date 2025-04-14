import "./styles/main.css";
import "./styles/fixedNav.css";
import "./styles/slide1.css";
import "./styles/slide2.css";
import "./styles/slide3.css";

document.addEventListener("DOMContentLoaded", () => {
  const sliderWrapper = document.querySelector(".slider-wrapper");
  const slides = document.querySelectorAll(".slide");
  const title = document.querySelector(".logo-icon");
  const nextButton = document.querySelector(".slide-1-next-button");
  const scrollContainer = document.querySelector(".message-scroll");
  const scrollThumb = document.querySelector(".scroll-thumb");

  let currentSlide = 0;
  const totalSlides = slides.length;
  let slideWidth = slides[0].offsetWidth;

  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let isDragging = false;

  let isDraggingThumb = false;
  let startY = 0;
  let startScrollTop = 0;

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

    // Запуск всплытия элементов на слайде 2
    const floatingWrapper = document.querySelector(
      ".slide-2-floating-elements",
    );
    if (index === 1) {
      setTimeout(() => {
        floatingWrapper.classList.add("active");
      }, 500);
    } else if (floatingWrapper.classList.contains("active")) {
      setTimeout(() => {
        floatingWrapper.classList.remove("active");
      }, 500);
    }
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

  // Переход с заголовка на первый слайд
  title.addEventListener("click", () => {
    goToSlide(0);
  });

  // Переход на второй слайд по нажатию кнопки
  nextButton.addEventListener("click", () => {
    goToSlide(1);
  });

  // Инициализация первого слайда
  goToSlide(0);

  // Начало перетаскивания ползунка
  function startDragging(y) {
    isDraggingThumb = true;
    startY = y;
    startScrollTop = scrollContainer.scrollTop;
    document.body.style.userSelect = "none";
  }

  // Обновление позиции ползунка
  function updateThumbPosition() {
    const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
    const thumbHeight = scrollThumb.offsetHeight;
    const trackHeight = clientHeight - thumbHeight;
    const scrollPercent = scrollTop / (scrollHeight - clientHeight);
    const thumbTop = scrollPercent * trackHeight - 10;
    scrollThumb.style.top = `${thumbTop}px`;
  }

  // Обработка перемещения ползунка
  function onDragging(y) {
    if (!isDraggingThumb) return;
    const deltaY = y - startY;
    const { scrollHeight, clientHeight } = scrollContainer;
    const maxScroll = scrollHeight - clientHeight;
    let thumbHeight = scrollThumb.offsetHeight;
    const trackHeight = clientHeight - thumbHeight;
    const scrollDelta = (deltaY / trackHeight) * maxScroll;
    scrollContainer.scrollTop = startScrollTop + scrollDelta;
  }

  // Остановка перемещения
  function stopDragging() {
    isDraggingThumb = false;
    document.body.style.userSelect = "";
  }

  // Сенсор
  scrollThumb.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) {
      startDragging(e.touches[0].clientY);
    }
  });
  document.addEventListener("touchmove", (e) => {
    if (e.touches.length === 1) {
      onDragging(e.touches[0].clientY);
    }
  });
  document.addEventListener("touchend", stopDragging);

  // Мышь
  scrollContainer.addEventListener("scroll", updateThumbPosition);
  scrollThumb.addEventListener("mousedown", (e) => {
    startY = e.clientY;
    startScrollTop = scrollContainer.scrollTop;
    isDraggingThumb = true;
  });
  scrollThumb.ondragstart = () => false;
  document.addEventListener("mousemove", (e) => onDragging(e.clientY));
  document.addEventListener("mouseup", stopDragging);
});
