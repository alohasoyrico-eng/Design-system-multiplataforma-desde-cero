import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowSegmentedItem {
  final String value;
  final String label;
  final IconData? icon;

  const FlowSegmentedItem({
    required this.value,
    required this.label,
    this.icon,
  });
}

class FlowSegmentedControl extends StatelessWidget {
  final List<FlowSegmentedItem> items;
  final String value;
  final ValueChanged<String>? onChange;

  const FlowSegmentedControl({
    super.key,
    required this.items,
    required this.value,
    this.onChange,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;

    return Container(
      decoration: BoxDecoration(
        color: scheme.surfaceSunken,
        borderRadius: BorderRadius.circular(FlowRadius.sm),
      ),
      padding: const EdgeInsets.all(3),
      child: Row(
        children: items.map((item) {
          final active = item.value == value;
          return Expanded(
            child: GestureDetector(
              onTap: () => onChange?.call(item.value),
              child: AnimatedContainer(
                duration: FlowDuration.fast,
                padding: const EdgeInsets.symmetric(vertical: FlowSpace.s2),
                decoration: BoxDecoration(
                  color: active ? scheme.surfaceCard : Colors.transparent,
                  borderRadius: BorderRadius.circular(FlowRadius.xs),
                  boxShadow: active ? FlowShadow.rest : null,
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    if (item.icon != null) ...[
                      Icon(
                        item.icon,
                        size: 16,
                        color: active ? scheme.textPrimary : scheme.textMuted,
                      ),
                      const SizedBox(width: FlowSpace.s2),
                    ],
                    Text(
                      item.label,
                      style: TextStyle(
                        fontSize: FlowFontSize.bodySm,
                        fontWeight: active ? FontWeight.w600 : FontWeight.w400,
                        color: active ? scheme.textPrimary : scheme.textMuted,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}
