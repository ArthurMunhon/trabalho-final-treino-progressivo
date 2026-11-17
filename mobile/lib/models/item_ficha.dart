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
}
