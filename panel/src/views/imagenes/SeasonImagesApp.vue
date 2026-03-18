<template>
  <div>
    <Sidebar />
    <div class="main-content">
      <TopNav />

      <div class="container-fluid mt-4">
        <div class="row">
          <div class="col">
            <h1 class="header-title mb-1">ImÃ¡genes por estaciÃ³n</h1>
            <p class="text-muted mb-0">Define las tres imÃ¡genes base (hombre, mujer, accesorios) para cada estaciÃ³n. Si no cargas una, se usa la imagen de stock.</p>
          </div>
        </div>

        <div class="card mt-4">
          <div class="card-header pb-0 border-0">
            <ul class="nav nav-tabs card-header-tabs">
              <li class="nav-item" v-for="est in estaciones" :key="est">
                <a class="nav-link" :class="{ active: activeTab === est }" href="#" @click.prevent="activeTab = est">
                  {{ labelEstacion(est) }}
                </a>
              </li>
            </ul>
          </div>

          <div class="card-body">
            <div class="row g-4">
              <div class="col-md-4" v-for="slot in ['men','women','acc']" :key="slot">
                <div class="form-group">
                  <label class="form-label mb-1">{{ labelSlot(slot) }}</label>
                  <small class="form-text text-muted">Fuente actual (sube una nueva para reemplazarla).</small>
                  <div class="form-control-plaintext px-2 py-1 border rounded bg-light">
                    <span v-if="form[activeTab][slot]">{{ resumenFuente(form[activeTab][slot]) }}</span>
                    <span v-else class="text-muted">Usando imagen base</span>
                  </div>
                  <div class="mt-2 d-flex align-items-center gap-2">
                    <label class="btn btn-sm btn-outline-primary mb-0">
                      <input type="file" accept="image/*" class="d-none" @change="(e) => onFileChange(e, slot)">
                      <span v-if="!uploading[slot]">Subir imagen</span>
                      <span v-else class="spinner-border spinner-border-sm"></span>
                    </label>
                    <button class="btn btn-sm btn-light" type="button" @click="form[activeTab][slot]=''; localPreview[slot]=''">
                      Limpiar
                    </button>
                  </div>
                  <div class="season-preview mt-3" :style="previewStyle(form[activeTab][slot], slot)">
                    <span class="preview-badge">{{ labelSlot(slot) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="d-flex gap-2 mt-4">
              <button class="btn btn-primary" @click="guardar" :disabled="saving">
                <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
                Guardar estaciÃ³n
              </button>
              <button class="btn btn-outline-primary" type="button" @click="usarStockBase" :disabled="saving">
                Usar imÃ¡genes base
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";
import TopNav from "@/components/TopNav.vue";
import axios from "axios";

export default {
  name: "SeasonImagesApp",
  components: { Sidebar, TopNav },
  data() {
    return {
      estaciones: ["primavera", "verano", "otono", "invierno"],
      activeTab: "verano",
      form: {
        primavera: { men: "", women: "", acc: "" },
        verano: { men: "", women: "", acc: "" },
        otono: { men: "", women: "", acc: "" },
        invierno: { men: "", women: "", acc: "" },
      },
      saving: false,
      uploading: { men: false, women: false, acc: false },
      localPreview: { men: "", women: "", acc: "" },
      baseStock: {
        men: "https://d19m59y37dris4.cloudfront.net/sell/2-0/img/photo/nordwood-themes-481980-unsplash-square.jpg",
        women: "https://d19m59y37dris4.cloudfront.net/sell/2-0/img/photo/malvestida-magazine-458585-unsplash.jpg",
        acc: "https://d19m59y37dris4.cloudfront.net/sell/2-0/img/photo/heather-schwartz-528936-unsplash.jpg",
      }
    };
  },
  methods: {
    labelEstacion(est) {
      return est === "otono" ? "OtoÃ±o" : est.charAt(0).toUpperCase() + est.slice(1);
    },
    labelSlot(slot) {
      if (slot === "men") return "Hombre";
      if (slot === "women") return "Mujer";
      return "Accesorios";
    },
    resumenFuente(val) {
      if (!val) return "";
      if (val.startsWith("http")) {
        try {
          const url = new URL(val);
          return url.hostname + url.pathname.slice(-20);
        } catch (e) {
          return val.slice(0, 30) + (val.length > 30 ? "..." : "");
        }
      }
      return "Archivo: " + val;
    },
    previewStyle(url, slot) {
      const fallback = this.baseStock[slot];
      const remote = this.form[this.activeTab][slot];
      const local = this.localPreview[slot];
      const src = local || remote ? (local || this.resolveUrl(remote)) : fallback;
      return {
        background: `center center / cover no-repeat url(${src})`,
      };
    },
    resolveUrl(val) {
      if (!val) return "";
      if (val.startsWith("http")) return val;
      return `${this.$url}/obtener_imagen_estacion/${val}`;
    },
    setFormFromMap(map) {
      if (!map) return;
      this.estaciones.forEach((est) => {
        this.form[est] = {
          men: map[est]?.men || "",
          women: map[est]?.women || "",
          acc: map[est]?.acc || "",
        };
      });
    },
    async loadData() {
      try {
        const res = await axios.get(this.$url + "/obtener_imagenes_estacion");
        if (res.data) this.setFormFromMap(res.data);
      } catch (e) {
        console.log(e);
      }
    },
    async guardar() {
      this.saving = true;
      try {
        const payload = { estacion: this.activeTab, ...this.form[this.activeTab] };
        const res = await axios.put(this.$url + "/actualizar_imagenes_estacion_admin", payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: this.$store.state.token,
          },
        });
        if (res.data && res.data.map) this.setFormFromMap(res.data.map);
        this.$notify({ group: "foo", title: "Ã‰XITO", text: "ImÃ¡genes guardadas", type: "success" });
        this.localPreview = { men: "", women: "", acc: "" };
      } catch (e) {
        console.log(e);
        this.$notify({ group: "foo", title: "ERROR", text: "No se pudo guardar", type: "error" });
      } finally {
        this.saving = false;
      }
    },
    async usarStockBase() {
      if (this.saving) return;
      this.form[this.activeTab] = { ...this.baseStock };
      this.localPreview = { men: "", women: "", acc: "" };
      await this.guardar();
    },
    async onFileChange(event, slot) {
      const file = event.target.files[0];
      if (!file) return;
      this.localPreview[slot] = URL.createObjectURL(file);
      await this.uploadSlot(file, slot);
    },
    async uploadSlot(file, slot) {
      this.uploading[slot] = true;
      try {
        const fm = new FormData();
        fm.append("estacion", this.activeTab);
        fm.append("slot", slot);
        fm.append("imagen", file);
        const res = await axios.post(this.$url + "/subir_imagen_estacion_admin", fm, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: this.$store.state.token,
          },
        });
        if (res.data && res.data.filename) {
          this.form[this.activeTab][slot] = res.data.filename;
          if (res.data.map) this.setFormFromMap(res.data.map);
          this.$notify({ group: "foo", title: "Ã‰XITO", text: "Imagen subida", type: "success" });
          this.localPreview[slot] = "";
        }
      } catch (e) {
        console.log(e);
        const msg = e?.response?.data?.message || "No se pudo subir la imagen";
        this.$notify({ group: "foo", title: "ERROR", text: msg, type: "error" });
      } finally {
        this.uploading[slot] = false;
      }
    },
  },
  mounted() {
    this.loadData();
  },
  watch: {
    activeTab() {
      // limpiar previews locales al cambiar de pestaÃ±a para evitar arrastres visuales
      this.localPreview = { men: "", women: "", acc: "" };
    }
  }
};
</script>

<style scoped>
.season-preview {
  position: relative;
  width: 100%;
  padding-top: 70%;
  border-radius: 12px;
  background: #f1f5f9;
  overflow: hidden;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
}
.season-preview .preview-badge {
  position: absolute;
  left: 12px;
  bottom: 12px;
  background: rgba(255, 255, 255, 0.8);
  color: #0f172a;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.8rem;
}
</style>
