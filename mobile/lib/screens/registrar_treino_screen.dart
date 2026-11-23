import 'package:material_ui/material_ui.dart';
import 'package:treino_progressivo/models/ficha.dart';
import 'package:treino_progressivo/models/item_ficha.dart';
import 'package:treino_progressivo/models/sessao_treino.dart';

/// Tela onde o aluno registra as séries enquanto treina.
/// Ao finalizar, devolve a SessaoTreino com Navigator.pop.
class RegistrarTreinoScreen extends StatefulWidget {
  const RegistrarTreinoScreen({super.key, required this.ficha});

  final Ficha ficha;

  @override
  State<RegistrarTreinoScreen> createState() => _RegistrarTreinoScreenState();
}

class _RegistrarTreinoScreenState extends State<RegistrarTreinoScreen> {
  // Séries feitas até agora, separadas por item da ficha (chave = item.id)
  final Map<String, List<SerieExecutada>> _seriesPorItem = {};

  void _adicionarSerie(ItemFicha item, double carga, int repeticoes) {
    setState(() {
      final lista = _seriesPorItem.putIfAbsent(item.id, () => []);
      lista.add(
        SerieExecutada(
          id: DateTime.now().microsecondsSinceEpoch.toString(),
          itemFicha: item,
          numeroSerie: lista.length + 1,
          cargaUsada: carga,
          repeticoesFeitas: repeticoes,
        ),
      );
    });
  }

  void _finalizar() {
    final sessao = SessaoTreino(
      id: DateTime.now().microsecondsSinceEpoch.toString(),
      aluno: widget.ficha.aluno,
      ficha: widget.ficha,
      data: DateTime.now(),
      situacao: SituacaoSessao.finalizada,
      series: _seriesPorItem.values.expand((s) => s).toList(),
    );
    Navigator.pop(context, sessao);
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
            onAdicionar: (carga, reps) => _adicionarSerie(item, carga, reps),
          );
        },
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: FilledButton(
            onPressed: _finalizar,
            child: const Text('Finalizar treino'),
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
    required this.onAdicionar,
  });

  final ItemFicha item;
  final List<SerieExecutada> series;
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

  @override
  void dispose() {
    _cargaController.dispose();
    _repsController.dispose();
    super.dispose();
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
                    child: TextField(
                      controller: _cargaController,
                      keyboardType: const TextInputType.numberWithOptions(
                        decimal: true,
                      ),
                      decoration: const InputDecoration(
                        labelText: 'Carga (kg)',
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: TextField(
                      controller: _repsController,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(labelText: 'Reps'),
                    ),
                  ),
                  IconButton(
                    onPressed: _adicionar,
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
