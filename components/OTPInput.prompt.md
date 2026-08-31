Codigo OTP (SMS/correo). Un solo input logico — el autollenado de SMS funciona. `invalid` sacude y se limpia desde fuera.

```jsx
<OTPInput length={6} value={code} onChange={setCode} onComplete={verify} invalid={err} />
```
