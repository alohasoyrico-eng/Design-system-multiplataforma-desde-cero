import 'package:flutter/material.dart';
import 'package:material_symbols_icons/symbols.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

enum FlowNotificationTone { warning, danger, success, info }

class FlowNotificationItem {
  final String id;
  final FlowNotificationTone tone;
  final String title;
  final String? desc;
  final String time;
  final bool read;

  const FlowNotificationItem({
    required this.id,
    required this.tone,
    required this.title,
    this.desc,
    required this.time,
    this.read = false,
  });
}

class FlowNotificationCenter extends StatelessWidget {
  final List<FlowNotificationItem> items;
  final ValueChanged<FlowNotificationItem>? onItemTap;
  final VoidCallback? onMarkAllRead;

  const FlowNotificationCenter({
    super.key,
    this.items = const [],
    this.onItemTap,
    this.onMarkAllRead,
  });

  Color _toneColor(FlowNotificationTone tone) {
    return switch (tone) {
      FlowNotificationTone.success => FlowColors.green500,
      FlowNotificationTone.warning => FlowColors.orange500,
      FlowNotificationTone.danger => FlowColors.danger500,
      FlowNotificationTone.info => FlowColors.blue500,
    };
  }

  IconData _toneIcon(FlowNotificationTone tone) {
    return switch (tone) {
      FlowNotificationTone.success => Symbols.check_circle_rounded,
      FlowNotificationTone.warning => Symbols.warning_rounded,
      FlowNotificationTone.danger => Symbols.error_rounded,
      FlowNotificationTone.info => Symbols.info_rounded,
    };
  }

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    final unread = items.where((i) => !i.read).length;

    return Container(
      constraints: const BoxConstraints(maxWidth: 380),
      decoration: BoxDecoration(
        color: scheme.surfaceCard,
        borderRadius: BorderRadius.circular(FlowRadius.xl),
        boxShadow: FlowShadow.float,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Padding(
            padding: const EdgeInsets.all(FlowSpace.s4),
            child: Row(
              children: [
                Text(
                  'Notifications',
                  style: TextStyle(
                    fontSize: FlowFontSize.titleLg,
                    fontWeight: FontWeight.w600,
                    color: scheme.textPrimary,
                  ),
                ),
                if (unread > 0) ...[
                  const SizedBox(width: FlowSpace.s2),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: FlowSpace.s2, vertical: 2),
                    decoration: BoxDecoration(
                      color: scheme.actionAccent,
                      borderRadius: BorderRadius.circular(FlowRadius.pill),
                    ),
                    child: Text(
                      '$unread',
                      style: TextStyle(
                        fontSize: FlowFontSize.bodySm,
                        fontWeight: FontWeight.w600,
                        color: scheme.textOnAccent,
                      ),
                    ),
                  ),
                ],
                const Spacer(),
                if (onMarkAllRead != null && unread > 0)
                  GestureDetector(
                    onTap: onMarkAllRead,
                    child: Text(
                      'Mark all read',
                      style: TextStyle(
                        fontSize: FlowFontSize.bodySm,
                        color: scheme.textAccent,
                      ),
                    ),
                  ),
              ],
            ),
          ),
          Container(height: 1, color: scheme.borderSubtle),
          if (items.isEmpty)
            Padding(
              padding: const EdgeInsets.all(FlowSpace.s8),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Symbols.notifications_off_rounded, size: 32, color: scheme.textMuted),
                  const SizedBox(height: FlowSpace.s2),
                  Text(
                    'No notifications',
                    style: TextStyle(
                      fontSize: FlowFontSize.bodyMd,
                      color: scheme.textMuted,
                    ),
                  ),
                ],
              ),
            )
          else
            ...items.map((item) => _buildItem(item, scheme)),
        ],
      ),
    );
  }

  Widget _buildItem(FlowNotificationItem item, FlowScheme scheme) {
    return GestureDetector(
      onTap: () => onItemTap?.call(item),
      child: Container(
        padding: const EdgeInsets.all(FlowSpace.s4),
        decoration: BoxDecoration(
          color: item.read ? null : scheme.surfaceAccentSubtle,
          border: Border(bottom: BorderSide(color: scheme.borderSubtle)),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(
              _toneIcon(item.tone),
              size: 20,
              color: _toneColor(item.tone),
            ),
            const SizedBox(width: FlowSpace.s3),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    item.title,
                    style: TextStyle(
                      fontSize: FlowFontSize.bodyMd,
                      fontWeight: item.read ? FontWeight.w400 : FontWeight.w600,
                      color: scheme.textPrimary,
                    ),
                  ),
                  if (item.desc != null)
                    Padding(
                      padding: const EdgeInsets.only(top: 2),
                      child: Text(
                        item.desc!,
                        style: TextStyle(
                          fontSize: FlowFontSize.bodySm,
                          color: scheme.textSecondary,
                        ),
                      ),
                    ),
                  Padding(
                    padding: const EdgeInsets.only(top: FlowSpace.s1),
                    child: Text(
                      item.time,
                      style: TextStyle(
                        fontSize: FlowFontSize.labelSm,
                        color: scheme.textMuted,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            if (!item.read)
              Container(
                width: 8,
                height: 8,
                margin: const EdgeInsets.only(top: FlowSpace.s2),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: scheme.actionAccent,
                ),
              ),
          ],
        ),
      ),
    );
  }
}
