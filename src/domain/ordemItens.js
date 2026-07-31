export const calcularResumoItens = (itens = []) => {
  const totalUnidades = itens.reduce((acc, i) => acc + i.quantidade, 0);
  const tiposUnicos = [...new Set(itens.map((i) => i.tipoAdesivo))];
  return { totalUnidades, tiposUnicos };
};