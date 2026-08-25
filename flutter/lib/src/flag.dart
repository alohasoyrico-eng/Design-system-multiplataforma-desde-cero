import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

enum FlowFlagShape { circle, rounded, square }

class FlowFlag extends StatelessWidget {
  final String country;
  final double size;
  final FlowFlagShape shape;
  final String? label;
  final bool ring;

  const FlowFlag({
    super.key,
    required this.country,
    this.size = 20,
    this.shape = FlowFlagShape.circle,
    this.label,
    this.ring = true,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    final emoji = _countryToEmoji(country);

    final borderRadius = switch (shape) {
      FlowFlagShape.circle => BorderRadius.circular(FlowRadius.pill),
      FlowFlagShape.rounded => BorderRadius.circular(4),
      FlowFlagShape.square => BorderRadius.zero,
    };

    return Semantics(
      label: label ?? country.toUpperCase(),
      child: Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          borderRadius: borderRadius,
          border: ring
              ? Border.all(color: scheme.borderSubtle, width: 1)
              : null,
        ),
        child: ClipRRect(
          borderRadius: borderRadius,
          child: Center(
            child: Text(
              emoji,
              style: TextStyle(fontSize: size * 0.7),
            ),
          ),
        ),
      ),
    );
  }

  static String _countryToEmoji(String code) {
    final upper = code.toUpperCase();
    if (upper.length != 2) return '🏳';
    final a = upper.codeUnitAt(0) - 0x41 + 0x1F1E6;
    final b = upper.codeUnitAt(1) - 0x41 + 0x1F1E6;
    return String.fromCharCodes([a, b]);
  }
}
