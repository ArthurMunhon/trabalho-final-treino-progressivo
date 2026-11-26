import '../models/aluno.dart';
import '../models/exercicio.dart';
import '../models/ficha.dart';
import '../models/item_ficha.dart';
import '../models/sessao_treino.dart';

const _personalId = 'p1';

const _supinoReto = Exercicio(
  id: 'e1',
  nome: 'Supino reto com barra',
  grupoMuscular: 'peito',
);
const _puxadaAlta = Exercicio(
  id: 'e2',
  nome: 'Puxada alta',
  grupoMuscular: 'costas',
);
const _agachamento = Exercicio(
  id: 'e3',
  nome: 'Agachamento livre',
  grupoMuscular: 'quadriceps',
);
const _roscaDireta = Exercicio(
  id: 'e4',
  nome: 'Rosca direta com barra reta',
  grupoMuscular: 'biceps',
);

const List<Exercicio> _exercicios = [
  _supinoReto,
  _puxadaAlta,
  _agachamento,
  _roscaDireta,
];

const _marcos = Aluno(
  id: 'a1',
  nome: 'Marcos Vinicius',
  email: 'marcos@exemplo.com',
  personalId: _personalId,
);
const _ana = Aluno(
  id: 'a2',
  nome: 'Ana Beatriz',
  email: 'ana.beatriz@exemplo.com',
  personalId: _personalId,
);
const _bruno = Aluno(
  id: 'a3',
  nome: 'Bruno Almeida',
  email: 'bruno.almeida@exemplo.com',
  personalId: null,
);

const List<Aluno> _alunos = [_marcos, _ana, _bruno];

const _itemSupino = ItemFicha(
  id: 'i1',
  ordem: 1,
  exercicio: _supinoReto,
  seriesAlvo: 4,
  repeticoesAlvo: 10,
  cargaSugerida: 40,
);
const _itemPuxada = ItemFicha(
  id: 'i2',
  ordem: 2,
  exercicio: _puxadaAlta,
  seriesAlvo: 3,
  repeticoesAlvo: 12,
  cargaSugerida: 35,
);
const _itemEsteira = ItemFicha(
  id: 'i3',
  ordem: 3,
  nomePersonalizado: 'Esteira',
  tipo: TipoExercicio.cardio,
  duracaoMin: 20,
  velocidadeKmh: 8.5,
  inclinacaoPct: 2,
);
const _itemAgachamento = ItemFicha(
  id: 'i4',
  ordem: 1,
  exercicio: _agachamento,
  seriesAlvo: 4,
  repeticoesAlvo: 8,
  cargaSugerida: 60,
);
const _itemRosca = ItemFicha(
  id: 'i5',
  ordem: 2,
  exercicio: _roscaDireta,
  seriesAlvo: 3,
  repeticoesAlvo: 12,
  cargaSugerida: 20,
);

const _fichaMarcos = Ficha(
  id: 'f1',
  aluno: _marcos,
  personalId: _personalId,
  itens: [_itemSupino, _itemPuxada, _itemEsteira],
);
const _fichaAna = Ficha(
  id: 'f2',
  aluno: _ana,
  personalId: _personalId,
  itens: [_itemAgachamento, _itemRosca],
);

const List<Ficha> _fichas = [_fichaMarcos, _fichaAna];

final List<SessaoTreino> _sessoes = [
  SessaoTreino(
    id: 's1',
    aluno: _marcos,
    ficha: _fichaMarcos,
    data: DateTime(2026, 11, 10, 18, 30),
    situacao: SituacaoSessao.finalizada,
    series: const [
      SerieExecutada(
        id: 'se1',
        itemFicha: _itemSupino,
        numeroSerie: 1,
        cargaUsada: 40,
        repeticoesFeitas: 10,
      ),
      SerieExecutada(
        id: 'se2',
        itemFicha: _itemSupino,
        numeroSerie: 2,
        cargaUsada: 42.5,
        repeticoesFeitas: 8,
      ),
      SerieExecutada(
        id: 'se3',
        itemFicha: _itemPuxada,
        numeroSerie: 1,
        cargaUsada: 35,
        repeticoesFeitas: 12,
      ),
    ],
  ),
  SessaoTreino(
    id: 's2',
    aluno: _ana,
    ficha: _fichaAna,
    data: DateTime(2026, 11, 13, 7, 0),
    situacao: SituacaoSessao.emAndamento,
    series: const [
      SerieExecutada(
        id: 'se4',
        itemFicha: _itemAgachamento,
        numeroSerie: 1,
        cargaUsada: 60,
        repeticoesFeitas: 8,
      ),
    ],
  ),
];

List<Exercicio> listarExercicios() => _exercicios;
List<Aluno> listarAlunos() => _alunos;
List<Ficha> listarFichas() => _fichas;
List<SessaoTreino> listarSessoes() => _sessoes;
