class Exercicio {
  final String id;
  final String nome;
  final String grupoMuscular;

  const Exercicio({
    required this.id,
    required this.nome,
    required this.grupoMuscular,
  });

  factory Exercicio.fromJson(Object? json) {
    return switch (json) {
      {
      'id': final String id,
      'nome': final String nome,
      'grupoMuscular': final String grupoMuscular,
      } =>
          Exercicio(id: id, nome: nome, grupoMuscular: grupoMuscular),
      _ => throw FormatException('Exercício em formato inesperado: $json'),
    };
  }
}
