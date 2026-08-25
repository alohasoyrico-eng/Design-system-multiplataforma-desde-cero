import 'package:flutter/material.dart';
import 'package:material_symbols_icons/symbols.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

enum FlowDrawerSide { left, right }

class FlowDrawer extends StatelessWidget {
  final bool open;
  final VoidCallback? onClose;
  final String? title;
  final Widget? child;
  final FlowDrawerSide side;
  final double width;

  const FlowDrawer({
    super.key,
    this.open = false,
    this.onClose,
    this.title,
    this.child,
    this.side = FlowDrawerSide.right,
    this.width = 380,
  });

  static Future<T?> show<T>({
    required BuildContext context,
    required WidgetBuilder builder,
    FlowDrawerSide side = FlowDrawerSide.right,
  }) {
    return showGeneralDialog<T>(
      context: context,
      barrierDismissible: true,
      barrierLabel: 'Close drawer',
      barrierColor: Colors.black54,
      transitionDuration: FlowDuration.slow,
      transitionBuilder: (ctx, anim, secAnim, child) {
        final offsetX = side == FlowDrawerSide.right ? 1.0 : -1.0;
        return SlideTransition(
          position: Tween<Offset>(
            begin: Offset(offsetX, 0),
            end: Offset.zero,
          ).animate(CurvedAnimation(
            parent: anim,
            curve: Curves.easeOut,
          )),
          child: child,
        );
      },
      pageBuilder: (ctx, anim, secAnim) => builder(ctx),
    );
  }

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;

    return Align(
      alignment: side == FlowDrawerSide.right
          ? Alignment.centerRight
          : Alignment.centerLeft,
      child: Material(
        color: Colors.transparent,
        child: Container(
          width: width,
          height: double.infinity,
          decoration: BoxDecoration(
            color: scheme.surfaceCard,
            boxShadow: FlowShadow.overlay,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.all(FlowSpace.s4),
                child: Row(
                  children: [
                    if (title != null)
                      Expanded(
                        child: Text(
                          title!,
                          style: TextStyle(
                            fontSize: FlowFontSize.titleLg,
                            fontWeight: FontWeight.w600,
                            color: scheme.textPrimary,
                          ),
                        ),
                      )
                    else
                      const Spacer(),
                    GestureDetector(
                      onTap: onClose ?? () => Navigator.of(context).pop(),
                      child: Icon(
                        Symbols.close_rounded,
                        size: 20,
                        color: scheme.textMuted,
                      ),
                    ),
                  ],
                ),
              ),
              Container(height: 1, color: scheme.borderSubtle),
              if (child != null)
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.all(FlowSpace.s4),
                    child: child!,
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
