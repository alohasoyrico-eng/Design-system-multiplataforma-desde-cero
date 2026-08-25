import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

enum FlowTimelineStatus { done, active, pending }

class FlowTimelineItem {
  final String title;
  final String? subtitle;
  final String? timestamp;
  final FlowTimelineStatus status;

  const FlowTimelineItem({
    required this.title,
    this.subtitle,
    this.timestamp,
    this.status = FlowTimelineStatus.pending,
  });
}

class FlowTimeline extends StatelessWidget {
  final List<FlowTimelineItem> items;

  const FlowTimeline({super.key, required this.items});

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        for (int i = 0; i < items.length; i++)
          _row(i, scheme),
      ],
    );
  }

  Widget _row(int i, FlowScheme scheme) {
    final item = items[i];
    final isLast = i == items.length - 1;

    final dotColor = switch (item.status) {
      FlowTimelineStatus.done => scheme.actionAccent,
      FlowTimelineStatus.active => scheme.actionAccent,
      FlowTimelineStatus.pending => scheme.borderDefault,
    };

    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 24,
            child: Column(
              children: [
                Container(
                  width: item.status == FlowTimelineStatus.active ? 12 : 10,
                  height: item.status == FlowTimelineStatus.active ? 12 : 10,
                  margin: const EdgeInsets.only(top: FlowSpace.s1),
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: item.status == FlowTimelineStatus.pending
                        ? Colors.transparent
                        : dotColor,
                    border: Border.all(color: dotColor, width: 2),
                  ),
                ),
                if (!isLast)
                  Expanded(
                    child: Container(
                      width: 2,
                      margin: const EdgeInsets.symmetric(vertical: FlowSpace.s1),
                      color: i < items.length - 1 &&
                              items[i].status == FlowTimelineStatus.done
                          ? scheme.actionAccent
                          : scheme.borderSubtle,
                    ),
                  ),
              ],
            ),
          ),
          const SizedBox(width: FlowSpace.s3),
          Expanded(
            child: Padding(
              padding: EdgeInsets.only(bottom: isLast ? 0 : FlowSpace.s4),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          item.title,
                          style: TextStyle(
                            fontSize: FlowFontSize.bodyMd,
                            fontWeight: item.status == FlowTimelineStatus.active
                                ? FontWeight.w600
                                : FontWeight.w400,
                            color: item.status == FlowTimelineStatus.pending
                                ? scheme.textMuted
                                : scheme.textPrimary,
                          ),
                        ),
                      ),
                      if (item.timestamp != null)
                        Text(
                          item.timestamp!,
                          style: TextStyle(
                            fontSize: FlowFontSize.bodySm,
                            color: scheme.textMuted,
                          ),
                        ),
                    ],
                  ),
                  if (item.subtitle != null)
                    Padding(
                      padding: const EdgeInsets.only(top: 2),
                      child: Text(
                        item.subtitle!,
                        style: TextStyle(
                          fontSize: FlowFontSize.bodySm,
                          color: scheme.textSecondary,
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
