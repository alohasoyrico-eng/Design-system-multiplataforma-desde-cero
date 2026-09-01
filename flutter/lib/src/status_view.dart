import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';
import 'button.dart';

enum FlowStatusViewTone { success, warning, danger, info }

class FlowStatusView extends StatelessWidget {
  final FlowStatusViewTone tone;
  final IconData icon;
  final String title;
  final String? description;
  final String? actionLabel;
  final VoidCallback? onAction;

  const FlowStatusView({
    super.key,
    this.tone = FlowStatusViewTone.success,
    required this.icon,
    required this.title,
    this.description,
    this.actionLabel,
    this.onAction,
  });

  Color _toneColor() => switch (tone) {
    FlowStatusViewTone.success => FlowColors.green500,
    FlowStatusViewTone.warning => FlowColors.orange500,
    FlowStatusViewTone.danger => FlowColors.danger500,
    FlowStatusViewTone.info => FlowColors.blue500,
  };

  Color _toneBg() => switch (tone) {
    FlowStatusViewTone.success => FlowColors.green50,
    FlowStatusViewTone.warning => FlowColors.orange50,
    FlowStatusViewTone.danger => FlowColors.danger50,
    FlowStatusViewTone.info => FlowColors.blue50,
  };

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    final color = _toneColor();

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(FlowSpace.s8),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 64,
              height: 64,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: _toneBg(),
              ),
              child: Icon(icon, size: 32, color: color),
            ),
            const SizedBox(height: FlowSpace.s5),
            Text(
              title,
              style: TextStyle(
                fontSize: FlowFontSize.titleLg,
                fontWeight: FontWeight.w700,
                color: scheme.textPrimary,
              ),
              textAlign: TextAlign.center,
            ),
            if (description != null) ...[
              const SizedBox(height: FlowSpace.s2),
              Text(
                description!,
                style: TextStyle(
                  fontSize: FlowFontSize.bodyMd,
                  color: scheme.textSecondary,
                ),
                textAlign: TextAlign.center,
              ),
            ],
            if (actionLabel != null) ...[
              const SizedBox(height: FlowSpace.s6),
              FlowButton(
                label: actionLabel!,
                variant: FlowButtonVariant.primary,
                onPressed: onAction,
              ),
            ],
          ],
        ),
      ),
    );
  }
}
