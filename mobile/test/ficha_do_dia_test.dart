import 'package:flutter_test/flutter_test.dart';
import 'package:treino_progressivo/models/aluno.dart';
import 'package:treino_progressivo/models/ficha.dart';

void main() {
  // Aluno e fichas de mentira, só o necessário para o teste
  const aluno = Aluno(id: 'a1', nome: 'Marcos', email: 'marcos@exemplo.com');

  Ficha ficha(String id) =>
      Ficha(id: id, aluno: aluno, personalId: 'p1', itens: const []);

  final fichas = [ficha('seg'), ficha('ter'), ficha('qua')];

  test('segunda (1) pega a 1ª ficha', () {
    expect(fichaDoDia(fichas, DateTime.monday)?.id, 'seg');
  });

  test('quarta (3) pega a 3ª ficha', () {
    expect(fichaDoDia(fichas, DateTime.wednesday)?.id, 'qua');
  });

  test('quinta sem ficha é repouso', () {
    expect(fichaDoDia(fichas, DateTime.thursday), isNull);
  });

  test('aluno sem nenhuma ficha é repouso', () {
    expect(fichaDoDia(const [], DateTime.monday), isNull);
  });

  test('nome do dia bate com o weekday', () {
    expect(diasDaSemana[DateTime.monday - 1], 'Segunda');
    expect(diasDaSemana[DateTime.sunday - 1], 'Domingo');
  });
}