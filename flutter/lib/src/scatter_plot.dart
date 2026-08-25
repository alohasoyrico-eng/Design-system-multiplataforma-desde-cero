import 'dart:math';
import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowScatterPoint {
  final String id;
  final double x;
  final double y;
  final String? label;

  const FlowScatterPoint({
    required this.id,
    required this.x,
    required this.y,
    this.label,
  });
}

class FlowScatterPlot extends StatelessWidget {
  final List<FlowScatterPoint> points;
  final String? xLabel;
  final String? yLabel;
  final double? xThreshold;
  final double? yThreshold;
  final double height;
  final String? selectedId;
  final ValueChanged<FlowScatterPoint>? onSelect;

  const FlowScatterPlot({
    super.key,
    this.points = const [],
    this.xLabel,
    this.yLabel,
    this.xThreshold,
    this.yThreshold,
    this.height = 260,
    this.selectedId,
    this.onSelect,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    if (points.isEmpty) return SizedBox(height: height);

    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          height: height,
          child: LayoutBuilder(
            builder: (ctx, constraints) => CustomPaint(
              size: Size(constraints.maxWidth, height),
              painter: _ScatterPainter(
                points: points,
                scheme: scheme,
                xThreshold: xThreshold,
                yThreshold: yThreshold,
                selectedId: selectedId,
              ),
            ),
          ),
        ),
        if (xLabel != null || yLabel != null)
          Padding(
            padding: const EdgeInsets.only(top: FlowSpace.s2),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                if (xLabel != null)
                  Text(
                    xLabel!,
                    style: TextStyle(
                      fontSize: FlowFontSize.bodySm,
                      color: scheme.textMuted,
                    ),
                  ),
                if (yLabel != null)
                  Text(
                    yLabel!,
                    style: TextStyle(
                      fontSize: FlowFontSize.bodySm,
                      color: scheme.textMuted,
                    ),
                  ),
              ],
            ),
          ),
      ],
    );
  }
}

class _ScatterPainter extends CustomPainter {
  final List<FlowScatterPoint> points;
  final FlowScheme scheme;
  final double? xThreshold;
  final double? yThreshold;
  final String? selectedId;

  _ScatterPainter({
    required this.points,
    required this.scheme,
    this.xThreshold,
    this.yThreshold,
    this.selectedId,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final xs = points.map((p) => p.x);
    final ys = points.map((p) => p.y);
    final xMin = xs.reduce(min);
    final xMax = xs.reduce(max);
    final yMin = ys.reduce(min);
    final yMax = ys.reduce(max);
    final xRange = (xMax - xMin).clamp(1, double.infinity);
    final yRange = (yMax - yMin).clamp(1, double.infinity);
    const pad = 20.0;

    final gridPaint = Paint()
      ..color = scheme.borderSubtle
      ..strokeWidth = 1;
    canvas.drawLine(
      Offset(pad, size.height - pad),
      Offset(size.width, size.height - pad),
      gridPaint,
    );
    canvas.drawLine(
      Offset(pad, 0),
      Offset(pad, size.height - pad),
      gridPaint,
    );

    if (xThreshold != null) {
      final tx = pad + ((xThreshold! - xMin) / xRange) * (size.width - pad * 2);
      canvas.drawLine(
        Offset(tx, 0),
        Offset(tx, size.height - pad),
        Paint()
          ..color = scheme.borderDefault
          ..strokeWidth = 1
          ..style = PaintingStyle.stroke,
      );
    }

    if (yThreshold != null) {
      final ty = size.height - pad - ((yThreshold! - yMin) / yRange) * (size.height - pad * 2);
      canvas.drawLine(
        Offset(pad, ty),
        Offset(size.width, ty),
        Paint()
          ..color = scheme.borderDefault
          ..strokeWidth = 1
          ..style = PaintingStyle.stroke,
      );
    }

    for (final p in points) {
      final cx = pad + ((p.x - xMin) / xRange) * (size.width - pad * 2);
      final cy = size.height - pad - ((p.y - yMin) / yRange) * (size.height - pad * 2);
      final isSelected = p.id == selectedId;
      canvas.drawCircle(
        Offset(cx, cy),
        isSelected ? 6 : 4,
        Paint()..color = isSelected ? scheme.actionAccent : scheme.actionAccent.withValues(alpha: 0.6),
      );
    }
  }

  @override
  bool shouldRepaint(covariant _ScatterPainter old) => true;
}
