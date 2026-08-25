import 'package:flutter/material.dart';
import 'package:material_symbols_icons/symbols.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowSearchResult {
  final String id;
  final String label;
  final String? group;
  final String? hint;
  final IconData? icon;
  final String? meta;

  const FlowSearchResult({
    required this.id,
    required this.label,
    this.group,
    this.hint,
    this.icon,
    this.meta,
  });
}

class FlowGlobalSearch extends StatelessWidget {
  final String value;
  final ValueChanged<String>? onValueChange;
  final List<FlowSearchResult> results;
  final bool loading;
  final List<FlowSearchResult> recents;
  final ValueChanged<FlowSearchResult>? onSelect;
  final VoidCallback? onClearRecents;
  final String placeholder;

  const FlowGlobalSearch({
    super.key,
    this.value = '',
    this.onValueChange,
    this.results = const [],
    this.loading = false,
    this.recents = const [],
    this.onSelect,
    this.onClearRecents,
    this.placeholder = 'Search…',
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    final showRecents = value.isEmpty && recents.isNotEmpty;
    final grouped = <String, List<FlowSearchResult>>{};
    for (final r in results) {
      (grouped[r.group ?? ''] ??= []).add(r);
    }

    return Container(
      constraints: const BoxConstraints(maxWidth: 480, maxHeight: 400),
      decoration: BoxDecoration(
        color: scheme.surfaceCard,
        borderRadius: BorderRadius.circular(FlowRadius.xl),
        boxShadow: FlowShadow.float,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Padding(
            padding: const EdgeInsets.all(FlowSpace.s4),
            child: Row(
              children: [
                Icon(Symbols.search_rounded, size: 20, color: scheme.textMuted),
                const SizedBox(width: FlowSpace.s3),
                Expanded(
                  child: TextField(
                    onChanged: onValueChange,
                    style: TextStyle(
                      fontSize: FlowFontSize.bodyMd,
                      color: scheme.textPrimary,
                    ),
                    decoration: InputDecoration(
                      hintText: placeholder,
                      hintStyle: TextStyle(color: scheme.textMuted),
                      border: InputBorder.none,
                      isDense: true,
                      contentPadding: EdgeInsets.zero,
                    ),
                  ),
                ),
              ],
            ),
          ),
          Container(height: 1, color: scheme.borderSubtle),
          if (loading)
            const Padding(
              padding: EdgeInsets.all(FlowSpace.s6),
              child: Center(child: CircularProgressIndicator(strokeWidth: 2)),
            )
          else if (showRecents) ...[
            Padding(
              padding: const EdgeInsets.fromLTRB(
                FlowSpace.s4, FlowSpace.s3, FlowSpace.s4, FlowSpace.s2,
              ),
              child: Row(
                children: [
                  Text(
                    'Recent',
                    style: TextStyle(
                      fontSize: FlowFontSize.bodySm,
                      fontWeight: FontWeight.w600,
                      color: scheme.textMuted,
                    ),
                  ),
                  const Spacer(),
                  if (onClearRecents != null)
                    GestureDetector(
                      onTap: onClearRecents,
                      child: Text(
                        'Clear',
                        style: TextStyle(
                          fontSize: FlowFontSize.bodySm,
                          color: scheme.textAccent,
                        ),
                      ),
                    ),
                ],
              ),
            ),
            for (final r in recents) _resultItem(r, scheme),
          ] else if (results.isNotEmpty)
            Flexible(
              child: ListView(
                shrinkWrap: true,
                padding: const EdgeInsets.symmetric(vertical: FlowSpace.s2),
                children: [
                  for (final entry in grouped.entries) ...[
                    if (entry.key.isNotEmpty)
                      Padding(
                        padding: const EdgeInsets.fromLTRB(
                          FlowSpace.s4, FlowSpace.s3, FlowSpace.s4, FlowSpace.s1,
                        ),
                        child: Text(
                          entry.key.toUpperCase(),
                          style: TextStyle(
                            fontSize: FlowFontSize.labelSm,
                            fontWeight: FontWeight.w600,
                            letterSpacing: 0.5,
                            color: scheme.textMuted,
                          ),
                        ),
                      ),
                    for (final r in entry.value) _resultItem(r, scheme),
                  ],
                ],
              ),
            )
          else if (value.isNotEmpty)
            Padding(
              padding: const EdgeInsets.all(FlowSpace.s6),
              child: Text(
                'No results',
                style: TextStyle(
                  fontSize: FlowFontSize.bodyMd,
                  color: scheme.textMuted,
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _resultItem(FlowSearchResult item, FlowScheme scheme) {
    return GestureDetector(
      onTap: () => onSelect?.call(item),
      child: Padding(
        padding: const EdgeInsets.symmetric(
          horizontal: FlowSpace.s4,
          vertical: FlowSpace.s2,
        ),
        child: Row(
          children: [
            if (item.icon != null) ...[
              Icon(item.icon, size: 18, color: scheme.textSecondary),
              const SizedBox(width: FlowSpace.s3),
            ],
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    item.label,
                    style: TextStyle(
                      fontSize: FlowFontSize.bodyMd,
                      color: scheme.textPrimary,
                    ),
                  ),
                  if (item.hint != null)
                    Text(
                      item.hint!,
                      style: TextStyle(
                        fontSize: FlowFontSize.bodySm,
                        color: scheme.textMuted,
                      ),
                    ),
                ],
              ),
            ),
            if (item.meta != null)
              Text(
                item.meta!,
                style: TextStyle(
                  fontSize: FlowFontSize.bodySm,
                  color: scheme.textMuted,
                ),
              ),
          ],
        ),
      ),
    );
  }
}
