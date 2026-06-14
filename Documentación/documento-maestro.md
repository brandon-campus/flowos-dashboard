# FlowOS — Documento Maestro del Proyecto

> Versión: 1.0
> Fecha: Junio 2025
> Autor: Brandon Candia
> Estado: Pre-desarrollo — Concepto validado, MVP por construir

---

## 1. El Problema

Los fundadores, freelancers y emprendedores que manejan múltiples proyectos simultáneos no tienen un problema de tareas — tienen un problema de contexto. Anotar lo que hay que hacer es fácil. Lo difícil es retomar un proyecto después de tres días sin tocarlo y saber exactamente en qué estabas, qué quedó bloqueado, cuál era el próximo paso y qué depende de quién.

El síntoma más concreto de este problema es lo que se conoce como "context switching loss": cada vez que cambiás de proyecto, perdés entre 15 y 30 minutos reconstruyendo mentalmente el estado de ese proyecto antes de poder hacer algo productivo. Si manejás 5 o 6 proyectos simultáneos, eso se traduce en horas de trabajo perdidas por semana — sin que el usuario lo note conscientemente.

Las soluciones existentes no resuelven esto. Notion es demasiado flexible: requiere que el usuario diseñe y mantenga su propio sistema, y si falla en eso (lo cual es inevitable bajo presión), se convierte en un archivo muerto. Trello organiza tareas pero no guarda el contexto conversacional ni el estado mental del proyecto. Todoist y similares son listas de tareas glorificadas sin noción de proyecto como unidad viva. El bloc de notas — que sigue siendo la herramienta favorita de muchos — es rápido pero completamente ciego al historial y al seguimiento.

El resultado es que la persona termina empezando cada día desde cero, re-pensando sus proyectos en lugar de avanzarlos. FlowOS existe para eliminar ese costo invisible.

---

## 2. La Solución

FlowOS es un sistema operativo personal para fundadores multi-proyecto: una web app que combina gestión de tareas ligera, notas de contexto por proyecto, y un resumen generado por IA que te dice exactamente en qué estabas cada vez que retomás un proyecto.

Capacidades principales:

- **Resumen de estado IA por proyecto:** al abrir cualquier proyecto, FlowOS genera automáticamente un resumen de lo que quedó pendiente, cuándo fue el último avance y cuál es el próximo paso lógico.
- **Daily briefing automático:** cada mañana, una vista consolidada de todos los proyectos activos con lo que tiene que pasar hoy, lo que está bloqueado y lo que puede esperar.
- **Captura rápida (Quick Capture):** atajo de teclado para agregar tareas o notas en menos de 3 segundos, sin abrir el proyecto. La IA las clasifica automáticamente.
- **Proyectos con contexto enriquecido:** cada proyecto tiene área, estado, contactos clave, historial de notas y tareas organizadas por prioridad.
- **Registro de tiempo liviano:** un click para registrar cuánto tiempo dedicás a cada proyecto por semana — sin timers complicados.

---

## 3. Usuario Objetivo

### Usuario primario

**El fundador multi-proyecto LATAM**

Perfil: emprendedor de 25–40 años, maneja simultáneamente 3 a 8 proyectos de distinta naturaleza (academia, clientes, redes sociales, proyectos personales, trabajo freelance). Trabaja desde su computadora, usa el celular para consultar pero ejecuta en desktop. Prueba herramientas de productividad constantemente pero las abandona porque le exigen demasiado mantenimiento. Su herramienta de facto es el bloc de notas o una lista de WhatsApp con mensajes a sí mismo. Tiene equipo chico (1–3 personas) pero la mayoría de la coordinación pasa por él.

Comportamiento actual: empieza el día escribiendo una lista de tareas desde cero, pierde el hilo de proyectos que no toca durante 2–3 días, y gasta energía mental reconstruyendo contexto en lugar de ejecutar. Le frustra no poder ver el estado real de todos sus proyectos en un solo lugar.

Dispositivo principal: laptop/desktop. Accede varias veces al día.

