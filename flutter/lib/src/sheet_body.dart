import 'package:flutter/material.dart';
import 'flow_tokens.dart';

class FlowSheetBody extends StatelessWidget {
  final List<Widget> children;
  final bool center;

  const FlowSheetBody({
    super.key,
    required this.children,
    this.center = false,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(
        horizontal: FlowSpace.s4,
        vertical: center ? FlowSpace.s6 : FlowSpace.s2,
      ),
      child: Column(
        crossAxisAlignment:
            center ? CrossAxisAlignment.center : CrossAxisAlignment.stretch,
        mainAxisSize: MainAxisSize.min,
        children: _spaced(children, center ? FlowSpace.s4 : FlowSpace.s3),
      ),
    );
  }

  static List<Widget> _spaced(List<Widget> items, double gap) {
    if (items.isEmpty) return items;
    final result = <Widget>[];
    for (var i = 0; i < items.length; i++) {
      if (i > 0) result.add(SizedBox(height: gap));
      result.add(items[i]);
    }
    return result;
  }
}
