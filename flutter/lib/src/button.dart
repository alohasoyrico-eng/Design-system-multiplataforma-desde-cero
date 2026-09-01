import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

enum FlowButtonVariant { primary, secondary, ghost, danger }
enum FlowButtonSize { sm, md, lg }

class FlowButton extends StatelessWidget {
  final String label;
  final FlowButtonVariant variant;
  final FlowButtonSize size;
  final IconData? icon;
  final IconData? iconTrailing;
  final bool fullWidth;
  final bool loading;
  final bool disabled;
  final VoidCallback? onPressed;

  const FlowButton({
    super.key,
    required this.label,
    this.variant = FlowButtonVariant.primary,
    this.size = FlowButtonSize.md,
    this.icon,
    this.iconTrailing,
    this.fullWidth = false,
    this.loading = false,
    this.disabled = false,
    this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    final isDisabled = disabled || loading;

    Color bg, fg;
    Border? border;
    switch (variant) {
      case FlowButtonVariant.primary:
        bg = scheme.actionPrimary;
        fg = scheme.surfaceCanvas;
      case FlowButtonVariant.secondary:
        bg = scheme.surfaceCard;
        fg = scheme.textPrimary;
        border = Border.all(color: scheme.borderDefault, width: 1);
      case FlowButtonVariant.ghost:
        bg = Colors.transparent;
        fg = scheme.textPrimary;
      case FlowButtonVariant.danger:
        bg = FlowColors.danger500;
        fg = Colors.white;
    }

    double vPad, hPad, fontSize, iconSize;
    switch (size) {
      case FlowButtonSize.sm:
        vPad = FlowSpace.s2;
        hPad = FlowSpace.s3;
        fontSize = FlowFontSize.bodySm;
        iconSize = 16;
      case FlowButtonSize.md:
        vPad = FlowSpace.s3;
        hPad = FlowSpace.s5;
        fontSize = FlowFontSize.bodyMd;
        iconSize = 18;
      case FlowButtonSize.lg:
        vPad = FlowSpace.s4;
        hPad = FlowSpace.s7;
        fontSize = FlowFontSize.bodyMd;
        iconSize = 20;
    }

    final content = Row(
      mainAxisSize: fullWidth ? MainAxisSize.max : MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        if (loading) ...[
          SizedBox(
            width: iconSize,
            height: iconSize,
            child: CircularProgressIndicator(strokeWidth: 2, color: fg),
          ),
          const SizedBox(width: FlowSpace.s2),
        ] else if (icon != null) ...[
          Icon(icon, size: iconSize, color: fg),
          const SizedBox(width: FlowSpace.s2),
        ],
        Text(
          label,
          style: TextStyle(
            fontSize: fontSize,
            fontWeight: FontWeight.w600,
            color: fg,
          ),
        ),
        if (iconTrailing != null) ...[
          const SizedBox(width: FlowSpace.s2),
          Icon(iconTrailing, size: iconSize, color: fg),
        ],
      ],
    );

    return Opacity(
      opacity: isDisabled ? 0.5 : 1.0,
      child: Material(
        color: bg,
        borderRadius: BorderRadius.circular(FlowRadius.pill),
        child: InkWell(
          onTap: isDisabled ? null : onPressed,
          borderRadius: BorderRadius.circular(FlowRadius.pill),
          child: Container(
            width: fullWidth ? double.infinity : null,
            padding: EdgeInsets.symmetric(vertical: vPad, horizontal: hPad),
            decoration: BoxDecoration(
              border: border,
              borderRadius: BorderRadius.circular(FlowRadius.pill),
            ),
            child: content,
          ),
        ),
      ),
    );
  }
}
