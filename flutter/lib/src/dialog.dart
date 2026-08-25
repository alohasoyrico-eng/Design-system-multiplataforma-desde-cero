import 'package:flutter/material.dart';
import 'package:material_symbols_icons/symbols.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

enum FlowDialogTone { normal, danger }

class FlowDialog extends StatelessWidget {
  final String? title;
  final String? description;
  final Widget? actions;
  final FlowDialogTone tone;
  final Widget? child;

  const FlowDialog({
    super.key,
    this.title,
    this.description,
    this.actions,
    this.tone = FlowDialogTone.normal,
    this.child,
  });

  static Future<T?> show<T>({
    required BuildContext context,
    required WidgetBuilder builder,
  }) {
    return showDialog<T>(
      context: context,
      builder: (ctx) => Center(
        child: Material(
          color: Colors.transparent,
          child: builder(ctx),
        ),
      ),
      barrierColor: Colors.black54,
    );
  }

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;

    return Container(
      width: 420,
      constraints: const BoxConstraints(maxWidth: 420),
      decoration: BoxDecoration(
        color: scheme.surfaceCard,
        borderRadius: BorderRadius.circular(FlowRadius.xl),
        boxShadow: FlowShadow.overlay,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(
              FlowSpace.s6, FlowSpace.s6, FlowSpace.s6, 0,
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      if (title != null)
                        Text(
                          title!,
                          style: TextStyle(
                            fontSize: FlowFontSize.titleLg,
                            fontWeight: FontWeight.w600,
                            color: scheme.textPrimary,
                          ),
                        ),
                      if (description != null)
                        Padding(
                          padding: const EdgeInsets.only(top: FlowSpace.s2),
                          child: Text(
                            description!,
                            style: TextStyle(
                              fontSize: FlowFontSize.bodyMd,
                              color: scheme.textSecondary,
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
                GestureDetector(
                  onTap: () => Navigator.of(context).pop(),
                  child: Icon(
                    Symbols.close_rounded,
                    size: 20,
                    color: scheme.textMuted,
                  ),
                ),
              ],
            ),
          ),
          if (child != null)
            Padding(
              padding: const EdgeInsets.fromLTRB(
                FlowSpace.s6, FlowSpace.s4, FlowSpace.s6, 0,
              ),
              child: child!,
            ),
          if (actions != null)
            Padding(
              padding: const EdgeInsets.all(FlowSpace.s6),
              child: actions!,
            ),
        ],
      ),
    );
  }
}
