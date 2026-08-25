import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowOnboardingSlide {
  final IconData? icon;
  final Widget? media;
  final String title;
  final String? description;

  const FlowOnboardingSlide({
    this.icon,
    this.media,
    required this.title,
    this.description,
  });
}

class FlowOnboardingCarousel extends StatefulWidget {
  final List<FlowOnboardingSlide> slides;
  final ValueChanged<int>? onPageChanged;

  const FlowOnboardingCarousel({
    super.key,
    required this.slides,
    this.onPageChanged,
  });

  @override
  State<FlowOnboardingCarousel> createState() => _FlowOnboardingCarouselState();
}

class _FlowOnboardingCarouselState extends State<FlowOnboardingCarousel> {
  late final PageController _controller;
  int _current = 0;

  @override
  void initState() {
    super.initState();
    _controller = PageController();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        SizedBox(
          height: 260,
          child: PageView.builder(
            controller: _controller,
            itemCount: widget.slides.length,
            onPageChanged: (i) {
              setState(() => _current = i);
              widget.onPageChanged?.call(i);
            },
            itemBuilder: (context, i) {
              final slide = widget.slides[i];
              return Padding(
                padding: const EdgeInsets.symmetric(horizontal: FlowSpace.s4),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    if (slide.media != null)
                      SizedBox(height: 120, child: slide.media!)
                    else if (slide.icon != null)
                      Icon(slide.icon, size: 64, color: scheme.actionAccent),
                    const SizedBox(height: FlowSpace.s5),
                    Text(
                      slide.title,
                      style: TextStyle(
                        fontSize: FlowFontSize.titleLg,
                        fontWeight: FontWeight.w700,
                        color: scheme.textPrimary,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    if (slide.description != null) ...[
                      const SizedBox(height: FlowSpace.s2),
                      Text(
                        slide.description!,
                        style: TextStyle(
                          fontSize: FlowFontSize.bodyMd,
                          color: scheme.textSecondary,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ],
                ),
              );
            },
          ),
        ),
        const SizedBox(height: FlowSpace.s4),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(widget.slides.length, (i) {
            final active = i == _current;
            return AnimatedContainer(
              duration: FlowDuration.fast,
              width: active ? 24 : 8,
              height: 8,
              margin: const EdgeInsets.symmetric(horizontal: 3),
              decoration: BoxDecoration(
                color: active ? scheme.actionAccent : scheme.borderDefault,
                borderRadius: BorderRadius.circular(FlowRadius.pill),
              ),
            );
          }),
        ),
      ],
    );
  }
}
