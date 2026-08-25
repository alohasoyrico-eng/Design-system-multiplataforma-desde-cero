
import 'package:flutter/material.dart';
import 'package:material_symbols_icons/symbols.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';
class FlowMapPin {
  final String id;
  final double lat;
  final double lon;
  final String? label;
  final Color? color;
  const FlowMapPin({
    required this.id,
    required this.lat,
    required this.lon,
    this.label,
    this.color,
  });
}
class FlowMapCanvas extends StatefulWidget {
  final double centerLat;
  final double centerLon;
  final double zoom;
  final List<FlowMapPin> pins;
  final String? selectedPin;
  final ValueChanged<String>? onPinTap;
  final List<LatLng>? route;
  const FlowMapCanvas({
    super.key,
    required this.centerLat,
    required this.centerLon,
    this.zoom = 14,
    this.pins = const [],
    this.selectedPin,
    this.onPinTap,
    this.route,
  });
  @override
  State<FlowMapCanvas> createState() => _FlowMapCanvasState();
}
class _FlowMapCanvasState extends State<FlowMapCanvas> {
  final _controller = MapController();
  @override
  void didUpdateWidget(FlowMapCanvas oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.centerLat != widget.centerLat ||
        oldWidget.centerLon != widget.centerLon ||
        oldWidget.zoom != widget.zoom) {
      _controller.move(
        LatLng(widget.centerLat, widget.centerLon),
        widget.zoom,
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
    return FlutterMap(
      mapController: _controller,
      options: MapOptions(
        initialCenter: LatLng(widget.centerLat, widget.centerLon),
        initialZoom: widget.zoom,
      ),
      children: [
        TileLayer(
          urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          userAgentPackageName: 'com.flow.ds',
        ),
        if (widget.route != null && widget.route!.isNotEmpty)
          PolylineLayer(
            polylines: [
              Polyline(
                points: widget.route!,
                color: scheme.actionAccent,
                strokeWidth: 4,
              ),
            ],
          ),
        MarkerLayer(
          markers: widget.pins.map((pin) {
            final isSelected = pin.id == widget.selectedPin;
            final color = isSelected
                ? scheme.actionAccent
                : (pin.color ?? scheme.textSecondary);
            return Marker(
              point: LatLng(pin.lat, pin.lon),
              width: pin.label != null ? 80 : 32,
              height: pin.label != null ? 48 : 32,
              child: GestureDetector(
                onTap: () => widget.onPinTap?.call(pin.id),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    if (pin.label != null)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: FlowSpace.s2, vertical: 2),
                        decoration: BoxDecoration(
                          color: color,
                          borderRadius: BorderRadius.circular(FlowRadius.xs),
                          boxShadow: FlowShadow.rest,
                        ),
                        child: Text(
                          pin.label!,
                          style: const TextStyle(
                            fontSize: FlowFontSize.labelSm,
                            fontWeight: FontWeight.w700,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    Icon(
                      Symbols.location_on_rounded,
                      size: isSelected ? 32 : 28,
                      color: color,
                      shadows: const [
                        Shadow(color: Colors.black26, blurRadius: 4, offset: Offset(0, 2)),
                      ],
                    ),
                  ],
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }
}
