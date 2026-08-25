import 'dart:math';
import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

enum FlowCircularProgressTone { accent, success, warning, danger }

class FlowCircularProgress extends StatelessWidget {
  final double value;
  final double max;
  final double size;
  final double strokeWidth;
  final String? label;
  final bool showValue;
  final FlowCircularProgressTone tone;

  const FlowCircularProgress({
    super.key,
    this.value = 0,
    this.max = 100,
    this.size = 56,
    this.strokeWidth = 5,
    this.label,
    this.showValue = false,
    this.tone = FlowCircularProgressTone.accent,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    final pct = max > 0 ? (value / max).clamp(0.0, 1.0) : 0.0;

    final color = switch (tone) {
      FlowCircularProgressTone.accent => scheme.actionAccent,
      FlowCircularProgressTone.success => const Color(0xFF12B76A),
      FlowCircularProgressTone.warning => const Color(0xFFE8930C),
      FlowCircularProgressTone.danger => const Color(0xFFD92D20),
    };

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        SizedBox(
          width: size,
          height: size,
          child: CustomPaint(
            painter: _RingPainter(
              progress: pct,
              color: color,
              trackColor: scheme.borderSubtle,
              strokeWidth: strokeWidth,
            ),
            child: showValue
                ? Center(
                    child: Text(
                      '${(pct * 100).round()}%',
                      style: TextStyle(
                        fontSize: size * 0.22,
                        fontWeight: FontWeight.w700,
                        fontFamily: FlowFontFamily.mono,
                        color: scheme.textPrimary,
                      ),
                    ),
                  )
                : null,
          ),
        ),
        if (label != null) ...[
          const SizedBox(height: FlowSpace.s2),
          Text(
            label!,
            style: TextStyle(
              fontSize: FlowFontSize.bodySm,
              color: scheme.textSecondary,
            ),
          ),
        ],
      ],
    );
  }
}

class _RingPainter extends CustomPainter {
  final double progress;
  final Color color;
  final Color trackColor;
  final double strokeWidth;

  const _RingPainter({
    required this.progress,
    required this.color,
    required this.trackColor,
    required this.strokeWidth,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = (size.width - strokeWidth) / 2;

    canvas.drawCircle(
      center,
      radius,
      Paint()
        ..color = trackColor
        ..style = PaintingStyle.stroke
        ..strokeWidth = strokeWidth,
    );

    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      -pi / 2,
      2 * pi * progress,
      false,
      Paint()
        ..color = color
        ..style = PaintingStyle.stroke
        ..strokeWidth = strokeWidth
        ..strokeCap = StrokeCap.round,
    );
  }

  @override
  bool shouldRepaint(covariant _RingPainter old) =>
      progress != old.progress || color != old.color;
}
