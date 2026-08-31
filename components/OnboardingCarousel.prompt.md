Carrusel de bienvenida a pantalla completa: ilustración, título, descripción, puntos de paginación (swipe en móvil) y CTA que cambia a `doneLabel` en la última diapositiva. Sin `illustration` propia, cae a un círculo geométrico de marca (icono + color por índice) — pasa una imagen/ilustración real cuando exista arte final.

```jsx
<OnboardingCarousel
  index={i} onIndexChange={setI} onSkip={skip} onDone={enter}
  slides={[
    {icon:'bolt', title:'Gana con cada viaje', description:'Tarifas dinámicas y bonos por demanda.'},
    {icon:'shield', title:'Viaja protegido', description:'Seguro incluido en cada viaje activo.'},
  ]}
/>
```

Máximo 3-4 diapositivas — más y se abandona. "Omitir" desaparece en la última; ahí solo queda el CTA de entrar.
