import 'package:material_ui/material_ui.dart';
import 'package:treino_progressivo/screens/login_screen.dart';
import 'package:treino_progressivo/treino_api.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  final api = TreinoApi(base: Uri.parse(enderecoDaApi));

  runApp(MyApp(api: api));
}

class MyApp extends StatelessWidget {
  final TreinoApi api;

  const MyApp({super.key, required this.api});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(home: LoginScreen(api: api));
  }
}
