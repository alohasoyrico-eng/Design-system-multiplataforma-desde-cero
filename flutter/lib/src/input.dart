import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowInput extends StatelessWidget {
  final String? value;
  final ValueChanged<String>? onChange;
  final String? placeholder;
  final IconData? icon;
  final bool error;
  final bool disabled;
  final bool mono;
  final TextInputType? keyboardType;

  const FlowInput({
    super.key,
    this.value,
    this.onChange,
    this.placeholder,
    this.icon,
    this.error = false,
    this.disabled = false,
    this.mono = false,
    this.keyboardType,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    final borderColor = error ? FlowColors.danger500 : scheme.borderDefault;

    return Opacity(
      opacity: disabled ? 0.5 : 1.0,
      child: Container(
        decoration: BoxDecoration(
          color: scheme.surfaceSunken,
          border: Border.all(color: borderColor, width: 1),
          borderRadius: BorderRadius.circular(FlowRadius.md),
        ),
        padding: const EdgeInsets.symmetric(horizontal: FlowSpace.s3),
        child: Row(
          children: [
            if (icon != null) ...[
              Icon(icon, size: 18, color: scheme.textMuted),
              const SizedBox(width: FlowSpace.s2),
            ],
            Expanded(
              child: TextField(
                controller: value != null ? TextEditingController(text: value) : null,
                onChanged: onChange,
                enabled: !disabled,
                keyboardType: keyboardType,
                style: TextStyle(
                  fontSize: FlowFontSize.bodyMd,
                  color: scheme.textPrimary,
                  fontFamily: mono ? FlowFontFamily.mono : null,
                  letterSpacing: mono ? 0.5 : null,
                ),
                decoration: InputDecoration(
                  hintText: placeholder,
                  hintStyle: TextStyle(
                    fontSize: FlowFontSize.bodyMd,
                    color: scheme.textMuted,
                  ),
                  border: InputBorder.none,
                  contentPadding: const EdgeInsets.symmetric(vertical: FlowSpace.s3),
                  isDense: true,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
