import 'dart:async';
import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:treino_progressivo/models/aluno.dart';

import 'models/ficha.dart';
import 'models/carga_atualizada.dart';
import 'models/item_ficha.dart';
import 'models/sessao_treino.dart';

// no emulador android o 10.0.2.2 é o localhost do pc.
// pra trocar: flutter run --dart-define=API_URL=http://...
const enderecoDaApi = String.fromEnvironment(
  'API_URL',
  defaultValue: 'http://10.0.2.2:3001',
);

// erros que podem dar ao chamar a API
sealed class FalhaDaApi implements Exception {
  const FalhaDaApi();
}

class SemConexao extends FalhaDaApi {
  const SemConexao();
}

class TempoEsgotado extends FalhaDaApi {
  const TempoEsgotado();
}

class ErroDaApi extends FalhaDaApi {
  final int status;
  final List<String> detalhes;
  const ErroDaApi(this.status, this.detalhes);
}

class RespostaInesperada extends FalhaDaApi {
  const RespostaInesperada();
}

// mensagem do erro pra mostrar pro usuário
String descreverFalha(FalhaDaApi falha) {
  return switch (falha) {
    SemConexao() => 'Não foi possível conectar ao servidor.',
    TempoEsgotado() => 'O servidor demorou demais para responder.',
    ErroDaApi(status: >= 500) => 'Erro no servidor. Tente mais tarde.',
    ErroDaApi(:final detalhes) when detalhes.isNotEmpty => detalhes.join('\n'),
    ErroDaApi(:final status) => 'Erro $status na requisição.',
    RespostaInesperada() => 'O servidor respondeu em um formato inesperado.',
  };
}

class TreinoApi {
  final Uri base;
  final Duration limite;
  final http.Client _cliente;

  TreinoApi({
    required this.base,
    http.Client? cliente,
    this.limite = const Duration(seconds: 10),
  }) : _cliente = cliente ?? http.Client();

  // POST /app/login: login simulado, só com o e-mail
  Future<Aluno> login(String email) async {
    final json = await _postJson('/app/login', {'email': email});
    try {
      return Aluno.fromJson(json);
    } on FormatException {
      throw const RespostaInesperada();
    }
  }

  // GET /fichas?alunoId=...
  // busca as fichas do aluno. o backend manda da mais antiga pra mais nova,
  // então a 1ª é a de segunda, a 2ª a de terça... por isso o limite de 7
  Future<List<Ficha>> buscarFichas(Aluno aluno) async {
    final json = await _getJson('/fichas', {'alunoId': aluno.id, 'limit': '7'});
    try {
      return switch (json) {
        {'dados': final List<Object?> dados} => [
          for (final ficha in dados) Ficha.fromJson(ficha, aluno),
        ],
        _ => throw const RespostaInesperada(),
      };
    } on FormatException {
      throw const RespostaInesperada();
    } on ArgumentError {
      throw const RespostaInesperada();
    }
  }

  // GET /sessoes-treino?fichaId=...
  // procura se tem uma sessão dessa ficha que ficou em andamento
  Future<SessaoTreino?> buscarSessaoEmAndamento(Ficha ficha) async {
    final json = await _getJson('/sessoes-treino', {
      'fichaId': ficha.id,
      'limit': '100',
    });
    if (json case {'dados': final List<Object?> dados}) {
      for (final sessao in dados) {
        if (sessao case {
          'id': final String id,
          'situacao': 'em_andamento',
          'data': final String data,
          'seriesExecutadas': final List<Object?> series,
        }) {
          return SessaoTreino(
            id: id,
            aluno: ficha.aluno,
            ficha: ficha,
            data: DateTime.parse(data),
            series: [
              for (final serie in series)
                if (serie case {
                  'id': final String serieId,
                  'itemFichaId': final String itemId,
                  'numeroSerie': final int numero,
                  'cargaUsada': final num carga,
                  'repeticoesFeitas': final int reps,
                })
                  SerieExecutada(
                    id: serieId,
                    itemFicha: ficha.itens.firstWhere((i) => i.id == itemId),
                    numeroSerie: numero,
                    cargaUsada: carga.toDouble(),
                    repeticoesFeitas: reps,
                  ),
            ]..sort((a, b) => a.numeroSerie.compareTo(b.numeroSerie)),
          );
        }
      }
      return null;
    }
    throw const RespostaInesperada();
  }

  // POST /sessoes-treino: cria a sessão e devolve o id
  Future<String> iniciarSessao(Ficha ficha) async {
    final json = await _postJson('/sessoes-treino', {
      'fichaId': ficha.id,
      'alunoId': ficha.aluno.id,
    });
    return switch (json) {
      {'id': final String id} => id,
      _ => throw const RespostaInesperada(),
    };
  }

  // POST /sessoes-treino/:id/series: registra uma série
  Future<void> registrarSerie(
    String sessaoId, {
    required ItemFicha item,
    required int numeroSerie,
    required double carga,
    required int repeticoes,
  }) async {
    await _postJson('/sessoes-treino/$sessaoId/series', {
      'itemFichaId': item.id,
      'numeroSerie': numeroSerie,
      'cargaUsada': carga,
      'repeticoesFeitas': repeticoes,
    });
  }

  // POST /sessoes-treino/:id/finalizar
  // finaliza o treino. o backend recalcula as cargas e devolve as que mudaram
  Future<List<CargaAtualizada>> finalizarSessao(String sessaoId) async {
    final json = await _postJson(
      '/sessoes-treino/$sessaoId/finalizar',
      const {},
    );
    try {
      return switch (json) {
        {'itensAtualizados': final List<Object?> itens} => [
          for (final item in itens) CargaAtualizada.fromJson(item),
        ],
        _ => throw const RespostaInesperada(),
      };
    } on FormatException {
      throw const RespostaInesperada();
    }
  }

  Future<Object?> _postJson(String caminho, Map<String, Object?> corpo) async {
    try {
      final resposta = await _cliente
          .post(
            base.replace(path: caminho),
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: jsonEncode(corpo),
          )
          .timeout(limite);
      return _tratar(resposta);
    } on TimeoutException {
      throw const TempoEsgotado();
    } on http.ClientException {
      throw const SemConexao();
    }
  }

  Future<Object?> _getJson(String caminho, Map<String, String> query) async {
    try {
      final resposta = await _cliente
          .get(
            base.replace(path: caminho, queryParameters: query),
            headers: {'Accept': 'application/json'},
          )
          .timeout(limite);
      return _tratar(resposta);
    } on TimeoutException {
      throw const TempoEsgotado();
    } on http.ClientException {
      throw const SemConexao();
    }
  }

  Object? _tratar(http.Response resposta) {
    if (resposta.statusCode < 200 || resposta.statusCode > 299) {
      throw ErroDaApi(resposta.statusCode, _detalhesDoErro(resposta));
    }
    try {
      return jsonDecode(utf8.decode(resposta.bodyBytes));
    } on FormatException {
      throw const RespostaInesperada();
    }
  }

  // o nest manda o message como texto ou como lista
  List<String> _detalhesDoErro(http.Response resposta) {
    try {
      return switch (jsonDecode(utf8.decode(resposta.bodyBytes))) {
        {'message': final String mensagem} => [mensagem],
        {'message': final List<dynamic> lista} => [for (final m in lista) '$m'],
        _ => const [],
      };
    } on FormatException {
      return const [];
    }
  }
}
