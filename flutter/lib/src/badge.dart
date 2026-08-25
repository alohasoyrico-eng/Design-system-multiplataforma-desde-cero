import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

enum FlowBadgeTone { neutral, success, warning, danger, info }

class FlowBadge extends StatelessWidget {
  final FlowBadgeTone tone;
  final IconData? icon;
  final bool live;
  final String? label;

  const FlowBadge({
    super.key,
    this.tone = FlowBadgeTone.neutral,
    this.icon,
    this.live = false,
    this.label,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;

    Color bg, fg;
    switch (tone) {
      case FlowBadgeTone.success:
        bg = FlowColors.green50;
        fg = FlowColors.green600;
      case FlowBadgeTone.warning:
        bg = FlowColors.orange50;
        fg = FlowColors.orange600;
      case FlowBadgeTone.danger:
        bg = FlowColors.danger50;
        fg = FlowColors.danger600;
      case FlowBadgeTone.info:
        bg = FlowColors.blue50;
        fg = FlowColors.blue600;
      case FlowBadgeTone.neutral:
        bg = scheme.surfaceSunken;
        fg = scheme.textSecondary;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: FlowSpace.s2, vertical: 3),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(FlowRadius.pill),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (live) ...[
            Container(
              width: 6,
              height: 6,
              decoration: BoxDecoration(shape: BoxShape.circle, color: fg),
            ),
            const SizedBox(width: FlowSpace.s2),
          ],
          if (icon != null) ...[
            Icon(icon, size: 14, color: fg),
            const SizedBox(width: FlowSpace.s1),
          ],
          if (label != null)
            Text(
              label!,
              style: TextStyle(
                fontSize: FlowFontSize.bodySm,
                fontWeight: FontWeight.w600,
                color: fg,
              ),
            ),
        ],
      ),
    );
  }
}
