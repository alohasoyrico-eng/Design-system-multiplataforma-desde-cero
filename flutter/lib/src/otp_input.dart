import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowOTPInput extends StatefulWidget {
  final int length;
  final String value;
  final ValueChanged<String>? onChange;
  final ValueChanged<String>? onComplete;
  final bool invalid;
  final bool autoFocus;

  const FlowOTPInput({
    super.key,
    this.length = 6,
    this.value = '',
    this.onChange,
    this.onComplete,
    this.invalid = false,
    this.autoFocus = false,
  });

  @override
  State<FlowOTPInput> createState() => _FlowOTPInputState();
}

class _FlowOTPInputState extends State<FlowOTPInput> {
  late List<FocusNode> _focusNodes;
  late List<TextEditingController> _controllers;

  @override
  void initState() {
    super.initState();
    _focusNodes = List.generate(widget.length, (_) => FocusNode());
    _controllers = List.generate(widget.length, (i) {
      final c = TextEditingController(
        text: i < widget.value.length ? widget.value[i] : '',
      );
      return c;
    });
    if (widget.autoFocus) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _focusNodes[0].requestFocus();
      });
    }
  }

  @override
  void didUpdateWidget(FlowOTPInput old) {
    super.didUpdateWidget(old);
    if (widget.value != old.value) {
      for (var i = 0; i < widget.length; i++) {
        _controllers[i].text = i < widget.value.length ? widget.value[i] : '';
      }
    }
  }

  @override
  void dispose() {
    for (final n in _focusNodes) {
      n.dispose();
    }
    for (final c in _controllers) {
      c.dispose();
    }
    super.dispose();
  }

  String get _currentValue => _controllers.map((c) => c.text).join();

  void _onChanged(int index, String val) {
    if (val.length > 1) {
      _controllers[index].text = val[val.length - 1];
    }
    final full = _currentValue;
    widget.onChange?.call(full);
    if (val.isNotEmpty && index < widget.length - 1) {
      _focusNodes[index + 1].requestFocus();
    }
    if (full.length == widget.length) {
      widget.onComplete?.call(full);
    }
  }

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    final borderColor = widget.invalid ? FlowColors.danger500 : scheme.borderDefault;

    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(widget.length, (i) {
        final focused = _focusNodes[i].hasFocus;
        return Container(
          width: 44,
          height: 52,
          margin: EdgeInsets.only(right: i < widget.length - 1 ? FlowSpace.s2 : 0),
          decoration: BoxDecoration(
            color: scheme.surfaceSunken,
            border: Border.all(
              color: focused ? scheme.borderFocus : borderColor,
              width: focused ? 2 : 1,
            ),
            borderRadius: BorderRadius.circular(FlowRadius.sm),
          ),
          child: TextField(
            controller: _controllers[i],
            focusNode: _focusNodes[i],
            onChanged: (v) => _onChanged(i, v),
            keyboardType: TextInputType.number,
            textAlign: TextAlign.center,
            inputFormatters: [
              FilteringTextInputFormatter.digitsOnly,
              LengthLimitingTextInputFormatter(2),
            ],
            style: TextStyle(
              fontSize: FlowFontSize.titleLg,
              fontWeight: FontWeight.w700,
              fontFamily: FlowFontFamily.mono,
              color: scheme.textPrimary,
            ),
            decoration: const InputDecoration(
              border: InputBorder.none,
              contentPadding: EdgeInsets.zero,
            ),
          ),
        );
      }),
    );
  }
}
