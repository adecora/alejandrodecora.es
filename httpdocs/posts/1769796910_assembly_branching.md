---
title: "Desmontando el `if-else`: un viaje al Assembly en RISC-V"
date: "2025-12-21"
intro: '¿Cómo las estructuras de control que usamos a diario en lenguajes de alto nivel se traducen en las instrucciones que realmente ejecuta el procesador?.'
slug: "assembly-branching"
---

# Desmontando el `if-else`: un viaje al Assembly en RISC-V

Siempre me ha fascinado cómo las estructuras de control que usamos a diario en lenguajes de alto nivel se traducen en las instrucciones que realmente ejecuta el procesador. El `if-else` es, quizás, la más fundamental de todas. Así que hoy decidí hacer un pequeño experimento: escribir un código simple en C, compilarlo para la arquitectura RISC-V y ver exactamente qué genera el compilador.

Mi laboratorio es sencillo: un `Makefile`, código C, `QEMU` para emular un sistema RISC-V y `gdb-multiarch` para depurar paso a paso.

## Primer paso: Un `if` simple

Vamos a empezar con el caso más básico: una condición que no se cumple.

```c
void mi_funcion() {
  int i = 11;
  int j = 2;

  // Esta condición será falsa
  if (i == 10) {
    j = j + 200;
  }

  // Al ser una función void, hacemos un return vacío
  return;
}
```

Lo primero es compilarlo **sin optimizaciones** (`-O0`). Esto es crucial. Si activáramos las optimizaciones, el compilador se daría cuenta de que la función no hace nada con efecto observable y la reemplazaría por un simple `ret`. Queremos ver el código "ingenuo" para entender la lógica.

```bash
# Compilamos y generamos el binario para QEMU
make mi_funcion

# Generamos el fichero de assembly para analizarlo
make assembly
```

El resultado en assembly es el siguiente (he añadido comentarios para explicar cada paso):

```assembly
; .file "c-asm.c"
; ... (directivas del compilador)

mi_funcion:
  ; --- Prólogo de la función: Preparar el Stack Frame ---
  ; Mueve el puntero del stack (sp) 32 bytes hacia abajo para reservar espacio.
  addi	sp, sp, -32
  ; Guarda el valor del registro s0 (frame pointer) en el stack para poder restaurarlo después.
  sw	s0, 28(sp)
  ; Establece el nuevo frame pointer (s0) en la base del frame actual.
  addi	s0, sp, 32

  ; --- Cuerpo de la función ---
  ; int i = 11;
  li	a5, 11
  sw	a5, -20(s0) ; Guarda el valor de i en el stack (-20 bytes desde s0).

  ; int j = 2;
  li	a5, 2
  sw	a5, -24(s0) ; Guarda el valor de j en el stack (-24 bytes desde s0).

  ; if (i == 10)
  lw	a4, -20(s0)  ; Carga el valor de i (11) en el registro a4.
  li	a5, 10       ; Carga el valor 10 en el registro a5 para la comparación.
  bne	a4, a5, .L4  ; <<<< ¡LA CLAVE! Branch if Not Equal (Salta si NO son iguales).

  ; j = j + 200; (Este bloque solo se ejecuta si bne NO salta)
  lw	a5, -24(s0)
  addi	a5, a5, 200
  sw	a5, -24(s0)

.L4: ; Etiqueta de destino del salto.
  nop ; No Operation. A menudo usado para alineación o como placeholder.

  ; --- Epílogo de la función: Restaurar el Stack ---
  ; Restaura el valor original del frame pointer.
  lw	s0, 28(sp)
  ; Devuelve el puntero del stack a su posición original.
  addi	sp, sp, 32
  ; Vuelve a la dirección desde la que se llamó a la función.
  jr	ra
```

La instrucción `bne a4, a5, .L4` es el corazón del `if`. En lugar de "saltar si es igual", el compilador genera un "salta a la etiqueta `.L4` si no es igual". De esta forma, el código que está dentro del `if` solo se ejecuta si la condición de salto no se cumple. Eficiente y simple.

### ¿Y qué pasa con el Stack?

El prólogo de la función (`addi sp, sp, -32`, etc.) crea un "stack frame", un pequeño espacio de trabajo temporal para nuestra función.

```ascii
      Direcciones Altas
              ^
              |
      +---------------+ <--- sp antes de llamar a mi_funcion() (ej. 0x1000)
      |  Stack de la  |
      | función madre |
      +---------------+ <--- s0 (Frame Pointer) apunta aquí al final del prólogo
      |  s0 guardado  | (en 28(sp))
      +---------------+
      |    ...        |
      |   i = 11      | (en -20(s0))
      +---------------+
      |    j = 2      | (en -24(s0))
      +---------------+
      | Espacio libre |
      +---------------+ <--- sp después de reservar 32 bytes (0x0FE0)
              |
              v
      Direcciones Bajas
```

## Segundo paso: `if-else`

Ahora, añadamos un bloque `else`.

```c
void mi_funcion() {
  int i = 11;
  int j = 2;

  if (i == 10) {
    j = j + 200;
  } else {
    j = j + 100;
  }
}
```

El assembly se vuelve un poco más interesante:

