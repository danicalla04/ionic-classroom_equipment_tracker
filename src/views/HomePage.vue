<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Classroom Equipment Tracker</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="toggleSearch">
            <ion-icon slot="icon-only" :icon="searchIcon" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>

      <!-- Search bar slides down smoothly when the search icon is tapped -->
      <transition name="slide-down">
        <ion-toolbar v-if="showSearch">
          <ion-searchbar
            v-model="searchQuery"
            placeholder="Search equipment..."
            :debounce="100"
            show-clear-button="focus"
          />
        </ion-toolbar>
      </transition>
    </ion-header>

    <ion-content class="ion-padding">
      <EquipmentForm
        :editing="editing"
        @save="handleSave"
        @cancel="editing = null"
      />
      <EquipmentList
        :items="filteredItems"
        @edit="editing = $event"
        @delete="handleDelete"
      />
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonSearchbar,
  alertController,
} from "@ionic/vue";
import { search as searchIcon } from "ionicons/icons";
import { ref, computed, onMounted, onUnmounted } from "vue";
import EquipmentForm from "@/components/EquipmentForm.vue";
import EquipmentList from "@/components/EquipmentList.vue";
import {
  addEquipment,
  updateEquipment,
  deleteEquipment,
  listenEquipment,
  type Equipment,
} from "@/services/equipmentService";

const items = ref<Equipment[]>([]);
const editing = ref<Equipment | null>(null);
const showSearch = ref(false);
const searchQuery = ref("");
let unsubscribe: (() => void) | null = null;

onMounted(() => {
  unsubscribe = listenEquipment((data) => {
    items.value = data;
  });
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});

const toggleSearch = () => {
  showSearch.value = !showSearch.value;
  if (!showSearch.value) searchQuery.value = "";
};

// Live filter by name or location.
const filteredItems = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return items.value;
  return items.value.filter(
    (item) =>
      item.name.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q)
  );
});

const handleSave = async (data: Equipment) => {
  if (data.id) {
    const { id, ...changes } = data;
    await updateEquipment(id, changes);
    editing.value = null;
  } else {
    await addEquipment(data);
  }
};

const handleDelete = async (item: Equipment) => {
  if (!item.id) return;
  const alert = await alertController.create({
    header: "Delete Equipment",
    message: `Are you sure you want to delete "${item.name}"?`,
    buttons: [
      { text: "Cancel", role: "cancel" },
      { text: "Delete", role: "destructive" },
    ],
  });
  await alert.present();
  const { role } = await alert.onDidDismiss();
  if (role !== "destructive") return;
  await deleteEquipment(item.id);
  if (editing.value?.id === item.id) editing.value = null;
};
</script>
<style scoped>
/* Smooth slide-down transition for the search bar */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: max-height 0.3s ease, opacity 0.3s ease, transform 0.3s ease;
  overflow: hidden;
}
.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-12px);
}
.slide-down-enter-to,
.slide-down-leave-from {
  max-height: 64px;
  opacity: 1;
  transform: translateY(0);
}
</style>
