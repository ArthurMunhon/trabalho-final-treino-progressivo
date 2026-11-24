import 'exercicio.dart';

enum TipoExercicio { forca, cardio }

class ItemFicha {
  final String id;
  final int ordem;

  // Catálogo OU personalizado
  final Exercicio? exercicio;
  final String? nomePersonalizado;

  final TipoExercicio tipo;

  // Força
  final int? seriesAlvo;
  final int? repeticoesAlvo;
  final double? cargaSugerida;

  // Cardio
  final int? duracaoMin;
  final double? velocidadeKmh;
  final double? inclinacaoPct;

  const ItemFicha({
    required this.id,
    required this.ordem,
    this.exercicio,
    this.nomePersonalizado,
    this.tipo = TipoExercicio.forca,
    this.seriesAlvo,
    this.repeticoesAlvo,
    this.cargaSugerida,
    this.duracaoMin,
    this.velocidadeKmh,
    this.inclinacaoPct,
  });

  /// Nome que aparece na tela: do catálogo ou o personalizado.
  String get nome => exercicio?.nome ?? nomePersonalizado ?? 'Exercício';

  /// Meta definida pelo personal, em texto.
  String get alvo {
    if (tipo == TipoExercicio.cardio) {
      return '$duracaoMin min · $velocidadeKmh km/h · $inclinacaoPct%';
    }
    return '${seriesAlvo}x$repeticoesAlvo · $cargaSugerida kg';
  }

  factory ItemFicha.fromJson(Object? json) {
    return switch (json) {
      {
      'id': final String id,
      'ordem': final int ordem,
      'tipo': final String tipo,
      'exercicio': final Object? exercicio, // null quando é personalizado
      'nomePersonalizado': final String? nomePersonalizado,
      'seriesAlvo': final int? seriesAlvo,
      'repeticoesAlvo': final int? repeticoesAlvo,
      'cargaSugerida': final num? cargaSugerida, // JSON manda 40, não 40.0
      'duracaoMin': final int? duracaoMin,
      'velocidadeKmh': final num? velocidadeKmh,
      'inclinacaoPct': final num? inclinacaoPct,
      } =>
          ItemFicha(
            id: id,
            ordem: ordem,
            tipo: TipoExercicio.values.byName(tipo), // 'forca' | 'cardio'
            exercicio: exercicio == null ? null : Exercicio.fromJson(exercicio),
            nomePersonalizado: nomePersonalizado,
            seriesAlvo: seriesAlvo,
            repeticoesAlvo: repeticoesAlvo,
            cargaSugerida: cargaSugerida?.toDouble(),
            duracaoMin: duracaoMin,
            velocidadeKmh: velocidadeKmh?.toDouble(),
            inclinacaoPct: inclinacaoPct?.toDouble(),
          ),
      _ => throw FormatException('Item da ficha em formato inesperado: $json'),
    };
  }
}
