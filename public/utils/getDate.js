module.exports = () => {
  const d = new Date().toLocaleString('pt-BR');
  const numbers = d.split(' ')[0].split('-');
  return `${numbers[2]}-${numbers[1]}-${numbers[0]} ${d.split(' ')[1]}`;
};