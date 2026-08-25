import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowMenuItem {
  final String label;
  final IconData? icon;
  final VoidCallback? onTap;
  final bool danger;
  final bool disabled;
  final bool dividerAfter;

  const FlowMenuItem({
    required this.label,
    this.icon,
    this.onTap,
    this.danger = false,
    this.disabled = false,
    this.dividerAfter = false,
  });
}

class FlowMenu extends StatelessWidget {
  final List<FlowMenuItem> items;
  final double minWidth;

  const FlowMenu({
    super.key,
    required this.items,
    this.minWidth = 200,
  });

  static void show({
    required BuildContext context,
    required RelativeRect position,
    required List<FlowMenuItem> items,
    double minWidth = 200,
  }) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    final entries = <PopupMenuEntry<int>>[];

    for (int i = 0; i < items.length; i++) {
      final item = items[i];
      entries.add(PopupMenuItem<int>(
        value: i,
        enabled: !item.disabled,
        height: 40,
        child: Row(
          children: [
            if (item.icon != null) ...[
              Icon(
                item.icon,
                size: 18,
                color: item.danger
                    ? FlowColors.danger500
                    : item.disabled
                        ? scheme.textMuted
                        : scheme.textSecondary,
              ),
              const SizedBox(width: FlowSpace.s3),
            ],
            Text(
              item.label,
              style: TextStyle(
                fontSize: FlowFontSize.bodyMd,
                color: item.danger
                    ? FlowColors.danger500
                    : item.disabled
                        ? scheme.textMuted
                        : scheme.textPrimary,
              ),
            ),
          ],
        ),
      ));
      if (item.dividerAfter) {
        entries.add(const PopupMenuDivider(height: 1));
      }
    }

    showMenu<int>(
      context: context,
      position: position,
      items: entries,
      color: scheme.surfaceCard,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(FlowRadius.md),
        side: BorderSide(color: scheme.borderSubtle),
      ),
      elevation: 8,
    ).then((index) {
      if (index != null && !items[index].disabled) {
        items[index].onTap?.call();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;

    return Container(
      constraints: BoxConstraints(minWidth: minWidth),
      decoration: BoxDecoration(
        color: scheme.surfaceCard,
        borderRadius: BorderRadius.circular(FlowRadius.md),
        border: Border.all(color: scheme.borderSubtle),
        boxShadow: FlowShadow.float,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          for (int i = 0; i < items.length; i++) ...[
            _buildItem(items[i], scheme),
            if (items[i].dividerAfter)
              Container(
                height: 1,
                margin: const EdgeInsets.symmetric(vertical: FlowSpace.s1),
                color: scheme.borderSubtle,
              ),
          ],
        ],
      ),
    );
  }

  Widget _buildItem(FlowMenuItem item, FlowScheme scheme) {
    return GestureDetector(
      onTap: item.disabled ? null : item.onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(
          horizontal: FlowSpace.s3,
          vertical: FlowSpace.s2,
        ),
        child: Row(
          children: [
            if (item.icon != null) ...[
              Icon(
                item.icon,
                size: 18,
                color: item.danger
                    ? FlowColors.danger500
                    : item.disabled
                        ? scheme.textMuted
                        : scheme.textSecondary,
              ),
              const SizedBox(width: FlowSpace.s3),
            ],
            Text(
              item.label,
              style: TextStyle(
                fontSize: FlowFontSize.bodyMd,
                color: item.danger
                    ? FlowColors.danger500
                    : item.disabled
                        ? scheme.textMuted
                        : scheme.textPrimary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
