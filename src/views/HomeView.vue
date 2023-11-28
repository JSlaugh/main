<script>
import axios from 'axios'
export default {
  created() {
    let uri = window.location.search.substring(1)
    let params = new URLSearchParams(uri)
    this.token = params.get('fstoken')
    console.log(this.token)
    this.accessToken = this.parseJWT(this.token)
    console.log(this.accessToken)
  },

  data() {
    let token = ''
    let accessToken = ''
    return {
      token,
      accessToken
    }
  },
  methods: {
    async doLogin() {
      let authUrl = 'https://auth.byufamilytech.org'
      let redirectUri = 'http://localhost:5173'

      window.open(`${authUrl}/?redirect=${redirectUri}/&site=ag`)
      axios
        .get(`${authUrl}/?redirect=${redirectUri}/&site=ag`)
        .then((res) => {
          window.location = res.request.responseURL
          console.log(this.$route.params)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    async parseJWT(token) {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')

      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      return JSON.parse(jsonPayload)
    }
  }
}
</script>

<template>
  <main>
    <nav class="container"><h3>FamilyTech Games</h3></nav>
    <div class="loginContainer">
      <button class="loginButton" @click="doLogin" style="padding: 20px">
        Login with Family Search
      </button>
    </div>
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
.loginButton {
  display: -webkit-inline-box;
  display: -webkit-inline-flex;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -webkit-align-items: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  background-color: transparent;
  outline: 0;
  border: 0;
  margin: 0;
  border-radius: 0;
  padding: 0;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  vertical-align: middle;
  -moz-appearance: none;
  -webkit-appearance: none;
  -webkit-text-decoration: none;
  text-decoration: none;
  color: inherit;
  font-family: 'Electrolize', sans-serif;
  font-weight: 500;
  font-size: 0.9285714285714285rem;
  line-height: 1.75;
  text-transform: uppercase;
  min-width: 64px;
  padding: 4px 10px;
  border-radius: 4px;
  -webkit-transition:
    background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

  color: #fff;
  background-color: #2a3492;
}
.loginContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32px 2rem;
  background-color: var(--white);
  height: calc(100vh - 100px);
  color: var(--white);
}
</style>
