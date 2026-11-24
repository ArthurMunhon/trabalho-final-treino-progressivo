import 'aluno.dart';
import 'item_ficha.dart';

class Ficha {
  final String id;
  final Aluno aluno;
  final String personalId;
  final List<ItemFicha> itens;

  const Ficha({
    required this.id,
    required this.aluno,
    required this.personalId,
    required this.itens,
  });

  factory Ficha.fromJson(Object? json, Aluno aluno) {
    return switch (json) {
      {
      'id': final String id,
      'personalId': final String personalId,
      'itens': final List<Object?> itens,
      } =>
          Ficha(
            id: id,
            aluno: aluno,
            personalId: personalId,
            itens: itens.map(ItemFicha.fromJson).toList()
              ..sort((a, b) => a.ordem.compareTo(b.ordem)),
          ),
      _ => throw FormatException('Ficha em formato inesperado: $json'),
    };
  }
}
