import 'aluno.dart';
import 'ficha.dart';
import 'item_ficha.dart';

enum SituacaoSessao { emAndamento, finalizada }

class SerieExecutada {
  final String id;
  final ItemFicha itemFicha;
  final int numeroSerie;
  final double cargaUsada;
  final int repeticoesFeitas;

  const SerieExecutada({
    required this.id,
    required this.itemFicha,
    required this.numeroSerie,
    required this.cargaUsada,
    required this.repeticoesFeitas,
  });
}

class SessaoTreino {
  final String id;
  final Aluno aluno;
  final Ficha ficha;
  final DateTime data;
  final SituacaoSessao situacao;
  final List<SerieExecutada> series;

  const SessaoTreino({
    required this.id,
    required this.aluno,
    required this.ficha,
    required this.data,
    this.situacao = SituacaoSessao.emAndamento,
    this.series = const [],
  });
}
