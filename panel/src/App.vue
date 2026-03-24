<template>
  <div id="app">
    <notifications group="foo"/>
    <router-view/>

    <transition name="session-warning-fade">
      <div v-if="showInactivityWarning" class="session-warning-backdrop">
        <div class="session-warning-card">
          <div class="session-warning-icon-wrap">
            <div class="session-warning-icon">
              <i class="fe fe-clock"></i>
            </div>
          </div>
          <div class="session-warning-label">Sesion por inactividad</div>
          <h3 class="session-warning-title">Tu sesion se cerrara pronto</h3>
          <p class="session-warning-text">
            Seras redirigido al login si no detectamos actividad.
          </p>
          <div class="session-warning-counter">{{ countdown }}</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
const INACTIVITY_LIMIT_MS = 90 * 1000;
const WARNING_WINDOW_MS = 10 * 1000;
const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

export default {
  name: 'App',
  data() {
    return {
      inactivityTimer: null,
      warningTimer: null,
      countdownInterval: null,
      showInactivityWarning: false,
      countdown: 10,
      listenersBound: false,
      lastActivityTs: 0
    };
  },
  computed: {
    shouldTrackInactivity() {
      const hasProtectedRoute = this.$route.matched.some((item) => item.meta && item.meta.requiresAuth);
      const hasToken = !!this.$store.state.token;
      const hasUsuario = !!localStorage.getItem('usuario');
      return hasProtectedRoute && hasToken && hasUsuario;
    }
  },
  watch: {
    '$route.fullPath'() {
      this.syncInactivityTracking();
    },
    '$store.state.token'() {
      this.syncInactivityTracking();
    }
  },
  methods: {
    syncInactivityTracking() {
      if (this.shouldTrackInactivity) {
        this.bindActivityListeners();
        this.resetInactivityTimers();
        return;
      }

      this.unbindActivityListeners();
      this.clearInactivityTimers();
      this.showInactivityWarning = false;
    },
    bindActivityListeners() {
      if (this.listenersBound) return;
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.addEventListener(eventName, this.handleUserActivity, true);
      });
      this.listenersBound = true;
    },
    unbindActivityListeners() {
      if (!this.listenersBound) return;
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, this.handleUserActivity, true);
      });
      this.listenersBound = false;
    },
    clearInactivityTimers() {
      clearTimeout(this.warningTimer);
      clearTimeout(this.inactivityTimer);
      clearInterval(this.countdownInterval);
      this.warningTimer = null;
      this.inactivityTimer = null;
      this.countdownInterval = null;
    },
    handleUserActivity() {
      if (!this.shouldTrackInactivity) return;

      const now = Date.now();
      if (now - this.lastActivityTs < 300) return;
      this.lastActivityTs = now;
      this.resetInactivityTimers();
    },
    resetInactivityTimers() {
      this.clearInactivityTimers();
      this.showInactivityWarning = false;
      this.countdown = Math.ceil(WARNING_WINDOW_MS / 1000);

      this.warningTimer = setTimeout(() => {
        this.startWarningCountdown();
      }, INACTIVITY_LIMIT_MS - WARNING_WINDOW_MS);

      this.inactivityTimer = setTimeout(() => {
        this.forceLogoutByInactivity();
      }, INACTIVITY_LIMIT_MS);
    },
    startWarningCountdown() {
      this.showInactivityWarning = true;
      this.countdown = Math.ceil(WARNING_WINDOW_MS / 1000);
      clearInterval(this.countdownInterval);
      this.countdownInterval = setInterval(() => {
        if (this.countdown > 1) this.countdown -= 1;
        else clearInterval(this.countdownInterval);
      }, 1000);
    },
    forceLogoutByInactivity() {
      this.clearInactivityTimers();
      this.showInactivityWarning = false;
      this.$store.dispatch('logout');
      this.$notify({
        group: 'foo',
        title: 'Sesion finalizada',
        text: 'Tu sesion se cerro por inactividad.',
        type: 'warn'
      });
      if (this.$route.name !== 'login') {
        this.$router.replace({ name: 'login' });
      }
    }
  },
  mounted() {
    this.syncInactivityTracking();
  },
  beforeDestroy() {
    this.unbindActivityListeners();
    this.clearInactivityTimers();
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh !important;
}

a {
  color: #6e84a3 !important;
}

.modal-header .close {
  margin: 0 !important;
  padding: 0 !important;
  width: 2.25rem;
  height: 2.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d2ddec;
  border-radius: 0.75rem;
  background: #f9fbff;
  color: #6e84a3 !important;
  opacity: 1 !important;
  box-shadow: none !important;
  transition: all 0.2s ease;
}

.modal-header .close:hover,
.modal-header .close:focus,
.modal-header .close:active {
  background: #e63757;
  border-color: #e63757;
  color: #fff !important;
  opacity: 1 !important;
}

.modal-header .close span {
  font-size: 1.15rem;
  line-height: 1;
  font-weight: 500;
}

.session-warning-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(18, 38, 63, 0.42);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.session-warning-card {
  width: 100%;
  max-width: 420px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
  border-radius: 1.25rem;
  box-shadow: 0 1.5rem 3rem rgba(18, 38, 63, 0.22);
  border: 1px solid #e6ebf1;
  padding: 1.6rem 1.7rem 1.75rem;
  text-align: center;
  transform-origin: center;
  animation: session-warning-pop 0.22s ease-out;
}

.session-warning-icon-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 0.9rem;
}

.session-warning-icon {
  width: 4rem;
  height: 4rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e63757 0%, #ffb648 100%);
  color: #fff;
  font-size: 1.55rem;
  box-shadow: 0 0.75rem 1.5rem rgba(230, 55, 87, 0.28);
  animation: session-warning-pulse 1.4s ease-in-out infinite;
}

.session-warning-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #95aac9;
  margin-bottom: 0.5rem;
}

.session-warning-title {
  font-size: 1.35rem;
  margin-bottom: 0.65rem;
  color: #12263f;
}

.session-warning-text {
  margin: 0;
  color: #6e84a3;
  line-height: 1.6;
}

.session-warning-counter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 4.5rem;
  height: 4.5rem;
  margin-top: 1.15rem;
  border-radius: 999px;
  background: #f9fbff;
  border: 1px solid #dfe8f4;
  color: #12263f;
  font-size: 1.7rem;
  font-weight: 700;
  letter-spacing: -0.03em;
}

.session-warning-fade-enter-active,
.session-warning-fade-leave-active {
  transition: opacity 0.18s ease;
}

.session-warning-fade-enter,
.session-warning-fade-leave-to {
  opacity: 0;
}

@keyframes session-warning-pop {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes session-warning-pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0.75rem 1.5rem rgba(230, 55, 87, 0.28);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 1rem 1.8rem rgba(230, 55, 87, 0.35);
  }
}
</style>
