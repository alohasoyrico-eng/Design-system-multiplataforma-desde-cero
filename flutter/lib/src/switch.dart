import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowSwitch extends StatelessWidget {
  final bool checked;
  final ValueChanged<bool>? onChange;
  final String? label;
  final bool disabled;

  const FlowSwitch({
    super.key,
    required this.checked,
    this.onChange,
    this.label,
    this.disabled = false,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;

    return Semantics(
      label: label,
      toggled: checked,
      child: GestureDetector(
        onTap: disabled ? null : () => onChange?.call(!checked),
        child: Opacity(
          opacity: disabled ? 0.5 : 1.0,
          child: AnimatedContainer(
            duration: FlowDuration.fast,
            width: 48,
            height: 28,
            padding: const EdgeInsets.all(3),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(FlowRadius.pill),
              color: checked ? scheme.actionAccent : scheme.borderDefault,
            ),
            alignment: checked ? Alignment.centerRight : Alignment.centerLeft,
            child: Container(
              width: 22,
              height: 22,
              decoration: const BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
