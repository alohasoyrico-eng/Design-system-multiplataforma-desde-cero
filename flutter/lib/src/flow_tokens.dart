// Flow Design System · Flutter tokens — Edenred Foundation Core palette
import 'package:flutter/material.dart';

abstract final class FlowColors {
  // Grey (cool slate)
  static const grey50 = Color(0xFFF8FAFC);
  static const grey100 = Color(0xFFF1F5F9);
  static const grey200 = Color(0xFFE2E8F0);
  static const grey300 = Color(0xFFCBD5E1);
  static const grey400 = Color(0xFF94A3B8);
  static const grey500 = Color(0xFF64748B);
  static const grey600 = Color(0xFF475569);
  static const grey700 = Color(0xFF334155);
  static const grey800 = Color(0xFF1E293B);
  static const grey900 = Color(0xFF0F172A);

  // Red (Edenred brand #F72717)
  static const red50 = Color(0xFFFEEDEC);
  static const red100 = Color(0xFFFDBBBA);
  static const red200 = Color(0xFFFC7F7C);
  static const red500 = Color(0xFFF72717);
  static const red600 = Color(0xFFB61A0E);
  static const red700 = Color(0xFF780D06);
  static const red900 = Color(0xFF400402);

  // Blue (action accent #0060df)
  static const blue50 = Color(0xFFE0EEFF);
  static const blue100 = Color(0xFFC7DFFF);
  static const blue200 = Color(0xFF8ABCFF);
  static const blue300 = Color(0xFF529CFF);
  static const blue400 = Color(0xFF1A7CFF);
  static const blue500 = Color(0xFF0060DF);
  static const blue600 = Color(0xFF004DB3);
  static const blue700 = Color(0xFF003985);
  static const blue800 = Color(0xFF002557);
  static const blue900 = Color(0xFF00142E);

  // Green (success)
  static const green50 = Color(0xFFE1F4EB);
  static const green100 = Color(0xFFC3EFDA);
  static const green200 = Color(0xFF79E6B4);
  static const green300 = Color(0xFF2EE590);
  static const green400 = Color(0xFF0DBA69);
  static const green500 = Color(0xFF007840);
  static const green600 = Color(0xFF065B33);
  static const green700 = Color(0xFF084026);

  // Orange (warning)
  static const orange50 = Color(0xFFFDEAE3);
  static const orange100 = Color(0xFFFBD5C6);
  static const orange200 = Color(0xFFF6AB8E);
  static const orange300 = Color(0xFFF28155);
  static const orange400 = Color(0xFFED571C);
  static const orange500 = Color(0xFFBF410F);
  static const orange600 = Color(0xFF97330C);
  static const orange700 = Color(0xFF712709);

  // Danger (functional red, not brand)
  static const danger50 = Color(0xFFFFE3E0);
  static const danger200 = Color(0xFFFF8D85);
  static const danger300 = Color(0xFFFF5447);
  static const danger400 = Color(0xFFFF1B0A);
  static const danger500 = Color(0xFFCA0E00);
  static const danger600 = Color(0xFFA30B00);
  static const danger700 = Color(0xFF7A0800);
}

class FlowScheme {
  final Color surfaceCanvas,
      surfaceCard,
      surfaceSunken,
      surfaceInverse,
      surfaceAccentSubtle,
      textPrimary,
      textSecondary,
      textMuted,
      textOnAccent,
      textOnInverse,
      textAccent,
      textLink,
      borderSubtle,
      borderDefault,
      borderStrong,
      borderFocus,
      actionPrimary,
      actionPrimaryHover,
      actionAccent,
      actionAccentHover;
  const FlowScheme({
    required this.surfaceCanvas,
    required this.surfaceCard,
    required this.surfaceSunken,
    required this.surfaceInverse,
    required this.surfaceAccentSubtle,
    required this.textPrimary,
    required this.textSecondary,
    required this.textMuted,
    required this.textOnAccent,
    required this.textOnInverse,
    required this.textAccent,
    required this.textLink,
    required this.borderSubtle,
    required this.borderDefault,
    required this.borderStrong,
    required this.borderFocus,
    required this.actionPrimary,
    required this.actionPrimaryHover,
    required this.actionAccent,
    required this.actionAccentHover,
  });

