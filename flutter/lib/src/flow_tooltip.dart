import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowTooltip extends StatelessWidget {
  final String content;
  final Widget child;

  const FlowTooltip({
    super.key,
    required this.content,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;

    return Tooltip(
      message: content,
      decoration: BoxDecoration(
        color: scheme.surfaceInverse,
        borderRadius: BorderRadius.circular(FlowRadius.xs),
      ),
      textStyle: TextStyle(
        fontSize: FlowFontSize.bodySm,
        color: scheme.textOnAccent,
        fontFamily: FlowFontFamily.body,
      ),
      padding: const EdgeInsets.symmetric(
        horizontal: FlowSpace.s3,
        vertical: FlowSpace.s2,
      ),
      waitDuration: FlowDuration.base,
      child: child,
    );
  }
}
