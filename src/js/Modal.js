export default class Modal {
  constructor(container) {
    this.container = container;
    this.submitListener = [];
  }

  init() {
    this.bindToDOM();
    this.subscribeOnEvents();
  }

  bindToDOM() {
    const template = this.markup();
    this.container.insertAdjacentHTML("afterbegin", template);
    this.formElement = this.container.querySelector(".modal__form");
    this.modalElement = this.container.querySelector(".modal");
    this.modalOkElement = this.container.querySelector(".modal__ok");
    this.modalCloseElement = this.container.querySelector(".modal__close");
  }

  markup() {
    return `
        <div class='modal'>
          <div class='modal__background'></div>
          <div class='modal__content'>
            <div class='modal__header'>Information!</div>
            <div class='modal__body'>
              <div class='modal__text'>
                К сожалению, нам не удалось определить ваше местоположение, пожалуйста, дайте разрешение. 
                использовать геолокацию или ввести координаты вручную.
              </div>
              <form class='modal__form' name='modal-form'>
                <div class='form__group'>
                  <label class='form__label' for='username-field'>
                    Широта и долгота, разделенные запятыми.
                  </label>
                  <input class='form__input' name='coordinates' placeholder='Пожалуйста, введите ваши координаты...'>
                  <div class='form__hint hidden'></div>
                </div>
              </form>
            </div>
            <div class='modal__footer'>
              <div class='modal__close'>Close</div>
              <div class='modal__ok'>Ok</div>
            </div>
          </div>
        </div>
      `;
  }

  subscribeOnEvents() {
    this.formElement.addEventListener("submit", (event) => this.submit(event));
    this.modalOkElement.addEventListener("click", (event) =>
      this.submit(event),
    );
    this.modalCloseElement.addEventListener("click", () => this.close());
  }

  submit(event) {
    event.preventDefault();
    const { formElement } = this;
    if (formElement.elements.coordinates.value === "") {
      return;
    }
    const normalizeData = formElement.elements.coordinates.value.split(",");
    const coordsIsValid = this.validateInput(
      formElement.elements.coordinates.value,
    );
    if (coordsIsValid) {
      this.hideHint();
      this.modalElement.querySelector(".modal__header").textContent = "";
      this.manualCoords = [normalizeData[0], normalizeData[1]];
      this.onSubmit(this.manualCoords[0], this.manualCoords[1]);
      this.close();
    } else {
      this.showHint("Введите координаты следующего типа: 00.00000, 0.00000");
    }
  }

  validateInput(value) {
    const templateRegExp =
      /^\[?([-+]?\d{1,2}[.]\d+),\s*([-+]?\d{1,3}[.]\d+)\]?$/gm;
    return templateRegExp.test(value);
  }

  close() {
    this.clearForm();
    this.modalElement.classList.remove("active");
  }

  showModal() {
    this.modalElement.classList.add("active");
  }

  clearForm() {
    this.formElement.elements.coordinates.value = "";
  }

  showHint(message) {
    const hintElement = this.formElement.querySelector(".form__hint");
    hintElement.textContent = message;
    hintElement.classList.remove("hidden");
  }

  hideHint() {
    const hintElement = this.formElement.querySelector(".form__hint");
    hintElement.textContent = "";
    hintElement.classList.add("hidden");
  }

  addSubmitListener(callback) {
    this.submitListener.push(callback);
  }

  onSubmit(data1, data2) {
    this.submitListener.forEach((o) => o.call(null, data1, data2));
  }
}
