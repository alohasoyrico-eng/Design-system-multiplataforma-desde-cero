import 'package:flutter/material.dart';
import 'package:material_symbols_icons/symbols.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowHelpArticle {
  final String id;
  final String title;
  final String? category;
  final String? content;
  final List<String>? keywords;

  const FlowHelpArticle({
    required this.id,
    required this.title,
    this.category,
    this.content,
    this.keywords,
  });
}

class FlowHelpCenter extends StatefulWidget {
  final List<FlowHelpArticle> articles;

  const FlowHelpCenter({super.key, required this.articles});

  @override
  State<FlowHelpCenter> createState() => _FlowHelpCenterState();
}

class _FlowHelpCenterState extends State<FlowHelpCenter> {
  String _query = '';
  String? _selectedId;

  List<FlowHelpArticle> get _filtered {
    if (_query.isEmpty) return widget.articles;
    final q = _query.toLowerCase();
    return widget.articles.where((a) {
      return a.title.toLowerCase().contains(q) ||
          (a.category?.toLowerCase().contains(q) ?? false) ||
          (a.keywords?.any((k) => k.toLowerCase().contains(q)) ?? false);
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    final selected = _selectedId != null
        ? widget.articles.where((a) => a.id == _selectedId).firstOrNull
        : null;

    if (selected != null) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          GestureDetector(
            onTap: () => setState(() => _selectedId = null),
            child: Padding(
              padding: const EdgeInsets.all(FlowSpace.s4),
              child: Row(
                children: [
                  Icon(Symbols.arrow_back_rounded, size: 20, color: scheme.textAccent),
                  const SizedBox(width: FlowSpace.s2),
                  Text(
                    'Back',
                    style: TextStyle(
                      fontSize: FlowFontSize.bodyMd,
                      color: scheme.textAccent,
                    ),
                  ),
                ],
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: FlowSpace.s4),
            child: Text(
              selected.title,
              style: TextStyle(
                fontSize: FlowFontSize.titleLg,
                fontWeight: FontWeight.w600,
                color: scheme.textPrimary,
              ),
            ),
          ),
          if (selected.content != null)
            Padding(
              padding: const EdgeInsets.all(FlowSpace.s4),
              child: Text(
                selected.content!,
                style: TextStyle(
                  fontSize: FlowFontSize.bodyMd,
                  color: scheme.textSecondary,
                  height: 1.6,
                ),
              ),
            ),
        ],
      );
    }

    final results = _filtered;
    final grouped = <String, List<FlowHelpArticle>>{};
    for (final a in results) {
      (grouped[a.category ?? ''] ??= []).add(a);
    }

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Padding(
          padding: const EdgeInsets.all(FlowSpace.s4),
          child: TextField(
            onChanged: (v) => setState(() => _query = v),
            style: TextStyle(
              fontSize: FlowFontSize.bodyMd,
              color: scheme.textPrimary,
            ),
            decoration: InputDecoration(
              hintText: 'Search articles…',
              hintStyle: TextStyle(color: scheme.textMuted),
              prefixIcon: Icon(Symbols.search_rounded, size: 20, color: scheme.textMuted),
              filled: true,
              fillColor: scheme.surfaceSunken,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(FlowRadius.md),
                borderSide: BorderSide.none,
              ),
              isDense: true,
              contentPadding: const EdgeInsets.symmetric(
                horizontal: FlowSpace.s3,
                vertical: FlowSpace.s3,
              ),
            ),
          ),
        ),
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
          for (final article in entry.value)
            GestureDetector(
              onTap: () => setState(() => _selectedId = article.id),
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(
                  horizontal: FlowSpace.s4,
                  vertical: FlowSpace.s3,
                ),
                decoration: BoxDecoration(
                  border: Border(bottom: BorderSide(color: scheme.borderSubtle)),
                ),
                child: Row(
                  children: [
                    Icon(Symbols.article_rounded, size: 18, color: scheme.textMuted),
                    const SizedBox(width: FlowSpace.s3),
                    Expanded(
                      child: Text(
                        article.title,
                        style: TextStyle(
                          fontSize: FlowFontSize.bodyMd,
                          color: scheme.textPrimary,
                        ),
                      ),
                    ),
                    Icon(Symbols.chevron_right_rounded, size: 18, color: scheme.textMuted),
                  ],
                ),
              ),
            ),
        ],
      ],
    );
  }
}
