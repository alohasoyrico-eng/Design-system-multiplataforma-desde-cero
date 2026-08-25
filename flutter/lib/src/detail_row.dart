import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowDetailRow extends StatelessWidget {
  final String label;
  final String value;
  final bool mono;

  const FlowDetailRow({
    super.key,
    required this.label,
    required this.value,
    this.mono = false,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: FlowFontSize.bodyMd,
            color: scheme.textSecondary,
          ),
        ),
        const SizedBox(width: FlowSpace.s3),
        Flexible(
          child: Text(
            value,
            style: TextStyle(
              fontSize: FlowFontSize.bodyMd,
              fontWeight: FontWeight.w600,
              color: scheme.textPrimary,
              fontFamily: mono ? FlowFontFamily.mono : null,
              fontFeatures: mono ? const [FontFeature.tabularFigures()] : null,
            ),
            textAlign: TextAlign.end,
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }
}
