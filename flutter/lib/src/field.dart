import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowField extends StatelessWidget {
  final String label;
  final String? hint;
  final String? error;
  final bool required;
  final Widget child;

  const FlowField({
    super.key,
    required this.label,
    this.hint,
    this.error,
    this.required = false,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      mainAxisSize: MainAxisSize.min,
      children: [
        Row(
          children: [
            Text(
              label,
              style: TextStyle(
                fontSize: FlowFontSize.bodySm,
                fontWeight: FontWeight.w600,
                color: scheme.textPrimary,
              ),
            ),
            if (required) ...[
              const SizedBox(width: 2),
              const Text('*', style: TextStyle(color: FlowColors.danger500, fontSize: FlowFontSize.bodySm)),
            ],
          ],
        ),
        const SizedBox(height: FlowSpace.s1),
        child,
        if (error != null) ...[
          const SizedBox(height: FlowSpace.s1),
          Text(
            error!,
            style: const TextStyle(
              fontSize: FlowFontSize.bodySm,
              color: FlowColors.danger500,
            ),
          ),
        ] else if (hint != null) ...[
          const SizedBox(height: FlowSpace.s1),
          Text(
            hint!,
            style: TextStyle(
              fontSize: FlowFontSize.bodySm,
              color: scheme.textMuted,
            ),
          ),
        ],
      ],
    );
  }
}
