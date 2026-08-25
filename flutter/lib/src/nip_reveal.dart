import 'dart:async';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';
import 'button.dart';

class FlowNipReveal extends StatefulWidget {
  final String digits;
  final bool blurLast;
  final Duration duration;
  final String? warning;

  const FlowNipReveal({
    super.key,
    required this.digits,
    this.blurLast = true,
    this.duration = const Duration(seconds: 5),
    this.warning,
  });

  @override
  State<FlowNipReveal> createState() => _FlowNipRevealState();
}

class _FlowNipRevealState extends State<FlowNipReveal> {
  bool _visible = false;
  Timer? _timer;

  void _show() {
    setState(() => _visible = true);
    _timer?.cancel();
    _timer = Timer(widget.duration, () {
      if (mounted) setState(() => _visible = false);
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;

    if (!_visible) {
      return Padding(
        padding: const EdgeInsets.symmetric(vertical: FlowSpace.s4),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (widget.warning != null) ...[
              Text(
                widget.warning!,
                style: TextStyle(
                  fontSize: FlowFontSize.bodyMd,
                  color: scheme.textSecondary,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: FlowSpace.s4),
            ],
            FlowButton(
              label: 'Mostrar NIP',
              variant: FlowButtonVariant.accent,
              onPressed: _show,
            ),
          ],
        ),
      );
    }

    final chars = widget.digits.split('');
    final digitStyle = TextStyle(
      fontFamily: FlowFontFamily.mono,
      fontSize: 40,
      fontWeight: FontWeight.w700,
      color: scheme.textPrimary,
      letterSpacing: 8,
    );

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: FlowSpace.s4),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              for (int i = 0; i < chars.length; i++) ...[
                if (i > 0) const SizedBox(width: FlowSpace.s2),
                if (widget.blurLast && i == chars.length - 1)
                  ImageFiltered(
                    imageFilter: ImageFilter.blur(sigmaX: 4, sigmaY: 4),
                    child: Text(chars[i], style: digitStyle),
                  )
                else
                  Text(chars[i], style: digitStyle),
              ],
            ],
          ),
          const SizedBox(height: FlowSpace.s4),
          Text(
            'Se ocultará automáticamente',
            style: TextStyle(
              fontSize: FlowFontSize.bodySm,
              color: scheme.textMuted,
            ),
          ),
        ],
      ),
    );
  }
}
