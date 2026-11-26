import 'exercicio.dart';

enum TipoExercicio { forca, cardio }

class ItemFicha {
  final String id;
  final int ordem;

  final Exercicio? exercicio;
  final String? nomePersonalizado;

  final TipoExercicio tipo;

  final int? seriesAlvo;
  final int? repeticoesAlvo;
  final double? cargaSugerida;

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

  String get nome => exercicio?.nome ?? nomePersonalizado ?? 'Exercício';

  // monta o texto do alvo só com o que o personal preencheu
  String get alvo {
    if (tipo == TipoExercicio.cardio) {
      return [
        '$duracaoMin min',
        if (velocidadeKmh != null) '$velocidadeKmh km/h',
        if (inclinacaoPct != null) '$inclinacaoPct%',
      ].join(' · ');
    }
    return [
      '${seriesAlvo}x$repeticoesAlvo',
      if (cargaSugerida != null) '$cargaSugerida kg',
    ].join(' · ');
  }

  factory ItemFicha.fromJson(Object? json) {
    return switch (json) {
      {
        'id': final String id,
        'ordem': final int ordem,
        'tipo': final String tipo,
        'exercicio': final Object? exercicio,
        'nomePersonalizado': final String? nomePersonalizado,
        'seriesAlvo': final int? seriesAlvo,
        'repeticoesAlvo': final int? repeticoesAlvo,
        'cargaSugerida': final num? cargaSugerida,
        'duracaoMin': final int? duracaoMin,
        'velocidadeKmh': final num? velocidadeKmh,
        'inclinacaoPct': final num? inclinacaoPct,
      } =>
        ItemFicha(
          id: id,
          ordem: ordem,
          tipo: TipoExercicio.values.byName(tipo),
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
