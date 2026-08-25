
import 'package:flutter/material.dart';
import 'package:material_symbols_icons/symbols.dart';
import 'package:flutter/services.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';
class FlowPasscodeKeypad extends StatefulWidget {
  final int length;
  final String value;
  final ValueChanged<String>? onChange;
  final ValueChanged<String>? onComplete;
  final bool invalid;
  final IconData? biometricIcon;
  final VoidCallback? onBiometric;
  const FlowPasscodeKeypad({
    super.key,
    this.length = 6,
    this.value = '',
    this.onChange,
    this.onComplete,
    this.invalid = false,
    this.biometricIcon,
    this.onBiometric,
  });
  @override
  State<FlowPasscodeKeypad> createState() => _FlowPasscodeKeypadState();
}
class _FlowPasscodeKeypadState extends State<FlowPasscodeKeypad>
    with SingleTickerProviderStateMixin {
  late AnimationController _shakeController;
  late Animation<double> _shakeAnimation;
  @override
  void initState() {
    super.initState();
    _shakeController = AnimationController(
      vsync: this,
      duration: FlowDuration.slow,
    );
    _shakeAnimation = Tween<double>(begin: 0, end: 12).animate(
      CurvedAnimation(parent: _shakeController, curve: Curves.elasticIn),
    );
  }
  @override
  void didUpdateWidget(FlowPasscodeKeypad oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.invalid && !oldWidget.invalid) {
      _shakeController.forward(from: 0).then((_) {
        widget.onChange?.call('');
      });
    }
  }
  @override
  void dispose() {
    _shakeController.dispose();
    super.dispose();
  }
  void _onDigit(String digit) {
    if (widget.value.length >= widget.length) return;
    final next = widget.value + digit;
    widget.onChange?.call(next);
    if (next.length == widget.length) {
      widget.onComplete?.call(next);
    }
  }
  void _onDelete() {
    if (widget.value.isEmpty) return;
    widget.onChange?.call(widget.value.substring(0, widget.value.length - 1));
  }
  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        AnimatedBuilder(
          animation: _shakeAnimation,
          builder: (context, child) {
            final offset = _shakeController.isAnimating
                ? _shakeAnimation.value *
                    ((_shakeController.value * 10).toInt().isEven ? 1 : -1)
                : 0.0;
            return Transform.translate(
              offset: Offset(offset, 0),
              child: child,
            );
          },
          child: _ProgressDots(
            filled: widget.value.length,
            total: widget.length,
            invalid: widget.invalid,
            scheme: scheme,
          ),
        ),
        const SizedBox(height: FlowSpace.s8),
        Semantics(
          label: '${widget.value.length} de ${widget.length} dígitos ingresados',
          excludeSemantics: true,
          child: const SizedBox.shrink(),
        ),
        _Keypad(
          onDigit: _onDigit,
          onDelete: _onDelete,
          biometricIcon: widget.biometricIcon,
          onBiometric: widget.onBiometric,
          scheme: scheme,
        ),
      ],
    );
  }
}
class _ProgressDots extends StatelessWidget {
  final int filled;
  final int total;
  final bool invalid;
  final FlowScheme scheme;
  const _ProgressDots({
    required this.filled,
    required this.total,
    required this.invalid,
    required this.scheme,
  });
  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(total, (i) {
        final isFilled = i < filled;
        final color = invalid
            ? FlowColors.danger500
            : isFilled
                ? scheme.actionAccent
                : scheme.borderDefault;
        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: FlowSpace.s2),
          child: AnimatedContainer(
            duration: FlowDuration.fast,
            width: 12,
            height: 12,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: isFilled ? color : Colors.transparent,
              border: Border.all(color: color, width: 2),
            ),
          ),
        );
      }),
    );
  }
}
class _Keypad extends StatelessWidget {
  final ValueChanged<String> onDigit;
  final VoidCallback onDelete;
  final IconData? biometricIcon;
  final VoidCallback? onBiometric;
  final FlowScheme scheme;
  const _Keypad({
    required this.onDigit,
    required this.onDelete,
    this.biometricIcon,
    this.onBiometric,
    required this.scheme,
  });
  @override
  Widget build(BuildContext context) {
    final rows = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['bio', '0', 'del'],
    ];
    return Column(
      children: rows.map((row) {
        return Padding(
          padding: const EdgeInsets.only(bottom: FlowSpace.s3),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: row.map((key) {
              if (key == 'bio') {
                if (biometricIcon != null) {
                  return _KeypadButton(
                    onTap: onBiometric,
                    scheme: scheme,
                    child: Icon(biometricIcon, color: scheme.textPrimary, size: 24),
                    label: 'Usar biométrico',
                  );
                }
                return const SizedBox(width: 80, height: FlowSize.bar);
              }
              if (key == 'del') {
                return _KeypadButton(
                  onTap: onDelete,
                  scheme: scheme,
                  child: Icon(Symbols.backspace_rounded, color: scheme.textPrimary, size: 22),
                  label: 'Borrar',
                );
              }
              return _KeypadButton(
                onTap: () {
                  HapticFeedback.lightImpact();
                  onDigit(key);
                },
                scheme: scheme,
                child: Text(
                  key,
                  style: TextStyle(
                    fontSize: FlowFontSize.headlineLg,
                    fontWeight: FontWeight.w500,
                    color: scheme.textPrimary,
                  ),
                ),
                label: key,
              );
            }).toList(),
          ),
        );
      }).toList(),
    );
  }
}
class _KeypadButton extends StatelessWidget {
  final VoidCallback? onTap;
  final FlowScheme scheme;
  final Widget child;
  final String label;
  const _KeypadButton({
    this.onTap,
    required this.scheme,
    required this.child,
    required this.label,
  });
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: FlowSpace.s2),
      child: Semantics(
        button: true,
        label: label,
        child: Material(
          color: scheme.surfaceSunken,
          borderRadius: BorderRadius.circular(FlowRadius.pill),
          child: InkWell(
            onTap: onTap,
            borderRadius: BorderRadius.circular(FlowRadius.pill),
            child: SizedBox(
              width: 72,
              height: 52,
              child: Center(child: child),
            ),
          ),
        ),
      ),
    );
  }
}
