
import 'package:flutter/material.dart';
import 'package:material_symbols_icons/symbols.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';
class FlowChip extends StatelessWidget {
  final String label;
  final bool selected;
  final IconData? icon;
  final bool disabled;
  final VoidCallback? onTap;
  final VoidCallback? onRemove;
  const FlowChip({
    super.key,
    required this.label,
    this.selected = false,
    this.icon,
    this.disabled = false,
    this.onTap,
    this.onRemove,
  });
  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    final bg = selected ? scheme.actionAccent : scheme.surfaceSunken;
    final fg = selected ? scheme.textOnAccent : scheme.textPrimary;
    return Opacity(
      opacity: disabled ? 0.5 : 1.0,
      child: Material(
        color: bg,
        borderRadius: BorderRadius.circular(FlowRadius.pill),
        child: InkWell(
          onTap: disabled ? null : onTap,
          borderRadius: BorderRadius.circular(FlowRadius.pill),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: FlowSpace.s3, vertical: FlowSpace.s2),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (icon != null) ...[
                  Icon(icon, size: 16, color: fg),
                  const SizedBox(width: FlowSpace.s2),
                ],
                Text(
                  label,
                  style: TextStyle(
                    fontSize: FlowFontSize.bodySm,
                    fontWeight: FontWeight.w500,
                    color: fg,
                  ),
                ),
                if (onRemove != null) ...[
                  const SizedBox(width: FlowSpace.s1),
                  GestureDetector(
                    onTap: disabled ? null : onRemove,
                    child: Icon(Symbols.close_rounded, size: 14, color: fg),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}
