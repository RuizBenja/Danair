ï»¿<template>
  <div class="login-wrapper d-flex align-items-center" @mousemove="handleMouseMove" @mouseleave="resetParallax">
    <!-- Fondo de burbujas dinÃƒÂ¡mico -->
    <div class="bg-bubbles">
      <div class="bubble bubble-1" :style="bubbleStyle(42, 36)"><div class="bubble-core"></div></div>
      <div class="bubble bubble-2" :style="bubbleStyle(-52, -40)"><div class="bubble-core"></div></div>
      <div class="bubble bubble-3" :style="bubbleStyle(-34, 46)"><div class="bubble-core"></div></div>
      <div class="bubble bubble-4" :style="bubbleStyle(58, -28)"><div class="bubble-core"></div></div>
      <div class="bubble bubble-5" :style="bubbleStyle(-44, 30)"><div class="bubble-core"></div></div>
    </div>

    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-6 col-xl-4 my-5">
          <!-- Aplica shake-animation si msm_error tiene valor -->
          <div class="login-card shadow-sm" :class="{'glow-active': isGlowing, 'shake-animation': msm_error}">

            <!-- Header -->
            <div class="login-header text-center mb-4">
              <img src="/assets/img/Logo-DanAir-con-Banderas-Grande.webp" alt="DanAir" class="login-brand mb-4">
              <h1 class="h3 mb-1">Iniciar Sesión</h1>
              <p class="text-muted mb-0">Panel administrador</p>
            </div>

            <!-- Form -->
            <form @submit.prevent="validar">

              <!-- Alerta de error -->
              <div v-if="msm_error" class="alert alert-danger mb-3" role="alert">
                {{ msm_error }}
              </div>

              <!-- Email -->
              <div class="form-group mb-3">
                <label class="form-label">Correo electrónico</label>
                <div class="input-icon-group">
                  <span class="input-icon"><i class="fe fe-mail"></i></span>
                  <input type="email" class="form-control" v-model="email" placeholder=" Ejemplo: benja@gmail.com">
                </div>
              </div>

              <!-- Password -->
              <div class="form-group mb-4">
                <label class="form-label">Contraseña</label>
                <div class="input-group input-group-merge">
                  <input class="form-control" v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Ingresa tu contraseña">
                  <button type="button" class="btn password-toggle" @click="showPassword = !showPassword" tabindex="-1">
                    <i class="fe" :class="showPassword ? 'fe-eye-off' : 'fe-eye'"></i>
                  </button>
                </div>
              </div>

              <!-- BotÃƒÂ³n -->
              <button
                class="btn btn-lg w-100 btn-primary mb-3 btn-login"
                type="submit"
                :disabled="isGlowing"
              >
                <span v-if="!isGlowing">Ingresar</span>
                <span v-else>Cargando...</span>
              </button>

              <p class="text-center text-muted small mb-0">Danair © {{ currentYear }} Panel administrador</p>
            </form>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginApp',
  data() {
    return {
      email: '',
      password: '',
      msm_error: '',
      showPassword: false,
      isGlowing: false,
      pointerX: 0,
      pointerY: 0
    }
  },
  computed: {
    currentYear() {
      return new Date().getFullYear();
    }
  },
  methods: {
    handleMouseMove(event) {
      const { innerWidth, innerHeight } = window;
      this.pointerX = (event.clientX / innerWidth - 0.5) * 2;
      this.pointerY = (event.clientY / innerHeight - 0.5) * 2;
    },
    resetParallax() {
      this.pointerX = 0;
      this.pointerY = 0;
    },
    bubbleStyle(xFactor, yFactor) {
      return {
        transform: `translate(${this.pointerX * xFactor}px, ${this.pointerY * yFactor}px)`
      };
    },
    validar() {
      // Limpiamos el error para que la animacionn de shake se pueda reiniciar
      this.msm_error = ''; 
      
      if (!this.email) {
        this.msm_error = 'Ingrese un correo electrÃƒÂ³nico'; 
        setTimeout(() => { this.msm_error = 'Ingrese un correo electrÃƒÂ³nico'; }, 10);
      } else if (!this.password) {
        this.msm_error = 'Ingrese una contraseÃƒÂ±a';
        setTimeout(() => { this.msm_error = 'Ingrese una contraseÃƒÂ±a'; }, 10);
      } else {
        // Activamos el brillo justo antes de la peticiÃƒÂ³n Axios
        this.isGlowing = true;
        this.login();
      }
    },

    login() {
      let data = { email: this.email, password: this.password };

      axios.post(this.$url + '/login_usuario', data, {
        headers: { 'Content-Type': 'application/json' }
      }).then((result) => {
        if (!result.data.data) {
          this.msm_error = result.data.message;
          setTimeout(() => { this.msm_error = result.data.message; }, 10);
          this.isGlowing = false; // Detener efecto si hay error de credenciales
        }

        if (result.data.token) {
          this.$store.dispatch('saveToken', result.data.token);
          localStorage.setItem('usuario', JSON.stringify(result.data.usuario));
          this.$router.push({ name: 'dashboard' }).then(() => {
            window.location.reload();
          });
        }
      }).catch((error) => {
        this.msm_error = 'Error de conexiÃƒÂ³n con el servidor';
        setTimeout(() => { this.msm_error = 'Error de conexiÃƒÂ³n con el servidor'; }, 10);
        this.isGlowing = false; // Detener efecto si falla la conexiÃƒÂ³n
        console.error(error);
      });
    }
  }
}
</script>

