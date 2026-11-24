import 'package:material_ui/material_ui.dart';
import 'package:treino_progressivo/dados/dados_mock.dart';
import 'package:treino_progressivo/models/aluno.dart';
import 'package:treino_progressivo/models/ficha.dart';
import 'package:treino_progressivo/models/sessao_treino.dart';
import 'package:treino_progressivo/screens/registrar_treino_screen.dart';
import 'package:treino_progressivo/treino_api.dart';
import 'package:treino_progressivo/widgets/treino_card.dart';

class FichaScreen extends StatefulWidget {
  final TreinoApi api;
  final Aluno aluno;

  const FichaScreen({super.key, required this.api, required this.aluno});

  @override
  State<FichaScreen> createState() => _FichaScreenState();
}

class _FichaScreenState extends State<FichaScreen> {
  Ficha? _ficha;
  bool _carregando = true;
  String? _erro;

  // Sessões ainda vêm do mock; o registro na API é o próximo passo
  final List<SessaoTreino> _sessoes = [...listarSessoes()];

  @override
  void initState() {
    super.initState();
    _carregar();
  }

  Future<void> _carregar() async {
    setState(() {
      _carregando = true;
      _erro = null;
    });
    try {
      final ficha = await widget.api.buscarFicha(widget.aluno);
      if (!mounted) return;
      setState(() => _ficha = ficha);
    } on FalhaDaApi catch (falha) {
      if (!mounted) return;
      setState(() => _erro = descreverFalha(falha));
    } finally {
      if (mounted) setState(() => _carregando = false);
    }
  }

  SessaoTreino? get _ultimaSessao {
    final ficha = _ficha;
    if (ficha == null) return null;
    final daFicha = _sessoes.where((s) => s.ficha.id == ficha.id).toList()
      ..sort((a, b) => b.data.compareTo(a.data));
    return daFicha.isEmpty ? null : daFicha.first;
  }

  Future<void> _abrirRegistro(Ficha ficha) async {
    final novaSessao = await Navigator.push<SessaoTreino>(
      context,
      MaterialPageRoute(builder: (_) => RegistrarTreinoScreen(ficha: ficha)),
    );

    // null = usuário voltou sem finalizar
    if (novaSessao != null) {
      setState(() => _sessoes.add(novaSessao));
    }
  }

  @override
  Widget build(BuildContext context) {
    // Cópia local: o Dart só promove Ficha? para Ficha em variável local
    final ficha = _ficha;

    return Scaffold(
      appBar: AppBar(title: Text('Ficha de ${widget.aluno.nome}')),
      body: _corpo(ficha),
      // Botão só aparece quando há ficha carregada
      floatingActionButton: ficha == null || ficha.itens.isEmpty
          ? null
          : FloatingActionButton.extended(
              onPressed: () => _abrirRegistro(ficha),
              icon: const Icon(Icons.add),
              label: const Text('Iniciar treino'),
            ),
    );
  }

  Widget _corpo(Ficha? ficha) {
    if (_carregando) {
      return const Center(child: CircularProgressIndicator());
    }

    final erro = _erro;
    if (erro != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(erro, textAlign: TextAlign.center),
              const SizedBox(height: 16),
              FilledButton(
                onPressed: _carregar,
                child: const Text('Tentar de novo'),
              ),
            ],
          ),
        ),
      );
    }

    if (ficha == null || ficha.itens.isEmpty) {
      return const Center(
        child: Text('Seu personal ainda não montou sua ficha.'),
      );
    }

    final seriesDaSessao = _ultimaSessao?.series ?? const <SerieExecutada>[];
    return RefreshIndicator(
      onRefresh: _carregar,
      child: ListView.builder(
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
      ),
    );
  }
}
