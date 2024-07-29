import geolocation from "./geolocation";
import Post from "./Post";
import Modal from "./Modal";

export default class Timeline {
  constructor(container) {
    this.container = container;
  }

  init() {
    this.bindToDOM();
    this.registerEvents();
    this.modal = new Modal(this.container);
    this.modal.init();
    this.subscribeEvents();
  }

  bindToDOM() {
    const template = this.markup();
    this.container.insertAdjacentHTML("afterbegin", template);
    this.tlContent = this.container.querySelector(".tl__content");
  }

  markup() {
    return `
      <div class='tl-container'>
        <div class='tl__header'>
          <h1 class='tl__title'>График</h1>
        </div>
        <div class='tl__content'></div>
        <div class='tl__footer'>
          <div class='input__container'>
            <input class='input__field' type='text' placeholder='Пожалуйста, введите ваше сообщение...'>
          </div>
        </div>
      </div>
    `;
  }

  registerEvents() {
    const input = this.container.querySelector(".input__field");
    input.addEventListener("keydown", (event) => {
      if (event.keyCode === 13) {
        this.addPostHandler(event);
      }
    });
  }

  async addPostHandler(event) {
    const coordinates = await this.coordinates();
    if (coordinates) {
      this.addPost(
        coordinates.coords.latitude,
        coordinates.coords.longitude,
        event.target.value,
      );
    } else {
      this.currentValue = event.target.value;
    }
    event.target.value = "";
  }

  async coordinates() {
    try {
      return await geolocation();
    } catch (err) {
      this.modal.showModal(err);
      return null;
    }
  }

  addPost(latitude, longitude, message = this.currentValue) {
    const newPost = new Post(message, `[${latitude}, ${longitude}]`);
    this.tlContent.insertAdjacentHTML("afterbegin", newPost.markup());
    this.currentValue = null;
  }

  subscribeEvents() {
    this.modal.addSubmitListener(this.addPost.bind(this));
  }
}
