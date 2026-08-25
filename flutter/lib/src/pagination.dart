import 'package:flutter/material.dart';
import 'package:material_symbols_icons/symbols.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowPagination extends StatelessWidget {
  final int page;
  final int pages;
  final ValueChanged<int>? onChange;

  const FlowPagination({
    super.key,
    this.page = 1,
    this.pages = 1,
    this.onChange,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    final items = _buildPageNumbers();

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        _navBtn(Symbols.chevron_left_rounded, page > 1 ? () => onChange?.call(page - 1) : null, scheme),
        const SizedBox(width: FlowSpace.s1),
        for (final item in items) ...[
          if (item == -1)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: FlowSpace.s1),
              child: Text('…', style: TextStyle(color: scheme.textMuted)),
            )
          else
            _pageBtn(item, scheme),
        ],
        const SizedBox(width: FlowSpace.s1),
        _navBtn(Symbols.chevron_right_rounded, page < pages ? () => onChange?.call(page + 1) : null, scheme),
      ],
    );
  }

  List<int> _buildPageNumbers() {
    if (pages <= 7) return List.generate(pages, (i) => i + 1);
    final result = <int>[];
    result.add(1);
    if (page > 3) result.add(-1);
    for (int i = page - 1; i <= page + 1; i++) {
      if (i > 1 && i < pages) result.add(i);
    }
    if (page < pages - 2) result.add(-1);
    result.add(pages);
    return result;
  }

  Widget _navBtn(IconData icon, VoidCallback? onTap, FlowScheme scheme) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 32,
        height: 32,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(FlowRadius.xs),
          border: Border.all(color: scheme.borderSubtle),
        ),
        child: Icon(
          icon,
          size: 18,
          color: onTap != null ? scheme.textPrimary : scheme.textMuted,
        ),
      ),
    );
  }

  Widget _pageBtn(int p, FlowScheme scheme) {
    final active = p == page;
    return GestureDetector(
      onTap: active ? null : () => onChange?.call(p),
      child: Container(
        width: 32,
        height: 32,
        margin: const EdgeInsets.symmetric(horizontal: 2),
        decoration: BoxDecoration(
          color: active ? scheme.actionAccent : Colors.transparent,
          borderRadius: BorderRadius.circular(FlowRadius.xs),
        ),
        child: Center(
          child: Text(
            '$p',
            style: TextStyle(
              fontSize: FlowFontSize.bodyMd,
              fontWeight: FontWeight.w600,
              color: active ? scheme.textOnAccent : scheme.textPrimary,
            ),
          ),
        ),
      ),
    );
  }
}
