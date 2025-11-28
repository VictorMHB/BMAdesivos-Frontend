export const formatarDoc = (doc) => {
  if (!doc) return "";

  const v = doc.replace(/\D/g, "");

  if (v.length <= 11) {
    return v.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  } else {
    return v.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  }
};

export const formatarTelefone = (tel) => {
  if (!tel) return "";

  const v = tel.replace(/\D/g, "");

  if (v.length > 10) {
    return v.replace(/^(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2 $3-$4");
  } else {
    return v.replace(/^(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
};

export const formatarCep = (cep) => {
  if (!cep) return "";

  const v = cep.replace(/\D/g, "");

  return v.replace(/^(\d{5})(\d{3})/, "$1-$2");
};
