import 'package:flutter/material.dart';
import 'package:material_symbols_icons/symbols.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowTableTreeNode<T> {
  final T data;
  final List<FlowTableTreeNode<T>> children;
  final bool expanded;

  const FlowTableTreeNode({
    required this.data,
    this.children = const [],
    this.expanded = false,
  });
}

class FlowTableTree<T> extends StatefulWidget {
  final List<FlowTableTreeNode<T>> nodes;
  final Widget Function(T data, int depth) labelBuilder;
  final List<Widget Function(T data)> columns;
  final List<String>? columnHeaders;
  final int indentWidth;

  const FlowTableTree({
    super.key,
    required this.nodes,
    required this.labelBuilder,
    this.columns = const [],
    this.columnHeaders,
    this.indentWidth = 24,
  });

  @override
  State<FlowTableTree<T>> createState() => _FlowTableTreeState<T>();
}

class _FlowTableTreeState<T> extends State<FlowTableTree<T>> {
  final _expanded = <int>{};

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    final rows = <_FlatRow<T>>[];
    _flatten(widget.nodes, 0, rows);

    return Container(
      decoration: BoxDecoration(
        border: Border.all(color: scheme.borderSubtle),
        borderRadius: BorderRadius.circular(FlowRadius.lg),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (widget.columnHeaders != null)
            Container(
              color: scheme.surfaceSunken,
              padding: const EdgeInsets.symmetric(
                horizontal: FlowSpace.s4,
                vertical: FlowSpace.s3,
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      widget.columnHeaders!.first,
                      style: TextStyle(
                        fontSize: FlowFontSize.bodySm,
                        fontWeight: FontWeight.w600,
                        color: scheme.textSecondary,
                      ),
                    ),
                  ),
                  for (int c = 1; c < widget.columnHeaders!.length; c++)
                    Expanded(
                      child: Text(
                        widget.columnHeaders![c],
                        style: TextStyle(
                          fontSize: FlowFontSize.bodySm,
                          fontWeight: FontWeight.w600,
                          color: scheme.textSecondary,
                        ),
                      ),
                    ),
                ],
              ),
            ),
          for (int i = 0; i < rows.length; i++)
            _buildRow(rows[i], i, scheme),
        ],
      ),
    );
  }

  void _flatten(List<FlowTableTreeNode<T>> nodes, int depth, List<_FlatRow<T>> out) {
    for (int i = 0; i < nodes.length; i++) {
      final node = nodes[i];
      final idx = out.length;
      out.add(_FlatRow(
        node: node,
        depth: depth,
        index: idx,
        hasChildren: node.children.isNotEmpty,
      ));
      if (node.children.isNotEmpty && _expanded.contains(idx)) {
        _flatten(node.children, depth + 1, out);
      }
    }
  }

  Widget _buildRow(_FlatRow<T> row, int i, FlowScheme scheme) {
    final isExpanded = _expanded.contains(row.index);

    return GestureDetector(
      onTap: row.hasChildren
          ? () => setState(() {
                if (isExpanded) {
                  _expanded.remove(row.index);
                } else {
                  _expanded.add(row.index);
                }
              })
          : null,
      child: Container(
        padding: const EdgeInsets.symmetric(
          horizontal: FlowSpace.s4,
          vertical: FlowSpace.s3,
        ),
        decoration: BoxDecoration(
          color: scheme.surfaceCard,
          border: i > 0
              ? Border(top: BorderSide(color: scheme.borderSubtle))
              : null,
        ),
        child: Row(
          children: [
            Expanded(
              child: Padding(
                padding: EdgeInsets.only(
                  left: row.depth * widget.indentWidth.toDouble(),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    if (row.hasChildren) ...[
                      AnimatedRotation(
                        turns: isExpanded ? 0.25 : 0,
                        duration: FlowDuration.fast,
                        child: Icon(
                          Symbols.chevron_right_rounded,
                          size: 18,
                          color: scheme.textMuted,
                        ),
                      ),
                      const SizedBox(width: FlowSpace.s1),
                    ] else
                      const SizedBox(width: 22),
                    Expanded(child: widget.labelBuilder(row.node.data, row.depth)),
                  ],
                ),
              ),
            ),
            for (final col in widget.columns)
              Expanded(child: col(row.node.data)),
          ],
        ),
      ),
    );
  }
}

class _FlatRow<T> {
  final FlowTableTreeNode<T> node;
  final int depth;
  final int index;
  final bool hasChildren;

  const _FlatRow({
    required this.node,
    required this.depth,
    required this.index,
    required this.hasChildren,
  });
}
