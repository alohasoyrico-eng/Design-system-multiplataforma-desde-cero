Prompt biometrico con estados. El fallback a passcode es obligatorio por accesibilidad.

```jsx
<BiometricPrompt method="face" state={st} onUse={scan} onFallback={usePasscode} />
```
