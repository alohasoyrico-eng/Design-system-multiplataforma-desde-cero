import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowPeekSheet extends StatefulWidget {
  final String title;
  final List<Widget> children;
  final double collapsedHeight;
  final double expandedHeight;

  const FlowPeekSheet({
    super.key,
    required this.title,
    required this.children,
    this.collapsedHeight = 180,
    this.expandedHeight = 400,
  });

  @override
  State<FlowPeekSheet> createState() => _FlowPeekSheetState();
}

class _FlowPeekSheetState extends State<FlowPeekSheet> {
  bool _expanded = false;

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    final height = _expanded ? widget.expandedHeight : widget.collapsedHeight;

    return GestureDetector(
      onVerticalDragEnd: (details) {
        if (details.primaryVelocity != null) {
          setState(() => _expanded = details.primaryVelocity! < 0);
        }
      },
      child: AnimatedContainer(
        duration: FlowDuration.base,
        curve: Curves.easeOut,
        height: height,
        decoration: BoxDecoration(
          color: scheme.surfaceCard,
          borderRadius: const BorderRadius.vertical(
            top: Radius.circular(FlowRadius.xl),
          ),
          boxShadow: FlowShadow.float,
        ),
        padding: const EdgeInsets.fromLTRB(
          FlowSpace.s4,
          FlowSpace.s3,
          FlowSpace.s4,
          FlowSpace.s4,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 36,
              height: 4,
              decoration: BoxDecoration(
                color: scheme.borderDefault,
                borderRadius: BorderRadius.circular(FlowRadius.pill),
              ),
            ),
            const SizedBox(height: FlowSpace.s3),
            Align(
              alignment: Alignment.centerLeft,
              child: Text(
                widget.title,
                style: TextStyle(
                  fontSize: FlowFontSize.titleMd,
                  fontWeight: FontWeight.w600,
                  color: scheme.textPrimary,
                ),
              ),
            ),
            const SizedBox(height: FlowSpace.s3),
            Expanded(
              child: ClipRect(
                child: SingleChildScrollView(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: widget.children,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
