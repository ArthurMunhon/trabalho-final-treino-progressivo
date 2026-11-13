class Aluno {
  final String id;
  final String nome;
  final String email;
  final String? personalId; // vazio até o personal aceitar

  const Aluno({
    required this.id,
    required this.nome,
    required this.email,
    this.personalId,
  });
}
