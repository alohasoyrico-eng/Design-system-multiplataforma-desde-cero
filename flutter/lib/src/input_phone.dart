import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowInputPhone extends StatefulWidget {
  final String? id;
  final String value;
  final ValueChanged<String>? onChange;
  final String placeholder;
  final String prefix;
  final bool disabled;
  final bool invalid;

  const FlowInputPhone({
    super.key,
    this.id,
    this.value = '',
    this.onChange,
    this.placeholder = '55 1234 5678',
    this.prefix = '+52',
    this.disabled = false,
    this.invalid = false,
  });

  @override
  State<FlowInputPhone> createState() => _FlowInputPhoneState();
}

class _FlowInputPhoneState extends State<FlowInputPhone> {
  late TextEditingController _controller;
  bool _focused = false;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: _format(widget.value));
  }

  @override
  void didUpdateWidget(FlowInputPhone oldWidget) {
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

  // 2-4-4 grouping: XX XXXX XXXX
  String _format(String digits) {
    final d = digits.replaceAll(RegExp(r'[^0-9]'), '');
    if (d.isEmpty) return '';
    final buffer = StringBuffer();
    for (var i = 0; i < d.length && i < 10; i++) {
      if (i == 2 || i == 6) buffer.write(' ');
      buffer.write(d[i]);
    }
    return buffer.toString();
  }

  String _stripToDigits(String text) {
    return text.replaceAll(RegExp(r'[^0-9]'), '');
  }

  void _onChanged(String text) {
    final digits = _stripToDigits(text);
    widget.onChange?.call(digits);
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
              widget.prefix,
              style: TextStyle(
                fontSize: FlowFontSize.bodyMd,
                fontWeight: FontWeight.w600,
                color: scheme.textMuted,
              ),
            ),
            Container(
              width: 1,
              height: 24,
              margin: const EdgeInsets.symmetric(horizontal: FlowSpace.s3),
              color: scheme.borderSubtle,
            ),
            Expanded(
              child: Focus(
                onFocusChange: (f) => setState(() => _focused = f),
                child: TextField(
                  controller: _controller,
                  enabled: !widget.disabled,
                  keyboardType: TextInputType.phone,
                  inputFormatters: [
                    FilteringTextInputFormatter.allow(RegExp(r'[0-9 ]')),
                    LengthLimitingTextInputFormatter(14),
                  ],
                  style: TextStyle(
                    fontSize: FlowFontSize.bodyMd,
                    fontWeight: FontWeight.w500,
                    color: scheme.textPrimary,
                    letterSpacing: 0.5,
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
