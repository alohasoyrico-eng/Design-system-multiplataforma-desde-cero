import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowBottomSheet extends StatelessWidget {
  final String? title;
  final Widget child;
  final double? height;
  final VoidCallback? onClose;

  const FlowBottomSheet({
    super.key,
    this.title,
    required this.child,
    this.height,
    this.onClose,
  });

  static Future<T?> show<T>({
    required BuildContext context,
    required WidgetBuilder builder,
    String? title,
    double? height,
  }) {
    final scheme = FlowTheme.of(context);
    return showModalBottomSheet<T>(
      context: context,
      backgroundColor: Colors.transparent,
      barrierColor: Colors.black.withValues(alpha: 0.4),
      isScrollControlled: true,
      builder: (ctx) => FlowBottomSheet(
        title: title,
        height: height,
        onClose: () => Navigator.of(ctx).pop(),
        child: Builder(
          builder: (innerCtx) => FlowTheme(
            scheme: scheme,
            child: builder(innerCtx),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;

    return Container(
      height: height,
      constraints: BoxConstraints(
        maxHeight: MediaQuery.of(context).size.height * 0.9,
      ),
      decoration: BoxDecoration(
        color: scheme.surfaceCard,
        borderRadius: const BorderRadius.vertical(
          top: Radius.circular(FlowRadius.xl),
        ),
        boxShadow: const [
          BoxShadow(
            color: Color(0x33000000),
            blurRadius: 24,
            offset: Offset(0, -4),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          _Handle(scheme: scheme, onClose: onClose),
          if (title != null)
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: FlowSpace.s4,
                vertical: FlowSpace.s2,
              ),
              child: Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  title!,
                  style: TextStyle(
                    fontSize: FlowFontSize.title,
                    fontWeight: FontWeight.w600,
                    color: scheme.textPrimary,
                  ),
                ),
              ),
            ),
          Flexible(
            child: SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(
                FlowSpace.s4,
                0,
                FlowSpace.s4,
                FlowSpace.s4,
              ),
              child: child,
            ),
          ),
        ],
      ),
    );
  }
}

class _Handle extends StatelessWidget {
  final FlowScheme scheme;
  final VoidCallback? onClose;

  const _Handle({required this.scheme, this.onClose});

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      label: 'Cerrar',
      child: GestureDetector(
        onTap: onClose,
        behavior: HitTestBehavior.opaque,
        child: SizedBox(
          width: double.infinity,
          height: 44,
          child: Center(
            child: Container(
              width: 36,
              height: 4,
              decoration: BoxDecoration(
                color: scheme.borderDefault,
                borderRadius: BorderRadius.circular(FlowRadius.pill),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