<style scoped>
/* --- FONDO MESH ANIMADO --- */
.login-wrapper { min-height: 100vh; background: linear-gradient(180deg, #f4f7fd 0%, #edf3fb 100%); position: relative; overflow: hidden; display: flex; align-items: center; }
.bg-bubbles { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; }
.bubble { position: absolute; transition: transform 0.08s ease-out; will-change: transform; }
.bubble-core { width: 100%; height: 100%; border-radius: 50%; filter: blur(4px); opacity: 1; mix-blend-mode: multiply; }

.bubble-1 {
  top: -6%;
  left: -4%;
  width: 460px;
  height: 460px;
}

.bubble-1 .bubble-core {
  background: radial-gradient(circle, rgba(37, 99, 235, 0.52) 0%, rgba(96, 165, 250, 0.28) 36%, rgba(255, 255, 255, 0) 74%);
  animation: drift-bubble-1 4.5s infinite alternate ease-in-out;
}

.bubble-2 {
  bottom: -16%;
  right: -10%;
  width: 430px;
  height: 430px;
}

.bubble-2 .bubble-core {
  background: radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(14, 165, 233, 0.22) 38%, rgba(255, 255, 255, 0) 75%);
  animation: drift-bubble-2 5.5s infinite alternate ease-in-out;
}

.bubble-3 {
  top: 12%;
  right: 12%;
  width: 300px;
  height: 300px;
}

.bubble-3 .bubble-core {
  background: radial-gradient(circle, rgba(125, 211, 252, 0.34) 0%, rgba(59, 130, 246, 0.18) 42%, rgba(255, 255, 255, 0) 72%);
  animation: drift-bubble-3 3.8s infinite alternate ease-in-out;
}

.bubble-4 {
  top: 42%;
  left: 18%;
  width: 300px;
  height: 300px;
}

.bubble-4 .bubble-core {
  background: radial-gradient(circle, rgba(56, 189, 248, 0.3) 0%, rgba(37, 99, 235, 0.18) 40%, rgba(255, 255, 255, 0) 74%);
  animation: drift-bubble-4 4.2s infinite alternate ease-in-out;
}

.bubble-5 {
  bottom: 8%;
  left: 58%;
  width: 320px;
  height: 320px;
}

.bubble-5 .bubble-core {
  background: radial-gradient(circle, rgba(37, 99, 235, 0.28) 0%, rgba(14, 165, 233, 0.16) 42%, rgba(255, 255, 255, 0) 74%);
  animation: drift-bubble-5 5.2s infinite alternate ease-in-out;
}

@keyframes drift-bubble-1 {
  0% { transform: translate(0, 0) scale(0.96); }
  35% { transform: translate(180px, 90px) scale(1.08); }
  70% { transform: translate(280px, 190px) scale(1.14); }
  100% { transform: translate(120px, 260px) scale(1.03); }
}

@keyframes drift-bubble-2 {
  0% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(-150px, -90px) scale(0.95); }
  70% { transform: translate(-280px, -180px) scale(0.86); }
  100% { transform: translate(-150px, -260px) scale(0.93); }
}

