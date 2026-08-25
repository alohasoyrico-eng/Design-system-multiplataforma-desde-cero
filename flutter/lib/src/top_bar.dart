import 'package:flutter/material.dart';
import 'package:material_symbols_icons/symbols.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowTopBar extends StatelessWidget {
  final String? title;
  final Widget? leading;
  final List<Widget>? actions;
  final bool showBack;
  final VoidCallback? onBack;
  final bool transparent;

  const FlowTopBar({
    super.key,
    this.title,
    this.leading,
    this.actions,
    this.showBack = false,
    this.onBack,
    this.transparent = false,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;

    return Container(
      height: 56,
      padding: const EdgeInsets.symmetric(horizontal: FlowSpace.s4),
      decoration: BoxDecoration(
        color: transparent ? Colors.transparent : scheme.surfaceCard,
        border: transparent
            ? null
            : Border(bottom: BorderSide(color: scheme.borderSubtle)),
      ),
      child: Row(
        children: [
          if (showBack)
            GestureDetector(
              onTap: onBack ?? () => Navigator.of(context).maybePop(),
              child: Padding(
                padding: const EdgeInsets.only(right: FlowSpace.s3),
                child: Icon(
                  Symbols.arrow_back_rounded,
                  size: 24,
                  color: scheme.textPrimary,
                ),
              ),
            ),
          if (leading != null)
            Padding(
              padding: const EdgeInsets.only(right: FlowSpace.s3),
              child: leading!,
            ),
          if (title != null)
            Expanded(
              child: Text(
                title!,
                style: TextStyle(
                  fontSize: FlowFontSize.titleLg,
                  fontWeight: FontWeight.w600,
                  color: scheme.textPrimary,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            )
          else
            const Spacer(),
          if (actions != null)
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                for (int i = 0; i < actions!.length; i++) ...[
                  if (i > 0) const SizedBox(width: FlowSpace.s2),
                  actions![i],
                ],
              ],
            ),
        ],
      ),
    );
  }
}
