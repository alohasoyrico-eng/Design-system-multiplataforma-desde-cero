import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowCardMedia extends StatelessWidget {
  final Widget? media;
  final String title;
  final String? description;
  final bool interactive;
  final VoidCallback? onTap;

  const FlowCardMedia({
    super.key,
    this.media,
    required this.title,
    this.description,
    this.interactive = false,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;

    final content = Container(
      decoration: BoxDecoration(
        color: scheme.surfaceCard,
        border: Border.all(color: scheme.borderSubtle, width: 1),
        borderRadius: BorderRadius.circular(FlowRadius.lg),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          if (media != null)
            ClipRRect(
              borderRadius: const BorderRadius.vertical(
                top: Radius.circular(FlowRadius.lg),
              ),
              child: media!,
            ),
          Padding(
            padding: const EdgeInsets.all(FlowSpace.s3),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: FlowFontSize.bodyMd,
                    fontWeight: FontWeight.w600,
                    color: scheme.textPrimary,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                if (description != null)
                  Text(
                    description!,
                    style: TextStyle(
                      fontSize: FlowFontSize.bodySm,
                      color: scheme.textMuted,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
              ],
            ),
          ),
        ],
      ),
    );

    if (interactive || onTap != null) {
      return Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(FlowRadius.lg),
          child: content,
        ),
      );
    }

    return content;
  }
}
