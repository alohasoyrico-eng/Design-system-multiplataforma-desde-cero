import 'dart:math';
import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowSparkline extends StatelessWidget {
  final List<double> values;
  final double width;
  final double height;
  final Color? color;
  final bool showDot;

  const FlowSparkline({
    super.key,
    this.values = const [],
    this.width = 120,
    this.height = 40,
    this.color,
    this.showDot = true,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    final c = color ?? scheme.actionAccent;

    return CustomPaint(
      size: Size(width, height),
      painter: _SparklinePainter(
        values: values,
        color: c,
        showDot: showDot,
      ),
    );
  }
}

class _SparklinePainter extends CustomPainter {
  final List<double> values;
  final Color color;
  final bool showDot;

  const _SparklinePainter({
    required this.values,
    required this.color,
    required this.showDot,
  });

  @override
  void paint(Canvas canvas, Size size) {
    if (values.length < 2) return;

    final minV = values.reduce(min);
    final maxV = values.reduce(max);
    final range = maxV - minV;
    const pad = 4.0;

    final points = <Offset>[];
    for (int i = 0; i < values.length; i++) {
      final x = pad + (size.width - pad * 2) * i / (values.length - 1);
      final y = range == 0
          ? size.height / 2
          : pad + (size.height - pad * 2) * (1 - (values[i] - minV) / range);
      points.add(Offset(x, y));
    }

    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    final path = Path()..moveTo(points.first.dx, points.first.dy);
    for (int i = 1; i < points.length; i++) {
      path.lineTo(points[i].dx, points[i].dy);
    }
    canvas.drawPath(path, paint);

    if (showDot && points.isNotEmpty) {
      canvas.drawCircle(
        points.last,
        3,
        Paint()..color = color,
      );
    }
  }

  @override
  bool shouldRepaint(covariant _SparklinePainter old) =>
      values != old.values || color != old.color || showDot != old.showDot;
}
