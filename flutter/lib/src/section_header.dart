import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

enum FlowSectionHeaderSize { sm, md }

class FlowSectionHeader extends StatelessWidget {
  final String title;
  final Widget? trailing;
  final FlowSectionHeaderSize size;

  const FlowSectionHeader({
    super.key,
    required this.title,
    this.trailing,
    this.size = FlowSectionHeaderSize.md,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    final fontSize = size == FlowSectionHeaderSize.md
        ? FlowFontSize.titleLg
        : FlowFontSize.titleMd;
    final pad = size == FlowSectionHeaderSize.sm
        ? const EdgeInsets.symmetric(vertical: FlowSpace.s2)
        : EdgeInsets.zero;

    return Padding(
      padding: pad,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            title,
            style: TextStyle(
              fontSize: fontSize,
              fontWeight: FontWeight.w700,
              color: scheme.textPrimary,
            ),
          ),
          if (trailing != null) trailing!,
        ],
      ),
    );
  }
}