  static const light = FlowScheme(
    surfaceCanvas: FlowColors.grey50,
    surfaceCard: Color(0xFFFFFFFF),
    surfaceSunken: FlowColors.grey100,
    surfaceInverse: FlowColors.grey900,
    surfaceAccentSubtle: FlowColors.blue50,
    textPrimary: FlowColors.grey900,
    textSecondary: FlowColors.grey600,
    textMuted: FlowColors.grey500,
    textOnAccent: Color(0xFFFFFFFF),
    textOnInverse: FlowColors.grey50,
    textAccent: FlowColors.blue600,
    textLink: FlowColors.blue500,
    borderSubtle: FlowColors.grey200,
    borderDefault: FlowColors.grey300,
    borderStrong: FlowColors.grey400,
    borderFocus: FlowColors.blue500,
    actionPrimary: FlowColors.grey900,
    actionPrimaryHover: Color(0xFF000000),
    actionAccent: FlowColors.blue500,
    actionAccentHover: FlowColors.blue600,
  );

  static const dark = FlowScheme(
    surfaceCanvas: Color(0xFF0C1222),
    surfaceCard: Color(0xFF131D30),
    surfaceSunken: Color(0xFF0A0F1D),
    surfaceInverse: FlowColors.grey50,
    surfaceAccentSubtle: Color(0x240060DF),
    textPrimary: FlowColors.grey100,
    textSecondary: FlowColors.grey400,
    textMuted: FlowColors.grey500,
    textOnAccent: Color(0xFFFFFFFF),
    textOnInverse: FlowColors.grey900,
    textAccent: FlowColors.blue300,
    textLink: FlowColors.blue300,
    borderSubtle: Color(0xFF1A2540),
    borderDefault: FlowColors.grey800,
    borderStrong: FlowColors.grey700,
    borderFocus: FlowColors.blue400,
    actionPrimary: FlowColors.grey100,
    actionPrimaryHover: Color(0xFFFFFFFF),
    actionAccent: FlowColors.blue400,
    actionAccentHover: FlowColors.blue300,
  );
}

abstract final class FlowFontSize {
  static const double displayLg = 48;
  static const double displayMd = 36;
  static const double headlineLg = 28;
  static const double titleLg = 20;
  static const double titleMd = 16;
  static const double bodyLg = 20;
  static const double bodyMd = 16;
  static const double bodyMdStrong = 16;
  static const double bodySm = 12;
  static const double labelSm = 11;
  static const double dataXs = 11;
  static const double dataSm = 12;
  static const double data = 13;
  static const double dataMd = 20;
  static const double dataLg = 26;
  static const double dataXl = 28;
}

abstract final class FlowSpace {
  static const double s1 = 4;
  static const double s2 = 8;
  static const double s3 = 12;
  static const double s4 = 16;
  static const double s5 = 20;
  static const double s6 = 24;
  static const double s7 = 28;
  static const double s8 = 32;
  static const double s10 = 40;
  static const double s12 = 48;
  static const double s16 = 64;
}

abstract final class FlowSize {
  static const double controlLg = 52;
  static const double bar = 56;
}

abstract final class FlowRadius {
  static const double xs = 8;
  static const double sm = 12;
  static const double md = 16;
  static const double lg = 20;
  static const double xl = 28;
  static const double pill = 999;
}

abstract final class FlowDuration {
  static const instant = Duration(milliseconds: 100);
  static const fast = Duration(milliseconds: 160);
  static const base = Duration(milliseconds: 240);
  static const slow = Duration(milliseconds: 400);
}

abstract final class FlowFontFamily {
  static const display = 'Edenred';
  static const body = 'Ubuntu';
  static const mono = 'IBM Plex Mono';
}

abstract final class FlowEasing {
  static const spring = Cubic(0.34, 1.56, 0.64, 1);
  static const out = Cubic(0.22, 1, 0.36, 1);
  static const inOut = Cubic(0.65, 0, 0.35, 1);
}

abstract final class FlowShadow {
  static const rest = [BoxShadow(color: Color(0x0A0F172A), blurRadius: 2, offset: Offset(0, 1))];
  static const raised = [
    BoxShadow(color: Color(0x0F0F172A), blurRadius: 12, offset: Offset(0, 4)),
    BoxShadow(color: Color(0x0A0F172A), blurRadius: 2, offset: Offset(0, 1)),
  ];
  static const float = [
    BoxShadow(color: Color(0x140F172A), blurRadius: 24, offset: Offset(0, 10)),
    BoxShadow(color: Color(0x0D0F172A), blurRadius: 6, offset: Offset(0, 2)),
  ];
  static const overlay = [
    BoxShadow(color: Color(0x290F172A), blurRadius: 64, offset: Offset(0, 24)),
    BoxShadow(color: Color(0x140F172A), blurRadius: 12, offset: Offset(0, 4)),
  ];
}
