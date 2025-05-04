<template>
    <div class="login-container">
      <h1>Login</h1>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Username:</label>
          <input type="text" v-model="username" id="username" placeholder="Enter your username" required />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" v-model="password" id="password" placeholder="Enter your password" required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: "Login",
    data() {
      return {
        username: "",
        password: ""
      };
    },
    methods: {
      handleLogin() {
        
        console.log("Logging in with", this.username, this.password);
        
      }
    }
  };
  </script>
  
  <style scoped>
  .login-container {
    max-width: 400px;
    margin: 3rem auto;
    padding: 2rem;
    border: 1px solid #84a882;
    border-radius: 8px;
    background-color: #84a882;
  }
  
  h1 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #d84363;
  }
  
  .form-group {
    margin-bottom: 1.25rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: #955555;
  }
  
  input[type="text"],
  input[type="password"] {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #e8a4a4;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  </style>
  ``
  