@keyframes drift-bubble-3 {
  0% { transform: translate(0, 0) scale(0.95); }
  30% { transform: translate(-190px, 60px) scale(1.07); }
  65% { transform: translate(-100px, 210px) scale(1.15); }
  100% { transform: translate(-260px, 140px) scale(1.03); }
}

@keyframes drift-bubble-4 {
  0% { transform: translate(0, 0) scale(0.94); }
  45% { transform: translate(-150px, 170px) scale(1.1); }
  100% { transform: translate(130px, 260px) scale(1.02); }
}

@keyframes drift-bubble-5 {
  0% { transform: translate(0, 0) scale(0.96); }
  30% { transform: translate(160px, -120px) scale(1.06); }
  70% { transform: translate(-120px, -220px) scale(1.12); }
  100% { transform: translate(210px, 60px) scale(1); }
}

/* --- TU CARD BASE Y SHAKE --- */
.login-card {
  position: relative; z-index: 1; border-radius: 20px; padding: 28px 24px 24px;
  background: #ffffff; border: 1px solid #e5e7f0; box-shadow: 0 18px 45px rgba(15, 23, 42, 0.04);
  overflow: hidden; backdrop-filter: blur(4px); 
}

/* AnimaciÃƒÂ³n de Sacudida (Shake) */
.shake-animation { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); }
}

/* --- TU EFECTO DE BORDE AZUL (Glow) --- */
.login-card.glow-active::before { content: ""; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: conic-gradient(transparent, rgba(37, 99, 235, 0.3), #2563eb, transparent 40%); animation: rotate-border 4s linear infinite; z-index: -2; }
.login-card.glow-active::after { content: ""; position: absolute; inset: 3px; background: white; border-radius: 17px; z-index: -1; }
@keyframes rotate-border { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }


/* --- RESTO DE ESTILOS ORIGINALES --- */
.login-brand { display: block; width: min(100%, 320px); height: auto; margin: 0 auto; }
.login-brand { display: block; width: min(100%, 320px); height: auto; margin: 0 auto; }
.login-header h1 { font-weight: 600; color: #111827; } .form-label { font-size: 0.85rem; color: #4b5563; }
.input-icon-group { position: relative; } .input-icon-group .form-control { padding-left: 40px; }
.input-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #9ca3af; }
.form-control { background: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; font-size: 0.9rem; padding: 9px 12px; position: relative; z-index: 2; }
.form-control:focus { border-color: #2563eb; box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.18); outline: none; }
.password-toggle { border: none; background: transparent; color: #9ca3af; }
.btn-login.btn-primary { border-radius: 999px; font-weight: 600; background-color: #2563eb; border: none; box-shadow: 0 8px 22px rgba(37, 99, 235, 0.32); transition: all 0.3s ease; }
.btn-login.btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 14px 30px rgba(37, 99, 235, 0.45); }
.btn-login:disabled { opacity: 0.8; cursor: not-allowed; }
.alert-danger { border-radius: 12px; font-size: 0.85rem; }
</style>
