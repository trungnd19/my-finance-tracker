<template>
  <div
    class="grid grid-cols-3 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100"
  >
    <div class="flex justify-between items-center space-x-4 col-span-2">
      <div class="flex items-center space-x-1">
        <UIcon :name="icon" :class="[iconColor]"></UIcon>
        <div>{{ transaction?.description }}</div>
      </div>

      <div>
        <UBadge color="white" v-if="transaction?.category">{{
          transaction?.category
        }}</UBadge>
      </div>
    </div>

    <div class="flex items-center justify-end space-x-2">
      <div>{{ currency }}</div>
      <div>
        <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
          <UButton
            color="white"
            variant="ghost"
            trailing-icon="i-heroicons-ellipsis-horizontal"
            :loading="isLoading"
          ></UButton>
        </UDropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  transaction: Object,
});

const emits = defineEmits(["deleted"]);

const { currency } = useCurrency(props?.transaction?.amount);

const icon = computed(() => {
  if (props.transaction?.type === "Income") {
    return "i-heroicons-arrow-up-right";
  }
  return "i-heroicons-arrow-down-left";
});

const iconColor = computed(() => {
  if (props.transaction?.type === "Income") {
    return "text-green-600";
  }
  return "text-red-600";
});

const items = [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => console.log("edit"),
    },
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: deleteTransaction,
    },
  ],
];

const isLoading = ref(false);

const supabse = useSupabaseClient();

const toast = useToast();

async function deleteTransaction() {
  isLoading.value = true;
  try {
    await supabse.from("transactions").delete().eq("id", props.transaction?.id);
    toast.add({
      title: "Transaction deleted",
      icon: "i-heroicons-checked-circle",
      color: "green",
    });
    emits("deleted", props.transaction?.id);
  } catch (err) {
    toast.add({
      title: "Transaction deleted error!",
      icon: "i-heroicons-exclamation-circle",
      color: "red",
    });
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped></style>
