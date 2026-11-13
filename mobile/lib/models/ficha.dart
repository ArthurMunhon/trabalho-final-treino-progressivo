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
}