### Usuarios secundarios (fase 2+)

- **Freelancers con múltiples clientes:** misma dinámica de context switching, pero el "proyecto" es el cliente.
- **Coordinadores de equipos pequeños:** el problema de contexto se multiplica cuando hay que delegar y hacer seguimiento.
- **Estudiantes con proyectos paralelos:** tesis, emprendimiento, trabajo part-time — misma fragmentación.

---

## 4. Propuesta de Valor

> "FlowOS no te dice qué hacer. Te recuerda en qué estabas."

- **Cero costo de retoma:** abrís un proyecto y en 5 segundos sabés exactamente dónde lo dejaste — sin leer historial, sin buscar notas.
- **Tan rápido como el bloc de notas:** Quick Capture con atajo de teclado. Capturás en segundos, la IA organiza después.
- **Sin sistema que mantener:** no hay que diseñar tableros ni configurar nada. FlowOS aprende el contexto de tus proyectos mientras los usás.
- **Un solo lugar para todo lo que importa:** proyectos propios, clientes, redes sociales, trabajo, iglesia, familia — todo con la misma interfaz.
- **IA útil, no decorativa:** el resumen de estado no es un chatbot — es contexto concreto sobre tu proyecto específico.

---

## 5. Funcionalidades

### MVP — Fase 1

#### ⭐ Módulo de Proyectos

- Crear proyectos con nombre, área (laburo / cliente / personal / comunidad), color y estado (activo / pausado / cerrado)
- Agregar contactos clave a cada proyecto (nombre, rol, canal de contacto)
- Vista de lista de todos los proyectos con estado y última actividad

#### ⭐ Módulo de Tareas por Proyecto

- Agregar, editar y marcar tareas como completadas dentro de cada proyecto
- Prioridad simple: hoy / esta semana / algún día
- Notas cortas por tarea (opcional)

#### ⭐ Resumen de Estado IA

- Al abrir un proyecto, la IA genera un resumen de: tareas pendientes, última nota registrada, próximo paso sugerido
- Se regenera automáticamente cada vez que hay actividad nueva en el proyecto

#### ⭐ Daily Briefing

- Vista de inicio del día con todas las tareas marcadas como "hoy" en todos los proyectos
- Separación por área para visualizar la distribución del día
- Generado automáticamente al abrir la app en el día

#### ⭐ Quick Capture

- Atajo de teclado global (Cmd/Ctrl + Espacio o similar) para abrir input flotante
- La IA pregunta a qué proyecto asignarla o lo infiere por contexto
- Opción "sin proyecto" para inbox de captura pendiente de clasificar

#### ⭐ Notas de proyecto

- Bloque de texto libre por proyecto para contexto, decisiones, links, ideas
- Historial de las últimas 5 notas visible desde la vista del proyecto

### Fase 2

- **Registro de tiempo liviano:** click de inicio/fin para trackear cuánto dedicás a cada proyecto por semana. Gráfico semanal de distribución.
- **Integración con Google Calendar:** sincronización de eventos relevantes por proyecto para incluirlos en el daily briefing.
- **Notificaciones inteligentes:** recordatorios basados en inactividad prolongada en un proyecto activo.
- **Vista semanal de proyectos:** un kanban simplificado con el estado de todos los proyectos a lo largo de la semana.
- **Modo equipo (beta):** invitar colaboradores a un proyecto con acceso de lectura o edición.

### Fase 3

- **FlowOS para equipos:** workspace compartido con roles, permisos y vista de carga del equipo.
- **Integraciones externas:** Slack (notificaciones), Notion (importar proyectos), WhatsApp (enviar tareas por mensaje).
- **API pública:** para conectar FlowOS con otros productos vía n8n o Zapier.
- **Análisis de productividad:** patrones de uso, proyectos que más tiempo consumen, horas pico de trabajo.
- **Templates de proyecto:** plantillas prearmadas para proyectos comunes (lanzamiento de producto, campaña de contenido, cliente de desarrollo).

