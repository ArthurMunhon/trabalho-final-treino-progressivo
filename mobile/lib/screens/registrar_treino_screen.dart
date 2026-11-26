import 'package:material_ui/material_ui.dart';
import 'package:treino_progressivo/models/carga_atualizada.dart';
import 'package:treino_progressivo/models/ficha.dart';
import 'package:treino_progressivo/models/item_ficha.dart';
import 'package:treino_progressivo/models/sessao_treino.dart';
import 'package:treino_progressivo/treino_api.dart';


// 40.0 vira "40" e 42.5 continua "42.5"
String formatarNumero(double valor) =>
    valor == valor.roundToDouble() ? '${valor.toInt()}' : '$valor';

/// Tela onde o aluno registra as séries enquanto treina.
/// Cada série vai para a API na hora; ao finalizar, devolve a SessaoTreino com Navigator.pop.
class RegistrarTreinoScreen extends StatefulWidget {
  const RegistrarTreinoScreen({
    super.key,
    required this.api,
    required this.ficha,
  });

  final TreinoApi api;
  final Ficha ficha;

  @override
  State<RegistrarTreinoScreen> createState() => _RegistrarTreinoScreenState();
}

class _RegistrarTreinoScreenState extends State<RegistrarTreinoScreen> {
  // Séries já confirmadas pela API, separadas por item da ficha (chave = item.id)
  final Map<String, List<SerieExecutada>> _seriesPorItem = {};

  // Id da sessão na API; fica null até a 1ª série ser registrada
  String? _sessaoId;

  // true enquanto espera a API: trava os botões para não enviar duas vezes
  bool _enviando = false;

