import 'package:material_ui/material_ui.dart';
import 'package:treino_progressivo/models/item_ficha.dart';
import 'package:treino_progressivo/models/sessao_treino.dart';

class TreinoCard extends StatelessWidget {
  const TreinoCard({super.key, required this.item, this.series = const []});

  final ItemFicha item;
  final List<SerieExecutada> series;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(item.nome, style: Theme.of(context).textTheme.titleMedium),
            Text('Alvo: ${item.alvo}'),
            const SizedBox(height: 8),
            if (series.isEmpty)
              const Text('Nenhuma série executada')
            else
              ...series.map(
                (serie) => Text(
                  'Série ${serie.numeroSerie}: ${serie.cargaUsada} kg x ${serie.repeticoesFeitas}',
                ),
              ),
          ],
        ),
      ),
    );
  }
}