---

## 6. Roadmap de Desarrollo

| Etapa | Nombre | Entregable | Tiempo estimado |
|-------|--------|------------|-----------------|
| 1 | Idea & Validación | Concepto definido, PRD completo, primeros 3 usuarios beta identificados | ✅ Hecho |
| 2 | Arquitectura | Esquema de base de datos, flujo de usuario, decisiones técnicas clave | Semana 1 |
| 3 | Diseño UI | Pantallas principales en Lovable: dashboard, vista de proyecto, quick capture | Semana 1–2 |
| 4 | Base de datos | Supabase: tablas de proyectos, tareas, notas, usuarios. RLS configurado. | Semana 2 |
| 5 | Desarrollo MVP | Módulos de proyectos, tareas, notas y quick capture funcionando end-to-end | Semana 2–3 |
| 6 | Integración IA | Resumen de estado con Claude API. Daily briefing automático. | Semana 3 |
| 7 | Deploy | Vercel + dominio. Auth con Supabase. Beta privada con 5–10 usuarios. | Semana 3–4 |
| 8 | Adquisición | Lanzamiento público. Contenido TikTok/IG. Primer plan pago activo. | Mes 2 |

---

## 7. Modelo de Negocio

### Pricing

| Plan | Precio | Incluye |
|------|--------|---------|
| Free | $0 / siempre | Hasta 3 proyectos, tareas ilimitadas, sin resumen IA |
| Pro | $9 USD / mes | Proyectos ilimitados, resumen IA, daily briefing, quick capture avanzado |
| Team | $19 USD / mes | Todo lo de Pro + hasta 5 usuarios, proyectos compartidos, vista de equipo |

### Métodos de cobro

- **USD:** Lemon Squeezy o Stripe (suscripción mensual/anual)
- **ARS:** MercadoPago (precio en pesos equivalente, actualizable)
- Descuento del 20% en planes anuales

### Proyección de ingresos

| Etapa | Clientes pagos | MRR estimado |
|-------|----------------|--------------|
| Beta privada | 0 (free) | $0 |
| Lanzamiento (mes 2) | 10 | $90 USD |
| 3 meses | 50 | $450 USD |
| 6 meses | 150 | $1,350 USD |
| 12 meses | 400 | $3,600 USD |
| 24 meses | 1,000 | $9,000 USD |

*Proyección conservadora con 80% plan Pro ($9) y 20% plan Team ($19). No incluye ingresos por versión anual ni Team con más de 5 usuarios.*

---

## 8. Go-To-Market

### Fase 1 — Validación (semanas 1–4)

Usar el producto vos mismo durante todo el desarrollo. Brandon es el usuario beta #1 con sus 6+ proyectos activos (Academia Labora, Ditobanx, FJU, Club del Laburo, clientes de desarrollo, redes sociales). Identificar y onboardear 5–10 personas de confianza del entorno cercano (ex alumnos, emprendedores conocidos) para validar flujo y detectar fricciones antes del lanzamiento.

Métrica clave: ¿los beta testers abren la app más de una vez por día?

### Fase 2 — Primeros clientes (mes 2–3)

- Lanzar en lista de espera vía Instagram @labora.ar con contenido de "construí esto para resolver mi propio caos".
- Ofrecer 3 meses de Pro gratis a los primeros 20 usuarios que se registren (early adopters).
- Post en comunidades de emprendedores LATAM: Comunidad de Producto, Slack de fundadores, grupos de Discord de startups Argentina/LATAM.
- Demo pública en un YouTube live de Academia Labora mostrando el producto en uso real.

### Fase 3 — Digital y escala (mes 3+)

- **TikTok @labora.ai:** serie de contenido "construí mi propio sistema de productividad con IA" — 1 video por semana mostrando el producto en uso real.
- **Instagram @labora.ar:** carruseles de "el sistema que uso para manejar 6 proyectos al mismo tiempo".
- **SEO:** artículos sobre "herramienta de productividad para emprendedores LATAM", "alternativa a Notion para fundadores", etc.
- **Referidos:** programa de referidos integrado en el producto (invitás a alguien, ambos reciben 1 mes Pro gratis).