```assembly
piyush:
  ; ... (Prólogo idéntico) ...
  li	a5, 11
  sw	a5, -20(s0)
  li	a5, 2
  sw	a5, -24(s0)
  lw	a4, -20(s0)
  li	a5, 10
  bne	a4, a5, .L2 ; Salta al bloque 'else' (.L2) si i != 10

  ; --- Bloque IF ---
  lw	a5, -24(s0)
  addi	a5, a5, 200
  sw	a5, -24(s0)
  j	.L1        ; Salto incondicional para saltarse el bloque 'else'.

.L2:
  ; --- Bloque ELSE ---
  lw	a5, -24(s0)
  addi	a5, a5, 100
  sw	a5, -24(s0)
  nop

.L1:
  ; ... (Epílogo idéntico) ...
  jr	ra
```

La lógica ahora es:
1.  **`bne .L2`**: Si la condición del `if` es falsa, salta directamente al bloque `else` (etiqueta `.L2`).
2.  Si la condición es verdadera, ejecuta el cuerpo del `if`.
3.  **`j .L1`**: Después de ejecutar el `if`, un salto incondicional (`j`) nos lleva al final de la estructura, evitando que se ejecute el código del `else`.

## Tercer paso: `if-else if-else`

¿Qué pasa con una cadena de condiciones?

```c
void mi_funcion() {
  int i = 3;
  int j = 2;

  if (i == 1) {
    j = j + 1;
  } else if (i == 2) {
    j = j + 2;
  } else if (i == 3) {
    j = j + 3;
  } else {
    j = j + 100;
  }
}
```

El assembly es exactamente lo que esperarías: una escalera de saltos.

```assembly
piyush:
  ; ... (Prólogo) ...
  ; i = 3, j = 2

  lw	a4, -20(s0)
  li	a5, 1
  bne	a4, a5, .L2  ; if (i != 1) salta a la siguiente condición

  ; if (i == 1)
  lw	a5, -24(s0)
  addi	a5, a5, 1
  sw	a5, -24(s0)
  j	.L1          ; Salta al final

.L2:
  lw	a4, -20(s0)
  li	a5, 2
  bne	a4, a5, .L4  ; if (i != 2) salta a la siguiente condición

  ; else if (i == 2)
  lw	a5, -24(s0)
  addi	a5, a5, 2
  sw	a5, -24(s0)
  j	.L1          ; Salta al final

.L4:
  lw	a4, -20(s0)
  li	a5, 3
  bne	a4, a5, .L5  ; if (i != 3) salta al bloque 'else'

  ; else if (i == 3)
  lw	a5, -24(s0)
  addi	a5, a5, 3
  sw	a5, -24(s0)
  j	.L1          ; Salta al final

.L5:
  ; else
  lw	a5, -24(s0)
  addi	a5, a5, 100
  sw	a5, -24(s0)
  nop

.L1:
  ; ... (Epílogo) ...
```

Es una secuencia lineal: comprueba, salta si no; ejecuta, salta al final. Repetir.

## El gran final: `switch-case`

Se suele decir que los compiladores pueden optimizar `switch-case` de forma más eficiente que las escaleras de `if-else`, a menudo usando una "tabla de saltos" (*jump table*). Vamos a ver si es cierto para nuestro caso.

```c
void mi_funcion() {
  int i  = 3;
  int j = 2;

  switch (i) {
    case 1: j = j + 1; break;
    case 2: j = j + 2; break;
    case 3: j = j + 3; break;
    default: j = j + 100; break;
  }
}
```

El assembly resultante es diferente y revela una estrategia de optimización:

```assembly
piyush:
  ; ... (Prólogo) ...
  ; i = 3, j = 2

  lw	a4, -20(s0) ; Carga i
  li	a5, 3
  beq	a4, a5, .L2  ; Si i == 3, salta directamente al caso 3 (.L2)

  lw	a4, -20(s0)
  li	a5, 3
  bgt	a4, a5, .L3  ; Si i > 3, salta al default (.L3)

  lw	a4, -20(s0)
  li	a5, 1
  beq	a4, a5, .L4  ; Si i == 1, salta al caso 1 (.L4)

  lw	a4, -20(s0)
  li	a5, 2
  beq	a4, a5, .L5  ; Si i == 2, salta al caso 2 (.L5)

  j	.L3        ; Si no es 1, 2 ni 3, salta al default

.L4: ; case 1
  ; ...
  j	.L6

.L5: ; case 2
  ; ...
  j	.L6

.L2: ; case 3
  ; ...
  j	.L6

.L3: ; default
  ; ...
  nop

.L6: ; Final
  ; ... (Epílogo) ...
```

En lugar de una cadena lineal de `bne`, el compilador ha reordenado las comprobaciones. Primero verifica el caso `3`, luego si el valor está fuera de rango (`>3`), y después los casos `1` y `2`. No ha generado una tabla de saltos porque el número de casos es pequeño, pero ya está aplicando una lógica de decisión más compleja que la simple escalera de `if-else`. Esto le da al compilador más libertad para optimizar.

El `break;` es fundamental: se traduce en el salto incondicional `j .L6` al final de cada bloque, evitando el comportamiento "fall-through" de C.

Ha sido un viaje fascinante. Ver cómo estas construcciones de alto nivel se convierten en simples saltos condicionales e incondicionales realmente ayuda a desmitificar lo que ocurre bajo el capó.

---

*Puedes encontrar todo el código y los Makefiles para replicar este experimento en mi repositorio: [github.com/adecora/c-language](https://github.com/adecora/c-language).*
