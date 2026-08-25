import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowEmptyState extends StatelessWidget {
  final IconData? icon;
  final String? title;
  final String? description;
  final Widget? action;

  const FlowEmptyState({
    super.key,
    this.icon,
    this.title,
    this.description,
    this.action,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(FlowSpace.s8),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (icon != null)
              Icon(icon, size: 48, color: scheme.textMuted),
            if (title != null) ...[
              const SizedBox(height: FlowSpace.s4),
              Text(
                title!,
                style: TextStyle(
                  fontSize: FlowFontSize.titleLg,
                  fontWeight: FontWeight.w600,
                  color: scheme.textPrimary,
                ),
                textAlign: TextAlign.center,
              ),
            ],
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
            if (action != null) ...[
              const SizedBox(height: FlowSpace.s6),
              action!,
            ],
          ],
        ),
      ),
    );
  }
}
