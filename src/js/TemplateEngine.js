export default class TemplateEngine {
  static getUsersHTML(data, nickname) {
    let html = '';

    data.forEach((userName) => {
      html += `
          <li class="users-list__user ${userName === nickname ? 'current' : ''}">${userName === nickname ? 'You' : userName}</li>
        `;
    });

    return html;
  }

  static getTime() {
    const date = new Date();

    const options = { dateStyle: 'short', timeStyle: 'short' };

    const formattedDate = new Intl.DateTimeFormat('ru-RU', options)
      .format(date)
      .split(',')
      .reverse()
      .join(' ');

    return formattedDate;
  }

  static addMessage(messages, data, nickname, messagesContainer) {
    const time = this.getTime();

    messages.insertAdjacentHTML('beforeend', `
        <div class="message ${data.author === nickname ? 'current' : ''}">
          <div class="message__header">${data.author === nickname ? 'You' : data.author}, ${time}</div>
          <div class="message__text">${data.message}</div>
        </div>
      `);

    messagesContainer.scrollTo(0, messagesContainer.scrollHeight);
  }
}
