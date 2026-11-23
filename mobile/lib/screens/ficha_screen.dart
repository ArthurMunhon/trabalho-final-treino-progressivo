import 'package:material_ui/material_ui.dart';
import 'package:treino_progressivo/dados/dados_mock.dart';
import 'package:treino_progressivo/models/ficha.dart';
import 'package:treino_progressivo/models/sessao_treino.dart';
import 'package:treino_progressivo/screens/registrar_treino_screen.dart';
import 'package:treino_progressivo/widgets/treino_card.dart';
import 'package:treino_progressivo/models/aluno.dart';

class FichaScreen extends StatefulWidget {
  final Aluno aluno;

  const FichaScreen({super.key, required this.aluno});

  @override
  State<FichaScreen> createState() => _FichaScreenState();
}

class _FichaScreenState extends State<FichaScreen> {
  final Ficha _ficha = listarFichas().first;

  final List<SessaoTreino> _sessoes = [...listarSessoes()];

  SessaoTreino? get _ultimaSessao {
    final daFicha = _sessoes.where((s) => s.ficha.id == _ficha.id).toList()
      ..sort((a, b) => b.data.compareTo(a.data));
    return daFicha.isEmpty ? null : daFicha.first;
  }

  Future<void> _abrirRegistro() async {
    final novaSessao = await Navigator.push<SessaoTreino>(
      context,
      MaterialPageRoute(builder: (_) => RegistrarTreinoScreen(ficha: _ficha)),
    );

    // null = usuário voltou sem finalizar
    if (novaSessao != null) {
      setState(() => _sessoes.add(novaSessao));
    }
  }

  @override
  Widget build(BuildContext context) {
    final seriesDaSessao = _ultimaSessao?.series ?? const <SerieExecutada>[];

    return Scaffold(
      appBar: AppBar(title: Text('Ficha de ${widget.aluno.nome}')),
      body: ListView.builder(
        padding: const EdgeInsets.only(bottom: 80),
        itemCount: _ficha.itens.length,
        itemBuilder: (context, index) {
          final item = _ficha.itens[index];
          return TreinoCard(
            item: item,
            series: seriesDaSessao
                .where((serie) => serie.itemFicha.id == item.id)
                .toList(),
          );
        },
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _abrirRegistro,
        icon: const Icon(Icons.add),
        label: const Text('Iniciar treino'),
      ),
    );
  }
}
