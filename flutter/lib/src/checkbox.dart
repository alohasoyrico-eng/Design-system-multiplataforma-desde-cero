import 'package:flutter/material.dart';
import 'package:material_symbols_icons/symbols.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowCheckbox extends StatelessWidget {
  final bool checked;
  final bool indeterminate;
  final ValueChanged<bool>? onChange;
  final String? label;
  final String? description;
  final bool disabled;

  const FlowCheckbox({
    super.key,
    this.checked = false,
    this.indeterminate = false,
    this.onChange,
    this.label,
    this.description,
    this.disabled = false,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    final active = checked || indeterminate;

    return GestureDetector(
      onTap: disabled ? null : () => onChange?.call(!checked),
      child: Opacity(
        opacity: disabled ? 0.5 : 1.0,
        child: Row(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 20,
              height: 20,
              decoration: BoxDecoration(
                color: active ? scheme.actionAccent : Colors.transparent,
                border: Border.all(
                  color: active ? scheme.actionAccent : scheme.borderDefault,
                  width: 2,
                ),
                borderRadius: BorderRadius.circular(FlowRadius.xs),
              ),
              child: active
                  ? Icon(
                      indeterminate ? Symbols.remove_rounded : Symbols.check_rounded,
                      size: 16,
                      color: scheme.textOnAccent,
                    )
                  : null,
            ),
            if (label != null) ...[
              const SizedBox(width: FlowSpace.s2),
              Flexible(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      label!,
                      style: TextStyle(
                        fontSize: FlowFontSize.bodyMd,
                        fontWeight: FontWeight.w500,
                        color: scheme.textPrimary,
                      ),
                    ),
                    if (description != null)
                      Padding(
                        padding: const EdgeInsets.only(top: 2),
                        child: Text(
                          description!,
                          style: TextStyle(
                            fontSize: FlowFontSize.bodySm,
                            color: scheme.textMuted,
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
