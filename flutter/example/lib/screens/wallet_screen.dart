import 'dart:math';
import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:material_symbols_icons/symbols.dart';
import 'package:flow_ds/flow_ds.dart';
import 'package:latlong2/latlong.dart';
// ─── Data ────────────────────────────────────────────────────────────
const _tabs = [
  FlowTabItem(id: 'home', label: 'Inicio', icon: Symbols.home_rounded, activeIcon: Symbols.home_rounded),
  FlowTabItem(id: 'cards', label: 'Tarjetas', icon: Symbols.credit_card_rounded, activeIcon: Symbols.credit_card_rounded),
  FlowTabItem(id: 'activity', label: 'Actividad', icon: Symbols.receipt_long_rounded, activeIcon: Symbols.receipt_long_rounded),
  FlowTabItem(id: 'rutas', label: 'Rutas', icon: Symbols.map_rounded, activeIcon: Symbols.map_rounded),
];
const _cards = [
  _CardData(holder: 'RICARDO MORALES', last4: '4921', variant: FlowPaymentCardVariant.fuel, label: 'COMBUSTIBLE', icon: Symbols.local_gas_station_rounded, expires: '08/28', key: 'fuel', balance: '\$12,470.00'),
  _CardData(holder: 'RICARDO MORALES', last4: '7833', variant: FlowPaymentCardVariant.ev, label: 'ELECTROMOVILIDAD', icon: Symbols.bolt_rounded, expires: '12/27', key: 'ev', balance: '\$5,340.00'),
  _CardData(holder: 'RICARDO MORALES', last4: '3156', variant: FlowPaymentCardVariant.maintenance, label: 'MANTENIMIENTO', icon: Symbols.build_rounded, expires: '03/29', key: 'maintenance', balance: '\$3,840.00'),
  _CardData(holder: 'RICARDO MORALES', last4: '8702', variant: FlowPaymentCardVariant.toll, label: 'CASETAS', icon: Symbols.toll_rounded, expires: '11/28', key: 'toll', balance: '\$3,200.00'),
];
const _benefits = [
  _Benefit(icon: Symbols.local_gas_station_rounded, title: 'Combustible', desc: 'Ahorra hasta 8% en cada carga', product: 'fuel'),
  _Benefit(icon: Symbols.bolt_rounded, title: 'Electromovilidad', desc: 'Carga tu EV con tarifa preferencial', product: 'ev'),
  _Benefit(icon: Symbols.toll_rounded, title: 'Casetas', desc: 'Pasa sin detenerte con TAG integrado', product: 'toll'),
  _Benefit(icon: Symbols.build_rounded, title: 'Mantenimiento', desc: 'Descuentos en red de talleres', product: 'maintenance'),
];
const _transactions = [
  _TxData(category: TransactionCategory.fuel, title: 'Gasolinera Pemex #412', subtitle: 'Hoy, 14:23', amount: -850.00, card: 'fuel', day: 'HOY'),
  _TxData(category: TransactionCategory.fuel, title: 'Gasolinera G500 Roma', subtitle: 'Hoy, 09:10', amount: -620.00, card: 'fuel', day: 'HOY'),
  _TxData(category: TransactionCategory.toll, title: 'Caseta Zapotlanejo', subtitle: 'Hoy, 11:05', amount: -195.00, card: 'toll', day: 'HOY'),
  _TxData(category: TransactionCategory.toll, title: 'Caseta Palmillas', subtitle: 'Ayer, 16:40', amount: -280.00, card: 'toll', day: 'AYER'),
  _TxData(category: TransactionCategory.service, title: 'Carga EV Condesa', subtitle: 'Ayer, 18:30', amount: -340.00, card: 'ev', day: 'AYER'),
  _TxData(category: TransactionCategory.service, title: 'Mantenimiento preventivo', subtitle: 'Ayer, 09:15', amount: -3200.00, card: 'maintenance', day: 'AYER', pending: true),
];
const _productColors = {
  'fuel':        _ProductColor(Color(0xFFE8A500), Color(0xFFFCD63E), Color(0xFFD4A017), Color(0x2EFCD63E)),
  'ev':          _ProductColor(Color(0xFF1B6A2E), Color(0xFF37B24D), Color(0xFF2B8A3E), Color(0x242B8A3E)),
  'maintenance': _ProductColor(Color(0xFF6A1E80), Color(0xFFAE3EC9), Color(0xFF862E9C), Color(0x24862E9C)),
  'toll':        _ProductColor(Color(0xFF0E4A80), Color(0xFF228BE6), Color(0xFF1864AB), Color(0x241864AB)),
};
const _heroColors = {
  'fuel':        _HeroConfig(Color(0xFFFCD63E), Color(0x99641EDC), Color(0x8CC828B4), Color(0x801E3CDC), false,
                   x1: -0.20, y1: 0.35, s1: 280, x2: 0.85, y2: -0.10, s2: 90, x3: 0.55, y3: 0.80, s3: 160),
  'ev':          _HeroConfig(Color(0xFF0E4220), Color(0x99F03278), Color(0x80FA7828), Color(0x66DC1EC8), true,
                   x1: 0.80, y1: 0.70, s1: 100, x2: -0.15, y2: 0.10, s2: 300, x3: 0.40, y3: -0.20, s3: 180),
  'maintenance': _HeroConfig(Color(0xFF2E0E40), Color(0x99FAD21E), Color(0x801EDC8C), Color(0x5950F0C8), true,
                   x1: 0.75, y1: -0.15, s1: 200, x2: -0.20, y2: 0.75, s2: 260, x3: 0.50, y3: 0.40, s3: 80),
  'toll':        _HeroConfig(Color(0xFF071E3E), Color(0x99FAA014), Color(0x80FF3C28), Color(0x59FAC832), true,
                   x1: -0.10, y1: -0.15, s1: 320, x2: 0.90, y2: 0.80, s2: 110, x3: 0.30, y3: 0.50, s3: 140),
  '_add':        _HeroConfig(Color(0xFF2C1A30), Color(0x8028DCC8), Color(0x73F0328C), Color(0x593264F0), true,
                   x1: 0.85, y1: -0.10, s1: 240, x2: -0.15, y2: 0.80, s2: 130, x3: 0.40, y3: 0.30, s3: 90),
};
const _heroDarkScheme = FlowScheme(
  surfaceCanvas: Color(0x00000000),
  surfaceCard: Color(0x26FFFFFF),
  surfaceSunken: Color(0x1FFFFFFF),
  surfaceInverse: Color(0xFFF4F3F1),
  surfaceAccentSubtle: Color(0x24FFFFFF),
  textPrimary: Color(0xFFFFFFFF),
  textSecondary: Color(0xB3FFFFFF),
  textMuted: Color(0x80FFFFFF),
  textOnAccent: Color(0xFFFFFFFF),
  textOnInverse: Color(0xFF17171A),
  textAccent: Color(0xFFFF6A52),
  textLink: Color(0xFF8ABCFF),
  borderSubtle: Color(0x1AFFFFFF),
  borderDefault: Color(0x33FFFFFF),
  borderStrong: Color(0x4DFFFFFF),
  borderFocus: Color(0xFFFF3617),
  actionPrimary: Color(0xFFFFFFFF),
  actionPrimaryHover: Color(0xCCFFFFFF),
  actionAccent: Color(0xFFFF3617),
  actionAccentHover: Color(0xFFFF4A2E),
);
const _heroFuelScheme = FlowScheme(
  surfaceCanvas: Color(0x00000000),
  surfaceCard: Color(0x0F000000),
  surfaceSunken: Color(0x14000000),
  surfaceInverse: Color(0xFF17171A),
  surfaceAccentSubtle: Color(0x14000000),
  textPrimary: Color(0xFF17171A),
  textSecondary: Color(0xFF3B3A3E),
  textMuted: Color(0xFF6B6A6E),
  textOnAccent: Color(0xFFFFFFFF),
  textOnInverse: Color(0xFFF4F3F1),
  textAccent: Color(0xFFE62D10),
  textLink: Color(0xFF0060DF),
  borderSubtle: Color(0x14000000),
  borderDefault: Color(0x26000000),
  borderStrong: Color(0x40000000),
  borderFocus: Color(0xFFFF3617),
  actionPrimary: Color(0xFF17171A),
  actionPrimaryHover: Color(0xFF000000),
  actionAccent: Color(0xFFFF3617),
  actionAccentHover: Color(0xFFE62D10),
);
// ─── Rutas data ──────────────────────────────────────────────────────
const _me = LatLng(19.4326, -99.1500);
final _stations = [
  const _Station(id: 's1', kind: 'gas', lat: 19.4426, lon: -99.1680, priceLabel: '\$23.4', icon: Symbols.local_gas_station_rounded, name: 'Pemex Polanco', dist: '1.8 km', eta: '6 min', prices: [['Magna', '\$23.40'], ['Premium', '\$25.10'], ['Diésel', '\$24.80']], services: ['Tienda', 'Aire y agua', 'Baños'], open: '24 h'),
  const _Station(id: 's2', kind: 'gas', lat: 19.4290, lon: -99.1420, priceLabel: '\$22.9', icon: Symbols.local_gas_station_rounded, name: 'G500 Roma Norte', dist: '0.9 km', eta: '4 min', prices: [['Magna', '\$22.90'], ['Premium', '\$24.70']], services: ['Tienda', 'Baños'], open: '6:00–23:00'),
  const _Station(id: 's3', kind: 'ev', lat: 19.4190, lon: -99.1610, priceLabel: '\$4.2/kWh', icon: Symbols.bolt_rounded, name: 'Electrolinera Condesa', dist: '1.4 km', eta: '5 min', prices: [['Carga rápida (150 kW)', '\$4.20/kWh'], ['Carga normal (22 kW)', '\$3.10/kWh']], services: ['4 conectores CCS', 'Café'], open: '24 h'),
  const _Station(id: 's4', kind: 'ev', lat: 19.4400, lon: -99.1400, priceLabel: '\$3.9/kWh', icon: Symbols.bolt_rounded, name: 'EV Point Anzures', dist: '2.1 km', eta: '8 min', prices: [['Carga rápida (100 kW)', '\$3.90/kWh']], services: ['2 conectores CCS'], open: '24 h'),
];
final _routes = {
  's1': [_me, const LatLng(19.4360, -99.1560), const LatLng(19.4400, -99.1640), const LatLng(19.4426, -99.1680)],
  's2': [_me, const LatLng(19.4310, -99.1460), const LatLng(19.4290, -99.1420)],
  's3': [_me, const LatLng(19.4270, -99.1550), const LatLng(19.4220, -99.1590), const LatLng(19.4190, -99.1610)],
  's4': [_me, const LatLng(19.4370, -99.1450), const LatLng(19.4400, -99.1400)],
};
// ─── Screen ──────────────────────────────────────────────────────────
class WalletScreen extends StatefulWidget {
  const WalletScreen({super.key});
  @override
  State<WalletScreen> createState() => _WalletScreenState();
}
class _WalletScreenState extends State<WalletScreen> {
  String _activeTab = 'home';
  int _cardIdx = 0;
  bool _balanceHidden = false;
  // Card detail
  bool _cardDetail = false;
  bool _frozen = false;
  // Rutas
  String _mapFilter = 'todas';
  String? _selectedStation;
  bool _routing = false;
  _CardData get _activeCard => _cards[_cardIdx.clamp(0, _cards.length - 1)];
  List<_TxData> get _filteredTx => _transactions.where((t) => t.card == _activeCard.key).toList();
  _Station? get _station => _stations.where((s) => s.id == _selectedStation).firstOrNull;
  List<_Station> get _visibleStations => _stations.where((s) => _mapFilter == 'todas' || s.kind == _mapFilter).toList();
  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.of(context);
    final groups = _groupByDay(_transactions);
    return Scaffold(
      backgroundColor: scheme.surfaceCanvas,
      body: Stack(
        children: [
          // ── Main content ──
          Column(
            children: [
              Expanded(
                child: _buildTab(scheme, groups),
              ),
            ],
          ),
          // ── Tab bar ──
          Positioned(
            left: 0, right: 0, bottom: 0,
            child: FlowTabBar(
              items: _tabs,
              activeId: _activeTab,
              onChange: (id) => setState(() {
                _activeTab = id;
                _cardDetail = false;
              }),
            ),
          ),
        ],
      ),
    );
  }
  Widget _buildTab(FlowScheme scheme, List<_TxGroup> groups) {
    switch (_activeTab) {
      case 'home':
        return _buildHome(scheme);
      case 'cards':
        return _buildCards(scheme);
      case 'activity':
        return _buildActivity(scheme, groups);
      case 'rutas':
        return _buildRutas(scheme);
      default:
        return const SizedBox.shrink();
    }
  }
  // ── HOME TAB ──────────────────────────────────────────────────────
  bool get _isAddCard => _cardIdx >= _cards.length;
  Widget _buildHome(FlowScheme scheme) {
    final heroKey = _isAddCard ? '_add' : _activeCard.key;
    final hero = _heroColors[heroKey]!;
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Hero section with gradient + blobs
          _HeroSection(
            config: hero,
            child: SafeArea(
              bottom: false,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                    const SizedBox(height: FlowSpace.s2),
                    // Top bar
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: FlowSpace.s8),
                      child: Builder(builder: (ctx) {
                        final heroScheme = FlowTheme.of(ctx);
                        return Row(
                          children: [
                            GestureDetector(
                              onTap: () => _openProfile(),
                              child: Row(
                                children: [
                                  const FlowAvatar(name: 'Ricardo M.', size: FlowAvatarSize.md, status: FlowAvatarStatus.online),
                                  const SizedBox(width: FlowSpace.s3),
                                  Text(
                                    'Hola, Ricardo',
                                    style: TextStyle(
                                      fontSize: FlowFontSize.titleMd,
                                      fontWeight: FontWeight.w600,
                                      color: heroScheme.textPrimary,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const Spacer(),
                            FlowIconButton(
                              icon: Symbols.notifications_rounded,
                              ariaLabel: 'Notificaciones',
                              variant: FlowIconButtonVariant.ghost,
                              size: FlowIconButtonSize.sm,
                              onPressed: () {},
                            ),
                          ],
                        );
                      }),
                    ),
                    const SizedBox(height: FlowSpace.s2),
                    // Card carousel — extends edge-to-edge (no horizontal padding)
                    FlowCardCarousel(
                      activeIndex: _cardIdx,
                      onChange: (i) => setState(() => _cardIdx = i),
                      children: [
                        ..._cards.map((c) => FlowPaymentCard(
                          holder: c.holder,
                          last4: c.last4,
                          variant: c.variant,
                          label: c.label,
                          icon: c.icon,
                          expires: c.expires,
                          balance: c.balance,
                          hidden: _balanceHidden,
                          onToggleHidden: () => setState(() => _balanceHidden = !_balanceHidden),
                          frozen: c.key == _activeCard.key && _frozen,
                        )),
                        // Add card placeholder
                        _AddCardButton(lightText: hero.lightText),
                      ],
                    ),
                    const SizedBox(height: FlowSpace.s2),
                    // Quick actions
                    if (!_isAddCard)
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: FlowSpace.s8),
                        child: FlowQuickActionBar(
                          children: [
                            FlowQuickAction(icon: Symbols.receipt_long_rounded, label: 'Estado de cuenta', onTap: () => setState(() => _activeTab = 'activity')),
                            FlowQuickAction(icon: Symbols.password_rounded, label: 'Generar CVV', onTap: () => setState(() { _activeTab = 'cards'; _cardDetail = true; })),
                            FlowQuickAction(icon: Symbols.ac_unit_rounded, label: 'Congelar tarjeta', active: _frozen, onTap: () => setState(() => _frozen = !_frozen)),
                            FlowQuickAction(icon: Symbols.delete_rounded, label: 'Eliminar tarjeta', onTap: () {}),
                          ],
                        ),
                      ),
                    const SizedBox(height: FlowSpace.s4),
                  ],
              ),
            ),
          ),
          // Movements card (overlapping hero)
          Transform.translate(
            offset: const Offset(0, -25),
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: FlowSpace.s3),
              decoration: BoxDecoration(
                color: scheme.surfaceCard,
                borderRadius: BorderRadius.circular(FlowRadius.lg),
                boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 12, offset: Offset(0, 4))],
              ),
              child: Column(
                children: [
                  if (_cardIdx < _cards.length) ...[
                    ..._filteredTx.take(3).map((tx) {
                      final pc = _productColors[_activeCard.key];
                      return FlowTransactionRow(
                        category: tx.category,
                        title: tx.title,
                        subtitle: tx.subtitle,
                        amount: tx.amount,
                        pending: tx.pending,
                        onTap: () => _showTxDetail(tx),
                        iconColor: pc?.accent,
                        iconBg: pc?.soft,
                      );
                    }),
                    if (_filteredTx.isEmpty)
                      Padding(
                        padding: const EdgeInsets.all(FlowSpace.s6),
                        child: Center(
                          child: Text('Sin movimientos', style: TextStyle(color: scheme.textMuted, fontSize: FlowFontSize.bodyMd)),
                        ),
                      ),
                    InkWell(
                      onTap: () => setState(() => _activeTab = 'activity'),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: FlowSpace.s3),
                        child: Center(
                          child: Text(
                            'Ver todo',
                            style: TextStyle(
                              fontSize: FlowFontSize.bodySm,
                              fontWeight: FontWeight.w600,
                              color: scheme.textSecondary,
                              decoration: TextDecoration.underline,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ] else
                    const Padding(
                      padding: EdgeInsets.all(FlowSpace.s6),
                      child: FlowStatusView(
                        icon: Symbols.credit_card_off_rounded,
                        title: 'Sin movimientos',
                        description: 'Agrega una tarjeta para ver tus movimientos aquí',
                      ),
                    ),
                ],
              ),
            ),
          ),
          // Benefits
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: FlowSpace.s8),
            child: Text(
              'BENEFICIOS',
              style: TextStyle(
                fontSize: FlowFontSize.bodySm,
                fontWeight: FontWeight.w700,
                color: scheme.textMuted,
                letterSpacing: 0.8,
              ),
            ),
          ),
          const SizedBox(height: FlowSpace.s2),
          SizedBox(
            height: 220,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.fromLTRB(FlowSpace.s8, FlowSpace.s5, FlowSpace.s8, FlowSpace.s6),
              separatorBuilder: (_, __) => const SizedBox(width: FlowSpace.s3),
              itemCount: _benefits.length,
              itemBuilder: (_, i) {
                final b = _benefits[i];
                final pc = _productColors[b.product]!;
                return SizedBox(
                  width: 180,
                  child: FlowCardMedia(
                    title: b.title,
                    description: b.desc,
                    interactive: true,
                    onTap: () {},
                    media: Container(
                      height: 100,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [pc.gradientStart, pc.gradientEnd],
                        ),
                      ),
                      child: Center(
                        child: Icon(b.icon, color: Colors.white, size: 36),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          // Bottom padding for tab bar
          const SizedBox(height: 92),
        ],
      ),
    );
  }
  // ── CARDS TAB ─────────────────────────────────────────────────────
  Widget _buildCards(FlowScheme scheme) {
    if (!_cardDetail) {
      final hero = _heroColors[_activeCard.key]!;
      return SingleChildScrollView(
        child: Column(
          children: [
            _HeroSection(
              config: hero,
              child: SafeArea(
                bottom: false,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: FlowSpace.s2),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: FlowSpace.s8),
                      child: Builder(builder: (ctx) {
                        final heroScheme = FlowTheme.of(ctx);
                        return Row(
                          children: [
                            Text('Tarjetas', style: TextStyle(fontSize: FlowFontSize.titleLg, fontWeight: FontWeight.w700, color: heroScheme.textPrimary)),
                            const Spacer(),
                            FlowIconButton(icon: Symbols.notifications_rounded, ariaLabel: 'Notificaciones', variant: FlowIconButtonVariant.ghost, size: FlowIconButtonSize.sm, badge: true, onPressed: () {}),
                          ],
                        );
                      }),
                    ),
                    const SizedBox(height: FlowSpace.s2),
                    FlowCardCarousel(
                      activeIndex: _cardIdx,
                      onChange: (i) => setState(() => _cardIdx = i),
                      children: _cards.map((c) => FlowPaymentCard(
                        holder: c.holder, last4: c.last4, variant: c.variant,
                        label: c.label, icon: c.icon, expires: c.expires,
                      )).toList(),
                    ),
                    const SizedBox(height: FlowSpace.s2),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: FlowSpace.s8),
                      child: FlowQuickActionBar(
                        children: [
                          FlowQuickAction(icon: Symbols.info_rounded, label: 'Detalle', onTap: () => setState(() => _cardDetail = true)),
                          FlowQuickAction(icon: Symbols.north_east_rounded, label: 'Enviar', onTap: () {}),
                          FlowQuickAction(icon: Symbols.south_west_rounded, label: 'Recibir', onTap: () {}),
                          FlowQuickAction(icon: Symbols.more_horiz_rounded, label: 'Más', onTap: () {}),
                        ],
                      ),
                    ),
                    const SizedBox(height: FlowSpace.s4),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 92),
          ],
        ),
      );
    }
    // Card detail view
    return SafeArea(
      bottom: false,
      child: SingleChildScrollView(
        padding: const EdgeInsets.only(bottom: 92),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: FlowSpace.s4),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: FlowSpace.s2),
              FlowNavBar(
                title: 'Detalle',
                onBack: () => setState(() => _cardDetail = false),
                trailing: _frozen
                    ? const FlowBadge(tone: FlowBadgeTone.info, icon: Symbols.ac_unit_rounded, label: 'Congelada')
                    : null,
              ),
              const SizedBox(height: FlowSpace.s4),
              FlowPaymentCard(
                holder: _activeCard.holder,
                last4: _activeCard.last4,
                variant: _activeCard.variant,
                label: _activeCard.label,
                icon: _activeCard.icon,
                expires: _activeCard.expires,
                frozen: _frozen,
              ),
              const SizedBox(height: FlowSpace.s4),
              FlowQuickActionBar(
                children: [
                  FlowQuickAction(icon: Symbols.ac_unit_rounded, label: _frozen ? 'Descongelar' : 'Congelar', active: _frozen, onTap: () => setState(() => _frozen = !_frozen)),
                  FlowQuickAction(icon: Symbols.pin_rounded, label: 'Ver NIP', onTap: () => _showNip()),
                  FlowQuickAction(icon: Symbols.speed_rounded, label: 'Límites', onTap: () => _showLimits()),
                  FlowQuickAction(icon: Symbols.password_rounded, label: 'CVV', onTap: () {}),
                ],
              ),
              const SizedBox(height: FlowSpace.s6),
              const FlowSectionHeader(title: 'Movimientos de esta tarjeta', size: FlowSectionHeaderSize.sm),
              ..._filteredTx.take(4).map((tx) => FlowTransactionRow(
                category: tx.category,
                title: tx.title,
                subtitle: tx.subtitle,
                amount: tx.amount,
                pending: tx.pending,
              )),
            ],
          ),
        ),
      ),
    );
  }
  // ── ACTIVITY TAB ──────────────────────────────────────────────────
  Widget _buildActivity(FlowScheme scheme, List<_TxGroup> groups) {
    return SafeArea(
      bottom: false,
      child: SingleChildScrollView(
        padding: const EdgeInsets.only(bottom: 92, top: FlowSpace.s2),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: FlowSpace.s4),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Expanded(child: FlowSectionHeader(title: 'Actividad')),
                  FlowIconButton(icon: Symbols.notifications_rounded, ariaLabel: 'Notificaciones', variant: FlowIconButtonVariant.tonal, badge: true, onPressed: () {}),
                ],
              ),
              const SizedBox(height: FlowSpace.s4),
              ...groups.map((g) => FlowTransactionGroup(
                label: g.label,
                children: g.items.map((tx) => FlowTransactionRow(
                  category: tx.category,
                  title: tx.title,
                  subtitle: tx.subtitle,
                  amount: tx.amount,
                  pending: tx.pending,
                  onTap: () => _showTxDetail(tx),
                )).toList(),
              )),
            ],
          ),
        ),
      ),
    );
  }
  // ── RUTAS TAB ─────────────────────────────────────────────────────
  Widget _buildRutas(FlowScheme scheme) {
    final station = _station;
    return Stack(
      children: [
        FlowMapCanvas(
          centerLat: 19.4310,
          centerLon: -99.1530,
          zoom: 14,
          pins: _visibleStations.map((s) => FlowMapPin(
            id: s.id, lat: s.lat, lon: s.lon, label: s.priceLabel,
            color: s.id == _selectedStation ? scheme.actionAccent : null,
          )).toList(),
          selectedPin: _selectedStation,
          onPinTap: (id) {
            setState(() { _selectedStation = id; _routing = false; });
            final station = _stations.where((s) => s.id == id).firstOrNull;
            if (station != null) _showStationDetail(station);
          },
          route: _routing && _selectedStation != null ? _routes[_selectedStation] : null,
        ),
        SafeArea(
          child: Padding(
            padding: const EdgeInsets.only(top: FlowSpace.s2),
            child: FlowFilterBar(
              children: [
                const SizedBox(width: FlowSpace.s4),
                FlowChip(label: 'Todas', selected: _mapFilter == 'todas', onTap: () => _setMapFilter('todas')),
                FlowChip(label: 'Gasolina', icon: Symbols.local_gas_station_rounded, selected: _mapFilter == 'gas', onTap: () => _setMapFilter('gas')),
                FlowChip(label: 'Eléctrico', icon: Symbols.bolt_rounded, selected: _mapFilter == 'ev', onTap: () => _setMapFilter('ev')),
                const Spacer(),
                FlowIconButton(icon: Symbols.my_location_rounded, ariaLabel: 'Mi ubicación', variant: FlowIconButtonVariant.tonal, size: FlowIconButtonSize.sm, onPressed: () {}),
                const SizedBox(width: FlowSpace.s4),
              ],
            ),
          ),
        ),
        if (_routing && station != null)
          Positioned(
            left: FlowSpace.s4, right: FlowSpace.s4,
            bottom: MediaQuery.of(context).padding.bottom + FlowSpace.s4 + 56,
            child: FlowRouteBanner(
              title: 'Hacia ${station.name}',
              subtitle: '${station.dist} · llegas en ${station.eta}',
              onClose: () => setState(() => _routing = false),
            ),
          ),
        if (_selectedStation == null && !_routing)
          Positioned(
            left: 0, right: 0, bottom: 56,
            child: FlowPeekSheet(
              title: '${_visibleStations.length} estaciones cerca',
              children: _visibleStations.take(3).map((s) => _StationListItem(
                station: s,
                scheme: scheme,
                onTap: () {
                  setState(() { _selectedStation = s.id; _routing = false; });
                  _showStationDetail(s);
                },
              )).toList(),
            ),
          ),
        // Station detail is shown via FlowBottomSheet.show() on pin tap
      ],
    );
  }
  // ── Helpers ────────────────────────────────────────────────────────
  void _setMapFilter(String value) {
    setState(() {
      _mapFilter = value;
      final station = _station;
      if (station != null && value != 'todas' && station.kind != value) {
        _selectedStation = null;
        _routing = false;
      }
    });
  }
  void _showTxDetail(_TxData tx) {
    final scheme = FlowTheme.of(context);
    FlowBottomSheet.show(
      context: context,
      title: 'Detalle del movimiento',
      builder: (_) => FlowSheetBody(
        children: [
          Text(
            '${tx.amount < 0 ? '−' : '+'}\$${tx.amount.abs().toStringAsFixed(2)}',
            style: TextStyle(
              fontSize: FlowFontSize.titleLg,
              fontWeight: FontWeight.w700,
              color: scheme.textPrimary,
              fontFeatures: const [FontFeature.tabularFigures()],
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: FlowSpace.s3),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (tx.pending) ...[
                const FlowBadge(tone: FlowBadgeTone.warning, label: 'Pendiente'),
                const SizedBox(width: FlowSpace.s2),
              ],
              FlowBadge(
                tone: tx.amount < 0 ? FlowBadgeTone.danger : FlowBadgeTone.success,
                label: tx.amount < 0 ? 'Cargo' : 'Abono',
              ),
            ],
          ),
          const SizedBox(height: FlowSpace.s4),
          FlowCard(
            padding: FlowSpace.s4,
            child: Column(
              children: [
                FlowDetailRow(label: 'Concepto', value: tx.title),
                FlowDetailRow(label: 'Fecha', value: tx.subtitle),
                FlowDetailRow(
                  label: 'Tarjeta',
                  value: {
                    'fuel': 'Combustible ••4921',
                    'ev': 'Electromovilidad ••7833',
                    'maintenance': 'Mantenimiento ••3156',
                    'toll': 'Casetas ••8702',
                  }[tx.card] ?? tx.card,
                ),
              ],
            ),
          ),
          const SizedBox(height: FlowSpace.s3),
          FlowButton(label: 'Disputar este cargo', variant: FlowButtonVariant.ghost, fullWidth: true, onPressed: () {}),
        ],
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
          FlowButton(label: 'Cerrar', variant: FlowButtonVariant.primary, fullWidth: true, onPressed: () => Navigator.pop(context)),
        ],
      ),
    );
  }
  void _showStationDetail(_Station station) {
    FlowBottomSheet.show(
      context: context,
      title: station.name,
      builder: (_) => FlowSheetBody(
        children: [
          Wrap(
            spacing: FlowSpace.s2,
            runSpacing: FlowSpace.s2,
            children: [
              FlowBadge(tone: station.kind == 'ev' ? FlowBadgeTone.success : FlowBadgeTone.warning, icon: station.icon, label: station.kind == 'ev' ? 'Electrolinera' : 'Gasolinera'),
              FlowBadge(icon: Symbols.schedule_rounded, label: station.open),
              FlowBadge(icon: Symbols.near_me_rounded, label: station.dist),
            ],
          ),
          FlowCard(
            padding: FlowSpace.s4,
            child: Column(
              children: station.prices.map((p) => FlowDetailRow(label: p[0], value: p[1], mono: true)).toList(),
            ),
          ),
          Wrap(
            spacing: FlowSpace.s2,
            runSpacing: FlowSpace.s2,
            children: station.services.map((s) => FlowBadge(label: s)).toList(),
          ),
          FlowButton(
            label: 'Cómo llegar · ${station.eta}',
            variant: FlowButtonVariant.primary,
            size: FlowButtonSize.lg,
            icon: Symbols.navigation_rounded,
            fullWidth: true,
            onPressed: () {
              Navigator.of(context).pop();
              setState(() => _routing = true);
            },
          ),
        ],
      ),
    ).then((_) {
      if (!_routing) setState(() => _selectedStation = null);
    });
  }
  void _openProfile() {
    FlowBottomSheet.show(
      context: context,
      title: 'Mi perfil',
      builder: (_) => const FlowProfileMenu(
        name: 'Ricardo Morales',
        avatarName: 'Ricardo M.',
        role: 'Conductor · Flota Norte',
        badge: FlowBadge(tone: FlowBadgeTone.success, label: 'Verificado'),
        items: [
          FlowProfileMenuItem(icon: Symbols.credit_card_rounded, label: 'Mis tarjetas'),
          FlowProfileMenuItem(icon: Symbols.receipt_long_rounded, label: 'Estados de cuenta'),
          FlowProfileMenuItem(icon: Symbols.notifications_rounded, label: 'Notificaciones'),
          FlowProfileMenuItem(icon: Symbols.security_rounded, label: 'Seguridad'),
          FlowProfileMenuItem(icon: Symbols.help_rounded, label: 'Ayuda'),
        ],
      ),
    );
  }
}
// ─── Hero Section (gradient + blobs) ─────────────────────────────────
class _HeroSection extends StatefulWidget {
  final _HeroConfig config;
  final Widget child;
  const _HeroSection({required this.config, required this.child});
  @override
  State<_HeroSection> createState() => _HeroSectionState();
}
class _HeroSectionState extends State<_HeroSection> {
  _HeroConfig? _prev;
  _HeroConfig get config => widget.config;

