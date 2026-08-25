import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowTabItem {
  final String id;
  final String label;
  final IconData icon;
  final IconData? activeIcon;
  final int? badge;

  const FlowTabItem({
    required this.id,
    required this.label,
    required this.icon,
    this.activeIcon,
    this.badge,
  });
}

class FlowTabBar extends StatelessWidget {
  final List<FlowTabItem> items;
  final String activeId;
  final ValueChanged<String>? onChange;

  const FlowTabBar({
    super.key,
    required this.items,
    required this.activeId,
    this.onChange,
  }) : assert(items.length >= 2 && items.length <= 5);

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    final bottomPadding = MediaQuery.of(context).padding.bottom;

    return Container(
      decoration: BoxDecoration(
        color: scheme.surfaceCard,
        border: Border(
          top: BorderSide(color: scheme.borderSubtle, width: 1),
        ),
      ),
      padding: EdgeInsets.only(bottom: bottomPadding),
      child: Row(
        children: items.map((item) {
          final active = item.id == activeId;
          return Expanded(
            child: _TabDestination(
              item: item,
              active: active,
              scheme: scheme,
              onTap: onChange != null ? () => onChange!(item.id) : null,
            ),
          );
        }).toList(),
      ),
    );
  }
}

class _TabDestination extends StatelessWidget {
  final FlowTabItem item;
  final bool active;
  final FlowScheme scheme;
  final VoidCallback? onTap;

  const _TabDestination({
    required this.item,
    required this.active,
    required this.scheme,
    this.onTap,
  });

  String _badgeText(int count) => count > 9 ? '9+' : '$count';

  @override
  Widget build(BuildContext context) {
    final color = active ? scheme.textAccent : scheme.textMuted;
    final badgeLabel = item.badge != null
        ? ', ${_badgeText(item.badge!)} notificaciones'
        : '';

    return Semantics(
      selected: active,
      label: '${item.label}$badgeLabel',
      child: InkResponse(
        onTap: onTap,
        child: SizedBox(
          height: FlowSize.bar,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Stack(
                clipBehavior: Clip.none,
                children: [
                  Icon(
                    active ? (item.activeIcon ?? item.icon) : item.icon,
                    color: color,
                    size: active ? 26.88 : 24,
                  ),
                  if (item.badge != null)
                    Positioned(
                      right: -8,
                      top: -4,
                      child: _Badge(
                        text: _badgeText(item.badge!),
                        scheme: scheme,
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 2),
              Text(
                item.label,
                style: TextStyle(
                  fontSize: FlowFontSize.bodySm,
                  fontWeight: active ? FontWeight.w600 : FontWeight.w400,
                  color: color,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _Badge extends StatelessWidget {
  final String text;
  final FlowScheme scheme;

  const _Badge({required this.text, required this.scheme});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: FlowSpace.s1, vertical: 1),
      constraints: const BoxConstraints(minWidth: 16),
      decoration: BoxDecoration(
        color: scheme.actionAccent,
        borderRadius: BorderRadius.circular(FlowRadius.pill),
      ),
      child: Text(
        text,
        textAlign: TextAlign.center,
        style: TextStyle(
          fontSize: 10,
          fontWeight: FontWeight.w700,
          color: scheme.textOnAccent,
        ),
      ),
    );
  }
}
