class CargaAtualizada {
  final String itemFichaId;
  final double cargaAnterior;
  final double cargaNova;

  const CargaAtualizada({
    required this.itemFichaId,
    required this.cargaAnterior,
    required this.cargaNova,
  });

  factory CargaAtualizada.fromJson(Object? json) {
    return switch (json) {
      {
        'itemFichaId': final String itemFichaId,
        'cargaAnterior': final num cargaAnterior,
        'cargaSugeridaNova': final num cargaNova,
      } =>
        CargaAtualizada(
          itemFichaId: itemFichaId,
          cargaAnterior: cargaAnterior.toDouble(),
          cargaNova: cargaNova.toDouble(),
        ),
      _ => throw FormatException(
        'Carga atualizada em formato inesperado: $json',
      ),
    };
  }
}
