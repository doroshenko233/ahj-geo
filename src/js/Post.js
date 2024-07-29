export default class Post {
  constructor(message, coordinates) {
    this.message = message;
    this.coordinates = coordinates;
  }

  markup() {
    const sourceDate = new Date();
    const date = `${sourceDate.toLocaleDateString()} ${sourceDate
      .toLocaleTimeString()
      .slice(0, 5)}`;

    return `
        <div class="post" data-post-id="${Date.now()}">
          <div class="post__header">${date}</div>
          <div class="post__body">
            <div class="post__text">${this.message}</div>
          </div>
          <div class="post__coordinates">
            <span class="post__icon"></span>
            <span class="post__description">${this.coordinates}</span>
          </div>
        </div>
      `;
  }
}
