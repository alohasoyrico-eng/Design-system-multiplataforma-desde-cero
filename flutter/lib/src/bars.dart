import 'dart:math';
import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowBarsDataPoint {
  final String label;
  final double value;

  const FlowBarsDataPoint({required this.label, required this.value});
}

class FlowBars extends StatelessWidget {
  final List<FlowBarsDataPoint> data;
  final double height;
  final Color? color;
  final String Function(double)? format;

  const FlowBars({
    super.key,
    this.data = const [],
    this.height = 200,
    this.color,
    this.format,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    if (data.isEmpty) return SizedBox(height: height);
    final maxVal = data.map((d) => d.value).reduce(max);

    return SizedBox(
      height: height,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          for (int i = 0; i < data.length; i++) ...[
            if (i > 0) const SizedBox(width: FlowSpace.s1),
            Expanded(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  Text(
                    format != null
                        ? format!(data[i].value)
                        : data[i].value.toStringAsFixed(0),
                    style: TextStyle(
                      fontSize: FlowFontSize.labelSm,
                      color: scheme.textMuted,
                    ),
                  ),
                  const SizedBox(height: FlowSpace.s1),
                  AnimatedContainer(
                    duration: FlowDuration.base,
                    height: maxVal > 0
                        ? (data[i].value / maxVal) * (height - 40)
                        : 0,
                    decoration: BoxDecoration(
                      color: color ?? scheme.actionAccent,
                      borderRadius: const BorderRadius.vertical(
                        top: Radius.circular(4),
                      ),
                    ),
                  ),
                  const SizedBox(height: FlowSpace.s1),
                  Text(
                    data[i].label,
                    style: TextStyle(
                      fontSize: FlowFontSize.labelSm,
                      color: scheme.textMuted,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }
}
