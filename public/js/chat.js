class Chat {
  constructor() {
    this.user = '';
    this.message = '';
    this.contentMessage = '';
    this.nickName = '';
    this.usersOnline = [];
    this.socket = window.io();

    this.getMessage = this.getMessage.bind(this);
    this.setNickName = this.setNickName.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.addEventBtnGetMessage = this.addEventBtnGetMessage.bind(this);
    this.addEventBtnSaveMyName = this.addEventBtnSaveMyName.bind(this);
    this.onMessage = this.onMessage.bind(this);

    this.onMessage();
    this.addEventBtnGetMessage();
    this.addEventBtnSaveMyName();
    Chat.eventScrolled();
  }
  
  getMessage() {
    const message = document.getElementById('text-message');
    this.message = message.value;
  }

  setNickName() {
    const saveName = document.getElementById('setMyName');
    this.nickName = saveName.value;
  }

  static setMessageChat(date, nickName, message) {
    const getChat = document.getElementById('container-web-chat');
    const createContainerMessage = (
      `<div class="container-message">
        <div class="date-message">
          <span>${date}</span>
        </div>
        <div class="name-user">
          <span>${nickName}</span>
        </div>
        <div class="content-message">
          <p>${message}</p>
        </div>
      </div>`
    );
    getChat.insertAdjacentHTML('beforeend', createContainerMessage);
  }

  addEventBtnSaveMyName() {
    const getName = document.getElementById('saveMyName');
    getName.addEventListener('click', this.setNickName);
  }

  sendMessage() {
    this.getMessage();
    this.socket.emit('message', {
      chatMessage: this.message,
      nickname: this.nickName });
  }
    
  static splitMessage(message) {
    const cutDateRegex = new RegExp(/\d{1,2}-\d{1,2}-\d{4}/y);
    const cutDate = message.match(cutDateRegex);
    
    const cutHoursRegex = new RegExp(/\d{1,2}:\d{1,2}(:\d{0,2})?\s(PM|AM)?/gm);
    const cutHours = message.match(cutHoursRegex);
    
    const cutNameRegex = new RegExp(/(^.*\s-)+([\w\s]*:)/);
    const cutName = message.match(cutNameRegex);
    console.log(cutName);
    const replacerName = cutName[2].replace(cutName[2][0], '').replace(':', '');
    console.log(replacerName);

    const cutMessageRegex = new RegExp(/((^.*-\s[\w\s\S]*?:)[\s\S.]*?)$/);
    const cutMessage = message.match(cutMessageRegex);
    console.log(cutMessage);
    const replCutMessage = message.replace(`${cutMessage[2]} `, '');
    
    return { date: `${cutDate} ${cutHours}`, message: replCutMessage, nickname: replacerName };
  }

  addEventBtnGetMessage() {
    const getMessage = document.getElementById('send-message-chat');
    getMessage.addEventListener('click', () => this.sendMessage());
  }

  // addEventNewMessageChat() {}

  static eventScrolled() {
    const element = document.getElementById('container-web-chat');
    if (element.scrollTop + element.clientHeight !== element.scrollHeight) {
      element.scrollTop = element.scrollHeight;
    }
  }

  onMessage() {
    console.log(this.nickName);
    this.socket.on('message', (message) => {
      const data = Chat.splitMessage(message);
      Chat.setMessageChat(data.date, data.nickname, data.message);
      Chat.eventScrolled();
    });
  }
}

export default new Chat();