import 'package:material_ui/material_ui.dart';
import 'package:treino_progressivo/models/aluno.dart';
import 'package:treino_progressivo/models/ficha.dart';
import 'package:treino_progressivo/screens/ficha_screen.dart';
import 'package:treino_progressivo/treino_api.dart';
import 'package:treino_progressivo/screens/login_screen.dart';

class SemanaScreen extends StatefulWidget {
  final TreinoApi api;
  final Aluno aluno;

  const SemanaScreen({super.key, required this.api, required this.aluno});

  @override
  State<SemanaScreen> createState() => _SemanaScreenState();
}

class _SemanaScreenState extends State<SemanaScreen> {
  List<Ficha> _fichas = const [];
  bool _carregando = true;
  String? _erro;

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
      final fichas = await widget.api.buscarFichas(widget.aluno);
      if (!mounted) return;
      setState(() => _fichas = fichas);
    } on FalhaDaApi catch (falha) {
      if (!mounted) return;
      setState(() => _erro = descreverFalha(falha));
    } finally {
      if (mounted) setState(() => _carregando = false);
    }
  }

  Future<void> _abrirFicha(Ficha ficha, int dia) async {
    final treinou = await Navigator.push<bool>(
      context,
      MaterialPageRoute(
        builder: (_) => FichaScreen(api: widget.api, ficha: ficha, dia: dia),
      ),
    );

    if (treinou == true) _carregar();
  }

  // como o login é simulado, sair é só voltar pra tela de login
  void _sair() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => LoginScreen(api: widget.api)),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Semana de ${widget.aluno.nome}'),
        actions: [
          IconButton(
            onPressed: _carregando ? null : _carregar,
            icon: const Icon(Icons.refresh),
            tooltip: 'Recarregar',
          ),
        ],
      ),
      body: _corpo(),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: OutlinedButton.icon(
            onPressed: _sair,
            icon: const Icon(Icons.logout),
            label: const Text('Sair'),
          ),
        ),
      ),
    );
  }

  Widget _corpo() {
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

    if (_fichas.isEmpty) {
      return const Center(
        child: Text('Seu personal ainda não montou sua ficha.'),
      );
    }

    return RefreshIndicator(
      onRefresh: _carregar,
      child: ListView.builder(
        physics: const AlwaysScrollableScrollPhysics(),
        itemCount: diasDaSemana.length,
        itemBuilder: (context, index) => _dia(index + 1),
      ),
    );
  }

  Widget _dia(int dia) {
    final ficha = fichaDoDia(_fichas, dia);
    final nome = diasDaSemana[dia - 1];
    final ehHoje = dia == DateTime.now().weekday;
    final cores = Theme.of(context).colorScheme;

    return Card(
      color: ehHoje ? cores.primaryContainer : null,
      child: ListTile(
        title: Text(ehHoje ? '$nome (hoje)' : nome),
        subtitle: Text(
          ficha == null
              ? 'Repouso'
              : ficha.itens.map((item) => item.nome).join(', '),
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
        ),
        trailing: ficha == null ? null : const Icon(Icons.chevron_right),
        onTap: ficha == null ? null : () => _abrirFicha(ficha, dia),
      ),
    );
  }
}
