
import 'package:flutter/material.dart';
import 'package:material_symbols_icons/symbols.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';
import 'avatar.dart';
class FlowProfileMenuItem {
  final IconData icon;
  final String label;
  final VoidCallback? onTap;
  const FlowProfileMenuItem({
    required this.icon,
    required this.label,
    this.onTap,
  });
}
class FlowProfileMenu extends StatelessWidget {
  final String name;
  final String? avatarName;
  final String? role;
  final Widget? badge;
  final List<FlowProfileMenuItem> items;
  const FlowProfileMenu({
    super.key,
    required this.name,
    this.avatarName,
    this.role,
    this.badge,
    this.items = const [],
  });
  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        const SizedBox(height: FlowSpace.s4),
        FlowAvatar(
          name: avatarName ?? name,
          size: FlowAvatarSize.xl,
        ),
        const SizedBox(height: FlowSpace.s3),
        Text(
          name,
          style: TextStyle(
            fontSize: FlowFontSize.titleLg,
            fontWeight: FontWeight.w700,
            color: scheme.textPrimary,
          ),
        ),
        if (role != null) ...[
          const SizedBox(height: FlowSpace.s1),
          Text(
            role!,
            style: TextStyle(
              fontSize: FlowFontSize.bodyMd,
              color: scheme.textSecondary,
            ),
          ),
        ],
        if (badge != null) ...[
          const SizedBox(height: FlowSpace.s2),
          badge!,
        ],
        const SizedBox(height: FlowSpace.s6),
        ...items.map((item) => _buildItem(scheme, item)),
      ],
    );
  }
  Widget _buildItem(FlowScheme scheme, FlowProfileMenuItem item) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: item.onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: FlowSpace.s4,
            vertical: FlowSpace.s3,
          ),
          child: Row(
            children: [
              Icon(item.icon, size: 20, color: scheme.textSecondary),
              const SizedBox(width: FlowSpace.s3),
              Expanded(
                child: Text(
                  item.label,
                  style: TextStyle(
                    fontSize: FlowFontSize.bodyMd,
                    color: scheme.textPrimary,
                  ),
                ),
              ),
              Icon(Symbols.chevron_right_rounded, size: 20, color: scheme.textMuted),
            ],
          ),
        ),
      ),
    );
  }
}
