import 'package:material_ui/material_ui.dart';

/// Paleta copiada do Tailwind (zinc), a mesma usada no web.
abstract final class Cores {
  static const fundo = Color(0xFF0A0A0A); // fundo da página no web
  static const zinc950 = Color(0xFF09090B); // fundo dos cards
  static const zinc900 = Color(0xFF18181B);
  static const zinc800 = Color(0xFF27272A); // bordas
  static const zinc700 = Color(0xFF3F3F46);
  static const zinc500 = Color(0xFF71717A); // texto apagado
  static const zinc400 = Color(0xFFA1A1AA); // texto secundário
  static const indigo300 = Color(0xFFA5B4FC); // destaque (dias da semana)
  static const vermelho = Color(0xFFDC2626); // red-600
  static const verde = Color(0xFF4ADE80); // green-400
  static const indigoSuave = Color(
    0x336366F1,
  ); // indigo-500 com 20% de opacidade
}

ThemeData criarTemaEscuro() {
  const esquema = ColorScheme.dark(
    primary: Colors.white,
    onPrimary: Colors.black,
    // Destaques suaves (card de hoje, avatares) — igual ao avatar do web:
    // bg-indigo-500/20 + text-indigo-300
    primaryContainer: Cores.indigoSuave,
    onPrimaryContainer: Cores.indigo300,
    secondary: Cores.indigo300,
    surface: Cores.fundo,
    onSurface: Colors.white,
    onSurfaceVariant: Cores.zinc400,
    outline: Cores.zinc800,
    error: Cores.vermelho,
  );

  final bordaArredondada = RoundedRectangleBorder(
    borderRadius: BorderRadius.circular(12),
    side: const BorderSide(color: Cores.zinc800),
  );

  return ThemeData(
    colorScheme: esquema,
    scaffoldBackgroundColor: Cores.fundo,

    appBarTheme: const AppBarTheme(
      backgroundColor: Cores.fundo,
      foregroundColor: Colors.white,
      elevation: 0,
      scrolledUnderElevation: 0,
      shape: Border(bottom: BorderSide(color: Cores.zinc800)),
    ),

    cardTheme: CardThemeData(
      color: Cores.zinc950,
      elevation: 0,
      shape: bordaArredondada,
    ),

    // Botão branco em formato de pílula, igual ao "+ Criar Nova Ficha"
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        shape: const StadiumBorder(),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
        textStyle: const TextStyle(fontWeight: FontWeight.bold),
      ),
    ),

    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: Colors.white,
        side: const BorderSide(color: Cores.zinc800),
        shape: const StadiumBorder(),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
      ),
    ),

    // Campos como o "Parte do nome do aluno"
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: Cores.zinc950,
      hintStyle: const TextStyle(color: Cores.zinc500),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: const BorderSide(color: Cores.zinc800),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: const BorderSide(color: Cores.zinc800),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: const BorderSide(color: Cores.zinc500),
      ),
    ),

    dialogTheme: DialogThemeData(
      backgroundColor: Cores.zinc900,
      shape: bordaArredondada,
    ),

    snackBarTheme: const SnackBarThemeData(
      backgroundColor: Cores.zinc800,
      contentTextStyle: TextStyle(color: Colors.white),
    ),

    dividerTheme: const DividerThemeData(color: Cores.zinc800),
  );
}
