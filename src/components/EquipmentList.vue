<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>Equipment List ({{ items.length }})</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <div v-if="items.length === 0" class="empty">
        <p>No equipment found.</p>
      </div>

      <!-- 3 boxes per row -->
      <ion-grid v-else>
        <ion-row>
          <ion-col v-for="item in items" :key="item.id" size="4">
            <div class="equip-box">
              <div class="box-photo">
                <img v-if="item.photo" :src="item.photo" alt="equipment" />
                <ion-icon v-else :icon="cubeIcon" class="placeholder" />
              </div>
              <h3 class="box-name">{{ item.name }}</h3>
              <p class="box-meta">Qty: {{ item.quantity }}</p>
              <p class="box-meta">{{ item.location }}</p>
              <div class="box-badges">
                <ion-badge :color="conditionColor(item.condition)">
                  {{ item.condition }}
                </ion-badge>
                <ion-badge :color="item.available ? 'success' : 'medium'">
                  {{ item.available ? "Available" : "Unavailable" }}
                </ion-badge>
              </div>
              <div class="box-actions">
                <ion-button
                  size="small"
                  fill="clear"
                  @click="$emit('edit', item)"
                >
                  <ion-icon slot="icon-only" :icon="createIcon" />
                </ion-button>
                <ion-button
                  size="small"
                  fill="clear"
                  color="danger"
                  @click="$emit('delete', item)"
                >
                  <ion-icon slot="icon-only" :icon="trashIcon" />
                </ion-button>
              </div>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-card-content>
  </ion-card>
</template>
<script setup lang="ts">
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonBadge,
  IonButton,
  IonIcon,
} from "@ionic/vue";
import {
  create as createIcon,
  trash as trashIcon,
  cube as cubeIcon,
} from "ionicons/icons";
import type { Equipment } from "@/services/equipmentService";

defineProps<{ items: Equipment[] }>();
defineEmits<{
  (e: "edit", item: Equipment): void;
  (e: "delete", item: Equipment): void;
}>();

const conditionColor = (condition: Equipment["condition"]) => {
  switch (condition) {
    case "Good":
      return "success";
    case "Fair":
      return "warning";
    case "Damaged":
      return "danger";
    default:
      return "medium";
  }
};
</script>
<style scoped>
.empty {
  text-align: center;
  padding: 20px;
  color: #999;
}

ion-grid {
  --ion-grid-padding: 0;
  padding: 0;
}
ion-col {
  padding: 3px;
}

.equip-box {
  background: #262626;
  border: 1px solid var(--ion-color-primary);
  border-radius: 8px;
  padding: 5px;
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.box-photo {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 6px;
  overflow: hidden;
  background: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}
.box-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.placeholder {
  font-size: 22px;
  color: var(--ion-color-primary);
}

.box-name {
  font-size: 11px;
  font-weight: 600;
  margin: 1px 0;
  color: #fff;
  word-break: break-word;
  line-height: 1.2;
}
.box-meta {
  font-size: 9px;
  color: #bbb;
  margin: 0;
  line-height: 1.3;
}

.box-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  justify-content: center;
  margin: 4px 0 2px;
}
.box-badges ion-badge {
  font-size: 8px;
  padding: 3px 4px;
}

.box-actions {
  display: flex;
  justify-content: center;
  gap: 0;
  margin-top: auto;
}
.box-actions ion-button {
  --padding-start: 4px;
  --padding-end: 4px;
  height: 26px;
  font-size: 14px;
}
</style>
