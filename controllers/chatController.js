const getAll = async (_req, res) => {
    await res.render('chat');
};

module.exports = {
    getAll,
};