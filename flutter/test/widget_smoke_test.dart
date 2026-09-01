import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flow_ds/flow_ds.dart';

Widget _harness(Widget child) {
  return MaterialApp(
    home: FlowTheme(
      scheme: FlowScheme.light,
      child: Scaffold(body: Center(child: child)),
    ),
  );
}

void main() {
  group('Smoke — primitives núcleo montan sin errores', () {
    testWidgets('FlowButton', (tester) async {
      await tester.pumpWidget(_harness(const FlowButton(label: 'Confirmar')));
      expect(find.text('Confirmar'), findsOneWidget);
    });

    testWidgets('FlowButton — todas las variantes y tamaños', (tester) async {
      for (final variant in FlowButtonVariant.values) {
        for (final size in FlowButtonSize.values) {
          await tester.pumpWidget(_harness(
            FlowButton(label: 'x', variant: variant, size: size),
          ));
          expect(tester.takeException(), isNull,
              reason: 'FlowButton $variant/$size lanzó excepción');
        }
      }
    });

    testWidgets('FlowBadge', (tester) async {
      await tester.pumpWidget(_harness(const FlowBadge(label: 'Nuevo')));
      expect(find.text('Nuevo'), findsOneWidget);
    });

    testWidgets('FlowChip', (tester) async {
      await tester.pumpWidget(_harness(const FlowChip(label: 'Filtro')));
      expect(find.text('Filtro'), findsOneWidget);
    });

    testWidgets('FlowSwitch', (tester) async {
      await tester.pumpWidget(_harness(const FlowSwitch(checked: true)));
      expect(tester.takeException(), isNull);
    });

    testWidgets('FlowCheckbox con label', (tester) async {
      await tester.pumpWidget(
          _harness(const FlowCheckbox(checked: true, label: 'Acepto')));
      expect(find.text('Acepto'), findsOneWidget);
    });

    testWidgets('FlowAvatar deriva iniciales', (tester) async {
      await tester.pumpWidget(_harness(const FlowAvatar(name: 'Marta Vidal')));
      expect(find.text('MV'), findsOneWidget);
    });

    testWidgets('FlowProgress en frame cero muestra su estado final',
        (tester) async {
      await tester.pumpWidget(_harness(const FlowProgress(value: 50)));
      expect(tester.takeException(), isNull);
    });

    testWidgets('FlowSpinner y FlowDivider', (tester) async {
      await tester.pumpWidget(_harness(const Column(
        children: [FlowSpinner(), FlowDivider()],
      )));
      expect(tester.takeException(), isNull);
    });
  });

  group('Interacción', () {
    testWidgets('FlowButton dispara onPressed', (tester) async {
      var pressed = false;
      await tester.pumpWidget(_harness(
        FlowButton(label: 'Tap', onPressed: () => pressed = true),
      ));
      await tester.tap(find.text('Tap'));
      expect(pressed, isTrue);
    });

    testWidgets('FlowSwitch emite onChange', (tester) async {
      bool? received;
      await tester.pumpWidget(_harness(
        FlowSwitch(checked: false, onChange: (v) => received = v),
      ));
      await tester.tap(find.byType(FlowSwitch));
      expect(received, isTrue);
    });
  });

  group('Tema', () {
    testWidgets('FlowTheme.of expone el esquema', (tester) async {
      late FlowScheme seen;
      await tester.pumpWidget(_harness(Builder(builder: (context) {
        seen = FlowTheme.of(context);
        return const SizedBox();
      })));
      expect(seen, FlowScheme.light);
    });

    testWidgets('los widgets montan también en dark', (tester) async {
      await tester.pumpWidget(const MaterialApp(
        home: FlowTheme(
          scheme: FlowScheme.dark,
          child: Scaffold(
            body: FlowButton(label: 'Dark'),
          ),
        ),
      ));
      expect(find.text('Dark'), findsOneWidget);
    });
  });
}
