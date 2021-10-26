import ErrorHandler from './ErrorHandler';

export default class API extends ErrorHandler {
  constructor(baseUrl, modal, input) {
    super(input);
    this.baseUrl = baseUrl;
    this.modal = modal;
    this.contentTypeHeader = { 'Content-Type': 'application/json' };
  }

  connection() {
    fetch(`${this.baseUrl}/ping`).then(
      () => {
        this.modal.classList.add('active');
      },
      () => {
        this.connection();
      },
    );
  }

  add(user) {
    this.input.disabled = true;
    return fetch(`${this.baseUrl}/users`, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: this.contentTypeHeader,
    }).then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    }).catch((response) => {
      this.input.placeholder = '';
      if (response.message === 'Failed to fetch') {
        this.outputError('Такое имя уже занято');
      } else {
        this.outputError(`${response.message}`);
      }
    });
  }
}
