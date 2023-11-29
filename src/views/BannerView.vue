<script></script>

<template>
  <main>
    <nav class="container"><h3>FamilyTech Games</h3></nav>
    <RouterView />
  </main>
</template>

<style>
:root {
  --blue: #2a3492;
  --red: #ef4423;
  --orange: #ff9526;
  --yellow: #f6eb14;
  --green: #4faf44;
  --white: #fff;
  --black: #000;
  --background: white;
}

.container {
  display: flex;
  width: 100%;
  height: fit-content;
  justify-content: center;
  align-items: center;
  font-size: 1.5em;
  text-align: center;
  background-color: var(--blue);
  color: var(--white);
  z-index: 3;
  box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.25); /* horizontal offset, vertical offset, blur, color */
  position: relative; /* So box shadow will show up */
}

.hidden {
  visibility: hidden;
}

.visible {
  display: relative;
}
h3 {
  display: block;
  font-size: 1.17em;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
}
</style>
