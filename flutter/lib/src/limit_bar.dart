import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowLimitBar extends StatelessWidget {
  final String label;
  final int current;
  final int max;

  const FlowLimitBar({
    super.key,
    required this.label,
    required this.current,
    required this.max,
  });

  String _fmt(int n) {
    final s = n.toString();
    final buf = StringBuffer();
    for (var i = 0; i < s.length; i++) {
      if (i > 0 && (s.length - i) % 3 == 0) buf.write(',');
      buf.write(s[i]);
    }
    return buf.toString();
  }

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    final pct = max > 0 ? (current / max).clamp(0.0, 1.0) : 0.0;

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              label,
              style: TextStyle(
                fontSize: FlowFontSize.bodyMd,
                color: scheme.textPrimary,
              ),
            ),
            Text(
              '\$${_fmt(current)} / \$${_fmt(max)}',
              style: TextStyle(
                fontSize: FlowFontSize.bodyMd,
                color: scheme.textMuted,
              ),
            ),
          ],
        ),
        const SizedBox(height: FlowSpace.s1),
        ClipRRect(
          borderRadius: BorderRadius.circular(FlowRadius.pill),
          child: SizedBox(
            height: 4,
            child: Stack(
              children: [
                Container(color: scheme.surfaceSunken),
                FractionallySizedBox(
                  widthFactor: pct,
                  child: Container(color: scheme.actionAccent),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
