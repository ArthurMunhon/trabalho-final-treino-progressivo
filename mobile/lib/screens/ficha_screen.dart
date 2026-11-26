import 'package:material_ui/material_ui.dart';
import 'package:treino_progressivo/dados/dados_mock.dart';
import 'package:treino_progressivo/models/ficha.dart';
import 'package:treino_progressivo/models/sessao_treino.dart';
import 'package:treino_progressivo/screens/registrar_treino_screen.dart';
import 'package:treino_progressivo/treino_api.dart';
import 'package:treino_progressivo/widgets/treino_card.dart';

class FichaScreen extends StatefulWidget {
  final TreinoApi api;
  final Ficha ficha;
  final int dia;

  const FichaScreen({
    super.key,
    required this.api,
    required this.ficha,
    required this.dia,
  });

  @override
  State<FichaScreen> createState() => _FichaScreenState();
}

class _FichaScreenState extends State<FichaScreen> {
  // por enquanto o histórico ainda vem do mock
  final List<SessaoTreino> _sessoes = [...listarSessoes()];

  SessaoTreino? get _ultimaSessao {
    final daFicha =
        _sessoes.where((s) => s.ficha.id == widget.ficha.id).toList()
          ..sort((a, b) => b.data.compareTo(a.data));
    return daFicha.isEmpty ? null : daFicha.first;
  }

  Future<void> _abrirRegistro() async {
    final novaSessao = await Navigator.push<SessaoTreino>(
      context,
      MaterialPageRoute(
        builder: (_) =>
            RegistrarTreinoScreen(api: widget.api, ficha: widget.ficha),
      ),
    );

    if (novaSessao != null && mounted) {
      // se finalizou o treino as cargas mudaram, então a semana tem que recarregar
      Navigator.pop(context, true);
    }
  }

  @override
  Widget build(BuildContext context) {
    final ficha = widget.ficha;

    return Scaffold(
      appBar: AppBar(title: Text('Treino de ${diasDaSemana[widget.dia - 1]}')),
      body: _corpo(ficha),
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
