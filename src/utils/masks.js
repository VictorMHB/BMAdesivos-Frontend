export const maskDoc = (doc) => {
  let v = doc.replace(/\D/g, "");

  if (v.length <= 11) {
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  } else {
    v = v.replace(/^(\d{2})(\d)/, "$1.$2");
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
    v = v.replace(/(\d{4})(\d)/, "$1-$2");
  }

  return v;
};

export const maskTelefone = (value) => {
  let v = value.replace(/\D/g, "");

  if (v.length > 10) {
    v = v.replace(/^(\d{2})(\d)/, "($1) $2");
    v = v.replace(/^(\(\d{2}\) \d)(\d{4})/, "$1 $2");
    v = v.replace(/(\d{4})(\d)/, "$1-$2");

    
  } else {
    v = v.replace(/^(\d{2})(\d)/, "($1) $2");
    v = v.replace(/(\d{4})(\d)/, "$1-$2");
  }

  return v;
};

export const maskCep = (cep) => {
  let v = cep.replace(/\D/g, "");
  v = v.replace(/^(\d{5})(\d)/, "$1-$2");
  return v;
};
