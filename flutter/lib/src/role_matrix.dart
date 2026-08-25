import 'package:flutter/material.dart';
import 'package:material_symbols_icons/symbols.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

class FlowRole {
  final String id;
  final String label;
  final bool locked;

  const FlowRole({required this.id, required this.label, this.locked = false});
}

class FlowPermission {
  final String id;
  final String label;
  final String? group;

  const FlowPermission({required this.id, required this.label, this.group});
}

typedef FlowRoleMatrixValues = Map<String, Map<String, bool>>;

class FlowRoleMatrix extends StatelessWidget {
  final List<FlowRole> roles;
  final List<FlowPermission> permissions;
  final FlowRoleMatrixValues values;
  final void Function(FlowRoleMatrixValues next, String permId, String roleId)?
      onChange;

  const FlowRoleMatrix({
    super.key,
    required this.roles,
    required this.permissions,
    required this.values,
    this.onChange,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;

    final grouped = <String, List<FlowPermission>>{};
    for (final p in permissions) {
      (grouped[p.group ?? ''] ??= []).add(p);
    }

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildHeader(scheme),
          for (final entry in grouped.entries) ...[
            if (entry.key.isNotEmpty)
              Container(
                width: 180.0 + roles.length * 100.0,
                padding: const EdgeInsets.fromLTRB(
                  FlowSpace.s4, FlowSpace.s3, FlowSpace.s4, FlowSpace.s1,
                ),
                color: scheme.surfaceSunken,
                child: Text(
                  entry.key.toUpperCase(),
                  style: TextStyle(
                    fontSize: FlowFontSize.labelSm,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 0.5,
                    color: scheme.textMuted,
                  ),
                ),
              ),
            for (final perm in entry.value)
              _buildRow(perm, scheme),
          ],
        ],
      ),
    );
  }

  Widget _buildHeader(FlowScheme scheme) {
    return Container(
      color: scheme.surfaceSunken,
      padding: const EdgeInsets.symmetric(
        horizontal: FlowSpace.s4,
        vertical: FlowSpace.s3,
      ),
      child: Row(
        children: [
          SizedBox(
            width: 160,
            child: Text(
              'Permission',
              style: TextStyle(
                fontSize: FlowFontSize.bodySm,
                fontWeight: FontWeight.w600,
                color: scheme.textSecondary,
              ),
            ),
          ),
          for (final role in roles)
            SizedBox(
              width: 100,
              child: Text(
                role.label,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: FlowFontSize.bodySm,
                  fontWeight: FontWeight.w600,
                  color: scheme.textSecondary,
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildRow(FlowPermission perm, FlowScheme scheme) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: FlowSpace.s4,
        vertical: FlowSpace.s2,
      ),
      decoration: BoxDecoration(
        border: Border(bottom: BorderSide(color: scheme.borderSubtle)),
      ),
      child: Row(
        children: [
          SizedBox(
            width: 160,
            child: Text(
              perm.label,
              style: TextStyle(
                fontSize: FlowFontSize.bodyMd,
                color: scheme.textPrimary,
              ),
            ),
          ),
          for (final role in roles)
            SizedBox(
              width: 100,
              child: Center(
                child: GestureDetector(
                  onTap: role.locked || onChange == null
                      ? null
                      : () {
                          final current =
                              values[perm.id]?[role.id] ?? false;
                          final next = Map<String, Map<String, bool>>.from(
                            values.map((k, v) => MapEntry(k, Map<String, bool>.from(v))),
                          );
                          (next[perm.id] ??= {})[role.id] = !current;
                          onChange!(next, perm.id, role.id);
                        },
                  child: Container(
                    width: 22,
                    height: 22,
                    decoration: BoxDecoration(
                      color: (values[perm.id]?[role.id] ?? false)
                          ? scheme.actionAccent
                          : Colors.transparent,
                      borderRadius: BorderRadius.circular(4),
                      border: Border.all(
                        color: (values[perm.id]?[role.id] ?? false)
                            ? scheme.actionAccent
                            : scheme.borderDefault,
                      ),
                    ),
                    child: (values[perm.id]?[role.id] ?? false)
                        ? Icon(Symbols.check_rounded, size: 14, color: scheme.textOnAccent)
                        : null,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
