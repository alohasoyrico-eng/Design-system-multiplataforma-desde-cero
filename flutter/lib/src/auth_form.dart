import 'package:flutter/material.dart';
import 'flow_tokens.dart';
import 'flow_theme.dart';

enum FlowAuthMode { login, signup, recover }

class FlowAuthSubmitData {
  final String email;
  final String password;
  final String name;
  final FlowAuthMode mode;

  const FlowAuthSubmitData({
    required this.email,
    required this.password,
    required this.name,
    required this.mode,
  });
}

class FlowAuthForm extends StatefulWidget {
  final FlowAuthMode mode;
  final bool loading;
  final void Function(FlowAuthSubmitData data) onSubmit;
  final Widget? title;
  final Widget? subtitle;
  final Widget? footer;
  final String? submitLabel;

  const FlowAuthForm({
    super.key,
    required this.mode,
    this.loading = false,
    required this.onSubmit,
    this.title,
    this.subtitle,
    this.footer,
    this.submitLabel,
  });

  @override
  State<FlowAuthForm> createState() => _FlowAuthFormState();
}

class _FlowAuthFormState extends State<FlowAuthForm> {
  final _emailCtrl = TextEditingController();
  final _passCtrl = TextEditingController();
  final _nameCtrl = TextEditingController();

  @override
  void dispose() {
    _emailCtrl.dispose();
    _passCtrl.dispose();
    _nameCtrl.dispose();
    super.dispose();
  }

  void _submit() {
    widget.onSubmit(FlowAuthSubmitData(
      email: _emailCtrl.text,
      password: _passCtrl.text,
      name: _nameCtrl.text,
      mode: widget.mode,
    ));
  }

  @override
  Widget build(BuildContext context) {
    final scheme = FlowTheme.maybeOf(context) ?? FlowScheme.light;
    final label = widget.submitLabel ??
        switch (widget.mode) {
          FlowAuthMode.login => 'Log in',
          FlowAuthMode.signup => 'Sign up',
          FlowAuthMode.recover => 'Send reset link',
        };

    return Container(
      constraints: const BoxConstraints(maxWidth: 400),
      padding: const EdgeInsets.all(FlowSpace.s6),
      decoration: BoxDecoration(
        color: scheme.surfaceCard,
        borderRadius: BorderRadius.circular(FlowRadius.xl),
        boxShadow: FlowShadow.raised,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          if (widget.title != null) widget.title!,
          if (widget.subtitle != null)
            Padding(
              padding: const EdgeInsets.only(top: FlowSpace.s2),
              child: widget.subtitle!,
            ),
          const SizedBox(height: FlowSpace.s6),
          if (widget.mode == FlowAuthMode.signup)
            _field('Name', _nameCtrl, scheme),
          _field('Email', _emailCtrl, scheme,
              type: TextInputType.emailAddress),
          if (widget.mode != FlowAuthMode.recover)
            _field('Password', _passCtrl, scheme, obscure: true),
          const SizedBox(height: FlowSpace.s4),
          GestureDetector(
            onTap: widget.loading ? null : _submit,
            child: Container(
              height: 44,
              decoration: BoxDecoration(
                color: scheme.actionAccent,
                borderRadius: BorderRadius.circular(FlowRadius.pill),
              ),
              child: Center(
                child: widget.loading
                    ? SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: scheme.textOnAccent,
                        ),
                      )
                    : Text(
                        label,
                        style: TextStyle(
                          fontSize: FlowFontSize.bodyMd,
                          fontWeight: FontWeight.w600,
                          color: scheme.textOnAccent,
                        ),
                      ),
              ),
            ),
          ),
          if (widget.footer != null)
            Padding(
              padding: const EdgeInsets.only(top: FlowSpace.s4),
              child: widget.footer!,
            ),
        ],
      ),
    );
  }

  Widget _field(
    String label,
    TextEditingController controller,
    FlowScheme scheme, {
    TextInputType type = TextInputType.text,
    bool obscure = false,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: FlowSpace.s3),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: FlowFontSize.bodySm,
              fontWeight: FontWeight.w600,
              color: scheme.textSecondary,
            ),
          ),
          const SizedBox(height: FlowSpace.s1),
          TextField(
            controller: controller,
            keyboardType: type,
            obscureText: obscure,
            style: TextStyle(
              fontSize: FlowFontSize.bodyMd,
              color: scheme.textPrimary,
            ),
            decoration: InputDecoration(
              filled: true,
              fillColor: scheme.surfaceSunken,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(FlowRadius.md),
                borderSide: BorderSide(color: scheme.borderDefault),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(FlowRadius.md),
                borderSide: BorderSide(color: scheme.borderDefault),
              ),
              isDense: true,
              contentPadding: const EdgeInsets.symmetric(
                horizontal: FlowSpace.s3,
                vertical: FlowSpace.s3,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
