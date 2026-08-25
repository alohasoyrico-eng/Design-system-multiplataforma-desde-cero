import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowQuickAction extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool active;
  final bool disabled;
  final VoidCallback? onTap;

  const FlowQuickAction({
    super.key,
    required this.icon,
    required this.label,
    this.active = false,
    this.disabled = false,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    final circleBg = active ? scheme.surfaceAccentSubtle : scheme.surfaceSunken;
    final iconColor = active ? scheme.textAccent : scheme.textPrimary;
    final labelColor = active ? scheme.textAccent : scheme.textSecondary;

    return Expanded(
      child: Opacity(
        opacity: disabled ? 0.5 : 1.0,
        child: GestureDetector(
          onTap: disabled ? null : onTap,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: circleBg,
                ),
                child: Icon(icon, size: 22, color: iconColor),
              ),
              const SizedBox(height: FlowSpace.s1),
              Text(
                label,
                textAlign: TextAlign.center,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  fontSize: FlowFontSize.labelSm,
                  fontWeight: FontWeight.w600,
                  color: labelColor,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