### Canal principal de adquisición

Contenido orgánico en TikTok e Instagram con Brandon como cara visible. La audiencia ya existe (@labora.ai), el problema resuena directamente en ella, y el producto se puede mostrar en uso real sin necesitar ads. El CAC inicial es prácticamente $0.

---

## 9. Competencia

| Competidor | Por qué no alcanza |
|-----------|---------------------|
| Notion | Demasiado flexible. Requiere que el usuario diseñe y mantenga su propio sistema. Si falla en eso, se convierte en un archivo muerto. No tiene IA de contexto útil por defecto. |
| Trello | Organiza tareas pero no guarda contexto. No sabe lo que pasó antes, no puede resumir en qué estabas. |
| Todoist / TickTick | Listas de tareas glorificadas. No tienen noción de "proyecto" como unidad viva con historial y contexto. |
| Linear | Orientado a equipos de producto/dev. Demasiado técnico y complejo para un fundador solo. |
| Obsidian | Poderoso para notas pero no tiene gestión de tareas ni IA útil sin plugins. Curva de aprendizaje alta. |
| Bloc de notas | Rápido pero completamente ciego al historial. No hace seguimiento, no recuerda nada. |

FlowOS no compite en features — compite en velocidad de retoma. La ventaja diferencial no es tener más funciones que Notion, sino eliminar el costo mental de volver a un proyecto después de no tocarlo por días. Esa fricción específica no la resuelve ninguna herramienta del mercado de manera nativa, sin que el usuario tenga que configurar plantillas, workflows o automatizaciones propias.

---

## 10. Métricas Clave (KPIs)

### Producto

- **DAU / MAU:** objetivo de DAU/MAU > 0.4 (los usuarios que pagan deben usar el producto casi todos los días)
- **Sesiones por día por usuario:** objetivo > 2 (el producto se abre para planificar y para retomar proyectos)
- **Proyectos activos por usuario:** objetivo > 3 (si solo tienen 1 proyecto, el valor diferencial no se percibe)
- **Tasa de uso de Quick Capture:** % de usuarios que usan el atajo al menos 3 veces por semana
- **Tasa de uso del resumen IA:** % de aperturas de proyecto donde el usuario lee el resumen (scroll + tiempo en pantalla)
- **Retención a 30 días:** objetivo > 60% para usuarios Pro

### Negocio

- **MRR:** métrica principal de salud del negocio
- **Conversión Free → Pro:** objetivo > 8% en los primeros 90 días de cuenta
- **Churn mensual:** objetivo < 5% para plan Pro
- **CAC:** costo de adquisición por cliente (objetivo < $5 USD en fase orgánica)
- **LTV:** lifetime value promedio (objetivo > $108 USD = 12 meses promedio de suscripción Pro)
- **LTV / CAC ratio:** objetivo > 10x

---

## 11. Próximos Pasos Inmediatos

- [ ] Definir el nombre definitivo del producto (FlowOS como working title — validar disponibilidad de dominio)
- [ ] Crear el repo en GitHub y el proyecto en Lovable
- [ ] Armar el esquema de base de datos en Supabase: tablas `projects`, `tasks`, `notes`, `users`
- [ ] Diseñar las 3 pantallas clave en Lovable: dashboard del día, vista de proyecto, quick capture
- [ ] Conectar Claude API para el resumen de estado (sistema prompt + contexto del proyecto como input)
- [ ] Hacer smoke test con los propios proyectos de Brandon como datos reales
- [ ] Identificar y contactar 5 beta testers del entorno cercano
- [ ] Preparar primer TikTok de la serie "construí mi propio sistema de productividad"
- [ ] Definir dominio y configurar Vercel para deploy

---

*Documento generado como base para desarrollo. Actualizar con cada iteración del producto.*