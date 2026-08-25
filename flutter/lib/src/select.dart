import 'package:flutter/material.dart';
import 'package:material_symbols_icons/symbols.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowSelectOption {
  final String value;
  final String label;
  final IconData? icon;
  final String? group;

  const FlowSelectOption({
    required this.value,
    required this.label,
    this.icon,
    this.group,
  });
}

class FlowSelect extends StatefulWidget {
  final List<FlowSelectOption> options;
  final String? value;
  final ValueChanged<String?>? onChange;
  final String placeholder;
  final IconData? icon;
  final bool disabled;
  final bool invalid;
  final bool clearable;
  final bool searchable;

  const FlowSelect({
    super.key,
    required this.options,
    this.value,
    this.onChange,
    this.placeholder = 'Seleccionar...',
    this.icon,
    this.disabled = false,
    this.invalid = false,
    this.clearable = false,
    this.searchable = false,
  });

  @override
  State<FlowSelect> createState() => _FlowSelectState();
}

class _FlowSelectState extends State<FlowSelect> {
  bool _open = false;
  String _search = '';
  final _layerLink = LayerLink();
  OverlayEntry? _overlay;
  final _focusNode = FocusNode();

  FlowSelectOption? get _selected {
    if (widget.value == null) return null;
    return widget.options.cast<FlowSelectOption?>().firstWhere(
      (o) => o!.value == widget.value,
      orElse: () => null,
    );
  }

  List<FlowSelectOption> get _filtered {
    if (_search.isEmpty) return widget.options;
    final q = _search.toLowerCase();
    return widget.options
        .where((o) => o.label.toLowerCase().contains(q))
        .toList();
  }

  void _toggle() {
    if (_open) {
      _close();
    } else {
      _openDropdown();
    }
  }

  void _openDropdown() {
    setState(() {
      _open = true;
      _search = '';
    });
    _overlay = OverlayEntry(builder: (_) => _buildOverlay());
    Overlay.of(context).insert(_overlay!);
  }

  void _close() {
    _overlay?.remove();
    _overlay = null;
    setState(() => _open = false);
  }

  void _selectOption(FlowSelectOption option) {
    widget.onChange?.call(option.value);
    _close();
  }

  @override
  void dispose() {
    _close();
    _focusNode.dispose();
    super.dispose();
  }

  Widget _buildOverlay() {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    return Stack(
      children: [
        GestureDetector(onTap: _close, child: Container(color: Colors.transparent)),
        CompositedTransformFollower(
          link: _layerLink,
          targetAnchor: Alignment.bottomLeft,
          followerAnchor: Alignment.topLeft,
          offset: const Offset(0, 4),
          child: Material(
            elevation: 8,
            borderRadius: BorderRadius.circular(FlowRadius.md),
            color: scheme.surfaceCard,
            child: Container(
              constraints: const BoxConstraints(maxHeight: 240, maxWidth: 320),
              decoration: BoxDecoration(
                border: Border.all(color: scheme.borderSubtle),
                borderRadius: BorderRadius.circular(FlowRadius.md),
              ),
              child: StatefulBuilder(
                builder: (ctx, setDropdownState) {
                  final filtered = _filtered;
                  return Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      if (widget.searchable)
                        Padding(
                          padding: const EdgeInsets.all(FlowSpace.s2),
                          child: TextField(
                            autofocus: true,
                            style: TextStyle(
                              fontSize: FlowFontSize.bodyMd,
                              color: scheme.textPrimary,
                            ),
                            decoration: InputDecoration(
                              hintText: 'Buscar...',
                              hintStyle: TextStyle(color: scheme.textMuted),
                              isDense: true,
                              contentPadding: const EdgeInsets.symmetric(
                                horizontal: FlowSpace.s3,
                                vertical: FlowSpace.s2,
                              ),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(FlowRadius.sm),
                                borderSide: BorderSide(color: scheme.borderDefault),
                              ),
                            ),
                            onChanged: (v) {
                              _search = v;
                              setDropdownState(() {});
                            },
                          ),
                        ),
                      Flexible(
                        child: ListView.builder(
                          shrinkWrap: true,
                          padding: const EdgeInsets.symmetric(vertical: FlowSpace.s1),
                          itemCount: filtered.length,
                          itemBuilder: (ctx, i) {
                            final opt = filtered[i];
                            final selected = opt.value == widget.value;
                            return InkWell(
                              onTap: () => _selectOption(opt),
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: FlowSpace.s3,
                                  vertical: FlowSpace.s2,
                                ),
                                color: selected
                                    ? scheme.surfaceAccentSubtle
                                    : Colors.transparent,
                                child: Row(
                                  children: [
                                    if (opt.icon != null) ...[
                                      Icon(opt.icon, size: 18, color: scheme.textSecondary),
                                      const SizedBox(width: FlowSpace.s2),
                                    ],
                                    Expanded(
                                      child: Text(
                                        opt.label,
                                        style: TextStyle(
                                          fontSize: FlowFontSize.bodyMd,
                                          fontWeight: selected
                                              ? FontWeight.w600
                                              : FontWeight.w400,
                                          color: scheme.textPrimary,
                                        ),
                                      ),
                                    ),
                                    if (selected)
                                      Icon(Symbols.check_rounded,
                                          size: 18, color: scheme.actionAccent),
                                  ],
                                ),
                              ),
                            );
                          },
                        ),
                      ),
                    ],
                  );
                },
              ),
            ),
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    final sel = _selected;

    return CompositedTransformTarget(
      link: _layerLink,
      child: GestureDetector(
        onTap: widget.disabled ? null : _toggle,
        child: Opacity(
          opacity: widget.disabled ? 0.5 : 1.0,
          child: Container(
            height: 44,
            padding: const EdgeInsets.symmetric(horizontal: FlowSpace.s3),
            decoration: BoxDecoration(
              color: scheme.surfaceSunken,
              border: Border.all(
                color: widget.invalid
                    ? scheme.borderFocus
                    : (_open ? scheme.borderFocus : scheme.borderDefault),
                width: _open ? 2 : 1,
              ),
              borderRadius: BorderRadius.circular(FlowRadius.md),
            ),
            child: Row(
              children: [
                if (widget.icon != null) ...[
                  Icon(widget.icon, size: 18, color: scheme.textMuted),
                  const SizedBox(width: FlowSpace.s2),
                ],
                Expanded(
                  child: Text(
                    sel?.label ?? widget.placeholder,
                    style: TextStyle(
                      fontSize: FlowFontSize.bodyMd,
                      color: sel != null ? scheme.textPrimary : scheme.textMuted,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                if (widget.clearable && sel != null)
                  GestureDetector(
                    onTap: () {
                      widget.onChange?.call(null);
                    },
                    child: Icon(Symbols.close_rounded,
                        size: 18, color: scheme.textMuted),
                  ),
                Icon(
                  _open
                      ? Symbols.expand_less_rounded
                      : Symbols.expand_more_rounded,
                  size: 20,
                  color: scheme.textMuted,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
