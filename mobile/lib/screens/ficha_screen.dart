
import 'package:material_ui/material_ui.dart';
import 'package:treino_progressivo/dados/dados_mock.dart';
import 'package:treino_progressivo/models/ficha.dart';
import 'package:treino_progressivo/models/sessao_treino.dart';
import 'package:treino_progressivo/screens/registrar_treino_screen.dart';
import 'package:treino_progressivo/widgets/treino_card.dart';

// Ficha de um dia da semana. Recebe a ficha pronta da SemanaScreen.
class FichaScreen extends StatefulWidget {
  final Ficha ficha;
  final int dia; // 1 = segunda ... 7 = domingo

  const FichaScreen({super.key, required this.ficha, required this.dia});

  @override
  State<FichaScreen> createState() => _FichaScreenState();
}

class _FichaScreenState extends State<FichaScreen> {
  // Sessões ainda vêm do mock; o registro na API é o próximo passo
  final List<SessaoTreino> _sessoes = [...listarSessoes()];

  SessaoTreino? get _ultimaSessao {
    final daFicha = _sessoes.where((s) => s.ficha.id == widget.ficha.id).toList()
      ..sort((a, b) => b.data.compareTo(a.data));
    return daFicha.isEmpty ? null : daFicha.first;
  }

  Future<void> _abrirRegistro() async {
    final novaSessao = await Navigator.push<SessaoTreino>(
      context,
      MaterialPageRoute(
        builder: (_) => RegistrarTreinoScreen(ficha: widget.ficha),
      ),
    );

    // null = usuário voltou sem finalizar
    if (novaSessao != null) {
      setState(() => _sessoes.add(novaSessao));
    }
  }

  @override
  Widget build(BuildContext context) {
    final ficha = widget.ficha;

    return Scaffold(
      appBar: AppBar(title: Text('Treino de ${diasDaSemana[widget.dia - 1]}')),
      body: _corpo(ficha),
      // Ficha sem exercício não tem o que treinar
      floatingActionButton: ficha.itens.isEmpty
          ? null
          : FloatingActionButton.extended(
        onPressed: _abrirRegistro,
        icon: const Icon(Icons.add),
        label: const Text('Iniciar treino'),
      ),
    );
  }

  Widget _corpo(Ficha ficha) {
    if (ficha.itens.isEmpty) {
      return const Center(child: Text('Esta ficha ainda não tem exercícios.'));
    }

    final seriesDaSessao = _ultimaSessao?.series ?? const <SerieExecutada>[];
    return ListView.builder(
      padding: const EdgeInsets.only(bottom: 80),
      itemCount: ficha.itens.length,
      itemBuilder: (context, index) {
        final item = ficha.itens[index];
        return TreinoCard(
          item: item,
          series: seriesDaSessao
              .where((serie) => serie.itemFicha.id == item.id)
              .toList(),
        );
      },
    );
  }
}
