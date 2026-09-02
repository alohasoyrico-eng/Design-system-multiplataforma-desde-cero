
import 'package:flutter/material.dart';
import 'package:material_symbols_icons/symbols.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';
enum FlowToastTone { info, success, warning, danger }
class FlowToast extends StatelessWidget {
  final String message;
  final FlowToastTone tone;
  final IconData? icon;
  /// Accion inline (p. ej. "Deshacer"). Requiere [onAction].
  final String? actionLabel;
  final VoidCallback? onAction;
  final VoidCallback? onClose;
  const FlowToast({
    super.key,
    required this.message,
    this.tone = FlowToastTone.info,
    this.icon,
    this.actionLabel,
    this.onAction,
    this.onClose,
  });
  IconData get _defaultIcon {
    switch (tone) {
      case FlowToastTone.success:
        return Symbols.check_circle_rounded;
      case FlowToastTone.warning:
        return Symbols.warning_rounded;
      case FlowToastTone.danger:
        return Symbols.error_rounded;
      case FlowToastTone.info:
        return Symbols.info_rounded;
    }
  }
  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    Color bg, fg;
    switch (tone) {
      case FlowToastTone.success:
        bg = FlowColors.green50;
        fg = FlowColors.green600;
      case FlowToastTone.warning:
        bg = FlowColors.orange50;
        fg = FlowColors.orange600;
      case FlowToastTone.danger:
        bg = FlowColors.danger50;
        fg = FlowColors.danger600;
      case FlowToastTone.info:
        bg = scheme.surfaceInverse;
        fg = scheme.surfaceCanvas;
    }
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: FlowSpace.s4,
        vertical: FlowSpace.s3,
      ),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(FlowRadius.md),
        boxShadow: FlowShadow.raised,
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon ?? _defaultIcon, size: 20, color: fg),
          const SizedBox(width: FlowSpace.s3),
          Flexible(
            child: Text(
              message,
              style: TextStyle(
                fontSize: FlowFontSize.bodyMd,
                fontWeight: FontWeight.w500,
                color: tone == FlowToastTone.info ? fg : scheme.textPrimary,
              ),
            ),
          ),
          if (actionLabel != null && onAction != null) ...[
            const SizedBox(width: FlowSpace.s2),
            GestureDetector(
              onTap: onAction,
              child: Text(
                actionLabel!,
                style: TextStyle(
                  fontSize: FlowFontSize.bodyMd,
                  fontWeight: FontWeight.w600,
                  decoration: TextDecoration.underline,
                  color: fg,
                ),
              ),
            ),
          ],
          if (onClose != null) ...[
            const SizedBox(width: FlowSpace.s2),
            GestureDetector(
              onTap: onClose,
              child: Icon(Symbols.close_rounded, size: 18, color: fg),
            ),
          ],
        ],
      ),
    );
  }
}
