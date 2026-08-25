import 'package:flutter/material.dart';
import 'package:material_symbols_icons/symbols.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowStepperStep {
  final String label;
  final String? description;

  const FlowStepperStep({required this.label, this.description});
}

enum FlowStepperOrientation { horizontal, vertical }

class FlowStepper extends StatelessWidget {
  final List<FlowStepperStep> steps;
  final int current;
  final FlowStepperOrientation orientation;

  const FlowStepper({
    super.key,
    required this.steps,
    this.current = 0,
    this.orientation = FlowStepperOrientation.horizontal,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;

    if (orientation == FlowStepperOrientation.vertical) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          for (int i = 0; i < steps.length; i++) ...[
            _verticalStep(i, scheme),
            if (i < steps.length - 1)
              Padding(
                padding: const EdgeInsets.only(left: FlowSpace.s3),
                child: Container(
                  width: 2,
                  height: 24,
                  color: i < current ? scheme.actionAccent : scheme.borderSubtle,
                ),
              ),
          ],
        ],
      );
    }

    return Row(
      children: [
        for (int i = 0; i < steps.length; i++) ...[
          _dot(i, scheme),
          if (i < steps.length - 1)
            Expanded(
              child: Container(
                height: 2,
                margin: const EdgeInsets.symmetric(horizontal: FlowSpace.s2),
                color: i < current ? scheme.actionAccent : scheme.borderSubtle,
              ),
            ),
        ],
      ],
    );
  }

  Widget _dot(int i, FlowScheme scheme) {
    final done = i < current;
    final active = i == current;

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 24,
          height: 24,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: done
                ? scheme.actionAccent
                : active
                    ? scheme.surfaceCard
                    : Colors.transparent,
            border: Border.all(
              color: done || active ? scheme.actionAccent : scheme.borderDefault,
              width: 2,
            ),
          ),
          child: done
              ? Icon(Symbols.check_rounded, size: 14, color: scheme.textOnAccent)
              : active
                  ? Center(
                      child: Container(
                        width: 8,
                        height: 8,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: scheme.actionAccent,
                        ),
                      ),
                    )
                  : null,
        ),
        const SizedBox(height: FlowSpace.s1),
        Text(
          steps[i].label,
          style: TextStyle(
            fontSize: FlowFontSize.bodySm,
            fontWeight: active ? FontWeight.w600 : FontWeight.w400,
            color: done || active ? scheme.textPrimary : scheme.textMuted,
          ),
        ),
      ],
    );
  }

  Widget _verticalStep(int i, FlowScheme scheme) {
    final done = i < current;
    final active = i == current;

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 24,
          height: 24,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: done ? scheme.actionAccent : Colors.transparent,
            border: Border.all(
              color: done || active ? scheme.actionAccent : scheme.borderDefault,
              width: 2,
            ),
          ),
          child: done
              ? Icon(Symbols.check_rounded, size: 14, color: scheme.textOnAccent)
              : null,
        ),
        const SizedBox(width: FlowSpace.s3),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                steps[i].label,
                style: TextStyle(
                  fontSize: FlowFontSize.bodyMd,
                  fontWeight: active ? FontWeight.w600 : FontWeight.w400,
                  color: done || active ? scheme.textPrimary : scheme.textMuted,
                ),
              ),
              if (steps[i].description != null)
                Text(
                  steps[i].description!,
                  style: TextStyle(
                    fontSize: FlowFontSize.bodySm,
                    color: scheme.textSecondary,
                  ),
                ),
            ],
          ),
        ),
      ],
    );
  }
}
