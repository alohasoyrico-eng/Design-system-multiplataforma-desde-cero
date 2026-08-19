import 'package:flutter/material.dart';
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

  const FlowTransactionRow({
    super.key,
    this.category = TransactionCategory.transfer,
    required this.title,
    this.subtitle,
    this.amount = 0,
    this.currency = '\$',
    this.pending = false,
    this.onTap,
  });

  IconData get _icon => switch (category) {
    TransactionCategory.transfer => Icons.swap_horiz,
    TransactionCategory.fuel => Icons.local_gas_station,
    TransactionCategory.toll => Icons.toll,
    TransactionCategory.service => Icons.build,
    TransactionCategory.payment => Icons.payments,
  };

  Color _iconBg(FlowScheme scheme) => switch (category) {
    TransactionCategory.transfer => scheme.surfaceSunken,
    TransactionCategory.fuel => FlowColors.amber50,
    TransactionCategory.toll => FlowColors.blue50,
    TransactionCategory.service => scheme.surfaceSunken,
    TransactionCategory.payment => FlowColors.green50,
  };

  Color get _iconFg => switch (category) {
    TransactionCategory.transfer => FlowColors.ink500,
    TransactionCategory.fuel => FlowColors.amber600,
    TransactionCategory.toll => FlowColors.blue600,
    TransactionCategory.service => FlowColors.ink500,
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
                color: _iconBg(scheme),
                borderRadius: BorderRadius.circular(FlowRadius.sm),
              ),
              child: Icon(_icon, color: _iconFg, size: 20),
            ),
            const SizedBox(width: FlowSpace.s3),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: FlowFontSize.body,
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
                        fontSize: FlowFontSize.caption,
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
                    fontSize: FlowFontSize.body,
                    fontWeight: FontWeight.w600,
                    color: amountColor,
                    fontFeatures: const [FontFeature.tabularFigures()],
                  ),
                ),
                if (pending)
                  Text(
                    'Pendiente',
                    style: TextStyle(
                      fontSize: FlowFontSize.caption,
                      color: FlowColors.amber600,
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
