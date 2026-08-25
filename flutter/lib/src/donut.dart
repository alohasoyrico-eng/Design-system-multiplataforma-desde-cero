import 'dart:math';
import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowDonutSegment {
  final String label;
  final double value;
  final Color? color;

  const FlowDonutSegment({
    required this.label,
    required this.value,
    this.color,
  });
}

class FlowDonut extends StatelessWidget {
  final List<FlowDonutSegment> segments;
  final double size;
  final double thickness;
  final String? centerLabel;
  final String? centerValue;
  final bool legend;

  const FlowDonut({
    super.key,
    this.segments = const [],
    this.size = 160,
    this.thickness = 24,
    this.centerLabel,
    this.centerValue,
    this.legend = true,
  });

  static const _palette = [
    Color(0xFFFF3617),
    Color(0xFF2E7CF6),
    Color(0xFF12B76A),
    Color(0xFFF79009),
    Color(0xFF7C3AED),
    Color(0xFFEC4899),
  ];

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        SizedBox(
          width: size,
          height: size,
          child: CustomPaint(
            painter: _DonutPainter(
              segments: segments,
              thickness: thickness,
              palette: _palette,
            ),
            child: Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (centerValue != null)
                    Text(
                      centerValue!,
                      style: TextStyle(
                        fontSize: FlowFontSize.headlineLg,
                        fontWeight: FontWeight.w700,
                        color: scheme.textPrimary,
                      ),
                    ),
                  if (centerLabel != null)
                    Text(
                      centerLabel!,
                      style: TextStyle(
                        fontSize: FlowFontSize.bodySm,
                        color: scheme.textMuted,
                      ),
                    ),
                ],
              ),
            ),
          ),
        ),
        if (legend && segments.isNotEmpty) ...[
          const SizedBox(width: FlowSpace.s4),
          Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              for (int i = 0; i < segments.length; i++)
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 2),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 10,
                        height: 10,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: segments[i].color ??
                              _palette[i % _palette.length],
                        ),
                      ),
                      const SizedBox(width: FlowSpace.s2),
                      Text(
                        segments[i].label,
                        style: TextStyle(
                          fontSize: FlowFontSize.bodySm,
                          color: scheme.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
            ],
          ),
        ],
      ],
    );
  }
}

class _DonutPainter extends CustomPainter {
  final List<FlowDonutSegment> segments;
  final double thickness;
  final List<Color> palette;

  _DonutPainter({
    required this.segments,
    required this.thickness,
    required this.palette,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final total = segments.fold<double>(0, (s, seg) => s + seg.value);
    if (total == 0) return;

    final center = Offset(size.width / 2, size.height / 2);
    final radius = min(size.width, size.height) / 2;
    final rect = Rect.fromCircle(center: center, radius: radius - thickness / 2);

    var startAngle = -pi / 2;
    for (int i = 0; i < segments.length; i++) {
      final sweep = 2 * pi * (segments[i].value / total);
      final paint = Paint()
        ..color = segments[i].color ?? palette[i % palette.length]
        ..style = PaintingStyle.stroke
        ..strokeWidth = thickness
        ..strokeCap = StrokeCap.butt;
      canvas.drawArc(rect, startAngle, sweep - 0.02, false, paint);
      startAngle += sweep;
    }
  }

  @override
  bool shouldRepaint(covariant _DonutPainter old) =>
      old.segments != segments || old.thickness != thickness;
}
