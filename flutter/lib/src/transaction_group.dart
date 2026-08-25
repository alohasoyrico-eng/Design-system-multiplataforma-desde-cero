import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowTransactionGroup extends StatelessWidget {
  final String label;
  final List<Widget> children;

  const FlowTransactionGroup({
    super.key,
    required this.label,
    required this.children,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        Padding(
          padding: const EdgeInsets.only(
            top: FlowSpace.s3,
            bottom: FlowSpace.s1,
          ),
          child: Text(
            label.toUpperCase(),
            style: TextStyle(
              fontSize: FlowFontSize.bodySm,
              fontWeight: FontWeight.w600,
              color: scheme.textMuted,
              letterSpacing: 0.06 * FlowFontSize.bodySm,
            ),
          ),
        ),
        ...children,
      ],
    );
  }
}
