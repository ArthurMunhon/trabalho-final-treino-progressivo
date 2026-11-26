import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:treino_progressivo/treino_api.dart';

void main() {
  test('finalizarSessao lê as cargas recalculadas', () async {
    final cliente = MockClient((pedido) async {
      expect(pedido.method, 'POST');
      expect(pedido.url.path, '/sessoes-treino/s1/finalizar');
      return http.Response(
        jsonEncode({
          'id': 's1',
          'situacao': 'finalizada',
          'itensAtualizados': [
            {'itemFichaId': 'i1', 'cargaAnterior': 40, 'cargaSugeridaNova': 42},
          ],
        }),
        200,
      );
    });
    final api = TreinoApi(base: Uri.parse('http://teste'), cliente: cliente);

    final cargas = await api.finalizarSessao('s1');

    expect(cargas.single.cargaAnterior, 40.0);
    expect(cargas.single.cargaNova, 42.0);
  });

  test('409 ao finalizar vira ErroDaApi com a mensagem do backend', () async {
    final cliente = MockClient(
      (_) async => http.Response(
        jsonEncode({'statusCode': 409, 'message': 'Sessão sem séries'}),
        409,
      ),
    );
    final api = TreinoApi(base: Uri.parse('http://teste'), cliente: cliente);

    expect(
      api.finalizarSessao('s1'),
      throwsA(isA<ErroDaApi>().having((e) => e.status, 'status', 409)),
    );
  });
}
