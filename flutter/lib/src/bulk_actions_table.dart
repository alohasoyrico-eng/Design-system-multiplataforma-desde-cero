import 'package:flutter/material.dart';
import 'package:material_symbols_icons/symbols.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowBulkAction {
  final String id;
  final String label;
  final IconData? icon;
  final bool danger;

  const FlowBulkAction({
    required this.id,
    required this.label,
    this.icon,
    this.danger = false,
  });
}

class FlowBulkActionsTable<T> extends StatefulWidget {
  final List<String> columnHeaders;
  final List<T> rows;
  final String Function(T) rowKey;
  final List<Widget Function(T)> cellBuilders;
  final List<FlowBulkAction> actions;
  final void Function(String actionId, List<String> selectedKeys)? onActionClick;

  const FlowBulkActionsTable({
    super.key,
    required this.columnHeaders,
    required this.rows,
    required this.rowKey,
    required this.cellBuilders,
    this.actions = const [],
    this.onActionClick,
  });

  @override
  State<FlowBulkActionsTable<T>> createState() => _FlowBulkActionsTableState<T>();
}

class _FlowBulkActionsTableState<T> extends State<FlowBulkActionsTable<T>> {
  final _selected = <String>{};

  bool get _allSelected =>
      widget.rows.isNotEmpty &&
      widget.rows.every((r) => _selected.contains(widget.rowKey(r)));

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
          if (_selected.isNotEmpty) _buildBulkBar(scheme),
          _buildHeader(scheme),
          for (int i = 0; i < widget.rows.length; i++)
            _buildRow(i, scheme),
        ],
      ),
    );
  }

  Widget _buildBulkBar(FlowScheme scheme) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: FlowSpace.s4,
        vertical: FlowSpace.s2,
      ),
      color: scheme.surfaceAccentSubtle,
      child: Row(
        children: [
          Text(
            '${_selected.length} selected',
            style: TextStyle(
              fontSize: FlowFontSize.bodySm,
              fontWeight: FontWeight.w600,
              color: scheme.textAccent,
            ),
          ),
          const Spacer(),
          for (final action in widget.actions)
            Padding(
              padding: const EdgeInsets.only(left: FlowSpace.s2),
              child: GestureDetector(
                onTap: () => widget.onActionClick?.call(
                  action.id,
                  _selected.toList(),
                ),
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: FlowSpace.s3,
                    vertical: FlowSpace.s1,
                  ),
                  decoration: BoxDecoration(
                    color: action.danger
                        ? FlowColors.danger500.withValues(alpha: 0.1)
                        : scheme.surfaceCard,
                    borderRadius: BorderRadius.circular(FlowRadius.sm),
                    border: Border.all(color: scheme.borderSubtle),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      if (action.icon != null) ...[
                        Icon(
                          action.icon,
                          size: 14,
                          color: action.danger
                              ? FlowColors.danger500
                              : scheme.textPrimary,
                        ),
                        const SizedBox(width: FlowSpace.s1),
                      ],
                      Text(
                        action.label,
                        style: TextStyle(
                          fontSize: FlowFontSize.bodySm,
                          color: action.danger
                              ? FlowColors.danger500
                              : scheme.textPrimary,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
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
          _checkbox(_allSelected, scheme, (v) {
            setState(() {
              if (v) {
                _selected.addAll(widget.rows.map(widget.rowKey));
              } else {
                _selected.clear();
              }
            });
          }),
          const SizedBox(width: FlowSpace.s3),
          for (final header in widget.columnHeaders)
            Expanded(
              child: Text(
                header,
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

  Widget _buildRow(int i, FlowScheme scheme) {
    final row = widget.rows[i];
    final key = widget.rowKey(row);
    final isSelected = _selected.contains(key);

    return GestureDetector(
      onTap: () => setState(() {
        if (isSelected) {
          _selected.remove(key);
        } else {
          _selected.add(key);
        }
      }),
      child: Container(
        padding: const EdgeInsets.symmetric(
          horizontal: FlowSpace.s4,
          vertical: FlowSpace.s3,
        ),
        decoration: BoxDecoration(
          color: isSelected ? scheme.surfaceAccentSubtle : scheme.surfaceCard,
          border: i > 0
              ? Border(top: BorderSide(color: scheme.borderSubtle))
              : null,
        ),
        child: Row(
          children: [
            _checkbox(isSelected, scheme, (_) {
              setState(() {
                if (isSelected) {
                  _selected.remove(key);
                } else {
                  _selected.add(key);
                }
              });
            }),
            const SizedBox(width: FlowSpace.s3),
            for (final cellBuilder in widget.cellBuilders)
              Expanded(child: cellBuilder(row)),
          ],
        ),
      ),
    );
  }

  Widget _checkbox(bool checked, FlowScheme scheme, ValueChanged<bool> onTap) {
    return GestureDetector(
      onTap: () => onTap(!checked),
      child: Container(
        width: 20,
        height: 20,
        decoration: BoxDecoration(
          color: checked ? scheme.actionAccent : Colors.transparent,
          borderRadius: BorderRadius.circular(4),
          border: Border.all(
            color: checked ? scheme.actionAccent : scheme.borderDefault,
          ),
        ),
        child: checked
            ? Icon(Symbols.check_rounded, size: 14, color: scheme.textOnAccent)
            : null,
      ),
    );
  }
}
