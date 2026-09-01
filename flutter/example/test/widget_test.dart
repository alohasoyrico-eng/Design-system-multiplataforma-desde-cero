import 'package:flutter_test/flutter_test.dart';

import 'package:flow_ds_example/main.dart';

void main() {
  testWidgets('App renders the template index', (WidgetTester tester) async {
    await tester.pumpWidget(const FlowExampleApp());
    expect(find.text('Flow Templates'), findsOneWidget);
  });
}
