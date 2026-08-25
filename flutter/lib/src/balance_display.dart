
import 'package:flutter/material.dart';
import 'package:material_symbols_icons/symbols.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';
import 'icon_button.dart';
class FlowBalanceDisplay extends StatelessWidget {
  final String label;
  final String value;
  final bool hidden;
  final VoidCallback? onToggleHidden;
  const FlowBalanceDisplay({
    super.key,
    this.label = 'Balance total',
    required this.value,
    this.hidden = false,
    this.onToggleHidden,
  });
  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          label.toUpperCase(),
          style: TextStyle(
            fontSize: FlowFontSize.bodySm,
            color: scheme.textMuted,
            letterSpacing: 0.04 * FlowFontSize.bodySm,
          ),
        ),
        const SizedBox(height: 2),
        Row(
          children: [
            Text(
              hidden ? '••••••' : value,
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.w700,
                color: scheme.textPrimary,
                fontFamily: FlowFontFamily.mono,
                letterSpacing: -0.02 * 24,
              ),
            ),
            if (onToggleHidden != null) ...[
              const SizedBox(width: FlowSpace.s2),
              FlowIconButton(
                icon: hidden ? Symbols.visibility_rounded : Symbols.visibility_off_rounded,
                ariaLabel: hidden ? 'Mostrar saldo' : 'Ocultar saldo',
                variant: FlowIconButtonVariant.ghost,
                size: FlowIconButtonSize.sm,
                onPressed: onToggleHidden,
              ),
            ],
          ],
        ),
      ],
    );
  }
}
