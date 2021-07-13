module.exports = {
  sendFile: async (req, res) => {
    res.sendFile(`${__dirname}../../public/chat.html`);
  },
};
