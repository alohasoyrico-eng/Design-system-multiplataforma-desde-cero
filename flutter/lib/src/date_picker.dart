import 'package:flutter/material.dart';
import 'package:material_symbols_icons/symbols.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowDatePicker extends StatelessWidget {
  final DateTime? value;
  final ValueChanged<DateTime>? onChange;
  final String? label;
  final String placeholder;
  final DateTime? firstDate;
  final DateTime? lastDate;
  final bool disabled;

  const FlowDatePicker({
    super.key,
    this.value,
    this.onChange,
    this.label,
    this.placeholder = 'Select date',
    this.firstDate,
    this.lastDate,
    this.disabled = false,
  });

  Future<void> _pick(BuildContext context) async {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    final now = DateTime.now();
    final result = await showDatePicker(
      context: context,
      initialDate: value ?? now,
      firstDate: firstDate ?? DateTime(2000),
      lastDate: lastDate ?? DateTime(2100),
      builder: (ctx, child) => Theme(
        data: Theme.of(ctx).copyWith(
          colorScheme: ColorScheme.fromSeed(
            seedColor: scheme.actionAccent,
            surface: scheme.surfaceCard,
          ),
        ),
        child: child!,
      ),
    );
    if (result != null) onChange?.call(result);
  }

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    final formatted = value != null
        ? '${value!.day.toString().padLeft(2, '0')}/${value!.month.toString().padLeft(2, '0')}/${value!.year}'
        : null;

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
          onTap: disabled ? null : () => _pick(context),
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
                  Symbols.calendar_today_rounded,
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
