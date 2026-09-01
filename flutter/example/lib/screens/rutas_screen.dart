
import 'package:flutter/material.dart';
import 'package:material_symbols_icons/symbols.dart';
import 'package:flow_ds/flow_ds.dart';
import 'package:latlong2/latlong.dart';
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
class RutasScreen extends StatefulWidget {
  const RutasScreen({super.key});
  @override
  State<RutasScreen> createState() => _RutasScreenState();
}
class _RutasScreenState extends State<RutasScreen> {
  String _filter = 'todas';
  String? _selected;
  bool _routing = false;
  _Station? get _station => _stations.where((s) => s.id == _selected).firstOrNull;
  List<_Station> get _visible => _stations.where((s) => _filter == 'todas' || s.kind == _filter).toList();
  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.of(context);
    final station = _station;
    return Scaffold(
      backgroundColor: scheme.surfaceCanvas,
      body: Stack(
        children: [
          FlowMapCanvas(
            centerLat: 19.4310,
            centerLon: -99.1530,
            zoom: 14,
            pins: _visible.map((s) => FlowMapPin(
              id: s.id,
              lat: s.lat,
              lon: s.lon,
              label: s.priceLabel,
              color: s.id == _selected ? scheme.actionAccent : null,
            )).toList(),
            selectedPin: _selected,
            onPinTap: (id) => setState(() { _selected = id; _routing = false; }),
            route: _routing && _selected != null ? _routes[_selected] : null,
          ),
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.only(top: FlowSpace.s2),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: FlowSpace.s4),
                    child: Row(
                      children: [
                        FlowIconButton(
                          icon: Symbols.arrow_back_rounded,
                          ariaLabel: 'Atrás',
                          variant: FlowIconButtonVariant.tonal,
                          size: FlowIconButtonSize.sm,
                          onPressed: () => Navigator.of(context).pop(),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: FlowSpace.s2),
                  FlowFilterBar(
                    children: [
                      const SizedBox(width: FlowSpace.s4),
                      FlowChip(label: 'Todas', selected: _filter == 'todas', onTap: () => _setFilter('todas')),
                      FlowChip(label: 'Gasolina', icon: Symbols.local_gas_station_rounded, selected: _filter == 'gas', onTap: () => _setFilter('gas')),
                      FlowChip(label: 'Eléctrico', icon: Symbols.bolt_rounded, selected: _filter == 'ev', onTap: () => _setFilter('ev')),
                      const Spacer(),
                      FlowIconButton(icon: Symbols.my_location_rounded, ariaLabel: 'Mi ubicación', variant: FlowIconButtonVariant.tonal, size: FlowIconButtonSize.sm, onPressed: () {}),
                      const SizedBox(width: FlowSpace.s4),
                    ],
                  ),
                ],
              ),
            ),
          ),
          if (_routing && station != null)
            Positioned(
              left: FlowSpace.s4,
              right: FlowSpace.s4,
              bottom: MediaQuery.of(context).padding.bottom + FlowSpace.s4,
              child: FlowRouteBanner(
                title: 'Hacia ${station.name}',
                subtitle: '${station.dist} · llegas en ${station.eta}',
                onClose: () => setState(() => _routing = false),
              ),
            ),
          if (_selected == null && !_routing)
            Positioned(
              left: 0,
              right: 0,
              bottom: 0,
              child: FlowPeekSheet(
                title: '${_visible.length} estaciones cerca',
                children: _visible.take(3).map((s) => _StationListItem(
                  station: s,
                  onTap: () => setState(() { _selected = s.id; _routing = false; }),
                )).toList(),
              ),
            ),
        ],
      ),
      bottomSheet: station != null && !_routing
          ? FlowBottomSheet(
              title: station.name,
              onClose: () => setState(() => _selected = null),
              child: FlowSheetBody(
                children: [
                  Row(
                    children: [
                      FlowBadge(
                        tone: station.kind == 'ev' ? FlowBadgeTone.success : FlowBadgeTone.warning,
                        icon: station.icon,
                        label: station.kind == 'ev' ? 'Electrolinera' : 'Gasolinera',
                      ),
                      const SizedBox(width: FlowSpace.s2),
                      FlowBadge(icon: Symbols.schedule_rounded, label: station.open),
                      const SizedBox(width: FlowSpace.s2),
                      FlowBadge(icon: Symbols.near_me_rounded, label: station.dist),
                    ],
                  ),
                  const SizedBox(height: FlowSpace.s4),
                  FlowCard(
                    padding: FlowSpace.s4,
                    child: Column(
                      children: station.prices.map((p) => FlowDetailRow(label: p[0], value: p[1], mono: true)).toList(),
                    ),
                  ),
                  const SizedBox(height: FlowSpace.s3),
                  Wrap(
                    spacing: FlowSpace.s2,
                    runSpacing: FlowSpace.s2,
                    children: station.services.map((s) => FlowBadge(label: s)).toList(),
                  ),
                  const SizedBox(height: FlowSpace.s4),
                  FlowButton(
                    label: 'Cómo llegar · ${station.eta}',
                    variant: FlowButtonVariant.primary,
                    size: FlowButtonSize.lg,
                    icon: Symbols.navigation_rounded,
                    fullWidth: true,
                    onPressed: () => setState(() => _routing = true),
                  ),
                ],
              ),
            )
          : null,
    );
  }
  void _setFilter(String value) {
    setState(() {
      _filter = value;
      final station = _station;
      if (station != null && value != 'todas' && station.kind != value) {
        _selected = null;
        _routing = false;
      }
    });
  }
}
class _StationListItem extends StatelessWidget {
  final _Station station;
  final VoidCallback onTap;
  const _StationListItem({required this.station, required this.onTap});
  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.of(context);
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: FlowSpace.s4, vertical: FlowSpace.s3),
          child: Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: station.kind == 'ev' ? FlowColors.green50 : FlowColors.orange50,
                  borderRadius: BorderRadius.circular(FlowRadius.sm),
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
              Text(station.prices[0][1], style: TextStyle(fontSize: FlowFontSize.bodyMd, fontWeight: FontWeight.w600, color: scheme.textPrimary, fontFeatures: const [FontFeature.tabularFigures()])),
            ],
          ),
        ),
      ),
    );
  }
}
class _Station {
  final String id, kind, priceLabel, name, dist, eta, open;
  final double lat, lon;
  final IconData icon;
  final List<List<String>> prices;
  final List<String> services;
  const _Station({
    required this.id,
    required this.kind,
    required this.lat,
    required this.lon,
    required this.priceLabel,
    required this.icon,
    required this.name,
    required this.dist,
    required this.eta,
    required this.prices,
    required this.services,
    required this.open,
  });
}
