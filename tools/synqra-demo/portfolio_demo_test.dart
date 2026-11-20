import 'package:flutter_test/flutter_test.dart';
import 'package:my_flutter_proj_dq/demo_main.dart';
import 'package:my_flutter_proj_dq/domain/models/profile_settings.dart';
import 'package:my_flutter_proj_dq/domain/models/rag_stream_event.dart';

void main() {
  test('demo settings reject attempts to enable a live backend', () async {
    final repository = DemoSettingsRepository();
    await repository.saveSettings(ProfileSettings.defaults().copyWith(
      sseEndpoint: 'https://example.invalid/live', apiKey: 'unused',
      useOfflineSimulation: false,
    ));
    final settings = await repository.loadSettings();
    expect(settings.useOfflineSimulation, isTrue);
    expect(settings.sseEndpoint, isEmpty);
    expect(settings.apiKey, isEmpty);
    expect(settings.isGuest, isTrue);
  });

  test('demo streams sample answers even when supplied a live endpoint', () async {
    final repository = DemoRagRepository();
    final events = await repository.queryStream('Explain RAG',
      sseUrl: 'https://example.invalid/live',
      additionalParams: {'useOfflineSimulation': false},
    ).toList();
    expect(events.whereType<CitationsEvent>(), isNotEmpty);
    expect(events.whereType<AnswerChunkEvent>(), isNotEmpty);
    expect(events.last, isA<StreamDoneEvent>());
    expect(events.whereType<StreamErrorEvent>(), isEmpty);
  });
}
