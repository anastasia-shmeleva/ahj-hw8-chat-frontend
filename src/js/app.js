import ErrorHandler from './ErrorHandler';
import API from './API';
import TemplateEngine from './TemplateEngine';

const modal = document.querySelector('.modal');
const form = modal.querySelector('.modal__form');
const formInput = form.querySelector('.modal__form-input');
const chat = document.querySelector('.chat');
const chatInput = chat.querySelector('.chat__input');
const messagesContainer = chat.querySelector('.chat__messages__container');
const messages = chat.querySelector('.chat__messages');

const errorHandler = new ErrorHandler(formInput);

const baseUrl = 'ahj-hw8-chat.herokuapp.com';

const api = new API(`http://${baseUrl}`, modal, formInput);
api.connection();

form.onsubmit = (event) => {
  event.preventDefault();

  const { value } = formInput;
  if (!value || !value.trim()) {
    formInput.value = '';
    errorHandler.outputError('Пожалуйста, введите имя');
    return;
  }

  const nickname = value.trim();
  formInput.value = '';

  (async () => {
    // register new user
    const response = await api.add({ name: nickname });

    if (response) {
      // if nickname is valid - open ws connection
      const ws = new WebSocket(`ws://${baseUrl}`);

      ws.addEventListener('open', () => {
        chatInput.disabled = false;
        chatInput.placeholder = 'Введите сообщение';
      });

      // close modal
      modal.classList.remove('active');

      // open users list
      const usersContainer = document.querySelector('.users-list__container');
      const usersList = usersContainer.querySelector('.users-list');
      usersContainer.classList.add('active');

      // open chat
      chat.classList.add('active');
      chatInput.value = '';
      chatInput.focus();

      // add chat actions
      chatInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
          const { value: message } = chatInput;
          if (!message || !message.trim()) {
            chatInput.value = '';
            return;
          }

          const newMessage = JSON.stringify(
            {
              author: nickname,
              message: message.trim(),
            },
          );
          ws.send(newMessage);
          chatInput.value = '';
        }
      });

      document.onclick = (e) => {
        if (!e.target.closest('.chat')) {
          chatInput.value = '';
        }
      };

      // handle server response on message
      ws.addEventListener('message', (e) => {
        const data = JSON.parse(e.data);

        if (Array.isArray(data)) {
          // refresh users list
          usersList.textContent = '';
          usersList.insertAdjacentHTML('beforeend', TemplateEngine.getUsersHTML(data, nickname));
        } else if (typeof data === 'object') {
          // add message
          TemplateEngine.addMessage(messages, data, nickname, messagesContainer);
        }
      });

      ws.addEventListener('close', () => {
        chatInput.disabled = true;
        chatInput.placeholder = 'Соединение прервано';
      });
    }
  })();
};
