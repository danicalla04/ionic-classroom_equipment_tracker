<template>
  <ion-card class="form-card">
    <div class="form-header">
      <ion-icon :icon="isEditing ? createIcon : addCircleIcon" />
      <span>{{ isEditing ? "Edit Equipment" : "Add Equipment" }}</span>
    </div>

    <ion-card-content>
      <ion-item class="field" lines="none">
        <ion-icon :icon="cubeIcon" slot="start" color="primary" />
        <ion-input
          label="Name"
          label-placement="stacked"
          v-model="form.name"
          placeholder="e.g. Projector"
        />
      </ion-item>

      <ion-item class="field" lines="none">
        <ion-icon :icon="layersIcon" slot="start" color="primary" />
        <ion-input
          type="number"
          label="Quantity"
          label-placement="stacked"
          v-model.number="form.quantity"
          min="0"
        />
      </ion-item>

      <ion-item class="field" lines="none">
        <ion-icon :icon="locationIcon" slot="start" color="primary" />
        <ion-input
          label="Room / Location"
          label-placement="stacked"
          v-model="form.location"
          placeholder="e.g. Room 101"
        />
      </ion-item>

      <ion-item class="field" lines="none">
        <ion-icon :icon="constructIcon" slot="start" color="primary" />
        <ion-select
          label="Condition"
          label-placement="stacked"
          v-model="form.condition"
          interface="popover"
        >
          <ion-select-option value="Good">Good</ion-select-option>
          <ion-select-option value="Fair">Fair</ion-select-option>
          <ion-select-option value="Damaged">Damaged</ion-select-option>
        </ion-select>
      </ion-item>

      <ion-item class="field" lines="none">
        <ion-icon :icon="checkmarkIcon" slot="start" color="primary" />
        <ion-toggle v-model="form.available">Available</ion-toggle>
      </ion-item>

      <div class="photo-row">
        <ion-img v-if="form.photo" :src="form.photo" class="preview" />
        <CameraComponent
          :label="form.photo ? 'Change Photo' : 'Add Photo'"
          @photo-captured="onPhoto"
        />
      </div>

      <ion-button
        class="save-btn"
        expand="block"
        :disabled="!form.name"
        @click="save"
      >
        <ion-icon slot="start" :icon="isEditing ? saveIcon : addCircleIcon" />
        {{ isEditing ? "Update Equipment" : "Add Equipment" }}
      </ion-button>
      <ion-button
        v-if="isEditing"
        expand="block"
        fill="clear"
        color="medium"
        @click="$emit('cancel')"
      >
        Cancel
      </ion-button>
    </ion-card-content>
  </ion-card>
</template>
<script setup lang="ts">
import {
  IonCard,
  IonCardContent,
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonToggle,
  IonButton,
  IonImg,
  IonIcon,
} from "@ionic/vue";
import {
  cube as cubeIcon,
  layers as layersIcon,
  location as locationIcon,
  construct as constructIcon,
  checkmarkCircle as checkmarkIcon,
  addCircle as addCircleIcon,
  create as createIcon,
  save as saveIcon,
} from "ionicons/icons";
import { reactive, computed, watch } from "vue";
import CameraComponent from "@/components/CameraComponent.vue";
import type { Equipment } from "@/services/equipmentService";

const props = defineProps<{ editing: Equipment | null }>();
const emit = defineEmits<{
  (e: "save", data: Equipment): void;
  (e: "cancel"): void;
}>();

const blank = (): Equipment => ({
  name: "",
  quantity: 1,
  location: "",
  condition: "Good",
  available: true,
  photo: "",
});

const form = reactive<Equipment>(blank());
const isEditing = computed(() => !!props.editing);

watch(
  () => props.editing,
  (val) => {
    if (val) {
      Object.assign(form, val);
    } else {
      Object.assign(form, blank());
    }
  },
  { immediate: true }
);

const onPhoto = (photo: string) => {
  form.photo = photo;
};

const save = () => {
  emit("save", { ...form });
  if (!isEditing.value) {
    Object.assign(form, blank());
  }
};
</script>
<style scoped>
.form-card {
  border: 1px solid var(--ion-color-primary);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(255, 122, 0, 0.15);
}

/* Orange gradient header */
.form-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  font-size: 18px;
  font-weight: 700;
  color: #000;
  background: linear-gradient(135deg, #ff8719 0%, #ff7a00 60%, #e06b00 100%);
}
.form-header ion-icon {
  font-size: 22px;
}

/* Each input row as a rounded dark tile */
.field {
  --background: #1a1a1a;
  --border-radius: 10px;
  --padding-start: 12px;
  --inner-padding-end: 12px;
  margin-bottom: 10px;
  border-radius: 10px;
  border: 1px solid #2c2c2c;
}
.field ion-icon[slot="start"] {
  margin-right: 12px;
  font-size: 20px;
}

.photo-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 14px 0;
}
.preview {
  width: 100%;
  max-height: 200px;
  border-radius: 10px;
  border: 1px solid var(--ion-color-primary);
}
.preview::part(image) {
  object-fit: cover;
}

.save-btn {
  --border-radius: 10px;
  font-weight: 600;
  margin-top: 6px;
}
</style>
