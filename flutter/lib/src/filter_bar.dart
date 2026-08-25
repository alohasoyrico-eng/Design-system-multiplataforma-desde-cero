import 'package:flutter/material.dart';
import 'flow_tokens.dart';

class FlowFilterBar extends StatelessWidget {
  final List<Widget> children;

  const FlowFilterBar({
    super.key,
    required this.children,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        for (var i = 0; i < children.length; i++) ...[
          if (i > 0) const SizedBox(width: FlowSpace.s2),
          children[i],
        ],
      ],
    );
  }
}
