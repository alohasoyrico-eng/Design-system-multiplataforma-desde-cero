
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:material_symbols_icons/symbols.dart';
import 'flow_tokens.dart';
enum FlowPaymentCardVariant { ink, accent, sand, fuel, ev, maintenance, toll }
class FlowPaymentCard extends StatelessWidget {
  final String holder;
  final String last4;
  final FlowPaymentCardVariant variant;
  final bool frozen;
  final String? label;
  final IconData? icon;
  final String? expires;
  final String? balance;
  final bool hidden;
  final VoidCallback? onToggleHidden;
  final VoidCallback? onTap;
  const FlowPaymentCard({
    super.key,
    required this.holder,
    required this.last4,
    this.variant = FlowPaymentCardVariant.ink,
    this.frozen = false,
    this.label,
    this.icon,
    this.expires,
    this.balance,
    this.hidden = false,
    this.onToggleHidden,
    this.onTap,
  });
  @override
  Widget build(BuildContext context) {
    Color bg;
    Color fg;
    final isProduct = variant == FlowPaymentCardVariant.fuel ||
        variant == FlowPaymentCardVariant.ev ||
        variant == FlowPaymentCardVariant.maintenance ||
        variant == FlowPaymentCardVariant.toll;
    switch (variant) {
      case FlowPaymentCardVariant.ink:
        bg = FlowColors.grey900.withValues(alpha: 0.72);
        fg = Colors.white;
      case FlowPaymentCardVariant.accent:
        bg = const Color(0xC8C81E1E);
        fg = Colors.white;
      case FlowPaymentCardVariant.sand:
        bg = FlowColors.grey300.withValues(alpha: 0.7);
        fg = FlowColors.grey900;
      case FlowPaymentCardVariant.fuel:
        bg = Colors.transparent;
        fg = FlowColors.grey900;
      case FlowPaymentCardVariant.ev:
      case FlowPaymentCardVariant.maintenance:
      case FlowPaymentCardVariant.toll:
        bg = Colors.transparent;
        fg = Colors.white;
    }
    Widget card = Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: isProduct ? bg : bg,
        borderRadius: BorderRadius.circular(FlowRadius.lg),
        boxShadow: FlowShadow.raised,
        border: isProduct
            ? Border.all(color: Colors.white.withValues(alpha: 0.15))
            : null,
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(FlowRadius.lg),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: isProduct ? 28 : 0, sigmaY: isProduct ? 28 : 0),
          child: Container(
            color: isProduct ? Colors.white.withValues(alpha: 0.08) : bg,
            padding: const EdgeInsets.symmetric(horizontal: FlowSpace.s6, vertical: FlowSpace.s5),
            child: AspectRatio(
              aspectRatio: 1.82,
              child: Stack(
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // Top row: balance + toggle
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              balance != null ? (hidden ? '••••••' : balance!) : '',
                              style: TextStyle(
                                fontFamily: FlowFontFamily.mono,
                                fontSize: 20,
                                fontWeight: FontWeight.w700,
                                color: fg,
                                letterSpacing: -0.4,
                              ),
                            ),
                          ),
                          if (onToggleHidden != null)
                            GestureDetector(
                              onTap: onToggleHidden,
                              child: Container(
                                width: 28,
                                height: 28,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: Colors.white.withValues(alpha: 0.15),
                                ),
                                child: Icon(
                                  hidden ? Symbols.visibility_rounded : Symbols.visibility_off_rounded,
                                  size: 16,
                                  color: fg.withValues(alpha: 0.7),
                                ),
                              ),
                            ),
                        ],
                      ),
                      // Product row: icon + label
                      Row(
                        children: [
                          if (icon != null) ...[
                            Icon(icon!, size: 16, color: fg.withValues(alpha: 0.85)),
                            const SizedBox(width: FlowSpace.s1),
                          ],
                          if (label != null)
                            Text(
                              label!,
                              style: TextStyle(
                                fontSize: 9,
                                fontWeight: FontWeight.w600,
                                color: fg.withValues(alpha: 0.7),
                                letterSpacing: 0.7,
                              ),
                            ),
                        ],
                      ),
                      // Card number
                      Row(
                        children: [
                          for (var i = 0; i < 3; i++) ...[
                            Text(
                              '••••',
                              style: TextStyle(
                                fontSize: 12,
                                fontFamily: FlowFontFamily.mono,
                                color: fg.withValues(alpha: 0.4),
                                letterSpacing: 1.5,
                              ),
                            ),
                            const SizedBox(width: FlowSpace.s2),
                          ],
                          Text(
                            hidden ? '••••' : last4,
                            style: TextStyle(
                              fontSize: 12,
                              fontFamily: FlowFontFamily.mono,
                              fontWeight: FontWeight.w700,
                              color: fg,
                              letterSpacing: 1.5,
                            ),
                          ),
                        ],
                      ),
                      // Bottom: holder + expires
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              hidden ? holder.replaceAll(RegExp(r'\S'), '•') : holder,
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.w500,
                                color: fg.withValues(alpha: 0.7),
                                letterSpacing: 0.5,
                              ),
                            ),
                          ),
                          if (expires != null)
                            Text(
                              hidden ? '••/••' : expires!,
                              style: TextStyle(
                                fontSize: 10,
                                color: fg.withValues(alpha: 0.6),
                              ),
                            ),
                        ],
                      ),
                    ],
                  ),
                  if (frozen)
                    Positioned.fill(
                      child: Container(
                        decoration: BoxDecoration(
                          color: Colors.black.withValues(alpha: 0.5),
                          borderRadius: BorderRadius.circular(FlowRadius.lg - 2),
                        ),
                        child: BackdropFilter(
                          filter: ImageFilter.blur(sigmaX: 4, sigmaY: 4),
                          child: const Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Symbols.ac_unit_rounded, size: 32, color: Colors.white),
                              SizedBox(height: FlowSpace.s1),
                              Text(
                                'CONGELADA',
                                style: TextStyle(
                                  fontSize: FlowFontSize.bodySm,
                                  fontWeight: FontWeight.w700,
                                  color: Colors.white,
                                  letterSpacing: 1,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
    if (onTap != null) {
      return GestureDetector(onTap: onTap, child: card);
    }
    return card;
  }
}
