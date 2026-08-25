import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowRadio extends StatelessWidget {
  final String? name;
  final String value;
  final bool checked;
  final ValueChanged<String>? onChange;
  final String? label;
  final String? description;
  final bool disabled;

  const FlowRadio({
    super.key,
    this.name,
    required this.value,
    this.checked = false,
    this.onChange,
    this.label,
    this.description,
    this.disabled = false,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;

    return GestureDetector(
      onTap: disabled ? null : () => onChange?.call(value),
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
                shape: BoxShape.circle,
                border: Border.all(
                  color: checked ? scheme.actionAccent : scheme.borderDefault,
                  width: 2,
                ),
              ),
              child: checked
                  ? Center(
                      child: Container(
                        width: 10,
                        height: 10,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: scheme.actionAccent,
                        ),
                      ),
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
