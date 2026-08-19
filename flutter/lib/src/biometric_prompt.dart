import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

enum BiometricMethod { face, fingerprint }
enum BiometricState { idle, scanning, success, error }

class FlowBiometricPrompt extends StatelessWidget {
  final BiometricMethod method;
  final BiometricState state;
  final String? title;
  final String? description;
  final VoidCallback? onUse;
  final VoidCallback? onFallback;
  final String fallbackLabel;

  const FlowBiometricPrompt({
    super.key,
    this.method = BiometricMethod.face,
    this.state = BiometricState.idle,
    this.title,
    this.description,
    this.onUse,
    this.onFallback,
    this.fallbackLabel = 'Usar passcode',
  });

  IconData get _icon => method == BiometricMethod.face
      ? Icons.face
      : Icons.fingerprint;

  String get _defaultTitle => method == BiometricMethod.face
      ? 'Face ID'
      : 'Touch ID';

  Color _iconColor(FlowScheme scheme) => switch (state) {
    BiometricState.idle => scheme.textMuted,
    BiometricState.scanning => scheme.actionAccent,
    BiometricState.success => FlowColors.green500,
    BiometricState.error => FlowColors.danger500,
  };

  String get _statusText => switch (state) {
    BiometricState.idle => 'Toca para verificar',
    BiometricState.scanning => 'Verificando…',
    BiometricState.success => 'Verificado',
    BiometricState.error => 'No reconocido',
  };

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    final reducedMotion = MediaQuery.of(context).disableAnimations;

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          title ?? _defaultTitle,
          style: TextStyle(
            fontSize: FlowFontSize.title,
            fontWeight: FontWeight.w600,
            color: scheme.textPrimary,
          ),
        ),
        if (description != null) ...[
          const SizedBox(height: FlowSpace.s1),
          Text(
            description!,
            style: TextStyle(
              fontSize: FlowFontSize.body,
              color: scheme.textSecondary,
            ),
            textAlign: TextAlign.center,
          ),
        ],
        const SizedBox(height: FlowSpace.s8),
        GestureDetector(
          onTap: state == BiometricState.idle ? onUse : null,
          child: _BiometricIcon(
            icon: _icon,
            color: _iconColor(scheme),
            scanning: state == BiometricState.scanning && !reducedMotion,
            success: state == BiometricState.success,
          ),
        ),
        const SizedBox(height: FlowSpace.s4),
        Semantics(
          liveRegion: true,
          child: state == BiometricState.error
              ? _ErrorStatus(text: _statusText, scheme: scheme)
              : Text(
                  _statusText,
                  style: TextStyle(
                    fontSize: FlowFontSize.body,
                    color: scheme.textMuted,
                  ),
                ),
        ),
        const SizedBox(height: FlowSpace.s8),
        TextButton(
          onPressed: onFallback,
          child: Text(
            fallbackLabel,
            style: TextStyle(
              fontSize: FlowFontSize.body,
              color: scheme.textAccent,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
      ],
    );
  }
}

class _ErrorStatus extends StatelessWidget {
  final String text;
  final FlowScheme scheme;

  const _ErrorStatus({required this.text, required this.scheme});

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: text,
      child: Text(
        text,
        style: TextStyle(
          fontSize: FlowFontSize.body,
          color: FlowColors.danger500,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }
}

class _BiometricIcon extends StatefulWidget {
  final IconData icon;
  final Color color;
  final bool scanning;
  final bool success;

  const _BiometricIcon({
    required this.icon,
    required this.color,
    required this.scanning,
    required this.success,
  });

  @override
  State<_BiometricIcon> createState() => _BiometricIconState();
}

class _BiometricIconState extends State<_BiometricIcon>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    );
    if (widget.scanning) _controller.repeat(reverse: true);
  }

  @override
  void didUpdateWidget(_BiometricIcon oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.scanning && !oldWidget.scanning) {
      _controller.repeat(reverse: true);
    } else if (!widget.scanning && oldWidget.scanning) {
      _controller.stop();
      _controller.value = 0;
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        final scale = widget.scanning ? 1.0 + _controller.value * 0.08 : 1.0;
        final opacity = widget.scanning ? 0.6 + _controller.value * 0.4 : 1.0;
        return Transform.scale(
          scale: scale,
          child: Opacity(
            opacity: opacity,
            child: child,
          ),
        );
      },
      child: Container(
        width: 80,
        height: 80,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: widget.color.withValues(alpha: 0.12),
        ),
        child: Icon(
          widget.success ? Icons.check_circle : widget.icon,
          size: 40,
          color: widget.color,
        ),
      ),
    );
  }
}
