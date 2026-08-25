import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowKanbanColumn {
  final String id;
  final String label;
  final Color? color;
  final int? limit;

  const FlowKanbanColumn({
    required this.id,
    required this.label,
    this.color,
    this.limit,
  });
}

class FlowKanbanBoard<T> extends StatelessWidget {
  final List<FlowKanbanColumn> columns;
  final List<T> items;
  final String Function(T) columnKey;
  final String Function(T) itemKey;
  final Widget Function(T) renderCard;

  const FlowKanbanBoard({
    super.key,
    required this.columns,
    required this.items,
    required this.columnKey,
    required this.itemKey,
    required this.renderCard,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          for (int i = 0; i < columns.length; i++) ...[
            if (i > 0) const SizedBox(width: FlowSpace.s3),
            _buildColumn(columns[i], scheme),
          ],
        ],
      ),
    );
  }

  Widget _buildColumn(FlowKanbanColumn column, FlowScheme scheme) {
    final colItems = items.where((item) => columnKey(item) == column.id).toList();
    final atLimit = column.limit != null && colItems.length >= column.limit!;

    return Container(
      width: 280,
      decoration: BoxDecoration(
        color: scheme.surfaceSunken,
        borderRadius: BorderRadius.circular(FlowRadius.lg),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(FlowSpace.s3),
            child: Row(
              children: [
                if (column.color != null)
                  Container(
                    width: 8,
                    height: 8,
                    margin: const EdgeInsets.only(right: FlowSpace.s2),
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: column.color,
                    ),
                  ),
                Expanded(
                  child: Text(
                    column.label,
                    style: TextStyle(
                      fontSize: FlowFontSize.bodySm,
                      fontWeight: FontWeight.w600,
                      color: scheme.textPrimary,
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: FlowSpace.s2, vertical: 2),
                  decoration: BoxDecoration(
                    color: atLimit
                        ? FlowColors.orange500.withValues(alpha: 0.15)
                        : scheme.surfaceCard,
                    borderRadius: BorderRadius.circular(FlowRadius.pill),
                  ),
                  child: Text(
                    '${colItems.length}${column.limit != null ? '/${column.limit}' : ''}',
                    style: TextStyle(
                      fontSize: FlowFontSize.labelSm,
                      fontWeight: FontWeight.w600,
                      color: atLimit
                          ? FlowColors.orange500
                          : scheme.textMuted,
                    ),
                  ),
                ),
              ],
            ),
          ),
          for (final item in colItems)
            Padding(
              padding: const EdgeInsets.fromLTRB(
                FlowSpace.s2, 0, FlowSpace.s2, FlowSpace.s2,
              ),
              child: renderCard(item),
            ),
          if (colItems.isEmpty)
            Padding(
              padding: const EdgeInsets.all(FlowSpace.s4),
              child: Text(
                'No items',
                style: TextStyle(
                  fontSize: FlowFontSize.bodySm,
                  color: scheme.textMuted,
                ),
              ),
            ),
        ],
      ),
    );
  }
}
