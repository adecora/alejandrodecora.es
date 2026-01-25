---
title: "Sobrescribir el setter de una @property de una clase padre en Python"
date: "2025-09-01"
intro: "Cómo sobrescribir el *setter* de una `@property` de una clase padre sin dejar de invocar la implementación original."
slug: "python-inheritance-setter"
---

# Sobrescribir el setter de una @property de una clase padre en Python

Hoy he ayudado a alguien en Bluesky a depurar un caso de herencia en Python sorprendentemente enrevesado: cómo sobrescribir el *setter* de una `@property` de una clase padre sin dejar de invocar la implementación original.

A primera vista, parece algo trivial.

Imaginemos esta clase base:

```python
class A:
    def __init__(self, a):
        # Usamos un nombre "privado" por convención
        self._a = a

    @property
    def a(self):
        print("Ejecutando el getter de A")
        return self._a

    @a.setter
    def a(self, value):
        print(f"Ejecutando el setter de A con el valor: {value}")
        self._a = value
```

Mi primer instinto para extender este setter en una subclase fue hacer esto:

```python
class B(A):
    @A.a.setter
    def a(self, value):
        print("Lógica adicional en el setter de B")
        # ¡Cuidado! Esto no funciona como se espera.
        super().a = value  # ❌
```

Pero esto falla, y no con el error que podrías esperar. En lugar de un `AttributeError`, lo que obtienes es un `RecursionError`:

```
RecursionError: maximum recursion depth exceeded
```

Esto es confuso, porque `super()` funciona perfectamente para los métodos normales. El problema aquí es que la asignación `super().a = value` vuelve a activar el mecanismo de la propiedad en la instancia `self`, lo que hace que se llame de nuevo al setter de `B`, creando un bucle infinito.

## El truco

`super()` no expone el setter o el deleter de un descriptor de propiedad de la forma que uno esperaría.

Incluso en Python 3, llamar a `super()` sin argumentos solo te da acceso a la búsqueda de atributos a través del MRO (Method Resolution Order). No activa automáticamente el protocolo de descriptor para `property.__set__`.

Por lo tanto, la línea `super().a = value` **no** llama directamente al setter de la clase padre; en su lugar, desencadena una nueva búsqueda que vuelve a caer en el setter de la subclase.

De hecho, hay un antiguo *issue* en el tracker de CPython que describe este comportamiento exacto:
[https://bugs.python.org/issue14965](https://bugs.python.org/issue14965)

## La solución

Lo que necesitas hacer es acceder explícitamente al descriptor de la clase padre y llamar a su método `__set__` directamente.

```python
class B(A):
    @A.a.setter
    def a(self, value):
        print("Lógica adicional en el setter de B")
        # Accedemos al descriptor 'a' de la clase padre y llamamos a su método __set__
        super(B, B).a.__set__(self, value)
```

Sí, la sintaxis `super(B, B)` puede parecer extraña.

Esto es lo que está pasando:

*   **`super(B, B)`**: Esta forma de `super()` nos da acceso a un objeto proxy que comienza la búsqueda de atributos en el MRO justo *después* de la clase `B`. Esto nos permite encontrar de forma fiable el descriptor en la clase padre (`A`).
*   **`.a`**: Esto devuelve el objeto `property` en sí mismo, no el valor del atributo.
*   **`.__set__(self, value)`**: Con el objeto descriptor en la mano, invocamos manualmente su método `__set__`. El protocolo de descriptor requiere que pasemos explícitamente la instancia (`self`) y el valor.

De esta manera, estamos activando el protocolo de descriptor de forma explícita y controlada.

## Ejemplo práctico con lógica adicional

En la práctica, lo que quería hacer era extender el comportamiento, no simplemente reemplazarlo:

```python
class B(A):
    @A.a.setter
    def a(self, value):
        print("Validando antes de asignar...")

        if value < 0:
            raise ValueError("'a' debe ser positivo")

        # Ahora sí, llamamos al setter de la clase padre
        super(B, B).a.__set__(self, value)

# Probando el código
instancia_b = B(10)
instancia_b.a = 50
# Salida:
# Validando antes de asignar...
# Ejecutando el setter de A con el valor: 50
```

Esto mantiene la lógica de la clase padre intacta mientras añade nuestra nueva capa de validación.

## Conclusiones

*   `super()` es fantástico para métodos, pero su uso para `property` setters mediante asignación directa es engañoso.
*   Es un poco incómodo para los setters de propiedades, ya que la sintaxis azucarada no funciona como se esperaría.
*   A veces, debes llamar al protocolo del descriptor directamente.
*   Recordar que `@property` es solo un descriptor hace que todo encaje.

Un momento clásico de aprendizaje sobre el "modelo de datos de Python".

Hilo de Bluesky donde resolvimos esto:
[https://bsky.app/profile/mgmacias.bsky.social/post/3lfamb6eajs2g](https://bsky.app/profile/mgmacias.bsky.social/post/3lfamb6eajs2g)
