import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowSettings extends StatelessWidget {
  final List<Widget> children;

  const FlowSettings({super.key, required this.children});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: children,
    );
  }
}

class FlowSettingsSection extends StatelessWidget {
  final String title;
  final List<Widget> children;

  const FlowSettingsSection({
    super.key,
    required this.title,
    required this.children,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;

    return Padding(
      padding: const EdgeInsets.only(bottom: FlowSpace.s6),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            title,
            style: TextStyle(
              fontSize: FlowFontSize.titleLg,
              fontWeight: FontWeight.w600,
              color: scheme.textPrimary,
            ),
          ),
          const SizedBox(height: FlowSpace.s4),
          Container(
            decoration: BoxDecoration(
              color: scheme.surfaceCard,
              borderRadius: BorderRadius.circular(FlowRadius.lg),
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

class FlowSettingsRow extends StatelessWidget {
  final String label;
  final String? description;
  final Widget control;

  const FlowSettingsRow({
    super.key,
    required this.label,
    this.description,
    required this.control,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;

    return Padding(
      padding: const EdgeInsets.all(FlowSpace.s4),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  label,
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
                        color: scheme.textSecondary,
                      ),
                    ),
                  ),
              ],
            ),
          ),
          const SizedBox(width: FlowSpace.s4),
          control,
        ],
      ),
    );
  }
}

class FlowSettingsDangerZone extends StatelessWidget {
  final String title;
  final List<Widget> children;

  const FlowSettingsDangerZone({
    super.key,
    this.title = 'Danger zone',
    required this.children,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;

    return Padding(
      padding: const EdgeInsets.only(bottom: FlowSpace.s6),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            title,
            style: const TextStyle(
              fontSize: FlowFontSize.titleLg,
              fontWeight: FontWeight.w600,
              color: FlowColors.danger500,
            ),
          ),
          const SizedBox(height: FlowSpace.s4),
          Container(
            decoration: BoxDecoration(
              color: scheme.surfaceCard,
              borderRadius: BorderRadius.circular(FlowRadius.lg),
              border: Border.all(color: FlowColors.danger500.withValues(alpha: 0.3)),
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

class FlowSettingsDangerRow extends StatelessWidget {
  final String description;
  final Widget action;

  const FlowSettingsDangerRow({
    super.key,
    required this.description,
    required this.action,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;

    return Padding(
      padding: const EdgeInsets.all(FlowSpace.s4),
      child: Row(
        children: [
          Expanded(
            child: Text(
              description,
              style: TextStyle(
                fontSize: FlowFontSize.bodyMd,
                color: scheme.textSecondary,
              ),
            ),
          ),
          const SizedBox(width: FlowSpace.s4),
          action,
        ],
      ),
    );
  }
}
