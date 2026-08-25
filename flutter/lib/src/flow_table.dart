import 'package:flutter/material.dart';
import 'package:material_symbols_icons/symbols.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowTableColumn<T> {
  final String header;
  final Widget Function(T row) cell;
  final double? width;
  final FlexColumnWidth? flex;
  final Alignment alignment;

  const FlowTableColumn({
    required this.header,
    required this.cell,
    this.width,
    this.flex,
    this.alignment = Alignment.centerLeft,
  });
}

class FlowTable<T> extends StatelessWidget {
  final List<FlowTableColumn<T>> columns;
  final List<T> rows;
  final String? sortBy;
  final bool sortAsc;
  final ValueChanged<String>? onSort;
  final ValueChanged<T>? onRowTap;
  final bool striped;

  const FlowTable({
    super.key,
    required this.columns,
    required this.rows,
    this.sortBy,
    this.sortAsc = true,
    this.onSort,
    this.onRowTap,
    this.striped = false,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;

    return Container(
      decoration: BoxDecoration(
        border: Border.all(color: scheme.borderSubtle),
        borderRadius: BorderRadius.circular(FlowRadius.lg),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          _buildHeader(scheme),
          for (int i = 0; i < rows.length; i++)
            _buildRow(i, scheme),
        ],
      ),
    );
  }

  Widget _buildHeader(FlowScheme scheme) {
    return Container(
      color: scheme.surfaceSunken,
      padding: const EdgeInsets.symmetric(
        horizontal: FlowSpace.s4,
        vertical: FlowSpace.s3,
      ),
      child: Row(
        children: [
          for (final col in columns)
            Expanded(
              child: GestureDetector(
                onTap: onSort != null ? () => onSort!(col.header) : null,
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      col.header,
                      style: TextStyle(
                        fontSize: FlowFontSize.bodySm,
                        fontWeight: FontWeight.w600,
                        color: scheme.textSecondary,
                      ),
                    ),
                    if (sortBy == col.header)
                      Padding(
                        padding: const EdgeInsets.only(left: FlowSpace.s1),
                        child: Icon(
                          sortAsc
                              ? Symbols.arrow_upward_rounded
                              : Symbols.arrow_downward_rounded,
                          size: 14,
                          color: scheme.textAccent,
                        ),
                      ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildRow(int i, FlowScheme scheme) {
    final row = rows[i];
    return GestureDetector(
      onTap: onRowTap != null ? () => onRowTap!(row) : null,
      child: Container(
        padding: const EdgeInsets.symmetric(
          horizontal: FlowSpace.s4,
          vertical: FlowSpace.s3,
        ),
        decoration: BoxDecoration(
          color: striped && i.isOdd ? scheme.surfaceSunken : scheme.surfaceCard,
          border: i > 0
              ? Border(top: BorderSide(color: scheme.borderSubtle))
              : null,
        ),
        child: Row(
          children: [
            for (final col in columns)
              Expanded(child: col.cell(row)),
          ],
        ),
      ),
    );
  }
}
