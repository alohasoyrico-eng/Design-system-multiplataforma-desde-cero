import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';
import 'stepper.dart';

class FlowWizard extends StatelessWidget {
  final List<FlowStepperStep> steps;
  final int current;
  final VoidCallback? onBack;
  final VoidCallback? onNext;
  final VoidCallback? onSubmit;
  final bool submitting;
  final String nextLabel;
  final String submitLabel;
  final Widget child;

  const FlowWizard({
    super.key,
    required this.steps,
    this.current = 0,
    this.onBack,
    this.onNext,
    this.onSubmit,
    this.submitting = false,
    this.nextLabel = 'Next',
    this.submitLabel = 'Confirm',
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    final isLast = current >= steps.length - 1;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Padding(
          padding: const EdgeInsets.all(FlowSpace.s4),
          child: FlowStepper(steps: steps, current: current),
        ),
        Container(height: 1, color: scheme.borderSubtle),
        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(FlowSpace.s6),
            child: child,
          ),
        ),
        Container(height: 1, color: scheme.borderSubtle),
        Padding(
          padding: const EdgeInsets.all(FlowSpace.s4),
          child: Row(
            children: [
              if (current > 0 && onBack != null)
                GestureDetector(
                  onTap: onBack,
                  child: Container(
                    height: 44,
                    padding: const EdgeInsets.symmetric(horizontal: FlowSpace.s5),
                    decoration: BoxDecoration(
                      border: Border.all(color: scheme.borderDefault),
                      borderRadius: BorderRadius.circular(FlowRadius.pill),
                    ),
                    child: Center(
                      child: Text(
                        'Back',
                        style: TextStyle(
                          fontSize: FlowFontSize.bodyMd,
                          fontWeight: FontWeight.w600,
                          color: scheme.textPrimary,
                        ),
                      ),
                    ),
                  ),
                ),
              const Spacer(),
              GestureDetector(
                onTap: submitting
                    ? null
                    : isLast
                        ? onSubmit
                        : onNext,
                child: Container(
                  height: 44,
                  padding: const EdgeInsets.symmetric(horizontal: FlowSpace.s6),
                  decoration: BoxDecoration(
                    color: scheme.actionAccent,
                    borderRadius: BorderRadius.circular(FlowRadius.pill),
                  ),
                  child: Center(
                    child: submitting
                        ? SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: scheme.textOnAccent,
                            ),
                          )
                        : Text(
                            isLast ? submitLabel : nextLabel,
                            style: TextStyle(
                              fontSize: FlowFontSize.bodyMd,
                              fontWeight: FontWeight.w600,
                              color: scheme.textOnAccent,
                            ),
                          ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class FlowWizardSummary extends StatelessWidget {
  final List<Widget> children;

  const FlowWizardSummary({super.key, required this.children});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: children,
    );
  }
}

class FlowWizardSummarySection extends StatelessWidget {
  final String title;
  final VoidCallback? onEdit;
  final List<Widget> children;

  const FlowWizardSummarySection({
    super.key,
    required this.title,
    this.onEdit,
    required this.children,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;

    return Padding(
      padding: const EdgeInsets.only(bottom: FlowSpace.s4),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            children: [
              Text(
                title,
                style: TextStyle(
                  fontSize: FlowFontSize.titleMd,
                  fontWeight: FontWeight.w600,
                  color: scheme.textPrimary,
                ),
              ),
              const Spacer(),
              if (onEdit != null)
                GestureDetector(
                  onTap: onEdit,
                  child: Text(
                    'Edit',
                    style: TextStyle(
                      fontSize: FlowFontSize.bodySm,
                      color: scheme.textAccent,
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: FlowSpace.s2),
          Container(
            decoration: BoxDecoration(
              color: scheme.surfaceCard,
              borderRadius: BorderRadius.circular(FlowRadius.md),
              border: Border.all(color: scheme.borderSubtle),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                for (int i = 0; i < children.length; i++) ...[
                  if (i > 0) Container(height: 1, color: scheme.borderSubtle),
                  children[i],
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class FlowWizardSummaryRow extends StatelessWidget {
  final String label;
  final String value;

  const FlowWizardSummaryRow({
    super.key,
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;

    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: FlowSpace.s4,
        vertical: FlowSpace.s3,
      ),
      child: Row(
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: FlowFontSize.bodyMd,
              color: scheme.textSecondary,
            ),
          ),
          const Spacer(),
          Text(
            value,
            style: TextStyle(
              fontSize: FlowFontSize.bodyMd,
              fontWeight: FontWeight.w500,
              color: scheme.textPrimary,
            ),
          ),
        ],
      ),
    );
  }
}
