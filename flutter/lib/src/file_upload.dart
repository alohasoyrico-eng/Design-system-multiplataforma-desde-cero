import 'package:flutter/material.dart';
import 'package:material_symbols_icons/symbols.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowFileUpload extends StatelessWidget {
  final VoidCallback? onTap;
  final String label;
  final String? hint;
  final List<String>? accept;
  final bool multiple;
  final bool disabled;
  final Widget? preview;

  const FlowFileUpload({
    super.key,
    this.onTap,
    this.label = 'Upload file',
    this.hint,
    this.accept,
    this.multiple = false,
    this.disabled = false,
    this.preview,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;

    return GestureDetector(
      onTap: disabled ? null : onTap,
      child: Container(
        padding: const EdgeInsets.all(FlowSpace.s6),
        decoration: BoxDecoration(
          color: scheme.surfaceSunken,
          borderRadius: BorderRadius.circular(FlowRadius.lg),
          border: Border.all(
            color: scheme.borderDefault,
            width: 1,
          ),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (preview != null) ...[
              preview!,
              const SizedBox(height: FlowSpace.s4),
            ] else ...[
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: scheme.surfaceCard,
                  borderRadius: BorderRadius.circular(FlowRadius.md),
                ),
                child: Icon(
                  Symbols.upload_file_rounded,
                  size: 24,
                  color: scheme.textAccent,
                ),
              ),
              const SizedBox(height: FlowSpace.s3),
            ],
            Text(
              label,
              style: TextStyle(
                fontSize: FlowFontSize.bodyMd,
                fontWeight: FontWeight.w600,
                color: disabled ? scheme.textMuted : scheme.textPrimary,
              ),
            ),
            if (hint != null)
              Padding(
                padding: const EdgeInsets.only(top: FlowSpace.s1),
                child: Text(
                  hint!,
                  style: TextStyle(
                    fontSize: FlowFontSize.bodySm,
                    color: scheme.textMuted,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
            if (accept != null)
              Padding(
                padding: const EdgeInsets.only(top: FlowSpace.s2),
                child: Text(
                  accept!.join(', '),
                  style: TextStyle(
                    fontSize: FlowFontSize.labelSm,
                    color: scheme.textMuted,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
