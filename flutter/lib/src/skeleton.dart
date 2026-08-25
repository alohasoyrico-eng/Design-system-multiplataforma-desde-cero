import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

enum FlowSkeletonVariant { text, title, card, circle }

class FlowSkeleton extends StatefulWidget {
  final FlowSkeletonVariant variant;
  final double? width;
  final double? height;

  const FlowSkeleton({
    super.key,
    this.variant = FlowSkeletonVariant.text,
    this.width,
    this.height,
  });

  @override
  State<FlowSkeleton> createState() => _FlowSkeletonState();
}

class _FlowSkeletonState extends State<FlowSkeleton>
    with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl;
  late final Animation<double> _opacity;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat(reverse: true);
    _opacity = Tween(begin: 0.3, end: 0.6).animate(
      CurvedAnimation(parent: _ctrl, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;

    double w, h;
    double radius;
    BoxShape shape = BoxShape.rectangle;

    switch (widget.variant) {
      case FlowSkeletonVariant.text:
        w = widget.width ?? 160;
        h = widget.height ?? 14;
        radius = FlowRadius.xs;
      case FlowSkeletonVariant.title:
        w = widget.width ?? 200;
        h = widget.height ?? 22;
        radius = FlowRadius.xs;
      case FlowSkeletonVariant.card:
        w = widget.width ?? double.infinity;
        h = widget.height ?? 120;
        radius = FlowRadius.lg;
      case FlowSkeletonVariant.circle:
        w = widget.width ?? 40;
        h = widget.height ?? 40;
        radius = 0;
        shape = BoxShape.circle;
    }

    return FadeTransition(
      opacity: _opacity,
      child: Container(
        width: w,
        height: h,
        decoration: BoxDecoration(
          color: scheme.borderSubtle,
          borderRadius: shape == BoxShape.circle
              ? null
              : BorderRadius.circular(radius),
          shape: shape,
        ),
      ),
    );
  }
}