  bool _stagger2 = false;
  bool _stagger3 = false;

  @override
  void didUpdateWidget(covariant _HeroSection old) {
    super.didUpdateWidget(old);
    if (old.config != widget.config) {
      _stagger2 = false;
      _stagger3 = false;
      Future.delayed(const Duration(milliseconds: 60), () {
        if (mounted) setState(() => _stagger2 = true);
      });
      Future.delayed(const Duration(milliseconds: 120), () {
        if (mounted) setState(() => _stagger3 = true);
      });
      _prev = old.config;
    }
  }

  @override
  void initState() {
    super.initState();
    _stagger2 = true;
    _stagger3 = true;
  }

  static const _springCurve = Cubic(0.12, 2.4, 0.3, 1);

  @override
  Widget build(BuildContext context) {
    final scheme = config.lightText ? _heroDarkScheme : _heroFuelScheme;
    return ClipRRect(
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 700),
        curve: _springCurve,
        color: config.bg,
        child: Stack(
          children: [
            Positioned.fill(
              bottom: -25,
              child: LayoutBuilder(
                builder: (context, constraints) {
                  final w = constraints.maxWidth;
                  final h = constraints.maxHeight;
                  return Stack(
                    children: [
                      AnimatedPositioned(
                        duration: const Duration(milliseconds: 700),
                        curve: _springCurve,
                        left: w * config.x1, top: h * config.y1,
                        child: _Blob(color: config.blob1, size: config.s1),
                      ),
                      AnimatedPositioned(
                        duration: const Duration(milliseconds: 800),
                        curve: _springCurve,
                        left: w * (_stagger2 ? config.x2 : (_prev?.x2 ?? config.x2)),
                        top: h * (_stagger2 ? config.y2 : (_prev?.y2 ?? config.y2)),
                        child: _Blob(color: _stagger2 ? config.blob2 : (_prev?.blob2 ?? config.blob2), size: _stagger2 ? config.s2 : (_prev?.s2 ?? config.s2)),
                      ),
                      AnimatedPositioned(
                        duration: const Duration(milliseconds: 900),
                        curve: _springCurve,
                        left: w * (_stagger3 ? config.x3 : (_prev?.x3 ?? config.x3)),
                        top: h * (_stagger3 ? config.y3 : (_prev?.y3 ?? config.y3)),
                        child: _Blob(color: _stagger3 ? config.blob3 : (_prev?.blob3 ?? config.blob3), size: _stagger3 ? config.s3 : (_prev?.s3 ?? config.s3)),
                      ),
                    ],
                  );
                },
              ),
            ),
            FlowTheme(
              scheme: scheme,
              child: widget.child,
            ),
          ],
        ),
      ),
    );
  }
}
class _Blob extends StatelessWidget {
  final Color color;
  final double size;
  const _Blob({required this.color, required this.size});
  @override
  Widget build(BuildContext context) {
    return ImageFiltered(
      imageFilter: ui.ImageFilter.blur(sigmaX: 30, sigmaY: 30),
      child: Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: color,
        ),
      ),
    );
  }
}
// ─── Add Card Button ──────────────────────────────────────────────────
class _AddCardButton extends StatelessWidget {
  final bool lightText;
  const _AddCardButton({required this.lightText});
  @override
  Widget build(BuildContext context) {
    final fg = lightText ? Colors.white : FlowColors.grey900;
    return CustomPaint(
      painter: _DashedBorderPainter(
        color: fg.withValues(alpha: 0.3),
        radius: FlowRadius.xl,
        strokeWidth: 2,
        dashLength: 8,
        gapLength: 6,
      ),
      child: Container(
        width: double.infinity,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(FlowRadius.xl),
          color: fg.withValues(alpha: 0.06),
        ),
        child: AspectRatio(
          aspectRatio: 1.82,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Symbols.add_rounded, size: 32, color: fg.withValues(alpha: 0.5)),
              const SizedBox(height: FlowSpace.s2),
              Text(
                'Agregar tarjeta',
                style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: fg.withValues(alpha: 0.5)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
class _DashedBorderPainter extends CustomPainter {
  final Color color;
  final double radius;
  final double strokeWidth;
  final double dashLength;
  final double gapLength;
  const _DashedBorderPainter({required this.color, required this.radius, required this.strokeWidth, required this.dashLength, required this.gapLength});
  @override
  void paint(Canvas canvas, Size size) {
    final p = Paint()..color = color..style = PaintingStyle.stroke..strokeWidth = strokeWidth;
    final rrect = RRect.fromRectAndRadius(Rect.fromLTWH(0, 0, size.width, size.height), Radius.circular(radius));
    final dashes = <double>[dashLength, gapLength];
    _drawDashedRRect(canvas, rrect, p, dashes);
  }

  void _drawDashedRRect(Canvas canvas, RRect rrect, Paint paint, List<double> dashes) {
    final rect = rrect.outerRect;
    final r = rrect.tlRadiusX;
    final w = rect.width;
    final h = rect.height;
    final perimeter = 2 * (w + h - 4 * r) + 2 * pi * r;
    int dashIdx = 0;
    final segments = <Offset>[];
    double t = 0;
    while (t < perimeter) {
      final seg = dashes[dashIdx % 2];
      if (dashIdx % 2 == 0) {
        segments.add(Offset(t, (t + seg).clamp(0, perimeter)));
      }
      t += seg;
      dashIdx++;
    }
    for (final seg in segments) {
      final start = _pointOnRRect(rrect, seg.dx / perimeter);
      final end = _pointOnRRect(rrect, seg.dy / perimeter);
      canvas.drawLine(start, end, paint);
    }
  }

  Offset _pointOnRRect(RRect rrect, double t) {
    final rect = rrect.outerRect;
    final r = rrect.tlRadiusX;
    final straight = rect.width - 2 * r;
    final straightV = rect.height - 2 * r;
    final arc = pi * r / 2;
    final perimeter = 2 * straight + 2 * straightV + 4 * arc;
    final d = t * perimeter;
    double pos = 0;
    // Top edge
    if (d < straight) return Offset(rect.left + r + d, rect.top);
    pos += straight;
    // Top-right arc
    if (d < pos + arc) {
      final a = (d - pos) / arc * pi / 2;
      return Offset(rect.right - r + r * sin(a), rect.top + r - r * cos(a));
    }
    pos += arc;
    // Right edge
    if (d < pos + straightV) return Offset(rect.right, rect.top + r + (d - pos));
    pos += straightV;
    // Bottom-right arc
    if (d < pos + arc) {
      final a = (d - pos) / arc * pi / 2;
      return Offset(rect.right - r + r * cos(a), rect.bottom - r + r * sin(a));
    }
    pos += arc;
    // Bottom edge
    if (d < pos + straight) return Offset(rect.right - r - (d - pos), rect.bottom);
    pos += straight;
    // Bottom-left arc
    if (d < pos + arc) {
      final a = (d - pos) / arc * pi / 2;
      return Offset(rect.left + r - r * sin(a), rect.bottom - r + r * cos(a));
    }
    pos += arc;
    // Left edge
    if (d < pos + straightV) return Offset(rect.left, rect.bottom - r - (d - pos));
    pos += straightV;
    // Top-left arc
    final a = (d - pos) / arc * pi / 2;
    return Offset(rect.left + r - r * cos(a), rect.top + r - r * sin(a));
  }
  @override
  bool shouldRepaint(covariant _DashedBorderPainter old) => color != old.color || radius != old.radius;
}
// ─── Station List Item ─────────────────────────────────────────────────
class _StationListItem extends StatelessWidget {
  final _Station station;
  final FlowScheme scheme;
  final VoidCallback onTap;
  const _StationListItem({required this.station, required this.scheme, required this.onTap});
  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: FlowSpace.s4, vertical: FlowSpace.s3),
          child: Row(
            children: [
              Container(
                width: 40, height: 40,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: station.kind == 'ev' ? FlowColors.green50 : FlowColors.orange50,
                ),
                child: Icon(station.icon, size: 20, color: station.kind == 'ev' ? FlowColors.green600 : FlowColors.orange600),
              ),
              const SizedBox(width: FlowSpace.s3),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(station.name, style: TextStyle(fontSize: FlowFontSize.bodyMd, fontWeight: FontWeight.w500, color: scheme.textPrimary)),
                    Text('${station.dist} · ${station.eta}', style: TextStyle(fontSize: FlowFontSize.bodySm, color: scheme.textMuted)),
                  ],
                ),
              ),
              Text(station.prices[0][1], style: TextStyle(fontFamily: FlowFontFamily.mono, fontSize: 14, fontWeight: FontWeight.w600, color: scheme.textAccent)),
            ],
          ),
        ),
      ),
    );
  }
}
// ─── Data classes ──────────────────────────────────────────────────────
class _CardData {
  final String holder, last4, label, expires, key, balance;
  final FlowPaymentCardVariant variant;
  final IconData icon;
  const _CardData({required this.holder, required this.last4, required this.variant, required this.label, required this.icon, required this.expires, required this.key, required this.balance});
}
class _Benefit {
  final IconData icon;
  final String title, desc, product;
  const _Benefit({required this.icon, required this.title, required this.desc, required this.product});
}
class _TxData {
  final TransactionCategory category;
  final String title, subtitle, card, day;
  final double amount;
  final bool pending;
  const _TxData({required this.category, required this.title, required this.subtitle, required this.amount, required this.card, required this.day, this.pending = false});
}
class _TxGroup {
  final String label;
  final List<_TxData> items;
  _TxGroup(this.label, this.items);
}
class _ProductColor {
  final Color gradientStart, gradientEnd, accent, soft;
  const _ProductColor(this.gradientStart, this.gradientEnd, this.accent, this.soft);
}
class _HeroConfig {
  final Color bg, blob1, blob2, blob3;
  final bool lightText;
  final double x1, y1, s1, x2, y2, s2, x3, y3, s3;
  const _HeroConfig(this.bg, this.blob1, this.blob2, this.blob3, this.lightText, {
    required this.x1, required this.y1, required this.s1,
    required this.x2, required this.y2, required this.s2,
    required this.x3, required this.y3, required this.s3,
  });
}
class _Station {
  final String id, kind, priceLabel, name, dist, eta, open;
  final double lat, lon;
  final IconData icon;
  final List<List<String>> prices;
  final List<String> services;
  const _Station({
    required this.id, required this.kind, required this.lat, required this.lon,
    required this.priceLabel, required this.icon, required this.name,
    required this.dist, required this.eta, required this.prices,
    required this.services, required this.open,
  });
}
List<_TxGroup> _groupByDay(List<_TxData> txs) {
  final groups = <_TxGroup>[];
  for (final tx in txs) {
    if (groups.isNotEmpty && groups.last.label == tx.day) {
      groups.last.items.add(tx);
    } else {
      groups.add(_TxGroup(tx.day, [tx]));
    }
  }
  return groups;
}
