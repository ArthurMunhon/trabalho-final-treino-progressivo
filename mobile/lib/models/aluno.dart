class Aluno {
  final String id;
  final String nome;
  final String email;
  final String? personalId;

  const Aluno({
    required this.id,
    required this.nome,
    required this.email,
    this.personalId,
  });

  factory Aluno.fromJson(Object? json) {
    return switch (json) {
      {
        'id': final String id,
        'nome': final String nome,
        'email': final String email,
        'personalId':
            final String? personalId, // chave obrigatória, valor pode ser null
      } =>
        Aluno(id: id, nome: nome, email: email, personalId: personalId),
      _ => throw FormatException('Aluno em formato inesperado: $json'),
    };
  }
}
