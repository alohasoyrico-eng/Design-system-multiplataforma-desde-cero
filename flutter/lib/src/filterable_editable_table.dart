import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowFilterableColumn {
  final String key;
  final String header;
  final bool filterable;
  final bool editable;

  const FlowFilterableColumn({
    required this.key,
    required this.header,
    this.filterable = false,
    this.editable = false,
  });
}

class FlowFilterableEditableTable extends StatefulWidget {
  final List<FlowFilterableColumn> columns;
  final List<Map<String, dynamic>> rows;
  final String rowKey;
  final void Function(String rowKey, String columnKey, String value)? onUpdate;
  final void Function(Map<String, String> filters)? onFilter;

  const FlowFilterableEditableTable({
    super.key,
    required this.columns,
    required this.rows,
    this.rowKey = 'id',
    this.onUpdate,
    this.onFilter,
  });

  @override
  State<FlowFilterableEditableTable> createState() =>
      _FlowFilterableEditableTableState();
}

class _FlowFilterableEditableTableState
    extends State<FlowFilterableEditableTable> {
  final _filters = <String, String>{};

  List<Map<String, dynamic>> get _filteredRows {
    return widget.rows.where((row) {
      for (final entry in _filters.entries) {
        if (entry.value.isEmpty) continue;
        final cellVal = '${row[entry.key] ?? ''}'.toLowerCase();
        if (!cellVal.contains(entry.value.toLowerCase())) return false;
      }
      return true;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    final rows = _filteredRows;

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
          if (widget.columns.any((c) => c.filterable))
            _buildFilterRow(scheme),
          for (int i = 0; i < rows.length; i++)
            _buildRow(rows[i], i, scheme),
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
          for (final col in widget.columns)
            Expanded(
              child: Text(
                col.header,
                style: TextStyle(
                  fontSize: FlowFontSize.bodySm,
                  fontWeight: FontWeight.w600,
                  color: scheme.textSecondary,
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildFilterRow(FlowScheme scheme) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: FlowSpace.s4,
        vertical: FlowSpace.s2,
      ),
      decoration: BoxDecoration(
        color: scheme.surfaceCard,
        border: Border(bottom: BorderSide(color: scheme.borderSubtle)),
      ),
      child: Row(
        children: [
          for (final col in widget.columns)
            Expanded(
              child: col.filterable
                  ? SizedBox(
                      height: 32,
                      child: TextField(
                        onChanged: (v) {
                          setState(() => _filters[col.key] = v);
                          widget.onFilter?.call(Map.from(_filters));
                        },
                        style: TextStyle(
                          fontSize: FlowFontSize.bodySm,
                          color: scheme.textPrimary,
                        ),
                        decoration: InputDecoration(
                          hintText: 'Filter…',
                          hintStyle: TextStyle(
                            fontSize: FlowFontSize.bodySm,
                            color: scheme.textMuted,
                          ),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(FlowRadius.xs),
                            borderSide: BorderSide(color: scheme.borderSubtle),
                          ),
                          isDense: true,
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: FlowSpace.s2,
                            vertical: FlowSpace.s1,
                          ),
                        ),
                      ),
                    )
                  : const SizedBox.shrink(),
            ),
        ],
      ),
    );
  }

  Widget _buildRow(Map<String, dynamic> row, int i, FlowScheme scheme) {
    return Container(
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
          for (final col in widget.columns)
            Expanded(
              child: col.editable
                  ? GestureDetector(
                      onDoubleTap: () => _editCell(row, col, scheme),
                      child: Text(
                        '${row[col.key] ?? ''}',
                        style: TextStyle(
                          fontSize: FlowFontSize.bodyMd,
                          color: scheme.textPrimary,
                        ),
                      ),
                    )
                  : Text(
                      '${row[col.key] ?? ''}',
                      style: TextStyle(
                        fontSize: FlowFontSize.bodyMd,
                        color: scheme.textPrimary,
                      ),
                    ),
            ),
        ],
      ),
    );
  }

  void _editCell(
    Map<String, dynamic> row,
    FlowFilterableColumn col,
    FlowScheme scheme,
  ) {
    final controller = TextEditingController(text: '${row[col.key] ?? ''}');
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text('Edit ${col.header}'),
        content: TextField(
          controller: controller,
          autofocus: true,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              widget.onUpdate?.call(
                '${row[widget.rowKey]}',
                col.key,
                controller.text,
              );
              Navigator.pop(ctx);
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }
}
