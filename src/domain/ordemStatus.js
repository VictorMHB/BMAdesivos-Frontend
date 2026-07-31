export const STATUS_ORDEM = {
  PENDENTE: "PENDENTE",
  EM_PRODUCAO: "EM_PRODUCAO",
  CONCLUIDO: "CONCLUIDO",
  CANCELADO: "CANCELADO",
  ARQUIVADO: "ARQUIVADO",
};


export const FLUXO_STATUS = [
  STATUS_ORDEM.PENDENTE,
  STATUS_ORDEM.EM_PRODUCAO,
  STATUS_ORDEM.CONCLUIDO,
];

export const podeAvancarPara = (statusAtual, novoStatus) => {
  const indexAtual = FLUXO_STATUS.indexOf(statusAtual);
  const indexNovo = FLUXO_STATUS.indexOf(novoStatus);
  if (indexAtual === -1 || indexNovo === -1) return false;
  return indexNovo === indexAtual + 1;
};

export const podeMoverOrdem = (status) =>
  status === STATUS_ORDEM.PENDENTE || status === STATUS_ORDEM.EM_PRODUCAO;

export const podeCancelarOrdem = podeMoverOrdem;

export const podeArquivarOrdem = (status) => status === STATUS_ORDEM.CONCLUIDO;