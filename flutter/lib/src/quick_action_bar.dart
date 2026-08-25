import 'package:flutter/material.dart';

class FlowQuickActionBar extends StatelessWidget {
  final List<Widget> children;

  const FlowQuickActionBar({
    super.key,
    required this.children,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: children,
    );
  }
}
