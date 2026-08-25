import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowTextarea extends StatelessWidget {
  final String? value;
  final ValueChanged<String>? onChange;
  final String? placeholder;
  final int rows;
  final int? maxLength;
  final bool disabled;
  final bool invalid;

  const FlowTextarea({
    super.key,
    this.value,
    this.onChange,
    this.placeholder,
    this.rows = 3,
    this.maxLength,
    this.disabled = false,
    this.invalid = false,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;

    return Opacity(
      opacity: disabled ? 0.5 : 1.0,
      child: TextField(
        controller: value != null ? TextEditingController(text: value) : null,
        onChanged: disabled ? null : onChange,
        maxLines: rows,
        maxLength: maxLength,
        enabled: !disabled,
        style: TextStyle(
          fontSize: FlowFontSize.bodyMd,
          color: scheme.textPrimary,
          fontFamily: FlowFontFamily.body,
        ),
        decoration: InputDecoration(
          hintText: placeholder,
          hintStyle: TextStyle(color: scheme.textMuted),
          filled: true,
          fillColor: scheme.surfaceSunken,
          contentPadding: const EdgeInsets.all(FlowSpace.s3),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(FlowRadius.md),
            borderSide: BorderSide(color: scheme.borderDefault),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(FlowRadius.md),
            borderSide: BorderSide(
              color: invalid ? scheme.borderFocus : scheme.borderDefault,
            ),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(FlowRadius.md),
            borderSide: BorderSide(color: scheme.borderFocus, width: 2),
          ),
          counterStyle: TextStyle(
            fontSize: FlowFontSize.bodySm,
            color: scheme.textMuted,
          ),
        ),
      ),
    );
  }
}
