
// Carga recalculada de um item da ficha, devolvida ao finalizar a sessão
// (sobrecarga progressiva: o cálculo é do backend, o app só mostra)
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
      'cargaAnterior': final num cargaAnterior, // JSON manda 40, não 40.0
      'cargaSugeridaNova': final num cargaNova,
      } =>
          CargaAtualizada(
            itemFichaId: itemFichaId,
            cargaAnterior: cargaAnterior.toDouble(),
            cargaNova: cargaNova.toDouble(),
          ),
      _ => throw FormatException('Carga atualizada em formato inesperado: $json'),
    };
  }
}