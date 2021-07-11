const chatRoon = (req, res, next) => {
  try {
    return res.status(200).render('index');
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  chatRoon,
};
