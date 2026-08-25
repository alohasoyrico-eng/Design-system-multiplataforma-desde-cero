import 'package:flutter/material.dart';
import 'flow_tokens.dart';

class FlowTreemapNode {
  final String label;
  final double value;
  final double? deviation;

  const FlowTreemapNode({
    required this.label,
    required this.value,
    this.deviation,
  });
}

class FlowTreemap extends StatelessWidget {
  final List<FlowTreemapNode> nodes;
  final double height;
  final String Function(double)? format;
  final ValueChanged<FlowTreemapNode>? onDrill;

  const FlowTreemap({
    super.key,
    this.nodes = const [],
    this.height = 280,
    this.format,
    this.onDrill,
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
    if (nodes.isEmpty) return SizedBox(height: height);

    final total = nodes.fold<double>(0, (s, n) => s + n.value);
    final sorted = List<FlowTreemapNode>.from(nodes)
      ..sort((a, b) => b.value.compareTo(a.value));

    return SizedBox(
      height: height,
      child: LayoutBuilder(
        builder: (ctx, constraints) {
          final rects = _layout(sorted, total, constraints.maxWidth, height);
          return Stack(
            children: [
              for (int i = 0; i < sorted.length; i++)
                Positioned(
                  left: rects[i].left,
                  top: rects[i].top,
                  width: rects[i].width,
                  height: rects[i].height,
                  child: GestureDetector(
                    onTap: onDrill != null ? () => onDrill!(sorted[i]) : null,
                    child: Container(
                      margin: const EdgeInsets.all(1),
                      decoration: BoxDecoration(
                        color: _palette[i % _palette.length].withValues(alpha: 0.8),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      padding: const EdgeInsets.all(FlowSpace.s2),
                      child: rects[i].width > 60 && rects[i].height > 40
                          ? Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text(
                                  sorted[i].label,
                                  style: const TextStyle(
                                    fontSize: FlowFontSize.bodySm,
                                    fontWeight: FontWeight.w600,
                                    color: Colors.white,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                Text(
                                  format != null
                                      ? format!(sorted[i].value)
                                      : sorted[i].value.toStringAsFixed(0),
                                  style: const TextStyle(
                                    fontSize: FlowFontSize.labelSm,
                                    color: Colors.white70,
                                  ),
                                ),
                              ],
                            )
                          : null,
                    ),
                  ),
                ),
            ],
          );
        },
      ),
    );
  }

  List<Rect> _layout(
    List<FlowTreemapNode> items,
    double total,
    double w,
    double h,
  ) {
    final rects = <Rect>[];
    var x = 0.0, y = 0.0;
    var remainW = w, remainH = h;
    var remainTotal = total;

    for (final item in items) {
      final fraction = item.value / remainTotal;
      if (remainW >= remainH) {
        final cellW = remainW * fraction;
        rects.add(Rect.fromLTWH(x, y, cellW, remainH));
        x += cellW;
        remainW -= cellW;
      } else {
        final cellH = remainH * fraction;
        rects.add(Rect.fromLTWH(x, y, remainW, cellH));
        y += cellH;
        remainH -= cellH;
      }
      remainTotal -= item.value;
      if (remainTotal <= 0) break;
    }

    return rects;
  }
}
