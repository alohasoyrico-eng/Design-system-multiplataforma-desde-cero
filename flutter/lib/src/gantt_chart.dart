import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowGanttTask {
  final String id;
  final String name;
  final DateTime start;
  final DateTime end;
  final double progress;
  final Color? color;

  const FlowGanttTask({
    required this.id,
    required this.name,
    required this.start,
    required this.end,
    this.progress = 0,
    this.color,
  });
}

class FlowGanttChart extends StatelessWidget {
  final List<FlowGanttTask> tasks;

  const FlowGanttChart({super.key, required this.tasks});

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    if (tasks.isEmpty) return const SizedBox.shrink();

    final earliest = tasks.map((t) => t.start).reduce(
        (a, b) => a.isBefore(b) ? a : b);
    final latest = tasks.map((t) => t.end).reduce(
        (a, b) => a.isAfter(b) ? a : b);
    final totalDays = latest.difference(earliest).inDays.clamp(1, 9999);

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        for (int i = 0; i < tasks.length; i++) ...[
          if (i > 0) const SizedBox(height: FlowSpace.s2),
          _buildRow(tasks[i], earliest, totalDays, scheme),
        ],
      ],
    );
  }

  Widget _buildRow(
    FlowGanttTask task,
    DateTime earliest,
    int totalDays,
    FlowScheme scheme,
  ) {
    final startOffset = task.start.difference(earliest).inDays;
    final duration = task.end.difference(task.start).inDays.clamp(1, totalDays);
    final leftFraction = startOffset / totalDays;
    final widthFraction = duration / totalDays;

    return Row(
      children: [
        SizedBox(
          width: 100,
          child: Text(
            task.name,
            style: TextStyle(
              fontSize: FlowFontSize.bodySm,
              color: scheme.textPrimary,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ),
        const SizedBox(width: FlowSpace.s3),
        Expanded(
          child: SizedBox(
            height: 24,
            child: LayoutBuilder(
              builder: (ctx, constraints) {
                final w = constraints.maxWidth;
                final barLeft = leftFraction * w;
                final barWidth = (widthFraction * w).clamp(4.0, w - barLeft);

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
                    Positioned(
                      left: barLeft,
                      child: Container(
                        width: barWidth,
                        height: 24,
                        decoration: BoxDecoration(
                          color: (task.color ?? scheme.actionAccent)
                              .withValues(alpha: 0.3),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Align(
                          alignment: Alignment.centerLeft,
                          child: Container(
                            width: barWidth * task.progress.clamp(0, 1),
                            height: 24,
                            decoration: BoxDecoration(
                              color: task.color ?? scheme.actionAccent,
                              borderRadius: BorderRadius.circular(4),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                );
              },
            ),
          ),
        ),
      ],
    );
  }
}
