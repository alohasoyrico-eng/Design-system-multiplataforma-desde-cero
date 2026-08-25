import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowSidebarItem {
  final String label;
  final IconData icon;
  final String? badge;
  final VoidCallback? onTap;

  const FlowSidebarItem({
    required this.label,
    required this.icon,
    this.badge,
    this.onTap,
  });
}

class FlowSidebarSection {
  final String? title;
  final List<FlowSidebarItem> items;

  const FlowSidebarSection({
    this.title,
    required this.items,
  });
}

class FlowSidebar extends StatelessWidget {
  final List<FlowSidebarSection> sections;
  final String? activeLabel;
  final Widget? header;
  final Widget? footer;
  final bool collapsed;
  final double width;
  final double collapsedWidth;

  const FlowSidebar({
    super.key,
    required this.sections,
    this.activeLabel,
    this.header,
    this.footer,
    this.collapsed = false,
    this.width = 240,
    this.collapsedWidth = 64,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    final w = collapsed ? collapsedWidth : width;

    return AnimatedContainer(
      duration: FlowDuration.base,
      curve: Curves.easeOut,
      width: w,
      decoration: BoxDecoration(
        color: scheme.surfaceCard,
        border: Border(right: BorderSide(color: scheme.borderSubtle)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (header != null)
            Padding(
              padding: EdgeInsets.all(collapsed ? FlowSpace.s2 : FlowSpace.s4),
              child: header!,
            ),
          Expanded(
            child: ListView(
              padding: EdgeInsets.symmetric(
                horizontal: collapsed ? FlowSpace.s1 : FlowSpace.s3,
                vertical: FlowSpace.s2,
              ),
              children: [
                for (final section in sections) ...[
                  if (section.title != null && !collapsed)
                    Padding(
                      padding: const EdgeInsets.fromLTRB(
                        FlowSpace.s3, FlowSpace.s4, FlowSpace.s3, FlowSpace.s2,
                      ),
                      child: Text(
                        section.title!.toUpperCase(),
                        style: TextStyle(
                          fontSize: FlowFontSize.labelSm,
                          fontWeight: FontWeight.w600,
                          letterSpacing: 0.8,
                          color: scheme.textMuted,
                        ),
                      ),
                    ),
                  for (final item in section.items)
                    _buildItem(item, scheme),
                ],
              ],
            ),
          ),
          if (footer != null)
            Padding(
              padding: EdgeInsets.all(collapsed ? FlowSpace.s2 : FlowSpace.s4),
              child: footer!,
            ),
        ],
      ),
    );
  }

  Widget _buildItem(FlowSidebarItem item, FlowScheme scheme) {
    final isActive = activeLabel == item.label;

    return GestureDetector(
      onTap: item.onTap,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 2),
        padding: EdgeInsets.symmetric(
          horizontal: collapsed ? FlowSpace.s2 : FlowSpace.s3,
          vertical: FlowSpace.s2,
        ),
        decoration: BoxDecoration(
          color: isActive ? scheme.surfaceAccentSubtle : Colors.transparent,
          borderRadius: BorderRadius.circular(FlowRadius.sm),
        ),
        child: collapsed
            ? Center(
                child: Icon(
                  item.icon,
                  size: 22,
                  color: isActive ? scheme.textAccent : scheme.textSecondary,
                ),
              )
            : Row(
                children: [
                  Icon(
                    item.icon,
                    size: 20,
                    color: isActive ? scheme.textAccent : scheme.textSecondary,
                  ),
                  const SizedBox(width: FlowSpace.s3),
                  Expanded(
                    child: Text(
                      item.label,
                      style: TextStyle(
                        fontSize: FlowFontSize.bodyMd,
                        fontWeight: isActive ? FontWeight.w600 : FontWeight.w400,
                        color: isActive ? scheme.textAccent : scheme.textPrimary,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  if (item.badge != null)
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: FlowSpace.s2,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: scheme.actionAccent,
                        borderRadius: BorderRadius.circular(FlowRadius.pill),
                      ),
                      child: Text(
                        item.badge!,
                        style: TextStyle(
                          fontSize: FlowFontSize.bodySm,
                          fontWeight: FontWeight.w600,
                          color: scheme.textOnAccent,
                        ),
                      ),
                    ),
                ],
              ),
      ),
    );
  }
}
