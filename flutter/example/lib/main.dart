
import 'package:flutter/material.dart';
import 'package:material_symbols_icons/symbols.dart';
import 'package:flow_ds/flow_ds.dart';
import 'screens/wallet_screen.dart';
import 'screens/card_detail_screen.dart';
import 'screens/onboarding_screen.dart';
import 'screens/rutas_screen.dart';
void main() => runApp(const FlowExampleApp());
class FlowExampleApp extends StatelessWidget {
  const FlowExampleApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flow DS Templates',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(fontFamily: FlowFontFamily.body),
      home: const FlowTheme(
        scheme: FlowScheme.light,
        child: _TemplateChooser(),
      ),
    );
  }
}
class _TemplateChooser extends StatelessWidget {
  const _TemplateChooser();
  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.of(context);
    return Scaffold(
      backgroundColor: scheme.surfaceCanvas,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(FlowSpace.s4),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: FlowSpace.s8),
              Text(
                'Flow Templates',
                style: TextStyle(
                  fontSize: FlowFontSize.titleLg,
                  fontWeight: FontWeight.w700,
                  color: scheme.textPrimary,
                ),
              ),
              const SizedBox(height: FlowSpace.s2),
              Text(
                'Pantallas de referencia del design system',
                style: TextStyle(
                  fontSize: FlowFontSize.bodyMd,
                  color: scheme.textSecondary,
                ),
              ),
              const SizedBox(height: FlowSpace.s8),
              _TemplateCard(
                icon: Symbols.account_balance_wallet_rounded,
                title: 'Wallet',
                description: 'Balance, tarjetas, transacciones y perfil',
                onTap: () => _push(context, const WalletScreen()),
              ),
              const SizedBox(height: FlowSpace.s3),
              _TemplateCard(
                icon: Symbols.credit_card_rounded,
                title: 'Detalle de Tarjeta',
                description: 'NIP, límites, congelar tarjeta',
                onTap: () => _push(context, const CardDetailScreen()),
              ),
              const SizedBox(height: FlowSpace.s3),
              _TemplateCard(
                icon: Symbols.rocket_launch_rounded,
                title: 'Onboarding',
                description: 'Registro, OTP, passcode, biometría',
                onTap: () => _push(context, const OnboardingScreen()),
              ),
              const SizedBox(height: FlowSpace.s3),
              _TemplateCard(
                icon: Symbols.map_rounded,
                title: 'Rutas',
                description: 'Mapa con estaciones, filtros y navegación',
                onTap: () => _push(context, const RutasScreen()),
              ),
            ],
          ),
        ),
      ),
    );
  }
  void _push(BuildContext context, Widget screen) {
    Navigator.of(context).push(
      MaterialPageRoute(builder: (_) {
        return FlowTheme(
          scheme: FlowScheme.light,
          child: screen,
        );
      }),
    );
  }
}
class _TemplateCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String description;
  final VoidCallback onTap;
  const _TemplateCard({
    required this.icon,
    required this.title,
    required this.description,
    required this.onTap,
  });
  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.of(context);
    return FlowCard(
      onTap: onTap,
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: scheme.surfaceAccentSubtle,
              borderRadius: BorderRadius.circular(FlowRadius.sm),
            ),
            child: Icon(icon, color: scheme.textAccent, size: 24),
          ),
          const SizedBox(width: FlowSpace.s3),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: FlowFontSize.titleMd,
                    fontWeight: FontWeight.w600,
                    color: scheme.textPrimary,
                  ),
                ),
                Text(
                  description,
                  style: TextStyle(
                    fontSize: FlowFontSize.bodySm,
                    color: scheme.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          Icon(Symbols.chevron_right_rounded, color: scheme.textMuted, size: 20),
        ],
      ),
    );
  }
}
