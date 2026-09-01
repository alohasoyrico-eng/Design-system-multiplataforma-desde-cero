import 'package:flutter_test/flutter_test.dart';
import 'package:flow_ds/flow_ds.dart';

/// Paridad con la fuente de verdad de tokens (generated/tokens/dart/*).
/// Si un valor cambia en Style Dictionary sin actualizar flow_tokens.dart,
/// este test lo detecta antes de que llegue a una pantalla.
void main() {
  group('FlowFontSize — escala tipográfica sincronizada con web', () {
    test('jerarquía de títulos', () {
      expect(FlowFontSize.displayLg, 48);
      expect(FlowFontSize.displayMd, 36);
      expect(FlowFontSize.headlineLg, 28);
      expect(FlowFontSize.titleLg, 20);
      expect(FlowFontSize.titleMd, 16);
    });

    test('body y labels', () {
      expect(FlowFontSize.bodyLg, 20);
      expect(FlowFontSize.bodyMd, 16);
      expect(FlowFontSize.bodyMdStrong, 16);
      expect(FlowFontSize.bodySm, 12);
      expect(FlowFontSize.labelSm, 11);
    });

    test('escala de datos (mono)', () {
      expect(FlowFontSize.dataXs, 11);
      expect(FlowFontSize.dataSm, 12);
      expect(FlowFontSize.data, 13);
      expect(FlowFontSize.dataMd, 20);
      expect(FlowFontSize.dataLg, 26);
      expect(FlowFontSize.dataXl, 28);
    });
  });

  group('FlowScheme — esquemas completos', () {
    test('light y dark difieren donde deben', () {
      expect(FlowScheme.light.surfaceCanvas, isNot(FlowScheme.dark.surfaceCanvas));
      expect(FlowScheme.light.textPrimary, isNot(FlowScheme.dark.textPrimary));
    });

    test('tokens nuevos presentes en ambos esquemas', () {
      expect(FlowScheme.light.textLink, isNotNull);
      expect(FlowScheme.dark.textLink, isNotNull);
      expect(FlowScheme.light.textOnInverse, isNotNull);
      expect(FlowScheme.dark.textOnInverse, isNotNull);
    });
  });

  group('FlowColors — paleta base', () {
    test('marca y acento', () {
      expect(FlowColors.red500.toARGB32(), 0xFFF72717);
      expect(FlowColors.blue500.toARGB32(), 0xFF0060DF);
    });
  });
}
