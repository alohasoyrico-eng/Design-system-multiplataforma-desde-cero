import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';
import 'chat_message.dart';
import 'chat_composer.dart';

class FlowChatThread extends StatelessWidget {
  final List<FlowChatMessage> messages;
  final ValueChanged<String>? onSend;
  final String? title;
  final bool loading;
  final ScrollController? scrollController;

  const FlowChatThread({
    super.key,
    this.messages = const [],
    this.onSend,
    this.title,
    this.loading = false,
    this.scrollController,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;

    return Column(
      children: [
        if (title != null)
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(FlowSpace.s4),
            decoration: BoxDecoration(
              color: scheme.surfaceCard,
              border: Border(bottom: BorderSide(color: scheme.borderSubtle)),
            ),
            child: Text(
              title!,
              style: TextStyle(
                fontSize: FlowFontSize.titleLg,
                fontWeight: FontWeight.w600,
                color: scheme.textPrimary,
              ),
            ),
          ),
        Expanded(
          child: ListView.builder(
            controller: scrollController,
            padding: const EdgeInsets.symmetric(vertical: FlowSpace.s4),
            itemCount: messages.length + (loading ? 1 : 0),
            itemBuilder: (ctx, i) {
              if (i == messages.length) {
                return const FlowChatMessage(
                  text: '',
                  sender: FlowChatMessageSender.agent,
                  loading: true,
                );
              }
              return messages[i];
            },
          ),
        ),
        FlowChatComposer(onSend: onSend),
      ],
    );
  }
}
