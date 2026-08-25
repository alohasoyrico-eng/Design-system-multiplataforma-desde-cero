import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowCardCarousel extends StatefulWidget {
  final List<Widget> children;
  final int activeIndex;
  final ValueChanged<int>? onChange;

  const FlowCardCarousel({
    super.key,
    required this.children,
    this.activeIndex = 0,
    this.onChange,
  });

  @override
  State<FlowCardCarousel> createState() => _FlowCardCarouselState();
}

class _FlowCardCarouselState extends State<FlowCardCarousel> {
  late final PageController _controller;

  @override
  void initState() {
    super.initState();
    _controller = PageController(
      initialPage: widget.activeIndex,
      viewportFraction: 0.88,
    );
  }

  @override
  void didUpdateWidget(FlowCardCarousel oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.activeIndex != widget.activeIndex) {
      _controller.animateToPage(
        widget.activeIndex,
        duration: FlowDuration.base,
        curve: Curves.easeOut,
      );
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    final count = widget.children.length;

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        SizedBox(
          height: 200,
          child: PageView.builder(
            controller: _controller,
            itemCount: count,
            onPageChanged: widget.onChange,
            itemBuilder: (context, i) {
              return Padding(
                padding: const EdgeInsets.symmetric(horizontal: FlowSpace.s1),
                child: widget.children[i],
              );
            },
          ),
        ),
        if (count > 1) ...[
          const SizedBox(height: FlowSpace.s3),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(count, (i) {
              final active = i == widget.activeIndex;
              return AnimatedContainer(
                duration: FlowDuration.fast,
                width: active ? 20 : 6,
                height: 6,
                margin: const EdgeInsets.symmetric(horizontal: 2),
                decoration: BoxDecoration(
                  color: active ? scheme.actionAccent : scheme.borderDefault,
                  borderRadius: BorderRadius.circular(FlowRadius.pill),
                ),
              );
            }),
          ),
        ],
      ],
    );
  }
}
