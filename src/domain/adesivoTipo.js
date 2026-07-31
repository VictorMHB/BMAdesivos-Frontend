const LABELS_TIPO_ADESIVO = {
  ETIQUETA_METALICA: "ETIQUETA METÁLICA",
  ADESIVO_COMUM: "ADESIVO COMUM",
  ADESIVO_RESINADO: "ADESIVO RESINADO",
};

const CORES_TIPO_ADESIVO = {
  ETIQUETA_METALICA: "bg-gray-100 text-gray-600",
  ADESIVO_COMUM: "bg-light-blue text-blue",
  ADESIVO_RESINADO: "bg-yellow-100 text-yellow-700",
};

export const formatarTipoAdesivo = (tipo) => LABELS_TIPO_ADESIVO[tipo] || tipo;

export const badgeTipoAdesivo = (tipo) =>
  CORES_TIPO_ADESIVO[tipo] || "bg-gray-100 text-gray-600";