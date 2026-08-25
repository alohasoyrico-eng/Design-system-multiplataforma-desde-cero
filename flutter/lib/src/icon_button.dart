import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

enum FlowIconButtonVariant { ghost, tonal, primary, accent }
enum FlowIconButtonSize { sm, md, lg }

class FlowIconButton extends StatelessWidget {
  final IconData icon;
  final String ariaLabel;
  final FlowIconButtonVariant variant;
  final FlowIconButtonSize size;
  final bool selected;
  final bool badge;
  final bool disabled;
  final VoidCallback? onPressed;

  const FlowIconButton({
    super.key,
    required this.icon,
    required this.ariaLabel,
    this.variant = FlowIconButtonVariant.ghost,
    this.size = FlowIconButtonSize.md,
    this.selected = false,
    this.badge = false,
    this.disabled = false,
    this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    final dim = size == FlowIconButtonSize.lg ? 52.0 : 44.0;
    final iconSize = size == FlowIconButtonSize.sm
        ? 18.0
        : size == FlowIconButtonSize.lg
            ? 24.0
            : 20.0;

    Color bg, fg;
    switch (variant) {
      case FlowIconButtonVariant.ghost:
        bg = Colors.transparent;
        fg = selected ? scheme.textAccent : scheme.textSecondary;
      case FlowIconButtonVariant.tonal:
        bg = scheme.surfaceSunken;
        fg = selected ? scheme.textAccent : scheme.textPrimary;
      case FlowIconButtonVariant.primary:
        bg = scheme.actionPrimary;
        fg = scheme.surfaceCanvas;
      case FlowIconButtonVariant.accent:
        bg = scheme.actionAccent;
        fg = scheme.textOnAccent;
    }

    return Semantics(
      label: ariaLabel,
      button: true,
      child: Opacity(
        opacity: disabled ? 0.5 : 1.0,
        child: SizedBox(
          width: dim,
          height: dim,
          child: Stack(
            clipBehavior: Clip.none,
            children: [
              Material(
                color: bg,
                shape: const CircleBorder(),
                child: InkWell(
                  onTap: disabled ? null : onPressed,
                  customBorder: const CircleBorder(),
                  child: SizedBox(
                    width: dim,
                    height: dim,
                    child: Icon(icon, size: iconSize, color: fg),
                  ),
                ),
              ),
              if (badge)
                Positioned(
                  top: 6,
                  right: 6,
                  child: Container(
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: scheme.actionAccent,
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
