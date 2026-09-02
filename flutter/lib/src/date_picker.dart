import 'package:flutter/material.dart';
import 'package:material_symbols_icons/symbols.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

enum FlowDatePickerMode { single, range }

class FlowDatePicker extends StatelessWidget {
  final DateTime? value;
  final ValueChanged<DateTime>? onChange;
  /// El único calendario del sistema: una fecha o un rango.
  final FlowDatePickerMode mode;
  final DateTimeRange? rangeValue;
  final ValueChanged<DateTimeRange>? onRangeChange;
  final String? label;
  final String placeholder;
  final DateTime? firstDate;
  final DateTime? lastDate;
  final bool disabled;

  const FlowDatePicker({
    super.key,
    this.value,
    this.onChange,
    this.mode = FlowDatePickerMode.single,
    this.rangeValue,
    this.onRangeChange,
    this.label,
    this.placeholder = 'Select date',
    this.firstDate,
    this.lastDate,
    this.disabled = false,
  });

  ThemeData _pickerTheme(BuildContext ctx, FlowScheme scheme) =>
      Theme.of(ctx).copyWith(
        colorScheme: ColorScheme.fromSeed(
          seedColor: scheme.actionAccent,
          surface: scheme.surfaceCard,
        ),
      );

  Future<void> _pickRange(BuildContext context) async {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    final result = await showDateRangePicker(
      context: context,
      initialDateRange: rangeValue,
      firstDate: firstDate ?? DateTime(2000),
      lastDate: lastDate ?? DateTime(2100),
      builder: (ctx, child) => Theme(data: _pickerTheme(ctx, scheme), child: child!),
    );
    if (result != null) onRangeChange?.call(result);
  }

  Future<void> _pick(BuildContext context) async {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    final now = DateTime.now();
    final result = await showDatePicker(
      context: context,
      initialDate: value ?? now,
      firstDate: firstDate ?? DateTime(2000),
      lastDate: lastDate ?? DateTime(2100),
      builder: (ctx, child) => Theme(data: _pickerTheme(ctx, scheme), child: child!),
    );
    if (result != null) onChange?.call(result);
  }

  String _fmt(DateTime d) =>
      '${d.day.toString().padLeft(2, '0')}/${d.month.toString().padLeft(2, '0')}/${d.year}';

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    final isRange = mode == FlowDatePickerMode.range;
    final formatted = isRange
        ? (rangeValue != null ? '${_fmt(rangeValue!.start)} – ${_fmt(rangeValue!.end)}' : null)
        : (value != null ? _fmt(value!) : null);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (label != null)
          Padding(
            padding: const EdgeInsets.only(bottom: FlowSpace.s1),
            child: Text(
              label!,
              style: TextStyle(
                fontSize: FlowFontSize.bodySm,
                fontWeight: FontWeight.w600,
                color: scheme.textSecondary,
              ),
            ),
          ),
        GestureDetector(
          onTap: disabled ? null : () => isRange ? _pickRange(context) : _pick(context),
          child: Container(
            height: 44,
            padding: const EdgeInsets.symmetric(horizontal: FlowSpace.s3),
            decoration: BoxDecoration(
              color: scheme.surfaceSunken,
              borderRadius: BorderRadius.circular(FlowRadius.md),
              border: Border.all(color: scheme.borderDefault),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    formatted ?? placeholder,
                    style: TextStyle(
                      fontSize: FlowFontSize.bodyMd,
                      color: formatted != null
                          ? scheme.textPrimary
                          : scheme.textMuted,
                    ),
                  ),
                ),
                Icon(
                  isRange ? Symbols.date_range_rounded : Symbols.calendar_today_rounded,
                  size: 18,
                  color: scheme.textMuted,
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
