import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowParetoItem {
  final String label;
  final double value;

  const FlowParetoItem({required this.label, required this.value});
}

class FlowParetoChart extends StatelessWidget {
  final List<FlowParetoItem> data;
  final double height;
  final String Function(double)? format;
  final double threshold;

  const FlowParetoChart({
    super.key,
    this.data = const [],
    this.height = 240,
    this.format,
    this.threshold = 0.8,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    if (data.isEmpty) return SizedBox(height: height);

    final sorted = List<FlowParetoItem>.from(data)
      ..sort((a, b) => b.value.compareTo(a.value));
    final total = sorted.fold<double>(0, (s, d) => s + d.value);
    if (total == 0) return SizedBox(height: height);
    final maxVal = sorted.first.value;

    return SizedBox(
      height: height,
      child: LayoutBuilder(
        builder: (ctx, constraints) {
          return CustomPaint(
            size: Size(constraints.maxWidth, height),
            painter: _ParetoPainter(
              items: sorted,
              total: total,
              maxVal: maxVal,
              threshold: threshold,
              scheme: scheme,
            ),
          );
        },
      ),
    );
  }
}

class _ParetoPainter extends CustomPainter {
  final List<FlowParetoItem> items;
  final double total;
  final double maxVal;
  final double threshold;
  final FlowScheme scheme;

  _ParetoPainter({
    required this.items,
    required this.total,
    required this.maxVal,
    required this.threshold,
    required this.scheme,
  });

  @override
  void paint(Canvas canvas, Size size) {
    const pad = 32.0;
    final plotRect = Rect.fromLTRB(pad, 8, size.width - 8, size.height - pad);
    final barWidth = plotRect.width / items.length * 0.7;

    var cumulative = 0.0;
    final linePath = Path();

    for (int i = 0; i < items.length; i++) {
      final fractionBefore = cumulative / total;
      final h = (items[i].value / maxVal) * plotRect.height;
      final x = plotRect.left + (i + 0.5) * plotRect.width / items.length;

      canvas.drawRRect(
        RRect.fromRectAndCorners(
          Rect.fromCenter(
            center: Offset(x, plotRect.bottom - h / 2),
            width: barWidth,
            height: h,
          ),
          topLeft: const Radius.circular(3),
          topRight: const Radius.circular(3),
        ),
        Paint()
          ..color = fractionBefore < threshold
              ? scheme.actionAccent
              : scheme.borderDefault,
      );

      cumulative += items[i].value;
      final cy = plotRect.bottom - (cumulative / total) * plotRect.height;
      if (i == 0) {
        linePath.moveTo(x, cy);
      } else {
        linePath.lineTo(x, cy);
      }
    }

    canvas.drawPath(
      linePath,
      Paint()
        ..color = scheme.textPrimary
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2
        ..strokeJoin = StrokeJoin.round,
    );

    final thresholdY =
        plotRect.bottom - threshold * plotRect.height;
    canvas.drawLine(
      Offset(plotRect.left, thresholdY),
      Offset(plotRect.right, thresholdY),
      Paint()
        ..color = scheme.borderStrong
        ..strokeWidth = 1
        ..style = PaintingStyle.stroke,
    );
  }

  @override
  bool shouldRepaint(covariant _ParetoPainter old) => true;
}
