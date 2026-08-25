import 'package:flutter/material.dart';
import 'package:material_symbols_icons/symbols.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowChatComposer extends StatefulWidget {
  final ValueChanged<String>? onSend;
  final String placeholder;
  final bool disabled;
  final Widget? leading;

  const FlowChatComposer({
    super.key,
    this.onSend,
    this.placeholder = 'Type a message…',
    this.disabled = false,
    this.leading,
  });

  @override
  State<FlowChatComposer> createState() => _FlowChatComposerState();
}

class _FlowChatComposerState extends State<FlowChatComposer> {
  final _controller = TextEditingController();
  bool _hasText = false;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _send() {
    final text = _controller.text.trim();
    if (text.isEmpty) return;
    widget.onSend?.call(text);
    _controller.clear();
    setState(() => _hasText = false);
  }

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;

    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: FlowSpace.s3,
        vertical: FlowSpace.s2,
      ),
      decoration: BoxDecoration(
        color: scheme.surfaceCard,
        border: Border(top: BorderSide(color: scheme.borderSubtle)),
      ),
      child: Row(
        children: [
          if (widget.leading != null)
            Padding(
              padding: const EdgeInsets.only(right: FlowSpace.s2),
              child: widget.leading!,
            ),
          Expanded(
            child: TextField(
              controller: _controller,
              enabled: !widget.disabled,
              onChanged: (v) => setState(() => _hasText = v.trim().isNotEmpty),
              onSubmitted: (_) => _send(),
              style: TextStyle(
                fontSize: FlowFontSize.bodyMd,
                color: scheme.textPrimary,
              ),
              decoration: InputDecoration(
                hintText: widget.placeholder,
                hintStyle: TextStyle(color: scheme.textMuted),
                border: InputBorder.none,
                isDense: true,
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: FlowSpace.s3,
                  vertical: FlowSpace.s2,
                ),
              ),
            ),
          ),
          const SizedBox(width: FlowSpace.s2),
          GestureDetector(
            onTap: _hasText && !widget.disabled ? _send : null,
            child: Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: _hasText ? scheme.actionAccent : Colors.transparent,
                borderRadius: BorderRadius.circular(FlowRadius.pill),
              ),
              child: Icon(
                Symbols.send_rounded,
                size: 18,
                color: _hasText ? scheme.textOnAccent : scheme.textMuted,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
