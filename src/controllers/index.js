module.exports = {
  sendFile: async (req, res) => {
    res.sendFile(`${__dirname}../../view/chat.html`);
  },
};