  void _avisar(String texto) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(texto)));
  }

  // Janela com as cargas que o backend recalculou (sobrecarga progressiva)
  Future<void> _mostrarResultado(List<CargaAtualizada> cargas) {
    final linhas = [
      for (final carga in cargas)
        '${widget.ficha.itens.firstWhere((i) => i.id == carga.itemFichaId).nome}: '
            '${formatarNumero(carga.cargaAnterior)} kg → ${formatarNumero(carga.cargaNova)} kg',
    ];

    return showDialog<void>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Treino finalizado!'),
        content: Text(
          linhas.isEmpty
              ? 'Nenhuma carga mudou para o próximo treino.'
              : 'Carga para o próximo treino:\n\n${linhas.join('\n')}',
        ),
        actions: [
          FilledButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  Future<void> _adicionarSerie(
    ItemFicha item,
    double carga,
    int repeticoes,
  ) async {
    final numeroSerie = (_seriesPorItem[item.id]?.length ?? 0) + 1;
    setState(() => _enviando = true);
    try {
      // Abre a sessão na 1ª série; nas próximas reaproveita o id
      final sessaoId = _sessaoId ??= await widget.api.iniciarSessao(
        widget.ficha,
      );
      await widget.api.registrarSerie(
        sessaoId,
        item: item,
        numeroSerie: numeroSerie,
        carga: carga,
        repeticoes: repeticoes,
      );
      if (!mounted) return;
      // Só aparece na tela depois que a API confirmou
      setState(() {
        _seriesPorItem
            .putIfAbsent(item.id, () => [])
            .add(
              SerieExecutada(
                id: '$sessaoId-${item.id}-$numeroSerie',
                itemFicha: item,
                numeroSerie: numeroSerie,
                cargaUsada: carga,
                repeticoesFeitas: repeticoes,
              ),
            );
      });
    } on FalhaDaApi catch (falha) {
      // Os campos continuam preenchidos: é só tocar de novo para reenviar
      if (mounted) _avisar(descreverFalha(falha));
    } finally {
      if (mounted) setState(() => _enviando = false);
    }
  }

  Future<void> _finalizar() async {
    final sessaoId = _sessaoId;
    if (sessaoId == null) {
      _avisar('Registre pelo menos uma série antes de finalizar.');
      return;
    }

    setState(() => _enviando = true);
    try {
      // O backend recalcula as cargas; o app só mostra o resultado
      final cargas = await widget.api.finalizarSessao(sessaoId);
      if (!mounted) return;
      await _mostrarResultado(cargas);
      if (!mounted) return;
      final sessao = SessaoTreino(
        id: sessaoId,
        aluno: widget.ficha.aluno,
        ficha: widget.ficha,
        data: DateTime.now(),
        situacao: SituacaoSessao.finalizada,
        series: _seriesPorItem.values.expand((s) => s).toList(),
      );
      Navigator.pop(context, sessao);
    } on FalhaDaApi catch (falha) {
      if (mounted) _avisar(descreverFalha(falha));
    } finally {
      if (mounted) setState(() => _enviando = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final itens = widget.ficha.itens;

    return Scaffold(
      appBar: AppBar(title: const Text('Registrar treino')),
      body: ListView.builder(
        padding: const EdgeInsets.only(bottom: 80),
        itemCount: itens.length,
        itemBuilder: (context, index) {
          final item = itens[index];
          return _ItemRegistro(
            item: item,
            series: _seriesPorItem[item.id] ?? const [],
            enviando: _enviando,
            onAdicionar: (carga, reps) => _adicionarSerie(item, carga, reps),
          );
        },
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: FilledButton(
            onPressed: _enviando ? null : _finalizar,
            child: Text(_enviando ? 'Enviando...' : 'Finalizar treino'),
          ),
        ),
      ),
    );
  }
}

/// Card de um exercício: mostra o alvo, as séries feitas e os campos de entrada.
/// É Stateful só para guardar os controllers dos campos.
class _ItemRegistro extends StatefulWidget {
  const _ItemRegistro({
    required this.item,
    required this.series,
    required this.enviando,
    required this.onAdicionar,
  });

  final ItemFicha item;
  final List<SerieExecutada> series;
  final bool enviando;
  final void Function(double carga, int repeticoes) onAdicionar;

  @override
  State<_ItemRegistro> createState() => _ItemRegistroState();
}

class _ItemRegistroState extends State<_ItemRegistro> {
  // Já começam preenchidos com o alvo, o aluno só ajusta se mudou
  late final _cargaController = TextEditingController(
    text: widget.item.cargaSugerida?.toString() ?? '',
  );
  late final _repsController = TextEditingController(
    text: widget.item.repeticoesAlvo?.toString() ?? '',
  );

  // Passo de cada toque: 2,5 kg é o menor par de anilhas comum na academia
  static const _passoCarga = 2.5;
  static const _passoReps = 1.0;

  @override
  void dispose() {
    _cargaController.dispose();
    _repsController.dispose();
    super.dispose();
  }

  // Lê o campo, soma o passo (negativo para diminuir) e escreve de volta.
  void _ajustar(TextEditingController controller, double passo) {
    final atual = double.tryParse(controller.text.replaceAll(',', '.')) ?? 0;
    var novo = atual + passo;
    if (novo < 0) novo = 0; // carga/reps negativas não fazem sentido
    // Arredonda em 2 casas: evita lixo de ponto flutuante (ex.: 24.025000000000002)
    novo = (novo * 100).round() / 100;
    controller.text = formatarNumero(novo);
  }

  void _adicionar() {
    // aceita vírgula também (ex: 42,5)
    final carga = double.tryParse(_cargaController.text.replaceAll(',', '.'));
    final reps = int.tryParse(_repsController.text);

    if (carga == null || reps == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Informe carga e repetições válidas')),
      );
      return;
    }
    widget.onAdicionar(carga, reps);
  }

  Widget _campoComPasso({
    required TextEditingController controller,
    required String rotulo,
    required double passo,
    required bool decimal,
  }) {
    return TextField(
      controller: controller,
      textAlign: TextAlign.center,
      keyboardType: TextInputType.numberWithOptions(decimal: decimal),
      decoration: InputDecoration(
        labelText: rotulo,
        prefixIcon: IconButton(
          onPressed: () => _ajustar(controller, -passo),
          icon: const Icon(Icons.remove, size: 18),
          visualDensity: VisualDensity.compact,
          tooltip: 'Diminuir',
        ),
        suffixIcon: IconButton(
          onPressed: () => _ajustar(controller, passo),
          icon: const Icon(Icons.add, size: 18),
          visualDensity: VisualDensity.compact,
          tooltip: 'Aumentar',
        ),
        // O padrão é 48px de cada lado; diminuindo sobra espaço para o número
        prefixIconConstraints: const BoxConstraints(minWidth: 36),
        suffixIconConstraints: const BoxConstraints(minWidth: 36),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final item = widget.item;
    final ehCardio = item.tipo == TipoExercicio.cardio;

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(item.nome, style: Theme.of(context).textTheme.titleMedium),
            Text('Alvo: ${item.alvo}'),
            const SizedBox(height: 8),
            ...widget.series.map(
              (serie) => Text(
                'Série ${serie.numeroSerie}: ${serie.cargaUsada} kg x ${serie.repeticoesFeitas}',
              ),
            ),
            // Cardio não tem carga/repetições, então não mostra os campos
            if (!ehCardio) ...[
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: _campoComPasso(
                      controller: _cargaController,
                      rotulo: 'Carga (kg)',
                      passo: _passoCarga,
                      decimal: true,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: _campoComPasso(
                      controller: _repsController,
                      rotulo: 'Reps',
                      passo: _passoReps,
                      decimal: false,
                    ),
                  ),
                  IconButton(
                    onPressed: widget.enviando ? null : _adicionar,
                    icon: const Icon(Icons.add_circle),
                    tooltip: 'Adicionar série',
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }
}
