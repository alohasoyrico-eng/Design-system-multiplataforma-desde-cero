
import 'package:flutter/material.dart';
import 'package:material_symbols_icons/symbols.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';
enum TransactionCategory { transfer, fuel, toll, service, payment }
class FlowTransactionRow extends StatelessWidget {
  final TransactionCategory category;
  final String title;
  final String? subtitle;
  final double amount;
  final String currency;
  final bool pending;
  final VoidCallback? onTap;
  final Color? iconColor;
  final Color? iconBg;
  const FlowTransactionRow({
    super.key,
    this.category = TransactionCategory.transfer,
    required this.title,
    this.subtitle,
    this.amount = 0,
    this.currency = '\$',
    this.pending = false,
    this.onTap,
    this.iconColor,
    this.iconBg,
  });
  IconData get _icon => switch (category) {
    TransactionCategory.transfer => Symbols.swap_horiz_rounded,
    TransactionCategory.fuel => Symbols.local_gas_station_rounded,
    TransactionCategory.toll => Symbols.toll_rounded,
    TransactionCategory.service => Symbols.build_rounded,
    TransactionCategory.payment => Symbols.payments_rounded,
  };
  Color _iconBg(FlowScheme scheme) => switch (category) {
    TransactionCategory.transfer => scheme.surfaceSunken,
    TransactionCategory.fuel => FlowColors.orange50,
    TransactionCategory.toll => FlowColors.blue50,
    TransactionCategory.service => scheme.surfaceSunken,
    TransactionCategory.payment => FlowColors.green50,
  };
  Color get _iconFg => switch (category) {
    TransactionCategory.transfer => FlowColors.grey500,
    TransactionCategory.fuel => FlowColors.orange600,
    TransactionCategory.toll => FlowColors.blue600,
    TransactionCategory.service => FlowColors.grey500,
    TransactionCategory.payment => FlowColors.green600,
  };
  String get _sign => amount < 0 ? '−' : '+';
  String _formatAmount() {
    final abs = amount.abs();
    final parts = abs.toStringAsFixed(2).split('.');
    final intPart = parts[0];
    final buffer = StringBuffer();
    for (var i = 0; i < intPart.length; i++) {
      if (i > 0 && (intPart.length - i) % 3 == 0) buffer.write(',');
      buffer.write(intPart[i]);
    }
    return '$_sign$currency${buffer.toString()}.${parts[1]}';
  }
  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    final opacity = pending ? 0.6 : 1.0;
    final amountColor = amount < 0 ? scheme.textPrimary : FlowColors.green600;
    final content = Opacity(
      opacity: opacity,
      child: Padding(
        padding: const EdgeInsets.symmetric(
          horizontal: FlowSpace.s4,
          vertical: FlowSpace.s3,
        ),
        child: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: iconBg ?? _iconBg(scheme),
                borderRadius: BorderRadius.circular(FlowRadius.sm),
              ),
              child: Icon(_icon, color: iconColor ?? _iconFg, size: 20),
            ),
            const SizedBox(width: FlowSpace.s3),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: FlowFontSize.bodyMd,
                      fontWeight: FontWeight.w500,
                      color: scheme.textPrimary,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  if (subtitle != null)
                    Text(
                      subtitle!,
                      style: TextStyle(
                        fontSize: FlowFontSize.bodySm,
                        color: scheme.textMuted,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                ],
              ),
            ),
            const SizedBox(width: FlowSpace.s2),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  _formatAmount(),
                  style: TextStyle(
                    fontSize: FlowFontSize.bodyMd,
                    fontWeight: FontWeight.w600,
                    color: amountColor,
                    fontFeatures: const [FontFeature.tabularFigures()],
                  ),
                ),
                if (pending)
                  Text(
                    'Pendiente',
                    style: TextStyle(
                      fontSize: FlowFontSize.bodySm,
                      color: FlowColors.orange600,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
    if (onTap != null) {
      return Semantics(
        button: true,
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: onTap,
            child: ConstrainedBox(
              constraints: const BoxConstraints(minHeight: 44),
              child: content,
            ),
          ),
        ),
      );
    }
    return content;
  }
}
