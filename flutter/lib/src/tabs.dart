import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowTab {
  final String label;
  final IconData? icon;
  final int? badge;

  const FlowTab({
    required this.label,
    this.icon,
    this.badge,
  });
}

class FlowTabs extends StatelessWidget {
  final List<FlowTab> tabs;
  final int active;
  final ValueChanged<int>? onChange;

  const FlowTabs({
    super.key,
    required this.tabs,
    this.active = 0,
    this.onChange,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;

    return Container(
      decoration: BoxDecoration(
        border: Border(
          bottom: BorderSide(color: scheme.borderSubtle),
        ),
      ),
      child: Row(
        children: [
          for (int i = 0; i < tabs.length; i++)
            _buildTab(i, scheme),
        ],
      ),
    );
  }

  Widget _buildTab(int i, FlowScheme scheme) {
    final tab = tabs[i];
    final isActive = i == active;

    return GestureDetector(
      onTap: isActive ? null : () => onChange?.call(i),
      child: Container(
        padding: const EdgeInsets.symmetric(
          horizontal: FlowSpace.s4,
          vertical: FlowSpace.s3,
        ),
        decoration: BoxDecoration(
          border: Border(
            bottom: BorderSide(
              color: isActive ? scheme.actionAccent : Colors.transparent,
              width: 2,
            ),
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (tab.icon != null) ...[
              Icon(
                tab.icon,
                size: 18,
                color: isActive ? scheme.textAccent : scheme.textMuted,
              ),
              const SizedBox(width: FlowSpace.s2),
            ],
            Text(
              tab.label,
              style: TextStyle(
                fontSize: FlowFontSize.bodyMd,
                fontWeight: isActive ? FontWeight.w600 : FontWeight.w400,
                color: isActive ? scheme.textAccent : scheme.textMuted,
              ),
            ),
            if (tab.badge != null) ...[
              const SizedBox(width: FlowSpace.s2),
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
                  '${tab.badge}',
                  style: TextStyle(
                    fontSize: FlowFontSize.bodySm,
                    fontWeight: FontWeight.w600,
                    color: scheme.textOnAccent,
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
