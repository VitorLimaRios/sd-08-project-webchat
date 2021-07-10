const chatController = async (req, res) => {
  try {
    return res.status(200).render('../views/chat.ejs');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  chatController,
};