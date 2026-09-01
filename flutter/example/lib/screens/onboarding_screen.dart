
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:material_symbols_icons/symbols.dart';
import 'package:flow_ds/flow_ds.dart';
const _slides = [
  FlowOnboardingSlide(icon: Symbols.local_gas_station_rounded, title: 'Controla cada litro', description: 'Monitorea cargas, rutas y consumos desde tu teléfono. Nada se escapa.'),
  FlowOnboardingSlide(icon: Symbols.credit_card_rounded, title: 'Paga sin efectivo', description: 'Una tarjeta inteligente para gasolina, casetas y servicios. Sin vales, sin recibos.'),
  FlowOnboardingSlide(icon: Symbols.route_rounded, title: 'Rutas más baratas', description: 'Te mostramos la estación con el mejor precio en tu camino. Ahorra en cada viaje.'),
  FlowOnboardingSlide(icon: Symbols.notifications_active_rounded, title: 'Todo en tiempo real', description: 'Alertas de cada cargo, límites por conductor y reportes automáticos para tu flota.'),
];
enum _Step { carousel, welcome, email, emailCode, phone, smsCode, card, passcode, notif, bio, done }
class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});
  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}
class _OnboardingScreenState extends State<OnboardingScreen> {
  _Step _step = _Step.carousel;
  String _email = '';
  String _phone = '';
  String _cardNum = '';
  String _code1 = '';
  String _code2 = '';
  String _pin = '';
  String _pin2 = '';
  bool _confirmPin = false;
  bool _pinErr = false;
  bool _notif = true;
  BiometricState _bioState = BiometricState.idle;
  String? _emailError;
  String? _phoneError;
  String? _cardError;
  void _next() {
    const vals = _Step.values;
    final idx = vals.indexOf(_step);
    if (idx < vals.length - 1) setState(() => _step = vals[idx + 1]);
  }
  void _back() {
    const vals = _Step.values;
    final idx = vals.indexOf(_step);
    if (idx > 0) setState(() => _step = vals[idx - 1]);
  }
  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.of(context);
    return Scaffold(
      backgroundColor: scheme.surfaceCanvas,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: FlowSpace.s5),
          child: _buildStep(scheme),
        ),
      ),
    );
  }
  Widget _buildStep(FlowScheme scheme) {
    switch (_step) {
      case _Step.carousel:
        return FlowOnboardingCarousel(
          slides: _slides,
          onPageChanged: (_) {},
        );
      case _Step.welcome:
        return Column(
          children: [
            const Spacer(),
            Icon(Symbols.bolt_rounded, size: 64, color: scheme.actionAccent),
            const SizedBox(height: FlowSpace.s6),
            Text(
              'Todo tu día,\nen movimiento.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: FlowFontSize.titleLg, fontWeight: FontWeight.w700, color: scheme.textPrimary),
            ),
            const SizedBox(height: FlowSpace.s3),
            Text(
              'Activa tu tarjeta Flow en unos minutos. Solo necesitas tu correo, tu teléfono y tu tarjeta.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: FlowFontSize.bodyMd, color: scheme.textSecondary),
            ),
            const Spacer(),
            FlowButton(label: 'Comenzar', variant: FlowButtonVariant.primary, size: FlowButtonSize.lg, fullWidth: true, onPressed: _next),
            const SizedBox(height: FlowSpace.s4),
          ],
        );
      case _Step.email:
        return _formStep(
          stepNum: 1,
          title: 'Tu correo',
          subtitle: 'Te enviaremos un código de activación para confirmarlo.',
          child: Column(
            children: [
              FlowField(
                label: 'Correo',
                error: _emailError,
                child: FlowInput(
                  icon: Symbols.mail_rounded,
                  placeholder: 'diego@correo.mx',
                  value: _email,
                  error: _emailError != null,
                  onChange: (v) => setState(() { _email = v; _emailError = null; }),
                ),
              ),
              const Spacer(),
              FlowButton(label: 'Enviar código', variant: FlowButtonVariant.primary, size: FlowButtonSize.lg, fullWidth: true, onPressed: _validateEmail),
              const SizedBox(height: FlowSpace.s4),
            ],
          ),
        );
      case _Step.emailCode:
        return _formStep(
          stepNum: 2,
          title: 'Confirma tu correo',
          subtitle: 'Enviamos un código de 6 dígitos a $_email.',
          child: Column(
            children: [
              const SizedBox(height: FlowSpace.s8),
              FlowOTPInput(length: 6, value: _code1, onChange: (v) { setState(() => _code1 = v); if (v.length == 6) Future.delayed(const Duration(milliseconds: 300), _next); }),
              const SizedBox(height: FlowSpace.s4),
              const _ResendTimer(),
            ],
          ),
        );
      case _Step.phone:
        return _formStep(
          stepNum: 3,
          title: 'Tu teléfono',
          subtitle: 'Lo confirmamos con un SMS. Es tu segundo canal de seguridad.',
          child: Column(
            children: [
              FlowField(
                label: 'Teléfono móvil',
                error: _phoneError,
                child: FlowInput(
                  icon: Symbols.smartphone_rounded,
                  mono: true,
                  placeholder: '55 1234 5678',
                  value: _phone,
                  error: _phoneError != null,
                  onChange: (v) => setState(() { _phone = v; _phoneError = null; }),
                ),
              ),
              const Spacer(),
              FlowButton(label: 'Enviar SMS', variant: FlowButtonVariant.primary, size: FlowButtonSize.lg, fullWidth: true, onPressed: _validatePhone),
              const SizedBox(height: FlowSpace.s4),
            ],
          ),
        );
      case _Step.smsCode:
        return _formStep(
          stepNum: 4,
          title: 'Código SMS',
          subtitle: 'Enviamos un OTP a $_phone.',
          child: Column(
            children: [
              const SizedBox(height: FlowSpace.s8),
              FlowOTPInput(length: 6, value: _code2, onChange: (v) { setState(() => _code2 = v); if (v.length == 6) Future.delayed(const Duration(milliseconds: 300), _next); }),
              const SizedBox(height: FlowSpace.s4),
              const _ResendTimer(),
            ],
          ),
        );
      case _Step.card:
        return _formStep(
          stepNum: 5,
          title: 'Tu tarjeta Flow',
          subtitle: 'Captura el número de 16 dígitos tal como aparece al frente.',
          child: Column(
            children: [
              FlowPaymentCard(
                holder: '',
                last4: _cardNum.replaceAll(' ', '').length >= 4
                    ? _cardNum.replaceAll(' ', '').substring(_cardNum.replaceAll(' ', '').length - 4)
                    : '••••',
                variant: FlowPaymentCardVariant.ink,
                label: 'Flota',
              ),
              const SizedBox(height: FlowSpace.s4),
              FlowField(
                label: 'Número de tarjeta',
                error: _cardError,
                child: FlowInput(
                  icon: Symbols.credit_card_rounded,
                  mono: true,
                  placeholder: '5231 0000 0000 0000',
                  value: _cardNum,
                  error: _cardError != null,
                  onChange: (v) {
                    final formatted = _formatCard(v);
                    setState(() { _cardNum = formatted; _cardError = null; });
                  },
                ),
              ),
              const Spacer(),
              FlowButton(label: 'Validar tarjeta', variant: FlowButtonVariant.primary, size: FlowButtonSize.lg, fullWidth: true, onPressed: _validateCard),
              const SizedBox(height: FlowSpace.s4),
            ],
          ),
        );
      case _Step.passcode:
        return _formStep(
          stepNum: 6,
          title: _confirmPin ? 'Repite tu passcode' : 'Crea tu passcode',
          subtitle: _confirmPin ? 'Una vez más para confirmarlo.' : '6 dígitos para entrar y autorizar pagos.',
          child: Center(
            child: FlowPasscodeKeypad(
              value: _confirmPin ? _pin2 : _pin,
              invalid: _pinErr,
              onChange: (v) {
                setState(() { _pinErr = false; _confirmPin ? _pin2 = v : _pin = v; });
              },
              onComplete: (v) {
                if (!_confirmPin) {
                  setState(() => _confirmPin = true);
                  return;
                }
                if (v == _pin) {
                  _next();
                } else {
                  setState(() => _pinErr = true);
                  Future.delayed(const Duration(milliseconds: 500), () {
                    if (mounted) setState(() { _pin2 = ''; _pinErr = false; });
                  });
                }
              },
            ),
          ),
        );
      case _Step.notif:
        return _formStep(
          stepNum: 7,
          title: 'Avisos que importan',
          subtitle: 'Te avisamos de cada cargo, depósito y alerta de seguridad.',
          child: Column(
            children: [
              FlowCard(
                child: Row(
                  children: [
                    Icon(Symbols.notifications_active_rounded, size: 22, color: scheme.textAccent),
                    const SizedBox(width: FlowSpace.s3),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Notificaciones push', style: TextStyle(fontSize: FlowFontSize.bodyMd, fontWeight: FontWeight.w500, color: scheme.textPrimary)),
                          Text('Cargos en tiempo real', style: TextStyle(fontSize: FlowFontSize.bodySm, color: scheme.textMuted)),
                        ],
                      ),
                    ),
                    FlowSwitch(checked: _notif, onChange: (v) => setState(() => _notif = v)),
                  ],
                ),
              ),
              const Spacer(),
              FlowButton(label: 'Continuar', variant: FlowButtonVariant.primary, size: FlowButtonSize.lg, fullWidth: true, onPressed: _next),
              const SizedBox(height: FlowSpace.s4),
            ],
          ),
        );
      case _Step.bio:
        return Center(
          child: FlowBiometricPrompt(
            method: BiometricMethod.face,
            state: _bioState,
            title: 'Activa Face ID',
            description: _bioState == BiometricState.success ? 'Listo. Entrarás sin teclear.' : 'Entra y autoriza pagos con tu cara.',
            onUse: () {
              setState(() => _bioState = BiometricState.scanning);
              Future.delayed(const Duration(milliseconds: 1200), () {
                if (mounted) setState(() => _bioState = BiometricState.success);
              });
              Future.delayed(const Duration(milliseconds: 2100), () {
                if (mounted) _next();
              });
            },
            onFallback: _next,
            fallbackLabel: 'Ahora no',
          ),
        );
      case _Step.done:
        return Center(
          child: FlowStatusView(
            tone: FlowStatusViewTone.success,
            icon: Symbols.check_circle_rounded,
            title: 'Tarjeta activada',
            description: 'Tu tarjeta •••• ${_cardNum.replaceAll(' ', '').length >= 4 ? _cardNum.replaceAll(' ', '').substring(_cardNum.replaceAll(' ', '').length - 4) : '4821'} está lista para usarse.',
            actionLabel: 'Ir al inicio',
            onAction: () => Navigator.of(context).pop(),
          ),
        );
    }
  }
  Widget _formStep({required int stepNum, required String title, String? subtitle, required Widget child}) {
    final scheme = FlowTheme.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: FlowSpace.s4),
        Row(
          children: [
            FlowIconButton(icon: Symbols.arrow_back_rounded, ariaLabel: 'Atrás', variant: FlowIconButtonVariant.tonal, size: FlowIconButtonSize.sm, onPressed: _back),
            const SizedBox(width: FlowSpace.s3),
            Expanded(
              child: ClipRRect(
                borderRadius: BorderRadius.circular(FlowRadius.pill),
                child: LinearProgressIndicator(
                  value: stepNum / 7,
                  backgroundColor: scheme.surfaceSunken,
                  valueColor: AlwaysStoppedAnimation(scheme.actionAccent),
                  minHeight: 4,
                ),
              ),
            ),
            const SizedBox(width: FlowSpace.s3),
            Text('$stepNum/7', style: TextStyle(fontSize: FlowFontSize.bodySm, color: scheme.textMuted)),
          ],
        ),
        const SizedBox(height: FlowSpace.s6),
        Text(title, style: TextStyle(fontSize: FlowFontSize.titleLg, fontWeight: FontWeight.w700, color: scheme.textPrimary)),
        if (subtitle != null) ...[
          const SizedBox(height: FlowSpace.s2),
          Text(subtitle, style: TextStyle(fontSize: FlowFontSize.bodyMd, color: scheme.textSecondary)),
        ],
        const SizedBox(height: FlowSpace.s6),
        Expanded(child: child),
      ],
    );
  }
  void _validateEmail() {
    final valid = RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$').hasMatch(_email);
    if (!valid) {
      setState(() => _emailError = 'Ingresa un correo válido');
    } else {
      setState(() => _emailError = null);
      Future.delayed(const Duration(milliseconds: 600), _next);
    }
  }
  void _validatePhone() {
    final digits = _phone.replaceAll(RegExp(r'\D'), '');
    if (digits.length < 10) {
      setState(() => _phoneError = 'El número debe tener al menos 10 dígitos');
    } else {
      setState(() => _phoneError = null);
      Future.delayed(const Duration(milliseconds: 600), _next);
    }
  }
  void _validateCard() {
    final digits = _cardNum.replaceAll(' ', '');
    if (digits.length < 16) {
      setState(() => _cardError = 'El número debe tener 16 dígitos');
    } else {
      setState(() => _cardError = null);
      Future.delayed(const Duration(milliseconds: 600), _next);
    }
  }
  String _formatCard(String v) {
    final digits = v.replaceAll(RegExp(r'\D'), '');
    final trimmed = digits.length > 16 ? digits.substring(0, 16) : digits;
    final buffer = StringBuffer();
    for (var i = 0; i < trimmed.length; i++) {
      if (i > 0 && i % 4 == 0) buffer.write(' ');
      buffer.write(trimmed[i]);
    }
    return buffer.toString();
  }
}
class _ResendTimer extends StatefulWidget {
  const _ResendTimer();
  @override
  State<_ResendTimer> createState() => _ResendTimerState();
}
class _ResendTimerState extends State<_ResendTimer> {
  int _left = 42;
  Timer? _timer;
  @override
  void initState() {
    super.initState();
    _startTimer();
  }
  void _startTimer() {
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (_left > 0) {
        setState(() => _left--);
      } else {
        _timer?.cancel();
      }
    });
  }
  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }
  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.of(context);
    if (_left > 0) {
      return Text(
        'Reenviar en 0:${_left.toString().padLeft(2, '0')}',
        style: TextStyle(fontSize: FlowFontSize.bodySm, color: scheme.textMuted),
      );
    }
    return GestureDetector(
      onTap: () => setState(() { _left = 42; _startTimer(); }),
      child: Text(
        'Reenviar código',
        style: TextStyle(fontSize: FlowFontSize.bodySm, fontWeight: FontWeight.w600, color: scheme.textAccent),
      ),
    );
  }
}
