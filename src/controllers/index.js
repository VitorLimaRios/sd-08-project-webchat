const chatRoon = (__req, res, __next) => {
    return res.status(200).render('index');
};

module.exports = {
  chatRoon,
};
