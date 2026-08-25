import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

enum FlowChatMessageSender { user, agent }

class FlowChatMessage extends StatelessWidget {
  final String text;
  final FlowChatMessageSender sender;
  final String? timestamp;
  final String? avatar;
  final bool loading;

  const FlowChatMessage({
    super.key,
    required this.text,
    this.sender = FlowChatMessageSender.user,
    this.timestamp,
    this.avatar,
    this.loading = false,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    final isUser = sender == FlowChatMessageSender.user;

    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: FlowSpace.s4,
        vertical: FlowSpace.s2,
      ),
      child: Row(
        mainAxisAlignment:
            isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          if (!isUser && avatar != null)
            Padding(
              padding: const EdgeInsets.only(right: FlowSpace.s2),
              child: CircleAvatar(
                radius: 14,
                backgroundColor: scheme.surfaceSunken,
                child: Text(
                  avatar!,
                  style: TextStyle(
                    fontSize: FlowFontSize.bodySm,
                    color: scheme.textSecondary,
                  ),
                ),
              ),
            ),
          Flexible(
            child: Container(
              padding: const EdgeInsets.symmetric(
                horizontal: FlowSpace.s4,
                vertical: FlowSpace.s3,
              ),
              decoration: BoxDecoration(
                color: isUser ? scheme.actionAccent : scheme.surfaceSunken,
                borderRadius: BorderRadius.only(
                  topLeft: const Radius.circular(FlowRadius.md),
                  topRight: const Radius.circular(FlowRadius.md),
                  bottomLeft: Radius.circular(isUser ? FlowRadius.md : 4),
                  bottomRight: Radius.circular(isUser ? 4 : FlowRadius.md),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (loading)
                    _TypingIndicator(color: isUser ? scheme.textOnAccent : scheme.textMuted)
                  else
                    Text(
                      text,
                      style: TextStyle(
                        fontSize: FlowFontSize.bodyMd,
                        color: isUser ? scheme.textOnAccent : scheme.textPrimary,
                      ),
                    ),
                  if (timestamp != null)
                    Padding(
                      padding: const EdgeInsets.only(top: FlowSpace.s1),
                      child: Text(
                        timestamp!,
                        style: TextStyle(
                          fontSize: FlowFontSize.labelSm,
                          color: isUser
                              ? scheme.textOnAccent.withValues(alpha: 0.7)
                              : scheme.textMuted,
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _TypingIndicator extends StatefulWidget {
  final Color color;
  const _TypingIndicator({required this.color});

  @override
  State<_TypingIndicator> createState() => _TypingIndicatorState();
}

class _TypingIndicatorState extends State<_TypingIndicator>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat();
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
      builder: (_, __) => Row(
        mainAxisSize: MainAxisSize.min,
        children: List.generate(3, (i) {
          final delay = i * 0.2;
          final t = (_controller.value - delay).clamp(0.0, 1.0);
          final scale = 0.5 + 0.5 * (1 - (2 * t - 1).abs());
          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 2),
            child: Transform.scale(
              scale: scale,
              child: Container(
                width: 6,
                height: 6,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: widget.color,
                ),
              ),
            ),
          );
        }),
      ),
    );
  }
}
