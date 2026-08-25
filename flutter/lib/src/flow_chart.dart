import 'dart:math';
import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

enum FlowChartType {
  line, area, bar, stackedBar, stacked100,
  donut, pie, scatter, heatmap, radar,
  waterfall, pareto, gauge, funnel, treemap, boxplot,
}

class FlowChartSeries {
  final String label;
  final List<double> values;
  final Color? color;

  const FlowChartSeries({
    required this.label,
    this.values = const [],
    this.color,
  });
}

class FlowChart extends StatelessWidget {
  final FlowChartType type;
  final List<FlowChartSeries> series;
  final List<String>? labels;
  final double height;
  final bool legend;
  final bool animate;
  final bool loading;
  final String? emptyLabel;

  const FlowChart({
    super.key,
    this.type = FlowChartType.line,
    this.series = const [],
    this.labels,
    this.height = 280,
    this.legend = false,
    this.animate = true,
    this.loading = false,
    this.emptyLabel,
  });

  static const _palette = [
    Color(0xFFFF3617),
    Color(0xFF2E7CF6),
    Color(0xFF12B76A),
    Color(0xFFF79009),
    Color(0xFF7C3AED),
    Color(0xFFEC4899),
    Color(0xFF06B6D4),
    Color(0xFFF43F5E),
  ];

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;

    if (loading) {
      return SizedBox(
        height: height,
        child: const Center(child: CircularProgressIndicator(strokeWidth: 2)),
      );
    }

    if (series.isEmpty || series.every((s) => s.values.isEmpty)) {
      return SizedBox(
        height: height,
        child: Center(
          child: Text(
            emptyLabel ?? 'No data',
            style: TextStyle(
              fontSize: FlowFontSize.bodyMd,
              color: scheme.textMuted,
            ),
          ),
        ),
      );
    }

    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          height: height,
          child: LayoutBuilder(
            builder: (ctx, constraints) {
              return CustomPaint(
                size: Size(constraints.maxWidth, height),
                painter: _ChartPainter(
                  type: type,
                  series: series,
                  labels: labels,
                  scheme: scheme,
                  palette: _palette,
                ),
              );
            },
          ),
        ),
        if (legend && series.length > 1) ...[
          const SizedBox(height: FlowSpace.s3),
          Wrap(
            spacing: FlowSpace.s4,
            runSpacing: FlowSpace.s2,
            children: [
              for (int i = 0; i < series.length; i++)
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 10,
                      height: 10,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: series[i].color ?? _palette[i % _palette.length],
                      ),
                    ),
                    const SizedBox(width: FlowSpace.s1),
                    Text(
                      series[i].label,
                      style: TextStyle(
                        fontSize: FlowFontSize.bodySm,
                        color: scheme.textSecondary,
                      ),
                    ),
                  ],
                ),
            ],
          ),
        ],
      ],
    );
  }
}

class _ChartPainter extends CustomPainter {
  final FlowChartType type;
  final List<FlowChartSeries> series;
  final List<String>? labels;
  final FlowScheme scheme;
  final List<Color> palette;

  _ChartPainter({
    required this.type,
    required this.series,
    this.labels,
    required this.scheme,
    required this.palette,
  });

  @override
  void paint(Canvas canvas, Size size) {
    const pad = 32.0;
    final plotRect = Rect.fromLTRB(pad, 8, size.width - 8, size.height - pad);

    _drawGrid(canvas, plotRect);

    switch (type) {
      case FlowChartType.bar:
      case FlowChartType.stackedBar:
        _drawBars(canvas, plotRect);
      case FlowChartType.line:
      case FlowChartType.area:
        _drawLines(canvas, plotRect, area: type == FlowChartType.area);
      default:
        _drawLines(canvas, plotRect, area: false);
    }
  }

  void _drawGrid(Canvas canvas, Rect rect) {
    final gridPaint = Paint()
      ..color = scheme.borderSubtle
      ..strokeWidth = 1;

    canvas.drawLine(
      Offset(rect.left, rect.bottom),
      Offset(rect.right, rect.bottom),
      gridPaint,
    );
    canvas.drawLine(
      Offset(rect.left, rect.top),
      Offset(rect.left, rect.bottom),
      gridPaint,
    );

    for (int i = 1; i < 4; i++) {
      final y = rect.bottom - (i / 4) * rect.height;
      canvas.drawLine(
        Offset(rect.left, y),
        Offset(rect.right, y),
        Paint()
          ..color = scheme.borderSubtle.withValues(alpha: 0.5)
          ..strokeWidth = 0.5,
      );
    }
  }

  void _drawBars(Canvas canvas, Rect rect) {
    final allValues = series.expand((s) => s.values);
    if (allValues.isEmpty) return;
    final maxVal = allValues.reduce(max);
    if (maxVal == 0) return;
    final count = series.first.values.length;
    final barGroupWidth = rect.width / count;
    final barWidth = barGroupWidth * 0.6 / series.length;

    for (int s = 0; s < series.length; s++) {
      final color = series[s].color ?? palette[s % palette.length];
      for (int i = 0; i < series[s].values.length; i++) {
        final h = (series[s].values[i] / maxVal) * rect.height;
        final x = rect.left +
            i * barGroupWidth +
            barGroupWidth * 0.2 +
            s * barWidth;
        canvas.drawRRect(
          RRect.fromRectAndCorners(
            Rect.fromLTWH(x, rect.bottom - h, barWidth - 2, h),
            topLeft: const Radius.circular(3),
            topRight: const Radius.circular(3),
          ),
          Paint()..color = color,
        );
      }
    }
  }

  void _drawLines(Canvas canvas, Rect rect, {required bool area}) {
    final allValues = series.expand((s) => s.values);
    if (allValues.isEmpty) return;
    final maxVal = allValues.reduce(max);
    final minVal = allValues.reduce(min);
    final range = (maxVal - minVal).clamp(1, double.infinity);

    for (int s = 0; s < series.length; s++) {
      final vals = series[s].values;
      if (vals.isEmpty) continue;
      final color = series[s].color ?? palette[s % palette.length];
      final path = Path();

      for (int i = 0; i < vals.length; i++) {
        final x = rect.left + (i / (vals.length - 1).clamp(1, vals.length)) * rect.width;
        final y = rect.bottom - ((vals[i] - minVal) / range) * rect.height;
        if (i == 0) {
          path.moveTo(x, y);
        } else {
          path.lineTo(x, y);
        }
      }

      canvas.drawPath(
        path,
        Paint()
          ..color = color
          ..style = PaintingStyle.stroke
          ..strokeWidth = 2
          ..strokeJoin = StrokeJoin.round,
      );

      if (area) {
        final areaPath = Path.from(path);
        final lastX = rect.left +
            ((vals.length - 1) / (vals.length - 1).clamp(1, vals.length)) *
                rect.width;
        areaPath.lineTo(lastX, rect.bottom);
        areaPath.lineTo(rect.left, rect.bottom);
        areaPath.close();
        canvas.drawPath(
          areaPath,
          Paint()..color = color.withValues(alpha: 0.1),
        );
      }

      final lastX = rect.left +
          ((vals.length - 1) / (vals.length - 1).clamp(1, vals.length)) *
              rect.width;
      final lastY =
          rect.bottom - ((vals.last - minVal) / range) * rect.height;
      canvas.drawCircle(
        Offset(lastX, lastY),
        4,
        Paint()..color = color,
      );
    }
  }

  @override
  bool shouldRepaint(covariant _ChartPainter old) => true;
}
