# Stack Kata : step-by-step

Les exemples sont en Java (JUnit 5 + AssertJ). L'important n'est pas le code final, mais **la façon dont chaque test fait évoluer l'implémentation**.

## 1. Une nouvelle pile est vide

🔴 On écrit le test en premier, et on génère le code depuis son usage (`Alt+Enter` / `⌥⏎`) :

```java
@Test
void a_new_stack_is_empty() {
    Stack stack = Stack.withCapacity(2);
    assertThat(stack.isEmpty()).isTrue();
}
```

🟢 **Fake it** : la plus petite chose qui passe.

```java
public class Stack {
    public static Stack withCapacity(int capacity) {
        return new Stack();
    }

    public boolean isEmpty() {
        return true;
    }
}
```

## 2. Après un push, la pile n'est pas vide

🔴

```java
@Test
void after_one_push_the_stack_is_not_empty() {
    Stack stack = Stack.withCapacity(2);
    stack.push(0);
    assertThat(stack.isEmpty()).isFalse();
}
```

🟢 Le `true` en dur ne suffit plus : un **booléen** apparaît.

```java
private boolean empty = true;

public boolean isEmpty() {
    return empty;
}

public void push(int element) {
    empty = false;
}
```

🔵 La création de la pile est dupliquée dans les deux tests : on l'extrait en champ.

```java
private final Stack stack = Stack.withCapacity(2);
```

## 3. Après un push et un pop, la pile est vide

🔴

```java
@Test
void after_one_push_and_one_pop_the_stack_is_empty() {
    stack.push(0);
    stack.pop();
    assertThat(stack.isEmpty()).isTrue();
}
```

🟢

```java
public void pop() {
    empty = true;
}
```

## 4. Après deux push et un pop, la pile n'est pas vide

🔴

```java
@Test
void after_two_pushes_and_one_pop_the_stack_is_not_empty() {
    stack.push(0);
    stack.push(0);
    stack.pop();
    assertThat(stack.isEmpty()).isFalse();
}
```

🟢 **Triangulation** : un booléen ne peut pas compter, il devient un **compteur**.

```java
private int size;

public boolean isEmpty() {
    return size == 0;
}

public void push(int element) {
    size++;
}

public void pop() {
    size--;
}
```

## 5. Empiler au-delà de la capacité : overflow

🔴

```java
@Test
void pushing_past_the_capacity_overflows() {
    stack.push(1);
    stack.push(2);
    assertThatThrownBy(() -> stack.push(3))
        .isInstanceOf(Stack.OverflowException.class);
}
```

🟢 La capacité, ignorée jusqu'ici, devient utile.

```java
private final int capacity;

private Stack(int capacity) {
    this.capacity = capacity;
}

public void push(int element) {
    if (size == capacity) throw new OverflowException();
    size++;
}
```

## 6. Dépiler une pile vide : underflow

🔴

```java
@Test
void popping_an_empty_stack_underflows() {
    assertThatThrownBy(stack::pop)
        .isInstanceOf(Stack.UnderflowException.class);
}
```

🟢

```java
public void pop() {
    if (isEmpty()) throw new UnderflowException();
    size--;
}
```

## 7. Après avoir empilé X, pop retourne X

🔴

```java
@Test
void pop_returns_the_last_pushed_element() {
    stack.push(99);
    assertThat(stack.pop()).isEqualTo(99);
}
```

🟢 **Fake it** encore : on mémorise **un seul** élément.

```java
private int element;

public void push(int element) {
    if (size == capacity) throw new OverflowException();
    this.element = element;
    size++;
}

public int pop() {
    if (isEmpty()) throw new UnderflowException();
    size--;
    return element;
}
```

## 8. Après X puis Y, pop retourne Y puis X

🔴

```java
@Test
void pop_returns_elements_in_reverse_order() {
    stack.push(99);
    stack.push(88);
    assertThat(stack.pop()).isEqualTo(88);
    assertThat(stack.pop()).isEqualTo(99);
}
```

🟢 **Triangulation** : un seul élément ne suffit plus, il devient un **tableau**. Le compteur sert d'index.

```java
private final int[] elements;

private Stack(int capacity) {
    this.elements = new int[capacity];
}

public void push(int element) {
    if (size == elements.length) throw new OverflowException();
    elements[size++] = element;
}

public int pop() {
    if (isEmpty()) throw new UnderflowException();
    return elements[--size];
}
```

🔵 Le champ `capacity` fait doublon avec `elements.length` : on le supprime.

## 9 et 10. top

🔴

```java
@Test
void top_returns_the_last_element_without_removing_it() {
    stack.push(42);
    assertThat(stack.top()).isEqualTo(42);
    assertThat(stack.size()).isEqualTo(1);
}

@Test
void top_of_an_empty_stack_underflows() {
    assertThatThrownBy(stack::top)
        .isInstanceOf(Stack.UnderflowException.class);
}
```

🟢 puis 🔵 : `pop` et `top` partagent la même vérification, `pop` peut s'appuyer sur `top`.

```java
public int top() {
    if (isEmpty()) throw new UnderflowException();
    return elements[size - 1];
}

public int pop() {
    int top = top();
    size--;
    return top;
}
```

## 11 et 12. Les capacités limites

🔴

```java
@Test
void a_stack_cannot_have_a_negative_capacity() {
    assertThatThrownBy(() -> Stack.withCapacity(-1))
        .isInstanceOf(Stack.IllegalCapacityException.class);
}

@Test
void any_push_on_a_zero_capacity_stack_overflows() {
    Stack zero = Stack.withCapacity(0);
    assertThatThrownBy(() -> zero.push(1))
        .isInstanceOf(Stack.OverflowException.class);
}
```

🟢 Le test 12 passe déjà : le code est assez général. Le test 11 demande une garde dans la méthode de fabrique.

```java
public static Stack withCapacity(int capacity) {
    if (capacity < 0) throw new IllegalCapacityException();
    return new Stack(capacity);
}
```

> Un test qui passe du premier coup n'est pas forcément inutile : ici, le test 12 **documente** un cas limite. Vérifiez quand même qu'il peut échouer (cassez le code un instant).

## Bonus : la pile générique

```java
public class Stack<T> {
    private final Object[] elements;
    private int size;

    private Stack(int capacity) {
        this.elements = new Object[capacity];
    }

    public static <T> Stack<T> withCapacity(int capacity) {
        if (capacity < 0) throw new IllegalCapacityException();
        return new Stack<>(capacity);
    }

    public boolean isEmpty() {
        return size == 0;
    }

    public int size() {
        return size;
    }

    public void push(T element) {
        if (size == elements.length) throw new OverflowException();
        elements[size++] = element;
    }

    public T pop() {
        T top = top();
        size--;
        return top;
    }

    @SuppressWarnings("unchecked")
    public T top() {
        if (isEmpty()) throw new UnderflowException();
        return (T) elements[size - 1];
    }

    public static class OverflowException extends RuntimeException {}
    public static class UnderflowException extends RuntimeException {}
    public static class IllegalCapacityException extends RuntimeException {}
}
```

## Ce qu'il faut retenir

- L'implémentation a **émergé** : `true` en dur → booléen → compteur → un élément → tableau
- Chaque généralisation a été **forcée par un test**, jamais anticipée
- Le refactoring a porté sur le code **et** sur les tests (setup commun)
