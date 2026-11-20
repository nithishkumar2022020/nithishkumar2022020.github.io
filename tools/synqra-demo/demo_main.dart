// Portfolio-only entry point. Reuses Synqra's screens and existing simulations.
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'core/theme/app_theme.dart';
import 'data/repositories/mock_corpus_repository.dart';
import 'data/repositories/mock_telemetry_repository.dart';
import 'data/repositories/rag_stream_repository.dart';
import 'domain/models/profile_settings.dart';
import 'domain/models/rag_stream_event.dart';
import 'domain/repositories/i_profile_settings_repository.dart';
import 'domain/repositories/i_rag_stream_repository.dart';
import 'presentation/providers/corpus_provider.dart';
import 'presentation/providers/rag_session_provider.dart';
import 'presentation/providers/settings_provider.dart';
import 'presentation/providers/telemetry_provider.dart';
import 'presentation/screens/root_shell_screen.dart';

ProfileSettings demoSettings(ProfileSettings value) => value.copyWith(
  apiKey: '', sseEndpoint: '', useOfflineSimulation: true,
  isAuthenticated: true, isGuest: true, researcherName: 'Portfolio visitor',
  callSign: 'DEMO-OBSERVER',
);

class DemoSettingsRepository implements IProfileSettingsRepository {
  ProfileSettings _settings = demoSettings(ProfileSettings.defaults());
  @override
  Future<ProfileSettings> loadSettings() async => _settings;
  @override
  Future<void> saveSettings(ProfileSettings settings) async {
    _settings = demoSettings(settings);
  }
}

// Clamp before notification too, so settings controls cannot enable a live call.
class DemoSettingsProvider extends SettingsProvider {
  DemoSettingsProvider() : super(repository: DemoSettingsRepository());
  @override
  Future<void> updateSettings(ProfileSettings settings) =>
      super.updateSettings(demoSettings(settings));
}

class DemoRagRepository implements IRagStreamRepository {
  final _simulation = RagStreamRepository();
  @override
  void cancelStream() => _simulation.cancelStream();
  @override
  Stream<RagStreamEvent> queryStream(String prompt, {
    String? sseUrl, String? apiKey, Map<String, dynamic>? additionalParams,
  }) => _simulation.queryStream(prompt, sseUrl: '', additionalParams: {
    ...?additionalParams, 'useOfflineSimulation': true,
  });
}

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  GoogleFonts.config.allowRuntimeFetching = false;
  // No Firebase initialization, authentication, or live corpus repository.
  runApp(MultiProvider(providers: [
    ChangeNotifierProvider<SettingsProvider>(create: (_) => DemoSettingsProvider()),
    ChangeNotifierProvider(create: (_) => CorpusProvider(repository: MockCorpusRepository())),
    ChangeNotifierProvider(create: (_) => RagSessionProvider(repository: DemoRagRepository())),
    ChangeNotifierProvider(create: (_) => TelemetryProvider(repository: MockTelemetryRepository())),
  ], child: const SynqraDemo()));
}

class SynqraDemo extends StatelessWidget {
  const SynqraDemo({super.key});
  @override
  Widget build(BuildContext context) => Consumer<SettingsProvider>(
    builder: (context, settings, _) => MaterialApp(
      title: 'Synqra · Interactive demo', debugShowCheckedModeBanner: false,
      theme: AppTheme.buildTheme(settings.isNocturneMode),
      home: const RootShellScreen(),
    ),
  );
}
