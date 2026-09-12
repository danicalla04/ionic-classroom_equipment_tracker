<template>
  <div>
    <ion-button expand="block" fill="outline" @click="takePicture">
      <ion-icon slot="start" :icon="cameraIcon" /> {{ label }}
    </ion-button>
    <ion-text v-if="errorMessage" color="danger">
      <p>{{ errorMessage }}</p>
    </ion-text>
  </div>
</template>
<script setup lang="ts">
import { IonButton, IonIcon, IonText } from "@ionic/vue";
import { camera as cameraIcon } from "ionicons/icons";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { ref } from "vue";

withDefaults(defineProps<{ label?: string }>(), { label: "Add Photo" });

const errorMessage = ref("");
const emit = defineEmits<{ (event: "photoCaptured", photo: string): void }>();

const takePicture = async () => {
  errorMessage.value = "";
  try {
    // DataUrl returns a base64 string that can be stored directly in the database.
    const photo = await Camera.getPhoto({
      quality: 50,
      width: 600,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
    });
    if (photo.dataUrl) {
      emit("photoCaptured", photo.dataUrl);
    }
  } catch (error) {
    console.error(error);
    errorMessage.value = "Unable to capture photo.";
  }
};
</script>
