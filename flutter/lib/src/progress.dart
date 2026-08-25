import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowProgress extends StatelessWidget {
  final double value;
  final double max;
  final String? label;
  final bool showValue;
  final bool warning;

  const FlowProgress({
    super.key,
    this.value = 0,
    this.max = 100,
    this.label,
    this.showValue = false,
    this.warning = false,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    final pct = (value / max).clamp(0.0, 1.0);
    final barColor = warning ? FlowColors.orange500 : scheme.actionAccent;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (label != null || showValue)
          Padding(
            padding: const EdgeInsets.only(bottom: FlowSpace.s1),
            child: Row(
              children: [
                if (label != null)
                  Text(
                    label!,
                    style: TextStyle(
                      fontSize: FlowFontSize.bodySm,
                      color: scheme.textSecondary,
                    ),
                  ),
                const Spacer(),
                if (showValue)
                  Text(
                    '${value.toInt()}/${max.toInt()}',
                    style: TextStyle(
                      fontSize: FlowFontSize.bodySm,
                      fontWeight: FontWeight.w600,
                      color: scheme.textPrimary,
                    ),
                  ),
              ],
            ),
          ),
        Container(
          height: 5,
          decoration: BoxDecoration(
            color: scheme.surfaceSunken,
            borderRadius: BorderRadius.circular(FlowRadius.pill),
          ),
          child: FractionallySizedBox(
            alignment: Alignment.centerLeft,
            widthFactor: pct,
            child: Container(
              decoration: BoxDecoration(
                color: barColor,
                borderRadius: BorderRadius.circular(FlowRadius.pill),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
