import 'dart:math';
import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowBulletRow {
  final String label;
  final double value;
  final double target;
  final double? prev;
  final double? max;

  const FlowBulletRow({
    required this.label,
    required this.value,
    required this.target,
    this.prev,
    this.max,
  });
}

class FlowBulletChart extends StatelessWidget {
  final List<FlowBulletRow> rows;
  final String Function(double)? format;

  const FlowBulletChart({
    super.key,
    required this.rows,
    this.format,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        for (int i = 0; i < rows.length; i++) ...[
          if (i > 0) const SizedBox(height: FlowSpace.s3),
          _buildRow(rows[i], scheme),
        ],
      ],
    );
  }

  Widget _buildRow(FlowBulletRow row, FlowScheme scheme) {
    final ceiling = row.max ?? [row.value, row.target, row.prev ?? 0].reduce(max) * 1.2;
    final fmt = format ?? (v) => v.toStringAsFixed(0);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              row.label,
              style: TextStyle(
                fontSize: FlowFontSize.bodySm,
                fontWeight: FontWeight.w600,
                color: scheme.textPrimary,
              ),
            ),
            Text(
              fmt(row.value),
              style: TextStyle(
                fontSize: FlowFontSize.bodySm,
                color: scheme.textSecondary,
              ),
            ),
          ],
        ),
        const SizedBox(height: FlowSpace.s1),
        SizedBox(
          height: 24,
          child: LayoutBuilder(
            builder: (ctx, constraints) {
              final w = constraints.maxWidth;
              return Stack(
                children: [
                  Container(
                    width: w,
                    height: 24,
                    decoration: BoxDecoration(
                      color: scheme.surfaceSunken,
                      borderRadius: BorderRadius.circular(4),
                    ),
                  ),
                  if (row.prev != null)
                    Container(
                      width: (row.prev! / ceiling * w).clamp(0, w),
                      height: 24,
                      decoration: BoxDecoration(
                        color: scheme.borderSubtle,
                        borderRadius: BorderRadius.circular(4),
                      ),
                    ),
                  Container(
                    width: (row.value / ceiling * w).clamp(0, w),
                    height: 24,
                    decoration: BoxDecoration(
                      color: scheme.actionAccent,
                      borderRadius: BorderRadius.circular(4),
                    ),
                  ),
                  Positioned(
                    left: (row.target / ceiling * w).clamp(0, w - 2),
                    top: 0,
                    bottom: 0,
                    child: Container(
                      width: 2,
                      color: scheme.textPrimary,
                    ),
                  ),
                ],
              );
            },
          ),
        ),
      ],
    );
  }
}
