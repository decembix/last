document.addEventListener('DOMContentLoaded', function () {
  const buttons = document.querySelectorAll('.btn');
  const modals = document.querySelectorAll('.modal-box');
  const closeButtons = document.querySelectorAll('.close');

  buttons.forEach(button => {
      button.addEventListener('click', function () {
          const classList = this.classList;
          modals.forEach(modal => {
              classList.forEach(className => {
                  if (modal.classList.contains(className.replace('-btn', '-modal'))) {
                      modal.classList.add('active');
                  }
              });
          });
      });
  });

  closeButtons.forEach(button => {
      button.addEventListener('click', function () {
          const modal = this.closest('.modal-box'); // 가장 가까이 있는 모달박스 선택
          modal.classList.remove('active'); //active 제거
      });
  });
});