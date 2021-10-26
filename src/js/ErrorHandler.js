export default class ErrorHandler {
  constructor(input) {
    this.input = input;
  }

  outputError(message) {
    this.input.insertAdjacentHTML('afterend', `<p class="error">${message}</p>`);
    this.input.disabled = true;
    setTimeout(() => {
      this.input.disabled = false;
      this.input.nextElementSibling.remove();
    }, 2000);
  }
}
