# SnowStrat Field — Manual de Usuario

> Documentación funcional de la aplicación de perfiles estratigráficos de nieve.

---

## Índice

1. [Descripción General](#1-descripción-general)
2. [Pantalla Principal](#2-pantalla-principal)
3. [Selección de Idioma](#3-selección-de-idioma)
4. [Flujo de Trabajo: Perfil Estratigráfico](#4-flujo-de-trabajo-perfil-estratigráfico)
   - 4.1 [Datos de Cabecera](#41-datos-de-cabecera)
   - 4.2 [Inicio del Muestreo](#42-inicio-del-muestreo)
   - 4.3 [Selección del Tipo de Test](#43-selección-del-tipo-de-test)
   - 4.4 [Registro de Muestras del Perfil Estratigráfico](#44-registro-de-muestras-del-perfil-estratigráfico)
   - 4.5 [Tabla de Muestras Registradas](#45-tabla-de-muestras-registradas)
   - 4.6 [Finalización del Muestreo](#46-finalización-del-muestreo)
5. [Flujo de Trabajo: Test de Compresión (CT)](#5-flujo-de-trabajo-test-de-compresión-ct)
   - 5.1 [Registro de Muestras CT](#51-registro-de-muestras-ct)
   - 5.2 [Tabla de Resultados CT](#52-tabla-de-resultados-ct)
6. [Muestreo Combinado](#6-muestreo-combinado)
7. [Pantalla de Resultados](#7-pantalla-de-resultados)
   - 7.1 [Gráfico Estratigráfico](#71-gráfico-estratigráfico)
   - 7.2 [Tablas de Datos](#72-tablas-de-datos)
8. [Exportación del GeoJSON](#8-exportación-del-geojson)
9. [Compartir Perfil](#9-compartir-perfil)
10. [Gestión de Perfiles Almacenados](#10-gestión-de-perfiles-almacenados)
    - 10.1 [Explorar Perfiles Guardados](#101-explorar-perfiles-guardados)
    - 10.2 [Cargar un Perfil](#102-cargar-un-perfil)
    - 10.3 [Eliminar un Perfil](#103-eliminar-un-perfil)
11. [Importación de Perfiles GeoJSON](#11-importación-de-perfiles-geojson)
12. [Autoguardado](#12-autoguardado)
13. [Documentación y Recursos](#13-documentación-y-recursos)

---

## 1. Descripción General

**SnowStrat Field** es una aplicación web progresiva (PWA) diseñada para el registro de perfiles estratigráficos de nieve y tests de compresión (CT) en campo. Funciona sin conexión a internet una vez instalada y almacena todos los datos de forma local en el dispositivo del usuario.

La aplicación permite:

- Registrar perfiles estratigráficos con datos de cada capa de nieve.
- Realizar tests de compresión (CT) para evaluar la estabilidad del manto nivoso.
- Visualizar los resultados en un gráfico estratigráfico interactivo.
- Exportar los datos en formato GeoJSON estándar.
- Gestionar perfiles guardados localmente (visualizar, eliminar).
- Importar perfiles desde archivos GeoJSON.

---

## 2. Pantalla Principal

Al abrir la aplicación, se presenta la pantalla principal con los siguientes elementos:

### Barra Superior (Cabecera Fija)
- **Logo y título** de la aplicación: "SnowStrat Field".
- **Botón "Explorar"** (icono de carpeta): Abre el gestor de perfiles guardados.
- **Botón "Importar"** (icono de subida): Permite importar un archivo GeoJSON desde el dispositivo.
- **Selector de idioma** (bandera): Permite cambiar el idioma de la interfaz.

### Tarjeta de Datos del Perfil
- Formulario para introducir los datos generales del perfil antes de comenzar el muestreo.

---

## 3. Selección de Idioma

La aplicación soporta **11 idiomas**:

| Idioma | Nombre Nativo |
|--------|--------------|
| Castellano | Castellano |
| Gallego | Galego |
| Asturiano | Asturianu |
| Euskera | Euskara |
| Catalán | Català |
| Aranés | Aranés |
| Andorrano | Català (Andorra) |
| Inglés | English |
| Francés | Français |
| Alemán | Deutsch |
| Italiano | Italiano |

### Cómo cambiar el idioma:
1. Pulsar el **icono de bandera** en la esquina superior derecha de la barra de navegación.
2. Se despliega un menú con todas las lenguas disponibles, cada una representada con su bandera correspondiente.
3. Seleccionar el idioma deseado.
4. La interfaz se actualiza inmediatamente al idioma seleccionado.
5. La selección **se guarda automáticamente** en el dispositivo y se mantiene entre sesiones.

---

## 4. Flujo de Trabajo: Perfil Estratigráfico

### 4.1 Datos de Cabecera

Antes de comenzar el muestreo, se deben completar los datos generales del perfil:

#### Campos obligatorios:
- **Nombre del perfil**: Identificador del perfil (ej: "Collado Norte - Pico X").
- **Observador**: Nombre de la persona que realiza el muestreo.

#### Campos opcionales:
- **Temperatura del aire (°C)**: Temperatura ambiente en el momento del muestreo.
- **Orientación de la ladera**: Orientación cardinal de la pendiente donde se realiza el perfil. Se selecciona de un desplegable con las opciones: N, NE, E, SE, S, SO, O, NO.
- **Observaciones**: Campo de texto libre para anotar condiciones meteorológicas, estado general del manto, notas de seguridad u otra información relevante.

#### Información automática (solo lectura):
- **Coordenadas GPS**: Se muestran en tiempo real mientras se busca señal. Se pueden visualizar en formato **decimal (DEC)** o **sexagesimal (GMS)** pulsando sobre el recuadro de coordenadas.
- **Altitud**: Obtenida del GPS del dispositivo, mostrada en metros.
- **Hora UTC**: Hora actual en formato UTC, actualizada en tiempo real.

#### Indicador de GPS:
La barra de estado GPS muestra el estado actual de la señal:
- **"GPS Buscando..."**: Se está intentando obtener la posición.
- **"GPS Activo"**: Se ha obtenido la posición y se actualiza en tiempo real.
- **"GPS Fijado"**: La posición ha sido congelada al iniciar el muestreo.
- **"GPS Error"**: No se ha podido obtener la posición del dispositivo.

### 4.2 Inicio del Muestreo

1. Completar al menos los campos **Nombre del perfil** y **Observador** (el botón de inicio permanece deshabilitado hasta que ambos se rellenen).
2. Pulsar el botón **"Iniciar Muestreo"**.
3. Al pulsar:
   - Se **congela la posición GPS** actual (coordenadas y altitud).
   - Se **congela la hora UTC** del inicio del muestreo.
   - Los campos de cabecera quedan **bloqueados** y no se pueden modificar.
   - Se muestra una notificación confirmando el inicio y la fijación del GPS.
   - Se avanza a la pantalla de selección del tipo de test.

> **Nota**: Si el GPS no tiene señal en el momento de iniciar, los datos de coordenadas y altitud quedarán como "N/A", pero el muestreo se puede realizar igualmente.

### 4.3 Selección del Tipo de Test

Tras iniciar el muestreo, se presentan dos opciones:

- **Perfil Estratigráfico**: Análisis completo de las capas de nieve (altura, tipo de grano, dureza, temperatura, humedad, diámetro).
- **Test de Compresión (CT)**: Test de estabilidad por compresión con registro de golpes y calidad de fractura.

Pulsar sobre una de las dos opciones para acceder al formulario de muestreo correspondiente.

> **Nota**: Una vez dentro del muestreo, se puede alternar entre ambos tipos de test usando las **pestañas** en la parte superior del formulario ("Perfil Estratigráfico" | "Test CT"). Esto permite realizar ambos tests durante la misma sesión de campo.

### 4.4 Registro de Muestras del Perfil Estratigráfico

El formulario de muestras permite registrar las características de cada capa del manto nivoso, de abajo hacia arriba.

#### Campos por muestra:

| Campo | Obligatorio | Tipo de control | Rango / Opciones |
|-------|:-----------:|-----------------|-------------------|
| **Altura de la capa (cm)** | ✅ | Stepper (+/-) + entrada numérica | 1 – 200 cm |
| **Temperatura (°C)** | ❌ | Stepper (+/-) + entrada numérica | Máximo 0.0°C (valores negativos) |
| **Dureza (Resistencia)** | ✅ | Botones de selección rápida + entrada numérica | I (120), K (100), P (50), 1F (25), 4F (10), F (2) — Rango: 0-120 |
| **Tipo de grano** | ✅ | Desplegable | PP, PPgp, DF, RG, FC, DH, MF, MFcr, IF, SH |
| **Diámetro del grano (mm)** | ❌ | Stepper (+/-) + entrada numérica | Pasos de 0.1 mm |
| **Humedad** | ❌ | Botones de selección rápida | D (Seca), M (Húmeda), W (Mojada), V (Muy mojada), S (Empapada) |

#### Escala de Dureza (Resistencia):

| Código | Valor | Descripción |
|--------|-------|-------------|
| F | 2 | Puño (Fist) |
| 4F | 10 | 4 Dedos (4 Fingers) |
| 1F | 25 | 1 Dedo (1 Finger) |
| P | 50 | Lápiz (Pencil) |
| K | 100 | Cuchillo (Knife) |
| I | 120 | Hielo (Ice) |

#### Tipos de Grano (Clasificación IACS):

| Código | Símbolo | Descripción |
|--------|---------|-------------|
| PP | + | Nieve reciente |
| PPgp | ⛇ | Nieve granulada |
| DF | / | Partículas reconocibles |
| RG | • | Grano fino |
| FC | □ | Granos de caras planas |
| DH | ∧ | Cubiletes |
| MF | ○ | Grano redondo |
| MFcr | ⚭ | Costra de rehielo |
| IF | ▮ | Capa de hielo |
| SH | v | Escarcha |

#### Proceso de registro:
1. Rellenar los campos de la muestra (al menos Altura, Dureza y Tipo de grano).
2. Pulsar **"Siguiente Muestra"** para registrar la capa.
3. Se muestra una notificación con el número de muestra y la altura registrada.
4. El formulario se reinicia para la siguiente muestra, manteniendo el tipo de grano y la dureza seleccionados (ya que suelen repetirse entre capas adyacentes).
5. El **contador de altura acumulada** se actualiza automáticamente en la esquina superior derecha del formulario.

> **Nota**: Cada muestra registrada lleva asociada una marca temporal (timestamp) en formato UTC del momento exacto en que se registra.

### 4.5 Tabla de Muestras Registradas

Debajo del formulario, se muestra una tabla con todas las muestras registradas hasta el momento. La tabla incluye:

- **Número de muestra**
- **Altura de la capa** (cm)
- **Altura acumulada** (cm)
- **Tipo de grano** (código IACS)
- **Diámetro** (mm)
- **Dureza** (código)
- **Humedad** (código)
- **Temperatura** (°C)
- **Acciones**: Reordenar y Eliminar

#### Reordenar muestras:
- Pulsar sobre el número de muestra para abrir un diálogo que permite cambiar su posición en la secuencia.
- Las muestras se renumeran automáticamente tras el reordenamiento.

#### Eliminar muestras:
- Pulsar el icono de papelera junto a la muestra.
- La muestra se elimina inmediatamente y el resto se renumera.

### 4.6 Finalización del Muestreo

Una vez registradas todas las muestras necesarias:

1. Pulsar el botón **"Finalizar muestreo"** que aparece debajo del formulario (solo visible cuando hay al menos una muestra registrada).
2. Se muestra un **diálogo de confirmación** con el mensaje de que se va a finalizar el muestreo.
3. Confirmar pulsando **"Confirmar"** o cancelar pulsando **"Cancelar"**.
4. Al confirmar, se accede a la **pantalla de resultados**.

---

## 5. Flujo de Trabajo: Test de Compresión (CT)

El Test de Compresión es un test de estabilidad que evalúa la resistencia de las capas débiles del manto nivoso mediante golpes controlados.

### 5.1 Registro de Muestras CT

Cada muestra CT registra una fractura observada durante el test. El formulario incluye:

| Campo | Obligatorio | Tipo de control | Rango / Opciones |
|-------|:-----------:|-----------------|-------------------|
| **Número de golpes** | ✅ | Stepper (+/-) + entrada numérica | 0 – 31 |
| **Referencia vertical** | ✅ | Botones de selección (2 opciones) | ↓ Desde superficie / ↑ Desde el suelo |
| **Profundidad de la capa (cm)** | ✅ | Stepper (+/-) + entrada numérica | Desde 1 cm |
| **Calidad de la fractura** | ✅ | Botones de selección rápida (3 opciones) | Q1, Q2, Q3 |
| **Tipo de grano** | ✅ | Desplegable | PP, PPgp, DF, RG, FC, DH, MF, MFcr, IF, SH |
| **Diámetro del grano (mm)** | ❌ | Stepper (+/-) + entrada numérica | Pasos de 0.1 mm |
| **Información adicional** | ❌ | Campo de texto libre | Texto libre |

#### Escala de Puntuación CT (basada en el número de golpes):

| Puntuación | Golpes | Descripción |
|:----------:|:------:|-------------|
| **V** | 0 | Muy fácil (Very Easy) |
| **E** | 1 – 10 | Fácil (Easy) |
| **M** | 11 – 20 | Medio (Medium) |
| **H** | 21 – 30 | Difícil (Hard) |
| **N** | 31 | Sin fractura (No fracture) |

#### Referencia Vertical:
- **↓ Desde la superficie del manto**: La profundidad se mide desde la superficie de la nieve hacia abajo.
- **↑ Desde el suelo**: La profundidad se mide desde el nivel del suelo hacia arriba.

#### Calidad de la Fractura:
| Código | Descripción |
|--------|-------------|
| Q1 | Fractura limpia y plana |
| Q2 | Fractura parcialmente plana |
| Q3 | Fractura irregular o rugosa |

#### Proceso de registro:
1. Rellenar los campos obligatorios de la muestra CT.
2. Pulsar **"Siguiente Muestra"** para registrar la fractura.
3. Se muestra una notificación con el número de muestra y la profundidad de fractura.
4. El formulario se reinicia para la siguiente muestra, manteniendo la calidad de fractura y el tipo de grano seleccionados.

#### Formato del resultado codificado:
Cada muestra CT genera un resultado codificado con el formato:

```
CT[Puntuación][Calidad]@[Referencia][Profundidad][Grano][Diámetro] [Info]
```

**Ejemplo**: `CTMQ3@↓54FC3mm Capa débil` significa:
- CT = Test de Compresión
- M = Puntuación Media (11-20 golpes)
- Q3 = Fractura irregular
- ↓ = Medido desde la superficie
- 54 = A 54 cm de profundidad
- FC = Tipo de grano: Caras planas
- 3mm = Diámetro del grano
- "Capa débil" = Información adicional

### 5.2 Tabla de Resultados CT

Debajo del formulario CT, se muestra una tabla con las muestras registradas que incluye:

- **Número de muestra**
- **Resultado codificado** (formato CT completo)
- **Golpes**
- **Profundidad**
- **Calidad de fractura**
- **Tipo de grano**
- **Diámetro**
- **Información adicional**
- **Acciones**: Eliminar

---

## 6. Muestreo Combinado

Durante una sesión de muestreo, es posible **combinar el Perfil Estratigráfico y el Test de Compresión** en el mismo perfil:

1. Tras seleccionar el tipo de test inicial, se accede al formulario con **dos pestañas** en la parte superior:
   - **"Perfil Estratigráfico"**: Formulario de muestras de capas.
   - **"Test CT"**: Formulario de muestras de compresión.
2. Se puede alternar libremente entre ambas pestañas durante el muestreo.
3. Cada pestaña muestra un **contador** con el número de muestras registradas en ese tipo de test.
4. Al finalizar el muestreo, se incluyen todos los datos de ambos tests en el perfil resultante.

---

## 7. Pantalla de Resultados

Al finalizar el muestreo, se muestra la pantalla de resultados con la visualización completa del perfil.

### 7.1 Gráfico Estratigráfico

Si se han registrado muestras del perfil estratigráfico, se muestra un **gráfico SVG interactivo** que representa visualmente el perfil del manto nivoso:

- **Eje vertical**: Altura acumulada de las capas (cm).
- **Eje horizontal**: Dureza/Resistencia de cada capa.
- **Colores**: Cada capa se colorea según el **estándar IACS** del tipo de grano.
- **Marcadores CT**: Si existen muestras del test de compresión, se representan como **conectores rojos con flechas** indicando la profundidad de cada fractura.
- **Zoom**: El gráfico se muestra con un zoom por defecto del 75% y se puede ajustar.
- **Interactividad**: Al pulsar sobre una capa del gráfico, se abre un diálogo con los detalles técnicos de esa muestra. Los marcadores CT también son interactivos.

### 7.2 Tablas de Datos

Debajo del gráfico se muestran las tablas de datos:
- **Tabla del Perfil Estratigráfico** (si hay muestras de capas): Vista de solo lectura con todas las muestras registradas.
- **Tabla del Test CT** (si hay muestras de compresión): Vista de solo lectura con todos los resultados CT.

---

## 8. Exportación del GeoJSON

La exportación genera un archivo en formato **GeoJSON estándar** con todos los datos del perfil.

### Cómo exportar:
1. En la pantalla de resultados, pulsar el botón **"Exportar GeoJSON"**.
2. Se descarga automáticamente un archivo con el nombre: `perfil_nivo_[nombre]_[fecha].geojson`.
3. Se muestra una notificación confirmando la exportación y descarga.

### Contenido del archivo GeoJSON:
El archivo exportado es un **GeoJSON Feature** con la siguiente estructura:

- **Geometría**: Punto con coordenadas `[longitud, latitud, altitud]` en formato WGS84.
- **Propiedades**:
  - Nombre del perfil, observador, observaciones.
  - Temperatura del aire y orientación de la ladera.
  - Marca temporal del inicio del muestreo (ISO 8601 UTC).
  - Número total de muestras y altura total.
  - Array de muestras con todos los datos registrados (incluyendo timestamps individuales por muestra).
  - Array de muestras CT (si las hay) con los resultados codificados.

> **Nota**: El archivo GeoJSON se puede importar de nuevo en la aplicación para visualizar el perfil.

---

## 9. Compartir Perfil

> ⚠️ **Funcionalidad en desarrollo**: La opción de compartir perfiles mediante la Web Share API del navegador está actualmente **deshabilitada** debido a problemas de compatibilidad y permisos en determinados entornos. Se está trabajando en una solución estable para futuras versiones.

---

## 10. Gestión de Perfiles Almacenados

Los perfiles se almacenan de forma local en el dispositivo del usuario (IndexedDB). Desde el gestor de perfiles se pueden visualizar y eliminar.

### 10.1 Explorar Perfiles Guardados

1. En la pantalla principal, pulsar el botón **"Explorar"** (icono de carpeta) en la barra superior.
2. Se abre un diálogo con la lista de todos los perfiles almacenados, ordenados por fecha (más recientes primero).
3. Cada perfil muestra:
   - **Nombre** del perfil.
   - **Observador**.
   - **Fecha y hora** de creación.
   - **Número de muestras** registradas.
   - **Coordenadas GPS** (si están disponibles).
   - **Altitud** (si está disponible).
4. En la parte inferior se muestra el **número total** de perfiles almacenados.

### 10.2 Cargar un Perfil

1. En el gestor de perfiles, pulsar el **icono de ojo** (👁) junto al perfil que se desea visualizar.
2. El perfil se carga y la aplicación navega directamente a la **pantalla de resultados**, mostrando:
   - El gráfico estratigráfico (si hay muestras de capas).
   - Las tablas de datos correspondientes.
   - Los botones de exportación.
3. Se muestra una notificación confirmando que el perfil ha sido cargado.

### 10.3 Eliminar un Perfil

1. En el gestor de perfiles, pulsar el **icono de papelera** (🗑) junto al perfil que se desea eliminar.
2. Se muestra un **diálogo de confirmación** con el nombre del perfil.
3. Confirmar la eliminación.
4. El perfil se elimina permanentemente del dispositivo.
5. Se muestra una notificación confirmando la eliminación.

> **⚠️ Advertencia**: La eliminación de un perfil es **irreversible**. Se recomienda exportar el GeoJSON antes de eliminar un perfil para conservar una copia de los datos.

---

## 11. Importación de Perfiles GeoJSON

La aplicación permite importar perfiles desde archivos GeoJSON previamente exportados.

### Cómo importar:
1. En la pantalla principal, pulsar el botón **"Importar"** (icono de subida) en la barra superior.
2. Se abre el selector de archivos del dispositivo.
3. Seleccionar un archivo con extensión `.geojson` o `.json`.
4. Si el archivo es válido:
   - Los datos se cargan automáticamente.
   - La aplicación navega a la pantalla de resultados con el perfil importado.
   - Se muestra una notificación con el número de muestras cargadas.
5. Si el archivo no es válido, se muestra una notificación de error.

### Formatos aceptados:
- Archivos `.geojson`
- Archivos `.json` con estructura GeoJSON Feature válida

---

## 12. Autoguardado

La aplicación implementa un sistema de **autoguardado automático** que funciona de la siguiente manera:

- Cada vez que se añade, modifica o elimina una muestra, el perfil se guarda automáticamente en el dispositivo.
- El autoguardado actualiza el **mismo registro** del perfil actual (no crea duplicados).
- Los cambios en los datos básicos (nombre, observador, observaciones) también desencadenan el autoguardado.
- Al pulsar **"Nuevo Perfil"**, se reinicia completamente el estado y se crea un nuevo registro en la próxima operación de guardado.

> **Nota**: El autoguardado es transparente para el usuario y no muestra notificaciones para no interrumpir el flujo de trabajo en campo.

---

## 13. Documentación y Recursos

La aplicación incluye una sección de documentación accesible desde el **enlace "Documentación"** en el pie de página.

### Contenido:
- **Guía Técnica**: Información sobre la instalación como PWA, capacidades offline y soporte multiplataforma.
- **Agradecimientos**: Créditos y reconocimientos del proyecto.
- **Descargo de Responsabilidad**: Advertencia legal sobre los riesgos asociados a actividades en montaña y la naturaleza informativa de la herramienta.
- **Recursos de Formación**: Enlaces a recursos externos de formación nivológica:
  - [RecMountain](https://recmountain.com)
  - [Alurte](https://alurte.com)
  - [ACNA](https://acna.es)
  - [Lauegi Report](https://lauegi.report)
  - [Montaña Segura](https://montanasegura.com)
  - [AEMET BPA](https://www.aemet.es/es/eltiempo/prediccion/montana/boletin_peligro_aludes)

---

## Flujo Resumido

```
┌──────────────────────────────────────────────────────────────┐
│                    PANTALLA PRINCIPAL                         │
│  [Explorar] [Importar]                    [Idioma]           │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  Datos de Cabecera                                  │     │
│  │  Nombre* | Observador* | Temp. aire | Orientación   │     │
│  │  Observaciones                                      │     │
│  │  GPS | Altitud | Hora UTC                           │     │
│  │                                                     │     │
│  │  [Iniciar Muestreo]                                 │     │
│  └─────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│              SELECCIÓN DE TIPO DE TEST                        │
│                                                              │
│   ┌─────────────────┐    ┌─────────────────┐                 │
│   │    Perfil        │    │    Test de       │                │
│   │    Estratigráfico│    │    Compresión    │                │
│   └─────────────────┘    └─────────────────┘                 │
└──────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                      MUESTREO                                │
│  [Perfil Estratigráfico]  |  [Test CT]    ← Pestañas         │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  Formulario de Muestra                              │     │
│  │  (campos específicos según el tipo de test)         │     │
│  │  [Siguiente Muestra]                                │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  Tabla de Muestras Registradas                      │     │
│  │  (vista previa + gráfico durante el muestreo)       │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                              │
│  [Finalizar Muestreo] → Diálogo de confirmación             │
└──────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                   PANTALLA DE RESULTADOS                      │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  Gráfico Estratigráfico (SVG interactivo)           │     │
│  │  + Marcadores CT (si los hay)                       │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  Tablas de Datos (Estratigráfico + CT)              │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                              │
│  [Exportar GeoJSON]          [Nuevo Perfil]                  │
└──────────────────────────────────────────────────────────────┘
                            │
                  ┌─────────┴─────────┐
                  ▼                   ▼
         Descarga .geojson    Reinicia la aplicación
```

---

*SnowStrat Field — Documentación funcional v1.0*
