import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowSpinner extends StatelessWidget {
  final double size;
  final Color? color;
  final String label;

  const FlowSpinner({
    super.key,
    this.size = 20,
    this.color,
    this.label = 'Cargando',
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    final c = color ?? scheme.actionAccent;
    final strokeWidth = (size / 9).clamp(2.0, double.infinity);

    return Semantics(
      label: label,
      child: SizedBox(
        width: size,
        height: size,
        child: CircularProgressIndicator(
          strokeWidth: strokeWidth,
          valueColor: AlwaysStoppedAnimation(c),
        ),
      ),
    );
  }
}
