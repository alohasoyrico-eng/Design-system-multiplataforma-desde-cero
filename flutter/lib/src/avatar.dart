import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

enum FlowAvatarSize { sm, md, lg, xl }
enum FlowAvatarStatus { online, busy, offline }

const _sizes = {
  FlowAvatarSize.sm: 28.0,
  FlowAvatarSize.md: 36.0,
  FlowAvatarSize.lg: 44.0,
  FlowAvatarSize.xl: 56.0,
};

const _fontSizes = {
  FlowAvatarSize.sm: 11.0,
  FlowAvatarSize.md: 13.0,
  FlowAvatarSize.lg: 18.0,
  FlowAvatarSize.xl: 18.0,
};

const _avatarColors = [
  Color(0xFFFF6A52),
  Color(0xFF2E7CF6),
  Color(0xFF12B76A),
  Color(0xFFE8930C),
  Color(0xFFD92D20),
  Color(0xFF6B6A6E),
];

class FlowAvatar extends StatelessWidget {
  final String name;
  final FlowAvatarSize size;
  final FlowAvatarStatus? status;
  final ImageProvider? image;

  const FlowAvatar({
    super.key,
    this.name = '',
    this.size = FlowAvatarSize.md,
    this.status,
    this.image,
  });

  String get _initials {
    final parts = name.trim().split(RegExp(r'\s+'));
    if (parts.isEmpty || parts[0].isEmpty) return '?';
    if (parts.length == 1) return parts[0][0].toUpperCase();
    return '${parts[0][0]}${parts.last[0]}'.toUpperCase();
  }

  int get _hash {
    var h = 0;
    for (var i = 0; i < name.length; i++) {
      h = ((h << 5) - h + name.codeUnitAt(i)) & 0x7FFFFFFF;
    }
    return h;
  }

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    final dim = _sizes[size]!;
    final fs = _fontSizes[size]!;
    final bg = _avatarColors[_hash % _avatarColors.length];
    final dotSize = dim < 32 ? 8.0 : 10.0;

    return SizedBox(
      width: dim,
      height: dim,
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          if (image != null)
            ClipOval(child: Image(image: image!, width: dim, height: dim, fit: BoxFit.cover))
          else
            Container(
              width: dim,
              height: dim,
              decoration: BoxDecoration(shape: BoxShape.circle, color: bg),
              alignment: Alignment.center,
              child: Text(
                _initials,
                style: TextStyle(
                  fontSize: fs,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                ),
              ),
            ),
          if (status != null)
            Positioned(
              right: -1,
              bottom: -1,
              child: Container(
                width: dotSize,
                height: dotSize,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: status == FlowAvatarStatus.online
                      ? FlowColors.green500
                      : status == FlowAvatarStatus.busy
                          ? FlowColors.danger500
                          : scheme.textMuted,
                  border: Border.all(color: scheme.surfaceCard, width: 2),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
