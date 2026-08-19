import 'package:flutter/material.dart';
import 'flow_tokens.dart';

class FlowTheme extends InheritedWidget {
  final FlowScheme scheme;

  const FlowTheme({
    super.key,
    required this.scheme,
    required super.child,
  });

  static FlowScheme of(BuildContext context) {
    final widget = context.dependOnInheritedWidgetOfExactType<FlowTheme>();
    assert(widget != null, 'No FlowTheme found in context');
    return widget!.scheme;
  }

  static FlowScheme? maybeOf(BuildContext context) {
    return context.dependOnInheritedWidgetOfExactType<FlowTheme>()?.scheme;
  }

  @override
  bool updateShouldNotify(FlowTheme oldWidget) => scheme != oldWidget.scheme;
}
