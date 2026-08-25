
import 'package:flutter/material.dart';
import 'package:material_symbols_icons/symbols.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';
import 'icon_button.dart';
class FlowNavBar extends StatelessWidget {
  final String title;
  final VoidCallback? onBack;
  final Widget? trailing;
  const FlowNavBar({
    super.key,
    required this.title,
    this.onBack,
    this.trailing,
  });
  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    return Row(
      children: [
        FlowIconButton(
          icon: Symbols.arrow_back_rounded,
          ariaLabel: 'Volver',
          variant: FlowIconButtonVariant.tonal,
          size: FlowIconButtonSize.sm,
          onPressed: onBack,
        ),
        const SizedBox(width: FlowSpace.s3),
        Expanded(
          child: Text(
            title,
            style: TextStyle(
              fontSize: FlowFontSize.titleMd,
              fontWeight: FontWeight.w600,
              color: scheme.textPrimary,
            ),
          ),
        ),
        if (trailing != null) trailing!,
      ],
    );
  }
}
