import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowCard extends StatelessWidget {
  final Widget child;
  final double? padding;
  final VoidCallback? onTap;

  const FlowCard({
    super.key,
    required this.child,
    this.padding,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    final p = padding ?? FlowSpace.s4;

    return Material(
      color: scheme.surfaceCard,
      borderRadius: BorderRadius.circular(FlowRadius.lg),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(FlowRadius.lg),
        child: Container(
          padding: EdgeInsets.all(p),
          decoration: BoxDecoration(
            border: Border.all(color: scheme.borderSubtle, width: 1),
            borderRadius: BorderRadius.circular(FlowRadius.lg),
          ),
          child: child,
        ),
      ),
    );
  }
}
