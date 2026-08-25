import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

enum FlowDividerOrientation { horizontal, vertical }

class FlowDivider extends StatelessWidget {
  final FlowDividerOrientation orientation;
  final String? label;

  const FlowDivider({
    super.key,
    this.orientation = FlowDividerOrientation.horizontal,
    this.label,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;

    if (orientation == FlowDividerOrientation.vertical) {
      return Container(
        width: 1,
        color: scheme.borderSubtle,
      );
    }

    if (label != null) {
      return Row(
        children: [
          Expanded(child: Container(height: 1, color: scheme.borderSubtle)),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: FlowSpace.s3),
            child: Text(
              label!,
              style: TextStyle(
                fontSize: FlowFontSize.bodySm,
                fontWeight: FontWeight.w500,
                color: scheme.textMuted,
              ),
            ),
          ),
          Expanded(child: Container(height: 1, color: scheme.borderSubtle)),
        ],
      );
    }

    return Container(height: 1, color: scheme.borderSubtle);
  }
}
