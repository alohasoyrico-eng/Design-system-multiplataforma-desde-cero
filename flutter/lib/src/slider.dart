import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowSlider extends StatelessWidget {
  final double value;
  final ValueChanged<double>? onChange;
  final double min;
  final double max;
  final int? divisions;
  final String? label;
  final String Function(double)? format;
  final bool disabled;

  const FlowSlider({
    super.key,
    this.value = 0,
    this.onChange,
    this.min = 0,
    this.max = 100,
    this.divisions,
    this.label,
    this.format,
    this.disabled = false,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    final fmt = format != null ? format!(value) : value.toStringAsFixed(0);

    return Opacity(
      opacity: disabled ? 0.5 : 1.0,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (label != null)
            Padding(
              padding: const EdgeInsets.only(bottom: FlowSpace.s2),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    label!,
                    style: TextStyle(
                      fontSize: FlowFontSize.data,
                      fontWeight: FontWeight.w600,
                      color: scheme.textPrimary,
                    ),
                  ),
                  Text(
                    fmt,
                    style: TextStyle(
                      fontFamily: FlowFontFamily.mono,
                      fontSize: FlowFontSize.data,
                      fontWeight: FontWeight.w600,
                      color: scheme.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
          SliderTheme(
            data: SliderThemeData(
              activeTrackColor: scheme.actionAccent,
              inactiveTrackColor: scheme.surfaceSunken,
              thumbColor: scheme.surfaceCard,
              overlayColor: scheme.actionAccent.withValues(alpha: 0.12),
              trackHeight: 6,
              thumbShape: _FlowThumbShape(scheme: scheme),
            ),
            child: Slider(
              value: value.clamp(min, max),
              min: min,
              max: max,
              divisions: divisions,
              onChanged: disabled ? null : onChange,
            ),
          ),
        ],
      ),
    );
  }
}

class _FlowThumbShape extends SliderComponentShape {
  final FlowScheme scheme;
  const _FlowThumbShape({required this.scheme});

  @override
  Size getPreferredSize(bool isEnabled, bool isDiscrete) =>
      const Size(22, 22);

  @override
  void paint(
    PaintingContext context,
    Offset center, {
    required Animation<double> activationAnimation,
    required Animation<double> enableAnimation,
    required bool isDiscrete,
    required TextPainter labelPainter,
    required RenderBox parentBox,
    required SliderThemeData sliderTheme,
    required TextDirection textDirection,
    required double value,
    required double textScaleFactor,
    required Size sizeWithOverflow,
  }) {
    final canvas = context.canvas;
    canvas.drawCircle(
      center,
      11,
      Paint()
        ..color = scheme.surfaceCard
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 2),
    );
    canvas.drawCircle(center, 11, Paint()..color = scheme.surfaceCard);
    canvas.drawCircle(
      center,
      11,
      Paint()
        ..color = scheme.actionAccent
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2,
    );
  }
}
