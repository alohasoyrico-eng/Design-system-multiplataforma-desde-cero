import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowInputAmount extends StatefulWidget {
  final String? id;
  final String value;
  final ValueChanged<String>? onChange;
  final String placeholder;
  final String currency;
  final bool disabled;
  final bool invalid;

  const FlowInputAmount({
    super.key,
    this.id,
    this.value = '',
    this.onChange,
    this.placeholder = '0.00',
    this.currency = '\$',
    this.disabled = false,
    this.invalid = false,
  });

  @override
  State<FlowInputAmount> createState() => _FlowInputAmountState();
}

class _FlowInputAmountState extends State<FlowInputAmount> {
  late TextEditingController _controller;
  bool _focused = false;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: _format(widget.value));
  }

  @override
  void didUpdateWidget(FlowInputAmount oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.value != oldWidget.value) {
      final formatted = _format(widget.value);
      if (_controller.text != formatted) {
        _controller.text = formatted;
      }
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  String _format(String raw) {
    if (raw.isEmpty) return '';
    final parts = raw.split('.');
    final intPart = parts[0].replaceAll(RegExp(r'[^0-9]'), '');
    if (intPart.isEmpty) return raw;

    final buffer = StringBuffer();
    for (var i = 0; i < intPart.length; i++) {
      if (i > 0 && (intPart.length - i) % 3 == 0) buffer.write(',');
      buffer.write(intPart[i]);
    }

    if (parts.length > 1) {
      buffer.write('.');
      buffer.write(parts[1]);
    }
    return buffer.toString();
  }

  String _stripFormat(String text) {
    return text.replaceAll(',', '');
  }

  void _onChanged(String text) {
    final raw = _stripFormat(text);
    widget.onChange?.call(raw);
  }

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;

    final borderColor = widget.invalid
        ? FlowColors.danger500
        : _focused
            ? scheme.borderFocus
            : scheme.borderDefault;

    return Opacity(
      opacity: widget.disabled ? 0.5 : 1.0,
      child: Container(
        decoration: BoxDecoration(
          color: scheme.surfaceSunken,
          borderRadius: BorderRadius.circular(FlowRadius.md),
          border: Border.all(color: borderColor, width: _focused ? 2 : 1),
        ),
        padding: const EdgeInsets.symmetric(horizontal: FlowSpace.s4),
        child: Row(
          children: [
            Text(
              widget.currency,
              style: TextStyle(
                fontSize: FlowFontSize.title,
                color: scheme.textMuted,
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(width: FlowSpace.s2),
            Expanded(
              child: Focus(
                onFocusChange: (f) => setState(() => _focused = f),
                child: TextField(
                  controller: _controller,
                  enabled: !widget.disabled,
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  inputFormatters: [
                    FilteringTextInputFormatter.allow(RegExp(r'[0-9.,]')),
                  ],
                  textAlign: TextAlign.right,
                  style: TextStyle(
                    fontSize: FlowFontSize.title,
                    fontWeight: FontWeight.w500,
                    color: scheme.textPrimary,
                  ),
                  decoration: InputDecoration(
                    hintText: widget.placeholder,
                    hintStyle: TextStyle(color: scheme.textMuted),
                    border: InputBorder.none,
                    contentPadding: const EdgeInsets.symmetric(
                      vertical: FlowSpace.s3,
                    ),
                  ),
                  onChanged: _onChanged,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
