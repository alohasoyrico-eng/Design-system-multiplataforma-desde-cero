
import 'package:flutter/material.dart';
import 'package:material_symbols_icons/symbols.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';
import 'card.dart';
import 'icon_button.dart';
class FlowRouteBanner extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback? onClose;
  const FlowRouteBanner({
    super.key,
    this.icon = Symbols.navigation_rounded,
    required this.title,
    required this.subtitle,
    this.onClose,
  });
  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    return FlowCard(
      padding: 14,
      child: Row(
        children: [
          Icon(icon, size: 22, color: scheme.textAccent),
          const SizedBox(width: FlowSpace.s3),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: FlowFontSize.bodyMd,
                    fontWeight: FontWeight.w700,
                    color: scheme.textPrimary,
                  ),
                ),
                Text(
                  subtitle,
                  style: TextStyle(
                    fontSize: FlowFontSize.bodySm,
                    color: scheme.textMuted,
                  ),
                ),
              ],
            ),
          ),
          if (onClose != null)
            FlowIconButton(
              icon: Symbols.close_rounded,
              ariaLabel: 'Cerrar',
              size: FlowIconButtonSize.sm,
              onPressed: onClose,
            ),
        ],
      ),
    );
  }
}
