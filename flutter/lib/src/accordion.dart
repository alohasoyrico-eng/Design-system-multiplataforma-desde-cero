import 'package:flutter/material.dart';
import 'package:material_symbols_icons/symbols.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowAccordionItem {
  final String id;
  final String title;
  final Widget content;
  final IconData? icon;
  final String? meta;

  const FlowAccordionItem({
    required this.id,
    required this.title,
    required this.content,
    this.icon,
    this.meta,
  });
}

class FlowAccordion extends StatefulWidget {
  final List<FlowAccordionItem> items;
  final String? defaultOpen;
  /// Permite varios paneles abiertos a la vez. Default false (exclusivo).
  final bool multiple;

  const FlowAccordion({
    super.key,
    this.items = const [],
    this.defaultOpen,
    this.multiple = false,
  });

  @override
  State<FlowAccordion> createState() => _FlowAccordionState();
}

class _FlowAccordionState extends State<FlowAccordion> {
  late final Set<String> _openIds = {
    if (widget.defaultOpen != null) widget.defaultOpen!,
  };

  void _toggle(String id) {
    setState(() {
      final isOpen = _openIds.contains(id);
      if (widget.multiple) {
        isOpen ? _openIds.remove(id) : _openIds.add(id);
      } else {
        _openIds.clear();
        if (!isOpen) _openIds.add(id);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        for (int i = 0; i < widget.items.length; i++) ...[
          if (i > 0) Container(height: 1, color: scheme.borderSubtle),
          _buildItem(widget.items[i], scheme),
        ],
      ],
    );
  }

  Widget _buildItem(FlowAccordionItem item, FlowScheme scheme) {
    final isOpen = _openIds.contains(item.id);

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        GestureDetector(
          onTap: () => _toggle(item.id),
          child: Container(
            padding: const EdgeInsets.symmetric(
              horizontal: FlowSpace.s4,
              vertical: FlowSpace.s3,
            ),
            child: Row(
              children: [
                if (item.icon != null) ...[
                  Icon(item.icon, size: 20, color: scheme.textSecondary),
                  const SizedBox(width: FlowSpace.s3),
                ],
                Expanded(
                  child: Text(
                    item.title,
                    style: TextStyle(
                      fontSize: FlowFontSize.bodyMd,
                      fontWeight: FontWeight.w600,
                      color: scheme.textPrimary,
                    ),
                  ),
                ),
                if (item.meta != null)
                  Padding(
                    padding: const EdgeInsets.only(right: FlowSpace.s2),
                    child: Text(
                      item.meta!,
                      style: TextStyle(
                        fontSize: FlowFontSize.bodySm,
                        color: scheme.textMuted,
                      ),
                    ),
                  ),
                AnimatedRotation(
                  turns: isOpen ? 0.5 : 0,
                  duration: FlowDuration.fast,
                  child: Icon(
                    Symbols.expand_more_rounded,
                    size: 20,
                    color: scheme.textMuted,
                  ),
                ),
              ],
            ),
          ),
        ),
        AnimatedCrossFade(
          firstChild: const SizedBox.shrink(),
          secondChild: Padding(
            padding: const EdgeInsets.fromLTRB(
              FlowSpace.s4, 0, FlowSpace.s4, FlowSpace.s4,
            ),
            child: item.content,
          ),
          crossFadeState:
              isOpen ? CrossFadeState.showSecond : CrossFadeState.showFirst,
          duration: FlowDuration.base,
        ),
      ],
    );
  }
}
