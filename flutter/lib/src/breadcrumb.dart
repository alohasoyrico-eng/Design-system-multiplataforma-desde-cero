import 'package:flutter/material.dart';
import 'package:material_symbols_icons/symbols.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowBreadcrumbItem {
  final String label;
  final VoidCallback? onTap;

  const FlowBreadcrumbItem({required this.label, this.onTap});
}

class FlowBreadcrumb extends StatelessWidget {
  final List<FlowBreadcrumbItem> items;

  const FlowBreadcrumb({super.key, this.items = const []});

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        for (int i = 0; i < items.length; i++) ...[
          if (i > 0)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: FlowSpace.s1),
              child: Icon(
                Symbols.chevron_right_rounded,
                size: 16,
                color: scheme.textMuted,
              ),
            ),
          GestureDetector(
            onTap: items[i].onTap,
            child: Text(
              items[i].label,
              style: TextStyle(
                fontSize: FlowFontSize.bodyMd,
                fontWeight: i == items.length - 1 ? FontWeight.w600 : FontWeight.w400,
                color: i == items.length - 1
                    ? scheme.textPrimary
                    : scheme.textSecondary,
              ),
            ),
          ),
        ],
      ],
    );
  }
}
