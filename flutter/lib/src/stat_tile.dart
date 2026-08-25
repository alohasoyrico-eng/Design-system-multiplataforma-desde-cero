import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

enum FlowStatTone { neutral, success, warning, danger }

class FlowStatTile extends StatelessWidget {
  final String label;
  final String value;
  final String? delta;
  final IconData? icon;
  final FlowStatTone tone;

  const FlowStatTile({
    super.key,
    required this.label,
    required this.value,
    this.delta,
    this.icon,
    this.tone = FlowStatTone.neutral,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;

    Color toneColor;
    switch (tone) {
      case FlowStatTone.success:
        toneColor = FlowColors.green500;
      case FlowStatTone.warning:
        toneColor = FlowColors.orange500;
      case FlowStatTone.danger:
        toneColor = FlowColors.danger500;
      case FlowStatTone.neutral:
        toneColor = scheme.textMuted;
    }

    return Container(
      padding: const EdgeInsets.all(FlowSpace.s4),
      decoration: BoxDecoration(
        color: scheme.surfaceCard,
        border: Border.all(color: scheme.borderSubtle, width: 1),
        borderRadius: BorderRadius.circular(FlowRadius.lg),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            children: [
              if (icon != null) ...[
                Icon(icon, size: 18, color: toneColor),
                const SizedBox(width: FlowSpace.s2),
              ],
              Text(
                label,
                style: TextStyle(
                  fontSize: FlowFontSize.bodySm,
                  color: scheme.textSecondary,
                ),
              ),
            ],
          ),
          const SizedBox(height: FlowSpace.s2),
          Text(
            value,
            style: TextStyle(
              fontSize: FlowFontSize.dataLg,
              fontWeight: FontWeight.w700,
              color: scheme.textPrimary,
              fontFamily: FlowFontFamily.mono,
            ),
          ),
          if (delta != null) ...[
            const SizedBox(height: FlowSpace.s1),
            Text(
              delta!,
              style: TextStyle(
                fontSize: FlowFontSize.bodySm,
                color: delta!.startsWith('+') || delta!.startsWith('↑')
                    ? FlowColors.green500
                    : delta!.startsWith('-') || delta!.startsWith('−')
                        ? FlowColors.danger500
                        : scheme.textMuted,
              ),
            ),
          ],
        ],
      ),
    );
  }
}
