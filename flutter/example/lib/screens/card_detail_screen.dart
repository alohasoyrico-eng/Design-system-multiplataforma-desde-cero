
import 'package:flutter/material.dart';
import 'package:material_symbols_icons/symbols.dart';
import 'package:flow_ds/flow_ds.dart';
const _transactions = [
  _TxData(category: TransactionCategory.fuel, title: 'Gasolinera Pemex #412', subtitle: 'Hoy, 14:23', amount: -850.00),
  _TxData(category: TransactionCategory.toll, title: 'Caseta Zapotlanejo', subtitle: 'Hoy, 11:05', amount: -195.00),
  _TxData(category: TransactionCategory.service, title: 'Lavado exterior', subtitle: 'Ayer', amount: -180.00),
  _TxData(category: TransactionCategory.fuel, title: 'Gasolinera BP Sur', subtitle: '17 ago', amount: -920.00),
];
class CardDetailScreen extends StatefulWidget {
  const CardDetailScreen({super.key});
  @override
  State<CardDetailScreen> createState() => _CardDetailScreenState();
}
class _CardDetailScreenState extends State<CardDetailScreen> {
  bool _frozen = false;
  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.of(context);
    return Scaffold(
      backgroundColor: scheme.surfaceCanvas,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              FlowNavBar(
                title: 'Detalle',
                onBack: () => Navigator.of(context).pop(),
                trailing: _frozen
                    ? const FlowBadge(tone: FlowBadgeTone.info, icon: Symbols.ac_unit_rounded, label: 'Congelada')
                    : null,
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: FlowSpace.s4),
                child: FlowPaymentCard(
                  holder: 'RICARDO MORALES',
                  last4: '4921',
                  variant: FlowPaymentCardVariant.fuel,
                  label: 'COMBUSTIBLE',
                  icon: Symbols.local_gas_station_rounded,
                  expires: '08/28',
                  frozen: _frozen,
                ),
              ),
              const SizedBox(height: FlowSpace.s4),
              FlowQuickActionBar(
                children: [
                  FlowQuickAction(
                    icon: Symbols.ac_unit_rounded,
                    label: _frozen ? 'Descongelar' : 'Congelar',
                    active: _frozen,
                    onTap: () => setState(() => _frozen = !_frozen),
                  ),
                  FlowQuickAction(icon: Symbols.pin_rounded, label: 'Ver NIP', onTap: _showNip),
                  FlowQuickAction(icon: Symbols.speed_rounded, label: 'Límites', onTap: _showLimits),
                  FlowQuickAction(icon: Symbols.password_rounded, label: 'CVV', onTap: () {}),
                ],
              ),
              const SizedBox(height: FlowSpace.s6),
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: FlowSpace.s4),
                child: FlowSectionHeader(title: 'Movimientos de esta tarjeta', size: FlowSectionHeaderSize.sm),
              ),
              ..._transactions.map((tx) => FlowTransactionRow(
                category: tx.category,
                title: tx.title,
                subtitle: tx.subtitle,
                amount: tx.amount,
              )),
            ],
          ),
        ),
      ),
    );
  }
  void _showNip() {
    FlowBottomSheet.show(
      context: context,
      title: 'NIP de la tarjeta',
      builder: (_) => const FlowNipReveal(
        digits: '4721',
        warning: 'Tu NIP se mostrará por 5 segundos. Asegúrate de que nadie más pueda ver tu pantalla.',
      ),
    );
  }
  void _showLimits() {
    FlowBottomSheet.show(
      context: context,
      title: 'Límites de gasto',
      builder: (_) => FlowSheetBody(
        children: [
          const FlowLimitBar(label: 'Diario', current: 2500, max: 5000),
          const FlowLimitBar(label: 'Semanal', current: 12400, max: 25000),
          const FlowLimitBar(label: 'Mensual', current: 38200, max: 100000),
          const SizedBox(height: FlowSpace.s4),
          FlowButton(
            label: 'Cerrar',
            variant: FlowButtonVariant.primary,
            fullWidth: true,
            onPressed: () => Navigator.of(context).pop(),
          ),
        ],
      ),
    );
  }
}
class _TxData {
  final TransactionCategory category;
  final String title, subtitle;
  final double amount;
  const _TxData({required this.category, required this.title, required this.subtitle, required this.amount});
}
