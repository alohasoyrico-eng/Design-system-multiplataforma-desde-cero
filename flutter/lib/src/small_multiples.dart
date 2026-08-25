import 'dart:math';
import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowSmallMultiplesItem {
  final String id;
  final String label;
  final List<double> values;

  const FlowSmallMultiplesItem({
    required this.id,
    required this.label,
    required this.values,
  });
}

class FlowSmallMultiples extends StatelessWidget {
  final List<FlowSmallMultiplesItem> items;
  final double sparkHeight;
  final int columns;
  final bool Function(FlowSmallMultiplesItem)? isOutlier;
  final String Function(double)? format;
  final ValueChanged<FlowSmallMultiplesItem>? onSelect;
  final String? selectedId;

  const FlowSmallMultiples({
    super.key,
    required this.items,
    this.sparkHeight = 46,
    this.columns = 4,
    this.isOutlier,
    this.format,
    this.onSelect,
    this.selectedId,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;

    return Wrap(
      spacing: FlowSpace.s3,
      runSpacing: FlowSpace.s3,
      children: [
        for (final item in items)
          _buildCell(item, scheme),
      ],
    );
  }

  Widget _buildCell(FlowSmallMultiplesItem item, FlowScheme scheme) {
    final isSelected = selectedId == item.id;
    final outlier = isOutlier?.call(item) ?? false;
    final lastVal = item.values.isNotEmpty ? item.values.last : 0.0;
    final fmt = format ?? (v) => v.toStringAsFixed(0);

    return GestureDetector(
      onTap: onSelect != null ? () => onSelect!(item) : null,
      child: Container(
        width: 140,
        padding: const EdgeInsets.all(FlowSpace.s3),
        decoration: BoxDecoration(
          color: isSelected
              ? scheme.surfaceAccentSubtle
              : scheme.surfaceCard,
          borderRadius: BorderRadius.circular(FlowRadius.md),
          border: Border.all(
            color: outlier
                ? FlowColors.danger500
                : isSelected
                    ? scheme.actionAccent
                    : scheme.borderSubtle,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Flexible(
                  child: Text(
                    item.label,
                    style: TextStyle(
                      fontSize: FlowFontSize.bodySm,
                      color: scheme.textSecondary,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                Text(
                  fmt(lastVal),
                  style: TextStyle(
                    fontSize: FlowFontSize.bodySm,
                    fontWeight: FontWeight.w600,
                    color: scheme.textPrimary,
                  ),
                ),
              ],
            ),
            const SizedBox(height: FlowSpace.s2),
            SizedBox(
              height: sparkHeight,
              child: CustomPaint(
                size: Size(double.infinity, sparkHeight),
                painter: _MiniSparkPainter(
                  values: item.values,
                  color: outlier
                      ? FlowColors.danger500
                      : scheme.actionAccent,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _MiniSparkPainter extends CustomPainter {
  final List<double> values;
  final Color color;

  _MiniSparkPainter({required this.values, required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    if (values.length < 2) return;
    final maxV = values.reduce(max);
    final minV = values.reduce(min);
    final range = (maxV - minV).clamp(1, double.infinity);

    final path = Path();
    for (int i = 0; i < values.length; i++) {
      final x = i / (values.length - 1) * size.width;
      final y = size.height - ((values[i] - minV) / range) * size.height;
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
        ..strokeWidth = 1.5
        ..strokeJoin = StrokeJoin.round,
    );
  }

  @override
  bool shouldRepaint(covariant _MiniSparkPainter old) =>
      old.values != values || old.color != color;
}
